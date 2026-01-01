import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) throw new Error("NEXT_PUBLIC_SUPABASE_URL is required");
if (!serviceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required");

const supabase = createClient(supabaseUrl, serviceRoleKey);

// APENAS PERFIS MASCULINOS - Otimizados para SEO
const maleTherapistSeeds = [
  {
    email: "marcus.silva@masseurmatch.com",
    password: "SecurePass123!",
    fullName: "Marcus Silva",
    displayName: "Marcus - Deep Tissue Specialist",
    slug: "marcus-silva-new-york",
    location: "New York, NY",
    city: "new-york",
    zipCode: "10001",
    plan: "elite",
    planName: "Elite",
    status: "Active",
    subStatus: "active",
    phone: "+1 (212) 555-0101",
    bio: "Certified massage therapist specializing in deep tissue, sports massage, and trigger point therapy. 10+ years experience working with athletes and professionals in NYC. LGBTQ+ friendly space.",
    services: ["Deep Tissue", "Sports Massage", "Swedish", "Trigger Point", "Stretching"],
    languages: ["English", "Portuguese"],
    certifications: ["LMT NY", "NCTMB", "Sports Massage Certified"],
    yearsExperience: 10,
    incall: true,
    outcall: true,
    mobileServiceRadius: 15,
    hourlyRate: 120,
  },
  {
    email: "alex.chen@masseurmatch.com",
    password: "SecurePass123!",
    fullName: "Alex Chen",
    displayName: "Alex - Relaxation & Wellness",
    slug: "alex-chen-san-francisco",
    location: "San Francisco, CA",
    city: "san-francisco",
    zipCode: "94102",
    plan: "pro",
    planName: "Pro",
    status: "Active",
    subStatus: "active",
    phone: "+1 (415) 555-0102",
    bio: "Holistic massage therapist offering Swedish, relaxation, and aromatherapy massage. Creating a safe, welcoming environment for all clients. Castro district studio.",
    services: ["Swedish", "Relaxation", "Aromatherapy", "Hot Stone", "Reflexology"],
    languages: ["English", "Mandarin"],
    certifications: ["LMT CA", "Certified Aromatherapist"],
    yearsExperience: 7,
    incall: true,
    outcall: true,
    mobileServiceRadius: 10,
    hourlyRate: 100,
  },
  {
    email: "david.martinez@masseurmatch.com",
    password: "SecurePass123!",
    fullName: "David Martinez",
    displayName: "David - Sports & Recovery",
    slug: "david-martinez-los-angeles",
    location: "Los Angeles, CA",
    city: "los-angeles",
    zipCode: "90028",
    plan: "elite",
    planName: "Elite",
    status: "Active",
    subStatus: "active",
    phone: "+1 (323) 555-0103",
    bio: "Former athletic trainer turned massage therapist. Specializing in sports recovery, injury rehab, and performance enhancement. West Hollywood studio - LGBTQ+ affirming practice.",
    services: ["Sports Massage", "Deep Tissue", "Injury Rehab", "Stretching", "Cupping"],
    languages: ["English", "Spanish"],
    certifications: ["LMT CA", "NASM-CPT", "Sports Medicine Certified"],
    yearsExperience: 12,
    incall: true,
    outcall: true,
    mobileServiceRadius: 20,
    hourlyRate: 140,
  },
  {
    email: "ryan.thompson@masseurmatch.com",
    password: "SecurePass123!",
    fullName: "Ryan Thompson",
    displayName: "Ryan - Therapeutic Touch",
    slug: "ryan-thompson-chicago",
    location: "Chicago, IL",
    city: "chicago",
    zipCode: "60657",
    plan: "pro",
    planName: "Pro",
    status: "Active",
    subStatus: "active",
    phone: "+1 (312) 555-0104",
    bio: "Certified in multiple modalities with focus on pain relief and stress reduction. Boystown location - friendly, professional environment for everyone.",
    services: ["Deep Tissue", "Swedish", "Myofascial Release", "Prenatal", "Chair Massage"],
    languages: ["English"],
    certifications: ["LMT IL", "NCTMB", "Myofascial Release Certified"],
    yearsExperience: 8,
    incall: true,
    outcall: false,
    mobileServiceRadius: 0,
    hourlyRate: 95,
  },
  {
    email: "miguel.rodriguez@masseurmatch.com",
    password: "SecurePass123!",
    fullName: "Miguel Rodriguez",
    displayName: "Miguel - Wellness Expert",
    slug: "miguel-rodriguez-miami",
    location: "Miami, FL",
    city: "miami",
    zipCode: "33139",
    plan: "elite",
    planName: "Elite",
    status: "Active",
    subStatus: "active",
    phone: "+1 (305) 555-0105",
    bio: "Miami Beach massage specialist. Combining traditional techniques with modern wellness practices. Bilingual services, LGBTQ+ friendly, South Beach studio.",
    services: ["Swedish", "Deep Tissue", "Lomi Lomi", "Hot Stone", "Sports Massage"],
    languages: ["English", "Spanish"],
    certifications: ["LMT FL", "Lomi Lomi Certified"],
    yearsExperience: 9,
    incall: true,
    outcall: true,
    mobileServiceRadius: 12,
    hourlyRate: 110,
  },
  {
    email: "james.wilson@masseurmatch.com",
    password: "SecurePass123!",
    fullName: "James Wilson",
    displayName: "James - Clinical Massage",
    slug: "james-wilson-seattle",
    location: "Seattle, WA",
    city: "seattle",
    zipCode: "98102",
    plan: "pro",
    planName: "Pro",
    status: "Active",
    subStatus: "active",
    phone: "+1 (206) 555-0106",
    bio: "Clinical massage therapist with background in physical therapy. Capitol Hill practice serving diverse community. Specializing in chronic pain management.",
    services: ["Clinical Massage", "Trigger Point", "Myofascial Release", "Deep Tissue"],
    languages: ["English"],
    certifications: ["LMT WA", "NCTMB", "Clinical Massage Certified"],
    yearsExperience: 11,
    incall: true,
    outcall: false,
    mobileServiceRadius: 0,
    hourlyRate: 115,
  },
  {
    email: "carlos.santos@masseurmatch.com",
    password: "SecurePass123!",
    fullName: "Carlos Santos",
    displayName: "Carlos - Relaxation Specialist",
    slug: "carlos-santos-austin",
    location: "Austin, TX",
    city: "austin",
    zipCode: "78701",
    plan: "standard",
    planName: "Standard",
    status: "Active",
    subStatus: "active",
    phone: "+1 (512) 555-0107",
    bio: "Swedish and relaxation massage expert. Creating peaceful, judgment-free space for all clients. Downtown Austin studio.",
    services: ["Swedish", "Relaxation", "Aromatherapy", "Reflexology"],
    languages: ["English", "Spanish", "Portuguese"],
    certifications: ["LMT TX"],
    yearsExperience: 5,
    incall: true,
    outcall: true,
    mobileServiceRadius: 8,
    hourlyRate: 85,
  },
  {
    email: "ethan.brown@masseurmatch.com",
    password: "SecurePass123!",
    fullName: "Ethan Brown",
    displayName: "Ethan - Athletic Performance",
    slug: "ethan-brown-boston",
    location: "Boston, MA",
    city: "boston",
    zipCode: "02115",
    plan: "pro",
    planName: "Pro",
    status: "Active",
    subStatus: "active",
    phone: "+1 (617) 555-0108",
    bio: "Sports massage therapist working with runners, cyclists, and athletes. Back Bay studio. LGBTQ+ welcoming practice.",
    services: ["Sports Massage", "Deep Tissue", "Stretching", "Recovery Massage"],
    languages: ["English"],
    certifications: ["LMT MA", "Sports Massage Certified"],
    yearsExperience: 6,
    incall: true,
    outcall: true,
    mobileServiceRadius: 10,
    hourlyRate: 105,
  },
  {
    email: "andre.jackson@masseurmatch.com",
    password: "SecurePass123!",
    fullName: "Andre Jackson",
    displayName: "Andre - Therapeutic Bodywork",
    slug: "andre-jackson-atlanta",
    location: "Atlanta, GA",
    city: "atlanta",
    zipCode: "30308",
    plan: "elite",
    planName: "Elite",
    status: "Active",
    subStatus: "active",
    phone: "+1 (404) 555-0109",
    bio: "Integrative bodywork specialist. Midtown Atlanta studio offering inclusive, affirming care. Deep tissue and therapeutic focus.",
    services: ["Deep Tissue", "Integrative Bodywork", "Cupping", "Sports Massage"],
    languages: ["English"],
    certifications: ["LMT GA", "NCTMB", "Cupping Certified"],
    yearsExperience: 9,
    incall: true,
    outcall: true,
    mobileServiceRadius: 15,
    hourlyRate: 120,
  },
  {
    email: "noah.garcia@masseurmatch.com",
    password: "SecurePass123!",
    fullName: "Noah Garcia",
    displayName: "Noah - Wellness & Recovery",
    slug: "noah-garcia-denver",
    location: "Denver, CO",
    city: "denver",
    zipCode: "80202",
    plan: "pro",
    planName: "Pro",
    status: "Active",
    subStatus: "active",
    phone: "+1 (303) 555-0110",
    bio: "Holistic massage therapist combining Swedish, deep tissue, and energy work. Capitol Hill studio - safe space for all.",
    services: ["Swedish", "Deep Tissue", "Energy Work", "Hot Stone", "Aromatherapy"],
    languages: ["English", "Spanish"],
    certifications: ["LMT CO", "Reiki Master"],
    yearsExperience: 7,
    incall: true,
    outcall: true,
    mobileServiceRadius: 12,
    hourlyRate: 100,
  },
];

async function seedMaleTherapists() {
  console.log("🚀 Starting male therapist seed (SEO optimized)...\n");
  let success = 0;
  let failed = 0;

  for (const therapist of maleTherapistSeeds) {
    try {
      // Create auth user
      const { data: userData, error: authError } = await supabase.auth.admin.createUser({
        email: therapist.email,
        password: therapist.password,
        email_confirm: true,
      });

      if (authError) {
        console.error(`❌ Failed to create auth user for ${therapist.email}:`, authError.message);
        failed++;
        continue;
      }

      const userId = userData.user?.id;
      if (!userId) {
        console.error(`❌ No user ID for ${therapist.email}`);
        failed++;
        continue;
      }

      // Create therapist profile
      const { error: profileError } = await supabase.from("therapists").upsert({
        user_id: userId,
        email: therapist.email,
        full_name: therapist.fullName,
        display_name: therapist.displayName,
        slug: therapist.slug,
        location: therapist.location,
        city: therapist.city,
        zip_code: therapist.zipCode,
        plan: therapist.plan,
        plan_name: therapist.planName,
        status: therapist.status,
        subscription_status: therapist.subStatus,
        phone: therapist.phone,
        bio: therapist.bio,
        services: therapist.services,
        languages: therapist.languages,
        certifications: therapist.certifications,
        years_experience: therapist.yearsExperience,
        incall: therapist.incall,
        outcall: therapist.outcall,
        mobile_service_radius: therapist.mobileServiceRadius,
        hourly_rate: therapist.hourlyRate,
        // SEO fields
        seo_title: `${therapist.fullName} - ${therapist.location} Male Massage Therapist`,
        seo_description: therapist.bio.substring(0, 155),
        // Availability (exemplo - todos disponíveis)
        availability: {
          monday: { incall: { start: "09:00", end: "21:00" }, outcall: { start: "10:00", end: "20:00" } },
          tuesday: { incall: { start: "09:00", end: "21:00" }, outcall: { start: "10:00", end: "20:00" } },
          wednesday: { incall: { start: "09:00", end: "21:00" }, outcall: { start: "10:00", end: "20:00" } },
          thursday: { incall: { start: "09:00", end: "21:00" }, outcall: { start: "10:00", end: "20:00" } },
          friday: { incall: { start: "09:00", end: "21:00" }, outcall: { start: "10:00", end: "20:00" } },
          saturday: { incall: { start: "10:00", end: "18:00" }, outcall: { start: "11:00", end: "17:00" } },
          sunday: { incall: { start: "10:00", end: "18:00" }, outcall: { start: "", end: "" } },
        },
      });

      if (profileError) {
        console.error(`❌ Failed to create profile for ${therapist.email}:`, profileError.message);
        failed++;
        continue;
      }

      console.log(`✅ Seeded: ${therapist.fullName} (${therapist.location})`);
      success++;
    } catch (error) {
      console.error(`❌ Error seeding ${therapist.email}:`, error);
      failed++;
    }
  }

  console.log(`\n📊 Seed complete:`);
  console.log(`   ✅ Success: ${success}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📝 Total: ${maleTherapistSeeds.length}`);
}

seedMaleTherapists()
  .then(() => {
    console.log("\n🎉 Male therapist seed completed!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n💥 Seed failed:", err);
    process.exit(1);
  });
