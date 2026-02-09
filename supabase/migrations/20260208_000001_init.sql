-- MasseurMatch-usa - Supabase full init
-- Generated: 2026-02-08

create extension if not exists "pgcrypto";

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- PROFILES (admin gate)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- THERAPISTS (main)
create table if not exists public.therapists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,

  full_name text,
  display_name text,
  headline text,
  about text,
  philosophy text,

  email text,
  phone text,

  city text,
  state text,
  country text,
  neighborhood text,
  address text,
  zip_code text,
  nearest_intersection text,
  location text,

  mobile_service_radius integer,
  services_headline text,
  specialties_headline text,
  promotions_headline text,

  services jsonb,
  massage_techniques jsonb,
  studio_amenities jsonb,
  mobile_extras jsonb,
  additional_services jsonb,
  products_used text,

  rate_60 text,
  rate_90 text,
  rate_outcall text,
  payment_methods jsonb,

  regular_discounts text,
  day_of_week_discount text,
  weekly_specials text,
  special_discount_groups jsonb,

  availability jsonb,

  degrees text,
  affiliations jsonb,
  massage_start_date date,
  languages jsonb,
  business_trips jsonb,

  rating numeric,
  override_reviews_count integer,
  reviews jsonb,

  website text,
  instagram text,
  whatsapp text,

  birthdate date,
  years_experience integer,

  profile_photo text,
  gallery jsonb,

  travel_radius text,
  accepts_first_timers boolean,
  prefers_lgbtq_clients boolean,

  agree_terms boolean,
  plan text,
  plan_name text,
  price_monthly integer,

  status text,
  subscription_status text,
  paid_until timestamptz,
  stripe_current_period_end timestamptz,

  reviewed_by uuid,
  reviewed_at timestamptz,
  rejection_reason text,

  document_url text,
  selfie_url text,
  card_url text,
  signed_term_url text,

  lat double precision,
  lng double precision,
  latitude double precision,
  longitude double precision,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- PROFILE_EDITS
create table if not exists public.profile_edits (
  id uuid primary key default gen_random_uuid(),
  therapist_id uuid not null references public.therapists(id) on delete cascade,

  edited_data jsonb not null,
  original_data jsonb not null,

  pending_profile_photo text,
  pending_gallery jsonb,
  original_profile_photo text,
  original_gallery jsonb,

  status text not null default 'pending',
  admin_notes text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  submitted_at timestamptz not null default now(),

  approved_at timestamptz,
  rejected_at timestamptz,
  rejection_reason text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- EDIT_NOTIFICATIONS
create table if not exists public.edit_notifications (
  id uuid primary key default gen_random_uuid(),
  therapist_id uuid not null references public.therapists(id) on delete cascade,
  edit_id uuid references public.profile_edits(id) on delete set null,

  type text not null,
  message text not null,
  read boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- PAYMENTS (read-only from client)
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,

  status text,
  paid_until timestamptz,

  customer_email text,
  email text,
  txt text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index if not exists therapists_status_idx on public.therapists (status);
create index if not exists therapists_user_id_idx on public.therapists (user_id);
create index if not exists therapists_city_state_idx on public.therapists (city, state);
create index if not exists therapists_lat_lng_idx on public.therapists (lat, lng);

create index if not exists profile_edits_therapist_idx on public.profile_edits (therapist_id);
create index if not exists profile_edits_status_idx on public.profile_edits (status);
create index if not exists profile_edits_submitted_idx on public.profile_edits (submitted_at desc);

create index if not exists edit_notifications_therapist_created_idx
  on public.edit_notifications (therapist_id, created_at desc);

create index if not exists payments_user_idx on public.payments (user_id);
create index if not exists payments_email_idx on public.payments (email);
create index if not exists payments_customer_email_idx on public.payments (customer_email);
create index if not exists payments_txt_idx on public.payments (txt);
create index if not exists payments_updated_idx on public.payments (updated_at desc);

-- updated_at triggers
drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_therapists_updated_at on public.therapists;
create trigger trg_therapists_updated_at
before update on public.therapists
for each row execute function public.set_updated_at();

drop trigger if exists trg_profile_edits_updated_at on public.profile_edits;
create trigger trg_profile_edits_updated_at
before update on public.profile_edits
for each row execute function public.set_updated_at();

drop trigger if exists trg_edit_notifications_updated_at on public.edit_notifications;
create trigger trg_edit_notifications_updated_at
before update on public.edit_notifications
for each row execute function public.set_updated_at();

drop trigger if exists trg_payments_updated_at on public.payments;
create trigger trg_payments_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

-- Auto-create profiles row for new users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, is_admin)
  values (new.id, false)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- RLS helpers
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and is_admin = true
  );
$$;

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.therapists enable row level security;
alter table public.profile_edits enable row level security;
alter table public.edit_notifications enable row level security;
alter table public.payments enable row level security;

-- PROFILES policies
drop policy if exists "Profiles: self read" on public.profiles;
create policy "Profiles: self read" on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "Profiles: self insert" on public.profiles;
create policy "Profiles: self insert" on public.profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists "Profiles: self update" on public.profiles;
create policy "Profiles: self update" on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- THERAPISTS policies
drop policy if exists "Therapists: public read active" on public.therapists;
create policy "Therapists: public read active" on public.therapists
  for select
  using (status = 'active');

