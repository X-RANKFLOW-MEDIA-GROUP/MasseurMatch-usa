-- Script para criar um perfil de massagista fake para testes
-- Usuário: test@test.com
-- Senha: 123456

-- IMPORTANTE: Este script deve ser executado no Supabase SQL Editor
-- ou via API usando o service_role_key

-- 1. Criar usuário de autenticação
-- NOTA: A senha '123456' será hasheada pelo Supabase Auth
-- Este INSERT direto em auth.users só funciona via SQL Editor do Supabase ou service_role

-- Primeiro, deletar se já existir (para desenvolvimento/testes)
DELETE FROM auth.users WHERE email = 'test@test.com';

-- Criar usuário (UUID fixo para facilitar testes)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud,
  confirmation_token,
  recovery_token
) VALUES (
  'a0000000-0000-0000-0000-000000000001'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'test@test.com',
  -- Hash bcrypt da senha '123456' (bcrypt cost 10)
  '$2a$10$N0e4YqL1w7jqC6RrL0k8bOGgTQb.eUxRLGjQy3qvZQR3.T3.NvP4K',
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb,
  false,
  'authenticated',
  'authenticated',
  '',
  ''
);

-- 2. Criar identidade do usuário
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
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'a0000000-0000-0000-0000-000000000001',
  jsonb_build_object(
    'sub', 'a0000000-0000-0000-0000-000000000001',
    'email', 'test@test.com',
    'email_verified', true,
    'phone_verified', false
  ),
  'email',
  now(),
  now(),
  now(),
  'test@test.com'
);

