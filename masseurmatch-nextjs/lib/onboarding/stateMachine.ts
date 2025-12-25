/**
 * MasseurMatch - Onboarding State Machine
 *
 * Manages profile onboarding states and transitions
 */

// ============================================================================
// Types
// ============================================================================

export type IdentityStatus = 'pending' | 'verified' | 'failed';
export type UserRole = 'user' | 'admin';

export type SubscriptionPlan = 'standard' | 'pro' | 'elite';
export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled';

export type AutoModeration = 'draft' | 'auto_passed' | 'auto_flagged' | 'auto_blocked';
export type AdminStatus = 'pending_admin' | 'approved' | 'rejected' | 'changes_requested';
export type PublicationStatus = 'private' | 'public';

export type OnboardingStage =
  | 'start'
  | 'needs_plan'
  | 'needs_payment'
  | 'needs_identity'
  | 'build_profile'
  | 'upload_photos'
  | 'fix_moderation'
  | 'submit_admin'
  | 'waiting_admin'
  | 'live'
  | 'blocked';

export type MediaStatus = 'pending' | 'approved' | 'rejected';
export type RateContext = 'incall' | 'outcall';

// ============================================================================
// Interfaces
// ============================================================================

export interface User {
  id: string;
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
  trial_end?: Date;
  current_period_end: Date;
}

export interface Profile {
  id: string;
  user_id: string;
  auto_moderation: AutoModeration;
  admin_status: AdminStatus;
  publication_status: PublicationStatus;
  onboarding_stage: OnboardingStage;

  // Required fields
  display_name?: string;
  city_slug?: string;
  city_name?: string;
  region_code?: string;
  country_code?: string;
  phone_public_e164?: string;

  incall_enabled?: boolean;
  outcall_enabled?: boolean;

  submitted_at?: Date;
  approved_at?: Date;
  admin_notes?: string;
}

export interface MediaAsset {
  id: string;
  profile_id: string;
  status: MediaStatus;
  sightengine_response?: any;
}

export interface ProfileRate {
  id: string;
  profile_id: string;
  context: RateContext;
  duration_minutes: number;
  price_cents: number;
  is_active: boolean;
}

// ============================================================================
// Photo Limits
// ============================================================================

export const PHOTO_LIMITS: Record<'free' | SubscriptionPlan, number> = {
  free: 1,
  standard: 4,
  pro: 8,
  elite: 12,
};

// ============================================================================
// Validation Checklist
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  missing: string[];
}

export interface ProfileRequirements {
  identityVerified: boolean;
  moderationPassed: boolean;
  hasDisplayName: boolean;
  hasCity: boolean;
  hasPhone: boolean;
  hasLanguages: boolean;
  hasServices: boolean;
  hasSetups: boolean;
  hasHours: boolean;
  hasRates: boolean;
  hasApprovedPhoto: boolean;
  hasActiveSubscription: boolean;
}

/**
 * Check if profile meets all requirements for admin submission
 */
