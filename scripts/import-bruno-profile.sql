-- ========================================
-- BRUNO SANTOS PROFILE - SQL IMPORT
-- ========================================
-- Use this SQL to manually import Bruno Santos profile into Supabase
-- Run in: Supabase Dashboard > SQL Editor
-- ========================================

-- Insert profile
INSERT INTO profiles (
  display_name,
  full_name,
  phone,
  email,
  city,
  state,
  country,
  zip_code,
  slug,
  status,
  verified,
  availability_status,
  years_experience,
  bio,
  tagline,
  techniques,
  specialties,
  service_type,
  accepts_couples,
  rate_60min,
  rate_90min,
  rate_120min,
  accepts_tips,
  payment_methods,
  certifications,
  education,
  hours_of_operation,
  preferred_contact,
  whatsapp_number,
  languages,
  gender,
  accepts_walk_ins,
  parking_available,
  meta_description,
  created_at,
  updated_at
) VALUES (
  'Bruno Santos',
  'Bruno Santos',
  '762-334-5300',
  'bruno.santos@masseurmatch.com',
  'Dallas',
  'TX',
  'USA',
  '75201',
  'bruno-santos-dallas-tx',
  'active',
  true,
  'available',
  8,
  'Professional massage therapist visiting Dallas from Rio de Janeiro, Brazil.

Specializing in therapeutic and sports massage with 8 years of experience. I bring authentic Brazilian massage techniques combined with traditional therapeutic methods to help you recover from muscle tension, improve flexibility, and achieve deep relaxation.

Currently offering sessions in the Dallas area from January 4-7, 2026. Perfect for visitors and locals seeking a professional, high-quality massage experience.

All sessions are fully customized to your specific needs and preferences. Whether you need sports recovery, pain relief, or stress reduction, I''m here to help you feel your best.',
  'Brazilian Therapeutic & Sports Massage Specialist',
  ARRAY['Deep Tissue', 'Swedish Massage', 'Sports Massage', 'Therapeutic Massage', 'Myofascial Release', 'Trigger Point Therapy', 'Brazilian Massage'],
  ARRAY['Sports Recovery', 'Pain Relief', 'Muscle Tension', 'Flexibility Enhancement', 'Stress Reduction'],
  ARRAY['Mobile/Outcall'],
  true,
  120,
  170,
  220,
  true,
  ARRAY['Cash', 'Venmo', 'Zelle', 'Credit Card'],
  ARRAY['Licensed Massage Therapist (Brazil)', 'Sports Massage Certification', 'Deep Tissue Specialist'],
  'Rio de Janeiro School of Therapeutic Massage (2016)',
  '{
    "monday": {"open": "09:00", "close": "21:00"},
    "tuesday": {"open": "09:00", "close": "21:00"},
    "wednesday": {"open": "09:00", "close": "21:00"},
    "thursday": {"open": "09:00", "close": "21:00"},
    "friday": {"open": "09:00", "close": "21:00"},
    "saturday": {"open": "10:00", "close": "20:00"},
    "sunday": {"open": "10:00", "close": "18:00"}
  }'::jsonb,
  'phone',
  '762-334-5300',
  ARRAY['English', 'Portuguese'],
  'male',
  false,
  'Street parking available',
  'Professional massage therapist from Rio de Janeiro visiting Dallas, TX. Specializing in therapeutic, sports, and deep tissue massage. Available Jan 4-7, 2026.',
  NOW(),
  NOW()
)
RETURNING id, user_id, slug;

-- Note: Save the user_id from the result above, then use it below

-- Insert visitor city (replace 'USER_ID_HERE' with the user_id from above)
INSERT INTO therapist_visitor_cities (
  therapist_id,
  city,
  state,
  start_date,
  end_date,
  is_active
) VALUES (
  'USER_ID_HERE',  -- Replace with actual user_id
  'Dallas',
  'TX',
  '2026-01-04',
  '2026-01-07',
  true
);

-- Verify the profile was created
SELECT
  id,
  display_name,
  phone,
  city,
  state,
  slug,
  status,
  verified,
  availability_status
FROM profiles
WHERE slug = 'bruno-santos-dallas-tx';

-- Check visitor city
SELECT *
FROM therapist_visitor_cities
WHERE city = 'Dallas'
  AND state = 'TX'
  AND start_date = '2026-01-04';
