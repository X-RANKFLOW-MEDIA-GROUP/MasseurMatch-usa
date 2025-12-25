import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ONBOARDING_STAGES, AUTO_MODERATION_STATUSES } from "@/types/onboarding";

const profileUpdateSchema = z.object({
  display_name: z.string().min(2).max(60).optional(),
  headline: z.string().max(120).optional(),
  bio_short: z.string().max(500).optional(),
  bio_long: z.string().max(5000).optional(),
  city: z.string().max(80).optional(),
  city_slug: z.string().max(80).optional(),
  state: z.string().max(40).optional(),
  zip_code: z.string().max(16).optional(),
  phone_public_e164: z.string().optional(),
  incall_enabled: z.boolean().optional(),
  outcall_enabled: z.boolean().optional(),
  onboarding_stage: z.enum(ONBOARDING_STAGES).optional(),
  auto_moderation: z.enum(AUTO_MODERATION_STATUSES).optional(),
  admin_notes: z.string().optional(),
  rejection_reason: z.string().optional(),
  base_rate_per_min_cents: z.number().int().nonnegative().optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const payload = await request.json().catch(() => ({}));
    const parsed = profileUpdateSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid profile data", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updates = parsed.data;
    if (!Object.keys(updates).length) {
      return NextResponse.json({ error: "No fields provided for update" }, { status: 400 });
    }

    const { data: updatedProfile, error: updateError } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", profile.id)
      .select()
      .single();

    if (updateError) {
      console.error("Profile update error:", updateError);
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
