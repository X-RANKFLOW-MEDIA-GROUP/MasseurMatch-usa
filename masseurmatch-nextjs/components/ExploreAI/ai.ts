export type PressureLevel = "light" | "medium" | "firm";
export type GenderPreference = "male" | "female" | "any";
export type ModePreference = "incall" | "outcall" | "any";
export type AvailabilityWindow = "now" | "today" | "this-week" | "anytime";

export interface BudgetRange {
  min: number;
  max: number;
}

export interface AiSignals {
  specialties: Record<string, number>;
  services: Record<string, number>;
  modes: Record<ModePreference, number>;
}

export interface Preferences {
  location: {
    lat: number;
    lng: number;
    zipCode: string;
    radius: number;
  };
  massageTypes: string[];
  pressure: PressureLevel;
  gender: GenderPreference;
  mode: ModePreference;
  availability: AvailabilityWindow;
  budget: BudgetRange;
  painPoints: string[];
  aiSignals?: AiSignals;
}

export interface TherapistRow {
  user_id: string;
  display_name?: string;
  slug?: string;
  latitude?: string;
  longitude?: string;
  rating?: number;
  review_count?: number;
  profile_photo?: string;
  services?: string[];
  massage_techniques?: string[];
  specialties?: string[];
  availability?: Record<string, unknown>;
  status?: string;
  city?: string;
  state?: string;
  phone?: string;
  mobile_service_radius?: number;
  mobile_extras?: string[];
  headline?: string;
  about?: string;
  distance?: number;
  rate_60?: string;
  rate_90?: string;
  rate_outcall?: string;
  created_at?: string;
}

export interface TherapistCard {
  id: string;
  slug?: string;
  name: string;
  photoUrl?: string;
  bio: string;
  headline?: string;
  distance: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  price: number | null;
  priceLabel: string;
  available: boolean;
  verified: boolean;
  mobile: boolean;
  mode: ModePreference;
  gender?: GenderPreference;
  specialties: string[];
  services: string[];
  aiExplanation: string;
  matchScore: number;
  latitude?: number;
  longitude?: number;
}

export const DEFAULT_PREFERENCES: Preferences = {
  location: { lat: 0, lng: 0, zipCode: "", radius: 25 },
  massageTypes: [],
  pressure: "medium",
  gender: "any",
  mode: "any",
  availability: "anytime",
  budget: { min: 50, max: 200 },
  painPoints: [],
};

export function createPreferenceDraft(): Preferences {
  return {
    ...DEFAULT_PREFERENCES,
    location: { ...DEFAULT_PREFERENCES.location },
    budget: { ...DEFAULT_PREFERENCES.budget },
    aiSignals: undefined,
  };
}

const availabilityWeights: Record<AvailabilityWindow, number> = {
  now: 4,
  today: 3,
  "this-week": 2,
  anytime: 1,
};

const WEIGHTS = {
  massageTypes: 0.3,
  pressure: 0.2,
  gender: 0.15,
  distance: 0.15,
  price: 0.1,
  availability: 0.1,
};

