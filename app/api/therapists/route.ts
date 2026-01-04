import { createServerSupabaseClient } from "@/src/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const limit = parseInt(searchParams.get("limit") || "20");

  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("therapists")
    .select("user_id, slug, display_name, headline, city, state, rating, profile_photo, services, rate_60")
    .eq("status", "active")
    .order("rating", { ascending: false })
    .limit(limit);

  if (city) {
    query = query.ilike("city", `%${city}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ therapists: data });
}
