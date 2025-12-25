import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Preferences, PressureLevel, GenderPreference, ModePreference, AvailabilityWindow, createPreferenceDraft } from "@/components/ExploreAI/ai";

function sanitizePressure(value?: string): PressureLevel {
  if (value === "light" || value === "firm") return value;
  return "medium";
}

function sanitizeGender(value?: string): GenderPreference {
  if (value === "male" || value === "female") return value;
  return "any";
}

function sanitizeMode(value?: string): ModePreference {
  if (value === "incall" || value === "outcall") return value;
  return "any";
}

function sanitizeAvailability(value?: string): AvailabilityWindow {
  switch (value) {
    case "now":
    case "today":
    case "this-week":
      return value;
    default:
      return "anytime";
  }
}

function rowToPreferences(row: any): Preferences {
  const prefs = createPreferenceDraft();
  if (!row) return prefs;
  const lat = Number(row.latitude ?? row.location?.coordinates?.[1] ?? 0);
  const lng = Number(row.longitude ?? row.location?.coordinates?.[0] ?? 0);
  prefs.location.lat = Number.isFinite(lat) ? lat : 0;
  prefs.location.lng = Number.isFinite(lng) ? lng : 0;
  prefs.location.radius = Number(row.radius ?? prefs.location.radius);
  prefs.location.zipCode = row.zip_code ?? "";
  prefs.massageTypes = row.massage_types ?? [];
  prefs.pressure = sanitizePressure(row.pressure);
  prefs.gender = sanitizeGender(row.gender);
  prefs.mode = sanitizeMode(row.mode);
  prefs.availability = sanitizeAvailability(row.availability);
  prefs.budget.min = Number(row.budget_min ?? prefs.budget.min);
  prefs.budget.max = Number(row.budget_max ?? prefs.budget.max);
  prefs.painPoints = row.pain_points ?? [];
  return prefs;
}

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  if (!userId) {
    return NextResponse.json({ preferences: null });
  }

  const { data, error } = await supabase
    .from("users_preferences")
    .select("*, location")
    .eq("user_id", userId)
    .single();

  if (error) {
    return NextResponse.json({ preferences: null, error: error.message }, { status: 200 });
  }

  return NextResponse.json({ preferences: rowToPreferences(data) });
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const preferences: Preferences | undefined = body?.preferences;
  if (!preferences) {
    return NextResponse.json({ error: "Missing preferences payload" }, { status: 400 });
  }

  const locationString = `SRID=4326;POINT(${preferences.location.lng || 0} ${preferences.location.lat || 0})`;

  const { error } = await supabase.from("users_preferences").upsert(
    {
      user_id: userId,
      latitude: preferences.location.lat,
      longitude: preferences.location.lng,
      radius: preferences.location.radius,
      zip_code: preferences.location.zipCode,
      location: locationString,
      massage_types: preferences.massageTypes,
      pressure: preferences.pressure,
      gender: preferences.gender,
      mode: preferences.mode,
      availability: preferences.availability,
      budget_min: preferences.budget.min,
      budget_max: preferences.budget.max,
      pain_points: preferences.painPoints,
    },
    { onConflict: "user_id" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, preferences });
}
