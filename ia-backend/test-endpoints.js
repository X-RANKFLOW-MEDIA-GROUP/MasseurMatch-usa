/**
 * Test script for therapist API endpoints
 * Run with: node test-endpoints.js
 */

const TEST_USER_ID = "a0000000-0000-0000-0000-000000000001";
const BASE_URL = "http://localhost:4000";

console.log("🧪 Testing Therapist API Endpoints\n");
console.log(`Base URL: ${BASE_URL}`);
console.log(`Test User ID: ${TEST_USER_ID}\n`);

// Test 1: Get public profile
async function testGetPublicProfile() {
  console.log("1️⃣ Testing GET /api/therapist/:user_id");

  const response = await fetch(`${BASE_URL}/api/therapist/${TEST_USER_ID}`);
  const data = await response.json();

  if (response.ok && data.success) {
    console.log("✅ Public profile fetched successfully");
    console.log(`   Name: ${data.therapist.display_name}`);
    console.log(`   City: ${data.therapist.city}, ${data.therapist.state}`);
    console.log(`   Headline: ${data.therapist.headline}`);
  } else {
    console.error("❌ Failed to fetch profile:", data.error);
  }
  console.log("");
}

// Test 2: Get dashboard profile
async function testGetDashboardProfile() {
  console.log("2️⃣ Testing GET /api/therapist/dashboard/:user_id");

  const response = await fetch(`${BASE_URL}/api/therapist/dashboard/${TEST_USER_ID}`);
  const data = await response.json();

  if (response.ok && data.success) {
    console.log("✅ Dashboard profile fetched successfully");
    console.log(`   Email: ${data.therapist.email}`);
    console.log(`   Phone: ${data.therapist.phone}`);
  } else {
    console.error("❌ Failed to fetch dashboard:", data.error);
  }
  console.log("");
}

// Test 3: Update profile
async function testUpdateProfile() {
  console.log("3️⃣ Testing PUT /api/therapist/update/:user_id");

  const updates = {
    headline: "Professional Massage Therapist - Test Update " + new Date().toISOString(),
    phone: "+1 (555) 999-8888"
  };

  const response = await fetch(`${BASE_URL}/api/therapist/update/${TEST_USER_ID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updates)
  });

  const data = await response.json();

  if (response.ok && data.success) {
    console.log("✅ Profile updated successfully");
    console.log(`   New headline: ${data.therapist.headline}`);
    console.log(`   New phone: ${data.therapist.phone}`);
  } else {
    console.error("❌ Failed to update profile:", data.error);
  }
  console.log("");
}

// Test 4: Get all therapists
async function testGetAllTherapists() {
  console.log("4️⃣ Testing GET /api/therapists");

  const response = await fetch(`${BASE_URL}/api/therapists?limit=5`);
  const data = await response.json();

  if (response.ok && data.success) {
    console.log(`✅ Fetched ${data.therapists.length} therapists`);
    data.therapists.forEach((t, i) => {
      console.log(`   ${i + 1}. ${t.display_name} - ${t.city}, ${t.state}`);
    });
  } else {
    console.error("❌ Failed to fetch therapists:", data.error);
  }
  console.log("");
}

// Test 5: Get therapists by city
async function testGetTherapistsByCity() {
  console.log("5️⃣ Testing GET /api/therapists?city=Los Angeles");

  const response = await fetch(`${BASE_URL}/api/therapists?city=Los Angeles`);
  const data = await response.json();

  if (response.ok && data.success) {
    console.log(`✅ Found ${data.therapists.length} therapists in Los Angeles`);
    data.therapists.forEach((t, i) => {
      console.log(`   ${i + 1}. ${t.display_name} - ${t.neighborhood || t.city}`);
    });
  } else {
    console.error("❌ Failed to fetch therapists:", data.error);
  }
  console.log("");
}

// Run all tests
async function runTests() {
  try {
    await testGetPublicProfile();
    await testGetDashboardProfile();
    await testUpdateProfile();
    await testGetAllTherapists();
    await testGetTherapistsByCity();

    console.log("✅ All tests completed!\n");
  } catch (error) {
    console.error("❌ Test error:", error.message);
    console.log("\n⚠️  Make sure the backend is running: npm run dev\n");
  }
}

runTests();
