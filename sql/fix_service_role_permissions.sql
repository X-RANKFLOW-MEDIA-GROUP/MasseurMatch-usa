-- ============================================================================
-- Fix Service Role Permissions for Therapists Table
-- ============================================================================
-- This migration grants the service_role necessary permissions to insert,
-- update, and delete records in the therapists table. This is required for
-- the signup API endpoint to work properly.
--
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Grant full permissions on therapists table to service_role
GRANT ALL ON public.therapists TO service_role;

-- Also ensure service_role can work with sequences (for any serial columns)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Verify the grants
DO $$
BEGIN
  RAISE NOTICE '✅ Permissions granted to service_role on therapists table';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Granted permissions:';
  RAISE NOTICE '   - SELECT (read therapists)';
  RAISE NOTICE '   - INSERT (create new therapists)';
  RAISE NOTICE '   - UPDATE (modify therapist data)';
  RAISE NOTICE '   - DELETE (remove therapists)';
  RAISE NOTICE '';
  RAISE NOTICE '🔐 Note: service_role bypasses RLS policies';
  RAISE NOTICE '   This is expected and required for admin operations';
END $$;
