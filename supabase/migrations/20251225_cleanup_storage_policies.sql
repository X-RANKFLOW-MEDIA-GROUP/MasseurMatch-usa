-- ============================================================================
-- Storage Policies Cleanup
-- Remove duplicate RLS policies on storage.objects for 'profiles' bucket
-- ============================================================================

-- You have multiple duplicate policies for the same operations.
-- This migration consolidates them into a single set of clear policies.

-- ============================================================================
-- 1. DROP ALL EXISTING DUPLICATE POLICIES
-- ============================================================================

-- Delete policies (4 duplicates found)
DROP POLICY IF EXISTS "profiles-user-delete" ON storage.objects;
DROP POLICY IF EXISTS "profiles_delete_own" ON storage.objects;
DROP POLICY IF EXISTS "user can delete own folder" ON storage.objects;
DROP POLICY IF EXISTS "profiles_objects_delete_own" ON storage.objects;

-- Insert policies (4 duplicates found)
DROP POLICY IF EXISTS "profiles-user-insert" ON storage.objects;
DROP POLICY IF EXISTS "profiles_insert_own" ON storage.objects;
DROP POLICY IF EXISTS "user can upload to own folder" ON storage.objects;
DROP POLICY IF EXISTS "profiles_objects_insert_own" ON storage.objects;
DROP POLICY IF EXISTS "objects_insert_owner_only" ON storage.objects; -- Generic, needs replacement

-- Update policies (4 duplicates found)
DROP POLICY IF EXISTS "profiles-user-update" ON storage.objects;
DROP POLICY IF EXISTS "profiles_update_own" ON storage.objects;
DROP POLICY IF EXISTS "user can update own folder" ON storage.objects;
DROP POLICY IF EXISTS "profiles_objects_update_own" ON storage.objects;

-- Select/Read policies (5 duplicates found!)
DROP POLICY IF EXISTS "profiles_read_public" ON storage.objects;
DROP POLICY IF EXISTS "public read" ON storage.objects;
DROP POLICY IF EXISTS "profiles-public-read" ON storage.objects;
DROP POLICY IF EXISTS "objects_select_public_or_owner" ON storage.objects; -- Generic, needs replacement

-- ============================================================================
-- 2. CREATE SINGLE, CLEAR SET OF POLICIES
-- ============================================================================

-- Policy naming convention: {bucket}_{operation}
-- Using storage.foldername() for cleaner path parsing

-- INSERT: Users can upload to their own folder in 'profiles' bucket
CREATE POLICY "profiles_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'profiles'
    AND (storage.foldername(name))[1] = (auth.uid())::text
  );

-- SELECT (authenticated): Users can view their own files in 'profiles' bucket
CREATE POLICY "profiles_select_own"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'profiles'
    AND (storage.foldername(name))[1] = (auth.uid())::text
  );

-- SELECT (public): Anyone can view files in 'profiles' bucket
-- This is needed for public profile photos to be accessible
CREATE POLICY "profiles_select_public"
  ON storage.objects FOR SELECT
  TO public
  USING (
    bucket_id = 'profiles'
  );

-- UPDATE: Users can update their own files in 'profiles' bucket
CREATE POLICY "profiles_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'profiles'
    AND (storage.foldername(name))[1] = (auth.uid())::text
  )
  WITH CHECK (
    bucket_id = 'profiles'
    AND (storage.foldername(name))[1] = (auth.uid())::text
  );

-- DELETE: Users can delete their own files in 'profiles' bucket
CREATE POLICY "profiles_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'profiles'
    AND (storage.foldername(name))[1] = (auth.uid())::text
  );

-- ============================================================================
-- 3. POLICY STRUCTURE EXPLANATION
-- ============================================================================

-- Current structure: All files in 'profiles' bucket are publicly readable
-- This matches the existing behavior of your duplicate policies.
--
-- If you want to restrict public access, you could use a folder structure:
-- - profiles/{user_id}/public/photo.jpg (public access)
-- - profiles/{user_id}/private/photo.jpg (owner only)
--
-- To implement this, replace profiles_select_public with:
--
-- CREATE POLICY "profiles_select_public_folder"
--   ON storage.objects FOR SELECT
--   TO public
--   USING (
--     bucket_id = 'profiles'
--     AND (storage.foldername(name))[2] = 'public'
--   );

-- ============================================================================
-- DONE
-- ============================================================================

COMMENT ON POLICY "profiles_insert" ON storage.objects IS
  'Authenticated users can upload files to their own folder in profiles bucket';

COMMENT ON POLICY "profiles_select_own" ON storage.objects IS
  'Authenticated users can view their own files in profiles bucket';

COMMENT ON POLICY "profiles_select_public" ON storage.objects IS
  'Public (unauthenticated) users can view all files in profiles bucket for public profile access';

COMMENT ON POLICY "profiles_update" ON storage.objects IS
  'Authenticated users can update their own files in profiles bucket';

COMMENT ON POLICY "profiles_delete" ON storage.objects IS
  'Authenticated users can delete their own files in profiles bucket';
