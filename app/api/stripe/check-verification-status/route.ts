import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/src/lib/stripe";
import { createServerSupabaseClient } from "@/src/lib/supabase-server";

export async function GET(req: NextRequest) {
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

    const { data: profile } = await supabase
      .from("profiles")
      .select("identity_verified, identity_verification_session_id, identity_verification_status")
      .eq("user_id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ verified: false, status: "not_started" });
    }

    if (profile.identity_verified) {
      return NextResponse.json({ verified: true, status: "verified" });
    }

    // Check Stripe for latest status
    if (profile.identity_verification_session_id) {
      const session = await stripe.identity.verificationSessions.retrieve(
        profile.identity_verification_session_id
      );

      let status = profile.identity_verification_status;

      if (session.status === "verified") {
        // Update database
        await supabase
          .from("profiles")
          .update({
            identity_verified: true,
            identity_verified_at: new Date().toISOString(),
            identity_verification_status: "verified",
          })
          .eq("user_id", user.id);

        return NextResponse.json({ verified: true, status: "verified" });
      }

      if (session.status !== status) {
        await supabase
          .from("profiles")
          .update({ identity_verification_status: session.status })
          .eq("user_id", user.id);
        status = session.status;
      }

      return NextResponse.json({
        verified: false,
        status,
        lastError: session.last_error?.reason,
      });
    }

    return NextResponse.json({ verified: false, status: "not_started" });
  } catch (error) {
    console.error("Check verification error:", error);
    return NextResponse.json(
      { error: "Failed to check verification status" },
      { status: 500 }
    );
  }
}
