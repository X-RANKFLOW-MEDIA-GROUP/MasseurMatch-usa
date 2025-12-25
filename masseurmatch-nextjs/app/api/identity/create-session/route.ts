import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createIdentityVerificationSession } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user?.id;
    const email = session.session?.user?.email;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json().catch(() => ({}));
    const returnUrl = payload.return_url ?? `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/onboarding`;

    const verificationSession = await createIdentityVerificationSession({
      userId,
      email: email ?? "",
      returnUrl,
    });

    await supabase
      .from("users")
      .update({
        identity_status: "pending",
        stripe_identity_session_id: verificationSession.id,
      })
      .eq("id", userId);

    return NextResponse.json({
      success: true,
      session_id: verificationSession.id,
      client_secret: verificationSession.client_secret,
      url: verificationSession.url,
    });
  } catch (error) {
    console.error("Identity session creation failed:", error);
    return NextResponse.json({ error: "Failed to create identity session" }, { status: 500 });
  }
}
