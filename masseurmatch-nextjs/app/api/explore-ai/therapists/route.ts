import { NextRequest, NextResponse } from "next/server";
import {
  AiSignals,
  ModePreference,
  Preferences,
  TherapistRow,
  buildTherapistCard,
  createPreferenceDraft,
} from "@/components/ExploreAI/ai";
import { supabaseAdmin } from "@/server/supabaseAdmin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type SwipeSignalEvent = {
  direction: "left" | "right" | "up";
  context?: {
    specialties?: string[];
    services?: string[];
    mode?: ModePreference;
  };
};

function sanitizeMode(value?: string): ModePreference {
  if (value === "incall" || value === "outcall") return value;
  return "any";
}

function rowToPreferences(row: any): Preferences {
  const preferences = createPreferenceDraft();
  if (!row) return preferences;

  const lat = Number(row.latitude ?? row.location?.coordinates?.[1] ?? 0);
  const lng = Number(row.longitude ?? row.location?.coordinates?.[0] ?? 0);
  preferences.location.lat = Number.isFinite(lat) ? lat : preferences.location.lat;
  preferences.location.lng = Number.isFinite(lng) ? lng : preferences.location.lng;
  preferences.location.radius = Number(row.radius ?? preferences.location.radius);
  preferences.location.zipCode = row.zip_code ?? preferences.location.zipCode;
  preferences.massageTypes = row.massage_types ?? preferences.massageTypes;
  preferences.pressure = row.pressure ?? preferences.pressure;
  preferences.gender = row.gender ?? preferences.gender;
  preferences.availability = (row.availability as Preferences["availability"]) ?? preferences.availability;
  preferences.budget.min = Number(row.budget_min ?? preferences.budget.min);
  preferences.budget.max = Number(row.budget_max ?? preferences.budget.max);
  preferences.painPoints = row.pain_points ?? preferences.painPoints;

  const normalizedMode = sanitizeMode(row.mode);
  if (normalizedMode !== "any") {
    preferences.mode = normalizedMode;
  }

  return preferences;
}

function deriveAiSignals(events: SwipeSignalEvent[]): AiSignals {
  const signals: AiSignals = { specialties: {}, services: {}, modes: { incall: 0, outcall: 0, any: 0 } };
  events.forEach((event) => {
    const weight = event.direction === "up" ? 2 : event.direction === "left" ? -0.5 : 1;
    event.context?.specialties?.forEach((spec) => {
      signals.specialties[spec] = (signals.specialties[spec] ?? 0) + weight;
    });
    event.context?.services?.forEach((service) => {
      signals.services[service] = (signals.services[service] ?? 0) + weight;
    });
    const mode = event.context?.mode ?? "any";
    signals.modes[mode] = (signals.modes[mode] ?? 0) + weight;
  });
  return signals;
}

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;

  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get("mode") ?? "swipe";
  const defaultLimit = mode === "recommendations" ? 8 : 30;
  const limitParam = Number(searchParams.get("limit") ?? defaultLimit);
  const limit = Number.isFinite(limitParam) ? Math.max(8, Math.min(80, limitParam)) : defaultLimit;

  let preferences = createPreferenceDraft();
  if (userId) {
    const { data: prefData } = await supabase
      .from("users_preferences")
      .select("*, location")
      .eq("user_id", userId)
      .maybeSingle();
    if (prefData) {
      preferences = rowToPreferences(prefData);
    }
  }

  const queryLat = Number(searchParams.get("lat"));
  const queryLng = Number(searchParams.get("lng"));
  if (Number.isFinite(queryLat) && Number.isFinite(queryLng)) {
    preferences.location.lat = queryLat;
    preferences.location.lng = queryLng;
  }

  if (searchParams.has("radius")) {
    const parsedRadius = Number(searchParams.get("radius"));
    if (Number.isFinite(parsedRadius) && parsedRadius > 0) {
      preferences.location.radius = parsedRadius;
    }
  }

  let aiSignals: AiSignals | undefined;
  if (userId) {
    const { data: events } = await supabaseAdmin
      .from("explore_swipe_events")
      .select("direction, context")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(60);
    aiSignals = deriveAiSignals((events ?? []) as SwipeSignalEvent[]);
  }

  if (aiSignals) {
    preferences.aiSignals = aiSignals;
  }

  const radiusMeters = Math.max(1, Math.round((preferences.location.radius ?? 25) * 1609.34));

  const { data, error } = await supabaseAdmin.rpc("discover_nearby_therapists", {
    user_lat: preferences.location.lat || 0,
    user_lon: preferences.location.lng || 0,
    radius_meters: radiusMeters,
    limit_results: limit,
  });

  if (error) {
    console.error("Failed to load explore therapists:", error);
    return NextResponse.json({ success: false, error: error.message ?? "Rpc failed" }, { status: 500 });
  }

  const rows = (data as TherapistRow[]) ?? [];
  const cards = rows.map((row) => buildTherapistCard(row, preferences));

  return NextResponse.json({ success: true, cards, mode, total: cards.length });
}
