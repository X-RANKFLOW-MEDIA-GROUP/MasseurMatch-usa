-- ============================================================================
-- Schema Consistency Fixes
-- Addresses user_id inconsistencies and duplicated stripe_customer_id
-- ============================================================================

-- ============================================================================
-- 1. FIX: Clarify profiles.user_id relationship
-- ============================================================================

-- Ensure profiles.user_id exists and references auth.users
-- This is the canonical FK from profiles -> auth.users
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing profiles where user_id is null (assuming profiles.id was the user_id)
UPDATE public.profiles
SET user_id = id
WHERE user_id IS NULL;

-- Make user_id NOT NULL after backfill
ALTER TABLE public.profiles
  ALTER COLUMN user_id SET NOT NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id
  ON public.profiles(user_id);

-- Add unique constraint: one profile per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_user_unique
  ON public.profiles(user_id);

-- ============================================================================
-- 2. FIX: Remove duplicate stripe_customer_id from profiles
-- ============================================================================

-- Decision: stripe_customer_id lives in auth.users (or extended users table)
-- NOT in profiles, since it's 1:1 with user, not profile

-- First, migrate any existing data from profiles to users
DO $$
DECLARE
  profile_record RECORD;
BEGIN
  FOR profile_record IN
    SELECT id, user_id, stripe_customer_id
    FROM public.profiles
    WHERE stripe_customer_id IS NOT NULL
  LOOP
    -- Update users table with stripe_customer_id from profiles
    UPDATE public.users
    SET stripe_customer_id = profile_record.stripe_customer_id
    WHERE id = profile_record.user_id
      AND stripe_customer_id IS NULL;
  END LOOP;
END $$;

-- Drop the duplicate column from profiles
ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS stripe_customer_id;

-- Drop the index that was created for profiles.stripe_customer_id
DROP INDEX IF EXISTS public.idx_profiles_stripe_customer;

-- ============================================================================
-- 3. FIX: Ensure users.stripe_customer_id exists
-- ============================================================================

-- Add to users table if not exists (canonical location)
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);

-- Create index for lookup by Stripe customer ID
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer
  ON public.users(stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

-- Make it unique (one Stripe customer per user)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_stripe_customer_unique
  ON public.users(stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

-- ============================================================================
-- 4. FIX: Subscriptions should reference users, not profiles
-- ============================================================================

-- Verify subscriptions.user_id references users (should already be correct from previous migration)
-- Add comment to clarify
COMMENT ON COLUMN public.subscriptions.user_id IS
  'FK to auth.users(id). One user can have multiple subscriptions over time, but only one active.';

-- ============================================================================
-- 5. FIX: Update RLS policies to use correct user_id reference
-- ============================================================================

-- Drop and recreate policies that might use wrong assumptions
DROP POLICY IF EXISTS "Users can manage their profile languages" ON public.profile_languages;
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

DROP POLICY IF EXISTS "Users can manage their profile services" ON public.profile_services;
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

DROP POLICY IF EXISTS "Users can manage their profile setups" ON public.profile_setups;
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
-- 6. NOTE: Storage schema owner/owner_id
-- ============================================================================

-- The storage.* schema (buckets, objects) is managed by Supabase
-- Known issue: owner (uuid, deprecated) vs owner_id (text)
--
-- Recommendation: Use RLS policies to control access, avoid direct joins on owner_id
-- Example storage policy:
--
-- CREATE POLICY "Users can upload their own profile photos"
--   ON storage.objects FOR INSERT
--   WITH CHECK (
--     bucket_id = 'profile-photos'
--     AND (storage.foldername(name))[1] = auth.uid()::text
--   );
--
-- This way we avoid type mismatches by using auth.uid()::text for path-based auth

COMMENT ON SCHEMA storage IS
  'Supabase storage schema. CAUTION: owner_id is TEXT not UUID. Use RLS with auth.uid()::text for path-based auth.';

-- ============================================================================
-- 7. VALIDATION QUERY
-- ============================================================================

-- Run this to verify consistency after migration:
/*
SELECT
  'profiles.user_id should be UUID and reference auth.users' as check_name,
  COUNT(*) as count,
  COUNT(CASE WHEN user_id IS NULL THEN 1 END) as null_count
FROM public.profiles;

SELECT
  'users should have stripe_customer_id column' as check_name,
  COUNT(*) as total_users,
  COUNT(stripe_customer_id) as users_with_stripe
FROM public.users;

SELECT
  'no duplicate stripe_customer_id in users' as check_name,
  COUNT(*) as total,
  COUNT(DISTINCT stripe_customer_id) as unique_customers
FROM public.users
WHERE stripe_customer_id IS NOT NULL;
*/

-- ============================================================================
-- DONE
-- ============================================================================

COMMENT ON TABLE public.profiles IS
  'User profiles. Each user (auth.users) has one profile. profiles.user_id -> auth.users.id.';

COMMENT ON COLUMN public.profiles.user_id IS
  'FK to auth.users(id). One user = one profile. Use this for all user-related joins.';
