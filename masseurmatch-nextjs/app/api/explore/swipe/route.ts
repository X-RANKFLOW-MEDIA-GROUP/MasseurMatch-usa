import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const swipeSchema = z.object({
  profile_id: z.string().uuid(),
  action: z.enum(["swipe_left", "swipe_right", "swipe_up"]),
  match_score: z.number().min(0).max(1).optional(),
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
    const parsed = swipeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid swipe payload" }, { status: 400 });
    }

    const { profile_id, action, match_score } = parsed.data;

    const { error } = await supabase
      .from("explore_swipe_events")
      .insert({
        user_id: userId,
        profile_id,
        action,
        match_score: match_score ?? null,
      });

    if (error) {
      console.error("Failed to record swipe:", error);
      return NextResponse.json({ error: "Failed to record swipe" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Explore swipe error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
