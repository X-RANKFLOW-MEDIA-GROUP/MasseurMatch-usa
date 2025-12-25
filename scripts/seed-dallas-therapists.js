/**
 * Create 10 fake therapist profiles in Dallas area for map testing
 * Run: node scripts/seed-dallas-therapists.js
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Load environment variables
const envPaths = [
  path.join(__dirname, '..', '.env.local'),
  path.join(__dirname, '..', 'masseurmatch-nextjs', '.env.local')
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    console.log(`📄 Loading env from: ${envPath}`);
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

const dallasTherapists = [
  {
    display_name: 'Carlos Martinez',
    neighborhood: 'Downtown Dallas',
    zip_code: '75219',
    latitude: '32.7767',
    longitude: '-96.7970',
    phone: '+1 (214) 555-0001',
    profile_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
    services: 'Deep Tissue, Sports Massage, Trigger Point Therapy',
  },
  {
    display_name: 'Jessica Thompson',
    neighborhood: 'Uptown Dallas',
    zip_code: '75201',
    latitude: '32.8029',
    longitude: '-96.8007',
    phone: '+1 (214) 555-0002',
    profile_photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop',
    services: 'Swedish Massage, Aromatherapy, Hot Stone, Prenatal',
  },
  {
    display_name: 'David Kim',
    neighborhood: 'Highland Park',
    zip_code: '75205',
    latitude: '32.8343',
    longitude: '-96.7856',
    phone: '+1 (214) 555-0003',
    profile_photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=500&fit=crop',
    services: 'Shiatsu, Acupressure, Thai Massage, Energy Work',
  },
  {
    display_name: 'Rachel Anderson',
    neighborhood: 'Oak Lawn',
    zip_code: '75219',
    latitude: '32.8079',
    longitude: '-96.8089',
    phone: '+1 (214) 555-0004',
    profile_photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop',
    services: 'Lymphatic Drainage, Reflexology, Swedish Massage',
  },
  {
    display_name: 'Marcus Washington',
    neighborhood: 'Deep Ellum',
    zip_code: '75226',
    latitude: '32.7837',
    longitude: '-96.7784',
    phone: '+1 (214) 555-0005',
    profile_photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop',
    services: 'Sports Massage, Deep Tissue, Myofascial Release, Stretching',
  },
  {
    display_name: 'Sophia Rodriguez',
    neighborhood: 'Bishop Arts District',
    zip_code: '75208',
    latitude: '32.7496',
    longitude: '-96.8217',
    phone: '+1 (214) 555-0006',
    profile_photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=500&fit=crop',
    services: 'Prenatal Massage, Postnatal, Swedish, Aromatherapy',
  },
  {
    display_name: 'James Patterson',
    neighborhood: 'Knox-Henderson',
    zip_code: '75206',
    latitude: '32.8156',
    longitude: '-96.7894',
    phone: '+1 (214) 555-0007',
    profile_photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&h=500&fit=crop',
    services: 'Deep Tissue, Cupping, Sports Recovery, Trigger Point',
  },
  {
    display_name: 'Emily Chen',
    neighborhood: 'Lakewood',
    zip_code: '75214',
    latitude: '32.8198',
    longitude: '-96.7567',
    phone: '+1 (214) 555-0008',
    profile_photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&h=500&fit=crop',
    services: 'Traditional Chinese Massage, Tui Na, Acupressure, Gua Sha',
  },
  {
    display_name: 'Tyler Brooks',
    neighborhood: 'Lower Greenville',
    zip_code: '75206',
    latitude: '32.8234',
    longitude: '-96.7712',
    phone: '+1 (214) 555-0009',
    profile_photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&h=500&fit=crop',
    services: 'Sports Massage, Athletic Recovery, Stretching, Deep Tissue',
  },
  {
    display_name: 'Olivia Martinez',
    neighborhood: 'Design District',
    zip_code: '75207',
    latitude: '32.8056',
    longitude: '-96.8356',
    phone: '+1 (214) 555-0010',
    profile_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop',
    services: 'Swedish Massage, Hot Stone, Aromatherapy, Relaxation',
  }
];

async function main() {
  console.log('🚀 Creating 10 Dallas therapist profiles for map testing...\n');
  console.log('📍 Location: Dallas, TX\n');

  let successCount = 0;
  let errorCount = 0;

  for (const therapistData of dallasTherapists) {
    const userId = crypto.randomUUID();
    const slug = therapistData.display_name.toLowerCase().replace(/\s+/g, '-') + '-dallas';

    const therapistProfile = {
      user_id: userId,
      slug,
      display_name: therapistData.display_name,
      latitude: therapistData.latitude,
      longitude: therapistData.longitude,
      services: therapistData.services,
      profile_photo: therapistData.profile_photo,
      zip_code: therapistData.zip_code,
      phone: therapistData.phone,
      city: 'Dallas',
      state: 'TX',
      status: 'active',
      created_at: new Date().toISOString()
    };

    console.log(`📝 Inserting: ${therapistData.display_name} (${therapistData.neighborhood})...`);

    const { data, error } = await supabase
      .from('therapists')
      .insert(therapistProfile)
      .select();

    if (error) {
      console.error(`   ❌ Error: ${error.message}`);
      errorCount++;
    } else {
      console.log(`   ✅ Created successfully`);
      console.log(`   📍 ${therapistData.neighborhood} - ZIP ${therapistData.zip_code}`);
      console.log(`   🗺️  Coords: (${therapistData.latitude}, ${therapistData.longitude})`);
      successCount++;
    }
    console.log('');
  }

  console.log('='.repeat(60));
  console.log(`✅ Success: ${successCount} profiles created`);
  if (errorCount > 0) {
    console.log(`❌ Errors: ${errorCount} profiles failed`);
    console.log('');
    console.log('💡 If you got permission errors, run the SQL script instead:');
    console.log('   1. Open Supabase SQL Editor');
    console.log('   2. Copy & paste: scripts/insert-dallas-therapists.sql');
  }
  console.log('='.repeat(60));
  console.log('');
  console.log('🗺️  Visit /explore to see the Dallas therapists on the map!');
}

main();