drop policy if exists "Therapists: owner read" on public.therapists;
create policy "Therapists: owner read" on public.therapists
  for select
  using (auth.uid() = user_id);

drop policy if exists "Therapists: admin read" on public.therapists;
create policy "Therapists: admin read" on public.therapists
  for select
  using (public.is_admin());

drop policy if exists "Therapists: owner insert" on public.therapists;
create policy "Therapists: owner insert" on public.therapists
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Therapists: owner update" on public.therapists;
create policy "Therapists: owner update" on public.therapists
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Therapists: admin update" on public.therapists;
create policy "Therapists: admin update" on public.therapists
  for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Therapists: admin delete" on public.therapists;
create policy "Therapists: admin delete" on public.therapists
  for delete
  using (public.is_admin());

-- PROFILE_EDITS policies
drop policy if exists "Profile edits: owner read" on public.profile_edits;
create policy "Profile edits: owner read" on public.profile_edits
  for select
  using (
    exists (
      select 1
      from public.therapists t
      where t.id = profile_edits.therapist_id
        and t.user_id = auth.uid()
    )
  );

drop policy if exists "Profile edits: admin read" on public.profile_edits;
create policy "Profile edits: admin read" on public.profile_edits
  for select
  using (public.is_admin());

drop policy if exists "Profile edits: owner insert" on public.profile_edits;
create policy "Profile edits: owner insert" on public.profile_edits
  for insert
  with check (
    exists (
      select 1
      from public.therapists t
      where t.id = profile_edits.therapist_id
        and t.user_id = auth.uid()
    )
  );

drop policy if exists "Profile edits: admin update" on public.profile_edits;
create policy "Profile edits: admin update" on public.profile_edits
  for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Profile edits: admin delete" on public.profile_edits;
create policy "Profile edits: admin delete" on public.profile_edits
  for delete
  using (public.is_admin());

-- EDIT_NOTIFICATIONS policies
drop policy if exists "Edit notifications: owner read" on public.edit_notifications;
create policy "Edit notifications: owner read" on public.edit_notifications
  for select
  using (
    exists (
      select 1
      from public.therapists t
      where t.id = edit_notifications.therapist_id
        and t.user_id = auth.uid()
    )
  );

drop policy if exists "Edit notifications: admin read" on public.edit_notifications;
create policy "Edit notifications: admin read" on public.edit_notifications
  for select
  using (public.is_admin());

drop policy if exists "Edit notifications: owner insert" on public.edit_notifications;
create policy "Edit notifications: owner insert" on public.edit_notifications
  for insert
  with check (
    exists (
      select 1
      from public.therapists t
      where t.id = edit_notifications.therapist_id
        and t.user_id = auth.uid()
    )
  );

drop policy if exists "Edit notifications: admin insert" on public.edit_notifications;
create policy "Edit notifications: admin insert" on public.edit_notifications
  for insert
  with check (public.is_admin());

drop policy if exists "Edit notifications: owner update" on public.edit_notifications;
create policy "Edit notifications: owner update" on public.edit_notifications
  for update
  using (
    exists (
      select 1
      from public.therapists t
      where t.id = edit_notifications.therapist_id
        and t.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.therapists t
      where t.id = edit_notifications.therapist_id
        and t.user_id = auth.uid()
    )
  );

drop policy if exists "Edit notifications: admin update" on public.edit_notifications;
create policy "Edit notifications: admin update" on public.edit_notifications
  for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Edit notifications: admin delete" on public.edit_notifications;
create policy "Edit notifications: admin delete" on public.edit_notifications
  for delete
  using (public.is_admin());

-- PAYMENTS policies
drop policy if exists "Payments: owner read" on public.payments;
create policy "Payments: owner read" on public.payments
  for select
  using (
    auth.uid() = user_id
    or (
      coalesce(auth.jwt() ->> 'email', '') <> ''
      and (
        email = (auth.jwt() ->> 'email')
        or customer_email = (auth.jwt() ->> 'email')
        or txt = (auth.jwt() ->> 'email')
      )
    )
    or public.is_admin()
  );

-- Realtime (profile_edits + edit_notifications)
do $$
begin
  if not exists (
    select 1
    from pg_publication p
    join pg_publication_rel pr on pr.prpubid = p.oid
    join pg_class c on c.oid = pr.prrelid
    join pg_namespace n on n.oid = c.relnamespace
    where p.pubname = 'supabase_realtime'
      and n.nspname = 'public'
      and c.relname = 'profile_edits'
  ) then
    alter publication supabase_realtime add table public.profile_edits;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_publication p
    join pg_publication_rel pr on pr.prpubid = p.oid
    join pg_class c on c.oid = pr.prrelid
    join pg_namespace n on n.oid = c.relnamespace
    where p.pubname = 'supabase_realtime'
      and n.nspname = 'public'
      and c.relname = 'edit_notifications'
  ) then
    alter publication supabase_realtime add table public.edit_notifications;
  end if;
