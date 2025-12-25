-- ============================================================================
-- MasseurMatch - Core Tables Only (No Enums/Triggers)
-- ============================================================================
-- This is a simplified version for initial setup
-- Execute this first, then add enums and triggers separately

-- ============================================================================
-- 1. SUBSCRIPTIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,

  plan TEXT NOT NULL CHECK (plan IN ('standard', 'pro', 'elite')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('trialing', 'active', 'past_due', 'canceled')),

  -- Stripe IDs
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

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe ON public.subscriptions(stripe_subscription_id);

-- ============================================================================
-- 2. MEDIA ASSETS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL,

  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  type TEXT DEFAULT 'photo' CHECK (type IN ('photo', 'video')),

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

CREATE INDEX IF NOT EXISTS idx_media_profile ON public.media_assets(profile_id);
CREATE INDEX IF NOT EXISTS idx_media_status ON public.media_assets(status);
CREATE INDEX IF NOT EXISTS idx_media_position ON public.media_assets(profile_id, position);

-- ============================================================================
-- 3. PROFILE RATES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profile_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL,

  context TEXT NOT NULL CHECK (context IN ('incall', 'outcall')),
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

CREATE INDEX IF NOT EXISTS idx_rates_profile ON public.profile_rates(profile_id);
CREATE INDEX IF NOT EXISTS idx_rates_context ON public.profile_rates(context);

-- ============================================================================
-- 4. PROFILE HOURS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profile_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL,

  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
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

CREATE INDEX IF NOT EXISTS idx_hours_profile ON public.profile_hours(profile_id);

-- ============================================================================
-- DONE
-- ============================================================================
