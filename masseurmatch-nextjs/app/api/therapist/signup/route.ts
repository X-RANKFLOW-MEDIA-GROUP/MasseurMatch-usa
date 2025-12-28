import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client with SERVICE ROLE key to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      password,
      fullName,
      displayName,
      phone,
      location,
      languages,
      services,
      agree,
      plan,
      planName,
      priceMonthly,
    } = body;

    // Validate required fields
    if (!email || !password || !fullName || !displayName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Create auth user
    let userId: string | undefined;
    const { data: signData, error: signErr } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim(),
      password,
      email_confirm: true, // Auto-confirm email for now
    });

    if (signErr) {
      // Check if user already exists
      const alreadyExists =
        (signErr as any).status === 422 ||
        signErr.message?.toLowerCase().includes("already registered") ||
        signErr.message?.toLowerCase().includes("already exists") ||
        signErr.message?.toLowerCase().includes("user already registered");

      if (alreadyExists) {
        // User exists - get their ID by querying the profiles table
        const { data: existingProfile, error: getProfileErr } = await supabaseAdmin
          .from("profiles")
          .select("user_id")
          .eq("user_id", (await supabaseAdmin.auth.admin.listUsers()).data?.users.find(u => u.email === email.trim())?.id || "")
          .single();

        if (getProfileErr || !existingProfile) {
          // Try getting from auth.users by listing all users and finding by email
          const { data: usersData, error: listErr } = await supabaseAdmin.auth.admin.listUsers();

          if (listErr || !usersData?.users) {
            console.error("Failed to list users:", listErr);
            return NextResponse.json(
              { error: "User exists but could not be found. Please try logging in instead." },
              { status: 400 }
            );
          }

          const existingUser = usersData.users.find(u => u.email === email.trim());

          if (!existingUser) {
            return NextResponse.json(
              { error: "User exists but could not be found. Please try logging in instead." },
              { status: 400 }
            );
          }

          userId = existingUser.id;
        } else {
          userId = existingProfile.user_id;
        }

        console.log("User already exists, updating profile:", userId);
      } else {
        console.error("Failed to create user:", signErr);
        return NextResponse.json(
          { error: signErr.message || "Failed to create user account" },
          { status: 400 }
        );
      }
    } else {
      userId = signData.user?.id;
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Failed to get user ID" },
        { status: 500 }
      );
    }

    // 2. Insert/update profiles table (basic user profile)
    const { error: profileErr } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id: userId,
        user_id: userId,
        email: email.trim(),
        onboarding_stage: "needs_plan",
        updated_at: new Date().toISOString(),
      }, { onConflict: "id" });

    if (profileErr) {
      console.error("Error saving profile:", profileErr);
      return NextResponse.json(
        { error: profileErr.message || "Failed to save profile" },
        { status: 500 }
      );
    }

    // 3. Insert/update therapist profile (detailed information - using service role to bypass RLS)
    const therapistPayload = {
      user_id: userId,
      full_name: fullName.trim(),
      display_name: displayName.trim(),
      email: email.trim(),
      phone: phone?.trim() || null,
      city: location?.trim() || null,
      languages: languages || [],
      services: services || [],
      agree_terms: agree || false,
      plan: plan || "free",
      plan_name: planName || "Free",
      price_monthly: priceMonthly || 0,
      status: "pending",
      updated_at: new Date().toISOString(),
    };

    const { error: therapistErr } = await supabaseAdmin
      .from("therapists")
      .upsert(therapistPayload, { onConflict: "user_id" });

    if (therapistErr) {
      console.error("Error saving therapist:", therapistErr);
      return NextResponse.json(
        { error: therapistErr.message || "Failed to save therapist profile" },
        { status: 500 }
      );
    }

    // 4. Return success with userId
    const isUpdate = !!signErr;
    return NextResponse.json({
      success: true,
      userId,
      message: isUpdate ? "Profile updated successfully" : "Profile created successfully",
      isUpdate,
    });
  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
