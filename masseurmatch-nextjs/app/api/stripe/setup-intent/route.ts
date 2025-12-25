import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createSetupIntent } from '@/lib/stripe';

/**
 * POST /api/stripe/setup-intent
 * Create a setup intent for collecting payment method
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get Stripe customer ID
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile.stripe_customer_id) {
      return NextResponse.json(
        { error: 'Stripe customer not found. Please create a customer first.' },
        { status: 404 }
      );
    }

    // Create setup intent
    const setupIntent = await createSetupIntent(profile.stripe_customer_id);

    return NextResponse.json({
      success: true,
      client_secret: setupIntent.client_secret,
      setup_intent_id: setupIntent.id,
    });
  } catch (error) {
    console.error('Setup intent creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create setup intent' },
      { status: 500 }
    );
  }
}
