import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/server/supabaseAdmin";

const ALLOWED_FIELDS = new Set([
  "user_id",
  "full_name",
  "display_name",
  "headline",
  "email",
  "phone",
  "location",
  "city",
  "state",
  "country",
  "zipcode",
  "languages",
  "services",
  "agree_terms",
  "plan",
  "plan_name",
  "price_monthly",
  "status",
  "plan",
  "plan_name",
  "price_monthly",
  "status",
  "subscription_status",
  "paid_until",
  "profile_photo",
  "gallery",
]);

function sanitizePayload(body: Record<string, any>) {
  const sanitized: Record<string, any> = {};
  for (const key of Object.keys(body)) {
    if (ALLOWED_FIELDS.has(key)) {
      sanitized[key] = body[key];
    }
  }

  return sanitized;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = sanitizePayload(body);

    if (!payload.user_id) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 }
      );
    }

    payload.updated_at = new Date().toISOString();
    payload.status = payload.status || "pending";

    const { error } = await supabaseAdmin
      .from("therapists")
      .upsert(payload, { onConflict: "user_id" });

    if (error) {
      console.error("[create-therapist-profile] Supabase error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to create therapist profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[create-therapist-profile] Unexpected error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
