export const ONBOARDING_STAGES = [
  "profile_setup",
  "review_pending",
  "choose_plan",
  "payment_pending",
  "identity_verify",
  "live",
] as const;

export type OnboardingStage = (typeof ONBOARDING_STAGES)[number];

export const AUTO_MODERATION_STATUSES = [
  "draft",
  "auto_passed",
  "auto_flagged",
  "auto_blocked",
] as const;

export type AutoModerationStatus = (typeof AUTO_MODERATION_STATUSES)[number];
