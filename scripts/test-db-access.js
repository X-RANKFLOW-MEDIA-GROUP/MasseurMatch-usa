const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './masseurmatch-nextjs/.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Service Role Key:', serviceRoleKey ? '✅ Set' : '❌ Not set');

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function testDatabaseAccess() {
  try {
    // Test 1: Check if therapists table exists
    console.log('\n=== Test 1: Query therapists table ===');
    const { data: therapists, error: therapistsError } = await supabaseAdmin
      .from('therapists')
      .select('user_id, email, full_name')
      .limit(1);

    if (therapistsError) {
      console.error('❌ Error querying therapists table:', therapistsError.message);
    } else {
      console.log('✅ Therapists table exists!');
      console.log('   Sample data:', therapists);
    }

    // Test 2: Check if profiles table exists
    console.log('\n=== Test 2: Query profiles table ===');
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('id, user_id')
      .limit(1);

    if (profilesError) {
      console.error('❌ Error querying profiles table:', profilesError.message);
    } else {
      console.log('✅ Profiles table exists!');
      console.log('   Sample data:', profiles);
    }

    // Test 3: Try to insert into therapists table
    console.log('\n=== Test 3: Try INSERT into therapists table ===');
    const testUserId = '00000000-0000-0000-0000-000000000000'; // Fake UUID for testing
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('therapists')
      .insert({
        user_id: testUserId,
        email: 'test@test.com',
        full_name: 'Test User',
        display_name: 'Test',
      })
      .select();

    if (insertError) {
      console.error('❌ Error inserting into therapists:', insertError.message);
      console.error('   Details:', insertError);
    } else {
      console.log('✅ Successfully inserted test record!');

      // Clean up test record
      await supabaseAdmin.from('therapists').delete().eq('user_id', testUserId);
      console.log('✅ Cleaned up test record');
    }

  } catch (err) {
    console.error('Fatal error:', err);
  }
}

testDatabaseAccess();
