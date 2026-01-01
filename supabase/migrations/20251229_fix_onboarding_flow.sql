-- ============================================================================
-- Fix Complete Onboarding Flow
-- ============================================================================
-- This migration ensures the complete onboarding flow works correctly by:
-- 1. Ensuring user_id column exists in profiles
-- 2. Configuring proper RLS for public.users
-- 3. Updating trigger to create both users and profiles correctly
-- 4. Ensuring all necessary policies are in place
-- ============================================================================

-- ============================================================================
-- STEP 1: Ensure user_id column exists in profiles
-- ============================================================================

DO $$
BEGIN
  -- Add user_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN user_id UUID;

    -- Populate user_id for existing records
    UPDATE public.profiles SET user_id = id WHERE user_id IS NULL;

    -- Make it NOT NULL after populating
    ALTER TABLE public.profiles ALTER COLUMN user_id SET NOT NULL;

    -- Add foreign key constraint
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- ============================================================================
-- STEP 1b: Ensure stripe-related columns exist in public.users
-- ============================================================================

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS stripe_identity_session_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS identity_verified_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_users_stripe_customer
  ON public.users(stripe_customer_id);

-- ============================================================================
-- STEP 2: Configure RLS for public.users
-- ============================================================================

-- Enable RLS on public.users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own user record" ON public.users;
DROP POLICY IF EXISTS "Users can update own user record" ON public.users;
DROP POLICY IF EXISTS "Service role can manage all users" ON public.users;

-- Users can view their own user record
CREATE POLICY "Users can view own user record"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own user record (for profile updates)
CREATE POLICY "Users can update own user record"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Service role can manage all users (needed for triggers and webhooks)
CREATE POLICY "Service role can manage all users"
  ON public.users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- STEP 3: Fix auto-create user trigger
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
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
    user_id = COALESCE(profiles.user_id, EXCLUDED.user_id),
    email = COALESCE(profiles.email, EXCLUDED.email);

  RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- STEP 4: Backfill existing records
-- ============================================================================

-- Backfill public.users for any auth.users without records
INSERT INTO public.users (id, identity_status, role, created_at, updated_at)
SELECT
  id,
  'pending'::identity_status_enum,
  'user'::user_role_enum,
  created_at,
  COALESCE(updated_at, created_at)
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;

-- Backfill public.profiles for any auth.users without records
INSERT INTO public.profiles (id, user_id, email, created_at, updated_at)
SELECT
  id,
  id,
  email,
  created_at,
  COALESCE(updated_at, created_at)
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO UPDATE SET
  user_id = COALESCE(profiles.user_id, EXCLUDED.user_id);

-- Update any profiles that have NULL user_id
UPDATE public.profiles
SET user_id = id
WHERE user_id IS NULL OR user_id != id;

-- ============================================================================
-- STEP 5: Ensure RLS policies for related tables are correct
-- ============================================================================

-- Ensure profile_languages, profile_services, profile_setups have correct RLS
DO $$
BEGIN
  -- profile_languages
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profile_languages') THEN
    ALTER TABLE public.profile_languages ENABLE ROW LEVEL SECURITY;

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
  END IF;

  -- profile_services
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profile_services') THEN
    ALTER TABLE public.profile_services ENABLE ROW LEVEL SECURITY;

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
  END IF;

  -- profile_setups
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profile_setups') THEN
    ALTER TABLE public.profile_setups ENABLE ROW LEVEL SECURITY;

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
  END IF;
END $$;

-- ============================================================================
-- STEP 6: Grant necessary permissions
-- ============================================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Grant permissions on users table
GRANT SELECT, UPDATE ON public.users TO authenticated;
GRANT ALL ON public.users TO service_role;

-- Grant permissions on profiles table
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- Grant permissions on subscriptions table (only if exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'subscriptions') THEN
    GRANT SELECT ON public.subscriptions TO authenticated;
    GRANT ALL ON public.subscriptions TO service_role;
  END IF;
END $$;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION public.handle_new_user IS
  'Automatically creates public.users and public.profiles records when a new auth.users record is inserted. Uses SECURITY DEFINER to bypass RLS.';

COMMENT ON COLUMN public.profiles.user_id IS
  'Foreign key to public.users. Should always equal profiles.id for 1:1 relationship.';

COMMENT ON POLICY "Users can view own user record" ON public.users IS
  'Allows users to view their own record in public.users via RLS';

COMMENT ON POLICY "Service role can manage all users" ON public.users IS
  'Allows service role (triggers, webhooks, backend) to create/update user records';
