import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { constructWebhookEvent } from '@/lib/stripe';
import Stripe from 'stripe';

// Create Supabase client with service role for webhook operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/stripe/webhook
 * Handle Stripe webhook events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = constructWebhookEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle different event types
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'identity.verification_session.verified': {
        const session = event.data.object as Stripe.Identity.VerificationSession;
        await handleIdentityVerified(session);
        break;
      }

      case 'identity.verification_session.requires_input': {
        const session = event.data.object as Stripe.Identity.VerificationSession;
        await handleIdentityRequiresInput(session);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Payment succeeded for invoice:', invoice.id);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle subscription creation/update
 */
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.user_id;
  if (!userId) {
    console.error('No user_id in subscription metadata');
    return;
  }

  const status = mapStripeStatus(subscription.status);

  // Update or create subscription record
  // @ts-ignore - Stripe types are incomplete for these properties
  const currentPeriodStart = subscription.current_period_start;
  // @ts-ignore - Stripe types are incomplete for these properties
  const currentPeriodEnd = subscription.current_period_end;
  // @ts-ignore - Stripe types are incomplete for these properties
  const cancelAtPeriodEnd = subscription.cancel_at_period_end;

  const { error } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer as string,
      plan: subscription.metadata.plan,
      status,
      trial_end: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
      current_period_start: new Date((currentPeriodStart as number) * 1000).toISOString(),
      current_period_end: new Date((currentPeriodEnd as number) * 1000).toISOString(),
      cancel_at_period_end: cancelAtPeriodEnd,
    }, {
      onConflict: 'stripe_subscription_id',
    });

  if (error) {
    console.error('Failed to update subscription:', error);
  }
}

/**
 * Handle subscription deletion/cancellation
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'canceled' })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Failed to mark subscription as canceled:', error);
  }
}

/**
 * Handle identity verification success
 */
async function handleIdentityVerified(session: Stripe.Identity.VerificationSession) {
  const userId = session.metadata?.user_id;
  if (!userId) {
    console.error('No user_id in verification session metadata');
    return;
  }

  const { error } = await supabase
    .from('users')
    .update({
      identity_status: 'verified',
      identity_verified_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('Failed to update identity status:', error);
  }
}

/**
 * Handle identity verification failure/requires input
 */
async function handleIdentityRequiresInput(session: Stripe.Identity.VerificationSession) {
  const userId = session.metadata?.user_id;
  if (!userId) {
    console.error('No user_id in verification session metadata');
    return;
  }

  const { error } = await supabase
    .from('users')
    .update({
      identity_status: 'failed',
    })
    .eq('id', userId);

  if (error) {
    console.error('Failed to update identity status:', error);
  }
}

/**
 * Handle payment failure
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // @ts-ignore - Stripe types are incomplete for subscription property
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) {
    return;
  }

  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'past_due' })
    .eq('stripe_subscription_id', subscriptionId as string);

  if (error) {
    console.error('Failed to update subscription status to past_due:', error);
  }
}

/**
 * Map Stripe subscription status to our internal status
 */
function mapStripeStatus(stripeStatus: Stripe.Subscription.Status): string {
  switch (stripeStatus) {
    case 'active':
      return 'active';
    case 'trialing':
      return 'trialing';
    case 'past_due':
      return 'past_due';
    case 'canceled':
    case 'unpaid':
      return 'canceled';
    case 'incomplete':
    case 'incomplete_expired':
      return 'incomplete';
    default:
      return 'unknown';
  }
}
