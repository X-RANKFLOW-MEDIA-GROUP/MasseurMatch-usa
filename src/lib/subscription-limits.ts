export type SubscriptionPlan = "free" | "pro" | "premium";

export const PHOTO_LIMITS: Record<SubscriptionPlan, { profile: number; gallery: number }> = {
  free: { profile: 1, gallery: 3 },
  pro: { profile: 1, gallery: 10 },
  premium: { profile: 1, gallery: -1 }, // -1 = unlimited
};

export const FEATURE_LIMITS: Record<SubscriptionPlan, {
  photos: { profile: number; gallery: number };
  boosted: boolean;
  verified: boolean;
  analytics: boolean;
  priority_support: boolean;
  featured_listing: boolean;
}> = {
  free: {
    photos: { profile: 1, gallery: 3 },
    boosted: false,
    verified: false,
    analytics: false,
    priority_support: false,
    featured_listing: false,
  },
  pro: {
    photos: { profile: 1, gallery: 10 },
    boosted: true,
    verified: false,
    analytics: true,
    priority_support: true,
    featured_listing: true,
  },
  premium: {
    photos: { profile: 1, gallery: -1 },
    boosted: true,
    verified: true,
    analytics: true,
    priority_support: true,
    featured_listing: true,
  },
};

export function canUploadPhoto(
  plan: SubscriptionPlan,
  type: "profile" | "gallery",
  currentCount: number
): { allowed: boolean; limit: number; remaining: number } {
  const limit = PHOTO_LIMITS[plan][type];

  if (limit === -1) {
    return { allowed: true, limit: -1, remaining: -1 };
  }

  return {
    allowed: currentCount < limit,
    limit,
    remaining: Math.max(0, limit - currentCount),
  };
}

export function getUpgradeMessage(plan: SubscriptionPlan, type: "profile" | "gallery"): string {
  if (plan === "free") {
    return "Upgrade to Pro to upload up to 10 gallery photos";
  }
  if (plan === "pro" && type === "gallery") {
    return "Upgrade to Premium for unlimited gallery photos";
  }
  return "";
}
