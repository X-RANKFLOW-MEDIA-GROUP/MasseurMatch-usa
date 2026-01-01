-- Seed data for local development and tests.
DO $$
DECLARE
  test_user_id uuid := '00000000-0000-0000-0000-000000000001';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = test_user_id) THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      aud,
      role,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change
    ) VALUES (
      test_user_id,
      '00000000-0000-0000-0000-000000000000'::uuid,
      'test@masseurmatch.com',
      '$2a$10$N0e4YqL1w7jqC6RrL0k8bOGgTQb.eUxRLGjQy3qvZQR3.T3.NvP4K',
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"display_name":"Alex Santos"}'::jsonb,
      'authenticated',
      'authenticated',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.identities WHERE user_id = test_user_id) THEN
    INSERT INTO auth.identities (
      id,
      user_id,
      provider_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at,
      email
    ) VALUES (
      gen_random_uuid(),
      test_user_id,
      test_user_id,
      jsonb_build_object('sub', test_user_id::text, 'email', 'test@masseurmatch.com'),
      'email',
      now(),
      now(),
      now(),
      'test@masseurmatch.com'
    );
  END IF;

  INSERT INTO public.users (id, identity_status, role, created_at, updated_at)
  VALUES (test_user_id, 'verified', 'admin', now(), now())
  ON CONFLICT (id)
  DO UPDATE SET
    identity_status = EXCLUDED.identity_status,
    role = EXCLUDED.role,
    updated_at = now();

  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (test_user_id, 'test@masseurmatch.com', now(), now())
  ON CONFLICT (id)
  DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = now();

  UPDATE public.profiles
  SET
    user_id = test_user_id,
    display_name = 'Alex Santos',
    slug = 'alex-santos',
    city_slug = 'dallas-tx',
    city = 'Dallas',
    state = 'TX',
    zip_code = '75201',
    bio = 'Certified massage therapist specializing in deep tissue and relaxation sessions.',
    bio_short = 'Certified massage therapist specializing in deep tissue and relaxation sessions.',
    bio_long = 'I help clients recover and recharge with tailored bodywork sessions.',
    phone_public_e164 = '+15551234567',
    email_public = 'test@masseurmatch.com',
    website_url = 'https://example.com',
    incall_enabled = true,
    outcall_enabled = true,
    publication_status = 'public',
    admin_status = 'approved',
    auto_moderation = 'auto_passed',
    onboarding_stage = 'live',
    updated_at = now()
  WHERE id = test_user_id;

  DELETE FROM public.profile_services WHERE profile_id = test_user_id;
  DELETE FROM public.profile_languages WHERE profile_id = test_user_id;
  DELETE FROM public.profile_rates WHERE profile_id = test_user_id;
  DELETE FROM public.media_assets WHERE profile_id = test_user_id;

  INSERT INTO public.profile_services (profile_id, service)
  VALUES
    (test_user_id, 'Deep Tissue Massage'),
    (test_user_id, 'Swedish Massage');

  INSERT INTO public.profile_languages (profile_id, language)
  VALUES
    (test_user_id, 'English'),
    (test_user_id, 'Spanish');

  INSERT INTO public.profile_rates (profile_id, context, duration_minutes, price_cents, currency, is_active)
  VALUES
    (test_user_id, 'incall', 60, 12000, 'USD', true),
    (test_user_id, 'outcall', 60, 15000, 'USD', true)
  ON CONFLICT (profile_id, context, duration_minutes)
  DO UPDATE SET
    price_cents = EXCLUDED.price_cents,
    currency = EXCLUDED.currency,
    is_active = EXCLUDED.is_active,
    updated_at = now();

  INSERT INTO public.media_assets (
    id,
    profile_id,
    status,
    type,
    storage_path,
    public_url,
    position,
    is_cover,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    test_user_id,
    'approved',
    'photo',
    'seed/profile-photo.jpg',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
    0,
    true,
    now(),
    now()
  );

  INSERT INTO public.therapists (
    user_id,
    slug,
    full_name,
    display_name,
    headline,
    about,
    email,
    phone,
    city,
    state,
    country,
    zip_code,
    latitude,
    longitude,
    services,
    massage_techniques,
    languages,
    rating,
    override_reviews_count,
    profile_photo,
    plan,
    plan_name,
    status,
    created_at,
    updated_at
  ) VALUES (
    test_user_id,
    'alex-santos',
    'Alex Santos',
    'Alex Santos',
    'Deep tissue and relaxation specialist',
    'I help clients recover and recharge with tailored bodywork sessions.',
    'test@masseurmatch.com',
    '+15551234567',
    'Dallas',
    'TX',
    'USA',
    '75201',
    '32.7767',
    '-96.7970',
    ARRAY['Deep Tissue', 'Swedish'],
    ARRAY['Deep Tissue', 'Swedish', 'Sports'],
    ARRAY['English', 'Spanish'],
    4.9,
    120,
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
    'free',
    'Free Plan',
    'active',
    now(),
    now()
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    slug = EXCLUDED.slug,
    display_name = EXCLUDED.display_name,
    headline = EXCLUDED.headline,
    about = EXCLUDED.about,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    services = EXCLUDED.services,
    massage_techniques = EXCLUDED.massage_techniques,
    languages = EXCLUDED.languages,
    rating = EXCLUDED.rating,
    override_reviews_count = EXCLUDED.override_reviews_count,
    profile_photo = EXCLUDED.profile_photo,
    status = EXCLUDED.status,
    updated_at = now();
END $$;
