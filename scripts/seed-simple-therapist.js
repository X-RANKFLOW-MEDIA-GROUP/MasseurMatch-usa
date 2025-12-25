/**
 * Script SIMPLIFICADO para criar um perfil de massagista fake para testes
 * Insere apenas campos essenciais
 *
 * Usuário: test@test.com
 * Senha: 123456
 */

// Carregar variáveis de ambiente do .env.local manualmente
const fs = require('fs');
const path = require('path');

const envPaths = [
  path.join(__dirname, '..', '.env.local'),
  path.join(__dirname, '..', 'masseurmatch-nextjs', '.env.local')
];

for (const envPath of envPaths) {
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
    break;
  }
}

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY devem estar configurados no .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const FAKE_USER_EMAIL = 'test@test.com';
const FAKE_USER_PASSWORD = '123456';

async function main() {
  console.log('🚀 Iniciando criação do perfil de massagista fake (versão simplificada)...\n');

  try {
    // 1. Verificar se usuário existe e deletar
    console.log('📧 Verificando se o usuário já existe...');
    const { data: allUsers } = await supabase.auth.admin.listUsers();
    const existingUser = allUsers?.users?.find(u => u.email === FAKE_USER_EMAIL);

    if (existingUser) {
      console.log('⚠️  Usuário já existe. Deletando para recriar...');
      const { error: deleteError } = await supabase.auth.admin.deleteUser(existingUser.id);
      if (deleteError) {
        console.error('Erro ao deletar:', deleteError.message);
      }
      console.log('✅ Usuário antigo deletado');

      // Aguardar um pouco para garantir que foi deletado
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // 2. Criar usuário
    console.log('👤 Criando usuário de autenticação...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: FAKE_USER_EMAIL,
      password: FAKE_USER_PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: 'Alex Santos - Teste'
      }
    });

    if (authError) {
      console.error('❌ Erro ao criar usuário:', authError.message);
      throw authError;
    }

    console.log('✅ Usuário criado! ID:', authData.user.id);

    // 3. Criar perfil de massagista com campos mínimos
    console.log('💆 Criando perfil de massagista...');

    const therapistData = {
      user_id: authData.user.id,
      full_name: 'Alex Santos - Teste',
      display_name: 'Alex Santos',
      headline: 'Massagista Profissional Certificado',
      email: FAKE_USER_EMAIL,
      phone: '+1 (555) 123-4567',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      services_headline: 'Massagem Terapêutica e Relaxante',
      specialties_headline: 'Deep Tissue, Swedish, Sports Massage',
      rate_60: '$80',
      rate_90: '$110',
      rating: 4.8,
      profile_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
      agree_terms: true,
      plan: 'premium',
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
      console.error('❌ Erro ao criar perfil:', therapistError.message);
      console.error('Detalhes:', therapistError);
      throw therapistError;
    }

    console.log('✅ Perfil criado com sucesso!');

    // Resumo
    console.log('\n' + '='.repeat(60));
    console.log('✅ PERFIL FAKE CRIADO COM SUCESSO!');
    console.log('='.repeat(60));
    console.log('');
    console.log('📧 Email: test@test.com');
    console.log('🔑 Senha: 123456');
    console.log('👤 Nome: Alex Santos - Teste');
    console.log('📍 Localização: Los Angeles, CA');
    console.log('💳 Plano: Premium (ativo por 30 dias)');
    console.log('');
    console.log('🔗 UUID:', authData.user.id);
    console.log('');
    console.log('🌐 Faça login com test@test.com / 123456');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Erro fatal:', error);
    process.exit(1);
  }
}

main();
