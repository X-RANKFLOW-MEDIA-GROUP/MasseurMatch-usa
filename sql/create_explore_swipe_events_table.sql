-- Track swipe decisions for Explore AI to power analytics and learning.
CREATE TABLE IF NOT EXISTS public.explore_swipe_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  therapist_id uuid REFERENCES public.therapists(user_id) ON DELETE CASCADE,
  direction text CHECK (direction IN ('left', 'right', 'up')) NOT NULL,
  match_score numeric(5,2),
  context jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_explore_swipe_events_user ON public.explore_swipe_events(user_id);
CREATE INDEX IF NOT EXISTS idx_explore_swipe_events_therapist ON public.explore_swipe_events(therapist_id);
