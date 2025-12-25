import { AutoModerationStatus, OnboardingStage } from "@/types/onboarding";
import { SubscriptionPlan, SubscriptionStatus } from "@/types/subscription";

export interface DbUser {
  id: string;
  email: string | null;
  identity_status: "pending" | "verified" | "failed";
  role: "user" | "admin";
  stripe_customer_id?: string | null;
  stripe_identity_session_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbProfile {
  id: string;
  user_id: string;
  display_name?: string | null;
  headline?: string | null;
  city?: string | null;
  city_slug?: string | null;
  state?: string | null;
  zip_code?: string | null;
  phone_public_e164?: string | null;
  onboarding_stage: OnboardingStage;
  auto_moderation: AutoModerationStatus;
  admin_status: "pending_admin" | "approved" | "rejected" | "changes_requested";
  publication_status: "private" | "public";
  submitted_at?: string | null;
  approved_at?: string | null;
  admin_notes?: string | null;
  rejection_reason?: string | null;
  base_rate_per_min_cents?: number | null;
  profile_photo?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbSubscriptionRecord {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  trial_start?: string | null;
  trial_end?: string | null;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

export interface DbMediaAsset {
  id: string;
  profile_id: string;
  type: "photo" | "video";
  status: "pending" | "approved" | "rejected";
  storage_path: string;
  public_url?: string | null;
  thumbnail_url?: string | null;
  position: number;
  is_cover: boolean;
  sightengine_score?: number | null;
  sightengine_response?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}
