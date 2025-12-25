import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  calculateOnboardingStage,
  canSubmitForReview,
  getOnboardingProgress,
  getStageMessage,
} from '@/lib/onboarding/stateMachine';

/**
 * GET /api/onboarding/status
 *
 * Returns current onboarding status, requirements, and next steps
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        },
        { status: 401 }
      );
    }

    // Get user with identity status
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, identity_status, role, stripe_customer_id')
      .eq('id', authUser.id)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'User not found',
          },
        },
        { status: 404 }
      );
    }

    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', authUser.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Profile not found',
          },
        },
        { status: 404 }
      );
    }

    // Get subscription (if any)
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', authUser.id)
      .in('status', ['trialing', 'active'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Count approved photos
    const { count: approvedPhotos } = await supabase
      .from('media_assets')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profile.id)
      .eq('status', 'approved');

    // Count languages
    const { count: languages } = await supabase
      .from('profile_languages')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profile.id);

    // Count services
    const { count: services } = await supabase
      .from('profile_services')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profile.id);

    // Count setups
    const { count: setups } = await supabase
      .from('profile_setups')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profile.id);

    // Count incall rates
    const { count: incallRates } = await supabase
      .from('profile_rates')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profile.id)
      .eq('context', 'incall')
      .eq('is_active', true);

    // Count outcall rates
    const { count: outcallRates } = await supabase
      .from('profile_rates')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profile.id)
      .eq('context', 'outcall')
      .eq('is_active', true);

    const counts = {
      approvedPhotos: approvedPhotos || 0,
      languages: languages || 0,
      services: services || 0,
      setups: setups || 0,
      incallRates: incallRates || 0,
      outcallRates: outcallRates || 0,
    };

    // Calculate onboarding stage
    const stage = calculateOnboardingStage(
      profile as any,
      user as any,
      subscription as any,
      counts
    );

    // Check if can submit for review
    const validation = await canSubmitForReview(
      profile as any,
      user as any,
      subscription as any,
      counts
    );

    const progressDetails = getOnboardingProgress(stage, user as any, subscription as any);
    const message = getStageMessage(stage);

    return NextResponse.json({
      success: true,
      data: {
        stage,
        progress: progressDetails.percentComplete,
        progress_details: progressDetails,
        next_action: message,
        stage_message: message,
        blockers: validation.missing,
        canSubmit: validation.valid,
        counts,
        profile: {
          id: profile.id,
          auto_moderation: profile.auto_moderation,
          admin_status: profile.admin_status,
          publication_status: profile.publication_status,
          display_name: profile.display_name,
          city_slug: profile.city_slug,
          incall_enabled: profile.incall_enabled,
          outcall_enabled: profile.outcall_enabled,
          submitted_at: profile.submitted_at,
          approved_at: profile.approved_at,
          admin_notes: profile.admin_notes,
        },
        user: {
          id: user.id,
          identity_status: user.identity_status,
          role: user.role,
        },
        subscription: subscription
          ? {
              id: subscription.id,
              plan: subscription.plan,
              status: subscription.status,
              trial_end: subscription.trial_end,
              current_period_end: subscription.current_period_end,
            }
          : null,
      },
    });
  } catch (error: any) {
    console.error('Error fetching onboarding status:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch onboarding status',
          details: error.message,
        },
      },
      { status: 500 }
    );
  }
}
