-- ============================================================================
-- MasseurMatch - Supabase Onboarding Schema
-- ============================================================================
-- This file defines the Supabase schema for the onboarding platform.
-- It includes enums, user/profile/subscription media tables plus triggers
-- and policies required to satisfy the implementation sprint specification.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE IF NOT EXISTS identity_status_enum AS ENUM ('pending', 'verified', 'failed');
CREATE TYPE IF NOT EXISTS user_role_enum AS ENUM ('user', 'admin');

CREATE TYPE IF NOT EXISTS subscription_plan_enum AS ENUM ('standard', 'pro', 'elite');
CREATE TYPE IF NOT EXISTS subscription_status_enum AS ENUM ('trialing', 'active', 'past_due', 'canceled');

CREATE TYPE IF NOT EXISTS onboarding_stage_enum AS ENUM (
  'profile_setup',
  'review_pending',
  'choose_plan',
  'payment_pending',
  'identity_verify',
  'live'
);

CREATE TYPE IF NOT EXISTS auto_moderation_enum AS ENUM ('draft', 'auto_passed', 'auto_flagged', 'auto_blocked');
CREATE TYPE IF NOT EXISTS admin_status_enum AS ENUM ('pending_admin', 'approved', 'rejected');
CREATE TYPE IF NOT EXISTS publication_status_enum AS ENUM ('private', 'public');

CREATE TYPE IF NOT EXISTS media_status_enum AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE IF NOT EXISTS media_type_enum AS ENUM ('photo', 'video');

CREATE TYPE IF NOT EXISTS rate_context_enum AS ENUM ('incall', 'outcall');
CREATE TYPE IF NOT EXISTS swipe_action_enum AS ENUM ('swipe_left', 'swipe_right', 'swipe_up');

-- ============================================================================
-- TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  identity_status identity_status_enum NOT NULL DEFAULT 'pending',
  role user_role_enum NOT NULL DEFAULT 'user',
  stripe_customer_id TEXT,
  stripe_identity_session_id TEXT
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan subscription_plan_enum NOT NULL DEFAULT 'standard',
  status subscription_status_enum NOT NULL DEFAULT 'trialing',
  stripe_subscription_id TEXT NOT NULL,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (stripe_subscription_id)
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  onboarding_stage onboarding_stage_enum NOT NULL DEFAULT 'profile_setup',
  auto_moderation auto_moderation_enum NOT NULL DEFAULT 'draft',
  admin_status admin_status_enum NOT NULL DEFAULT 'pending_admin',
  publication_status publication_status_enum NOT NULL DEFAULT 'private',
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  admin_notes TEXT,
  rejection_reason TEXT,
  base_rate_per_min_cents INTEGER DEFAULT 0 CHECK (base_rate_per_min_cents >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status media_status_enum NOT NULL DEFAULT 'pending',
  type media_type_enum NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT,
  thumbnail_url TEXT,
  position SMALLINT NOT NULL DEFAULT 0,
  is_cover BOOLEAN NOT NULL DEFAULT FALSE,
  sightengine_response JSONB,
  sightengine_score NUMERIC(6,4),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (position >= 0)
);

CREATE TABLE IF NOT EXISTS public.profile_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  context rate_context_enum NOT NULL,
  duration_minutes SMALLINT NOT NULL CHECK (duration_minutes > 0),
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (profile_id, context, duration_minutes)
);

CREATE TABLE IF NOT EXISTS public.profile_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  is_closed BOOLEAN NOT NULL DEFAULT FALSE,
  open_time TIME,
  close_time TIME,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (
    is_closed OR (
      open_time IS NOT NULL AND close_time IS NOT NULL AND open_time < close_time
    )
  )
);

