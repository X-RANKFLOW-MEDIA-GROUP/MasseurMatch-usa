-- ============================================================================
-- MasseurMatch - Complete Onboarding Schema
-- ============================================================================

-- ============================================================================
-- 1. ENUMS
-- ============================================================================

CREATE TYPE IF NOT EXISTS identity_status_enum AS ENUM ('pending', 'verified', 'failed');
CREATE TYPE IF NOT EXISTS user_role_enum AS ENUM ('user', 'admin');

CREATE TYPE IF NOT EXISTS subscription_plan_enum AS ENUM ('free', 'standard', 'pro', 'elite');
CREATE TYPE IF NOT EXISTS subscription_status_enum AS ENUM ('trialing', 'active', 'past_due', 'canceled');

CREATE TYPE IF NOT EXISTS auto_moderation_enum AS ENUM ('draft', 'auto_passed', 'auto_flagged', 'auto_blocked');
CREATE TYPE IF NOT EXISTS admin_status_enum AS ENUM ('pending_admin', 'approved', 'rejected', 'changes_requested');
CREATE TYPE IF NOT EXISTS publication_status_enum AS ENUM ('private', 'public');

CREATE TYPE IF NOT EXISTS onboarding_stage_enum AS ENUM (
  'start',
  'needs_plan',
  'needs_payment',
  'needs_identity',
  'build_profile',
  'upload_photos',
  'fix_moderation',
  'submit_admin',
  'waiting_admin',
  'live',
  'blocked'
);

CREATE TYPE IF NOT EXISTS media_status_enum AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE IF NOT EXISTS media_type_enum AS ENUM ('photo', 'video');

CREATE TYPE IF NOT EXISTS rate_context_enum AS ENUM ('incall', 'outcall');

-- ============================================================================
-- 2. USERS TABLE (extends Supabase auth.users)
-- ============================================================================

-- Add columns to existing users table or create profiles extension
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS identity_status identity_status_enum DEFAULT 'pending';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role user_role_enum DEFAULT 'user';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS stripe_identity_session_id VARCHAR(255);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS identity_verified_at TIMESTAMPTZ;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_identity_status ON public.users(identity_status);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON public.users(stripe_customer_id);

-- ============================================================================
-- 3. SUBSCRIPTIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  plan subscription_plan_enum NOT NULL,
  status subscription_status_enum NOT NULL DEFAULT 'active',

  -- Stripe IDs
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_payment_method_id VARCHAR(255),

  -- Trial & Billing
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMPTZ,

  -- Metadata
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe ON public.subscriptions(stripe_subscription_id);

-- One active subscription per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_active_user
  ON public.subscriptions(user_id)
  WHERE status IN ('trialing', 'active');

-- ============================================================================
-- 4. PROFILES TABLE (enhanced with onboarding states)
-- ============================================================================

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS auto_moderation auto_moderation_enum DEFAULT 'draft';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS admin_status admin_status_enum DEFAULT 'pending_admin';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS publication_status publication_status_enum DEFAULT 'private';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_stage onboarding_stage_enum DEFAULT 'start';

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_auto_moderation ON public.profiles(auto_moderation);
CREATE INDEX IF NOT EXISTS idx_profiles_admin_status ON public.profiles(admin_status);
CREATE INDEX IF NOT EXISTS idx_profiles_publication_status ON public.profiles(publication_status);
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_stage ON public.profiles(onboarding_stage);

-- Admin queue index
CREATE INDEX IF NOT EXISTS idx_profiles_pending_review
  ON public.profiles(submitted_at DESC)
  WHERE admin_status = 'pending_admin';

-- ============================================================================
-- 5. MEDIA ASSETS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  status media_status_enum DEFAULT 'pending',
  type media_type_enum DEFAULT 'photo',

  -- Storage
  storage_path TEXT NOT NULL,
  public_url TEXT,
  thumbnail_url TEXT,

  -- Ordering
  position INT DEFAULT 0,
  is_cover BOOLEAN DEFAULT false,

  -- Sightengine
  sightengine_response JSONB,
  sightengine_score DECIMAL(5, 2),
  rejection_reason TEXT,

  -- Metadata
  width INT,
  height INT,
  file_size INT,
  mime_type VARCHAR(100),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_media_profile ON public.media_assets(profile_id);
CREATE INDEX IF NOT EXISTS idx_media_status ON public.media_assets(status);
CREATE INDEX IF NOT EXISTS idx_media_position ON public.media_assets(profile_id, position);

