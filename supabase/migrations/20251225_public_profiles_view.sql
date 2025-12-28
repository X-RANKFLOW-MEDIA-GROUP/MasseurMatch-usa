-- ============================================================================
-- Backfill city_slug and refresh public_profiles view
-- ============================================================================

-- 1. Ensure the column exists (idempotent in case previous migrations skipped it)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS city_slug TEXT;

-- 2. Populate city_slug from therapists.city when available
UPDATE public.profiles p
SET city_slug = lower(regexp_replace(trim(t.city), '[[:space:]]+', '-', 'g'))
FROM public.therapists t
WHERE t.user_id = p.user_id
  AND p.city_slug IS NULL
  AND t.city IS NOT NULL
  AND trim(t.city) <> '';

-- 3. Fallback to slug if we still do not have a city slug
UPDATE public.profiles
SET city_slug = lower(regexp_replace(trim(slug), '[[:space:]]+', '-', 'g'))
WHERE city_slug IS NULL
  AND slug IS NOT NULL
  AND trim(slug) <> '';

-- 4. Recreate the public_profiles view with a consistent city_slug expression
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT
  p.id,
  p.user_id,
  p.display_name,
  COALESCE(
    NULLIF(trim(p.city_slug), ''),
    NULLIF(lower(regexp_replace(trim(t.city), '[[:space:]]+', '-', 'g')), ''),
    NULLIF(lower(regexp_replace(trim(p.slug), '[[:space:]]+', '-', 'g')), '')
  ) AS city_slug,
  p.slug,
  p.incall_enabled,
  p.outcall_enabled,
  t.profile_photo AS profile_photo,
  p.created_at,
  p.updated_at
FROM public.profiles p
LEFT JOIN public.therapists t ON t.user_id = p.user_id
WHERE p.publication_status = 'public'
  AND p.admin_status = 'approved';

GRANT SELECT ON public.public_profiles TO anon, authenticated;
