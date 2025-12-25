-- SQL to insert 10 test therapist profiles for Dallas area
-- Run this in your Supabase SQL Editor
-- Dallas ZIP codes: 75201-75398

-- First, delete any existing Dallas test profiles to avoid duplicates
DELETE FROM therapists WHERE city = 'Dallas' AND slug LIKE '%-dallas';

-- Insert 10 Dallas therapist profiles
INSERT INTO therapists (
  user_id,
  slug,
  display_name,
  latitude,
  longitude,
  services,
  profile_photo,
  zip_code,
  phone,
  city,
  state,
  status,
  created_at
) VALUES
-- 1. Downtown Dallas
(
  gen_random_uuid(),
  'carlos-martinez-dallas',
  'Carlos Martinez',
  '32.7767',
  '-96.7970',
  'Deep Tissue, Sports Massage, Trigger Point Therapy',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
  '75219',
  '+1 (214) 555-0001',
  'Dallas',
  'TX',
  'active',
  now()
),
-- 2. Uptown Dallas
(
  gen_random_uuid(),
  'jessica-thompson-dallas',
  'Jessica Thompson',
  '32.8029',
  '-96.8007',
  'Swedish Massage, Aromatherapy, Hot Stone, Prenatal',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop',
  '75201',
  '+1 (214) 555-0002',
  'Dallas',
  'TX',
  'active',
  now()
),
-- 3. Highland Park
(
  gen_random_uuid(),
  'david-kim-dallas',
  'David Kim',
  '32.8343',
  '-96.7856',
  'Shiatsu, Acupressure, Thai Massage, Energy Work',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=500&fit=crop',
  '75205',
  '+1 (214) 555-0003',
  'Dallas',
  'TX',
  'active',
  now()
),
-- 4. Oak Lawn
(
  gen_random_uuid(),
  'rachel-anderson-dallas',
  'Rachel Anderson',
  '32.8079',
  '-96.8089',
  'Lymphatic Drainage, Reflexology, Swedish Massage',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop',
  '75219',
  '+1 (214) 555-0004',
  'Dallas',
  'TX',
  'active',
  now()
),
-- 5. Deep Ellum
(
  gen_random_uuid(),
  'marcus-washington-dallas',
  'Marcus Washington',
  '32.7837',
  '-96.7784',
  'Sports Massage, Deep Tissue, Myofascial Release, Stretching',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop',
  '75226',
  '+1 (214) 555-0005',
  'Dallas',
  'TX',
  'active',
  now()
),
-- 6. Bishop Arts District
(
  gen_random_uuid(),
  'sophia-rodriguez-dallas',
  'Sophia Rodriguez',
  '32.7496',
  '-96.8217',
  'Prenatal Massage, Postnatal, Swedish, Aromatherapy',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=500&fit=crop',
  '75208',
  '+1 (214) 555-0006',
  'Dallas',
  'TX',
  'active',
  now()
),
-- 7. Knox-Henderson
(
  gen_random_uuid(),
  'james-patterson-dallas',
  'James Patterson',
  '32.8156',
  '-96.7894',
  'Deep Tissue, Cupping, Sports Recovery, Trigger Point',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&h=500&fit=crop',
  '75206',
  '+1 (214) 555-0007',
  'Dallas',
  'TX',
  'active',
  now()
),
-- 8. Lakewood
(
  gen_random_uuid(),
  'emily-chen-dallas',
  'Emily Chen',
  '32.8198',
  '-96.7567',
  'Traditional Chinese Massage, Tui Na, Acupressure, Gua Sha',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&h=500&fit=crop',
  '75214',
  '+1 (214) 555-0008',
  'Dallas',
  'TX',
  'active',
  now()
),
-- 9. Lower Greenville
(
  gen_random_uuid(),
  'tyler-brooks-dallas',
  'Tyler Brooks',
  '32.8234',
  '-96.7712',
  'Sports Massage, Athletic Recovery, Stretching, Deep Tissue',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&h=500&fit=crop',
  '75206',
  '+1 (214) 555-0009',
  'Dallas',
  'TX',
  'active',
  now()
),
-- 10. Design District
(
  gen_random_uuid(),
  'olivia-martinez-dallas',
  'Olivia Martinez',
  '32.8056',
  '-96.8356',
  'Swedish Massage, Hot Stone, Aromatherapy, Relaxation',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop',
  '75207',
  '+1 (214) 555-0010',
  'Dallas',
  'TX',
  'active',
  now()
);

-- Verify the insert
SELECT
  slug,
  display_name,
  city,
  state,
  zip_code,
  latitude,
  longitude,
  services,
  status
FROM therapists
WHERE city = 'Dallas' AND state = 'TX'
ORDER BY created_at DESC
LIMIT 10;