CREATE TABLE IF NOT EXISTS public.profile_languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.profile_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.profile_setups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  setup_name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.explore_swipe_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action swipe_action_enum NOT NULL,
  match_score NUMERIC(5,4) NOT NULL DEFAULT 0 CHECK (match_score BETWEEN 0 AND 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_admin(uid UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE AS 
  SELECT EXISTS (
    SELECT 1
    FROM public.users admin
    WHERE admin.id = uid AND admin.role = 'admin'
  );
;

CREATE OR REPLACE FUNCTION public.auto_approve_profile()
RETURNS TRIGGER LANGUAGE plpgsql AS 
DECLARE
  profile_record public.profiles%ROWTYPE;
  duplicate_exists BOOLEAN;
BEGIN
  IF NEW.identity_status != 'verified' THEN
    RETURN NEW;
  END IF;

  SELECT * INTO profile_record
  FROM public.profiles
  WHERE user_id = NEW.id
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN NEW;
  END IF;

  SELECT EXISTS (
    SELECT 1
    FROM public.profiles other
    WHERE other.user_id = NEW.id
      AND other.id != profile_record.id
  ) INTO duplicate_exists;

  IF profile_record.auto_moderation = 'auto_passed'
     AND profile_record.admin_status != 'approved'
     AND profile_record.publication_status != 'public'
     AND NOT duplicate_exists
  THEN
    UPDATE public.profiles
    SET admin_status = 'approved',
        publication_status = 'public',
        onboarding_stage = 'live',
        approved_at = NOW(),
        updated_at = NOW()
    WHERE id = profile_record.id;
  END IF;

  RETURN NEW;
END;
;

CREATE OR REPLACE FUNCTION public.validate_photo_limit()
RETURNS TRIGGER LANGUAGE plpgsql AS 
DECLARE
  profile_owner UUID;
  plan_selection TEXT;
  max_photos INTEGER := 1;
  current_count INTEGER;
BEGIN
  IF NEW.type != 'photo' THEN
    RETURN NEW;
  END IF;

  SELECT user_id INTO profile_owner
  FROM public.profiles
  WHERE id = NEW.profile_id;

  IF profile_owner IS NULL THEN
    RAISE EXCEPTION 'Unable to resolve profile % for new media asset', NEW.profile_id;
  END IF;

  SELECT plan::TEXT INTO plan_selection
  FROM public.subscriptions
  WHERE user_id = profile_owner AND status IN ('trialing', 'active', 'past_due')
  ORDER BY current_period_end DESC NULLS LAST, updated_at DESC
  LIMIT 1;

  max_photos := CASE plan_selection
    WHEN 'standard' THEN 4
    WHEN 'pro' THEN 8
    WHEN 'elite' THEN 12
    ELSE 1
  END;

  SELECT COUNT(*) INTO current_count
  FROM public.media_assets
  WHERE profile_id = NEW.profile_id AND type = 'photo';

  IF current_count + 1 > max_photos THEN
    RAISE EXCEPTION 'Photo limit of % reached for plan %', max_photos, COALESCE(plan_selection, 'free');
  END IF;

  RETURN NEW;
END;
;

CREATE OR REPLACE FUNCTION public.validate_rate_33_rule()
RETURNS TRIGGER LANGUAGE plpgsql AS 
DECLARE
  base_rate NUMERIC;
  price_per_min NUMERIC;
  limit_rate NUMERIC;
BEGIN
  IF NEW.duration_minutes <= 0 THEN
    RAISE EXCEPTION 'Duration must be greater than zero';
  END IF;

  SELECT base_rate_per_min_cents::NUMERIC INTO base_rate
  FROM public.profiles
  WHERE id = NEW.profile_id;

  IF base_rate IS NULL OR base_rate = 0 THEN
    RETURN NEW;
  END IF;

  price_per_min := NEW.price_cents::NUMERIC / NEW.duration_minutes;
  limit_rate := base_rate * 1.33;

  IF price_per_min > limit_rate THEN
    RAISE EXCEPTION 'Price per minute (%.2f) exceeds the allowed ceiling (%.2f)', price_per_min, limit_rate;
  END IF;

  RETURN NEW;
END;
;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER auto_approve_profile_trigger
AFTER UPDATE OF identity_status ON public.users
FOR EACH ROW
WHEN (OLD.identity_status IS DISTINCT FROM NEW.identity_status AND NEW.identity_status = 'verified')
EXECUTE FUNCTION public.auto_approve_profile();

CREATE TRIGGER validate_photo_limit_trigger
BEFORE INSERT ON public.media_assets
FOR EACH ROW
EXECUTE FUNCTION public.validate_photo_limit();

CREATE TRIGGER validate_rate_33_rule_trigger
BEFORE INSERT OR UPDATE ON public.profile_rates
FOR EACH ROW
EXECUTE FUNCTION public.validate_rate_33_rule();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_setups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_swipe_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_self ON public.users
  FOR ALL
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY users_admin ON public.users
  FOR ALL
  USING (public.is_admin(auth.uid()));

CREATE POLICY subscriptions_self ON public.subscriptions
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY subscriptions_admin ON public.subscriptions
  FOR ALL
  USING (public.is_admin(auth.uid()));

CREATE POLICY profiles_self ON public.profiles
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY profiles_admin ON public.profiles
  FOR ALL
  USING (public.is_admin(auth.uid()));

CREATE POLICY profiles_public ON public.profiles
  FOR SELECT
  USING (publication_status = 'public' AND admin_status = 'approved');

CREATE POLICY media_assets_self ON public.media_assets
  FOR ALL
  USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
  WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY media_assets_admin ON public.media_assets
  FOR ALL
  USING (public.is_admin(auth.uid()));

CREATE POLICY media_assets_public ON public.media_assets
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = media_assets.profile_id
        AND p.publication_status = 'public'
        AND p.admin_status = 'approved'
    )
  );

