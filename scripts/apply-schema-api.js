/**
 * Apply Schema via Supabase Management API
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Read .env.local
const envPath = path.join(__dirname, '../masseurmatch-nextjs/.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#][^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;
const projectRef = supabaseUrl.match(/https:\/\/(.+?)\.supabase\.co/)[1];

// Read SQL file
const sqlPath = path.join(__dirname, '../sql/onboarding_schema.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

console.log('\n🚀 Applying schema via Supabase REST API...\n');
console.log(`Project: ${projectRef}`);
console.log(`SQL length: ${sql.length} bytes\n`);

// For Supabase, we need to execute SQL via PostgREST
// The best approach is to use the SQL endpoint with service role

const options = {
  hostname: `${projectRef}.supabase.co`,
  port: 443,
  path: '/rest/v1/rpc/exec_sql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': supabaseServiceKey,
    'Authorization': `Bearer ${supabaseServiceKey}`,
    'Prefer': 'return=representation'
  }
};

const postData = JSON.stringify({
  query: sql
});

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);

    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log('\n✅ Schema applied successfully!');
    } else {
      console.log('\n❌ Failed to apply schema');
      console.log('You may need to apply it manually via the Dashboard');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
  console.log('\n📝 Manual application required:');
  console.log(`https://app.supabase.com/project/${projectRef}/sql/new`);
});

req.write(postData);
req.end();
