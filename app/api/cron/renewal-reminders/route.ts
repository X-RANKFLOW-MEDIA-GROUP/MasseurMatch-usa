import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "@/src/lib/stripe";
import { NotificationService } from "@/src/lib/notifications";
import { sendNotificationEmail } from "@/src/lib/email";

// Use service role for cron jobs
const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

// Price mapping for plans
const PLAN_PRICES: Record<string, number> = {
  standard: 49,
  pro: 89,
  elite: 149,
};

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const cronSecret = request.headers.get("x-cron-secret");
  const expectedSecret = process.env.CRON_SECRET;

  if (expectedSecret && cronSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin || !stripe) {
    return NextResponse.json(
      { error: "Not configured" },
      { status: 500 }
    );
  }

  try {
    // Get all users with active paid subscriptions
    const { data: profiles, error } = await supabaseAdmin
      .from("profiles")
      .select("user_id, email, display_name, subscription_plan, subscription_id, stripe_customer_id")
      .in("subscription_plan", ["standard", "pro", "elite"])
      .eq("subscription_status", "active")
      .not("subscription_id", "is", null);

    if (error) {
      console.error("Error fetching profiles:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No active subscriptions to check",
        processed: 0,
      });
    }

    const notificationService = new NotificationService(supabaseAdmin);
    const results = {
      processed: 0,
      notified: 0,
      errors: 0,
    };

    // Calculate target date (3 days from now)
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const targetDateStart = new Date(threeDaysFromNow);
    targetDateStart.setHours(0, 0, 0, 0);
    const targetDateEnd = new Date(threeDaysFromNow);
    targetDateEnd.setHours(23, 59, 59, 999);

    for (const profile of profiles) {
      results.processed++;

      try {
        if (!profile.subscription_id) continue;

        // Get subscription from Stripe
        const subscriptionData = await stripe.subscriptions.retrieve(profile.subscription_id);
        // Cast to access current_period_end (Unix timestamp)
        const periodEnd = (subscriptionData as unknown as { current_period_end: number }).current_period_end;

        // Calculate renewal date
        const renewalDate = new Date(periodEnd * 1000);

        // Check if renewal is within the target window (3 days from now)
        if (renewalDate >= targetDateStart && renewalDate <= targetDateEnd) {
          // Check if we already sent a reminder for this renewal period
          const { data: existingNotification } = await supabaseAdmin
            .from("notifications")
            .select("id")
            .eq("user_id", profile.user_id)
            .eq("type", "subscription_renewing")
            .gte("created_at", new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString())
            .single();

          if (existingNotification) {
            // Already notified within the last 7 days
            continue;
          }

          const planName = profile.subscription_plan.charAt(0).toUpperCase() +
            profile.subscription_plan.slice(1);
          const amount = `$${PLAN_PRICES[profile.subscription_plan] || 0}`;
          const formattedDate = renewalDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          // Create in-app notification
          await notificationService.notifyRenewalReminder(
            profile.user_id,
            planName,
            formattedDate,
            amount
          );

          // Send email
          await sendNotificationEmail("renewalReminder", profile.email, {
            name: profile.display_name || "there",
            plan: planName,
            renewalDate: formattedDate,
            amount,
          });

          results.notified++;
        }
      } catch (err) {
        console.error(`Error processing user ${profile.user_id}:`, err);
        results.errors++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${results.processed} users, sent ${results.notified} reminders`,
      ...results,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: "Cron job failed" },
      { status: 500 }
    );
  }
}

// Also support POST for Vercel cron jobs
export async function POST(request: NextRequest) {
  return GET(request);
}
