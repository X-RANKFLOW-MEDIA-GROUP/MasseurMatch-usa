import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/server/supabaseAdmin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ModePreference } from "@/components/ExploreAI/ai";

type SwipeContext = {
  specialties?: string[];
  services?: string[];
  mode?: ModePreference;
};

type AiFeedback = {
  signals?: {
    specialties?: Record<string, number>;
    services?: Record<string, number>;
    modes?: Record<ModePreference, number>;
  };
};

function initializeSignals(signals?: AiFeedback["signals"]) {
  return {
    specialties: { ...(signals?.specialties ?? {}) },
    services: { ...(signals?.services ?? {}) },
    modes: {
      incall: signals?.modes?.incall ?? 0,
      outcall: signals?.modes?.outcall ?? 0,
      any: signals?.modes?.any ?? 0,
    },
  };
}

function applyContext(signals: NonNullable<ReturnType<typeof initializeSignals>>, direction: string, context?: SwipeContext) {
  const multiplier = direction === "up" ? 2 : direction === "left" ? -0.5 : 1;
  context?.specialties?.forEach((spec) => {
    signals.specialties[spec] = (signals.specialties[spec] ?? 0) + multiplier;
  });
  context?.services?.forEach((service) => {
    signals.services[service] = (signals.services[service] ?? 0) + multiplier;
  });
  const mode = context?.mode ?? "any";
  signals.modes[mode] = (signals.modes[mode] ?? 0) + multiplier;
  return signals;
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const { therapistId, direction, matchScore, context }: { therapistId?: string; direction?: string; matchScore?: number; context?: SwipeContext } = body || {};
  if (!therapistId || !direction) {
    return NextResponse.json({ error: "Missing event data" }, { status: 400 });
  }

  await supabaseAdmin.from("explore_swipe_events").insert({
    user_id: userId,
    therapist_id: therapistId,
    direction,
    match_score: matchScore ?? null,
    context: context ?? {},
  });

  const { data: stored } = await supabaseAdmin
    .from("users_preferences")
    .select("ai_feedback")
    .eq("user_id", userId)
    .single();
  const feedback = (stored?.ai_feedback ?? {}) as AiFeedback;
  const signals = initializeSignals(feedback?.signals);
  const updatedSignals = applyContext(signals, direction, context);
  await supabaseAdmin
    .from("users_preferences")
    .update({ ai_feedback: { signals: updatedSignals } })
    .eq("user_id", userId);

  return NextResponse.json({ success: true });
}
