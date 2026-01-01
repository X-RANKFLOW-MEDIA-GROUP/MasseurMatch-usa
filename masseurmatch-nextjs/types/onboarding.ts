export const ONBOARDING_STAGES = [
  "start",
  "needs_plan",
  "needs_payment",
  "needs_identity",
  "build_profile",
  "upload_photos",
  "fix_moderation",
  "submit_admin",
  "waiting_admin",
  "live",
  "blocked",
] as const;

export type OnboardingStage = (typeof ONBOARDING_STAGES)[number];

export const AUTO_MODERATION_STATUSES = [
  "draft",
  "auto_passed",
  "auto_flagged",
  "auto_blocked",
] as const;

export type AutoModerationStatus = (typeof AUTO_MODERATION_STATUSES)[number];