export async function canSubmitForReview(
  profile: Profile,
  user: User,
  subscription: Subscription | null,
  counts: {
    approvedPhotos: number;
    languages: number;
    services: number;
    setups: number;
    incallRates: number;
    outcallRates: number;
  }
): Promise<ValidationResult> {
  const missing: string[] = [];

  // A) Identity
  if (user.identity_status !== 'verified') {
    missing.push('Identity verification required');
  }

  // B) Moderation
  if (profile.auto_moderation !== 'auto_passed') {
    missing.push('Content must pass automatic moderation');
  }

  // C) Required fields
  if (!profile.display_name?.trim()) {
    missing.push('Display name required');
  }
  if (!profile.city_slug) {
    missing.push('City required');
  }
  if (!profile.phone_public_e164) {
    missing.push('Phone number required');
  }

  // D) Relations
  if (counts.languages < 1) {
    missing.push('At least one language required');
  }
  if (counts.services < 1) {
    missing.push('At least one service required');
  }
  if (counts.setups < 1) {
    missing.push('At least one setup required');
  }

  // E) Rates
  if (profile.incall_enabled && counts.incallRates < 1) {
    missing.push('At least one incall rate required');
  }
  if (profile.outcall_enabled && counts.outcallRates < 1) {
    missing.push('At least one outcall rate required');
  }

  // F) Photos
  if (counts.approvedPhotos < 1) {
    missing.push('At least one approved photo required');
  }

  // G) Subscription (if paid plan)
  const hasSubscription = subscription !== null;
  if (hasSubscription && !['trialing', 'active'].includes(subscription.status)) {
    missing.push('Active subscription required');
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Check if profile can be published
 */
export function canPublishProfile(
  profile: Profile,
  user: User,
  subscription: Subscription | null
): ValidationResult {
  const missing: string[] = [];

  if (user.identity_status !== 'verified') {
    missing.push('Identity not verified');
  }

  if (profile.auto_moderation !== 'auto_passed') {
    missing.push('Auto moderation not passed');
  }

  if (profile.admin_status !== 'approved') {
    missing.push('Admin approval required');
  }

  if (profile.publication_status !== 'public') {
    missing.push('Publication status must be public');
  }

  // Check subscription if user has one
  const hasSubscription = subscription !== null;
  if (hasSubscription && !['trialing', 'active'].includes(subscription.status)) {
    missing.push('Active subscription required');
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

// ============================================================================
// State Transitions
// ============================================================================

export type TransitionEvent =
  | 'signup'
  | 'select_plan'
  | 'payment_success'
  | 'identity_verified'
  | 'identity_failed'
  | 'profile_saved'
  | 'photo_uploaded'
  | 'moderation_pass'
  | 'moderation_flag'
  | 'moderation_block'
  | 'submit_for_review'
  | 'admin_approve'
  | 'admin_request_changes'
  | 'admin_reject'
  | 'payment_failed'
  | 'edit_sensitive_field';

export interface Transition {
  from: OnboardingStage;
  to: OnboardingStage;
  event: TransitionEvent;
  condition?: (context: any) => boolean;
}

/**
 * State machine transitions
 */
export const transitions: Transition[] = [
  // Initial signup
  {
    from: 'start',
    to: 'needs_plan',
    event: 'signup',
  },

  // Plan selection
  {
    from: 'needs_plan',
    to: 'needs_identity',
    event: 'select_plan',
    condition: (ctx) => ctx.plan === 'free',
  },
  {
    from: 'needs_plan',
    to: 'needs_payment',
    event: 'select_plan',
    condition: (ctx) => ['standard', 'pro', 'elite'].includes(ctx.plan),
  },

  // Payment
  {
    from: 'needs_payment',
    to: 'needs_identity',
    event: 'payment_success',
  },

  // Identity verification
  {
    from: 'needs_identity',
    to: 'build_profile',
    event: 'identity_verified',
    condition: (ctx) => !ctx.profileComplete,
  },
  {
    from: 'needs_identity',
    to: 'submit_admin',
    event: 'identity_verified',
    condition: (ctx) => ctx.profileComplete && ctx.hasApprovedPhotos,
  },
  {
    from: 'needs_identity',
    to: 'blocked',
    event: 'identity_failed',
  },

  // Profile building
  {
    from: 'build_profile',
    to: 'fix_moderation',
    event: 'profile_saved',
    condition: (ctx) => ['auto_flagged', 'auto_blocked'].includes(ctx.auto_moderation),
  },
  {
    from: 'build_profile',
    to: 'upload_photos',
    event: 'profile_saved',
    condition: (ctx) => ctx.auto_moderation === 'auto_passed' && !ctx.hasApprovedPhotos,
  },
  {
    from: 'build_profile',
    to: 'submit_admin',
    event: 'profile_saved',
    condition: (ctx) => ctx.auto_moderation === 'auto_passed' && ctx.hasApprovedPhotos && ctx.canSubmit,
  },

  // Photo upload
  {
    from: 'upload_photos',
    to: 'submit_admin',
    event: 'photo_uploaded',
    condition: (ctx) => ctx.hasApprovedPhotos && ctx.canSubmit,
  },

  // Moderation fixes
  {
    from: 'fix_moderation',
    to: 'build_profile',
    event: 'moderation_pass',
  },

  // Submit for review
  {
    from: 'submit_admin',
    to: 'waiting_admin',
    event: 'submit_for_review',
  },

  // Admin actions
  {
    from: 'waiting_admin',
    to: 'live',
    event: 'admin_approve',
  },
  {
    from: 'waiting_admin',
    to: 'build_profile',
    event: 'admin_request_changes',
  },
  {
    from: 'waiting_admin',
    to: 'blocked',
    event: 'admin_reject',
  },

  // Post-publication edits
  {
    from: 'live',
    to: 'waiting_admin',
    event: 'edit_sensitive_field',
  },

  // Payment issues
  {
    from: 'live',
    to: 'needs_payment',
    event: 'payment_failed',
    condition: (ctx) => ctx.hasPaidPlan,
  },
];

/**
 * Get next stage based on event and current context
 */
export function getNextStage(
  currentStage: OnboardingStage,
  event: TransitionEvent,
  context: any = {}
): OnboardingStage | null {
  const validTransitions = transitions.filter(
    (t) => t.from === currentStage && t.event === event
  );

  for (const transition of validTransitions) {
    if (!transition.condition || transition.condition(context)) {
      return transition.to;
    }
  }

  return null;
}

/**
 * Calculate onboarding stage based on current state
 */
export function calculateOnboardingStage(
  profile: Profile,
  user: User,
  subscription: Subscription | null,
  counts: {
    approvedPhotos: number;
    languages: number;
    services: number;
    setups: number;
    incallRates: number;
    outcallRates: number;
  }
): OnboardingStage {
  // Blocked states
  if (user.identity_status === 'failed') {
    return 'blocked';
  }
  if (profile.admin_status === 'rejected') {
    return 'blocked';
  }

  // Waiting for admin
  if (profile.admin_status === 'pending_admin') {
    return 'waiting_admin';
  }

  // Changes requested by admin
  if (profile.admin_status === 'changes_requested') {
    return 'build_profile';
  }

  // Published
  if (
    profile.publication_status === 'public' &&
    profile.admin_status === 'approved' &&
    user.identity_status === 'verified'
  ) {
    return 'live';
  }

  // Needs payment (for paid plans with issues)
  const hasPaidPlan = subscription !== null;
  if (hasPaidPlan && !['trialing', 'active'].includes(subscription.status)) {
    return 'needs_payment';
  }

  // Needs identity
  if (user.identity_status === 'pending') {
    return 'needs_identity';
  }

  // Fix moderation
  if (['auto_flagged', 'auto_blocked'].includes(profile.auto_moderation)) {
    return 'fix_moderation';
  }

  // Check if can submit
  const canSubmit = canSubmitForReview(profile, user, subscription, counts);

  // Upload photos
  if (counts.approvedPhotos < 1) {
    return 'upload_photos';
  }

  // Submit for admin
  if (canSubmit.valid && profile.auto_moderation === 'auto_passed') {
    return 'submit_admin';
  }

  // Build profile (default)
  return 'build_profile';
}

// ============================================================================
// Sensitive Fields (require re-approval if edited post-publication)
// ============================================================================

export const SENSITIVE_FIELDS = [
  'display_name',
  'bio_short',
  'bio_long',
  'incall_enabled',
  'outcall_enabled',
  'outcall_radius_miles',
  'outcall_areas',
  'custom_service_description',
];

export function isSensitiveFieldEdit(field: string): boolean {
  return SENSITIVE_FIELDS.includes(field);
}

// ============================================================================
// Progress Calculation
// ============================================================================

export interface OnboardingProgress {
  current: OnboardingStage;
  steps: {
    name: string;
    completed: boolean;
    current: boolean;
  }[];
  percentComplete: number;
}

export function getOnboardingProgress(
  stage: OnboardingStage,
  user: User,
  subscription: Subscription | null
): OnboardingProgress {
  const hasPaidPlan = subscription !== null;

  const allSteps = [
    { key: 'start', name: 'Create Account' },
    { key: 'needs_plan', name: 'Select Plan' },
    ...(hasPaidPlan ? [{ key: 'needs_payment', name: 'Payment' }] : []),
    { key: 'needs_identity', name: 'Verify Identity' },
    { key: 'build_profile', name: 'Build Profile' },
    { key: 'upload_photos', name: 'Upload Photos' },
    { key: 'submit_admin', name: 'Submit for Review' },
    { key: 'waiting_admin', name: 'Admin Review' },
    { key: 'live', name: 'Published' },
  ];

  const stageOrder = allSteps.map((s) => s.key);
  const currentIndex = stageOrder.indexOf(stage);

  const steps = allSteps.map((step, idx) => ({
    name: step.name,
    completed: idx < currentIndex,
    current: idx === currentIndex,
  }));

  const percentComplete = Math.round((currentIndex / allSteps.length) * 100);

  return {
    current: stage,
    steps,
    percentComplete,
  };
}

// ============================================================================
// UI Messages
// ============================================================================

export const STAGE_MESSAGES: Record<OnboardingStage, string> = {
  start: 'Welcome! Let\'s get started.',
  needs_plan: 'Choose the plan that fits your needs.',
  needs_payment: 'Complete payment to continue.',
  needs_identity: 'Verify your identity to publish your profile.',
  build_profile: 'Complete your profile with services, rates, and hours.',
  upload_photos: 'Upload at least one professional photo.',
  fix_moderation: 'Please address the moderation issues to continue.',
  submit_admin: 'Ready to submit? Review your profile and send for approval.',
  waiting_admin: 'Your profile is under review. This usually takes 24-48 hours.',
  live: 'Congratulations! Your profile is live.',
  blocked: 'Your account has been blocked. Please contact support.',
};

export function getStageMessage(stage: OnboardingStage): string {
  return STAGE_MESSAGES[stage] || 'Continue with your onboarding.';
}

// ============================================================================
// Exports
// ============================================================================

export default {
  canSubmitForReview,
  canPublishProfile,
  getNextStage,
  calculateOnboardingStage,
  isSensitiveFieldEdit,
  getOnboardingProgress,
  getStageMessage,
  PHOTO_LIMITS,
  SENSITIVE_FIELDS,
};
