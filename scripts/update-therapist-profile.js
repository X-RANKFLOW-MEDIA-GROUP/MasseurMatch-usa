/**
 * Script para ATUALIZAR o perfil do massagista fake existente
 * Usa o email test@test.com para encontrar o usuário
 */

// Carregar variáveis de ambiente
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY devem estar configurados');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const FAKE_USER_EMAIL = 'test@test.com';

async function main() {
  console.log('🔄 Atualizando perfil do massagista fake...\n');

  try {
    // 1. Buscar usuário existente
    console.log('🔍 Procurando usuário test@test.com...');
    const { data: allUsers } = await supabase.auth.admin.listUsers();
    const existingUser = allUsers?.users?.find(u => u.email === FAKE_USER_EMAIL);

    if (!existingUser) {
      console.error('❌ Usuário não encontrado!');
      console.log('Execute primeiro: node scripts/seed-simple-therapist.js');
      process.exit(1);
    }

    console.log('✅ Usuário encontrado! ID:', existingUser.id);

    // 2. Criar/atualizar perfil de massagista
    console.log('💆 Atualizando perfil de massagista...');

    const therapistData = {
      user_id: existingUser.id,
      full_name: 'Alex Santos - Teste',
      display_name: 'Alex Santos',
      headline: 'Massagista Profissional Certificado - Especialista em Deep Tissue',
      email: FAKE_USER_EMAIL,
      phone: '+1 (555) 123-4567',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      neighborhood: 'West Hollywood',
      address: '123 Wellness Street, Suite 456',
      zip_code: '90069',
      services_headline: 'Massagem Terapêutica, Relaxante e Desportiva',
      specialties_headline: 'Deep Tissue, Swedish, Sports Massage',
      promotions_headline: 'Primeira sessão com 20% de desconto!',
      massage_techniques: ['Deep Tissue', 'Swedish', 'Sports Massage', 'Trigger Point', 'Hot Stone'],
      rate_60: '$80',
      rate_90: '$110',
      rate_outcall: '$150',
      payment_methods: ['Dinheiro', 'Cartão', 'Venmo', 'Zelle'],
      rating: 4.8,
      override_reviews_count: 127,
      languages: ['Inglês', 'Espanhol', 'Português'],
      years_experience: 8,
      profile_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop'
      ],
      agree_terms: true,
      plan: 'premium',
      plan_name: 'Premium Plan',
      status: 'active',
      subscription_status: 'active',
      paid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: therapistProfile, error: therapistError } = await supabase
      .from('therapists')
      .upsert(therapistData, { onConflict: 'user_id' })
      .select()
      .single();

    if (therapistError) {
      console.error('❌ Erro ao atualizar perfil:', therapistError.message);
      console.error('Detalhes:', therapistError);
      throw therapistError;
    }

    console.log('✅ Perfil atualizado com sucesso!');

    // Resumo
    console.log('\n' + '='.repeat(60));
    console.log('✅ PERFIL ATUALIZADO COM SUCESSO!');
    console.log('='.repeat(60));
    console.log('');
    console.log('📧 Email: test@test.com');
    console.log('🔑 Senha: 123456');
    console.log('👤 Nome: Alex Santos - Teste');
    console.log('📍 Localização: Los Angeles, CA');
    console.log('⭐ Rating: 4.8 (127 avaliações)');
    console.log('💳 Plano: Premium (ativo por 30 dias)');
    console.log('');
    console.log('🔗 UUID:', existingUser.id);
    console.log('');
    console.log('🌐 Faça login com test@test.com / 123456');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Erro fatal:', error);
    process.exit(1);
  }
}

main();
