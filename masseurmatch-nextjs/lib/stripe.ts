/**
 * Stripe Integration for MasseurMatch
 *
 * This module handles all Stripe operations:
 * - Customer creation
 * - Payment method setup
 * - Subscription management (with trials)
 * - Identity verification
 */

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
});

/**
 * Stripe Price IDs for subscription plans
 * These should be created in Stripe Dashboard and set in environment variables
 */
export const STRIPE_PRICE_IDS = {
  standard: process.env.STRIPE_PRICE_STANDARD || '',
  pro: process.env.STRIPE_PRICE_PRO || '',
  elite: process.env.STRIPE_PRICE_ELITE || '',
};

export type SubscriptionPlan = keyof typeof STRIPE_PRICE_IDS;

const DEFAULT_TRIAL_DAYS = 7;

export interface CreateCheckoutSessionParams {
  customerId: string;
  plan: SubscriptionPlan;
  successUrl: string;
  cancelUrl: string;
  trialDays?: number;
  metadata?: Record<string, string>;
}

export async function createCheckoutSession(params: CreateCheckoutSessionParams) {
  const priceId = STRIPE_PRICE_IDS[params.plan];

  if (!priceId) {
    throw new Error(`Price ID is not configured for the ${params.plan} plan`);
  }

  return stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: params.customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    subscription_data: {
      trial_period_days: params.trialDays ?? DEFAULT_TRIAL_DAYS,
      metadata: {
        plan: params.plan,
        ...(params.metadata ?? {}),
      },
    },
    metadata: params.metadata,
  });
}

/**
 * Create a Stripe customer for a user
 */
export async function createCustomer(params: {
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Customer> {
  return stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: params.metadata || {},
  });
}

/**
 * Create a setup intent for collecting payment method
 */
export async function createSetupIntent(customerId: string): Promise<Stripe.SetupIntent> {
  return stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ['card'],
    usage: 'off_session',
  });
}

/**
 * Create a subscription with optional trial
 */
export async function createSubscription(params: {
  customerId: string;
  priceId: string;
  paymentMethodId?: string;
  trialDays?: number;
  metadata?: Record<string, string>;
}): Promise<Stripe.Subscription> {
  const subscriptionParams: Stripe.SubscriptionCreateParams = {
    customer: params.customerId,
    items: [{ price: params.priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: {
      payment_method_types: ['card'],
      save_default_payment_method: 'on_subscription',
    },
    expand: ['latest_invoice.payment_intent'],
    metadata: params.metadata || {},
  };

  // Add payment method if provided
  if (params.paymentMethodId) {
    subscriptionParams.default_payment_method = params.paymentMethodId;
  }

  // Add trial if specified
  if (params.trialDays) {
    subscriptionParams.trial_period_days = params.trialDays;
  }

  return stripe.subscriptions.create(subscriptionParams);
}

/**
 * Get subscription by ID
 */
export async function getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method', 'latest_invoice'],
  });
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(
  subscriptionId: string,
  cancelAtPeriodEnd: boolean = true
): Promise<Stripe.Subscription> {
  if (cancelAtPeriodEnd) {
    return stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  } else {
    return stripe.subscriptions.cancel(subscriptionId);
  }
}

/**
 * Update subscription plan
 */
export async function updateSubscriptionPlan(
  subscriptionId: string,
  newPriceId: string
): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  return stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
    proration_behavior: 'create_prorations',
  });
}

/**
 * Create a Stripe Identity verification session
 */
export async function createIdentityVerificationSession(params: {
  userId: string;
  email: string;
  returnUrl?: string;
}): Promise<Stripe.Identity.VerificationSession> {
  return stripe.identity.verificationSessions.create({
    type: 'document',
    metadata: {
      user_id: params.userId,
    },
    options: {
      document: {
        require_id_number: false,
        require_live_capture: true,
        require_matching_selfie: true,
      },
    },
    return_url: params.returnUrl,
  });
}

/**
 * Get identity verification session status
 */
export async function getIdentityVerificationSession(
  sessionId: string
): Promise<Stripe.Identity.VerificationSession> {
  return stripe.identity.verificationSessions.retrieve(sessionId);
}

/**
 * Attach payment method to customer
 */
export async function attachPaymentMethod(
  paymentMethodId: string,
  customerId: string
): Promise<Stripe.PaymentMethod> {
  return stripe.paymentMethods.attach(paymentMethodId, {
    customer: customerId,
  });
}

/**
 * Set default payment method for customer
 */
export async function setDefaultPaymentMethod(
  customerId: string,
  paymentMethodId: string
): Promise<Stripe.Customer> {
  return stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });
}

/**
 * List customer's payment methods
 */
export async function listPaymentMethods(
  customerId: string
): Promise<Stripe.PaymentMethod[]> {
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerId,
    type: 'card',
  });

  return paymentMethods.data;
}

/**
 * Detach (remove) a payment method
 */
export async function detachPaymentMethod(
  paymentMethodId: string
): Promise<Stripe.PaymentMethod> {
  return stripe.paymentMethods.detach(paymentMethodId);
}

/**
 * Construct webhook event from raw body and signature
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}
