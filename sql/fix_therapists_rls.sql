-- ============================================
-- Fix Therapists Table RLS Policies
-- ============================================
-- Run this in Supabase SQL Editor to fix the RLS issues

-- 1. Drop existing policies (if any)
DROP POLICY IF EXISTS "Public can view active therapists" ON public.therapists;
DROP POLICY IF EXISTS "Users can view their own therapist profile" ON public.therapists;
DROP POLICY IF EXISTS "Users can update their own therapist profile" ON public.therapists;
DROP POLICY IF EXISTS "Users can insert their own therapist profile" ON public.therapists;
DROP POLICY IF EXISTS "Users can delete their own therapist profile" ON public.therapists;

-- 2. Ensure RLS is enabled
ALTER TABLE public.therapists ENABLE ROW LEVEL SECURITY;

-- 3. Create fresh RLS policies

-- Public can view active therapists
CREATE POLICY "Public can view active therapists"
  ON public.therapists
  FOR SELECT
  USING (status = 'active');

-- Users can view their own profile regardless of status
CREATE POLICY "Users can view their own therapist profile"
  ON public.therapists
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own therapist profile"
  ON public.therapists
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own therapist profile"
  ON public.therapists
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own profile
CREATE POLICY "Users can delete their own therapist profile"
  ON public.therapists
  FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Verify policies were created
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'therapists'
ORDER BY policyname;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Therapists table RLS policies have been reset!';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Policies created:';
  RAISE NOTICE '   1. Public can view active therapists (SELECT)';
  RAISE NOTICE '   2. Users can view their own therapist profile (SELECT)';
  RAISE NOTICE '   3. Users can insert their own therapist profile (INSERT)';
  RAISE NOTICE '   4. Users can update their own therapist profile (UPDATE)';
  RAISE NOTICE '   5. Users can delete their own therapist profile (DELETE)';
  RAISE NOTICE '';
  RAISE NOTICE '🔒 RLS is ENABLED on public.therapists';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Next step: Test the signup flow in your app';
END $$;
