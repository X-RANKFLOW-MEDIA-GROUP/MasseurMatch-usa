// Referral system with tiered discounts
// Discounts are percentage-based and scale with referral count

export type ReferralTier = {
  minReferrals: number;
  discountPercent: number;
  label: string;
  description: string;
};

// Tiered discount structure - scales with number of successful referrals
export const REFERRAL_TIERS: ReferralTier[] = [
  {
    minReferrals: 1,
    discountPercent: 10,
    label: "Starter",
    description: "10% off your next month",
  },
  {
    minReferrals: 3,
    discountPercent: 25,
    label: "Connector",
    description: "25% off your next month",
  },
  {
    minReferrals: 5,
    discountPercent: 50,
    label: "Ambassador",
    description: "50% off your next month",
  },
  {
    minReferrals: 10,
    discountPercent: 100,
    label: "Champion",
    description: "1 month FREE",
  },
];

// What the referred person gets
export const REFEREE_BONUS = {
  discountPercent: 20,
  description: "20% off first month",
};

export type ReferralStats = {
  totalReferrals: number;
  pendingReferrals: number;
  successfulReferrals: number;
  currentTier: ReferralTier | null;
  nextTier: ReferralTier | null;
  referralsToNextTier: number;
  totalEarned: number; // In dollars saved
  referralCode: string;
};

export function getCurrentTier(successfulReferrals: number): ReferralTier | null {
  // Find highest tier achieved
  let currentTier: ReferralTier | null = null;

  for (const tier of REFERRAL_TIERS) {
    if (successfulReferrals >= tier.minReferrals) {
      currentTier = tier;
    }
  }

  return currentTier;
}

export function getNextTier(successfulReferrals: number): ReferralTier | null {
  for (const tier of REFERRAL_TIERS) {
    if (successfulReferrals < tier.minReferrals) {
      return tier;
    }
  }
  return null; // Already at highest tier
}

export function getReferralsToNextTier(successfulReferrals: number): number {
  const nextTier = getNextTier(successfulReferrals);
  if (!nextTier) return 0;
  return nextTier.minReferrals - successfulReferrals;
}

export function generateReferralCode(userId: string): string {
  // Generate a short, memorable code from userId
  const hash = userId.slice(0, 8).toUpperCase();
  return `MM-${hash}`;
}

export function calculateDiscount(
  planPrice: number,
  successfulReferrals: number
): { discount: number; finalPrice: number; tier: ReferralTier | null } {
  const tier = getCurrentTier(successfulReferrals);

  if (!tier) {
    return { discount: 0, finalPrice: planPrice, tier: null };
  }

  const discount = (planPrice * tier.discountPercent) / 100;
  const finalPrice = planPrice - discount;

  return {
    discount,
    finalPrice: Math.max(0, finalPrice),
    tier,
  };
}

// Referral status types
export type ReferralStatus = "pending" | "signed_up" | "subscribed" | "expired";

export type Referral = {
  id: string;
  referrer_id: string;
  referee_email: string;
  referee_id?: string;
  status: ReferralStatus;
  referral_code: string;
  created_at: string;
  converted_at?: string;
  plan_subscribed?: string;
};

// SQL schema for referrals table
export const REFERRALS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id),
  referee_email TEXT,
  referee_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'pending',
  referral_code TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  converted_at TIMESTAMPTZ,
  plan_subscribed TEXT,
  discount_applied BOOLEAN DEFAULT FALSE,
  UNIQUE(referee_email, referrer_id)
);

CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_code ON referrals(referral_code);
CREATE INDEX idx_referrals_status ON referrals(status);
`;
