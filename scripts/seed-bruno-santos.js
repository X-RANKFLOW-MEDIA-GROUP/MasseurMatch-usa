const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seedBrunoSantos() {
  console.log('🌟 Creating Bruno Santos profile...\n');

  try {
    // 1. Create auth user
    const email = 'bruno.santos@masseurmatch.com';
    const password = 'TempPassword123!'; // User should change this

    console.log('Creating auth user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: 'Bruno Santos',
        display_name: 'Bruno Santos'
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('User already exists, fetching existing user...');
        const { data: users } = await supabase.auth.admin.listUsers();
        const existingUser = users.users.find(u => u.email === email);
        if (!existingUser) throw new Error('Could not find existing user');
        var userId = existingUser.id;
      } else {
        throw authError;
      }
    } else {
      var userId = authData.user.id;
    }

    console.log('✓ Auth user created/found:', userId);

    // 2. Create comprehensive profile with SEO optimization
    const profileData = {
      user_id: userId,
      slug: 'bruno-santos-dallas',
      display_name: 'Bruno Santos',
      full_name: 'Bruno Santos',

      // SEO-optimized headline with gay massage keywords
      headline: 'Brazilian Gay Massage Therapist | Deep Tissue & Sports Massage in Dallas',

      // SEO-optimized bio with rich keywords
      about: `Experience authentic Brazilian massage therapy with Bruno Santos, a skilled gay massage therapist visiting Dallas from Rio de Janeiro. Specializing in deep tissue massage, sports massage, and Swedish massage techniques, Bruno brings the warmth and expertise of Rio's renowned bodywork tradition to Dallas.

With years of experience serving the LGBTQ+ community, Bruno creates a safe, welcoming, and judgment-free space for all clients. Whether you're seeking relief from muscle tension, sports recovery, or pure relaxation, Bruno's intuitive touch and professional approach ensure a transformative massage experience.

Now offering both outcall and incall sessions in Dallas from January 4-7, 2026. Limited availability - book your session today and discover why clients rave about Bruno's healing hands.

Perfect for: Athletes, gym enthusiasts, professionals seeking stress relief, and anyone looking for high-quality gay massage therapy in Dallas. LGBTQ+ friendly and proudly serving the Dallas gay community.`,

      philosophy: `My massage philosophy is rooted in the Brazilian tradition of healing touch and genuine human connection. I believe massage is more than just physical therapy - it's an opportunity to restore balance, release tension, and reconnect with your body.

As a gay massage therapist, I understand the importance of creating a safe, affirming space where you can fully relax and be yourself. Every session is tailored to your unique needs, whether you're recovering from intense workouts, managing chronic pain, or simply seeking deep relaxation.

I combine technical expertise with intuitive bodywork, ensuring each stroke serves a purpose. My goal is not just to relieve your immediate discomfort, but to help you develop greater body awareness and long-term wellness.`,

      professional_title: 'Licensed Massage Therapist from Rio de Janeiro',

      // Location - Dallas (visiting)
      city: 'Dallas',
      state: 'TX',
      neighborhood: 'Uptown',
      zip_code: '75201',
      service_radius: 15,

      // Contact
      phone: '762-334-5300',
      email: email,
      whatsapp: '+17623345300',

      // Services - SEO optimized
      services: [
        'Deep Tissue Massage',
        'Sports Massage',
        'Swedish Massage',
        'Gay Massage',
        'LGBTQ+ Friendly Massage',
        'Brazilian Massage Therapy',
        'Therapeutic Massage',
        'Relaxation Massage'
      ],

      massage_techniques: [
        'Deep Tissue',
        'Sports',
        'Swedish',
        'Trigger Point',
        'Myofascial Release',
        'Aromatherapy'
      ],

      // Rates
      rate_60: '170',
      rate_90: '250',
      rate_120: '300',
      rate_outcall: 'Contact for rates',

      // Payment methods
      payment_methods: ['Cash', 'Venmo', 'Zelle', 'PayPal', 'Apple Pay'],

      // Availability
      incall_available: true,
      outcall_available: true,

      // Studio amenities
      studio_amenities: [
        'Shower',
        'Music',
        'Temperature Control',
        'Essential Oils',
        'Private Parking'
      ],

      // Professional info
      years_experience: 8,
      languages: ['English', 'Portuguese'],
      degrees_certifications: 'Licensed Massage Therapist (Brazil), Sports Massage Certification, Deep Tissue Specialist',

      // Limited schedule for visiting dates (Jan 4-7, 2026)
      weekly_schedule: {
        saturday: {
          studio_available: true,
          studio_start: '09:00',
          studio_end: '21:00',
          mobile_available: true,
          mobile_start: '10:00',
          mobile_end: '20:00'
        },
        sunday: {
          studio_available: true,
          studio_start: '09:00',
          studio_end: '21:00',
          mobile_available: true,
          mobile_start: '10:00',
          mobile_end: '20:00'
        },
        monday: {
          studio_available: true,
          studio_start: '09:00',
          studio_end: '21:00',
          mobile_available: true,
          mobile_start: '10:00',
          mobile_end: '20:00'
        },
        tuesday: {
          studio_available: true,
          studio_start: '09:00',
          studio_end: '18:00',
          mobile_available: true,
          mobile_start: '10:00',
          mobile_end: '17:00'
        },
        wednesday: {
          studio_available: false,
          mobile_available: false
        },
        thursday: {
          studio_available: false,
          mobile_available: false
        },
        friday: {
          studio_available: false,
          mobile_available: false
        }
      },

      // Preferences - LGBTQ+ focused
      preference_lgbtq_only: false, // Open to all, but LGBTQ+ friendly
      preference_men_only: false,

      // Status
      status: 'active',
      verified: true,
      subscription_tier: 'pro',

      // Profile completeness
      profile_completeness: 95,

      // SEO fields
      meta_title: 'Bruno Santos - Gay Massage Therapist in Dallas | Brazilian Deep Tissue & Sports Massage',
      meta_description: 'Experience authentic Brazilian massage with Bruno Santos, visiting Dallas Jan 4-7. Expert gay massage therapist specializing in deep tissue, sports massage & Swedish techniques. LGBTQ+ friendly. Book now!',

      // Initial stats
      rating: 5.0,
      review_count: 12, // From Rio clients
      profile_views: 0,
      booking_inquiries: 0,

      // Timestamps
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Creating profile...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert(profileData, { onConflict: 'user_id' })
      .select()
      .single();

    if (profileError) throw profileError;
    console.log('✓ Profile created successfully\n');

    // 3. Create therapist entry (public-facing)
    const therapistData = {
      user_id: userId,
      slug: 'bruno-santos-dallas',
      display_name: 'Bruno Santos',
      headline: 'Brazilian Gay Massage Therapist | Deep Tissue & Sports Massage in Dallas',
      about: profileData.about,
      city: 'Dallas',
      state: 'TX',
      phone: '762-334-5300',
      services: profileData.services,
      rate_60: '170',
      rate_90: '250',
      rate_120: '300',
      profile_photo: null, // Will be updated when photos are uploaded
      rating: 5.0,
      review_count: 12,
      years_experience: 8,
      languages: ['English', 'Portuguese'],
      incall_available: true,
      outcall_available: true,
      status: 'active',
      verified: true,
      created_at: new Date().toISOString()
    };

    console.log('Creating therapist entry...');
    const { data: therapist, error: therapistError } = await supabase
      .from('therapists')
      .upsert(therapistData, { onConflict: 'user_id' })
      .select()
      .single();

    if (therapistError) throw therapistError;
    console.log('✓ Therapist entry created\n');

    // 4. Add visitor city entry
    const visitorData = {
      therapist_id: userId,
      city: 'Dallas',
      state: 'TX',
      start_date: '2026-01-04',
      end_date: '2026-01-07',
      is_current: true,
      created_at: new Date().toISOString()
    };

    console.log('Adding visitor city...');
    const { error: visitorError } = await supabase
      .from('visitor_cities')
      .insert(visitorData);

    if (visitorError) throw visitorError;
    console.log('✓ Visitor city added\n');

    // 5. Success summary
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ BRUNO SANTOS PROFILE CREATED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('📋 Profile Details:');
    console.log('   • Name: Bruno Santos');
    console.log('   • Slug: bruno-santos-dallas');
    console.log('   • Email:', email);
    console.log('   • Password: TempPassword123! (change after first login)');
    console.log('   • Phone: 762-334-5300');
    console.log('   • Location: Dallas, TX (visiting Jan 4-7, 2026)');
    console.log('   • Profile URL: https://masseurmatch.com/therapist/bruno-santos-dallas\n');
    console.log('💰 Rates:');
    console.log('   • 60 min: $170');
    console.log('   • 90 min: $250');
    console.log('   • 120 min: $300');
    console.log('   • Outcall: Contact for rates\n');
    console.log('🎯 SEO Optimization:');
    console.log('   • Gay massage keywords: ✓');
    console.log('   • Dallas location targeting: ✓');
    console.log('   • Brazilian massage keywords: ✓');
    console.log('   • LGBTQ+ friendly tags: ✓');
    console.log('   • Rich service descriptions: ✓\n');
    console.log('📸 Next Steps:');
    console.log('   1. Upload 5 photos to complete profile');
    console.log('   2. Set profile photo (use photo #2 - professional headshot)');
    console.log('   3. Add 4 gallery photos');
    console.log('   4. Profile will be live and searchable on Google!\n');
    console.log('═══════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error creating profile:', error.message);
    throw error;
  }
}

// Run the seed function
seedBrunoSantos()
  .then(() => {
    console.log('Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
