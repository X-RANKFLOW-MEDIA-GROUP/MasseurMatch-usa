-- SQL to insert 5 test therapist profiles for map testing
-- Run this in your Supabase SQL Editor

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
(
  gen_random_uuid(),
  'alex-santos-la',
  'Alex Santos',
  '34.0901',
  '-118.3756',
  'Deep Tissue, Sports Massage, Swedish Massage',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
  '90069',
  '+1 (555) 100-0001',
  'Los Angeles',
  'CA',
  'active',
  now()
),
(
  gen_random_uuid(),
  'maria-rodriguez-la',
  'Maria Rodriguez',
  '34.0195',
  '-118.4912',
  'Swedish Massage, Aromatherapy, Hot Stone',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop',
  '90401',
  '+1 (555) 100-0002',
  'Los Angeles',
  'CA',
  'active',
  now()
),
(
  gen_random_uuid(),
  'james-chen-la',
  'James Chen',
  '34.0522',
  '-118.2437',
  'Chinese Massage, Acupressure, Cupping',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=500&fit=crop',
  '90012',
  '+1 (555) 100-0003',
  'Los Angeles',
  'CA',
  'active',
  now()
),
(
  gen_random_uuid(),
  'sarah-williams-la',
  'Sarah Williams',
  '34.0736',
  '-118.4004',
  'Prenatal Massage, Swedish Massage',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop',
  '90210',
  '+1 (555) 100-0004',
  'Los Angeles',
  'CA',
  'active',
  now()
),
(
  gen_random_uuid(),
  'michael-brown-la',
  'Michael Brown',
  '33.9850',
  '-118.4695',
  'Sports Massage, Myofascial Release',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop',
  '90291',
  '+1 (555) 100-0005',
  'Los Angeles',
  'CA',
  'active',
  now()
);

-- Verify the insert
SELECT
  slug,
  display_name,
  city,
  latitude,
  longitude,
  status
FROM therapists
WHERE slug LIKE '%-la'
ORDER BY created_at DESC
LIMIT 5;
