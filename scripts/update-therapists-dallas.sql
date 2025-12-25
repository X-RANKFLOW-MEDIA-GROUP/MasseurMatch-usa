-- Update existing therapist records with complete Dallas data
-- Services field is an array in PostgreSQL

-- Alex Santos (Downtown Dallas - 75219)
UPDATE therapists
SET
  slug = 'alex-santos-dallas',
  display_name = 'Alex Santos',
  latitude = '32.7767',
  longitude = '-96.7970',
  services = ARRAY['Deep Tissue', 'Sports Massage', 'Trigger Point Therapy'],
  profile_photo = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
  zip_code = '75219',
  phone = '+1 (214) 555-0001',
  city = 'Dallas',
  state = 'TX',
  status = 'active',
  updated_at = now()
WHERE user_id = '670ec7ea-91fc-458f-b41b-2d36b82df9ef';

-- Maria Rodriguez (Uptown Dallas - 75201)
UPDATE therapists
SET
  slug = 'maria-rodriguez-dallas',
  display_name = 'Maria Rodriguez',
  latitude = '32.8029',
  longitude = '-96.8007',
  services = ARRAY['Swedish Massage', 'Aromatherapy', 'Hot Stone', 'Prenatal'],
  profile_photo = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop',
  zip_code = '75201',
  phone = '+1 (214) 555-0002',
  city = 'Dallas',
  state = 'TX',
  status = 'active',
  updated_at = now()
WHERE user_id = '0bc3026f-9037-4fe5-9c60-c50a2b16d74d';

-- James Chen (Highland Park - 75205)
UPDATE therapists
SET
  slug = 'james-chen-dallas',
  display_name = 'James Chen',
  latitude = '32.8343',
  longitude = '-96.7856',
  services = ARRAY['Shiatsu', 'Acupressure', 'Thai Massage', 'Energy Work'],
  profile_photo = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=500&fit=crop',
  zip_code = '75205',
  phone = '+1 (214) 555-0003',
  city = 'Dallas',
  state = 'TX',
  status = 'active',
  updated_at = now()
WHERE user_id = '76b567c6-3e3b-4851-9908-75c95158156a';

-- Sarah Williams (Oak Lawn - 75219)
UPDATE therapists
SET
  slug = 'sarah-williams-dallas',
  display_name = 'Sarah Williams',
  latitude = '32.8079',
  longitude = '-96.8089',
  services = ARRAY['Lymphatic Drainage', 'Reflexology', 'Swedish Massage'],
  profile_photo = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop',
  zip_code = '75219',
  phone = '+1 (214) 555-0004',
  city = 'Dallas',
  state = 'TX',
  status = 'active',
  updated_at = now()
WHERE user_id = 'fd29997c-497a-47fe-8634-cc84edbc77c0';

-- Michael Brown (Deep Ellum - 75226)
UPDATE therapists
SET
  slug = 'michael-brown-dallas',
  display_name = 'Michael Brown',
  latitude = '32.7837',
  longitude = '-96.7784',
  services = ARRAY['Sports Massage', 'Deep Tissue', 'Myofascial Release', 'Stretching'],
  profile_photo = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop',
  zip_code = '75226',
  phone = '+1 (214) 555-0005',
  city = 'Dallas',
  state = 'TX',
  status = 'active',
  updated_at = now()
WHERE user_id = '2436741b-4d13-496e-8e72-1552c94078c1';

-- Verify the updates
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
WHERE city = 'Dallas'
ORDER BY created_at DESC;
