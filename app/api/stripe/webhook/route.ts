import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/src/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { NotificationService } from "@/src/lib/notifications";
import { sendNotificationEmail } from "@/src/lib/email";

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

      // Handle invoice payment failed
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("user_id, email, display_name, subscription_plan")
          .eq("stripe_customer_id", customerId)
          .single();

        if (profile) {
          const amount = invoice.amount_due
            ? `$${(invoice.amount_due / 100).toFixed(2)}`
            : "$0.00";

          // Create notification
          const notificationService = new NotificationService(supabaseAdmin);
          await notificationService.notifyPaymentFailed(profile.user_id, amount);

          // Send email
          await sendNotificationEmail("paymentFailed", profile.email, {
            name: profile.display_name || "there",
            amount,
          });

          // Update subscription status
          await supabaseAdmin
            .from("profiles")
            .update({
              subscription_status: "past_due",
              payment_failed_at: new Date().toISOString(),
            })
            .eq("user_id", profile.user_id);
        }
        break;
      }

      // Handle invoice paid (subscription renewed)
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Only for subscription renewals, not first payment
        if (invoice.billing_reason === "subscription_cycle") {
          const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("user_id, email, display_name, subscription_plan")
            .eq("stripe_customer_id", customerId)
            .single();

          if (profile) {
            const amount = invoice.amount_paid
              ? `$${(invoice.amount_paid / 100).toFixed(2)}`
              : "$0.00";

            const planName = profile.subscription_plan?.charAt(0).toUpperCase() +
              profile.subscription_plan?.slice(1) || "Standard";

            // Create notification
            const notificationService = new NotificationService(supabaseAdmin);
            await notificationService.notifySubscriptionRenewed(profile.user_id, planName, amount);

            // Send email
            await sendNotificationEmail("subscriptionRenewed", profile.email, {
              name: profile.display_name || "there",
              plan: planName,
              amount,
            });

            // Update subscription status to active and clear any past due flags
            await supabaseAdmin
              .from("profiles")
              .update({
                subscription_status: "active",
                payment_failed_at: null,
                last_payment_at: new Date().toISOString(),
              })
              .eq("user_id", profile.user_id);
          }
        }
        break;
      }

      // Handle subscription past due (after payment retries failed)
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("user_id, email, display_name, subscription_plan, subscription_status")
          .eq("stripe_customer_id", customerId)
          .single();

        if (profile) {
          const previousStatus = profile.subscription_status;
          const newStatus = subscription.status;

          // Update status in database
          await supabaseAdmin
            .from("profiles")
            .update({
              subscription_status: newStatus,
            })
            .eq("user_id", profile.user_id);

          // If just became past_due, send notification
          if (newStatus === "past_due" && previousStatus !== "past_due") {
            // Calculate days past due from current_period_end
            // Cast to access Unix timestamp fields
            const subData = subscription as unknown as { current_period_end: number; latest_invoice?: { amount_due?: number } };
            const periodEnd = new Date(subData.current_period_end * 1000);
            const now = new Date();
            const daysPastDue = Math.max(1, Math.ceil((now.getTime() - periodEnd.getTime()) / (1000 * 60 * 60 * 24)));

            const invoice = subData.latest_invoice;
            const amount = invoice?.amount_due
              ? `$${(invoice.amount_due / 100).toFixed(2)}`
              : "$0.00";

            // Create notification
            const notificationService = new NotificationService(supabaseAdmin);
            await notificationService.notifyPastDue(profile.user_id, amount, daysPastDue);

            // Send email
            await sendNotificationEmail("paymentPastDue", profile.email, {
              name: profile.display_name || "there",
              amount,
              daysPastDue,
            });
          }
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
