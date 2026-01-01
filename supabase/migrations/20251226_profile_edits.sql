-- Profile edits and notification tables for admin review flow.
CREATE TABLE IF NOT EXISTS public.profile_edits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id UUID NOT NULL REFERENCES public.therapists(user_id) ON DELETE CASCADE,
  edited_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  pending_profile_photo TEXT,
  pending_gallery TEXT[],
  original_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  original_profile_photo TEXT,
  original_gallery TEXT[],
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_edits_therapist
  ON public.profile_edits(therapist_id);
CREATE INDEX IF NOT EXISTS idx_profile_edits_status
  ON public.profile_edits(status);

CREATE TABLE IF NOT EXISTS public.edit_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id UUID NOT NULL REFERENCES public.therapists(user_id) ON DELETE CASCADE,
  edit_id UUID REFERENCES public.profile_edits(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('pending', 'approved', 'rejected')),
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_edit_notifications_therapist
  ON public.edit_notifications(therapist_id);

CREATE TRIGGER update_profile_edits_updated_at
  BEFORE UPDATE ON public.profile_edits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
