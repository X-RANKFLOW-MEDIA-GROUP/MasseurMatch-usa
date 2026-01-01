import { supabaseServer } from "@/lib/supabase/server";

export type TherapistPublic = {
  id: string;
  slug: string;
  display_name: string;
  headline: string | null;
  bio: string | null;
  phone: string | null;
  city_slug: string | null;
  city_name: string | null;
  primary_photo_url: string | null;
  updated_at: string;
  is_published: boolean;
};

export async function getTherapistByAnySlug(slug: string): Promise<{
  therapist: TherapistPublic | null;
  canonicalSlug: string | null;
}> {
  const supabase = supabaseServer();

  const direct = await supabase
    .from("therapists")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (direct.data) {
    return { therapist: direct.data as TherapistPublic, canonicalSlug: direct.data.slug };
  }

  const history = await supabase
    .from("therapist_slug_history")
    .select("therapist_id,new_slug")
    .eq("old_slug", slug)
    .maybeSingle();

  if (!history.data?.therapist_id || !history.data?.new_slug) {
    return { therapist: null, canonicalSlug: null };
  }

  const canonical = await supabase
    .from("therapists")
    .select("*")
    .eq("id", history.data.therapist_id)
    .maybeSingle();

  return {
    therapist: (canonical.data ?? null) as TherapistPublic | null,
    canonicalSlug: history.data.new_slug,
  };
}

export async function listTherapistsByCity(citySlug: string, segment?: string) {
  const supabase = supabaseServer();

  let q = supabase
    .from("therapists")
    .select("id,slug,display_name,headline,primary_photo_url,city_slug,city_name")
    .eq("city_slug", citySlug)
    .eq("is_published", true)
    .order("updated_at", { ascending: false })
    .limit(60);

  if (segment) {
    // Placeholder: adapt when you have a dedicated segment/tag table
  }

  const res = await q;
  return (res.data ?? []) as Array<
    Pick<
      TherapistPublic,
      "id" | "slug" | "display_name" | "headline" | "primary_photo_url" | "city_slug" | "city_name"
    >
  >;
}
