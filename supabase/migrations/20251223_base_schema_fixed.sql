-- Base schema for core tables required by the app and later migrations.
-- Fixed version for Supabase compatibility

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enums used by onboarding and subscriptions.
DO $$ BEGIN
  CREATE TYPE identity_status_enum AS ENUM ('pending', 'verified', 'failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE user_role_enum AS ENUM ('user', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_plan_enum AS ENUM ('free', 'standard', 'pro', 'elite');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_status_enum AS ENUM ('trialing', 'active', 'past_due', 'canceled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE auto_moderation_enum AS ENUM ('draft', 'auto_passed', 'auto_flagged', 'auto_blocked');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE admin_status_enum AS ENUM ('pending_admin', 'approved', 'rejected', 'changes_requested');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE publication_status_enum AS ENUM ('private', 'public');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE onboarding_stage_enum AS ENUM (
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
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE media_status_enum AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE media_type_enum AS ENUM ('photo', 'video');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE rate_context_enum AS ENUM ('incall', 'outcall');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

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

CREATE INDEX IF NOT EXISTS idx_users_identity_status ON public.users(identity_status);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON public.users(stripe_customer_id);

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
  gender TEXT,
  profile_photo TEXT,
  gallery TEXT[],
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_therapists_slug ON public.therapists(slug);
CREATE INDEX IF NOT EXISTS idx_therapists_city ON public.therapists(city);
CREATE INDEX IF NOT EXISTS idx_therapists_verified ON public.therapists(verified);

COMMENT ON TABLE public.users IS 'Extended user information linked to auth.users';
COMMENT ON TABLE public.profiles IS 'User profiles for the onboarding system';
COMMENT ON TABLE public.therapists IS 'Public therapist listings';
