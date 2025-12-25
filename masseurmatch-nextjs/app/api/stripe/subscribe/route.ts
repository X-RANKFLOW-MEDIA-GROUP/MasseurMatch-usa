import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createSubscription, STRIPE_PRICE_IDS } from '@/lib/stripe';

interface SubscribeRequest {
  plan: 'standard' | 'pro' | 'elite';
  payment_method_id?: string;
}

/**
 * POST /api/stripe/subscribe
 * Create a subscription for the user
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

    // Parse request body
    const body: SubscribeRequest = await request.json();
    const { plan, payment_method_id } = body;

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan is required' },
        { status: 400 }
      );
    }

    if (!['standard', 'pro', 'elite'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be: standard, pro, or elite' },
        { status: 400 }
      );
    }

    // Get Stripe customer ID
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile.stripe_customer_id) {
      return NextResponse.json(
        { error: 'Stripe customer not found. Please create a customer first.' },
        { status: 404 }
      );
    }

    // Check for existing active subscription
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['active', 'trialing'])
      .single();

    if (existingSubscription) {
      return NextResponse.json(
        {
          error: 'User already has an active subscription',
          subscription_id: existingSubscription.id,
        },
        { status: 400 }
      );
    }

    // Get price ID for the plan
    const priceId = STRIPE_PRICE_IDS[plan];
    if (!priceId) {
      return NextResponse.json(
        { error: `Price ID not configured for plan: ${plan}` },
        { status: 500 }
      );
    }

    // Determine if plan includes trial
    const trialDays = ['pro', 'elite'].includes(plan) ? 7 : undefined;

    // Create Stripe subscription
    const stripeSubscription = await createSubscription({
      customerId: profile.stripe_customer_id,
      priceId,
      paymentMethodId: payment_method_id,
      trialDays,
      metadata: {
        user_id: user.id,
        plan,
      },
    });

    // Determine subscription status
    let subscriptionStatus: 'active' | 'trialing' | 'incomplete' = 'incomplete';
    if (stripeSubscription.status === 'trialing') {
      subscriptionStatus = 'trialing';
    } else if (stripeSubscription.status === 'active') {
      subscriptionStatus = 'active';
    }

    // Create subscription record in database
    const { data: subscription, error: insertError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        plan,
        status: subscriptionStatus,
        stripe_subscription_id: stripeSubscription.id,
        stripe_customer_id: profile.stripe_customer_id,
        trial_end: stripeSubscription.trial_end
          ? new Date(stripeSubscription.trial_end * 1000).toISOString()
          : null,
        current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to create subscription record:', insertError);
      return NextResponse.json(
        { error: 'Failed to save subscription' },
        { status: 500 }
      );
    }

    // Get client secret for payment if needed
    let clientSecret: string | null = null;
    if (stripeSubscription.status === 'incomplete' && stripeSubscription.latest_invoice) {
      const latestInvoice = stripeSubscription.latest_invoice as any;
      if (latestInvoice.payment_intent) {
        clientSecret = latestInvoice.payment_intent.client_secret;
      }
    }

    return NextResponse.json({
      success: true,
      subscription,
      stripe_subscription_id: stripeSubscription.id,
      status: subscriptionStatus,
      client_secret: clientSecret,
      trial_end: stripeSubscription.trial_end,
      message: subscriptionStatus === 'trialing'
        ? `${plan} subscription created with 7-day trial`
        : subscriptionStatus === 'active'
        ? `${plan} subscription activated`
        : 'Subscription created - payment required',
    });
  } catch (error) {
    console.error('Subscription creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}
