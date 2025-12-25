/**
 * Create Test Account Script
 *
 * This script creates a test therapist account in the database
 * Run with: node scripts/create-test-account.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local file manually
const envPath = path.join(__dirname, '../masseurmatch-nextjs/.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
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

// Test account credentials
const TEST_ACCOUNT = {
  email: 'test.therapist@masseurmatch.com',
  password: 'TestPass123!',
  fullName: 'Test Therapist',
  displayName: 'Sarah Test',
  phone: '(555) 123-4567',
  location: 'Los Angeles',
  languages: ['English', 'Spanish'],
  services: ['Swedish Massage', 'Deep Tissue'],
  plan: 'free',
  planName: 'Free',
  priceMonthly: 0,
};

async function createTestAccount() {
  console.log('🔧 Creating test account...\n');

  // Create Supabase admin client
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  try {
    // 1. Create auth user
    console.log('1️⃣  Creating auth user...');
    let userId;

    const { data: signData, error: signErr } = await supabaseAdmin.auth.admin.createUser({
      email: TEST_ACCOUNT.email,
      password: TEST_ACCOUNT.password,
      email_confirm: true,
    });

    if (signErr) {
      if (signErr.message?.toLowerCase().includes('already registered') ||
          signErr.message?.toLowerCase().includes('already exists')) {
        console.log('⚠️  User already exists, fetching existing user...');

        const { data: userData, error: userErr } = await supabaseAdmin.auth.admin.getUserByEmail(TEST_ACCOUNT.email);

        if (userErr) {
          throw new Error(`Failed to get existing user: ${userErr.message}`);
        }

        userId = userData.user.id;
        console.log(`✅ Found existing user: ${userId}\n`);
      } else {
        throw new Error(`Failed to create user: ${signErr.message}`);
      }
    } else {
      userId = signData.user.id;
      console.log(`✅ Created new user: ${userId}\n`);
    }

    // 2. Create/update therapist profile
    console.log('2️⃣  Creating therapist profile...');

    const therapistPayload = {
      user_id: userId,
      full_name: TEST_ACCOUNT.fullName,
      display_name: TEST_ACCOUNT.displayName,
      email: TEST_ACCOUNT.email,
      phone: TEST_ACCOUNT.phone,
      city: TEST_ACCOUNT.location,
      languages: TEST_ACCOUNT.languages,
      services: TEST_ACCOUNT.services,
      agree_terms: true,
      plan: TEST_ACCOUNT.plan,
      plan_name: TEST_ACCOUNT.planName,
      price_monthly: TEST_ACCOUNT.priceMonthly,
      status: 'pending',
      updated_at: new Date().toISOString(),
    };

    const { error: therapistErr } = await supabaseAdmin
      .from('therapists')
      .upsert(therapistPayload, { onConflict: 'user_id' });

    if (therapistErr) {
      throw new Error(`Failed to create therapist profile: ${therapistErr.message}`);
    }

    console.log('✅ Therapist profile created/updated\n');

    // 3. Success!
    console.log('🎉 Test account created successfully!\n');
    console.log('═══════════════════════════════════════');
    console.log('📧 Email:    test.therapist@masseurmatch.com');
    console.log('🔑 Password: TestPass123!');
    console.log('👤 User ID:  ' + userId);
    console.log('═══════════════════════════════════════\n');
    console.log('You can now use these credentials to test the app!\n');

  } catch (error) {
    console.error('❌ Error creating test account:', error.message);
    process.exit(1);
  }
}

// Run the script
createTestAccount();
