import { supabaseAdmin } from '@/server/supabaseAdmin';

export type WeeklyPromotion = {
  id: string;
  title: string;
  description?: string | null;
  discount_text?: string | null;
  start_date: string;
  end_date: string;
  badge_color?: string | null;
};

export type AvailabilityStatus = 'available' | 'visiting_now' | 'visiting_soon' | 'offline';

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
  availability_status?: AvailabilityStatus | null;
  last_status_update?: string | null;
  travel_city?: string | null;
  travel_state?: string | null;
  travel_start_date?: string | null;
  travel_end_date?: string | null;
  services_headline?: string | null;
  status?: string | null;
  active_promotions?: WeeklyPromotion[] | null;
};

async function fetchActivePromotions(userId: string): Promise<WeeklyPromotion[]> {
  const { data } = await supabaseAdmin
    .from('therapist_promotions')
    .select('id, title, description, discount_text, start_date, end_date, badge_color')
    .eq('therapist_id', userId)
    .eq('is_active', true)
    .lte('start_date', new Date().toISOString())
    .gte('end_date', new Date().toISOString())
    .order('display_order', { ascending: true })
    .limit(3);

  return data || [];
}

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
    const promotions = await fetchActivePromotions(therapist.user_id);
    return {
      therapist: { ...therapist, active_promotions: promotions },
      canonicalSlug: therapist.slug
    };
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

  if (therapistById) {
    const promotions = await fetchActivePromotions(therapistById.user_id);
    return {
      therapist: { ...therapistById, active_promotions: promotions },
      canonicalSlug: therapistById.slug,
    };
  }

  return {
    therapist: null,
    canonicalSlug: null,
  };
}
