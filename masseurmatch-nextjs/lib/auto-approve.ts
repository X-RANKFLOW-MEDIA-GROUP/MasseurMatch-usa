import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function checkAutoApprove(profileId: string) {
  const supabase = await createServerSupabaseClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "id, user_id, auto_moderation, admin_status, publication_status, onboarding_stage, display_name"
    )
    .eq("id", profileId)
    .single();

  if (!profile) {
    return { approved: false, reason: "Profile not found" };
  }

  if (profile.auto_moderation !== "auto_passed") {
    return { approved: false, reason: "Profile has not passed auto moderation" };
  }

  if (profile.admin_status === "approved" && profile.publication_status === "public") {
    return { approved: true, reason: "Profile already live" };
  }

  const { data: user } = await supabase
    .from("users")
    .select("identity_status")
    .eq("id", profile.user_id)
    .single();

  if (user?.identity_status !== "verified") {
    return { approved: false, reason: "Identity is not verified" };
  }

  if (profile.display_name) {
    const { count: duplicates } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("display_name", profile.display_name)
      .eq("publication_status", "public")
      .eq("admin_status", "approved")
      .neq("user_id", profile.user_id);

    if ((duplicates ?? 0) > 0) {
      return { approved: false, reason: "Duplicate profile already exists" };
    }
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      admin_status: "approved",
      publication_status: "public",
      onboarding_stage: "live",
      approved_at: new Date().toISOString(),
    })
    .eq("id", profile.id);

  if (updateError) {
    console.error("Auto-approve update failed:", updateError);
    return { approved: false, reason: "Failed to publish profile" };
  }

  return { approved: true };
}
