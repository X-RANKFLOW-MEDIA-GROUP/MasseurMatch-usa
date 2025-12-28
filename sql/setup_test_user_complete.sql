-- ============================================================================
-- SCRIPT COMPLETO: Criar Usuário de Teste e Perfil de Massagista
-- ============================================================================
-- Projeto: MasseurMatch USA
-- Usuário de Teste: test@test.com / 123456
-- Nome: Bruno Santos (Massagista)
--
-- IMPORTANTE: Execute este script no SQL Editor do Supabase Dashboard
-- ============================================================================

-- ============================================================================
-- PARTE 1: LIMPAR DADOS EXISTENTES (se necessário)
-- ============================================================================

-- Deletar usuário de teste se já existir
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Buscar ID do usuário pelo email
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'test@test.com';

  IF v_user_id IS NOT NULL THEN
    -- Deletar reviews primeiro (FK constraint) - somente se a tabela existir
    BEGIN
      DELETE FROM public.reviews WHERE therapist_id = v_user_id;
    EXCEPTION
      WHEN undefined_table THEN
        NULL; -- Tabela não existe, tudo bem
    END;

    -- Deletar perfil de therapist
    DELETE FROM public.therapists WHERE user_id = v_user_id;

    -- Deletar de profiles se existir
    DELETE FROM public.profiles WHERE id = v_user_id;

    -- Deletar identidades
    DELETE FROM auth.identities WHERE user_id = v_user_id;

    -- Deletar usuário
    DELETE FROM auth.users WHERE id = v_user_id;

    RAISE NOTICE '✅ Usuário anterior deletado com sucesso';
  ELSE
    RAISE NOTICE 'ℹ️  Nenhum usuário anterior encontrado';
  END IF;
END $$;

-- ============================================================================
-- PARTE 2: CRIAR USUÁRIO NO AUTH
-- ============================================================================

-- Criar usuário de autenticação
-- NOTA: O hash da senha '123456' foi gerado com bcrypt (cost 10)
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
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000'::uuid,
  'test@test.com',
  -- Hash bcrypt da senha '123456'
  '$2a$10$N0e4YqL1w7jqC6RrL0k8bOGgTQb.eUxRLGjQy3qvZQR3.T3.NvP4K',
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Bruno Santos"}'::jsonb,
  'authenticated',
  'authenticated',
  now(),
  now(),
  '',
  '',
  '',
  ''
) RETURNING id;

