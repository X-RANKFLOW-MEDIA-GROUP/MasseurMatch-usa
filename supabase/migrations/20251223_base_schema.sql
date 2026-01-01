-- Base schema for core tables required by the app and later migrations.

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enums used by onboarding and subscriptions.
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

-- Core users table (extends auth.users).
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  identity_status identity_status_enum NOT NULL DEFAULT 'pending',
  role user_role_enum NOT NULL DEFAULT 'user',
  stripe_customer_id VARCHAR(255),
  stripe_identity_session_id VARCHAR(255),
  identity_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Profiles table (base columns; more added in later migrations).
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Therapists table for public listings.
CREATE TABLE IF NOT EXISTS public.therapists (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE,
  full_name TEXT,
  display_name TEXT,
  headline TEXT,
  about TEXT,
  philosophy TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  instagram TEXT,
  whatsapp TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'USA',
  neighborhood TEXT,
  address TEXT,
  zip_code TEXT,
  nearest_intersection TEXT,
  latitude TEXT,
  longitude TEXT,
  mobile_service_radius INTEGER,
  services_headline TEXT,
  specialties_headline TEXT,
  promotions_headline TEXT,
  services TEXT[],
  massage_techniques TEXT[],
  studio_amenities TEXT[],
  mobile_extras TEXT[],
  additional_services TEXT[],
  products_used TEXT,
  rate_60 TEXT,
  rate_90 TEXT,
  rate_outcall TEXT,
  payment_methods TEXT[],
  regular_discounts TEXT,
  day_of_week_discount TEXT,
  weekly_specials TEXT,
  special_discount_groups TEXT[],
  availability JSONB,
  degrees TEXT,
  affiliations TEXT[],
  massage_start_date DATE,
  languages TEXT[],
  business_trips TEXT[],
  rating NUMERIC(3, 2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  override_reviews_count INTEGER DEFAULT 0,
  birthdate DATE,
  years_experience INTEGER,
  profile_photo TEXT,
  gallery TEXT[],
  agree_terms BOOLEAN DEFAULT false,
  plan TEXT DEFAULT 'free',
  plan_name TEXT,
  price_monthly NUMERIC(10, 2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'suspended')),
  paid_until TIMESTAMPTZ,
  subscription_status TEXT DEFAULT 'inactive',
  stripe_current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table for therapist reviews.
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id UUID REFERENCES public.therapists(user_id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Explore swipe events for AI exploration.
CREATE TABLE IF NOT EXISTS public.explore_swipe_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  therapist_id UUID REFERENCES public.therapists(user_id) ON DELETE CASCADE,
  direction TEXT CHECK (direction IN ('left', 'right', 'up')) NOT NULL,
  match_score NUMERIC(5, 2),
  context JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_explore_swipe_events_user ON public.explore_swipe_events(user_id);
CREATE INDEX IF NOT EXISTS idx_explore_swipe_events_therapist ON public.explore_swipe_events(therapist_id);

-- Preferences table for explore filtering.
CREATE TABLE IF NOT EXISTS public.users_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION NOT NULL DEFAULT 0,
  longitude DOUBLE PRECISION NOT NULL DEFAULT 0,
  radius INTEGER NOT NULL DEFAULT 25,
  zip_code TEXT,
  location geography(Point, 4326),
  massage_types TEXT[] DEFAULT '{}',
  pressure TEXT DEFAULT 'medium',
  gender TEXT DEFAULT 'any',
  mode TEXT DEFAULT 'any',
  availability TEXT DEFAULT 'anytime',
  budget_min NUMERIC(10, 2) DEFAULT 50,
  budget_max NUMERIC(10, 2) DEFAULT 200,
  pain_points TEXT[] DEFAULT '{}',
  ai_feedback JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_preferences_location ON public.users_preferences USING gist(location);

-- updated_at helper used by multiple tables.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_therapists_updated_at
  BEFORE UPDATE ON public.therapists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS policies for therapists, profiles, and reviews.
ALTER TABLE public.therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active therapists" ON public.therapists;
CREATE POLICY "Public can view active therapists"
  ON public.therapists
  FOR SELECT
  USING (status = 'active');

DROP POLICY IF EXISTS "Users can view their own therapist profile" ON public.therapists;
CREATE POLICY "Users can view their own therapist profile"
  ON public.therapists
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own therapist profile" ON public.therapists;
CREATE POLICY "Users can update their own therapist profile"
  ON public.therapists
  FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own therapist profile" ON public.therapists;
CREATE POLICY "Users can insert their own therapist profile"
  ON public.therapists
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Public can view all reviews" ON public.reviews;
CREATE POLICY "Public can view all reviews"
  ON public.reviews
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON public.reviews;
CREATE POLICY "Authenticated users can insert reviews"
  ON public.reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Grants for public reads.
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.therapists TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.reviews TO anon, authenticated;
