// Database types based on Supabase schema

export type IdentityStatus = 'pending' | 'verified' | 'failed';
export type UserRole = 'user' | 'admin';
export type SubscriptionPlan = 'free' | 'standard' | 'pro' | 'elite';
export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled';
export type OnboardingStage =
  | 'profile_setup'
  | 'review_pending'
  | 'choose_plan'
  | 'payment_pending'
  | 'identity_verify'
  | 'live';
export type AutoModeration = 'draft' | 'auto_passed' | 'auto_flagged' | 'auto_blocked';
export type AdminStatus = 'pending_admin' | 'approved' | 'rejected';
export type PublicationStatus = 'private' | 'public';
export type MediaStatus = 'pending' | 'approved' | 'rejected';
export type MediaType = 'photo' | 'video';
export type RateContext = 'incall' | 'outcall';
export type SwipeAction = 'swipe_left' | 'swipe_right' | 'swipe_up';

export interface User {
  id: string;
  created_at: string;
  updated_at: string;
  identity_status: IdentityStatus;
  role: UserRole;
  stripe_customer_id?: string;
  stripe_identity_session_id?: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripe_subscription_id: string;
  trial_start?: string;
  trial_end?: string;
  current_period_start?: string;
  current_period_end?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  onboarding_stage: OnboardingStage;
  auto_moderation: AutoModeration;
  admin_status: AdminStatus;
  publication_status: PublicationStatus;
  submitted_at?: string;
  approved_at?: string;
  admin_notes?: string;
  rejection_reason?: string;
  base_rate_per_min_cents: number;
  created_at: string;
  updated_at: string;
}

export interface MediaAsset {
  id: string;
  profile_id: string;
  status: MediaStatus;
  type: MediaType;
  storage_path: string;
  public_url?: string;
  thumbnail_url?: string;
  position: number;
  is_cover: boolean;
  sightengine_response?: Record<string, any>;
  sightengine_score?: number;
  created_at: string;
  updated_at: string;
}

export interface ProfileRate {
  id: string;
  profile_id: string;
  context: RateContext;
  duration_minutes: number;
  price_cents: number;
  created_at: string;
  updated_at: string;
}

export interface ProfileHours {
  id: string;
  profile_id: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  is_closed: boolean;
  open_time?: string;
  close_time?: string;
  created_at: string;
  updated_at: string;
}

export interface ExploreSwipeEvent {
  id: string;
  user_id: string;
  profile_id: string;
  action: SwipeAction;
  match_score: number;
  created_at: string;
}

// Extended types for UI

export interface ProfileWithDetails extends Profile {
  user?: User;
  media_assets?: MediaAsset[];
  profile_rates?: ProfileRate[];
  profile_hours?: ProfileHours[];
}

export interface TherapistCardData {
  id: string;
  name: string;
  photo: string;
  age?: number;
  city: string;
  state: string;
  distance?: string;
  rating?: number;
  reviewCount?: number;
  services: string[];
  bio: string;
}

export interface AnalyticsData {
  views: number;
  viewsChange: number;
  likes: number;
  likesChange: number;
  calls: number;
  callsChange: number;
  messages: number;
  messagesChange: number;
  topCities?: Array<{ city: string; count: number }>;
  weeklyViews?: Array<{ day: string; count: number }>;
}
