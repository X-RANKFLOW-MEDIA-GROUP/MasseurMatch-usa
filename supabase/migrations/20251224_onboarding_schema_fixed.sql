-- ============================================================================
-- MasseurMatch - Complete Onboarding Schema (Fixed for Supabase)
-- ============================================================================

-- ============================================================================
-- 1. SUBSCRIPTIONS TABLE
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
-- 2. PROFILES TABLE ENHANCEMENTS
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
-- 3. MEDIA ASSETS TABLE
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
-- 4. PROFILE RATES TABLE
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
-- 5. PROFILE HOURS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profile_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  is_closed BOOLEAN DEFAULT false,

  open_time TIME,
  close_time TIME,

  -- Breaks
  break_start TIME,
  break_end TIME,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- One entry per profile/day
  UNIQUE(profile_id, day_of_week)
);

CREATE INDEX IF NOT EXISTS idx_hours_profile ON public.profile_hours(profile_id);

-- ============================================================================
-- 6. TRIGGERS
-- ============================================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_media_updated_at ON public.media_assets;
CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON public.media_assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_rates_updated_at ON public.profile_rates;
CREATE TRIGGER update_rates_updated_at BEFORE UPDATE ON public.profile_rates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_hours ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can view own media" ON public.media_assets;
DROP POLICY IF EXISTS "Users can upload own media" ON public.media_assets;
DROP POLICY IF EXISTS "Users can update own media" ON public.media_assets;
DROP POLICY IF EXISTS "Users can delete own media" ON public.media_assets;
DROP POLICY IF EXISTS "Users can manage own rates" ON public.profile_rates;
DROP POLICY IF EXISTS "Users can manage own hours" ON public.profile_hours;
DROP POLICY IF EXISTS "Public can view approved media from public profiles" ON public.media_assets;

-- Create policies
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own media"
  ON public.media_assets FOR SELECT
  USING (
    profile_id IN (SELECT id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can upload own media"
  ON public.media_assets FOR INSERT
  WITH CHECK (
    profile_id IN (SELECT id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can update own media"
  ON public.media_assets FOR UPDATE
  USING (
    profile_id IN (SELECT id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can delete own media"
  ON public.media_assets FOR DELETE
  USING (
    profile_id IN (SELECT id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can manage own rates"
  ON public.profile_rates FOR ALL
  USING (
    profile_id IN (SELECT id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can manage own hours"
  ON public.profile_hours FOR ALL
  USING (
    profile_id IN (SELECT id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Public can view approved media from public profiles"
  ON public.media_assets FOR SELECT
  USING (
    status = 'approved'
    AND profile_id IN (
      SELECT id FROM profiles WHERE publication_status = 'public'
    )
  );

COMMENT ON TABLE public.subscriptions IS 'User subscriptions (Standard/Pro/Elite). Free users have no subscription.';
COMMENT ON TABLE public.media_assets IS 'Photos and videos for profiles. Status managed by Sightengine moderation.';
COMMENT ON TABLE public.profile_rates IS 'Pricing for incall/outcall services.';
COMMENT ON TABLE public.profile_hours IS 'Operating hours for each day of the week.';
