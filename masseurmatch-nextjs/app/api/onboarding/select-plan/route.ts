import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createCheckoutSession, createCustomer, SubscriptionPlan } from "@/lib/stripe";

type ErrorResponsePayload = {
  status: number;
  code: string;
  message: string;
  details?: Record<string, any> | null;
};

const respondWithError = (payload: ErrorResponsePayload) => {
  return NextResponse.json(
    {
      error_code: payload.code,
      message: payload.message,
      details: payload.details ?? null,
    },
    { status: payload.status }
  );
};

const payloadSchema = z.object({
  planId: z.enum(["free", "standard", "pro", "elite"]),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: session, error: sessionError } = await supabase.auth.getSession();

    console.log("Session data:", {
      hasSession: !!session.session,
      hasUser: !!session.session?.user,
      userId: session.session?.user?.id,
      sessionError
    });

    const userId = session.session?.user?.id;

    if (!userId) {
      console.error("No user ID found in session");
      return respondWithError({
        status: 401,
        code: "AUTH_REQUIRED",
        message: "No active session found. Please log in again.",
        details: { reason: "Missing userId in session" },
      });
    }

    const body = await request.json().catch(() => ({}));
    const parsed = payloadSchema.safeParse(body);
    if (!parsed.success) {
      return respondWithError({
        status: 400,
        code: "PLAN_REQUIRED",
        message: "Invalid plan selection.",
      });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, stripe_customer_id")
      .eq("user_id", userId)
      .single();

    if (profileError || !profile) {
      return respondWithError({
        status: 404,
        code: "PROFILE_NOT_FOUND",
        message: "Profile not found.",
      });
    }

    // FREE plan: no payment required, only identity verification
    if (parsed.data.planId === "free") {
      // Check if user already has an active subscription
      const { data: existingSubscription } = await supabase
        .from("subscriptions")
        .select("id, plan, status")
        .eq("user_id", userId)
        .in("status", ["trialing", "active"])
        .maybeSingle();

      if (existingSubscription) {
        return respondWithError({
          status: 400,
          code: "DUPLICATE_SUBSCRIPTION",
          message: "You already have an active subscription.",
          details: {
            current_plan: existingSubscription.plan,
            current_status: existingSubscription.status,
          },
        });
      }

      // Create a FREE subscription record (7-day trial, no payment)
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 7);

      const { error: subscriptionError } = await supabase
        .from("subscriptions")
        .insert({
          user_id: userId,
          plan: "free",
          status: "trialing",
          trial_start: new Date().toISOString(),
          trial_end: trialEnd.toISOString(),
          current_period_start: new Date().toISOString(),
          current_period_end: trialEnd.toISOString(),
        });

      if (subscriptionError) {
        console.error("Failed to create FREE subscription:", subscriptionError);
        return respondWithError({
          status: 500,
          code: "SUBSCRIPTION_CREATION_FAILED",
          message: "Failed to create subscription.",
          details: {
            reason: subscriptionError.message,
            supabase_code: subscriptionError.code,
          },
        });
      }

      // Update onboarding stage to identity verification
      const { error: stageUpdateError } = await supabase
        .from("profiles")
        .update({ onboarding_stage: "needs_identity" })
        .eq("id", profile.id);

      if (stageUpdateError) {
        console.error("Failed to update onboarding stage:", stageUpdateError);
        return respondWithError({
          status: 500,
          code: "ONBOARDING_STAGE_UPDATE_FAILED",
          message: "Failed to update onboarding stage.",
          details: { reason: stageUpdateError.message },
        });
      }

      return NextResponse.json({
        success: true,
        plan: "free",
        requiresPayment: false,
        message: "FREE plan activated. Please complete identity verification.",
      });
    }

    // Paid plans (standard, pro, elite): require Stripe checkout
    let customerId = profile.stripe_customer_id;
    if (!customerId) {
      const customer = await createCustomer({
        email: session.session?.user?.email ?? "",
        metadata: { user_id: userId },
      });
      customerId = customer.id;
      await supabase.from("profiles").update({ stripe_customer_id: customerId }).eq("id", profile.id);
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const successUrl = `${baseUrl}/onboarding?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/onboarding`;

    const sessionData = await createCheckoutSession({
      customerId,
      plan: parsed.data.planId as SubscriptionPlan,
      successUrl,
      cancelUrl,
      trialDays: 7,
      metadata: {
        user_id: userId,
        plan: parsed.data.planId,
      },
    });

    return NextResponse.json({
      success: true,
      plan: parsed.data.planId,
      requiresPayment: true,
      session: {
        id: sessionData.id,
        url: sessionData.url,
      },
    });
  } catch (error) {
    console.error("Checkout creation failed:", error);
    return respondWithError({
      status: 500,
      code: "CHECKOUT_CREATION_FAILED",
      message: "Failed to create checkout session.",
      details: {
        reason: error instanceof Error ? error.message : String(error),
      },
    });
  }
}
