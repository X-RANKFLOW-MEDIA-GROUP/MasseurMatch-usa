import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function missingEnvResponse() {
  console.error("Supabase environment variables are missing for therapists API");
  return NextResponse.json(
    {
      success: false,
      error: "Supabase credentials are not configured.",
      therapists: [],
    },
    { status: 500 }
  );
}

export async function GET() {
  if (!supabaseUrl || !serviceRoleKey) {
    return missingEnvResponse();
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const { data, error, status } = await supabase
      .from("therapists")
      .select(`
        user_id,
        slug,
        display_name,
        location,
        services,
        profile_photo,
        zip_code,
        phone,
        status,
        rating,
        rating_count,
        is_highest_rated,
        has_highest_review,
        is_featured,
        is_available,
        incall_available,
        outcall_available,
        starting_price_usd
      `)
      .eq("status", "approved")
      .order("is_featured", { ascending: false })
      .order("rating", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error fetching therapists:", error);
      return NextResponse.json(
        { success: false, error: error.message, therapists: [] },
        { status: status ?? 500 }
      );
    }

    return NextResponse.json({ success: true, therapists: data ?? [] });
  } catch (err) {
    console.error("Unexpected error fetching therapists:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
        therapists: [],
      },
      { status: 500 }
    );
  }
}

