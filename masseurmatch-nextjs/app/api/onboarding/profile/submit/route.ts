import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { canSubmitForReview } from '@/lib/onboarding/stateMachine';

/**
 * POST /api/onboarding/profile/submit
 *
 * Submit profile for admin review
 */
export async function POST() {
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
      .select('id, identity_status, role')
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

    // Check if already submitted
    if (profile.admin_status === 'pending_admin') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'ALREADY_SUBMITTED',
            message: 'Profile is already under review',
          },
        },
        { status: 400 }
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

    // Get counts
    const { count: approvedPhotos } = await supabase
      .from('media_assets')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profile.id)
      .eq('status', 'approved');

    const { count: languages } = await supabase
      .from('profile_languages')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profile.id);

    const { count: services } = await supabase
      .from('profile_services')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profile.id);

    const { count: setups } = await supabase
      .from('profile_setups')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profile.id);

    const { count: incallRates } = await supabase
      .from('profile_rates')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profile.id)
      .eq('context', 'incall')
      .eq('is_active', true);

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

    // Validate submission requirements
    const validation = await canSubmitForReview(
      profile as any,
      user as any,
      subscription as any,
      counts
    );

    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'PROFILE_INCOMPLETE',
            message: 'Profile does not meet submission requirements',
            details: {
              missing: validation.missing,
            },
          },
        },
        { status: 400 }
      );
    }

    // Update profile
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({
        admin_status: 'pending_admin',
        onboarding_stage: 'waiting_admin',
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error submitting profile:', updateError);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to submit profile',
            details: updateError.message,
          },
        },
        { status: 500 }
      );
    }

    // TODO: Send notification to admin
    // TODO: Send confirmation email to user

    return NextResponse.json({
      success: true,
      data: {
        submittedAt: updatedProfile.submitted_at,
        nextStage: 'waiting_admin',
        estimatedReviewTime: '24-48 hours',
        profile: {
          id: updatedProfile.id,
          admin_status: updatedProfile.admin_status,
          onboarding_stage: updatedProfile.onboarding_stage,
        },
      },
    });
  } catch (error: any) {
    console.error('Error submitting profile:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to submit profile',
          details: error.message,
        },
      },
      { status: 500 }
    );
  }
}
