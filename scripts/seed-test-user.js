// Test Login Credentials Seeder
// Run with: node scripts/seed-test-user.js

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const testUserPassword = process.env.SEED_TEST_USER_PASSWORD;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

if (!testUserPassword) {
  console.error("Missing SEED_TEST_USER_PASSWORD in environment");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const TEST_USER = {
  email: "test@masseurmatch.com",
  password: testUserPassword,
  display_name: "Test Therapist",
  headline: "Licensed Massage Therapist - 5 Years Experience",
  about: "This is a test account for development purposes. I specialize in deep tissue and Swedish massage techniques.",
  city: "Los Angeles",
  state: "CA",
  phone: "+1 (555) 123-4567",
  services: ["Swedish Massage", "Deep Tissue", "Sports Massage"],
  rate_60: "120",
  rate_90: "160",
  years_experience: 5,
  languages: ["English", "Spanish"],
  incall_available: true,
  outcall_available: true,
  status: "active",
};

async function seedTestUser() {
  console.log("🌱 Seeding test user...\n");

  try {
    // Check if user already exists
    const { data: existingUsers } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("email", TEST_USER.email)
      .limit(1);

    if (existingUsers && existingUsers.length > 0) {
      console.log("✅ Test user already exists!\n");
      printCredentials();
      return;
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: TEST_USER.email,
      password: TEST_USER.password,
      email_confirm: true,
    });

    if (authError) {
      if (authError.message.includes("already been registered")) {
        console.log("✅ Auth user already exists, checking profile...\n");
      } else {
        throw authError;
      }
    }

    const userId = authData?.user?.id;

    if (userId) {
      // Create profile
      const { error: profileError } = await supabase.from("profiles").upsert({
        user_id: userId,
        email: TEST_USER.email,
        display_name: TEST_USER.display_name,
        headline: TEST_USER.headline,
        about: TEST_USER.about,
        city: TEST_USER.city,
        state: TEST_USER.state,
        phone: TEST_USER.phone,
        services: TEST_USER.services,
        rate_60: TEST_USER.rate_60,
        rate_90: TEST_USER.rate_90,
        years_experience: TEST_USER.years_experience,
        languages: TEST_USER.languages,
        incall_available: TEST_USER.incall_available,
        outcall_available: TEST_USER.outcall_available,
        status: TEST_USER.status,
      });

      if (profileError) {
        console.error("Profile error:", profileError);
      }

      // Create therapist listing
      const slug = TEST_USER.display_name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      const { error: therapistError } = await supabase.from("therapists").upsert({
        user_id: userId,
        slug: slug,
        display_name: TEST_USER.display_name,
        headline: TEST_USER.headline,
        about: TEST_USER.about,
        city: TEST_USER.city,
        state: TEST_USER.state,
        phone: TEST_USER.phone,
        services: TEST_USER.services,
        rate_60: TEST_USER.rate_60,
        rate_90: TEST_USER.rate_90,
        years_experience: TEST_USER.years_experience,
        languages: TEST_USER.languages,
        incall_available: TEST_USER.incall_available,
        outcall_available: TEST_USER.outcall_available,
        status: TEST_USER.status,
        rating: 4.8,
        identity_verified: true,
        available_now: true,
      });

      if (therapistError) {
        console.error("Therapist error:", therapistError);
      }

      console.log("✅ Test user created successfully!\n");
    }

    printCredentials();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

function printCredentials() {
  console.log("═══════════════════════════════════════════");
  console.log("        TEST LOGIN CREDENTIALS");
  console.log("═══════════════════════════════════════════");
  console.log("");
  console.log(`  Email:    ${TEST_USER.email}`);
  console.log(`  Password: ${TEST_USER.password}`);
  console.log("");
  console.log("═══════════════════════════════════════════");
  console.log("");
  console.log("Login at: http://localhost:3000/login");
  console.log("");
}

seedTestUser();
