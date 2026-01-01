-- Function to return nearby therapists using PostGIS filtering.
CREATE OR REPLACE FUNCTION public.discover_nearby_therapists(
  user_lat double precision,
  user_lon double precision,
  radius_meters integer,
  limit_results integer DEFAULT 40
)
RETURNS TABLE (
  user_id uuid,
  display_name text,
  slug text,
  latitude text,
  longitude text,
  rating numeric,
  review_count integer,
  profile_photo text,
  services text[],
  massage_techniques text[],
  specialties text[],
  availability jsonb,
  status text,
  city text,
  state text,
  phone text,
  mobile_service_radius integer,
  mobile_extras text[],
  headline text,
  about text,
  distance double precision,
  rate_60 text,
  rate_90 text,
  rate_outcall text,
  created_at timestamptz
)
LANGUAGE plpgsql STABLE AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.user_id,
    t.display_name,
    t.slug,
    t.latitude,
    t.longitude,
    t.rating,
    COALESCE(t.override_reviews_count, 0) AS review_count,
    t.profile_photo,
    t.services,
    t.massage_techniques,
    t.additional_services AS specialties,
    t.availability,
    t.status,
    t.city,
    t.state,
    t.phone,
    t.mobile_service_radius,
    t.mobile_extras,
    t.headline,
    t.about,
    ST_Distance(
      geography(ST_MakePoint(NULLIF(t.longitude, '')::double precision, NULLIF(t.latitude, '')::double precision)),
      geography(ST_MakePoint(user_lon, user_lat))
    ) AS distance,
    t.rate_60,
    t.rate_90,
    t.rate_outcall,
    t.created_at
  FROM public.therapists t
  WHERE t.status = 'active'
    AND t.latitude IS NOT NULL
    AND t.longitude IS NOT NULL
    AND ST_DWithin(
      geography(ST_MakePoint(NULLIF(t.longitude, '')::double precision, NULLIF(t.latitude, '')::double precision)),
      geography(ST_MakePoint(user_lon, user_lat)),
      radius_meters
    )
  ORDER BY distance ASC, t.rating DESC
  LIMIT limit_results;
END;
$$;