-- 3. Criar perfil na tabela profiles (se existir)
INSERT INTO public.profiles (
  id,
  email,
  created_at,
  updated_at
) VALUES (
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'test@test.com',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- 4. Criar perfil de massagista completo
INSERT INTO public.therapists (
  user_id,
  full_name,
  display_name,
  headline,
  about,
  philosophy,
  email,
  phone,
  city,
  state,
  country,
  neighborhood,
  address,
  zip_code,
  nearest_intersection,
  latitude,
  longitude,
  mobile_service_radius,
  services_headline,
  specialties_headline,
  promotions_headline,
  services,
  massage_techniques,
  studio_amenities,
  mobile_extras,
  additional_services,
  products_used,
  rate_60,
  rate_90,
  rate_outcall,
  payment_methods,
  regular_discounts,
  day_of_week_discount,
  weekly_specials,
  special_discount_groups,
  availability,
  degrees,
  affiliations,
  massage_start_date,
  languages,
  business_trips,
  rating,
  override_reviews_count,
  website,
  instagram,
  whatsapp,
  birthdate,
  years_experience,
  profile_photo,
  gallery,
  agree_terms,
  plan,
  plan_name,
  price_monthly,
  status,
  paid_until,
  subscription_status,
  stripe_current_period_end,
  created_at,
  updated_at
) VALUES (
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'Alex Santos - Teste',
  'Alex Santos',
  'Massagista Profissional Certificado - Especialista em Deep Tissue',
  'Olá! Sou Alex Santos, massagista certificado com mais de 8 anos de experiência ajudando clientes a alcançarem relaxamento profundo e alívio de tensões musculares. Minha abordagem combina técnicas tradicionais com métodos modernos para proporcionar uma experiência única e terapêutica.',
  'Acredito que a massagem é uma arte de cura que vai além do físico, alcançando o bem-estar mental e emocional. Cada sessão é personalizada para atender às necessidades específicas de cada cliente, criando um ambiente seguro e acolhedor.',
  'test@test.com',
  '+1 (555) 123-4567',
  'Los Angeles',
  'CA',
  'USA',
  'West Hollywood',
  '123 Wellness Street, Suite 456',
  '90069',
  'Santa Monica Blvd & La Cienega',
  '34.0901',
  '-118.3756',
  15,
  'Massagem Terapêutica, Relaxante e Desportiva',
  'Deep Tissue, Swedish, Sports Massage, Trigger Point',
  'Primeira sessão com 20% de desconto!',
  ARRAY['Massagem Terapêutica', 'Massagem Relaxante', 'Massagem Desportiva', 'Deep Tissue', 'Swedish Massage'],
  ARRAY['Deep Tissue', 'Swedish', 'Sports Massage', 'Trigger Point Therapy', 'Myofascial Release', 'Hot Stone', 'Aromatherapy'],
  ARRAY['Ambiente climatizado', 'Música relaxante', 'Aromaterapia', 'Chuveiro disponível', 'Estacionamento gratuito', 'Toalhas limpas fornecidas'],
  ARRAY['Mesa portátil profissional', 'Óleos premium', 'Música ambiente', 'Toalhas aquecidas'],
  ARRAY['Reflexologia', 'Esfoliação corporal', 'Terapia com pedras quentes'],
  'Óleos essenciais orgânicos, Óleos de massagem premium sem fragrância',
  '$80',
  '$110',
  '$150 (+ taxa de deslocamento)',
  ARRAY['Dinheiro', 'Cartão de crédito', 'Cartão de débito', 'Venmo', 'Zelle', 'PayPal'],
  'Pacote de 5 sessões com 15% de desconto',
  'Segundas-feiras: 10% off',
  'Happy Hour (14h-16h): $70/hora',
  ARRAY['Estudantes', 'Idosos', 'Profissionais de saúde'],
  jsonb_build_object(
    'monday', jsonb_build_object('available', true, 'hours', '9:00 AM - 8:00 PM'),
    'tuesday', jsonb_build_object('available', true, 'hours', '9:00 AM - 8:00 PM'),
    'wednesday', jsonb_build_object('available', true, 'hours', '9:00 AM - 8:00 PM'),
    'thursday', jsonb_build_object('available', true, 'hours', '9:00 AM - 8:00 PM'),
    'friday', jsonb_build_object('available', true, 'hours', '9:00 AM - 6:00 PM'),
    'saturday', jsonb_build_object('available', true, 'hours', '10:00 AM - 4:00 PM'),
    'sunday', jsonb_build_object('available', false, 'hours', 'Closed')
  ),
  'Certificação em Massoterapia pelo Pacific College of Health and Science (2016)',
  ARRAY['AMTA - American Massage Therapy Association', 'NCBTMB - National Certification Board'],
  '2016-03-15',
  ARRAY['Inglês', 'Espanhol', 'Português'],
  ARRAY['Las Vegas, NV', 'San Diego, CA', 'San Francisco, CA'],
  4.8,
  127,
  'https://alexsantosmassage.com',
  '@alexsantosmassage',
  '+15551234567',
  '1990-05-15',
  8,
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&h=600&fit=crop'
  ],
  true,
  'premium',
  'Premium Plan',
  49.99,
  'active',
  (now() + interval '30 days')::timestamptz,
  'active',
  (now() + interval '30 days')::timestamptz,
  now(),
  now()
) ON CONFLICT (user_id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  display_name = EXCLUDED.display_name,
  headline = EXCLUDED.headline,
  about = EXCLUDED.about,
  philosophy = EXCLUDED.philosophy,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  neighborhood = EXCLUDED.neighborhood,
  address = EXCLUDED.address,
  zip_code = EXCLUDED.zip_code,
  nearest_intersection = EXCLUDED.nearest_intersection,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  mobile_service_radius = EXCLUDED.mobile_service_radius,
  services_headline = EXCLUDED.services_headline,
  specialties_headline = EXCLUDED.specialties_headline,
  promotions_headline = EXCLUDED.promotions_headline,
  services = EXCLUDED.services,
  massage_techniques = EXCLUDED.massage_techniques,
  studio_amenities = EXCLUDED.studio_amenities,
  mobile_extras = EXCLUDED.mobile_extras,
  additional_services = EXCLUDED.additional_services,
  products_used = EXCLUDED.products_used,
  rate_60 = EXCLUDED.rate_60,
  rate_90 = EXCLUDED.rate_90,
  rate_outcall = EXCLUDED.rate_outcall,
  payment_methods = EXCLUDED.payment_methods,
  regular_discounts = EXCLUDED.regular_discounts,
  day_of_week_discount = EXCLUDED.day_of_week_discount,
  weekly_specials = EXCLUDED.weekly_specials,
  special_discount_groups = EXCLUDED.special_discount_groups,
  availability = EXCLUDED.availability,
  degrees = EXCLUDED.degrees,
  affiliations = EXCLUDED.affiliations,
  massage_start_date = EXCLUDED.massage_start_date,
  languages = EXCLUDED.languages,
  business_trips = EXCLUDED.business_trips,
  rating = EXCLUDED.rating,
  override_reviews_count = EXCLUDED.override_reviews_count,
  website = EXCLUDED.website,
  instagram = EXCLUDED.instagram,
  whatsapp = EXCLUDED.whatsapp,
  birthdate = EXCLUDED.birthdate,
  years_experience = EXCLUDED.years_experience,
  profile_photo = EXCLUDED.profile_photo,
  gallery = EXCLUDED.gallery,
  agree_terms = EXCLUDED.agree_terms,
  plan = EXCLUDED.plan,
  plan_name = EXCLUDED.plan_name,
  price_monthly = EXCLUDED.price_monthly,
  status = EXCLUDED.status,
  paid_until = EXCLUDED.paid_until,
  subscription_status = EXCLUDED.subscription_status,
  stripe_current_period_end = EXCLUDED.stripe_current_period_end,
  updated_at = now();

-- 5. Adicionar algumas reviews fake
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id uuid REFERENCES public.therapists(user_id) ON DELETE CASCADE,
  reviewer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

INSERT INTO public.reviews (therapist_id, reviewer_name, rating, comment, date) VALUES
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'Maria Silva', 5, 'Experiência incrível! Alex tem mãos mágicas e realmente entende de técnicas de massagem profunda. Saí me sentindo renovada!', now() - interval '5 days'),
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'John Williams', 5, 'Best massage I''ve had in LA! Very professional, clean studio, and Alex really knows how to work out those knots. Highly recommend!', now() - interval '12 days'),
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'Carlos Rodriguez', 4, 'Muito bom! Atendimento excelente e ambiente super relaxante. A única coisa é que gostaria que as sessões fossem um pouco mais longas.', now() - interval '18 days'),
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'Sarah Johnson', 5, 'Alex is amazing! I have chronic back pain and after just 3 sessions I''m feeling so much better. The hot stone add-on is worth it!', now() - interval '25 days'),
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'Pedro Mendes', 5, 'Profissional top! Explica tudo antes de começar, respeita os limites e realmente se preocupa com o bem-estar do cliente.', now() - interval '32 days');

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE '✅ Perfil de massagista fake criado com sucesso!';
  RAISE NOTICE '';
  RAISE NOTICE '📧 Email: test@test.com';
  RAISE NOTICE '🔑 Senha: 123456';
  RAISE NOTICE '👤 Nome: Alex Santos - Teste';
  RAISE NOTICE '📍 Localização: Los Angeles, CA';
  RAISE NOTICE '⭐ Rating: 4.8 (127 avaliações)';
  RAISE NOTICE '💳 Plano: Premium (ativo até ' || to_char(now() + interval '30 days', 'DD/MM/YYYY') || ')';
  RAISE NOTICE '';
  RAISE NOTICE '🔗 UUID do usuário: a0000000-0000-0000-0000-000000000001';
  RAISE NOTICE '';
  RAISE NOTICE 'Você pode fazer login com test@test.com / 123456';
END $$;
