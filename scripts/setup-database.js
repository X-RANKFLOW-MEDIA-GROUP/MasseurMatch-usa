/**
 * Database Setup Script
 *
 * Applies the onboarding schema to Supabase
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '../masseurmatch-nextjs/.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#][^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim();
    env[key] = value;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

console.log('\n🔗 Connecting to Supabase...');
console.log(`URL: ${supabaseUrl}\n`);

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkTable(tableName) {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .limit(0);

  return !error;
}

async function main() {
  console.log('📋 Checking existing tables...\n');

  const tables = [
    'profiles',
    'users',
    'subscriptions',
    'media_assets',
    'profile_rates',
    'profile_hours'
  ];

  const status = {};

  for (const table of tables) {
    const exists = await checkTable(table);
    status[table] = exists;
    console.log(`  ${exists ? '✅' : '❌'} ${table}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n📖 To apply the schema:');
  console.log('\n1. Open Supabase Dashboard SQL Editor:');
  console.log(`   https://app.supabase.com/project/${supabaseUrl.match(/https:\/\/(.+?)\.supabase\.co/)[1]}/sql/new`);
  console.log('\n2. Copy and paste this file:');
  console.log(`   ${path.join(__dirname, '../sql/onboarding_schema.sql')}`);
  console.log('\n3. Click "Run" to execute\n');

  // Check if we can query profiles for structure
  if (status.profiles) {
    console.log('📊 Checking profiles table structure...\n');
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (data && data[0]) {
      const columns = Object.keys(data[0]);
      console.log('Existing columns:', columns.join(', '));

      // Check for onboarding columns
      const onboardingColumns = ['auto_moderation', 'admin_status', 'publication_status', 'onboarding_stage'];
      const hasOnboarding = onboardingColumns.some(col => columns.includes(col));

      if (hasOnboarding) {
        console.log('\n✅ Onboarding schema appears to be already applied!');
      } else {
        console.log('\n⚠️  Onboarding columns not found. Schema needs to be applied.');
      }
    }
  }
}

main().catch(console.error);