CREATE POLICY profile_rates_self ON public.profile_rates
  FOR ALL
  USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
  WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY profile_rates_admin ON public.profile_rates
  FOR ALL
  USING (public.is_admin(auth.uid()));

CREATE POLICY profile_hours_self ON public.profile_hours
  FOR ALL
  USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
  WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY profile_hours_admin ON public.profile_hours
  FOR ALL
  USING (public.is_admin(auth.uid()));

CREATE POLICY profile_languages_self ON public.profile_languages
  FOR ALL
  USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
  WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY profile_languages_admin ON public.profile_languages
  FOR ALL
  USING (public.is_admin(auth.uid()));

CREATE POLICY profile_services_self ON public.profile_services
  FOR ALL
  USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
  WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY profile_services_admin ON public.profile_services
  FOR ALL
  USING (public.is_admin(auth.uid()));

CREATE POLICY profile_setups_self ON public.profile_setups
  FOR ALL
  USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
  WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY profile_setups_admin ON public.profile_setups
  FOR ALL
  USING (public.is_admin(auth.uid()));

CREATE POLICY explore_swipe_events_self ON public.explore_swipe_events
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY explore_swipe_events_admin ON public.explore_swipe_events
  FOR ALL
  USING (public.is_admin(auth.uid()));

-- ============================================================================
-- CONSTRAINTS & INDEXES
-- ============================================================================

CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_single_active_per_user
  ON public.subscriptions (user_id)
  WHERE status IN ('trialing', 'active', 'past_due');

CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_stage ON public.profiles (onboarding_stage);
CREATE INDEX IF NOT EXISTS idx_profiles_auto_moderation ON public.profiles (auto_moderation);
CREATE INDEX IF NOT EXISTS idx_profiles_admin_status ON public.profiles (admin_status);
CREATE INDEX IF NOT EXISTS idx_profiles_publication_status ON public.profiles (publication_status);

CREATE INDEX IF NOT EXISTS idx_media_assets_profile_position ON public.media_assets (profile_id, position);
CREATE INDEX IF NOT EXISTS idx_media_assets_status ON public.media_assets (status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_media_assets_single_cover ON public.media_assets (profile_id) WHERE is_cover;

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions (user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions (status);

CREATE INDEX IF NOT EXISTS idx_explore_swipe_user ON public.explore_swipe_events (user_id);
CREATE INDEX IF NOT EXISTS idx_explore_swipe_profile ON public.explore_swipe_events (profile_id);
CREATE INDEX IF NOT EXISTS idx_explore_swipe_action ON public.explore_swipe_events (action);