-- Capturar o ID do usuário criado para usar nas próximas queries
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'test@test.com' LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Erro: Usuário não foi criado corretamente';
  END IF;

  RAISE NOTICE '✅ Usuário criado com ID: %', v_user_id;

  -- ============================================================================
  -- PARTE 3: CRIAR IDENTIDADE DO USUÁRIO
  -- ============================================================================

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
    v_user_id,
    v_user_id::text,
    jsonb_build_object(
      'sub', v_user_id::text,
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

  RAISE NOTICE '✅ Identidade criada';

  -- ============================================================================
  -- PARTE 4: CRIAR PERFIL NA TABELA PROFILES (se existir)
  -- ============================================================================

  -- Tentar criar perfil (ignorar se tabela não existir)
  BEGIN
    INSERT INTO public.profiles (
      id,
      email,
      created_at,
      updated_at
    ) VALUES (
      v_user_id,
      'test@test.com',
      now(),
      now()
    ) ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE '✅ Perfil criado na tabela profiles';
  EXCEPTION
    WHEN undefined_table THEN
      RAISE NOTICE 'ℹ️  Tabela profiles não existe (normal)';
  END;

  -- ============================================================================
  -- PARTE 5: CRIAR PERFIL DE MASSAGISTA NA TABELA THERAPISTS
  -- ============================================================================

  INSERT INTO public.therapists (
    user_id,
    full_name,
    display_name,
    headline,
    email,
    phone,
    city,
    state,
    country,
    neighborhood,
    address,
    zip_code,
    services_headline,
    specialties_headline,
    promotions_headline,
    massage_techniques,
    rate_60,
    rate_90,
    rate_outcall,
    payment_methods,
    languages,
    years_experience,
    rating,
    override_reviews_count,
    profile_photo,
    gallery,
    agree_terms,
    plan,
    plan_name,
    price_monthly,
    status,
    subscription_status,
    paid_until,
    stripe_current_period_end,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    'Bruno Santos',
    'Bruno Santos',
    'Massagista Profissional Certificado - Especialista em Relaxamento',
    'test@test.com',
    '+1 (555) 999-8888',
    'Miami',
    'FL',
    'USA',
    'South Beach',
    '456 Ocean Drive, Suite 789',
    '33139',
    'Massagem Relaxante, Terapêutica e Desportiva',
    'Swedish, Deep Tissue, Sports Massage',
    'Sessão de teste com 15% de desconto!',
    ARRAY['Swedish', 'Deep Tissue', 'Sports Massage', 'Hot Stone', 'Aromatherapy'],
    '$85',
    '$120',
    '$160',
    ARRAY['Dinheiro', 'Cartão de crédito', 'Cartão de débito', 'Venmo', 'Zelle'],
    ARRAY['Inglês', 'Português', 'Espanhol'],
    6,
    4.9,
    89,
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop',
    ARRAY[
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=600&fit=crop'
    ],
    true,
    'premium',
    'Premium Plan',
    49.99,
    'active',
    'active',
    (now() + interval '30 days')::timestamptz,
    (now() + interval '30 days')::timestamptz,
    now(),
    now()
  ) ON CONFLICT (user_id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    display_name = EXCLUDED.display_name,
    headline = EXCLUDED.headline,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    country = EXCLUDED.country,
    services_headline = EXCLUDED.services_headline,
    specialties_headline = EXCLUDED.specialties_headline,
    massage_techniques = EXCLUDED.massage_techniques,
    rate_60 = EXCLUDED.rate_60,
    rate_90 = EXCLUDED.rate_90,
    rating = EXCLUDED.rating,
    profile_photo = EXCLUDED.profile_photo,
    gallery = EXCLUDED.gallery,
    plan = EXCLUDED.plan,
    status = EXCLUDED.status,
    subscription_status = EXCLUDED.subscription_status,
    updated_at = now();

  RAISE NOTICE '✅ Perfil de massagista criado';

  -- ============================================================================
  -- PARTE 6: ADICIONAR REVIEWS FAKE
  -- ============================================================================

  -- Criar tabela reviews se não existir
  CREATE TABLE IF NOT EXISTS public.reviews (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    therapist_id uuid REFERENCES public.therapists(user_id) ON DELETE CASCADE,
    reviewer_name text NOT NULL,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment text,
    date timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now()
  );

  -- Inserir reviews
  INSERT INTO public.reviews (therapist_id, reviewer_name, rating, comment, date) VALUES
    (v_user_id, 'Ana Paula Costa', 5, 'Massagem incrível! Bruno é super profissional e atencioso. Recomendo muito!', now() - interval '3 days'),
    (v_user_id, 'Michael Johnson', 5, 'Best massage in Miami! Very relaxing and professional service.', now() - interval '8 days'),
    (v_user_id, 'Carlos Mendes', 5, 'Excelente atendimento! Aliviou completamente minha tensão muscular.', now() - interval '15 days'),
    (v_user_id, 'Jennifer Lopez', 4, 'Great experience overall. The hot stone massage was amazing!', now() - interval '22 days');

  RAISE NOTICE '✅ Reviews adicionadas';

  -- ============================================================================
  -- RESUMO FINAL
  -- ============================================================================

  RAISE NOTICE '';
  RAISE NOTICE '============================================================';
  RAISE NOTICE '✅ PERFIL DE MASSAGISTA CRIADO COM SUCESSO!';
  RAISE NOTICE '============================================================';
  RAISE NOTICE '';
  RAISE NOTICE '📧 Email: test@test.com';
  RAISE NOTICE '🔑 Senha: 123456';
  RAISE NOTICE '👤 Nome: Bruno Santos';
  RAISE NOTICE '📍 Localização: Miami, FL (South Beach)';
  RAISE NOTICE '⭐ Rating: 4.9 (89 avaliações)';
  RAISE NOTICE '💳 Plano: Premium (ativo por 30 dias)';
  RAISE NOTICE '';
  RAISE NOTICE '🔗 UUID do usuário: %', v_user_id;
  RAISE NOTICE '';
  RAISE NOTICE '🌐 Você pode fazer login com test@test.com / 123456';
  RAISE NOTICE '============================================================';

END $$;

-- ============================================================================
-- PARTE 7: POLÍTICAS RLS PARA STORAGE (OPCIONAL - SE USAR UPLOADS)
-- ============================================================================

-- Criar bucket 'therapist-uploads' se não existir (via Dashboard ou API)
-- As políticas abaixo assumem que o bucket existe

-- Habilitar RLS na tabela storage.objects (se ainda não estiver)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Permitir que usuários autenticados façam upload apenas em suas próprias pastas
DROP POLICY IF EXISTS "Therapists can upload own files" ON storage.objects;
CREATE POLICY "Therapists can upload own files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'therapist-uploads'
  AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

-- Permitir que usuários autenticados leiam apenas seus próprios arquivos
DROP POLICY IF EXISTS "Therapists can view own files" ON storage.objects;
CREATE POLICY "Therapists can view own files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'therapist-uploads'
  AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

-- Permitir que todos vejam arquivos públicos (opcional - para fotos de perfil)
DROP POLICY IF EXISTS "Public can view therapist files" ON storage.objects;
CREATE POLICY "Public can view therapist files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'therapist-uploads');

-- Permitir que usuários autenticados atualizem/deletem apenas seus arquivos
DROP POLICY IF EXISTS "Therapists can update own files" ON storage.objects;
CREATE POLICY "Therapists can update own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'therapist-uploads'
  AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
)
WITH CHECK (
  bucket_id = 'therapist-uploads'
  AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

DROP POLICY IF EXISTS "Therapists can delete own files" ON storage.objects;
CREATE POLICY "Therapists can delete own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'therapist-uploads'
  AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================

-- Verificação final
SELECT
  u.id as user_id,
  u.email,
  u.created_at as user_created,
  t.full_name,
  t.city,
  t.state,
  t.status,
  t.plan,
  t.rating
FROM auth.users u
LEFT JOIN public.therapists t ON t.user_id = u.id
WHERE u.email = 'test@test.com';
