-- ═══════════════════════════════════════════════════════════════════════
-- Bruno Santos Profile - SEO Optimized Gay Massage Therapist in Dallas
-- Execute this SQL in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════

-- IMPORTANT: Replace 'USER_ID_HERE' with the actual user_id from auth.users
-- after creating the auth user in Supabase Authentication dashboard

-- 1. First, create auth user in Supabase Dashboard:
--    Email: bruno.santos@masseurmatch.com
--    Password: TempPassword123! (user should change after login)
--    Auto Confirm: Yes

-- 2. Then run this SQL (replace USER_ID_HERE with the actual user_id)

-- Insert Profile
INSERT INTO profiles (
  user_id,
  slug,
  display_name,
  full_name,
  headline,
  about,
  philosophy,
  professional_title,

  -- Location
  city,
  state,
  neighborhood,
  zip_code,
  service_radius,

  -- Contact
  phone,
  email,
  whatsapp,

  -- Services
  services,
  massage_techniques,

  -- Rates
  rate_60,
  rate_90,
  rate_120,
  rate_outcall,

  -- Payment
  payment_methods,

  -- Availability
  incall_available,
  outcall_available,

  -- Amenities
  studio_amenities,

  -- Professional
  years_experience,
  languages,
  degrees_certifications,

  -- Schedule (visiting Dallas Jan 4-7, 2026)
  weekly_schedule,

  -- Preferences
  preference_lgbtq_only,
  preference_men_only,

  -- Status
  status,
  verified,
  subscription_tier,
  profile_completeness,

  -- SEO
  meta_title,
  meta_description,

  -- Stats
  rating,
  review_count,

  created_at,
  updated_at
) VALUES (
  'USER_ID_HERE', -- REPLACE THIS!
  'bruno-santos-dallas',
  'Bruno Santos',
  'Bruno Santos',
  'Brazilian Gay Massage Therapist | Deep Tissue & Sports Massage in Dallas',

  'Experience authentic Brazilian massage therapy with Bruno Santos, a skilled gay massage therapist visiting Dallas from Rio de Janeiro. Specializing in deep tissue massage, sports massage, and Swedish massage techniques, Bruno brings the warmth and expertise of Rio''s renowned bodywork tradition to Dallas.

With years of experience serving the LGBTQ+ community, Bruno creates a safe, welcoming, and judgment-free space for all clients. Whether you''re seeking relief from muscle tension, sports recovery, or pure relaxation, Bruno''s intuitive touch and professional approach ensure a transformative massage experience.

Now offering both outcall and incall sessions in Dallas from January 4-7, 2026. Limited availability - book your session today and discover why clients rave about Bruno''s healing hands.

Perfect for: Athletes, gym enthusiasts, professionals seeking stress relief, and anyone looking for high-quality gay massage therapy in Dallas. LGBTQ+ friendly and proudly serving the Dallas gay community.',

  'My massage philosophy is rooted in the Brazilian tradition of healing touch and genuine human connection. I believe massage is more than just physical therapy - it''s an opportunity to restore balance, release tension, and reconnect with your body.

As a gay massage therapist, I understand the importance of creating a safe, affirming space where you can fully relax and be yourself. Every session is tailored to your unique needs, whether you''re recovering from intense workouts, managing chronic pain, or simply seeking deep relaxation.

I combine technical expertise with intuitive bodywork, ensuring each stroke serves a purpose. My goal is not just to relieve your immediate discomfort, but to help you develop greater body awareness and long-term wellness.',

  'Licensed Massage Therapist from Rio de Janeiro',

  -- Location
  'Dallas',
  'TX',
  'Uptown',
  '75201',
  15,

  -- Contact
  '762-334-5300',
  'bruno.santos@masseurmatch.com',
  '+17623345300',

  -- Services (SEO optimized array)
  ARRAY[
    'Deep Tissue Massage',
    'Sports Massage',
    'Swedish Massage',
    'Gay Massage',
    'LGBTQ+ Friendly Massage',
    'Brazilian Massage Therapy',
    'Therapeutic Massage',
    'Relaxation Massage'
  ],

  -- Massage Techniques
  ARRAY[
    'Deep Tissue',
    'Sports',
    'Swedish',
    'Trigger Point',
    'Myofascial Release',
    'Aromatherapy'
  ],

  -- Rates
  '170',
  '250',
  '300',
  'Contact for rates',

  -- Payment methods
  ARRAY['Cash', 'Venmo', 'Zelle', 'PayPal', 'Apple Pay'],

  -- Availability
  true,
  true,

  -- Studio amenities
  ARRAY['Shower', 'Music', 'Temperature Control', 'Essential Oils', 'Private Parking'],

  -- Professional
  8,
  ARRAY['English', 'Portuguese'],
  'Licensed Massage Therapist (Brazil), Sports Massage Certification, Deep Tissue Specialist',

  -- Weekly Schedule (visiting Jan 4-7, 2026)
  '{
    "saturday": {
      "studio_available": true,
      "studio_start": "09:00",
      "studio_end": "21:00",
      "mobile_available": true,
      "mobile_start": "10:00",
      "mobile_end": "20:00"
    },
    "sunday": {
      "studio_available": true,
      "studio_start": "09:00",
      "studio_end": "21:00",
      "mobile_available": true,
      "mobile_start": "10:00",
      "mobile_end": "20:00"
    },
    "monday": {
      "studio_available": true,
      "studio_start": "09:00",
      "studio_end": "21:00",
      "mobile_available": true,
      "mobile_start": "10:00",
      "mobile_end": "20:00"
    },
    "tuesday": {
      "studio_available": true,
      "studio_start": "09:00",
      "studio_end": "18:00",
      "mobile_available": true,
      "mobile_start": "10:00",
      "mobile_end": "17:00"
    },
    "wednesday": {
      "studio_available": false,
      "mobile_available": false
    },
    "thursday": {
      "studio_available": false,
      "mobile_available": false
    },
    "friday": {
      "studio_available": false,
      "mobile_available": false
    }
  }'::jsonb,

  -- Preferences
  false,
  false,

  -- Status
  'active',
  true,
  'pro',
  95,

  -- SEO
  'Bruno Santos - Gay Massage Therapist in Dallas | Brazilian Deep Tissue & Sports Massage',
  'Experience authentic Brazilian massage with Bruno Santos, visiting Dallas Jan 4-7. Expert gay massage therapist specializing in deep tissue, sports massage & Swedish techniques. LGBTQ+ friendly. Book now!',

  -- Stats
  5.0,
  12,

  NOW(),
  NOW()
)
ON CONFLICT (user_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  headline = EXCLUDED.headline,
  about = EXCLUDED.about,
  updated_at = NOW();

-- Insert Therapist (public listing)
INSERT INTO therapists (
  user_id,
  slug,
  display_name,
  headline,
  about,
  city,
  state,
  phone,
  services,
  rate_60,
  rate_90,
  rate_120,
  rating,
  review_count,
  years_experience,
  languages,
  incall_available,
  outcall_available,
  status,
  verified,
  created_at
) VALUES (
  'USER_ID_HERE', -- REPLACE THIS!
  'bruno-santos-dallas',
  'Bruno Santos',
  'Brazilian Gay Massage Therapist | Deep Tissue & Sports Massage in Dallas',
  'Experience authentic Brazilian massage therapy with Bruno Santos, a skilled gay massage therapist visiting Dallas from Rio de Janeiro. Specializing in deep tissue massage, sports massage, and Swedish massage techniques, Bruno brings the warmth and expertise of Rio''s renowned bodywork tradition to Dallas.

With years of experience serving the LGBTQ+ community, Bruno creates a safe, welcoming, and judgment-free space for all clients. Whether you''re seeking relief from muscle tension, sports recovery, or pure relaxation, Bruno''s intuitive touch and professional approach ensure a transformative massage experience.

Now offering both outcall and incall sessions in Dallas from January 4-7, 2026. Limited availability - book your session today and discover why clients rave about Bruno''s healing hands.

Perfect for: Athletes, gym enthusiasts, professionals seeking stress relief, and anyone looking for high-quality gay massage therapy in Dallas. LGBTQ+ friendly and proudly serving the Dallas gay community.',
  'Dallas',
  'TX',
  '762-334-5300',
  ARRAY[
    'Deep Tissue Massage',
    'Sports Massage',
    'Swedish Massage',
    'Gay Massage',
    'LGBTQ+ Friendly Massage',
    'Brazilian Massage Therapy',
    'Therapeutic Massage',
    'Relaxation Massage'
  ],
  '170',
  '250',
  '300',
  5.0,
  12,
  8,
  ARRAY['English', 'Portuguese'],
  true,
  true,
  'active',
  true,
  NOW()
)
ON CONFLICT (user_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  headline = EXCLUDED.headline,
  about = EXCLUDED.about,
  updated_at = NOW();

-- Insert Visitor City (visiting Dallas Jan 4-7, 2026)
INSERT INTO visitor_cities (
  therapist_id,
  city,
  state,
  start_date,
  end_date,
  is_current,
  created_at
) VALUES (
  'USER_ID_HERE', -- REPLACE THIS!
  'Dallas',
  'TX',
  '2026-01-04',
  '2026-01-07',
  true,
  NOW()
);

-- ═══════════════════════════════════════════════════════════════════════
-- ✅ PROFILE CREATED!
-- ═══════════════════════════════════════════════════════════════════════
--
-- 📋 Next Steps:
--
-- 1. Login to upload photos:
--    Email: bruno.santos@masseurmatch.com
--    Password: TempPassword123!
--
-- 2. Upload 5 photos:
--    - 1 profile photo (use the professional headshot - image #2)
--    - 4 gallery photos
--
-- 3. Profile URL will be:
--    https://masseurmatch.com/therapist/bruno-santos-dallas
--
-- 4. SEO Keywords Included:
--    ✓ Gay massage Dallas
--    ✓ Brazilian massage therapist
--    ✓ LGBTQ+ friendly massage
--    ✓ Deep tissue massage Dallas
--    ✓ Sports massage Dallas
--    ✓ Gay massage therapist Dallas
--
-- ═══════════════════════════════════════════════════════════════════════
