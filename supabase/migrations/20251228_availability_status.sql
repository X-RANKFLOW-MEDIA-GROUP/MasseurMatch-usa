-- Availability Status for Therapist Profiles
-- Created: 2025-12-28
-- Adds real-time availability status display

-- Add availability_status column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'offline'
CHECK (availability_status IN ('available', 'visiting_now', 'visiting_soon', 'offline'));

-- Add index for efficient filtering by availability
CREATE INDEX IF NOT EXISTS idx_profiles_availability_status
  ON public.profiles(availability_status)
  WHERE availability_status != 'offline';

-- Add last_status_update timestamp
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS last_status_update TIMESTAMPTZ DEFAULT NOW();

-- Create trigger to update last_status_update when availability changes
CREATE OR REPLACE FUNCTION update_last_status_update()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.availability_status IS DISTINCT FROM NEW.availability_status THEN
    NEW.last_status_update = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_status_timestamp
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_last_status_update();

-- Update existing therapist_promotions to also track which therapists are currently available
-- This helps promote "available now" therapists
ALTER TABLE public.therapist_promotions
ADD COLUMN IF NOT EXISTS priority_for_available BOOLEAN DEFAULT false;

COMMENT ON COLUMN public.profiles.availability_status IS 'Current availability status: available (green), visiting_now (blue), visiting_soon (yellow), offline (gray)';
COMMENT ON COLUMN public.profiles.last_status_update IS 'Timestamp of last availability status change';
COMMENT ON COLUMN public.therapist_promotions.priority_for_available IS 'Whether this promotion should prioritize therapists marked as available';

-- Example: Set some therapists to "available" for testing
UPDATE public.profiles
SET availability_status = 'available'
WHERE slug IN ('alex-santos-dallas', 'bruno-silva-nyc')
  AND user_id IN (SELECT user_id FROM public.therapists WHERE status = 'active');
