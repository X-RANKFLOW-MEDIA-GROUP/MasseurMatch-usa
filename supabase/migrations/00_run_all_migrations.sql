-- ============================================================================
-- CONSOLIDATED MIGRATION SCRIPT
-- ============================================================================
-- This script consolidates all migrations in the correct order
-- Execute this file to set up the complete database schema
--
-- Order of execution:
-- 1. Base schema (core tables)
-- 2. Onboarding schema (enums, subscriptions)
-- 3. Profile columns
-- 4. Relationship tables
-- 5. Auto-create triggers
-- 6. RLS and fixes
-- ============================================================================

\echo '========================================='
\echo 'Starting MasseurMatch Database Setup'
\echo '========================================='

-- ============================================================================
-- MIGRATION 1: Base Schema
-- ============================================================================
\echo ''
\echo '[1/6] Running base schema...'

\ir 20251223_base_schema.sql

\echo '✓ Base schema completed'

-- ============================================================================
-- MIGRATION 2: Onboarding Schema
-- ============================================================================
\echo ''
\echo '[2/6] Running onboarding schema...'

\ir 20251224_onboarding_schema.sql

\echo '✓ Onboarding schema completed'

-- ============================================================================
-- MIGRATION 3: Add Missing Profile Columns
-- ============================================================================
\echo ''
\echo '[3/6] Adding missing profile columns...'

\ir 20251225_add_missing_profile_columns.sql

\echo '✓ Profile columns added'

-- ============================================================================
-- MIGRATION 4: Schema Updates (Relationship Tables)
-- ============================================================================
\echo ''
\echo '[4/6] Creating relationship tables...'

\ir 20251225_schema_updates.sql

\echo '✓ Relationship tables created'

-- ============================================================================
-- MIGRATION 5: Auto-Create User Trigger
-- ============================================================================
\echo ''
\echo '[5/6] Setting up auto-create user trigger...'

\ir 20251228_auto_create_user_profile.sql

\echo '✓ Auto-create trigger configured'

-- ============================================================================
-- MIGRATION 6: Fix Onboarding Flow (RLS, user_id, permissions)
-- ============================================================================
\echo ''
\echo '[6/6] Fixing onboarding flow and RLS...'

\ir 20251229_fix_onboarding_flow.sql

\echo '✓ Onboarding flow fixes applied'

-- ============================================================================
-- VERIFICATION
-- ============================================================================
\echo ''
\echo '========================================='
\echo 'Verifying Migration Success'
\echo '========================================='

-- Check critical tables exist
\echo ''
\echo 'Checking critical tables...'
SELECT
  CASE
    WHEN COUNT(*) = 4 THEN '✓ All critical tables exist'
    ELSE '✗ Missing tables: ' || (4 - COUNT(*))::text
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('users', 'profiles', 'subscriptions', 'media_assets');

-- Check user_id column in profiles
\echo ''
\echo 'Checking profiles.user_id column...'
SELECT
  CASE
    WHEN COUNT(*) = 1 THEN '✓ profiles.user_id exists and is NOT NULL'
    ELSE '✗ profiles.user_id missing or nullable'
  END as status
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND column_name = 'user_id'
  AND is_nullable = 'NO';

-- Check RLS on users table
\echo ''
\echo 'Checking RLS on public.users...'
SELECT
  CASE
    WHEN rowsecurity = true THEN '✓ RLS enabled on public.users'
    ELSE '✗ RLS not enabled on public.users'
  END as status
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'users';

-- Check trigger exists
\echo ''
\echo 'Checking on_auth_user_created trigger...'
SELECT
  CASE
    WHEN COUNT(*) = 1 THEN '✓ on_auth_user_created trigger exists'
    ELSE '✗ on_auth_user_created trigger missing'
  END as status
FROM information_schema.triggers
WHERE trigger_schema = 'auth'
  AND trigger_name = 'on_auth_user_created';

-- Check RLS policies on users
\echo ''
\echo 'Checking RLS policies on public.users...'
SELECT
  COUNT(*) || ' policies found' as status,
  string_agg(policyname, ', ' ORDER BY policyname) as policies
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'users';

-- Check relationship tables
\echo ''
\echo 'Checking relationship tables...'
SELECT
  CASE
    WHEN COUNT(*) = 3 THEN '✓ All relationship tables exist'
    ELSE '✗ Missing relationship tables: ' || (3 - COUNT(*))::text
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('profile_languages', 'profile_services', 'profile_setups');

\echo ''
\echo '========================================='
\echo 'Migration Summary'
\echo '========================================='
\echo ''
\echo 'Database setup completed successfully!'
\echo ''
\echo 'Next steps:'
\echo '1. Test user signup flow'
\echo '2. Verify auto-creation of users and profiles'
\echo '3. Test onboarding API endpoints'
\echo '4. Configure Stripe webhooks'
\echo ''
\echo 'Documentation:'
\echo '- ONBOARDING_FLOW_FIXES.md'
\echo '- MIGRATION_TROUBLESHOOTING.md'
\echo ''
\echo '========================================='
