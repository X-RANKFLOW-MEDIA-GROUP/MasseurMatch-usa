#!/usr/bin/env node
/**
 * Combined script to check for and create Bruno Santos profile
 *
 * This script will:
 * 1. Check if Bruno Santos profile already exists
 * 2. If not found, create a complete profile
 * 3. Add Dallas as visitor city with dates
 *
 * Usage: node scripts/setup-bruno-santos.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load Supabase credentials
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
    // Ignore
  }
}

if (!supabaseUrl || !supabaseKey) {
  console.log('\n❌ Supabase credentials not configured\n');
  console.log('Please create .env.local with:');
  console.log('  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.log('  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BRUNO_DATA = {
  display_name: 'Bruno Santos',
  full_name: 'Bruno Santos',
  phone: '762-334-5300',
  email: 'bruno.santos@masseurmatch.com',

  city: 'Dallas',
  state: 'TX',
  country: 'USA',
  zip_code: '75201',

  slug: 'bruno-santos-dallas-tx',
  status: 'active',
  verified: true,
  availability_status: 'available',

  years_experience: 8,
  bio: `Professional massage therapist visiting Dallas from Rio de Janeiro, Brazil.

Specializing in therapeutic and sports massage with 8 years of experience. I bring authentic Brazilian massage techniques combined with traditional therapeutic methods to help you recover from muscle tension, improve flexibility, and achieve deep relaxation.

Currently offering sessions in the Dallas area from January 4-7, 2026. Perfect for visitors and locals seeking a professional, high-quality massage experience.

All sessions are fully customized to your specific needs and preferences. Whether you need sports recovery, pain relief, or stress reduction, I'm here to help you feel your best.`,

  tagline: 'Brazilian Therapeutic & Sports Massage Specialist',

  techniques: ['Deep Tissue', 'Swedish Massage', 'Sports Massage', 'Therapeutic Massage', 'Myofascial Release', 'Trigger Point Therapy', 'Brazilian Massage'],
  specialties: ['Sports Recovery', 'Pain Relief', 'Muscle Tension', 'Flexibility Enhancement', 'Stress Reduction'],

  service_type: ['Mobile/Outcall'],
  accepts_couples: true,

  rate_60min: 120,
  rate_90min: 170,
  rate_120min: 220,
  accepts_tips: true,

  payment_methods: ['Cash', 'Venmo', 'Zelle', 'Credit Card'],

  certifications: [
    'Licensed Massage Therapist (Brazil)',
    'Sports Massage Certification',
    'Deep Tissue Specialist'
  ],

  education: 'Rio de Janeiro School of Therapeutic Massage (2016)',

  hours_of_operation: {
    monday: { open: '09:00', close: '21:00' },
    tuesday: { open: '09:00', close: '21:00' },
    wednesday: { open: '09:00', close: '21:00' },
    thursday: { open: '09:00', close: '21:00' },
    friday: { open: '09:00', close: '21:00' },
    saturday: { open: '10:00', close: '20:00' },
    sunday: { open: '10:00', close: '18:00' }
  },

  preferred_contact: 'phone',
  whatsapp_number: '762-334-5300',

  languages: ['English', 'Portuguese'],
  gender: 'male',
  accepts_walk_ins: false,
  parking_available: 'Street parking available',

  meta_description: 'Professional massage therapist from Rio de Janeiro visiting Dallas, TX. Specializing in therapeutic, sports, and deep tissue massage. Available Jan 4-7, 2026.',

  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

async function main() {
  console.log('\n🔍 Checking for Bruno Santos profile...\n');

  try {
    // Search for existing profile
    const { data: existing, error: searchError } = await supabase
      .from('profiles')
      .select('*')
      .or('phone.eq.762-334-5300,phone.eq.7623345300,slug.eq.bruno-santos-dallas-tx,display_name.ilike.%bruno%santos%')
      .maybeSingle();

    if (searchError && searchError.code !== 'PGRST116') {
      console.error('❌ Error searching for profile:', searchError.message);
      process.exit(1);
    }

    if (existing) {
      console.log('✅ PROFILE FOUND!\n');
      console.log('─────────────────────────────────────────');
      console.log(`  Name:     ${existing.display_name || existing.full_name}`);
      console.log(`  Phone:    ${existing.phone}`);
      console.log(`  Location: ${existing.city}, ${existing.state}`);
      console.log(`  Slug:     ${existing.slug}`);
      console.log(`  Status:   ${existing.status}`);
      console.log(`  Verified: ${existing.verified ? '✓ Yes' : '✗ No'}`);
      console.log(`  URL:      /therapist/${existing.slug}`);
      console.log('─────────────────────────────────────────\n');
      console.log('ℹ️  Profile already exists. No action needed.\n');
      process.exit(0);
    }

    console.log('❌ Profile not found. Creating new profile...\n');

    // Create new profile
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert([BRUNO_DATA])
      .select()
      .single();

    if (createError) {
      console.error('❌ Error creating profile:', createError.message);
      console.error('Details:', createError);
      process.exit(1);
    }

    console.log('✅ SUCCESS! Profile created\n');
    console.log('─────────────────────────────────────────');
    console.log(`  Name:     ${newProfile.display_name}`);
    console.log(`  Phone:    ${newProfile.phone}`);
    console.log(`  Location: ${newProfile.city}, ${newProfile.state}`);
    console.log(`  Slug:     ${newProfile.slug}`);
    console.log(`  Status:   ${newProfile.status}`);
    console.log(`  Verified: ${newProfile.verified ? '✓ Yes' : '✗ No'}`);
    console.log(`  URL:      /therapist/${newProfile.slug}`);
    console.log('─────────────────────────────────────────\n');

    // Add visitor city
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
      console.log('⚠️  Note: Could not add visitor city record');
      console.log(`   (${visitorError.message})`);
      console.log('   You may need to add this manually.\n');
    } else {
      console.log('✅ Visitor city added: Dallas, TX (Jan 4-7, 2026)\n');
    }

    console.log('📋 Next Steps:');
    console.log('  1. Upload professional photos to the profile');
    console.log('  2. Verify contact information is correct');
    console.log('  3. Test the profile page at /therapist/bruno-santos-dallas-tx');
    console.log('  4. Profile is now live and searchable!\n');

    console.log('✨ Setup complete!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Unexpected error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

main();