end $$;

-- Storage buckets
insert into storage.buckets (id, name, public)
values ('profiles', 'profiles', true)
on conflict (id) do update set public = excluded.public;

insert into storage.buckets (id, name, public)
values ('pending-photos', 'pending-photos', true)
on conflict (id) do update set public = excluded.public;

-- Storage policies
alter table storage.objects enable row level security;

drop policy if exists "Public read profiles" on storage.objects;
create policy "Public read profiles" on storage.objects
  for select
  using (bucket_id = 'profiles');

drop policy if exists "Public read pending-photos" on storage.objects;
create policy "Public read pending-photos" on storage.objects
  for select
  using (bucket_id = 'pending-photos');

drop policy if exists "Authenticated upload profiles" on storage.objects;
drop policy if exists "Authenticated update profiles" on storage.objects;
drop policy if exists "Authenticated delete profiles" on storage.objects;

-- Profiles bucket: owner-only (folder = auth.uid) + admin
drop policy if exists "Profiles: owner upload" on storage.objects;
create policy "Profiles: owner upload" on storage.objects
  for insert
  with check (
    bucket_id = 'profiles'
    and auth.role() = 'authenticated'
    and (
      public.is_admin()
      or name like auth.uid() || '/%'
    )
  );

drop policy if exists "Profiles: owner update" on storage.objects;
create policy "Profiles: owner update" on storage.objects
  for update
  using (
    bucket_id = 'profiles'
    and auth.role() = 'authenticated'
    and (
      public.is_admin()
      or name like auth.uid() || '/%'
    )
  )
  with check (
    bucket_id = 'profiles'
    and auth.role() = 'authenticated'
    and (
      public.is_admin()
      or name like auth.uid() || '/%'
    )
  );

drop policy if exists "Profiles: owner delete" on storage.objects;
create policy "Profiles: owner delete" on storage.objects
  for delete
  using (
    bucket_id = 'profiles'
    and auth.role() = 'authenticated'
    and (
      public.is_admin()
      or name like auth.uid() || '/%'
    )
  );

-- Pending photos bucket: owner-only (pending/<therapist_id>/) + admin
drop policy if exists "Pending photos: owner upload" on storage.objects;
create policy "Pending photos: owner upload" on storage.objects
  for insert
  with check (
    bucket_id = 'pending-photos'
    and auth.role() = 'authenticated'
    and (
      public.is_admin()
      or exists (
        select 1
        from public.therapists t
        where t.user_id = auth.uid()
          and storage.objects.name like 'pending/' || t.id || '/%'
      )
    )
  );

drop policy if exists "Pending photos: owner update" on storage.objects;
create policy "Pending photos: owner update" on storage.objects
  for update
  using (
    bucket_id = 'pending-photos'
    and auth.role() = 'authenticated'
    and (
      public.is_admin()
      or exists (
        select 1
        from public.therapists t
        where t.user_id = auth.uid()
          and storage.objects.name like 'pending/' || t.id || '/%'
      )
    )
  )
  with check (
    bucket_id = 'pending-photos'
    and auth.role() = 'authenticated'
    and (
      public.is_admin()
      or exists (
        select 1
        from public.therapists t
        where t.user_id = auth.uid()
          and storage.objects.name like 'pending/' || t.id || '/%'
      )
    )
  );

drop policy if exists "Pending photos: owner delete" on storage.objects;
create policy "Pending photos: owner delete" on storage.objects
  for delete
  using (
    bucket_id = 'pending-photos'
    and auth.role() = 'authenticated'
    and (
      public.is_admin()
      or exists (
        select 1
        from public.therapists t
        where t.user_id = auth.uid()
          and storage.objects.name like 'pending/' || t.id || '/%'
      )
    )
  );

-- Seed (optional) - requires existing auth.users
do $$
declare
  admin_user uuid;
begin
  select id into admin_user
  from auth.users
  where email = 'admin@xrankflow.com'
  limit 1;

  if admin_user is not null then
    insert into public.profiles (id, is_admin)
    values (admin_user, true)
    on conflict (id) do update set is_admin = true;
  end if;
end $$;

do $$
declare
  demo_user uuid;
  demo_email text;
begin
  select id, email into demo_user, demo_email
  from auth.users
  where email = 'segatti.hall@gmail.com'
  limit 1;

  if demo_user is not null then
    insert into public.therapists (
      user_id,
      full_name,
      display_name,
      email,
      city,
      state,
      country,
      location,
      services,
      languages,
      profile_photo,
      status,
      plan,
      plan_name,
      subscription_status,
      paid_until,
      created_at,
      updated_at
    )
    values (
      demo_user,
      'Demo Therapist',
      'Demo Therapist',
      demo_email,
      'Austin',
      'TX',
      'United States',
      'Austin, TX',
      jsonb_build_array('Deep Tissue', 'Swedish', 'Sports'),
      jsonb_build_array('English', 'Spanish'),
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1600&auto=format&fit=crop',
      'active',
      'free',
      'Free',
      'active',
      now() + interval '30 days',
      now(),
      now()
    )
    on conflict (user_id) do nothing;
  end if;
end $$;