function parsePrice(value?: string): number | null {
  if (!value) return null;
  const normalized = value.replace(/[^0-9.]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatPrice(value: number | null): string {
  if (!value) return "Custom";
  return `$${value.toFixed(0)}/hr`;
}

function calculateAiSpecialtyBoost(preferences: Preferences, specialties: string[] = []): number {
  if (!preferences.aiSignals) return 0;
  return specialties.reduce((total, specialty) => total + (preferences.aiSignals?.specialties[specialty] ?? 0), 0);
}

export function buildTagsFromRow(row: TherapistRow, mode: ModePreference): string[] {
  const tags: string[] = [];
  const specialties = row.specialties ?? row.services ?? [];
  if (specialties.length) {
    tags.push(...specialties.slice(0, 3));
  }
  if (row.mobile_extras && row.mobile_extras.length) {
    tags.push("Mobile");
  }
  tags.push(mode === "outcall" ? "Out-call" : "In-call");
  if (row.status === "active") {
    tags.push("Verified");
  }
  return tags;
}

function getModeFromRow(row: TherapistRow): ModePreference {
  if (row.mobile_service_radius && row.mobile_service_radius > 0) {
    return "outcall";
  }
  if (row.mobile_extras && row.mobile_extras.length) {
    return "outcall";
  }
  return "incall";
}

export function calculateMatchScore(preferences: Preferences, therapist: Partial<TherapistCard>): number {
  const specialties = therapist.specialties ?? therapist.services ?? [];
  const typeMatchCount = specialties.filter((type) => preferences.massageTypes.includes(type)).length;
  const typeScore = preferences.massageTypes.length
    ? Math.min(typeMatchCount / preferences.massageTypes.length, 1)
    : 0.5;
  const boost = calculateAiSpecialtyBoost(preferences, specialties);
  const adjustedTypeScore = Math.min(1, typeScore + Math.min(boost * 0.03, 0.3));

  const pressureScore = therapist.mode === preferences.mode && preferences.mode !== "any" ? 1 : 0.5;
  const genderScore = preferences.gender === "any" || preferences.gender === (therapist.gender ?? "any") ? 1 : 0;

  const radiusKm = Math.max(preferences.location.radius, 1);
  const distanceKm = therapist.distance || 0;
  const distanceScore = Math.max(0, 1 - distanceKm / radiusKm);

  const priceScore = (() => {
    if (!therapist.price || !preferences.budget.max) return 0.5;
    if (therapist.price <= preferences.budget.max) return 1;
    const delta = therapist.price - preferences.budget.max;
    return Math.max(0, 1 - delta / (preferences.budget.max || 1));
  })();

  const prefRank = availabilityWeights[preferences.availability] ?? 1;
  const availabilityScore = Math.min(1, prefRank / 4);

  const rawScore =
    WEIGHTS.massageTypes * adjustedTypeScore +
    WEIGHTS.pressure * pressureScore +
    WEIGHTS.gender * genderScore +
    WEIGHTS.distance * distanceScore +
    WEIGHTS.price * priceScore +
    WEIGHTS.availability * availabilityScore;

  return Math.min(1, Math.max(0, rawScore)) * 100;
}

export function generateAiExplanation(preferences: Preferences, therapist: TherapistCard): string {
  const reasons: string[] = [];
  const typeMatches = therapist.specialties.filter((type) =>
    preferences.massageTypes.includes(type)
  );

  if (typeMatches.length) {
    reasons.push(`Combina com sua preferencia por ${typeMatches.slice(0, 2).join(", ")}`);
  }
  if (therapist.price && therapist.price <= preferences.budget.max) {
    reasons.push(`Dentro do seu budget em $${preferences.budget.max}/hr`);
  }
  if (therapist.distance <= preferences.location.radius) {
    reasons.push(`Apenas ${therapist.distance.toFixed(1)}km de distancia`);
  }
  if (therapist.mode === preferences.mode && preferences.mode !== "any") {
    reasons.push(`Oferece ${therapist.mode === "outcall" ? "sessao out-call" : "sessao in-call"}`);
  }
  if (therapist.tags.includes("Verified")) {
    reasons.push(`Perfil confirmado com ${therapist.reviewCount} reviews`);
  }

  if (reasons.length === 0) {
    reasons.push(`Top rated ${therapist.rating}? com ${therapist.reviewCount} reviews e ${therapist.bio}`);
  }

  return `Recomendado porque ${reasons.slice(0, 3).join("; ")}.`;
}

export function buildBaseCard(row: TherapistRow, preferences: Preferences): Omit<TherapistCard, "matchScore" | "aiExplanation"> {
  const lat = row.latitude ? Number(row.latitude) : undefined;
  const lng = row.longitude ? Number(row.longitude) : undefined;
  const distanceKm = row.distance ? Number(row.distance) / 1000 : 0;
  const mode = getModeFromRow(row);
  const availabilityBool = row.availability ? true : true;
  const price = parsePrice(row.rate_60 ?? row.rate_90 ?? row.rate_outcall);
  const tags = buildTagsFromRow(row, mode);
  const specialties = row.specialties ?? row.services ?? [];
  const services = row.services ?? [];

  return {
    id: row.user_id,
    slug: row.slug,
    name: row.display_name ?? row.headline ?? "Therapist",
    photoUrl: row.profile_photo,
    bio: row.headline ?? row.about ?? "Experiencia premium de massagem.",
    headline: row.headline,
    distance: Number(distanceKm.toFixed(1)),
    rating: Number(row.rating ?? 0),
    reviewCount: row.review_count ?? 0,
    tags,
    price,
    priceLabel: formatPrice(price),
    available: availabilityBool,
    verified: row.status === "active",
    mobile: mode === "outcall",
    mode,
    gender: "any",
    specialties,
    services,
    aiExplanation: "",
    matchScore: 0,
    latitude: lat,
    longitude: lng,
  };
}

export function buildTherapistCard(row: TherapistRow, preferences: Preferences): TherapistCard {
  const base = buildBaseCard(row, preferences);
  const score = Math.round(
    Math.min(100, Math.max(60, calculateMatchScore(preferences, base) + (Math.random() - 0.5) * 4))
  );
  return {
    ...base,
    matchScore: score,
    aiExplanation: generateAiExplanation(preferences, { ...base, matchScore: score, aiExplanation: "" }),
  };
}
