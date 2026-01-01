-- ======================================================================
-- App schema fixes for masseurmatch-nextjs runtime expectations
-- ======================================================================

-- Profiles: add user_id mirror + admin flag + profile photo
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS user_id UUID;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS profile_photo TEXT;

UPDATE public.profiles
SET user_id = id
WHERE user_id IS NULL;

ALTER TABLE public.profiles
  ALTER COLUMN user_id SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_user_id_fkey'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END
$$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_user_id_unique
  ON public.profiles(user_id);

-- Update the auto-create trigger to populate user_id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    identity_status,
    role,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    'pending',
    'user',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.profiles (
    id,
    user_id,
    email,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.id,
    NEW.email,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Therapists: add fields referenced by dashboard/editor UI
ALTER TABLE public.therapists
  ADD COLUMN IF NOT EXISTS appointment_types TEXT[],
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS enable_mapping BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS massage_setup TEXT,
  ADD COLUMN IF NOT EXISTS products_sold TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS rates JSONB,
  ADD COLUMN IF NOT EXISTS rate_disclaimers TEXT,
  ADD COLUMN IF NOT EXISTS in_studio_hours TEXT,
  ADD COLUMN IF NOT EXISTS mobile_hours TEXT,
  ADD COLUMN IF NOT EXISTS booking_link TEXT,
  ADD COLUMN IF NOT EXISTS social_links JSONB,
  ADD COLUMN IF NOT EXISTS certifications TEXT[],
  ADD COLUMN IF NOT EXISTS outcall_radius INTEGER,
  ADD COLUMN IF NOT EXISTS business_start_date DATE,
  ADD COLUMN IF NOT EXISTS photos TEXT[],
  ADD COLUMN IF NOT EXISTS session_length_options TEXT,
  ADD COLUMN IF NOT EXISTS timezone TEXT,
  ADD COLUMN IF NOT EXISTS mobile_radius INTEGER,
  ADD COLUMN IF NOT EXISTS hours_summary TEXT,
  ADD COLUMN IF NOT EXISTS appointment_window TEXT,
  ADD COLUMN IF NOT EXISTS booking_url TEXT,
  ADD COLUMN IF NOT EXISTS special_notes TEXT,
  ADD COLUMN IF NOT EXISTS gallery_urls TEXT[],
  ADD COLUMN IF NOT EXISTS travel_radius TEXT,
  ADD COLUMN IF NOT EXISTS accepts_first_timers BOOLEAN,
  ADD COLUMN IF NOT EXISTS prefers_lgbtq_clients BOOLEAN,
  ADD COLUMN IF NOT EXISTS policies TEXT,
  ADD COLUMN IF NOT EXISTS payments JSONB,
  ADD COLUMN IF NOT EXISTS discounts JSONB;

-- Payments: lightweight table used by UI for access checks
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  paid_until TIMESTAMPTZ,
  customer_email TEXT,
  email TEXT,
  txt TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_user
  ON public.payments(user_id);

CREATE INDEX IF NOT EXISTS idx_payments_customer_email
  ON public.payments(customer_email);

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
