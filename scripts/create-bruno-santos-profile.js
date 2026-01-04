const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Try to read from .env.local file
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
      const keyMatch = envContent.match(/(?:SUPABASE_SERVICE_ROLE_KEY|NEXT_PUBLIC_SUPABASE_ANON_KEY)=(.+)/);
      if (urlMatch) supabaseUrl = urlMatch[1].trim();
      if (keyMatch) supabaseKey = keyMatch[1].trim();
    }
  } catch (error) {
    // Ignore file read errors
  }
}

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Supabase credentials not configured');
  console.log('Please set up .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const brunoProfile = {
  // Basic Information
  display_name: 'Bruno Santos',
  full_name: 'Bruno Santos',
  phone: '762-334-5300',
  email: 'bruno.santos@example.com', // Should be updated with real email

  // Location
  city: 'Dallas',
  state: 'TX',
  country: 'USA',
  zip_code: '75201',
  address: 'Visiting from Rio de Janeiro, Brazil',

  // Profile Setup
  slug: 'bruno-santos-dallas-tx',
  status: 'active',
  verified: true,
  availability_status: 'available',

  // Professional Details
  years_experience: 8,
  bio: `Professional massage therapist visiting Dallas from Rio de Janeiro, Brazil.

Specializing in therapeutic and sports massage with 8 years of experience. I bring Brazilian massage techniques combined with traditional therapeutic methods to help you recover from muscle tension, improve flexibility, and achieve deep relaxation.

Currently offering sessions in Dallas area from January 4th to January 7th, 2026. Perfect for visitors and locals looking for a professional, high-quality massage experience.

All sessions are customized to your specific needs and preferences.`,

  tagline: 'Brazilian Therapeutic & Sports Massage Specialist',

  // Services & Techniques
  techniques: [
    'Deep Tissue',
    'Swedish Massage',
    'Sports Massage',
    'Therapeutic Massage',
    'Myofascial Release',
    'Trigger Point Therapy',
    'Brazilian Massage'
  ],

  specialties: [
    'Sports Recovery',
    'Pain Relief',
    'Muscle Tension',
    'Flexibility Enhancement',
    'Stress Reduction'
  ],

  // Service Types
  service_type: ['Mobile/Outcall'],
  accepts_couples: true,

  // Pricing
  rate_60min: 120,
  rate_90min: 170,
  rate_120min: 220,
  accepts_tips: true,

  // Payment Methods
  payment_methods: ['Cash', 'Venmo', 'Zelle', 'Credit Card'],

  // Certifications & Education
  certifications: [
    'Licensed Massage Therapist (Brazil)',
    'Sports Massage Certification',
    'Deep Tissue Specialist'
  ],

  education: 'Rio de Janeiro School of Therapeutic Massage (2016)',

  // Availability
  hours_of_operation: {
    monday: { open: '09:00', close: '21:00' },
    tuesday: { open: '09:00', close: '21:00' },
    wednesday: { open: '09:00', close: '21:00' },
    thursday: { open: '09:00', close: '21:00' },
    friday: { open: '09:00', close: '21:00' },
    saturday: { open: '10:00', close: '20:00' },
    sunday: { open: '10:00', close: '18:00' }
  },

  // Contact Preferences
  preferred_contact: 'phone',
  whatsapp_number: '762-334-5300',

  // Additional Features
  languages: ['English', 'Portuguese'],
  gender: 'male',
  accepts_walk_ins: false,
  parking_available: 'Street parking',

  // Visiting Information
  visitor_cities: ['Dallas'],
  visitor_dates: {
    start: '2026-01-04',
    end: '2026-01-07'
  },

  // Professional Photos (placeholders - should be updated with real photo URLs)
  profile_photo_url: null,
  gallery_photos: [],

  // SEO & Marketing
  meta_description: 'Professional massage therapist from Rio de Janeiro visiting Dallas, TX. Specializing in therapeutic, sports, and deep tissue massage. Book your session Jan 4-7, 2026.',

  // Timestamps
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

async function createBrunoProfile() {
  console.log('🔄 Creating profile for Bruno Santos...\n');

  try {
    // First, check if profile already exists
    const { data: existing } = await supabase
      .from('profiles')
      .select('*')
      .or('phone.eq.762-334-5300,slug.eq.bruno-santos-dallas-tx')
      .maybeSingle();

    if (existing) {
      console.log('⚠️  Profile already exists!');
      console.log('─────────────────────────────────────────');
      console.log(`  Name: ${existing.display_name || existing.full_name}`);
      console.log(`  Phone: ${existing.phone}`);
      console.log(`  City: ${existing.city}, ${existing.state}`);
      console.log(`  Slug: ${existing.slug}`);
      console.log(`  Status: ${existing.status}`);
      console.log('─────────────────────────────────────────\n');
      console.log('❌ Cannot create duplicate profile');
      return false;
    }

    // Create new profile
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert([brunoProfile])
      .select()
      .single();

    if (createError) {
      console.error('❌ Error creating profile:', createError.message);
      console.error('Details:', createError);
      return false;
    }

    console.log('✅ SUCCESS! Profile created for Bruno Santos');
    console.log('─────────────────────────────────────────');
    console.log(`  Name: ${newProfile.display_name}`);
    console.log(`  Phone: ${newProfile.phone}`);
    console.log(`  Location: ${newProfile.city}, ${newProfile.state}`);
    console.log(`  Slug: ${newProfile.slug}`);
    console.log(`  Status: ${newProfile.status}`);
    console.log(`  Verified: ${newProfile.verified ? '✓' : '✗'}`);
    console.log(`  Profile URL: /therapist/${newProfile.slug}`);
    console.log('─────────────────────────────────────────\n');

    // Add visitor city record
    console.log('🔄 Adding Dallas as visitor city...');

    const { error: visitorError } = await supabase
      .from('therapist_visitor_cities')
      .insert([{
        therapist_id: newProfile.user_id,
        city: 'Dallas',
        state: 'TX',
        start_date: '2026-01-04',
        end_date: '2026-01-07',
        is_active: true
      }]);

    if (visitorError) {
      console.log('⚠️  Could not add visitor city:', visitorError.message);
    } else {
      console.log('✅ Visitor city added: Dallas, TX (Jan 4-7, 2026)\n');
    }

    console.log('📋 Next Steps:');
    console.log('  1. Upload professional photos');
    console.log('  2. Update email address if needed');
    console.log('  3. Verify all details are correct');
    console.log('  4. Profile is now live and searchable!\n');

    return true;

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

createBrunoProfile()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
