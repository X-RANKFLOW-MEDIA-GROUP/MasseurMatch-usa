-- ============================================================================
-- Fix profiles table and public.users RLS
-- ============================================================================
-- This migration fixes critical issues:
-- 1. Adds user_id column to profiles (referenced by APIs but missing)
-- 2. Configures RLS for public.users table
-- 3. Updates profiles to populate user_id for existing records

-- ============================================================================
-- 1. ADD user_id COLUMN TO profiles
-- ============================================================================

-- Add user_id column (should be same as id for 1:1 relationship)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE CASCADE;

-- Populate user_id for existing profiles (user_id = id)
UPDATE public.profiles
SET user_id = id
WHERE user_id IS NULL;

-- Make user_id NOT NULL after populating
ALTER TABLE public.profiles
  ALTER COLUMN user_id SET NOT NULL;

-- Create index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_id
  ON public.profiles(user_id);

-- ============================================================================
-- 2. CONFIGURE RLS FOR public.users
-- ============================================================================

-- Enable RLS on public.users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can view their own user record
DROP POLICY IF EXISTS "Users can view own user record" ON public.users;
CREATE POLICY "Users can view own user record"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own user record
DROP POLICY IF EXISTS "Users can update own user record" ON public.users;
CREATE POLICY "Users can update own user record"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Allow service role to manage all users (for triggers and backend operations)
DROP POLICY IF EXISTS "Service role can manage all users" ON public.users;
CREATE POLICY "Service role can manage all users"
  ON public.users
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- 3. UPDATE TRIGGER TO INCLUDE user_id
-- ============================================================================

-- Recreate the trigger function to include user_id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create record in public.users
  INSERT INTO public.users (
    id,
    identity_status,
    role,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    'pending',
    'user',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create record in public.profiles with user_id
  INSERT INTO public.profiles (
    id,
    user_id,
    email,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.id,
    NEW.email,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    email = EXCLUDED.email;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 4. BACKFILL user_id FOR ANY EXISTING PROFILES
-- ============================================================================

-- Update profiles created before this migration ran
UPDATE public.profiles
SET user_id = id
WHERE user_id IS NULL OR user_id != id;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON COLUMN public.profiles.user_id IS
  'Foreign key to public.users. Should always equal profiles.id for 1:1 relationship.';

COMMENT ON POLICY "Users can view own user record" ON public.users IS
  'Allows users to view their own record in public.users';

COMMENT ON POLICY "Service role can manage all users" ON public.users IS
  'Allows service role (triggers, backend) to create/update user records';