-- One cover photo per profile
CREATE UNIQUE INDEX IF NOT EXISTS idx_media_cover_unique
  ON public.media_assets(profile_id)
  WHERE is_cover = true;

-- ============================================================================
-- 6. PROFILE RATES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profile_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  context rate_context_enum NOT NULL,
  duration_minutes INT NOT NULL CHECK (duration_minutes > 0),
  price_cents INT NOT NULL CHECK (price_cents > 0),
  currency VARCHAR(3) DEFAULT 'USD',

  -- Metadata
  is_active BOOLEAN DEFAULT true,
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique constraint: one rate per profile/context/duration
  UNIQUE(profile_id, context, duration_minutes)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_rates_profile ON public.profile_rates(profile_id);
CREATE INDEX IF NOT EXISTS idx_rates_context ON public.profile_rates(context);

-- ============================================================================
-- 7. PROFILE HOURS TABLE (operating hours)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profile_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
  is_closed BOOLEAN DEFAULT false,

  open_time TIME,
  close_time TIME,

  -- Breaks (optional)
  break_start TIME,
  break_end TIME,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- One entry per profile/day
  UNIQUE(profile_id, day_of_week)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_hours_profile ON public.profile_hours(profile_id);

-- ============================================================================
-- 8. TRIGGERS
-- ============================================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON public.media_assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rates_updated_at BEFORE UPDATE ON public.profile_rates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 9. RATE VALIDATION - 33% RULE
-- ============================================================================

CREATE OR REPLACE FUNCTION validate_rate_33_rule()
RETURNS TRIGGER AS $$
DECLARE
  base_rate RECORD;
  base_price_per_min DECIMAL;
  new_price_per_min DECIMAL;
  max_allowed_per_min DECIMAL;
BEGIN
  -- Skip if inactive
  IF NOT NEW.is_active THEN
    RETURN NEW;
  END IF;

  -- Get base rate (shortest duration for this context)
  SELECT * INTO base_rate
  FROM profile_rates
  WHERE profile_id = NEW.profile_id
    AND context = NEW.context
    AND is_active = true
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID)
  ORDER BY duration_minutes ASC
  LIMIT 1;

  -- If no base rate exists, this becomes the base
  IF base_rate IS NULL THEN
    RETURN NEW;
  END IF;

  -- Determine which is base (shortest duration)
  IF NEW.duration_minutes < base_rate.duration_minutes THEN
    -- New rate is shorter, it becomes the base, validate existing
    base_price_per_min := NEW.price_cents::DECIMAL / NEW.duration_minutes;
    new_price_per_min := base_rate.price_cents::DECIMAL / base_rate.duration_minutes;
  ELSE
    -- Existing rate is base, validate new
    base_price_per_min := base_rate.price_cents::DECIMAL / base_rate.duration_minutes;
    new_price_per_min := NEW.price_cents::DECIMAL / NEW.duration_minutes;
  END IF;

  max_allowed_per_min := base_price_per_min * 1.33;

  IF new_price_per_min > max_allowed_per_min THEN
    RAISE EXCEPTION 'Price per minute ($%.2f) exceeds 33%% above base rate ($%.2f). Maximum allowed: $%.2f',
      new_price_per_min / 100.0,
      base_price_per_min / 100.0,
      max_allowed_per_min / 100.0
    USING HINT = 'Adjust your pricing to stay within 33% of the base rate per minute.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_rate_33_rule
  BEFORE INSERT OR UPDATE ON profile_rates
  FOR EACH ROW
  EXECUTE FUNCTION validate_rate_33_rule();

-- ============================================================================
-- 10. PHOTO LIMIT VALIDATION
-- ============================================================================

CREATE OR REPLACE FUNCTION validate_photo_limit()
RETURNS TRIGGER AS $$
DECLARE
  user_plan subscription_plan_enum;
  current_photo_count INT;
  max_photos INT;
