// View Guarantee System
// Guarantees are based on unique profile views (deduplicated)
// If not met, user gets 50% off next month

import type { SupabaseClient } from "@supabase/supabase-js";

export type PlanGuarantee = {
  plan: string;
  guaranteedViews: number;
  discountIfNotMet: number; // Percentage
  periodDays: number;
};

// Guarantee structure by plan
export const PLAN_GUARANTEES: PlanGuarantee[] = [
  {
    plan: "free",
    guaranteedViews: 0, // No guarantee for free plan
    discountIfNotMet: 0,
    periodDays: 30,
  },
  {
    plan: "standard",
    guaranteedViews: 25,
    discountIfNotMet: 50,
    periodDays: 30,
  },
  {
    plan: "pro",
    guaranteedViews: 50,
    discountIfNotMet: 50,
    periodDays: 30,
  },
  {
    plan: "elite",
    guaranteedViews: 100,
    discountIfNotMet: 50,
    periodDays: 30,
  },
];

export function getGuaranteeForPlan(plan: string): PlanGuarantee | null {
  return PLAN_GUARANTEES.find((g) => g.plan === plan) || null;
}

export type GuaranteeStatus = {
  plan: string;
  guaranteedViews: number;
  currentViews: number;
  percentProgress: number;
  daysRemaining: number;
  periodStartDate: string;
  periodEndDate: string;
  isGuaranteeMet: boolean;
  eligibleForDiscount: boolean;
  discountPercent: number;
  projectedViews: number; // Based on current rate
};

export function calculateGuaranteeStatus(
  plan: string,
  currentViews: number,
  periodStartDate: Date,
  periodEndDate: Date
): GuaranteeStatus {
  const guarantee = getGuaranteeForPlan(plan);

  if (!guarantee || guarantee.guaranteedViews === 0) {
    return {
      plan,
      guaranteedViews: 0,
      currentViews,
      percentProgress: 100,
      daysRemaining: 0,
      periodStartDate: periodStartDate.toISOString(),
      periodEndDate: periodEndDate.toISOString(),
      isGuaranteeMet: true,
      eligibleForDiscount: false,
      discountPercent: 0,
      projectedViews: currentViews,
    };
  }

  const now = new Date();
  const totalDays = Math.ceil(
    (periodEndDate.getTime() - periodStartDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysElapsed = Math.ceil(
    (now.getTime() - periodStartDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysRemaining = Math.max(0, totalDays - daysElapsed);

  // Calculate progress
  const percentProgress = Math.min(
    100,
    Math.round((currentViews / guarantee.guaranteedViews) * 100)
  );

  // Project views based on current rate
  const dailyRate = daysElapsed > 0 ? currentViews / daysElapsed : 0;
  const projectedViews = Math.round(currentViews + dailyRate * daysRemaining);

  // Check if guarantee is met
  const isGuaranteeMet = currentViews >= guarantee.guaranteedViews;

  // Check if eligible for discount (period ended and guarantee not met)
  const periodEnded = now >= periodEndDate;
  const eligibleForDiscount = periodEnded && !isGuaranteeMet;

  return {
    plan,
    guaranteedViews: guarantee.guaranteedViews,
    currentViews,
    percentProgress,
    daysRemaining,
    periodStartDate: periodStartDate.toISOString(),
    periodEndDate: periodEndDate.toISOString(),
    isGuaranteeMet,
    eligibleForDiscount,
    discountPercent: eligibleForDiscount ? guarantee.discountIfNotMet : 0,
    projectedViews,
  };
}

// SQL schema for guarantee tracking
export const GUARANTEE_TRACKING_SQL = `
CREATE TABLE IF NOT EXISTS guarantee_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  plan TEXT NOT NULL,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  guaranteed_views INTEGER NOT NULL,
  actual_views INTEGER DEFAULT 0,
  guarantee_met BOOLEAN DEFAULT FALSE,
  discount_applied BOOLEAN DEFAULT FALSE,
  discount_percent INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, period_start)
);

CREATE INDEX idx_guarantee_user ON guarantee_periods(user_id);
CREATE INDEX idx_guarantee_period ON guarantee_periods(period_end);
`;

// Function to update view count for guarantee tracking
export async function updateGuaranteeViews(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  const now = new Date();

  // Get active guarantee period
  const { data: period } = await supabase
    .from("guarantee_periods")
    .select("*")
    .eq("user_id", userId)
    .lte("period_start", now.toISOString())
    .gte("period_end", now.toISOString())
    .single();

  if (!period) return;

  // Count unique views in this period
  const { count } = await supabase
    .from("profile_views")
    .select("viewer_hash", { count: "exact", head: true })
    .eq("therapist_id", userId)
    .gte("created_at", period.period_start)
    .lte("created_at", period.period_end);

  // Update the period
  await supabase
    .from("guarantee_periods")
    .update({
      actual_views: count || 0,
      guarantee_met: (count || 0) >= period.guaranteed_views,
    })
    .eq("id", period.id);
}
