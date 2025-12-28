-- Travel Dates and Subscription-Based Rules
-- Created: 2025-12-28

-- Add travel dates columns to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS travel_city TEXT,
ADD COLUMN IF NOT EXISTS travel_state TEXT,
ADD COLUMN IF NOT EXISTS travel_start_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS travel_end_date TIMESTAMPTZ;

-- Add constraint to ensure travel dates are valid
ALTER TABLE public.profiles
ADD CONSTRAINT valid_travel_dates CHECK (
  (travel_start_date IS NULL AND travel_end_date IS NULL) OR
  (travel_start_date IS NOT NULL AND travel_end_date IS NOT NULL AND travel_end_date > travel_start_date)
);

-- Create index for travel dates queries
CREATE INDEX IF NOT EXISTS idx_profiles_travel_dates
  ON public.profiles(travel_start_date, travel_end_date)
  WHERE travel_start_date IS NOT NULL;

-- Function to automatically update availability_status based on travel dates
CREATE OR REPLACE FUNCTION update_availability_from_travel()
RETURNS TRIGGER AS $$
BEGIN
  -- If travel dates are set
  IF NEW.travel_start_date IS NOT NULL AND NEW.travel_end_date IS NOT NULL THEN
    -- Check if currently traveling (travel_start_date <= NOW <= travel_end_date)
    IF NEW.travel_start_date <= NOW() AND NEW.travel_end_date >= NOW() THEN
      NEW.availability_status := 'visiting_now';
    -- Check if traveling soon (within next 14 days)
    ELSIF NEW.travel_start_date > NOW() AND NEW.travel_start_date <= NOW() + INTERVAL '14 days' THEN
      NEW.availability_status := 'visiting_soon';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_update_availability_from_travel
  BEFORE INSERT OR UPDATE OF travel_start_date, travel_end_date ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_availability_from_travel();

-- Function to check subscription tier promotion limits
CREATE OR REPLACE FUNCTION check_subscription_promotion_limit()
RETURNS TRIGGER AS $$
DECLARE
  user_tier TEXT;
  max_promotions INTEGER;
  current_active_count INTEGER;
BEGIN
  -- Get the user's subscription tier from subscriptions table
  SELECT s.plan INTO user_tier
  FROM public.subscriptions s
  WHERE s.user_id = NEW.therapist_id
    AND s.status IN ('active', 'trialing')
  ORDER BY s.created_at DESC
  LIMIT 1;

  -- Default to free if no subscription found
  IF user_tier IS NULL THEN
    user_tier := 'free';
  END IF;

  -- Set max promotions based on tier
  CASE user_tier
    WHEN 'free' THEN max_promotions := 0;      -- Free tier: no promotions
    WHEN 'standard' THEN max_promotions := 1;  -- Standard: 1 active promotion
    WHEN 'pro' THEN max_promotions := 2;       -- Pro: 2 active promotions
    WHEN 'elite' THEN max_promotions := 3;     -- Elite: 3 active promotions
    ELSE max_promotions := 0;                   -- Unknown tier: no promotions
  END CASE;

  -- Count current active promotions for this therapist
  SELECT COUNT(*)
  INTO current_active_count
  FROM public.therapist_promotions
  WHERE therapist_id = NEW.therapist_id
    AND is_active = true
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    AND start_date <= NEW.end_date
    AND end_date >= NEW.start_date;

  -- Check if limit would be exceeded
  IF current_active_count >= max_promotions THEN
    RAISE EXCEPTION 'Subscription tier "%" allows maximum of % active promotion(s). Currently have %.',
      user_tier, max_promotions, current_active_count;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Replace the old promotion limit trigger with subscription-based one
DROP TRIGGER IF EXISTS check_promotions_limit ON public.therapist_promotions;

CREATE TRIGGER check_subscription_promotions_limit
  BEFORE INSERT OR UPDATE ON public.therapist_promotions
  FOR EACH ROW
  WHEN (NEW.is_active = true)
  EXECUTE FUNCTION check_subscription_promotion_limit();

-- Function to auto-expire past travel dates and reset availability
CREATE OR REPLACE FUNCTION cleanup_expired_travel_dates()
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET
    travel_city = NULL,
    travel_state = NULL,
    travel_start_date = NULL,
    travel_end_date = NULL,
    availability_status = 'offline'
  WHERE travel_end_date < NOW() - INTERVAL '1 day'
    AND travel_end_date IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- Schedule to run cleanup daily (requires pg_cron extension)
-- Run: SELECT cron.schedule('cleanup-travel-dates', '0 2 * * *', 'SELECT cleanup_expired_travel_dates()');

COMMENT ON COLUMN public.profiles.travel_city IS 'City the therapist is currently visiting or will visit';
COMMENT ON COLUMN public.profiles.travel_state IS 'State/region of the travel destination';
COMMENT ON COLUMN public.profiles.travel_start_date IS 'Start date of travel period';
COMMENT ON COLUMN public.profiles.travel_end_date IS 'End date of travel period';
COMMENT ON FUNCTION update_availability_from_travel() IS 'Automatically sets availability_status to visiting_now or visiting_soon based on travel dates';
COMMENT ON FUNCTION check_subscription_promotion_limit() IS 'Enforces promotion limits based on subscription tier: free=0, standard=1, pro=2, elite=3';
COMMENT ON FUNCTION cleanup_expired_travel_dates() IS 'Removes expired travel dates and resets availability status (run daily via cron)';