BEGIN
  -- Get user's plan (default to free if no subscription)
  SELECT s.plan INTO user_plan
  FROM profiles p
  LEFT JOIN users u ON p.user_id = u.id
  LEFT JOIN subscriptions s ON u.id = s.user_id
  WHERE p.id = NEW.profile_id
    AND (s.status IN ('trialing', 'active') OR s.status IS NULL)
  LIMIT 1;

  -- Set limits based on plan
  max_photos := CASE
    WHEN user_plan = 'standard' THEN 4
    WHEN user_plan = 'pro' THEN 8
    WHEN user_plan = 'elite' THEN 12
    ELSE 1  -- Free plan
  END;

  -- Count current photos
  SELECT COUNT(*) INTO current_photo_count
  FROM media_assets
  WHERE profile_id = NEW.profile_id
    AND type = 'photo'
    AND status != 'rejected'
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID);

  -- Validate
  IF current_photo_count >= max_photos THEN
    RAISE EXCEPTION 'Photo limit exceeded. Your plan allows % photos, you have %.',
      max_photos, current_photo_count
    USING HINT = 'Upgrade your plan to upload more photos.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_photo_limit
  BEFORE INSERT ON media_assets
  FOR EACH ROW
  WHEN (NEW.type = 'photo')
  EXECUTE FUNCTION validate_photo_limit();

-- ============================================================================
-- 11. AUTO-SET COVER PHOTO
-- ============================================================================

CREATE OR REPLACE FUNCTION auto_set_cover_photo()
RETURNS TRIGGER AS $$
BEGIN
  -- If this is the first approved photo, make it cover
  IF NEW.status = 'approved' AND NOT EXISTS (
    SELECT 1 FROM media_assets
    WHERE profile_id = NEW.profile_id
      AND is_cover = true
      AND id != NEW.id
  ) THEN
    NEW.is_cover = true;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_first_photo_as_cover
  BEFORE INSERT OR UPDATE ON media_assets
  FOR EACH ROW
  EXECUTE FUNCTION auto_set_cover_photo();

-- ============================================================================
-- 12. HELPER FUNCTIONS
-- ============================================================================

