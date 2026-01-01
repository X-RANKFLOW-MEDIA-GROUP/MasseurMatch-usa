import { supabaseServer } from "@/lib/supabase/server";

export type TherapistPublic = {
  user_id: string;
  slug: string | null;
  display_name: string | null;
  headline: string | null;
  about: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  profile_photo: string | null;
  updated_at: string | null;
  status: string | null;
};

export async function getTherapistByAnySlug(slug: string): Promise<{
  therapist: TherapistPublic | null;
  canonicalSlug: string | null;
}> {
  const supabase = await supabaseServer();

  const direct = await supabase
    .from("therapists")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (direct.data) {
    return { therapist: direct.data as TherapistPublic, canonicalSlug: direct.data.slug };
  }

  const history = await supabase
    .from("therapist_slug_redirects")
    .select("therapist_id,new_slug")
    .eq("old_slug", slug)
    .maybeSingle();

  if (!history.data?.therapist_id || !history.data?.new_slug) {
    return { therapist: null, canonicalSlug: null };
  }

  const canonical = await supabase
    .from("therapists")
    .select("*")
    .eq("user_id", history.data.therapist_id)
    .maybeSingle();

  return {
    therapist: (canonical.data ?? null) as TherapistPublic | null,
    canonicalSlug: history.data.new_slug,
  };
}

export async function listTherapistsByCity(citySlug: string, segment?: string) {
  const supabase = await supabaseServer();

  const q = supabase
    .from("public_profiles")
    .select("id,slug,display_name,profile_photo,city_slug,updated_at")
    .eq("city_slug", citySlug)
    .order("updated_at", { ascending: false })
    .limit(60);

  if (segment) {
    // Placeholder: adapt when you have a dedicated segment/tag table
  }

  const res = await q;
  return (res.data ?? []) as Array<{
    id: string;
    slug: string | null;
    display_name: string | null;
    profile_photo: string | null;
    city_slug: string | null;
    updated_at: string | null;
  }>;
}
