import { supabaseAdmin } from '@/server/supabaseAdmin';

export type TherapistRecord = {
  user_id: string;
  slug: string;
  display_name?: string | null;
  full_name?: string | null;
  headline?: string | null;
  about?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  city_slug?: string | null;
  profile_photo?: string | null;
  gallery?: Array<string | { id?: string; url?: string }> | null;
  services?: string[] | string | null;
  massage_techniques?: string[] | string | null;
  rating?: number | null;
  override_reviews_count?: number | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  instagram?: string | null;
  whatsapp?: string | null;
  rate_60?: string | null;
  rate_90?: string | null;
  rate_outcall?: string | null;
  publication_status?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  address?: string | null;
  neighborhood?: string | null;
  zip_code?: string | null;
  mobile_service_radius?: number | null;
  languages?: string[] | string | null;
  availability?: unknown;
  services_headline?: string | null;
  status?: string | null;
};

export async function getTherapistBySlug(
  slug: string
): Promise<{ therapist: TherapistRecord | null; canonicalSlug: string | null }> {
  const { data: therapist } = await supabaseAdmin
    .from('therapists')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .maybeSingle();

  if (therapist) {
    return { therapist, canonicalSlug: therapist.slug };
  }

  const { data: redirect } = await supabaseAdmin
    .from('therapist_slug_redirects')
    .select('therapist_id')
    .eq('old_slug', slug)
    .maybeSingle();

  if (!redirect?.therapist_id) {
    return { therapist: null, canonicalSlug: null };
  }

  const { data: therapistById } = await supabaseAdmin
    .from('therapists')
    .select('*')
    .eq('user_id', redirect.therapist_id)
    .eq('status', 'active')
    .maybeSingle();

  return {
    therapist: therapistById,
    canonicalSlug: therapistById?.slug ?? null,
  };
}
