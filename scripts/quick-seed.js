/**
 * Quick script to directly insert therapist profiles for existing auth users
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
  console.log('🚀 Quick seeding therapist profiles...\n');

  // Get any auth user to use as test data
  const { data, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    console.log('❌ Error listing users:', listError.message);
    return;
  }

  const users = data?.users || [];

  if (users.length === 0) {
    console.log('❌ No users found. Creating profiles without auth users...');
    console.log('💡 Using dummy UUIDs instead...');
  } else {
    console.log(`✅ Found ${users.length} users in auth.`);
  }

  //  Insert 5 test therapist profiles using first 5 users (or fewer if less than 5)
  const testProfiles = [
    {
      display_name: 'Alex Santos',
      city: 'Los Angeles',
      state: 'CA',
      zip_code: '90069',
      latitude: '34.0901',
      longitude: '-118.3756',
      phone: '+1 (555) 100-0001',
      profile_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
      services: 'Deep Tissue, Sports Massage, Swedish Massage',
    },
    {
      display_name: 'Maria Rodriguez',
      city: 'Los Angeles',
      state: 'CA',
      zip_code: '90401',
      latitude: '34.0195',
      longitude: '-118.4912',
      phone: '+1 (555) 100-0002',
      profile_photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop',
      services: 'Swedish Massage, Aromatherapy, Hot Stone',
    },
    {
      display_name: 'James Chen',
      city: 'Los Angeles',
      state: 'CA',
      zip_code: '90012',
      latitude: '34.0522',
      longitude: '-118.2437',
      phone: '+1 (555) 100-0003',
      profile_photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=500&fit=crop',
      services: 'Chinese Massage, Acupressure, Cupping',
    },
    {
      display_name: 'Sarah Williams',
      city: 'Los Angeles',
      state: 'CA',
      zip_code: '90210',
      latitude: '34.0736',
      longitude: '-118.4004',
      phone: '+1 (555) 100-0004',
      profile_photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop',
      services: 'Prenatal Massage, Swedish Massage',
    },
    {
      display_name: 'Michael Brown',
      city: 'Los Angeles',
      state: 'CA',
      zip_code: '90291',
      latitude: '33.9850',
      longitude: '-118.4695',
      phone: '+1 (555) 100-0005',
      profile_photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop',
      services: 'Sports Massage, Myofascial Release',
    }
  ];

  // Generate random UUIDs if needed
  const crypto = require('crypto');
  const generateUUID = () => crypto.randomUUID();

  const numToCreate = users.length > 0 ? Math.min(testProfiles.length, users.length) : testProfiles.length;

  for (let i = 0; i < numToCreate; i++) {
    const userId = users.length > 0 ? users[i].id : generateUUID();
    const profileData = testProfiles[i];

    const slug = profileData.display_name.toLowerCase().replace(/\s+/g, '-') + '-la';

    const therapistProfile = {
      user_id: userId,
      slug,
      display_name: profileData.display_name,
      latitude: profileData.latitude,
      longitude: profileData.longitude,
      services: profileData.services,
      profile_photo: profileData.profile_photo,
      zip_code: profileData.zip_code,
      phone: profileData.phone,
      city: profileData.city,
      state: profileData.state,
      status: 'active',
      created_at: new Date().toISOString()
    };

    console.log(`📝 Creating profile for ${profileData.display_name}...`);

    const { data, error } = await supabase
      .from('therapists')
      .upsert(therapistProfile, { onConflict: 'user_id' })
      .select();

    if (error) {
      console.error(`❌ Error: ${error.message}`);
    } else {
      console.log(`✅ Profile created: ${profileData.display_name}`);
      console.log(`   📍 ${profileData.city} at ${profileData.latitude}, ${profileData.longitude}`);
    }
  }

  console.log('\n✅ Done! Check /explore to see the map with therapists.');
}

main();
