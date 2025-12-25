/**
 * Diagnostic script to check therapist data
 */

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

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  console.log('🔍 Checking therapist data...\n');

  // Check therapists table
  const { data: therapists, error } = await supabase
    .from('therapists')
    .select('user_id, slug, display_name, city, state, latitude, longitude, status')
    .eq('status', 'active')
    .limit(20);

  if (error) {
    console.error('❌ Error fetching therapists:', error.message);
    return;
  }

  console.log(`✅ Found ${therapists.length} active therapists\n`);

  therapists.forEach((t, i) => {
    console.log(`${i + 1}. ${t.display_name || 'NO NAME'}`);
    console.log(`   Slug: ${t.slug || 'NO SLUG'}`);
    console.log(`   Location: ${t.city || 'NO CITY'}, ${t.state || 'NO STATE'}`);
    console.log(`   Coordinates: ${t.latitude || 'NO LAT'}, ${t.longitude || 'NO LNG'}`);
    console.log(`   Status: ${t.status}`);

    // Check if coordinates are valid
    const lat = parseFloat(t.latitude);
    const lng = parseFloat(t.longitude);
    const hasValidCoords = !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;

    if (!hasValidCoords) {
      console.log(`   ⚠️  WARNING: Invalid or missing coordinates!`);
    }
    console.log('');
  });

  // Count by city
  const cities = therapists.reduce((acc, t) => {
    const city = t.city || 'Unknown';
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});

  console.log('📊 Therapists by city:');
  Object.entries(cities).forEach(([city, count]) => {
    console.log(`   ${city}: ${count}`);
  });

  // Check for therapists without coordinates
  const withoutCoords = therapists.filter(t => {
    const lat = parseFloat(t.latitude);
    const lng = parseFloat(t.longitude);
    return isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0;
  });

  if (withoutCoords.length > 0) {
    console.log(`\n⚠️  ${withoutCoords.length} therapists missing valid coordinates:`);
    withoutCoords.forEach(t => {
      console.log(`   - ${t.display_name} (${t.slug})`);
    });
  }
}

main();
