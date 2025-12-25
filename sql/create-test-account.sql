-- ============================================
-- Create Test Account
-- ============================================
-- Run this in Supabase SQL Editor to create a test therapist account
-- This assumes the therapists table has been created

DO $$
DECLARE
  test_user_id UUID;
BEGIN
  -- 1. Check if therapists table exists
  IF NOT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'therapists'
  ) THEN
    RAISE EXCEPTION 'Table "therapists" does not exist. Please run setup_therapists_table.sql first.';
  END IF;

  -- 2. Get or create the user in auth.users
  -- Note: You need to manually create the auth user first via Supabase Dashboard or API
  -- For now, we'll use a placeholder UUID that you'll replace

  RAISE NOTICE '';
  RAISE NOTICE '════════════════════════════════════════════════════════════════';
  RAISE NOTICE '⚠️  MANUAL STEP REQUIRED';
  RAISE NOTICE '════════════════════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE 'You need to create the auth user first via:';
  RAISE NOTICE '';
  RAISE NOTICE '1. Go to Supabase Dashboard → Authentication → Users';
  RAISE NOTICE '2. Click "Add user" → "Create new user"';
  RAISE NOTICE '3. Enter:';
  RAISE NOTICE '   Email: test.therapist@masseurmatch.com';
  RAISE NOTICE '   Password: TestPass123!';
  RAISE NOTICE '   Auto Confirm: ✓ (checked)';
  RAISE NOTICE '4. Click "Create user"';
  RAISE NOTICE '5. Copy the User UID';
  RAISE NOTICE '6. Replace USER_ID_HERE below with the actual UUID';
  RAISE NOTICE '';
  RAISE NOTICE '════════════════════════════════════════════════════════════════';
  RAISE NOTICE '';

  -- Replace 'USER_ID_HERE' with the actual UUID from auth.users after creating the user
  test_user_id := 'USER_ID_HERE'; -- ⚠️ REPLACE THIS

  -- Uncomment the INSERT below after replacing USER_ID_HERE
  /*
  INSERT INTO public.therapists (
    user_id,
    full_name,
    display_name,
    email,
    phone,
    city,
    languages,
    services,
    agree_terms,
    plan,
    plan_name,
    price_monthly,
    status,
    created_at,
    updated_at
  ) VALUES (
    test_user_id,
    'Test Therapist',
    'Sarah Test',
    'test.therapist@masseurmatch.com',
    '(555) 123-4567',
    'Los Angeles',
    ARRAY['English', 'Spanish'],
    ARRAY['Swedish Massage', 'Deep Tissue'],
    true,
    'free',
    'Free',
    0,
    'pending',
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    display_name = EXCLUDED.display_name,
    updated_at = NOW();

  RAISE NOTICE '';
  RAISE NOTICE '✅ Test therapist profile created!';
  RAISE NOTICE '';
  RAISE NOTICE '════════════════════════════════════════════════════════════════';
  RAISE NOTICE '📧 Email:    test.therapist@masseurmatch.com';
  RAISE NOTICE '🔑 Password: TestPass123!';
  RAISE NOTICE '════════════════════════════════════════════════════════════════';
  */

END $$;
