-- Availability Session Limits by Subscription Tier
-- Created: 2025-12-28
-- Limits how long and how often therapists can set status to "available"

-- Create table to track availability sessions
CREATE TABLE IF NOT EXISTS public.availability_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,

  -- Session details
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,

  -- Tier at time of activation (for historical tracking)
  tier_at_start TEXT NOT NULL,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_availability_sessions_user
  ON public.availability_sessions(user_id, started_at DESC);

CREATE INDEX IF NOT EXISTS idx_availability_sessions_active
  ON public.availability_sessions(user_id, expires_at)
  WHERE ended_at IS NULL;

-- Enable RLS
ALTER TABLE public.availability_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own sessions"
  ON public.availability_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Function to get tier-based limits
CREATE OR REPLACE FUNCTION get_availability_limits(user_tier TEXT)
RETURNS TABLE(max_duration_minutes INTEGER, max_daily_uses INTEGER) AS $$
BEGIN
  RETURN QUERY SELECT
    CASE user_tier
      WHEN 'free' THEN 30      -- 30 minutes per session
      WHEN 'standard' THEN 60  -- 1 hour per session
      WHEN 'pro' THEN 60       -- 1 hour per session
      WHEN 'elite' THEN 120    -- 2 hours per session
      ELSE 30                   -- Default to free tier
    END as max_duration_minutes,
    CASE user_tier
      WHEN 'free' THEN 5       -- 5 uses per day
      WHEN 'standard' THEN 6   -- 6 uses per day
      WHEN 'pro' THEN 999999   -- Unlimited
      WHEN 'elite' THEN 999999 -- Unlimited
      ELSE 5                    -- Default to free tier
    END as max_daily_uses;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user can activate "available" status
CREATE OR REPLACE FUNCTION can_activate_availability(p_user_id UUID)
RETURNS TABLE(
  can_activate BOOLEAN,
  reason TEXT,
  daily_uses_remaining INTEGER,
  max_duration_minutes INTEGER
) AS $$
DECLARE
  user_tier TEXT;
  limits RECORD;
  today_uses INTEGER;
  active_session_exists BOOLEAN;
BEGIN
  -- Get user's current tier
  SELECT COALESCE(s.plan, 'free') INTO user_tier
  FROM public.subscriptions s
  WHERE s.user_id = p_user_id
    AND s.status IN ('active', 'trialing')
  ORDER BY s.created_at DESC
  LIMIT 1;

  -- Get tier limits
  SELECT * INTO limits FROM get_availability_limits(user_tier);

  -- Check if there's already an active session
  SELECT EXISTS(
    SELECT 1 FROM public.availability_sessions
    WHERE user_id = p_user_id
      AND ended_at IS NULL
      AND expires_at > NOW()
  ) INTO active_session_exists;

  IF active_session_exists THEN
    RETURN QUERY SELECT
      false,
      'Already have an active availability session'::TEXT,
      0,
      0;
    RETURN;
  END IF;

  -- Count today's uses (since midnight)
  SELECT COUNT(*) INTO today_uses
  FROM public.availability_sessions
  WHERE user_id = p_user_id
    AND started_at >= CURRENT_DATE;

  -- Check daily limit
  IF today_uses >= limits.max_daily_uses THEN
    RETURN QUERY SELECT
      false,
      format('Daily limit reached (%s/%s uses)', today_uses, limits.max_daily_uses)::TEXT,
      0,
      limits.max_duration_minutes;
    RETURN;
  END IF;

  -- Can activate
  RETURN QUERY SELECT
    true,
    'OK'::TEXT,
    limits.max_daily_uses - today_uses,
    limits.max_duration_minutes;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to start availability session
CREATE OR REPLACE FUNCTION start_availability_session(p_user_id UUID)
RETURNS TABLE(
  success BOOLEAN,
  session_id UUID,
  expires_at TIMESTAMPTZ,
  message TEXT
) AS $$
DECLARE
  user_tier TEXT;
  limits RECORD;
  can_activate_result RECORD;
  new_session_id UUID;
  new_expires_at TIMESTAMPTZ;
