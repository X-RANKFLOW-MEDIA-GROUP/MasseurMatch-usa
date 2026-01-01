import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/src/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// Use service role for webhook (not user context)
const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

export async function POST(req: NextRequest) {
  if (!stripe || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Not configured" },
      { status: 500 }
    );
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const plan = session.metadata?.plan;

        if (userId && plan) {
          await supabaseAdmin
            .from("profiles")
            .update({
              subscription_plan: plan,
              subscription_status: "active",
              subscription_id: session.subscription as string,
            })
            .eq("user_id", userId);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (profile) {
          await supabaseAdmin
            .from("profiles")
            .update({
              subscription_status: subscription.status,
            })
            .eq("user_id", profile.user_id);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (profile) {
          await supabaseAdmin
            .from("profiles")
            .update({
              subscription_plan: "free",
              subscription_status: "canceled",
              subscription_id: null,
            })
            .eq("user_id", profile.user_id);
        }
        break;
      }

      case "identity.verification_session.verified": {
        const verificationSession = event.data.object as Stripe.Identity.VerificationSession;
        const userId = verificationSession.metadata?.user_id;

        if (userId) {
          await supabaseAdmin
            .from("profiles")
            .update({
              identity_verified: true,
              identity_verified_at: new Date().toISOString(),
            })
            .eq("user_id", userId);
        }
        break;
      }

      case "identity.verification_session.requires_input": {
        const verificationSession = event.data.object as Stripe.Identity.VerificationSession;
        const userId = verificationSession.metadata?.user_id;

        if (userId) {
          await supabaseAdmin
            .from("profiles")
            .update({
              identity_verification_status: "requires_input",
            })
            .eq("user_id", userId);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
