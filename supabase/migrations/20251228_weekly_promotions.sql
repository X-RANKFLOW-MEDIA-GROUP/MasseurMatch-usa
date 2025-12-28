-- Weekly Promotions for Therapist Profiles
-- Created: 2025-12-28

-- Create promotions table
CREATE TABLE IF NOT EXISTS public.therapist_promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Promotion details
  title TEXT NOT NULL,
  description TEXT,
  discount_text TEXT, -- e.g., "20% off", "$30 off", "Free upgrade"

  -- Promotion period
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ NOT NULL,

  -- Display
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0, -- For sorting multiple promotions
  badge_color TEXT DEFAULT '#ef4444', -- Hex color for badge

  -- Tracking
  view_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add constraints for data validation
ALTER TABLE public.therapist_promotions
  ADD CONSTRAINT valid_promo_dates CHECK (end_date > start_date),
  ADD CONSTRAINT valid_promo_duration CHECK (end_date <= start_date + INTERVAL '7 days'),
  ADD CONSTRAINT valid_discount_text_length CHECK (char_length(discount_text) <= 20),
  ADD CONSTRAINT valid_title_length CHECK (char_length(title) <= 100);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_therapist_promotions_therapist
  ON public.therapist_promotions(therapist_id);

CREATE INDEX IF NOT EXISTS idx_therapist_promotions_active
  ON public.therapist_promotions(is_active, start_date, end_date);

-- Add RLS policies
ALTER TABLE public.therapist_promotions ENABLE ROW LEVEL SECURITY;

-- Public can view active promotions
CREATE POLICY "Public can view active promotions"
  ON public.therapist_promotions
  FOR SELECT
  USING (
    is_active = true
    AND start_date <= NOW()
    AND end_date >= NOW()
  );

-- Therapists can manage their own promotions
CREATE POLICY "Therapists can view their own promotions"
  ON public.therapist_promotions
  FOR SELECT
  USING (auth.uid() = therapist_id);

CREATE POLICY "Therapists can insert their own promotions"
  ON public.therapist_promotions
  FOR INSERT
  WITH CHECK (auth.uid() = therapist_id);

CREATE POLICY "Therapists can update their own promotions"
  ON public.therapist_promotions
  FOR UPDATE
  USING (auth.uid() = therapist_id)
  WITH CHECK (auth.uid() = therapist_id);

CREATE POLICY "Therapists can delete their own promotions"
  ON public.therapist_promotions
  FOR DELETE
  USING (auth.uid() = therapist_id);

-- Add trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_therapist_promotions_updated_at
  BEFORE UPDATE ON public.therapist_promotions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to limit active promotions per therapist (max 3)
CREATE OR REPLACE FUNCTION check_active_promotions_limit()
RETURNS TRIGGER AS $$
DECLARE
  active_count INTEGER;
BEGIN
  -- Only check if the promotion is being set as active
  IF NEW.is_active = true THEN
    -- Count current active promotions for this therapist that overlap with the new promotion period
    SELECT COUNT(*)
    INTO active_count
    FROM public.therapist_promotions
    WHERE therapist_id = NEW.therapist_id
      AND is_active = true
      AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
      AND (
        (start_date <= NEW.end_date AND end_date >= NEW.start_date)
      );

    -- Raise exception if limit exceeded
    IF active_count >= 3 THEN
      RAISE EXCEPTION 'Maximum of 3 active promotions allowed per therapist during overlapping periods';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_promotions_limit
  BEFORE INSERT OR UPDATE ON public.therapist_promotions
  FOR EACH ROW
  EXECUTE FUNCTION check_active_promotions_limit();

-- Insert sample promotion data for testing
INSERT INTO public.therapist_promotions (therapist_id, title, description, discount_text, start_date, end_date, badge_color)
SELECT
  id,
  'New Year Special',
  'Start 2026 relaxed! Get 20% off your first session this week.',
  '20% OFF',
  NOW(),
  NOW() + INTERVAL '7 days',
  '#ef4444'
FROM public.profiles
WHERE slug IN ('alex-santos-dallas', 'bruno-silva-nyc')
LIMIT 2;

COMMENT ON TABLE public.therapist_promotions IS 'Weekly and special promotions for therapist profiles';
COMMENT ON COLUMN public.therapist_promotions.discount_text IS 'Short promotional text displayed on badge, e.g., "20% OFF", "$30 OFF"';
COMMENT ON COLUMN public.therapist_promotions.badge_color IS 'Hex color code for promotion badge background';
