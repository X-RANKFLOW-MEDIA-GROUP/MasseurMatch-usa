-- ============================================================================
-- Auto-create public.users and public.profiles on auth.users insert
-- ============================================================================
-- This trigger ensures that when a user signs up via Supabase Auth,
-- corresponding records are automatically created in public.users and public.profiles

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

  -- Create record in public.profiles
  INSERT INTO public.profiles (
    id,
    email,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- Backfill existing auth.users that don't have public.users/profiles records
-- ============================================================================

-- Backfill public.users
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

-- Backfill public.profiles
INSERT INTO public.profiles (id, email, created_at, updated_at)
SELECT
  id,
  email,
  created_at,
  COALESCE(updated_at, created_at)
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

COMMENT ON FUNCTION public.handle_new_user IS 'Automatically creates public.users and public.profiles records when a new auth.users record is inserted';
