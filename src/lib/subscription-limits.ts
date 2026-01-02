export type SubscriptionPlan = "free" | "standard" | "pro" | "elite";

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    photos: 3,
    slides: 1,
    cities: 1,
    visitor_cities: 0,
    available_now_daily: 3,
    highlight_credits: 0,
    verified_badge: false,
    analytics: false,
    heatmap: false,
    vip_support: false,
    concierge: false,
    top_homepage: false,
    auto_available: false,
    trial_days: 7,
  },
  standard: {
    name: "Standard",
    price: 49,
    photos: 5,
    slides: 2,
    cities: 1,
    visitor_cities: 1,
    available_now_daily: 6,
    highlight_credits: 0,
    verified_badge: true,
    analytics: false,
    heatmap: false,
    vip_support: false,
    concierge: false,
    top_homepage: false,
    auto_available: false,
    trial_days: 0,
  },
  pro: {
    name: "Pro",
    price: 89,
    photos: 6,
    slides: 2,
    cities: 1,
    visitor_cities: 3,
    available_now_daily: -1, // unlimited
    highlight_credits: 1,
    verified_badge: true,
    analytics: true,
    heatmap: true,
    vip_support: false,
    concierge: false,
    top_homepage: false,
    auto_available: false,
    trial_days: 0,
    popular: true,
  },
  elite: {
    name: "Elite",
    price: 149,
    photos: 8,
    slides: 3,
    cities: 1,
    visitor_cities: -1, // unlimited
    available_now_daily: -1,
    highlight_credits: 2,
    verified_badge: true,
    analytics: true,
    heatmap: true,
    vip_support: true,
    concierge: true,
    top_homepage: true,
    auto_available: true, // every 2h
    trial_days: 0,
  },
} as const;

export const PHOTO_LIMITS: Record<SubscriptionPlan, number> = {
  free: 3,
  standard: 5,
  pro: 6,
  elite: 8,
};

export function canUploadPhoto(
  plan: SubscriptionPlan,
  currentCount: number
): { allowed: boolean; limit: number; remaining: number } {
  const limit = PHOTO_LIMITS[plan];

  return {
    allowed: currentCount < limit,
    limit,
    remaining: Math.max(0, limit - currentCount),
  };
}

export function getUpgradeMessage(plan: SubscriptionPlan): string {
  switch (plan) {
    case "free":
      return "Upgrade to Standard for 5 photos and verified badge";
    case "standard":
      return "Upgrade to Pro for 6 photos, analytics, and city heatmap";
    case "pro":
      return "Upgrade to Elite for 8 photos, top placement, and VIP support";
    default:
      return "";
  }
}

export function canUseAvailableNow(
  plan: SubscriptionPlan,
  usedToday: number
): { allowed: boolean; limit: number; remaining: number } {
  const limit = PLANS[plan].available_now_daily;

  if (limit === -1) {
    return { allowed: true, limit: -1, remaining: -1 };
  }

  return {
    allowed: usedToday < limit,
    limit,
    remaining: Math.max(0, limit - usedToday),
  };
}

export function getVisitorCitiesLimit(plan: SubscriptionPlan): number {
  return PLANS[plan].visitor_cities;
}
