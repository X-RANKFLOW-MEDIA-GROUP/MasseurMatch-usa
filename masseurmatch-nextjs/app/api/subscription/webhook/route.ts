import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent, stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { supabaseAdmin } from "@/server/supabaseAdmin";

const WEBHOOK_SECRET =
  process.env.STRIPE_SUBSCRIPTION_WEBHOOK_SECRET ?? process.env.STRIPE_WEBHOOK_SECRET;

if (!WEBHOOK_SECRET) {
  console.warn("Stripe subscription webhook secret is not configured.");
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    if (!WEBHOOK_SECRET) {
      throw new Error("Webhook secret is missing");
    }
    event = constructWebhookEvent(payload, signature, WEBHOOK_SECRET);
  } catch (error) {
    console.error("Invalid webhook signature", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSession(event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpsert(event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeletion(event.data.object as Stripe.Subscription);
        break;
      default:
        console.log(`Unhandled subscription webhook event: ${event.type}`);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Subscription webhook handler failed:", error);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }
}

async function handleCheckoutSession(session: Stripe.Checkout.Session) {
  if (!session.subscription || !session.customer) {
    console.warn("Checkout session missing subscription/customer", session.id);
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(session.subscription.toString());
  await handleSubscriptionUpsert(subscription);
}

function mapStripeStatus(status: Stripe.Subscription.Status) {
  switch (status) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "past_due":
      return "past_due";
    case "canceled":
    case "unpaid":
      return "canceled";
    case "incomplete":
    case "incomplete_expired":
      return "past_due";
    default:
      return "past_due";
  }
}

function toIso(timestamp?: number | null) {
  return timestamp ? new Date(timestamp * 1000).toISOString() : null;
}

async function handleSubscriptionUpsert(subscription: Stripe.Subscription) {
  const userId = await resolveUserIdFromSubscription(subscription);
  if (!userId) {
    console.warn("Skipping subscription upsert because user_id could not be resolved");
    return;
  }

  const plan = subscription.metadata?.plan ?? subscription.items.data[0]?.price?.nickname ?? "standard";
  const status = mapStripeStatus(subscription.status);

  // @ts-ignore - Stripe types are incomplete for these properties
  const currentPeriodStart = subscription.current_period_start;
  // @ts-ignore - Stripe types are incomplete for these properties
  const currentPeriodEnd = subscription.current_period_end;

  const payload = {
    user_id: userId,
    stripe_subscription_id: subscription.id,
    plan,
    status,
    stripe_customer_id: subscription.customer as string,
    trial_start: toIso(subscription.trial_start),
    trial_end: toIso(subscription.trial_end),
    current_period_start: toIso(currentPeriodStart),
    current_period_end: toIso(currentPeriodEnd),
  };

  const { error } = await supabaseAdmin
    .from("subscriptions")
    .upsert(payload, { onConflict: "stripe_subscription_id" });

  if (error) {
    console.error("Failed to upsert subscription record:", error);
  }
}

async function resolveUserIdFromSubscription(subscription: Stripe.Subscription) {
  if (subscription.metadata?.user_id) {
    return subscription.metadata.user_id;
  }

  if (!subscription.customer) {
    return null;
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("user_id")
    .eq("stripe_customer_id", subscription.customer as string)
    .maybeSingle();

  return profile?.user_id ?? null;
}

async function handleSubscriptionDeletion(subscription: Stripe.Subscription) {
  const { error } = await supabaseAdmin
    .from("subscriptions")
    .update({ status: "canceled" })
    .eq("stripe_subscription_id", subscription.id);

  if (error) {
    console.error("Failed to mark subscription canceled:", error);
  }
}
