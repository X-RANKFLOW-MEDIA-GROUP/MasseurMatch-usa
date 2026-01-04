-- Migration: Add comprehensive profile fields
-- Description: Adds all new fields for the comprehensive therapist profile editor
-- Date: 2026-01-04

-- Add new columns to profiles table
ALTER TABLE profiles

-- Basic Information (additional fields)
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS professional_title TEXT,
ADD COLUMN IF NOT EXISTS philosophy TEXT,

-- Location & Service Area (additional fields)
ADD COLUMN IF NOT EXISTS street_address TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT,
ADD COLUMN IF NOT EXISTS service_radius INTEGER,
ADD COLUMN IF NOT EXISTS in_studio BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS mobile_service BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS hotel_visits BOOLEAN DEFAULT false,

-- Service Offerings
ADD COLUMN IF NOT EXISTS massage_techniques TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS studio_amenities TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS mobile_extras TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS product_sales TEXT[] DEFAULT '{}',

-- Rates & Pricing (additional fields)
ADD COLUMN IF NOT EXISTS rate_120 TEXT,
ADD COLUMN IF NOT EXISTS payment_methods TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS discount_new_client TEXT,
ADD COLUMN IF NOT EXISTS discount_multiple_sessions TEXT,
ADD COLUMN IF NOT EXISTS discount_referrals TEXT,
ADD COLUMN IF NOT EXISTS discount_group TEXT,

-- Weekly Availability Schedule (stored as JSONB for flexibility)
ADD COLUMN IF NOT EXISTS weekly_schedule JSONB DEFAULT '{
  "Monday": {"studio_start": "", "studio_end": "", "mobile_start": "", "mobile_end": ""},
  "Tuesday": {"studio_start": "", "studio_end": "", "mobile_start": "", "mobile_end": ""},
  "Wednesday": {"studio_start": "", "studio_end": "", "mobile_start": "", "mobile_end": ""},
  "Thursday": {"studio_start": "", "studio_end": "", "mobile_start": "", "mobile_end": ""},
  "Friday": {"studio_start": "", "studio_end": "", "mobile_start": "", "mobile_end": ""},
  "Saturday": {"studio_start": "", "studio_end": "", "mobile_start": "", "mobile_end": ""},
  "Sunday": {"studio_start": "", "studio_end": "", "mobile_start": "", "mobile_end": ""}
}'::jsonb,

-- Professional Credentials
ADD COLUMN IF NOT EXISTS degrees_certifications TEXT,
ADD COLUMN IF NOT EXISTS years_experience INTEGER,
ADD COLUMN IF NOT EXISTS professional_affiliations TEXT,
ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT '{}',

-- Business Travel
ADD COLUMN IF NOT EXISTS travel_schedule TEXT,

-- Photo Gallery
ADD COLUMN IF NOT EXISTS gallery_photos TEXT[] DEFAULT '{}',

-- Social Media & Contact
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS whatsapp TEXT,

-- Client Preferences
ADD COLUMN IF NOT EXISTS preference_lgbtq_only BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS preference_men_only BOOLEAN DEFAULT false;

-- Create indexes for frequently queried fields
CREATE INDEX IF NOT EXISTS idx_profiles_in_studio ON profiles(in_studio) WHERE in_studio = true;
CREATE INDEX IF NOT EXISTS idx_profiles_mobile_service ON profiles(mobile_service) WHERE mobile_service = true;
CREATE INDEX IF NOT EXISTS idx_profiles_city_state ON profiles(city, state);
CREATE INDEX IF NOT EXISTS idx_profiles_massage_techniques ON profiles USING GIN(massage_techniques);
CREATE INDEX IF NOT EXISTS idx_profiles_languages ON profiles USING GIN(languages);

-- Add comments for documentation
COMMENT ON COLUMN profiles.full_name IS 'Therapist full legal name';
COMMENT ON COLUMN profiles.professional_title IS 'Professional title (e.g., Licensed Massage Therapist, LMT)';
COMMENT ON COLUMN profiles.philosophy IS 'Therapist philosophy and approach to massage therapy';
COMMENT ON COLUMN profiles.street_address IS 'Studio street address';
COMMENT ON COLUMN profiles.service_radius IS 'Mobile service radius in miles';
COMMENT ON COLUMN profiles.in_studio IS 'Offers in-studio sessions';
COMMENT ON COLUMN profiles.mobile_service IS 'Offers mobile/outcall service';
COMMENT ON COLUMN profiles.hotel_visits IS 'Offers hotel/travel visits';
COMMENT ON COLUMN profiles.massage_techniques IS 'Array of massage techniques offered';
COMMENT ON COLUMN profiles.studio_amenities IS 'Array of studio amenities available';
COMMENT ON COLUMN profiles.mobile_extras IS 'Array of mobile service extras';
COMMENT ON COLUMN profiles.product_sales IS 'Array of products available for sale';
COMMENT ON COLUMN profiles.payment_methods IS 'Accepted payment methods';
COMMENT ON COLUMN profiles.discount_new_client IS 'New client discount description';
COMMENT ON COLUMN profiles.discount_multiple_sessions IS 'Multiple sessions package description';
COMMENT ON COLUMN profiles.discount_referrals IS 'Referral discount description';
COMMENT ON COLUMN profiles.discount_group IS 'Group/couples discount description';
COMMENT ON COLUMN profiles.weekly_schedule IS 'Weekly availability schedule with in-studio and mobile hours';
COMMENT ON COLUMN profiles.degrees_certifications IS 'Degrees, certifications, and licenses';
COMMENT ON COLUMN profiles.years_experience IS 'Years of professional experience';
COMMENT ON COLUMN profiles.professional_affiliations IS 'Professional organizations and affiliations';
COMMENT ON COLUMN profiles.languages IS 'Languages spoken';
COMMENT ON COLUMN profiles.travel_schedule IS 'Business travel schedule and locations';
COMMENT ON COLUMN profiles.gallery_photos IS 'Array of gallery photo URLs';
COMMENT ON COLUMN profiles.website IS 'Personal or business website URL';
COMMENT ON COLUMN profiles.instagram IS 'Instagram handle';
COMMENT ON COLUMN profiles.whatsapp IS 'WhatsApp contact number';
COMMENT ON COLUMN profiles.preference_lgbtq_only IS 'Prefer LGBTQ+ clients only';
COMMENT ON COLUMN profiles.preference_men_only IS 'Prefer male clients only';

-- Grant necessary permissions (adjust based on your RLS policies)
-- These are examples - adjust based on your existing security setup
-- GRANT SELECT ON profiles TO authenticated;
-- GRANT UPDATE ON profiles TO authenticated;
