const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Try to read from .env.local file
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
      const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
      if (urlMatch) supabaseUrl = urlMatch[1].trim();
      if (keyMatch) supabaseKey = keyMatch[1].trim();
    }
  } catch (error) {
    // Ignore file read errors
  }
}

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Supabase credentials not configured');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBrunoProfile() {
  console.log('🔍 Searching for Bruno Santos profile...\n');

  try {
    // Search by name
    const { data: byName, error: nameError } = await supabase
      .from('profiles')
      .select('*')
      .ilike('display_name', '%bruno%santos%');

    if (nameError) {
      console.log('⚠️  Error searching by name:', nameError.message);
    }

    if (byName && byName.length > 0) {
      console.log('✅ FOUND profiles with name "Bruno Santos":');
      console.log('─────────────────────────────────────────');
      byName.forEach((profile, index) => {
        console.log(`\nProfile ${index + 1}:`);
        console.log(`  Name: ${profile.display_name || profile.full_name || 'N/A'}`);
        console.log(`  User ID: ${profile.user_id}`);
        console.log(`  Phone: ${profile.phone || 'N/A'}`);
        console.log(`  City: ${profile.city || 'N/A'}, ${profile.state || 'N/A'}`);
        console.log(`  Slug: ${profile.slug || 'N/A'}`);
        console.log(`  Email: ${profile.email || 'N/A'}`);
      });
      console.log('─────────────────────────────────────────\n');
    }

    // Search by phone
    const { data: byPhone, error: phoneError } = await supabase
      .from('profiles')
      .select('*')
      .or('phone.eq.762-334-5300,phone.eq.7623345300,phone.eq.(762) 334-5300,phone.ilike.%7623345300%');

    if (phoneError) {
      console.log('⚠️  Error searching by phone:', phoneError.message);
    }

    if (byPhone && byPhone.length > 0) {
      console.log('✅ FOUND profiles with phone 762-334-5300:');
      console.log('─────────────────────────────────────────');
      byPhone.forEach((profile, index) => {
        console.log(`\nProfile ${index + 1}:`);
        console.log(`  Name: ${profile.display_name || profile.full_name}`);
        console.log(`  Phone: ${profile.phone}`);
        console.log(`  City: ${profile.city}, ${profile.state}`);
        console.log(`  Slug: ${profile.slug || 'N/A'}`);
      });
      console.log('─────────────────────────────────────────\n');
    }

    // Search in Dallas or Rio
    const { data: inCities } = await supabase
      .from('profiles')
      .select('display_name, city, state, phone')
      .or('city.eq.Dallas,city.ilike.%rio%');

    if (inCities && inCities.length > 0) {
      console.log(`📍 Therapists in Dallas/Rio: ${inCities.length} found`);
    }

    // Final result
    if ((!byName || byName.length === 0) && (!byPhone || byPhone.length === 0)) {
      console.log('\n❌ NO PROFILE FOUND for Bruno Santos');
      console.log('   Name: Bruno Santos');
      console.log('   Phone: 762-334-5300');
      console.log('   Status: ⚠️  PROFILE NEEDS TO BE CREATED\n');
      return false;
    }

    return true;

  } catch (error) {
    console.error('❌ Error checking profile:', error.message);
    return false;
  }
}

checkBrunoProfile()
  .then(found => {
    if (found) {
      console.log('✅ Profile exists in database');
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
