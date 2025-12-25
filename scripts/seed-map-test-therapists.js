/**
 * Script to create multiple fake therapist profiles for map testing
 *
 * This creates 5 therapists in different locations around Los Angeles
 * to properly test the map functionality
 *
 * Usage:
 *   node scripts/seed-map-test-therapists.js
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
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Array of fake therapists with different locations in LA area
const therapists = [
  {
    email: 'alex.santos@maptest.com',
    password: 'test123',
    full_name: 'Alex Santos',
    display_name: 'Alex Santos',
    headline: 'Deep Tissue & Sports Massage Specialist',
    about: 'Professional massage therapist with 8+ years of experience. Specialized in deep tissue, sports massage, and injury rehabilitation.',
    city: 'Los Angeles',
    state: 'CA',
    neighborhood: 'West Hollywood',
    zip_code: '90069',
    latitude: 34.0901,
    longitude: -118.3756,
    phone: '+1 (555) 100-0001',
    profile_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
    services: 'Deep Tissue, Sports Massage, Swedish Massage, Trigger Point',
    starting_price: 90,
    rating: 4.8
  },
  {
    email: 'maria.rodriguez@maptest.com',
    password: 'test123',
    full_name: 'Maria Rodriguez',
    display_name: 'Maria Rodriguez',
    headline: 'Relaxation & Wellness Expert',
    about: 'Certified massage therapist focusing on relaxation, stress relief, and holistic wellness. Creating peaceful experiences for every client.',
    city: 'Los Angeles',
    state: 'CA',
    neighborhood: 'Santa Monica',
    zip_code: '90401',
    latitude: 34.0195,
    longitude: -118.4912,
    phone: '+1 (555) 100-0002',
    profile_photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop',
    services: 'Swedish Massage, Aromatherapy, Hot Stone, Reflexology',
    starting_price: 85,
    rating: 4.9
  },
  {
    email: 'james.chen@maptest.com',
    password: 'test123',
    full_name: 'James Chen',
    display_name: 'James Chen',
    headline: 'Traditional Chinese Massage & Acupressure',
    about: 'Trained in traditional Chinese massage techniques with modern therapeutic approaches. Specializing in pain relief and energy balance.',
    city: 'Los Angeles',
    state: 'CA',
    neighborhood: 'Downtown LA',
    zip_code: '90012',
    latitude: 34.0522,
    longitude: -118.2437,
    phone: '+1 (555) 100-0003',
    profile_photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=500&fit=crop',
    services: 'Chinese Massage, Acupressure, Cupping, Tui Na',
    starting_price: 95,
    rating: 4.7
  },
  {
    email: 'sarah.williams@maptest.com',
    password: 'test123',
    full_name: 'Sarah Williams',
    display_name: 'Sarah Williams',
    headline: 'Prenatal & Postnatal Massage Specialist',
    about: 'Certified in prenatal and postnatal massage therapy. Helping expectant and new mothers feel comfortable and relaxed during their journey.',
    city: 'Los Angeles',
    state: 'CA',
    neighborhood: 'Beverly Hills',
    zip_code: '90210',
    latitude: 34.0736,
    longitude: -118.4004,
    phone: '+1 (555) 100-0004',
    profile_photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop',
    services: 'Prenatal Massage, Swedish Massage, Lymphatic Drainage',
    starting_price: 100,
    rating: 5.0
  },
  {
    email: 'michael.brown@maptest.com',
    password: 'test123',
    full_name: 'Michael Brown',
    display_name: 'Michael Brown',
    headline: 'Athletic Performance & Recovery',
    about: 'Former professional athlete turned massage therapist. Specializing in sports recovery, flexibility, and performance enhancement.',
    city: 'Los Angeles',
    state: 'CA',
    neighborhood: 'Venice Beach',
    zip_code: '90291',
    latitude: 33.9850,
    longitude: -118.4695,
    phone: '+1 (555) 100-0005',
    profile_photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop',
    services: 'Sports Massage, Stretching, Myofascial Release, Recovery',
    starting_price: 110,
    rating: 4.6
  }
];

async function createTherapist(therapistData) {
  try {
    // Check if user already exists
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const userExists = existingUser?.users?.find(u => u.email === therapistData.email);

    if (userExists) {
      console.log(`⚠️  User ${therapistData.email} already exists. Deleting to recreate...`);
      await supabase.auth.admin.deleteUser(userExists.id);
      console.log(`✅ Old user deleted, waiting for propagation...`);
      // Wait for deletion to propagate
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Create auth user
    console.log(`👤 Creating user: ${therapistData.email}...`);
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: therapistData.email,
      password: therapistData.password,
      email_confirm: true,
      user_metadata: {
        full_name: therapistData.full_name
      }
    });

    if (authError) {
      console.error(`❌ Error creating user ${therapistData.email}:`, authError.message);
      return;
    }

    console.log(`✅ Auth user created: ${authData.user.id}`);

    // Create therapist profile (only fields that exist in DB)
    const slug = therapistData.display_name.toLowerCase().replace(/\s+/g, '-') + '-' + therapistData.city.toLowerCase();
    const therapistProfile = {
      user_id: authData.user.id,
      slug: slug,
      display_name: therapistData.display_name,
      latitude: therapistData.latitude.toString(),
      longitude: therapistData.longitude.toString(),
      services: therapistData.services,
      profile_photo: therapistData.profile_photo,
      zip_code: therapistData.zip_code,
      phone: therapistData.phone,
      city: therapistData.city,
      state: therapistData.state,
      status: 'active',
      created_at: new Date().toISOString()
    };

    const { error: therapistError } = await supabase
      .from('therapists')
      .insert(therapistProfile);

    if (therapistError) {
      console.error(`❌ Error creating therapist profile:`, therapistError.message);
      return;
    }

    console.log(`✅ Therapist profile created: ${therapistData.display_name}`);
    console.log(`   📍 Location: ${therapistData.neighborhood}, ${therapistData.city}`);
    console.log(`   ⭐ Rating: ${therapistData.rating}`);
    console.log('');

  } catch (error) {
    console.error(`❌ Fatal error creating ${therapistData.email}:`, error);
  }
}

async function main() {
  console.log('🚀 Starting creation of map test therapists...\n');
  console.log('='.repeat(60));

  for (const therapist of therapists) {
    await createTherapist(therapist);
  }

  console.log('='.repeat(60));
  console.log('✅ COMPLETED!');
  console.log('='.repeat(60));
  console.log('');
  console.log('Created therapists:');
  therapists.forEach((t, i) => {
    console.log(`${i + 1}. ${t.display_name} - ${t.neighborhood}`);
    console.log(`   📧 ${t.email} / ${t.password}`);
    console.log(`   📍 Lat: ${t.latitude}, Lng: ${t.longitude}`);
  });
  console.log('');
  console.log('🗺️  You can now test the map at /explore');
  console.log('');
}

main();
