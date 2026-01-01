import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type SupabaseClientInstance = Awaited<ReturnType<typeof createServerSupabaseClient>>;

const CONTEXTS = ["incall", "outcall"] as const;

const createRateSchema = z.object({
  context: z.enum(CONTEXTS),
  duration_minutes: z.coerce.number().int().min(1),
  price_cents: z.coerce.number().int().min(1),
  currency: z.string().length(3).optional(),
});

const updateRateSchema = z.object({
  rate_id: z.string().uuid(),
  context: z.enum(CONTEXTS).optional(),
  duration_minutes: z.coerce.number().int().min(1).optional(),
  price_cents: z.coerce.number().int().min(1).optional(),
  currency: z.string().length(3).optional(),
});

const deleteRateSchema = z.object({
  rate_id: z.string().uuid(),
});

async function resolveProfileId(supabase: SupabaseClientInstance) {
  const { data: session } = await supabase.auth.getSession();
  const userId = session.session?.user?.id;

  if (!userId) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), profileId: null };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (error || !profile) {
    return { error: NextResponse.json({ error: "Profile not found" }, { status: 404 }), profileId: null };
  }

  return { error: null, profileId: profile.id };
}

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { error: authError, profileId } = await resolveProfileId(supabase);
  if (authError) return authError;
  if (!profileId) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  try {
    const { data: rates, error } = await supabase
      .from("profile_rates")
      .select("*")
      .eq("profile_id", profileId)
      .order("context", { ascending: true })
      .order("duration_minutes", { ascending: true });

    if (error) {
      return NextResponse.json({ error: "Failed to fetch rates" }, { status: 500 });
    }

    const grouped: { incall: any[]; outcall: any[] } = {
      incall: [],
      outcall: [],
    };

    (rates ?? []).forEach((rate) => {
      if (grouped[rate.context as keyof typeof grouped]) {
        grouped[rate.context as keyof typeof grouped].push(rate);
      }
    });

    return NextResponse.json({
      success: true,
      rates: grouped,
      total: rates?.length ?? 0,
    });
  } catch (error) {
    console.error("Rates GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { error: authError, profileId } = await resolveProfileId(supabase);
  if (authError) return authError;
  if (!profileId) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  const parsed = createRateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid rate payload", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("profile_rates")
      .insert({
        profile_id: profileId,
        ...parsed.data,
      })
      .select()
      .single();

    if (error) {
      console.error("Rate insert error:", error);
      return NextResponse.json({ error: error.message }, { status: error?.code === "23505" ? 409 : 500 });
    }

    return NextResponse.json({
      success: true,
      rate: data,
    });
  } catch (error) {
    console.error("Rate creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { error: authError, profileId } = await resolveProfileId(supabase);
  if (authError) return authError;
  if (!profileId) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  const parsed = updateRateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { rate_id, ...updates } = parsed.data;
  if (!Object.keys(updates).length) {
    return NextResponse.json({ error: "No updates provided" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("profile_rates")
      .update(updates)
      .eq("id", rate_id)
      .eq("profile_id", profileId)
      .select()
      .single();

    if (error) {
      console.error("Rate update error:", error);
      return NextResponse.json({ error: error.message }, { status: error?.code === "23505" ? 409 : 500 });
    }

    return NextResponse.json({ success: true, rate: data });
  } catch (error) {
    console.error("Rate PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { error: authError, profileId } = await resolveProfileId(supabase);
  if (authError) return authError;
  if (!profileId) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const parsed = deleteRateSchema.safeParse({
    rate_id: request.nextUrl.searchParams.get("rate_id") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Missing rate_id" }, { status: 400 });
  }

  try {
    const { error } = await supabase
      .from("profile_rates")
      .delete()
      .eq("id", parsed.data.rate_id)
      .eq("profile_id", profileId);

    if (error) {
      console.error("Rate deletion error:", error);
      return NextResponse.json({ error: "Failed to delete rate" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Rate DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
