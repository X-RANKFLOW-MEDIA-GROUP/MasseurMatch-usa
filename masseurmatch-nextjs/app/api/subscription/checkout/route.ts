import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createCheckoutSession, createCustomer, SubscriptionPlan } from "@/lib/stripe";

const payloadSchema = z.object({
  plan: z.enum(["standard", "pro", "elite"]),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const parsed = payloadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid plan selection" }, { status: 400 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, stripe_customer_id")
      .eq("user_id", userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

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
    const successUrl = `${baseUrl}/dashboard/billing?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/pricing`;

    const sessionData = await createCheckoutSession({
      customerId,
      plan: parsed.data.plan as SubscriptionPlan,
      successUrl,
      cancelUrl,
      trialDays: 7,
      metadata: {
        user_id: userId,
        plan: parsed.data.plan,
      },
    });

    return NextResponse.json({
      success: true,
      session_url: sessionData.url,
      session_id: sessionData.id,
    });
  } catch (error) {
    console.error("Checkout creation failed:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
