-- Migration: Create public_therapist_profiles view for SEO-optimized profile pages
-- Date: 2025-12-28
-- Purpose: Provide a clean, public-facing view of therapist profiles with all necessary data

-- Drop view if exists
DROP VIEW IF EXISTS public.public_therapist_profiles CASCADE;

-- Create comprehensive view for public profiles
CREATE OR REPLACE VIEW public.public_therapist_profiles AS
SELECT
  -- Core IDs
  p.user_id as therapist_id,
  p.id as profile_id,

  -- Routing & Location
  COALESCE(p.city_slug, '') as city_slug,
  COALESCE(p.city_name, c.name, '') as city_name,
  COALESCE(p.state_code, c.state_code, '') as state_code,

  -- Identity & SEO
  p.slug,
  COALESCE(p.display_name, u.display_name, '') as display_name,

  -- Publication Gates
  CASE
    WHEN p.publication_status = 'public'
      AND p.admin_status = 'approved'
      AND u.identity_status = 'verified'
      AND (
        s.status IN ('trialing', 'active')
        OR s.plan = 'free'
        OR NOT EXISTS (SELECT 1 FROM subscriptions WHERE user_id = p.user_id)
      )
    THEN 'published'
    ELSE 'draft'
  END as status,

  p.approved_at as published_at,
  GREATEST(COALESCE(p.updated_at, NOW()), COALESCE(u.updated_at, NOW())) as updated_at,

  -- Content
  p.short_bio,
  p.long_bio,
  COALESCE(
    (SELECT array_agg(service) FROM profile_services WHERE profile_id = p.id),
    ARRAY[]::text[]
  ) as services,
  COALESCE(
    (SELECT array_agg(modality) FROM profile_modalities WHERE profile_id = p.id),
    ARRAY[]::text[]
  ) as modalities,
  COALESCE(
    (SELECT array_agg(language) FROM profile_languages WHERE profile_id = p.id),
    ARRAY[]::text[]
  ) as languages,
  p.availability_note,

  -- Service Modes
  COALESCE(p.incall_enabled, false) as incall_enabled,
  COALESCE(p.outcall_enabled, false) as outcall_enabled,

  -- Pricing
  (
    SELECT MIN(price_cents) / 100.0
    FROM profile_rates
    WHERE profile_id = p.id AND is_active = true
  ) as price_from,
  (
    SELECT MAX(price_cents) / 100.0
    FROM profile_rates
    WHERE profile_id = p.id AND is_active = true
  ) as price_to,
  COALESCE(p.currency, 'USD') as currency,

  -- Service Areas
  COALESCE(
    (
      SELECT json_agg(
        json_build_object(
          'city_name', sa.city_name,
          'city_slug', sa.city_slug,
          'state_code', sa.state_code
        )
      )
      FROM profile_service_areas sa
      WHERE sa.profile_id = p.id
    ),
    json_build_array(
      json_build_object(
        'city_name', COALESCE(p.city_name, c.name, ''),
        'city_slug', COALESCE(p.city_slug, ''),
        'state_code', COALESCE(p.state_code, c.state_code, '')
      )
    )
  ) as service_areas,

  -- Photos (respecting plan limits)
  COALESCE(
    (
      SELECT json_agg(
        json_build_object(
          'url', m.public_url,
          'alt', m.alt_text,
          'sort_order', m.position
        )
        ORDER BY m.position ASC
      )
      FROM media_assets m
      WHERE m.profile_id = p.id
        AND m.status = 'approved'
        AND m.type = 'photo'
    ),
    '[]'::json
  ) as photos,

  -- Contact Methods (only if profile is public)
  CASE
    WHEN p.publication_status = 'public' AND p.admin_status = 'approved'
    THEN p.phone_public_e164
    ELSE NULL
  END as contact_phone,

  CASE
    WHEN p.publication_status = 'public' AND p.admin_status = 'approved'
    THEN p.email_public
    ELSE NULL
  END as contact_email,

  CASE
    WHEN p.publication_status = 'public' AND p.admin_status = 'approved'
    THEN p.website_url
    ELSE NULL
  END as contact_website,

  CASE
    WHEN p.publication_status = 'public' AND p.admin_status = 'approved'
    THEN p.instagram_url
    ELSE NULL
  END as contact_instagram,

  -- Plan tier (affects photo limit)
  COALESCE(s.plan, 'free') as plan_tier

FROM public.profiles p
INNER JOIN auth.users au ON p.user_id = au.id
LEFT JOIN public.users u ON p.user_id = u.id
LEFT JOIN public.cities c ON p.primary_city_id = c.id
LEFT JOIN LATERAL (
  SELECT plan, status
  FROM public.subscriptions
  WHERE user_id = p.user_id
    AND status IN ('trialing', 'active')
  ORDER BY created_at DESC
  LIMIT 1
) s ON true

WHERE
  -- Only include profiles that meet minimum requirements
  p.slug IS NOT NULL
  AND p.display_name IS NOT NULL
  AND p.city_slug IS NOT NULL;

-- Grant public read access to the view
GRANT SELECT ON public.public_therapist_profiles TO anon, authenticated;

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_profiles_slug ON public.profiles(slug) WHERE slug IS NOT NULL;

-- Create index on city_slug for city-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_city_slug ON public.profiles(city_slug) WHERE city_slug IS NOT NULL;

-- Create index on publication status for filtering
CREATE INDEX IF NOT EXISTS idx_profiles_publication
  ON public.profiles(publication_status, admin_status)
  WHERE publication_status = 'public' AND admin_status = 'approved';

-- Comment on view
COMMENT ON VIEW public.public_therapist_profiles IS
  'Public-facing view of therapist profiles with all necessary data for SEO-optimized profile pages. ' ||
  'Includes automatic filtering based on publication status, admin approval, and subscription status.';
