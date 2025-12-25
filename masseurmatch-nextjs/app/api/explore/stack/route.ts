import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const citySlug = request.nextUrl.searchParams.get("city_slug");

    const { data: swipes } = await supabase
      .from("explore_swipe_events")
      .select("profile_id")
      .eq("user_id", userId);
    const swipedIds = swipes?.map((row) => row.profile_id) ?? [];

    let query = supabase
      .from("profiles")
      .select("id, display_name, city, city_slug, profile_photo, onboarding_stage, publication_status, admin_status")
      .eq("publication_status", "public")
      .eq("admin_status", "approved")
      .neq("user_id", userId);

    if (swipedIds.length) {
      const formatted = swipedIds.map((id) => `'${id}'`).join(",");
      query = query.not("id", "in", `(${formatted})`);
    }

    if (citySlug) {
      query = query.eq("city_slug", citySlug);
    }

    const { data: profiles, error } = await query.limit(20).order("updated_at", { ascending: false });

    if (error) {
      console.error("Failed to load explore stack:", error);
      return NextResponse.json({ error: "Failed to load stack" }, { status: 500 });
    }

    const stack = (profiles ?? []).map((profile, index) => ({
      ...profile,
      match_score: parseFloat((0.7 + ((index % 10) * 0.02)).toFixed(2)),
    }));

    return NextResponse.json({ success: true, stack, total: stack.length, city_slug: citySlug });
  } catch (error) {
    console.error("Explore stack error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
