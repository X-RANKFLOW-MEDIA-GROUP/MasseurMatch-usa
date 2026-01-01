/**
 * Script para criar um perfil de massagista fake para testes
 *
 * Usuário: test@test.com
 * Senha: 123456
 *
 * Uso:
 *   node scripts/seed-fake-therapist.js
 *
 * Requer: Variáveis de ambiente configuradas no .env.local
 */

const { getSupabaseClient } = require("./lib/supabase-client");

let supabase;
try {
  supabase = getSupabaseClient();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

// Dados do usuário fake
const FAKE_USER_EMAIL = "test@test.com";
// eslint-disable-next-line sonarjs/no-hardcoded-passwords
const FAKE_USER_PASSWORD = "123456";
const FAKE_USER_ID = "a0000000-0000-0000-0000-000000000001";

// Dados do perfil de massagista
const therapistData = {
  user_id: FAKE_USER_ID,
  full_name: "Alex Santos - Teste",
  display_name: "Alex Santos",
  headline: "Massagista Profissional Certificado - Especialista em Deep Tissue",
  about:
    "Olá! Sou Alex Santos, massagista certificado com mais de 8 anos de experiência ajudando clientes a alcançarem relaxamento profundo e alívio de tensões musculares. Minha abordagem combina técnicas tradicionais com métodos modernos para proporcionar uma experiência única e terapêutica.",
  philosophy:
    "Acredito que a massagem é uma arte de cura que vai além do físico, alcançando o bem-estar mental e emocional. Cada sessão é personalizada para atender às necessidades específicas de cada cliente, criando um ambiente seguro e acolhedor.",
  email: FAKE_USER_EMAIL,
  phone: "+1 (555) 123-4567",
  city: "Los Angeles",
  state: "CA",
  country: "USA",
  neighborhood: "West Hollywood",
  address: "123 Wellness Street, Suite 456",
  zip_code: "90069",
  nearest_intersection: "Santa Monica Blvd & La Cienega",
  latitude: "34.0901",
  longitude: "-118.3756",
  mobile_service_radius: 15,
  services_headline: "Massagem Terapêutica, Relaxante e Desportiva",
  specialties_headline: "Deep Tissue, Swedish, Sports Massage, Trigger Point",
  promotions_headline: "Primeira sessão com 20% de desconto!",
  services: [
    "Massagem Terapêutica",
    "Massagem Relaxante",
    "Massagem Desportiva",
    "Deep Tissue",
    "Swedish Massage",
  ],
  massage_techniques: [
    "Deep Tissue",
    "Swedish",
    "Sports Massage",
    "Trigger Point Therapy",
    "Myofascial Release",
    "Hot Stone",
    "Aromatherapy",
  ],
  studio_amenities: [
    "Ambiente climatizado",
    "Música relaxante",
    "Aromaterapia",
    "Chuveiro disponível",
    "Estacionamento gratuito",
    "Toalhas limpas fornecidas",
  ],
  mobile_extras: [
    "Mesa portátil profissional",
    "Óleos premium",
    "Música ambiente",
    "Toalhas aquecidas",
  ],
  additional_services: [
    "Reflexologia",
    "Esfoliação corporal",
    "Terapia com pedras quentes",
  ],
  products_used:
    "Óleos essenciais orgânicos, Óleos de massagem premium sem fragrância",
  rate_60: "$80",
  rate_90: "$110",
  rate_outcall: "$150 (+ taxa de deslocamento)",
  payment_methods: [
    "Dinheiro",
    "Cartão de crédito",
    "Cartão de débito",
    "Venmo",
    "Zelle",
    "PayPal",
  ],
  regular_discounts: "Pacote de 5 sessões com 15% de desconto",
  day_of_week_discount: "Segundas-feiras: 10% off",
  weekly_specials: "Happy Hour (14h-16h): $70/hora",
  special_discount_groups: ["Estudantes", "Idosos", "Profissionais de saúde"],
  availability: {
    monday: { available: true, hours: "9:00 AM - 8:00 PM" },
    tuesday: { available: true, hours: "9:00 AM - 8:00 PM" },
    wednesday: { available: true, hours: "9:00 AM - 8:00 PM" },
    thursday: { available: true, hours: "9:00 AM - 8:00 PM" },
    friday: { available: true, hours: "9:00 AM - 6:00 PM" },
    saturday: { available: true, hours: "10:00 AM - 4:00 PM" },
    sunday: { available: false, hours: "Closed" },
  },
  degrees:
    "Certificação em Massoterapia pelo Pacific College of Health and Science (2016)",
  affiliations: [
    "AMTA - American Massage Therapy Association",
    "NCBTMB - National Certification Board",
  ],
  massage_start_date: "2016-03-15",
  languages: ["Inglês", "Espanhol", "Português"],
  business_trips: ["Las Vegas, NV", "San Diego, CA", "San Francisco, CA"],
  rating: 4.8,
  override_reviews_count: 127,
  website: "https://alexsantosmassage.com",
  instagram: "@alexsantosmassage",
  whatsapp: "+15551234567",
  birthdate: "1990-05-15",
  years_experience: 8,
  profile_photo:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
  gallery: [
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&h=600&fit=crop",
  ],
  agree_terms: true,
  plan: "premium",
  plan_name: "Premium Plan",
  price_monthly: 49.99,
  status: "active",
  paid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  subscription_status: "active",
  stripe_current_period_end: new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000
  ).toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Reviews fake
const fakeReviews = [
  {
    reviewer_name: "Maria Silva",
    rating: 5,
    comment:
      "Experiência incrível! Alex tem mãos mágicas e realmente entende de técnicas de massagem profunda. Saí me sentindo renovada!",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    reviewer_name: "John Williams",
    rating: 5,
    comment:
      "Best massage I've had in LA! Very professional, clean studio, and Alex really knows how to work out those knots. Highly recommend!",
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    reviewer_name: "Carlos Rodriguez",
    rating: 4,
    comment:
      "Muito bom! Atendimento excelente e ambiente super relaxante. A única coisa é que gostaria que as sessões fossem um pouco mais longas.",
    date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    reviewer_name: "Sarah Johnson",
    rating: 5,
    comment:
      "Alex is amazing! I have chronic back pain and after just 3 sessions I'm feeling so much better. The hot stone add-on is worth it!",
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    reviewer_name: "Pedro Mendes",
    rating: 5,
    comment:
      "Profissional top! Explica tudo antes de começar, respeita os limites e realmente se preocupa com o bem-estar do cliente.",
    date: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

async function main() {
  console.log("🚀 Iniciando criação do perfil de massagista fake...\n");

  try {
    // 1. Verificar se o usuário já existe
    console.log("📧 Verificando se o usuário já existe...");
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const userExists = existingUser?.users?.some(
      (u) => u.email === FAKE_USER_EMAIL
    );

    if (userExists) {
      console.log("⚠️  Usuário já existe. Deletando para recriar...");

      // Buscar o ID do usuário existente
      const existingUserId = existingUser.users.find(
        (u) => u.email === FAKE_USER_EMAIL
      )?.id;

      if (existingUserId) {
        await supabase.auth.admin.deleteUser(existingUserId);
        console.log("✅ Usuário antigo deletado com sucesso");
      }
    }

    // 2. Criar usuário no Supabase Auth
    console.log("👤 Criando usuário de autenticação...");
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: FAKE_USER_EMAIL,
        password: FAKE_USER_PASSWORD,
        email_confirm: true,
        user_metadata: {
          full_name: therapistData.full_name,
        },
      });

    if (authError) {
      console.error("❌ Erro ao criar usuário:", authError.message);
      throw authError;
    }

    console.log("✅ Usuário criado com sucesso! ID:", authData.user.id);

    // Atualizar o user_id nos dados do terapeuta com o ID real gerado
    therapistData.user_id = authData.user.id;

    // 3. Criar perfil de massagista
    console.log("💆 Criando perfil de massagista...");
    const { error: therapistError } = await supabase
      .from("therapists")
      .upsert(therapistData, { onConflict: "user_id" })
      .select()
      .single();

    if (therapistError) {
      console.error(
        "❌ Erro ao criar perfil de massagista:",
        therapistError.message
      );
      throw therapistError;
    }

    console.log("✅ Perfil de massagista criado com sucesso!");

    // 4. Adicionar reviews fake (se a tabela existir)
    console.log("⭐ Adicionando avaliações fake...");
    const reviewsWithTherapistId = fakeReviews.map((review) => ({
      ...review,
      therapist_id: authData.user.id,
    }));

    const { error: reviewsError } = await supabase
      .from("reviews")
      .insert(reviewsWithTherapistId);

    if (reviewsError) {
      console.warn(
        "⚠️  Aviso ao criar reviews (tabela pode não existir):",
        reviewsError.message
      );
    } else {
      console.log("✅ Avaliações criadas com sucesso!");
    }

    // Resumo final
    console.log("\n" + "=".repeat(60));
    console.log("✅ PERFIL DE MASSAGISTA FAKE CRIADO COM SUCESSO!");
    console.log("=".repeat(60));
    console.log("");
    console.log("📧 Email: test@test.com");
    console.log("🔑 Senha: 123456");
    console.log("👤 Nome: Alex Santos - Teste");
    console.log("📍 Localização: Los Angeles, CA");
    console.log("⭐ Rating: 4.8 (127 avaliações)");
    console.log("💳 Plano: Premium (ativo por 30 dias)");
    console.log("");
    console.log("🔗 UUID do usuário:", authData.user.id);
    console.log("");
    console.log("🌐 Você pode fazer login com test@test.com / 123456");
    console.log("=".repeat(60));
  } catch (error) {
    console.error("\n❌ Erro fatal:", error);
    process.exit(1);
  }
}

// Executar script
main();
