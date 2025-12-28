// Public profile types and helper functions for SEO-optimized therapist profiles

export type PlanTier = "free" | "standard" | "pro" | "elite";

export type PublicPhoto = {
  url: string;
  alt?: string | null;
  sort_order?: number | null;
};

export type PublicProfile = {
  therapist_id: string;
  profile_id: string;

  // Routing & Location
  city_slug: string;
  city_name: string;
  state_code: string;

  // Identity
  slug: string;
  display_name: string;

  // Publication Gates
  status: "draft" | "published" | string;
  published_at: string | null;
  updated_at: string | null;

  // Content
  short_bio: string | null;
  long_bio: string | null;
  services: string[] | null;
  modalities: string[] | null;
  languages: string[] | null;
  availability_note: string | null;

  // Service Modes
  incall_enabled: boolean;
  outcall_enabled: boolean;

  // Pricing
  price_from: number | null;
  price_to: number | null;
  currency: string | null;

  // Areas Served
  service_areas: { city_name: string; city_slug: string; state_code: string }[] | null;

  // Media
  photos: PublicPhoto[] | null;

  // Contact Methods
  contact_phone: string | null;
  contact_email: string | null;
  contact_website: string | null;
  contact_instagram: string | null;

  // Plan (affects photo limit)
  plan_tier: PlanTier;
};

/**
 * Get maximum number of photos allowed by plan tier
 */
export function planPhotoLimit(plan: PlanTier): number {
  switch (plan) {
    case "free":
      return 1;
    case "standard":
      return 6;
    case "pro":
      return 12;
    case "elite":
      return 24;
    default:
      return 1;
  }
}

/**
 * Check if a profile meets all requirements to be indexed by search engines
 */
export function isIndexable(p: PublicProfile): boolean {
  const required =
    Boolean(p.slug) &&
    Boolean(p.display_name) &&
    Boolean(p.city_slug) &&
    Boolean(p.city_name) &&
    Boolean(p.state_code) &&
    Boolean(p.short_bio) &&
    Boolean(p.published_at);

  const hasMode = Boolean(p.incall_enabled || p.outcall_enabled);

  return required && hasMode && p.status === "published";
}

/**
 * Generate SEO-optimized alt text for profile photos
 */
export function safeAlt(p: PublicProfile, photo: PublicPhoto, index: number): string {
  const base = `${p.display_name} profile photo`;
  const city = `in ${p.city_name}, ${p.state_code}`;
  const explicit = (photo.alt || "").trim();

  if (explicit.length >= 6) return explicit;
  if (index === 0) return `${base} ${city}`;

  return `${p.display_name} photo ${index + 1} ${city}`;
}

/**
 * Format price range for display
 */
export function moneyRange(p: PublicProfile): string | null {
  const cur = (p.currency || "USD").toUpperCase();

  if (p.price_from != null && p.price_to != null) {
    return `${cur} ${p.price_from} to ${p.price_to}`;
  }

  if (p.price_from != null) {
    return `${cur} from ${p.price_from}`;
  }

  return null;
}

/**
 * Generate canonical URL for a profile
 */
export function canonicalUrl(p: PublicProfile): string {
  return `https://masseurmatch.com/${p.city_slug}/therapist/${p.slug}`;
}

/**
 * Generate SEO title for profile page
 */
export function seoTitle(p: PublicProfile): string {
  return `${p.display_name} - Massage Therapist in ${p.city_name}, ${p.state_code} | MasseurMatch`;
}

/**
 * Generate SEO description for profile page
 */
export function seoDescription(p: PublicProfile): string {
  const bio = p.short_bio || `Massage therapist in ${p.city_name}`;
  const services = p.services?.slice(0, 3).join(", ") || "massage services";

  return `${p.display_name}, ${bio}. Offering ${services}. ${
    p.incall_enabled ? "In-call" : ""
  } ${p.outcall_enabled ? "out-call" : ""} available in ${p.city_name}, ${p.state_code}.`.trim();
}