-- Check if profile meets all requirements for admin submission
CREATE OR REPLACE FUNCTION can_submit_for_review(profile_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  profile_record RECORD;
  user_record RECORD;
  subscription_record RECORD;
  approved_photo_count INT;
  language_count INT;
  service_count INT;
  setup_count INT;
  incall_rate_count INT;
  outcall_rate_count INT;
BEGIN
  -- Get profile
  SELECT * INTO profile_record FROM profiles WHERE id = profile_uuid;
  IF NOT FOUND THEN RETURN FALSE; END IF;

  -- Get user
  SELECT * INTO user_record FROM users WHERE id = profile_record.user_id;
  IF NOT FOUND THEN RETURN FALSE; END IF;

  -- Check identity
  IF user_record.identity_status != 'verified' THEN RETURN FALSE; END IF;

  -- Check moderation
  IF profile_record.auto_moderation != 'auto_passed' THEN RETURN FALSE; END IF;

  -- Check required fields
  IF profile_record.display_name IS NULL OR profile_record.display_name = '' THEN RETURN FALSE; END IF;
  IF profile_record.city_slug IS NULL THEN RETURN FALSE; END IF;
  IF profile_record.phone_public_e164 IS NULL THEN RETURN FALSE; END IF;

  -- Check languages (assuming junction table)
  SELECT COUNT(*) INTO language_count FROM profile_languages WHERE profile_id = profile_uuid;
  IF language_count < 1 THEN RETURN FALSE; END IF;

  -- Check services
  SELECT COUNT(*) INTO service_count FROM profile_services WHERE profile_id = profile_uuid;
  IF service_count < 1 THEN RETURN FALSE; END IF;

  -- Check setups
  SELECT COUNT(*) INTO setup_count FROM profile_setups WHERE profile_id = profile_uuid;
  IF setup_count < 1 THEN RETURN FALSE; END IF;

  -- Check rates
  IF profile_record.incall_enabled THEN
    SELECT COUNT(*) INTO incall_rate_count FROM profile_rates
      WHERE profile_id = profile_uuid AND context = 'incall' AND is_active = true;
    IF incall_rate_count < 1 THEN RETURN FALSE; END IF;
  END IF;

  IF profile_record.outcall_enabled THEN
    SELECT COUNT(*) INTO outcall_rate_count FROM profile_rates
      WHERE profile_id = profile_uuid AND context = 'outcall' AND is_active = true;
    IF outcall_rate_count < 1 THEN RETURN FALSE; END IF;
  END IF;

  -- Check approved photos
  SELECT COUNT(*) INTO approved_photo_count FROM media_assets
    WHERE profile_id = profile_uuid AND status = 'approved';
  IF approved_photo_count < 1 THEN RETURN FALSE; END IF;

  -- Check subscription (if not free)
  SELECT * INTO subscription_record FROM subscriptions
    WHERE user_id = user_record.id
      AND status IN ('trialing', 'active')
    ORDER BY created_at DESC
    LIMIT 1;

  -- If subscription exists but not active/trialing, block
  IF EXISTS (SELECT 1 FROM subscriptions WHERE user_id = user_record.id) THEN
    IF subscription_record IS NULL THEN RETURN FALSE; END IF;
  END IF;

  -- All checks passed
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Check if profile can be published
CREATE OR REPLACE FUNCTION can_publish_profile(profile_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  profile_record RECORD;
  user_record RECORD;
  subscription_record RECORD;
BEGIN
  SELECT * INTO profile_record FROM profiles WHERE id = profile_uuid;
  IF NOT FOUND THEN RETURN FALSE; END IF;

  SELECT * INTO user_record FROM users WHERE id = profile_record.user_id;
  IF NOT FOUND THEN RETURN FALSE; END IF;

  -- All conditions must be met
  IF user_record.identity_status != 'verified' THEN RETURN FALSE; END IF;
  IF profile_record.auto_moderation != 'auto_passed' THEN RETURN FALSE; END IF;
  IF profile_record.admin_status != 'approved' THEN RETURN FALSE; END IF;
  IF profile_record.publication_status != 'public' THEN RETURN FALSE; END IF;

  -- Check subscription if paid plan
  SELECT * INTO subscription_record FROM subscriptions
    WHERE user_id = user_record.id
      AND status IN ('trialing', 'active')
    ORDER BY created_at DESC
    LIMIT 1;

  IF EXISTS (SELECT 1 FROM subscriptions WHERE user_id = user_record.id) THEN
    IF subscription_record IS NULL THEN RETURN FALSE; END IF;
  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 13. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_hours ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view their own media
CREATE POLICY "Users can view own media"
  ON public.media_assets FOR SELECT
  USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- Users can insert their own media (trigger will validate limit)
CREATE POLICY "Users can upload own media"
  ON public.media_assets FOR INSERT
  WITH CHECK (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- Users can update their own media
CREATE POLICY "Users can update own media"
  ON public.media_assets FOR UPDATE
  USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- Users can delete their own media
CREATE POLICY "Users can delete own media"
  ON public.media_assets FOR DELETE
  USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- Users can manage their own rates
CREATE POLICY "Users can manage own rates"
  ON public.profile_rates FOR ALL
  USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- Users can manage their own hours
CREATE POLICY "Users can manage own hours"
  ON public.profile_hours FOR ALL
  USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- Public can view approved media from public profiles
CREATE POLICY "Public can view approved media from public profiles"
  ON public.media_assets FOR SELECT
  USING (
    status = 'approved'
    AND profile_id IN (
      SELECT id FROM profiles WHERE publication_status = 'public'
    )
  );

-- ============================================================================
-- 14. INDEXES FOR PERFORMANCE
-- ============================================================================

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_profiles_public_approved
  ON public.profiles(publication_status, admin_status)
  WHERE publication_status = 'public' AND admin_status = 'approved';

CREATE INDEX IF NOT EXISTS idx_media_approved_by_profile
  ON public.media_assets(profile_id, position)
  WHERE status = 'approved';

CREATE INDEX IF NOT EXISTS idx_rates_active_by_profile
  ON public.profile_rates(profile_id, context, duration_minutes)
  WHERE is_active = true;

-- ============================================================================
-- DONE
-- ============================================================================

COMMENT ON TABLE public.subscriptions IS 'User subscriptions (Standard/Pro/Elite). Free users have no subscription.';
COMMENT ON TABLE public.media_assets IS 'Photos and videos for profiles. Status managed by Sightengine moderation.';
COMMENT ON TABLE public.profile_rates IS 'Pricing for incall/outcall services. Enforces 33% rule via trigger.';
COMMENT ON TABLE public.profile_hours IS 'Operating hours for each day of the week.';

COMMENT ON FUNCTION can_submit_for_review IS 'Returns true if profile meets all requirements to submit for admin review';
COMMENT ON FUNCTION can_publish_profile IS 'Returns true if profile can be published (all approvals in place)';
COMMENT ON FUNCTION validate_rate_33_rule IS 'Enforces that no rate can have price/min > 133% of base rate price/min';
COMMENT ON FUNCTION validate_photo_limit IS 'Enforces photo limits based on subscription plan (Free: 1, Standard: 4, Pro: 8, Elite: 12)';
