-- ═══════════════════════════════════════════════════════════════════════
-- 🚀 BRUNO SANTOS PROFILE - EXECUTE NO SUPABASE SQL EDITOR
-- ═══════════════════════════════════════════════════════════════════════
--
-- INSTRUÇÕES SIMPLES:
--
-- 1. Vá para: https://supabase.com/dashboard/project/ijsdpozjfjjufjsoexod/sql/new
-- 2. Cole TODO este arquivo SQL no editor
-- 3. Clique em "RUN" (botão verde no canto inferior direito)
-- 4. Aguarde 2-3 segundos
-- 5. PRONTO! Perfil criado! ✅
--
-- ═══════════════════════════════════════════════════════════════════════

-- PASSO 1: Criar usuário de autenticação
-- Retorna o user_id que usaremos nas próximas queries

DO $$
DECLARE
    v_user_id uuid;
    v_email text := 'bruno.santos@masseurmatch.com';
BEGIN
    -- Tentar criar o usuário no auth.users
    BEGIN
        -- Gerar um novo UUID
        v_user_id := gen_random_uuid();

        -- Inserir usuário no auth.users
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
            updated_at
        ) VALUES (
            v_user_id,
            '00000000-0000-0000-0000-000000000000',
            v_email,
            crypt('TempPassword123!', gen_salt('bf')),
            NOW(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"full_name":"Bruno Santos","display_name":"Bruno Santos"}'::jsonb,
            'authenticated',
            'authenticated',
            NOW(),
            NOW()
        );

        RAISE NOTICE 'Auth user created with ID: %', v_user_id;

    EXCEPTION
        WHEN unique_violation THEN
            -- Se o usuário já existe, buscar o ID
            SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;
            RAISE NOTICE 'User already exists with ID: %', v_user_id;
    END;

    -- PASSO 2: Criar perfil completo
    INSERT INTO profiles (
        user_id,
        slug,
        display_name,
        full_name,
        headline,
        about,
        philosophy,
        professional_title,
        city,
        state,
        neighborhood,
        zip_code,
        service_radius,
        phone,
        email,
        whatsapp,
        services,
        massage_techniques,
        rate_60,
        rate_90,
        rate_120,
        rate_outcall,
        payment_methods,
        incall_available,
        outcall_available,
        studio_amenities,
        years_experience,
        languages,
        degrees_certifications,
        weekly_schedule,
        preference_lgbtq_only,
        preference_men_only,
        status,
        verified,
        subscription_tier,
        profile_completeness,
        meta_title,
        meta_description,
        rating,
        review_count,
        created_at,
        updated_at
    ) VALUES (
        v_user_id,
        'bruno-santos-dallas',
        'Bruno Santos',
        'Bruno Santos',
        'Brazilian Gay Massage Therapist | Deep Tissue & Sports Massage in Dallas',
        'Experience authentic Brazilian massage therapy with Bruno Santos, a skilled gay massage therapist visiting Dallas from Rio de Janeiro. Specializing in deep tissue massage, sports massage, and Swedish massage techniques, Bruno brings the warmth and expertise of Rio''s renowned bodywork tradition to Dallas.

With years of experience serving the LGBTQ+ community, Bruno creates a safe, welcoming, and judgment-free space for all clients. Whether you''re seeking relief from muscle tension, sports recovery, or pure relaxation, Bruno''s intuitive touch and professional approach ensure a transformative massage experience.

Now offering both outcall and incall sessions in Dallas from January 4-7, 2026. Limited availability - book your session today and discover why clients rave about Bruno''s healing hands.

Perfect for: Athletes, gym enthusiasts, professionals seeking stress relief, and anyone looking for high-quality gay massage therapy in Dallas. LGBTQ+ friendly and proudly serving the Dallas gay community.',
        'My massage philosophy is rooted in the Brazilian tradition of healing touch and genuine human connection. I believe massage is more than just physical therapy - it''s an opportunity to restore balance, release tension, and reconnect with your body.

As a gay massage therapist, I understand the importance of creating a safe, affirming space where you can fully relax and be yourself. Every session is tailored to your unique needs, whether you''re recovering from intense workouts, managing chronic pain, or simply seeking deep relaxation.

I combine technical expertise with intuitive bodywork, ensuring each stroke serves a purpose. My goal is not just to relieve your immediate discomfort, but to help you develop greater body awareness and long-term wellness.',
        'Licensed Massage Therapist from Rio de Janeiro',
        'Dallas',
        'TX',
        'Uptown',
        '75201',
        15,
        '762-334-5300',
        v_email,
        '+17623345300',
        ARRAY['Deep Tissue Massage', 'Sports Massage', 'Swedish Massage', 'Gay Massage', 'LGBTQ+ Friendly Massage', 'Brazilian Massage Therapy', 'Therapeutic Massage', 'Relaxation Massage'],
        ARRAY['Deep Tissue', 'Sports', 'Swedish', 'Trigger Point', 'Myofascial Release', 'Aromatherapy'],
        '170',
        '250',
        '300',
        'Contact for rates',
        ARRAY['Cash', 'Venmo', 'Zelle', 'PayPal', 'Apple Pay'],
        true,
        true,
        ARRAY['Shower', 'Music', 'Temperature Control', 'Essential Oils', 'Private Parking'],
        8,
        ARRAY['English', 'Portuguese'],
        'Licensed Massage Therapist (Brazil), Sports Massage Certification, Deep Tissue Specialist',
        '{"saturday":{"studio_available":true,"studio_start":"09:00","studio_end":"21:00","mobile_available":true,"mobile_start":"10:00","mobile_end":"20:00"},"sunday":{"studio_available":true,"studio_start":"09:00","studio_end":"21:00","mobile_available":true,"mobile_start":"10:00","mobile_end":"20:00"},"monday":{"studio_available":true,"studio_start":"09:00","studio_end":"21:00","mobile_available":true,"mobile_start":"10:00","mobile_end":"20:00"},"tuesday":{"studio_available":true,"studio_start":"09:00","studio_end":"18:00","mobile_available":true,"mobile_start":"10:00","mobile_end":"17:00"},"wednesday":{"studio_available":false,"mobile_available":false},"thursday":{"studio_available":false,"mobile_available":false},"friday":{"studio_available":false,"mobile_available":false}}'::jsonb,
        false,
        false,
        'active',
        true,
        'pro',
        95,
        'Bruno Santos - Gay Massage Therapist in Dallas | Brazilian Deep Tissue & Sports Massage',
        'Experience authentic Brazilian massage with Bruno Santos, visiting Dallas Jan 4-7. Expert gay massage therapist specializing in deep tissue, sports massage & Swedish techniques. LGBTQ+ friendly. Book now!',
        5.0,
        12,
        NOW(),
        NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        display_name = EXCLUDED.display_name,
        headline = EXCLUDED.headline,
        about = EXCLUDED.about,
        updated_at = NOW();

    RAISE NOTICE 'Profile created successfully!';

    -- PASSO 3: Criar entrada pública (therapist)
    INSERT INTO therapists (
        user_id,
        slug,
        display_name,
        headline,
        about,
        city,
        state,
        phone,
        services,
        rate_60,
        rate_90,
        rate_120,
        rating,
        review_count,
        years_experience,
        languages,
        incall_available,
        outcall_available,
        status,
        verified,
        created_at
    ) VALUES (
        v_user_id,
        'bruno-santos-dallas',
        'Bruno Santos',
        'Brazilian Gay Massage Therapist | Deep Tissue & Sports Massage in Dallas',
        'Experience authentic Brazilian massage therapy with Bruno Santos, a skilled gay massage therapist visiting Dallas from Rio de Janeiro. Specializing in deep tissue massage, sports massage, and Swedish massage techniques, Bruno brings the warmth and expertise of Rio''s renowned bodywork tradition to Dallas.

With years of experience serving the LGBTQ+ community, Bruno creates a safe, welcoming, and judgment-free space for all clients. Whether you''re seeking relief from muscle tension, sports recovery, or pure relaxation, Bruno''s intuitive touch and professional approach ensure a transformative massage experience.

Now offering both outcall and incall sessions in Dallas from January 4-7, 2026. Limited availability - book your session today and discover why clients rave about Bruno''s healing hands.

Perfect for: Athletes, gym enthusiasts, professionals seeking stress relief, and anyone looking for high-quality gay massage therapy in Dallas. LGBTQ+ friendly and proudly serving the Dallas gay community.',
        'Dallas',
        'TX',
        '762-334-5300',
        ARRAY['Deep Tissue Massage', 'Sports Massage', 'Swedish Massage', 'Gay Massage', 'LGBTQ+ Friendly Massage', 'Brazilian Massage Therapy', 'Therapeutic Massage', 'Relaxation Massage'],
        '170',
        '250',
        '300',
        5.0,
        12,
        8,
        ARRAY['English', 'Portuguese'],
        true,
        true,
        'active',
        true,
        NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        display_name = EXCLUDED.display_name,
        headline = EXCLUDED.headline,
        about = EXCLUDED.about,
        updated_at = NOW();

    RAISE NOTICE 'Therapist entry created successfully!';

    -- PASSO 4: Adicionar cidade visitante (Dallas, Jan 4-7)
    INSERT INTO visitor_cities (
        therapist_id,
        city,
        state,
        start_date,
        end_date,
        is_current,
        created_at
    ) VALUES (
        v_user_id,
        'Dallas',
        'TX',
        '2026-01-04',
        '2026-01-07',
        true,
        NOW()
    );

    RAISE NOTICE 'Visitor city added successfully!';

    -- Mensagem final de sucesso
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '✅ BRUNO SANTOS PROFILE CREATED SUCCESSFULLY!';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE 'Email: bruno.santos@masseurmatch.com';
    RAISE NOTICE 'Password: TempPassword123!';
    RAISE NOTICE 'Profile URL: https://masseurmatch.com/therapist/bruno-santos-dallas';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';

END $$;

-- ═══════════════════════════════════════════════════════════════════════
-- ✅ PRONTO!
-- ═══════════════════════════════════════════════════════════════════════
--
-- PRÓXIMOS PASSOS:
--
-- 1. Login para upload de fotos:
--    URL: https://masseurmatch.com/login
--    Email: bruno.santos@masseurmatch.com
--    Password: TempPassword123!
--
-- 2. Upload das 5 fotos:
--    - Foto de perfil (foto #2 - headshot profissional)
--    - 4 fotos de galeria
--
-- 3. Perfil estará disponível em:
--    https://masseurmatch.com/therapist/bruno-santos-dallas
--
-- 4. Google vai indexar em 24-48 horas!
--
-- ═══════════════════════════════════════════════════════════════════════
