-- Redirect table for therapist slugs.
CREATE TABLE IF NOT EXISTS public.therapist_slug_redirects (
  old_slug TEXT PRIMARY KEY,
  new_slug TEXT NOT NULL,
  therapist_id UUID REFERENCES public.therapists(user_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_therapist_slug_redirects_new_slug
  ON public.therapist_slug_redirects(new_slug);

CREATE OR REPLACE FUNCTION public.log_therapist_slug_redirect()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NOT NULL AND OLD.slug IS NOT NULL AND NEW.slug <> OLD.slug THEN
    INSERT INTO public.therapist_slug_redirects (old_slug, new_slug, therapist_id)
    VALUES (OLD.slug, NEW.slug, NEW.user_id)
    ON CONFLICT (old_slug)
    DO UPDATE
      SET new_slug = excluded.new_slug,
          therapist_id = excluded.therapist_id,
          created_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_therapist_slug_redirect ON public.therapists;
CREATE TRIGGER trg_therapist_slug_redirect
  AFTER UPDATE OF slug ON public.therapists
  FOR EACH ROW
  EXECUTE FUNCTION public.log_therapist_slug_redirect();
