-- Migration: Create public_therapist_profiles view for SEO-optimized profile pages
-- Date: 2025-12-28
-- Purpose: Provide a public-facing view that matches the current schema.

DROP VIEW IF EXISTS public.public_therapist_profiles CASCADE;

CREATE OR REPLACE VIEW public.public_therapist_profiles AS
SELECT
  p.user_id as therapist_id,
  p.id as profile_id,
  COALESCE(
    NULLIF(trim(p.city_slug), ''),
    NULLIF(lower(regexp_replace(trim(t.city), '[[:space:]]+', '-', 'g')), ''),
    NULLIF(lower(regexp_replace(trim(p.slug), '[[:space:]]+', '-', 'g')), '')
  ) as city_slug,
  COALESCE(NULLIF(p.city, ''), NULLIF(t.city, ''), '') as city_name,
  COALESCE(NULLIF(p.state, ''), NULLIF(t.state, ''), '') as state_code,
  COALESCE(NULLIF(p.slug, ''), t.slug) as slug,
  COALESCE(NULLIF(p.display_name, ''), t.display_name, '') as display_name,
  CASE
    WHEN p.publication_status = 'public'
      AND p.admin_status = 'approved'
      AND COALESCE(u.identity_status, 'pending') = 'verified'
      AND (
        s.status IN ('trialing', 'active')
        OR NOT EXISTS (SELECT 1 FROM subscriptions WHERE user_id = p.user_id)
      )
    THEN 'published'
    ELSE 'draft'
  END as status,
  p.approved_at as published_at,
  GREATEST(COALESCE(p.updated_at, NOW()), COALESCE(u.updated_at, NOW())) as updated_at,
  COALESCE(NULLIF(p.bio_short, ''), NULLIF(p.bio, ''), NULLIF(t.headline, ''), NULLIF(t.about, '')) as short_bio,
  COALESCE(NULLIF(p.bio_long, ''), NULLIF(p.bio, ''), NULLIF(t.about, '')) as long_bio,
  COALESCE(
    (SELECT array_agg(service) FROM profile_services WHERE profile_id = p.id),
    t.services,
    ARRAY[]::text[]
  ) as services,
  COALESCE(
    t.massage_techniques,
    ARRAY[]::text[]
  ) as modalities,
  COALESCE(
    (SELECT array_agg(language) FROM profile_languages WHERE profile_id = p.id),
    t.languages,
    ARRAY[]::text[]
  ) as languages,
  NULL::text as availability_note,
  COALESCE(p.incall_enabled, false) as incall_enabled,
  COALESCE(p.outcall_enabled, false) as outcall_enabled,
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
  COALESCE(
    (SELECT currency FROM profile_rates WHERE profile_id = p.id AND is_active = true ORDER BY price_cents ASC LIMIT 1),
    'USD'
  ) as currency,
  json_build_array(
    json_build_object(
      'city_name', COALESCE(NULLIF(p.city, ''), NULLIF(t.city, ''), ''),
      'city_slug', COALESCE(
        NULLIF(trim(p.city_slug), ''),
        NULLIF(lower(regexp_replace(trim(t.city), '[[:space:]]+', '-', 'g')), ''),
        ''
      ),
      'state_code', COALESCE(NULLIF(p.state, ''), NULLIF(t.state, ''), '')
    )
  ) as service_areas,
  COALESCE(
    (
      SELECT json_agg(
        json_build_object(
          'url', m.public_url,
          'alt', NULL,
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
  CASE
    WHEN p.publication_status = 'public' AND p.admin_status = 'approved'
    THEN COALESCE(p.phone_public_e164, t.phone)
    ELSE NULL
  END as contact_phone,
  CASE
    WHEN p.publication_status = 'public' AND p.admin_status = 'approved'
    THEN COALESCE(p.email_public, t.email)
    ELSE NULL
  END as contact_email,
  CASE
    WHEN p.publication_status = 'public' AND p.admin_status = 'approved'
    THEN COALESCE(p.website_url, t.website)
    ELSE NULL
  END as contact_website,
  CASE
    WHEN p.publication_status = 'public' AND p.admin_status = 'approved'
    THEN t.instagram
    ELSE NULL
  END as contact_instagram,
  COALESCE(s.plan::text, 'free') as plan_tier
FROM public.profiles p
INNER JOIN auth.users au ON p.user_id = au.id
LEFT JOIN public.users u ON p.user_id = u.id
LEFT JOIN public.therapists t ON t.user_id = p.user_id
LEFT JOIN LATERAL (
  SELECT plan, status
  FROM public.subscriptions
  WHERE user_id = p.user_id
    AND status IN ('trialing', 'active')
  ORDER BY created_at DESC
  LIMIT 1
) s ON true
WHERE
  COALESCE(NULLIF(p.slug, ''), NULLIF(t.slug, '')) IS NOT NULL
  AND COALESCE(NULLIF(p.display_name, ''), NULLIF(t.display_name, '')) IS NOT NULL
  AND COALESCE(
    NULLIF(trim(p.city_slug), ''),
    NULLIF(lower(regexp_replace(trim(t.city), '[[:space:]]+', '-', 'g')), ''),
    NULLIF(lower(regexp_replace(trim(p.slug), '[[:space:]]+', '-', 'g')), '')
  ) IS NOT NULL;

GRANT SELECT ON public.public_therapist_profiles TO anon, authenticated;

CREATE INDEX IF NOT EXISTS idx_profiles_slug ON public.profiles(slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_city_slug ON public.profiles(city_slug) WHERE city_slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_publication
  ON public.profiles(publication_status, admin_status)
  WHERE publication_status = 'public' AND admin_status = 'approved';

COMMENT ON VIEW public.public_therapist_profiles IS
  'Public-facing view of therapist profiles for SEO pages. Uses profiles with therapist fallbacks.';
