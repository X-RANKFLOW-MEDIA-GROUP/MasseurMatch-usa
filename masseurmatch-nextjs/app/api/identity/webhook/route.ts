import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { constructWebhookEvent } from "@/lib/stripe";
import { supabaseAdmin } from "@/server/supabaseAdmin";
import { checkAutoApprove } from "@/lib/auto-approve";

const WEBHOOK_SECRET =
  process.env.STRIPE_IDENTITY_WEBHOOK_SECRET ?? process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  const payload = await request.text();
  if (!WEBHOOK_SECRET) {
    console.error("Identity webhook secret is missing");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = constructWebhookEvent(payload, signature, WEBHOOK_SECRET);
  } catch (error) {
    console.error("Identity webhook signature invalid:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "identity.verification_session.verified") {
    const session = event.data.object as Stripe.Identity.VerificationSession;
    const userId = session.metadata?.user_id;
    if (!userId) {
      console.warn("Identity verification session missing user_id metadata");
      return NextResponse.json({ received: true });
    }

    const { error } = await supabaseAdmin
      .from("users")
      .update({
        identity_status: "verified",
      })
      .eq("id", userId);

    if (error) {
      console.error("Failed to mark identity verified:", error);
    } else {
      const profileId = await findProfileIdByUser(userId);
      if (profileId) {
        await checkAutoApprove(profileId);
      }
    }
  }

  return NextResponse.json({ received: true });
}

async function findProfileIdByUser(userId: string) {
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();
  return data?.id ?? null;
}
