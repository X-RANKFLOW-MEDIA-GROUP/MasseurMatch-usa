import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/src/lib/stripe";
import { createServerSupabaseClient } from "@/src/lib/supabase-server";
import { SITE_URL } from "@/src/lib/site";

export async function POST(req: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 500 }
      );
    }

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user already verified
    const { data: profile } = await supabase
      .from("profiles")
      .select("identity_verified, identity_verification_session_id")
      .eq("user_id", user.id)
      .single();

    if (profile?.identity_verified) {
      return NextResponse.json(
        { error: "Already verified" },
        { status: 400 }
      );
    }

    // Create Stripe Identity verification session
    const verificationSession = await stripe.identity.verificationSessions.create({
      type: "document",
      metadata: {
        user_id: user.id,
      },
      options: {
        document: {
          allowed_types: ["driving_license", "passport", "id_card"],
          require_id_number: true,
          require_matching_selfie: true,
        },
      },
      return_url: `${SITE_URL}/dashboard/settings?verification=complete`,
    });

    // Save session ID to profile
    await supabase
      .from("profiles")
      .update({
        identity_verification_session_id: verificationSession.id,
        identity_verification_status: "pending",
      })
      .eq("user_id", user.id);

    return NextResponse.json({
      sessionId: verificationSession.id,
      url: verificationSession.url,
    });
  } catch (error) {
    console.error("Identity verification error:", error);
    return NextResponse.json(
      { error: "Failed to create verification session" },
      { status: 500 }
    );
  }
}
