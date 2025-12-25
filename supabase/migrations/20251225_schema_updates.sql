-- ============================================================================
-- Schema updates for MasseurMatch dashboards and onboarding
-- ============================================================================

-- Add slug to therapists for stable profile URLs
ALTER TABLE public.therapists
  ADD COLUMN IF NOT EXISTS slug TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_therapists_slug
  ON public.therapists(slug)
  WHERE slug IS NOT NULL;

-- ============================================================================
-- Profile metadata tables (languages, services, setups)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profile_languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_languages_profile
  ON public.profile_languages(profile_id);

ALTER TABLE public.profile_languages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their profile languages"
  ON public.profile_languages FOR ALL
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    profile_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS public.profile_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_services_profile
  ON public.profile_services(profile_id);

ALTER TABLE public.profile_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their profile services"
  ON public.profile_services FOR ALL
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    profile_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS public.profile_setups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  setup_name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_setups_profile
  ON public.profile_setups(profile_id);

ALTER TABLE public.profile_setups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their profile setups"
  ON public.profile_setups FOR ALL
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    profile_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- Preferences table RLS
-- ============================================================================

ALTER TABLE public.users_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their preferences"
  ON public.users_preferences FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
