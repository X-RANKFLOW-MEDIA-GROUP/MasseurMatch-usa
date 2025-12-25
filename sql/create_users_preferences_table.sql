-- Create users preferences table to cache the onboarding answers
CREATE TABLE IF NOT EXISTS public.users_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  latitude double precision NOT NULL DEFAULT 0,
  longitude double precision NOT NULL DEFAULT 0,
  radius integer NOT NULL DEFAULT 25,
  zip_code text,
  location geography(Point, 4326),
  massage_types text[] DEFAULT '{}',
  pressure text DEFAULT 'medium',
  gender text DEFAULT 'any',
  mode text DEFAULT 'any',
  availability text DEFAULT 'anytime',
  budget_min numeric(10,2) DEFAULT 50,
  budget_max numeric(10,2) DEFAULT 200,
  pain_points text[] DEFAULT '{}',
  ai_feedback jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_preferences_location ON public.users_preferences USING gist(location);

CREATE OR REPLACE FUNCTION public.users_preferences_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_preferences_updated_at_trigger
BEFORE INSERT OR UPDATE ON public.users_preferences
FOR EACH ROW EXECUTE FUNCTION public.users_preferences_updated_at();

ALTER TABLE public.users_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their preferences"
  ON public.users_preferences FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
