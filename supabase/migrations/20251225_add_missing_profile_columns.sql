-- ============================================================================
-- Add Missing Columns to profiles Table
-- This migration adds columns that are referenced in the codebase but missing
-- ============================================================================

-- ============================================================================
-- 1. BASIC INFO COLUMNS
-- ============================================================================

-- Display name
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS display_name VARCHAR(100);

-- Headline
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS headline VARCHAR(160);

-- Bio
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS bio TEXT;

-- Short bio (for SEO snippets)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS bio_short TEXT;

-- Long bio (full profile)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS bio_long TEXT;

-- Date of birth
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- ============================================================================
-- 2. LOCATION COLUMNS
-- ============================================================================

-- City slug for filtering (e.g., 'new-york-ny', 'los-angeles-ca')
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS city_slug VARCHAR(100);

-- City and state display values
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS city VARCHAR(100);

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS state VARCHAR(40);

-- Full address
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS address_line1 TEXT;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS address_line2 TEXT;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS zip_code VARCHAR(20);

-- Coordinates for geolocation
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- ============================================================================
-- 3. CONTACT COLUMNS
-- ============================================================================

-- Public phone (E.164 format: +15551234567)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone_public_e164 VARCHAR(20);

-- WhatsApp phone (E.164 format)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone_whatsapp_e164 VARCHAR(20);

-- Public email
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email_public VARCHAR(255);

-- Website URL
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS website_url VARCHAR(500);

-- ============================================================================
-- 4. SERVICE SETTINGS
-- ============================================================================

-- Incall/Outcall toggles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS incall_enabled BOOLEAN DEFAULT false;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS outcall_enabled BOOLEAN DEFAULT false;

-- ============================================================================
-- 5. PRICING (deprecated - use profile_rates instead)
-- ============================================================================

-- Base rate per minute in cents (deprecated, kept for backward compatibility)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS base_rate_per_min_cents INT;

-- ============================================================================
-- 6. SEO & SLUGS
-- ============================================================================

-- Profile slug for URLs (e.g., 'john-therapist-nyc')
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS slug VARCHAR(100);

-- ============================================================================
-- 7. INDEXES FOR PERFORMANCE
-- ============================================================================

-- Index for city-based searches
CREATE INDEX IF NOT EXISTS idx_profiles_city_slug
  ON public.profiles(city_slug);

-- Index for slug lookups (SEO URLs)
CREATE INDEX IF NOT EXISTS idx_profiles_slug
  ON public.profiles(slug)
  WHERE slug IS NOT NULL;

-- Unique constraint on slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_slug_unique
  ON public.profiles(slug)
  WHERE slug IS NOT NULL;

-- Index for geolocation queries
CREATE INDEX IF NOT EXISTS idx_profiles_location
  ON public.profiles(latitude, longitude)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- ============================================================================
-- 8. COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON COLUMN public.profiles.city_slug IS
  'City slug for filtering (e.g., new-york-ny). Used in explore queries.';

COMMENT ON COLUMN public.profiles.slug IS
  'Unique profile slug for SEO URLs (e.g., john-therapist-nyc).';

COMMENT ON COLUMN public.profiles.phone_public_e164 IS
  'Public phone number in E.164 format (+15551234567). Required for profile approval.';

COMMENT ON COLUMN public.profiles.latitude IS
  'Latitude for geolocation. Used with longitude for distance-based searches.';

COMMENT ON COLUMN public.profiles.longitude IS
  'Longitude for geolocation. Used with latitude for distance-based searches.';

COMMENT ON COLUMN public.profiles.base_rate_per_min_cents IS
  'DEPRECATED: Use profile_rates table instead. Kept for backward compatibility.';

-- ============================================================================
-- 9. VALIDATION FUNCTION UPDATE
-- ============================================================================

-- Update the helper function can_submit_for_review to use correct column names
-- (This assumes the function exists from 20251224_onboarding_schema.sql)

-- Note: The function references city_slug, so it will work once this migration runs

-- ============================================================================
-- DONE
-- ============================================================================

-- This migration is idempotent (uses IF NOT EXISTS)
-- Safe to run multiple times