BEGIN
  -- Check if user can activate
  SELECT * INTO can_activate_result FROM can_activate_availability(p_user_id);

  IF NOT can_activate_result.can_activate THEN
    RETURN QUERY SELECT
      false,
      NULL::UUID,
      NULL::TIMESTAMPTZ,
      can_activate_result.reason;
    RETURN;
  END IF;

  -- Get user tier
  SELECT COALESCE(s.plan, 'free') INTO user_tier
  FROM public.subscriptions s
  WHERE s.user_id = p_user_id
    AND s.status IN ('active', 'trialing')
  ORDER BY s.created_at DESC
  LIMIT 1;

  -- Get limits
  SELECT * INTO limits FROM get_availability_limits(user_tier);

  -- Calculate expiry time
  new_expires_at := NOW() + (limits.max_duration_minutes || ' minutes')::INTERVAL;

  -- Create session
  INSERT INTO public.availability_sessions (user_id, expires_at, tier_at_start)
  VALUES (p_user_id, new_expires_at, user_tier)
  RETURNING id INTO new_session_id;

  -- Update profile status to available
  UPDATE public.profiles
  SET availability_status = 'available'
  WHERE user_id = p_user_id;

  RETURN QUERY SELECT
    true,
    new_session_id,
    new_expires_at,
    format('Session started. Expires in %s minutes', limits.max_duration_minutes)::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to end availability session (manual or auto)
CREATE OR REPLACE FUNCTION end_availability_session(p_user_id UUID, is_auto BOOLEAN DEFAULT false)
RETURNS BOOLEAN AS $$
DECLARE
  session_record RECORD;
BEGIN
  -- Get active session
  SELECT * INTO session_record
  FROM public.availability_sessions
  WHERE user_id = p_user_id
    AND ended_at IS NULL
  ORDER BY started_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Mark session as ended
  UPDATE public.availability_sessions
  SET ended_at = NOW()
  WHERE id = session_record.id;

  -- Update profile status to offline (unless they're traveling)
  UPDATE public.profiles
  SET availability_status = CASE
    WHEN availability_status IN ('visiting_now', 'visiting_soon') THEN availability_status
    ELSE 'offline'
  END
  WHERE user_id = p_user_id
    AND availability_status = 'available';

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to auto-expire availability sessions (run via cron)
CREATE OR REPLACE FUNCTION expire_availability_sessions()
RETURNS INTEGER AS $$
DECLARE
  expired_count INTEGER;
BEGIN
  -- Find and end all expired sessions
  WITH expired AS (
    SELECT user_id
    FROM public.availability_sessions
    WHERE ended_at IS NULL
      AND expires_at <= NOW()
  )
  UPDATE public.availability_sessions s
  SET ended_at = NOW()
  FROM expired e
  WHERE s.user_id = e.user_id
    AND s.ended_at IS NULL
    AND s.expires_at <= NOW();

  GET DIAGNOSTICS expired_count = ROW_COUNT;

  -- Update profiles to offline for expired sessions
  UPDATE public.profiles p
  SET availability_status = CASE
    WHEN p.availability_status IN ('visiting_now', 'visiting_soon') THEN p.availability_status
    ELSE 'offline'
  END
  WHERE p.user_id IN (
    SELECT user_id FROM public.availability_sessions
    WHERE ended_at = NOW()  -- Just ended
      AND expires_at <= NOW()
  )
  AND p.availability_status = 'available';

  RETURN expired_count;
END;
$$ LANGUAGE plpgsql;

-- Trigger to prevent manual "available" status without session
CREATE OR REPLACE FUNCTION check_availability_session()
RETURNS TRIGGER AS $$
DECLARE
  has_active_session BOOLEAN;
BEGIN
  -- Only check when setting to "available"
  IF NEW.availability_status = 'available' AND OLD.availability_status != 'available' THEN
    -- Check if there's an active session
    SELECT EXISTS(
      SELECT 1 FROM public.availability_sessions
      WHERE user_id = NEW.user_id
        AND ended_at IS NULL
        AND expires_at > NOW()
    ) INTO has_active_session;

    IF NOT has_active_session THEN
      RAISE EXCEPTION 'Cannot set status to available without an active session. Use start_availability_session() function.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_availability_session
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  WHEN (OLD.availability_status IS DISTINCT FROM NEW.availability_status)
  EXECUTE FUNCTION check_availability_session();

-- Comments
COMMENT ON TABLE public.availability_sessions IS 'Tracks when therapists activate "available" status, with tier-based time limits';
COMMENT ON FUNCTION get_availability_limits(TEXT) IS 'Returns max_duration_minutes and max_daily_uses for a subscription tier';
COMMENT ON FUNCTION can_activate_availability(UUID) IS 'Checks if user can activate available status (checks daily limit and active session)';
COMMENT ON FUNCTION start_availability_session(UUID) IS 'Starts a new availability session and sets profile to available';
COMMENT ON FUNCTION end_availability_session(UUID, BOOLEAN) IS 'Ends active availability session and sets profile to offline';
COMMENT ON FUNCTION expire_availability_sessions() IS 'Auto-expires sessions past their time limit (run via cron every 1-5 minutes)';

-- Schedule cron job to expire sessions every 5 minutes
-- Requires pg_cron extension
-- Run: SELECT cron.schedule('expire-availability-sessions', '*/5 * * * *', 'SELECT expire_availability_sessions()');
