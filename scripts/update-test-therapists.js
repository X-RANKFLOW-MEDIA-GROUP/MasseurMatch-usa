/**
 * Script to update existing test users with therapist profiles
 */

const fs = require('fs');
const path = require('path');

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

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const testEmails = [
  'alex.santos@maptest.com',
  'maria.rodriguez@maptest.com',
  'james.chen@maptest.com',
  'sarah.williams@maptest.com',
  'michael.brown@maptest.com'
];

const therapistData = {
  'alex.santos@maptest.com': {
    display_name: 'Alex Santos',
    city: 'Los Angeles',
    state: 'CA',
    zip_code: '90069',
    latitude: '34.0901',
    longitude: '-118.3756',
    phone: '+1 (555) 100-0001',
    profile_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
    services: 'Deep Tissue, Sports Massage, Swedish Massage, Trigger Point',
  },
  'maria.rodriguez@maptest.com': {
    display_name: 'Maria Rodriguez',
    city: 'Los Angeles',
    state: 'CA',
    zip_code: '90401',
    latitude: '34.0195',
    longitude: '-118.4912',
    phone: '+1 (555) 100-0002',
    profile_photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop',
    services: 'Swedish Massage, Aromatherapy, Hot Stone, Reflexology',
  },
  'james.chen@maptest.com': {
    display_name: 'James Chen',
    city: 'Los Angeles',
    state: 'CA',
    zip_code: '90012',
    latitude: '34.0522',
    longitude: '-118.2437',
    phone: '+1 (555) 100-0003',
    profile_photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=500&fit=crop',
    services: 'Chinese Massage, Acupressure, Cupping, Tui Na',
  },
  'sarah.williams@maptest.com': {
    display_name: 'Sarah Williams',
    city: 'Los Angeles',
    state: 'CA',
    zip_code: '90210',
    latitude: '34.0736',
    longitude: '-118.4004',
    phone: '+1 (555) 100-0004',
    profile_photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop',
    services: 'Prenatal Massage, Swedish Massage, Lymphatic Drainage',
  },
  'michael.brown@maptest.com': {
    display_name: 'Michael Brown',
    city: 'Los Angeles',
    state: 'CA',
    zip_code: '90291',
    latitude: '33.9850',
    longitude: '-118.4695',
    phone: '+1 (555) 100-0005',
    profile_photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop',
    services: 'Sports Massage, Stretching, Myofascial Release, Recovery',
  }
};

async function main() {
  console.log('🚀 Updating test therapist profiles...\n');

  // Get all users
  const { data: { users } } = await supabase.auth.admin.listUsers();

  for (const email of testEmails) {
    const user = users.find(u => u.email === email);

    if (!user) {
      console.log(`⚠️  User ${email} not found, skipping...`);
      continue;
    }

    const data = therapistData[email];
    const slug = data.display_name.toLowerCase().replace(/\s+/g, '-') + '-los-angeles';

    const profile = {
      user_id: user.id,
      slug: slug,
      display_name: data.display_name,
      latitude: data.latitude,
      longitude: data.longitude,
      services: data.services,
      profile_photo: data.profile_photo,
      zip_code: data.zip_code,
      phone: data.phone,
      city: data.city,
      state: data.state,
      status: 'active',
      created_at: new Date().toISOString()
    };

    console.log(`📝 Upserting profile for ${email}...`);

    const { error } = await supabase
      .from('therapists')
      .upsert(profile, { onConflict: 'user_id' });

    if (error) {
      console.error(`❌ Error: ${error.message}`);
    } else {
      console.log(`✅ Profile created/updated for ${data.display_name}`);
      console.log(`   📍 ${data.city} (${data.latitude}, ${data.longitude})`);
    }
  }

  console.log('\n✅ Done! You can now test the map at /explore');
}

main();
