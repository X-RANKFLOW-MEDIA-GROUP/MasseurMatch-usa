#!/usr/bin/env node

/**
 * Script de teste para verificar a integração do Explore AI com o banco de dados
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function testExploreAI() {
  console.log('🧪 Testing Explore AI Database Connection\n');

  // Test 1: Check if therapists table exists and has data
  console.log('📋 Test 1: Checking therapists table...');
  const { data: therapists, error: therapistsError } = await supabase
    .from('therapists')
    .select('user_id, display_name, slug, city, state, latitude, longitude')
    .eq('status', 'active')
    .limit(5);

  if (therapistsError) {
    console.error('❌ Error fetching therapists:', therapistsError.message);
  } else {
    console.log(`✅ Found ${therapists.length} therapists`);
    therapists.forEach(t => {
      console.log(`   - ${t.display_name} (${t.city}, ${t.state}) [lat: ${t.latitude}, lng: ${t.longitude}]`);
    });
  }

  console.log('');

  // Test 2: Check if users_preferences table exists
  console.log('📋 Test 2: Checking users_preferences table...');
  const { data: prefs, error: prefsError } = await supabase
    .from('users_preferences')
    .select('user_id, latitude, longitude, radius, massage_types')
    .limit(1);

  if (prefsError) {
    if (prefsError.code === '42P01') {
      console.log('⚠️  Table users_preferences does not exist. Run: sql/create_users_preferences_table.sql');
    } else {
      console.error('❌ Error fetching preferences:', prefsError.message);
    }
  } else {
    console.log(`✅ users_preferences table exists (${prefs.length} rows found)`);
  }

  console.log('');

  // Test 3: Check if explore_swipe_events table exists
  console.log('📋 Test 3: Checking explore_swipe_events table...');
  const { data: events, error: eventsError } = await supabase
    .from('explore_swipe_events')
    .select('id, direction, created_at')
    .limit(1);

  if (eventsError) {
    if (eventsError.code === '42P01') {
      console.log('⚠️  Table explore_swipe_events does not exist. Run: sql/create_explore_swipe_events_table.sql');
    } else {
      console.error('❌ Error fetching events:', eventsError.message);
    }
  } else {
    console.log(`✅ explore_swipe_events table exists (${events.length} rows found)`);
  }

  console.log('');

  // Test 4: Test RPC discover_nearby_therapists
  console.log('📋 Test 4: Testing discover_nearby_therapists RPC...');

  // Use Dallas coordinates as default
  const testLat = 32.7767;
  const testLon = -96.7970;
  const testRadius = 50000; // 50km in meters

  const { data: nearby, error: rpcError } = await supabase.rpc('discover_nearby_therapists', {
    user_lat: testLat,
    user_lon: testLon,
    radius_meters: testRadius,
    limit_results: 10
  });

  if (rpcError) {
    if (rpcError.code === '42883') {
      console.log('⚠️  Function discover_nearby_therapists does not exist. Run: sql/discover_nearby_therapists.sql');
    } else {
      console.error('❌ Error calling RPC:', rpcError.message);
    }
  } else {
    console.log(`✅ RPC works! Found ${nearby.length} therapists near Dallas`);
    if (nearby.length > 0) {
      console.log('\n   Top 3 closest:');
      nearby.slice(0, 3).forEach((t, i) => {
        const distanceKm = (t.distance / 1000).toFixed(1);
        console.log(`   ${i + 1}. ${t.display_name} - ${distanceKm}km away (${t.city}, ${t.state})`);
      });
    }
  }

  console.log('');

  // Summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Summary:');
  console.log('');
  console.log(`Therapists table:        ${therapistsError ? '❌' : '✅'}`);
  console.log(`users_preferences table: ${prefsError ? (prefsError.code === '42P01' ? '⚠️ ' : '❌') : '✅'}`);
  console.log(`explore_swipe_events:    ${eventsError ? (eventsError.code === '42P01' ? '⚠️ ' : '❌') : '✅'}`);
  console.log(`RPC function:            ${rpcError ? (rpcError.code === '42883' ? '⚠️ ' : '❌') : '✅'}`);
  console.log('');

  if (!prefsError && !eventsError && !rpcError && !therapistsError) {
    console.log('🎉 All systems ready! Explore AI is connected to the database.');
  } else {
    console.log('⚠️  Some components need setup. Check messages above.');
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

testExploreAI().catch(console.error);
