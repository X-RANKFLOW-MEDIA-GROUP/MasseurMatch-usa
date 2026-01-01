-- Redirect table for therapist slugs
create table if not exists public.therapist_redirects (
  from_slug text primary key,
  to_slug text not null,
  therapist_id uuid references public.therapists(id) on delete cascade,
  created_at timestamptz default now()
);

create index if not exists idx_therapist_redirects_to_slug on public.therapist_redirects(to_slug);

-- Trigger to log old slug -> new slug on update
create or replace function public.log_therapist_slug_redirect()
returns trigger as $$
begin
  if NEW.slug is not null and OLD.slug is not null and NEW.slug <> OLD.slug then
    insert into public.therapist_redirects(from_slug, to_slug, therapist_id)
    values (OLD.slug, NEW.slug, NEW.id)
    on conflict (from_slug)
    do update
      set to_slug = excluded.to_slug,
          therapist_id = excluded.therapist_id,
          created_at = now();
  end if;
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists trg_therapist_slug_redirect on public.therapists;
create trigger trg_therapist_slug_redirect
after update of slug on public.therapists
for each row execute function public.log_therapist_slug_redirect();
