-- ============================================
-- SIMPLE SEED SCRIPT - MasseurMatch Test Therapist
-- ============================================
-- This script creates ONLY the therapist profile data
-- You must create the auth user separately via Supabase Dashboard

-- ⚠️ IMPORTANT: Create the user FIRST via Supabase Dashboard:
-- 1. Go to: https://app.supabase.com/ → Authentication → Users
-- 2. Click "Add user" → Email
-- 3. Email: test@test.com
-- 4. Password: 123456
-- 5. Auto Confirm User: YES (enable this!)
-- 6. Copy the UUID from the created user
-- 7. Replace 'YOUR-USER-UUID-HERE' below with that UUID

-- ============================================
-- STEP 1: Update this UUID with your actual user ID!
-- ============================================
DO $$
DECLARE
  test_user_id uuid := 'a0000000-0000-0000-0000-000000000001'::uuid; -- ⚠️ REPLACE THIS!
BEGIN

  -- Check if user exists in auth.users
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = test_user_id) THEN
    RAISE EXCEPTION '❌ User with ID % does not exist! Create the user in Supabase Dashboard first.', test_user_id;
  END IF;

  -- Delete existing therapist profile if exists (for re-running)
  DELETE FROM public.therapists WHERE user_id = test_user_id;

  -- Create therapist profile
  INSERT INTO public.therapists (
    user_id,
    full_name,
    display_name,
    headline,
    about,
    philosophy,
    email,
    phone,
    city,
    state,
    country,
    neighborhood,
    address,
    zip_code,
    nearest_intersection,
    latitude,
    longitude,
    mobile_service_radius,
    services_headline,
    specialties_headline,
    promotions_headline,
    services,
    massage_techniques,
    studio_amenities,
    mobile_extras,
    additional_services,
    products_used,
    rate_60,
    rate_90,
    rate_outcall,
    payment_methods,
    regular_discounts,
    day_of_week_discount,
    weekly_specials,
    special_discount_groups,
    availability,
    degrees,
    affiliations,
    massage_start_date,
    languages,
    business_trips,
    rating,
    override_reviews_count,
    website,
    instagram,
    whatsapp,
    birthdate,
    years_experience,
    profile_photo,
    gallery,
    agree_terms,
    plan,
    plan_name,
    price_monthly,
    status,
    paid_until,
    subscription_status,
    stripe_current_period_end,
    created_at,
    updated_at
  ) VALUES (
    test_user_id,
    'Alex Santos - Test',
    'Alex Santos',
    'Professional Certified Massage Therapist - Deep Tissue Specialist',
    'Hello! I''m Alex Santos, a certified massage therapist with over 8 years of experience helping clients achieve deep relaxation and muscle tension relief. My approach combines traditional techniques with modern methods to provide a unique therapeutic experience.',
    'I believe massage is a healing art that goes beyond the physical, reaching mental and emotional well-being. Each session is personalized to meet each client''s specific needs, creating a safe and welcoming environment.',
    'test@test.com',
    '+1 (555) 123-4567',
    'Los Angeles',
    'CA',
    'USA',
    'West Hollywood',
    '123 Wellness Street, Suite 456',
    '90069',
    'Santa Monica Blvd & La Cienega',
    '34.0901',
    '-118.3756',
    15,
    'Therapeutic, Relaxation & Sports Massage',
    'Deep Tissue, Swedish, Sports Massage, Trigger Point',
    'First session 20% off!',
    ARRAY['Therapeutic Massage', 'Relaxation Massage', 'Sports Massage', 'Deep Tissue', 'Swedish Massage'],
    ARRAY['Deep Tissue', 'Swedish', 'Sports Massage', 'Trigger Point Therapy', 'Myofascial Release', 'Hot Stone', 'Aromatherapy'],
    ARRAY['Air conditioning', 'Relaxing music', 'Aromatherapy', 'Shower available', 'Free parking', 'Clean towels provided'],
    ARRAY['Professional portable table', 'Premium oils', 'Ambient music', 'Heated towels'],
    ARRAY['Reflexology', 'Body scrub', 'Hot stone therapy'],
    'Organic essential oils, Premium unscented massage oils',
    '$80',
    '$110',
    '$150 (+ travel fee)',
    ARRAY['Cash', 'Credit card', 'Debit card', 'Venmo', 'Zelle', 'PayPal'],
    '5-session package with 15% discount',
    'Mondays: 10% off',
    'Happy Hour (2pm-4pm): $70/hour',
    ARRAY['Students', 'Seniors', 'Healthcare workers'],
    jsonb_build_object(
      'monday', jsonb_build_object('available', true, 'hours', '9:00 AM - 8:00 PM'),
      'tuesday', jsonb_build_object('available', true, 'hours', '9:00 AM - 8:00 PM'),
      'wednesday', jsonb_build_object('available', true, 'hours', '9:00 AM - 8:00 PM'),
      'thursday', jsonb_build_object('available', true, 'hours', '9:00 AM - 8:00 PM'),
      'friday', jsonb_build_object('available', true, 'hours', '9:00 AM - 6:00 PM'),
      'saturday', jsonb_build_object('available', true, 'hours', '10:00 AM - 4:00 PM'),
      'sunday', jsonb_build_object('available', false, 'hours', 'Closed')
    ),
    'Certified in Massage Therapy by Pacific College of Health and Science (2016)',
    ARRAY['AMTA - American Massage Therapy Association', 'NCBTMB - National Certification Board'],
    '2016-03-15',
    ARRAY['English', 'Spanish', 'Portuguese'],
    ARRAY['Las Vegas, NV', 'San Diego, CA', 'San Francisco, CA'],
    4.8,
    127,
    'https://alexsantosmassage.com',
    '@alexsantosmassage',
    '+15551234567',
    '1990-05-15',
    8,
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
    ARRAY[
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&h=600&fit=crop'
    ],
    true,
    'premium',
    'Premium Plan',
    49.99,
    'active',
    (now() + interval '30 days')::timestamptz,
    'active',
    (now() + interval '30 days')::timestamptz,
    now(),
    now()
  );

  -- Add some fake reviews
  DELETE FROM public.reviews WHERE therapist_id = test_user_id;

  INSERT INTO public.reviews (therapist_id, reviewer_name, rating, comment, date) VALUES
    (test_user_id, 'Maria Silva', 5, 'Amazing experience! Alex has magic hands and really understands deep tissue techniques. I left feeling renewed!', now() - interval '5 days'),
    (test_user_id, 'John Williams', 5, 'Best massage I''ve had in LA! Very professional, clean studio, and Alex really knows how to work out those knots. Highly recommend!', now() - interval '12 days'),
    (test_user_id, 'Carlos Rodriguez', 4, 'Very good! Excellent service and super relaxing environment. The only thing is I wish the sessions were a bit longer.', now() - interval '18 days'),
    (test_user_id, 'Sarah Johnson', 5, 'Alex is amazing! I have chronic back pain and after just 3 sessions I''m feeling so much better. The hot stone add-on is worth it!', now() - interval '25 days'),
    (test_user_id, 'Pedro Mendes', 5, 'Top professional! Explains everything before starting, respects limits and really cares about client well-being.', now() - interval '32 days');

  -- Success message
  RAISE NOTICE '✅ Test therapist profile created successfully!';
  RAISE NOTICE '';
  RAISE NOTICE '📧 Email: test@test.com';
  RAISE NOTICE '🔑 Password: 123456';
  RAISE NOTICE '👤 Name: Alex Santos';
  RAISE NOTICE '📍 Location: Los Angeles, CA';
  RAISE NOTICE '⭐ Rating: 4.8 (127 reviews)';
  RAISE NOTICE '💳 Plan: Premium (active until %)', to_char(now() + interval '30 days', 'YYYY-MM-DD');
  RAISE NOTICE '';
  RAISE NOTICE '🔗 User UUID: %', test_user_id;
  RAISE NOTICE '';
  RAISE NOTICE 'You can now login with test@test.com / 123456';

END $$;
