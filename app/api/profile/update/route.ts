import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/src/lib/supabase-server";
import { moderateText } from "@/src/lib/sightengine";

// Fields that require moderation
const MODERATED_FIELDS = ["headline", "about", "philosophy"];

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates = await req.json();

    // Separate moderated and non-moderated fields
    const moderatedUpdates: Record<string, string> = {};
    const directUpdates: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(updates)) {
      if (MODERATED_FIELDS.includes(key) && typeof value === "string") {
        moderatedUpdates[key] = value;
      } else {
        directUpdates[key] = value;
      }
    }

    // Apply direct updates immediately
    if (Object.keys(directUpdates).length > 0) {
      const { error: directError } = await supabase
        .from("profiles")
        .update({
          ...directUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (directError) {
        console.error("Direct update error:", directError);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
      }
    }

    // Process moderated fields
    const moderationResults: Record<string, { approved: boolean; reasons: string[] }> = {};
    const approvedUpdates: Record<string, string> = {};
    const pendingEdits: Array<{ field: string; value: string; reasons: string[] }> = [];

    for (const [field, value] of Object.entries(moderatedUpdates)) {
      const result = await moderateText(value);
      moderationResults[field] = { approved: result.approved, reasons: result.reasons };

      if (result.approved) {
        approvedUpdates[field] = value;
      } else {
        pendingEdits.push({ field, value, reasons: result.reasons });
      }
    }

    // Apply approved moderated updates
    if (Object.keys(approvedUpdates).length > 0) {
      const { error: modError } = await supabase
        .from("profiles")
        .update({
          ...approvedUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (modError) {
        console.error("Moderated update error:", modError);
      }
    }

    // Queue rejected edits for manual review (optional)
    if (pendingEdits.length > 0) {
      // Get current values for comparison
      const { data: currentProfile } = await supabase
        .from("profiles")
        .select("headline, about, philosophy, display_name")
        .eq("user_id", user.id)
        .single();

      for (const edit of pendingEdits) {
        await supabase.from("pending_edits").insert({
          user_id: user.id,
          display_name: currentProfile?.display_name || "Unknown",
          field: edit.field,
          old_value: currentProfile?.[edit.field as keyof typeof currentProfile] || "",
          new_value: edit.value,
          rejection_reasons: edit.reasons,
          status: "pending_review",
          submitted_at: new Date().toISOString(),
        });
      }
    }

    return NextResponse.json({
      success: true,
      moderation: moderationResults,
      pendingReview: pendingEdits.length > 0,
      message: pendingEdits.length > 0
        ? "Some changes are pending review"
        : "Profile updated successfully",
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}
