/**
 * Apply Onboarding Schema to Supabase Database
 *
 * This script executes the onboarding_schema.sql file against the Supabase database
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../masseurmatch-nextjs/.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSQLFile(filePath) {
  console.log(`\n📖 Reading SQL file: ${filePath}`);

  const sqlContent = fs.readFileSync(filePath, 'utf8');

  // Split by double newlines to get logical statements
  // This is a simple approach - for production consider using a proper SQL parser
  const statements = sqlContent
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--') && s !== '');

  console.log(`\n📝 Found ${statements.length} SQL statements to execute\n`);

  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';';

    // Skip comments and empty statements
    if (statement.startsWith('--') || statement.trim() === ';') {
      continue;
    }

    // Extract statement type for logging
    const firstLine = statement.split('\n')[0].trim();
    const statementType = firstLine.match(/^(CREATE|ALTER|DROP|INSERT|UPDATE|DELETE|COMMENT)/i)?.[0] || 'SQL';

    process.stdout.write(`[${i + 1}/${statements.length}] ${statementType}... `);

    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement });

      if (error) {
        // Check if error is "already exists" - we can ignore these
        if (
          error.message.includes('already exists') ||
          error.message.includes('already defined') ||
          error.message.includes('duplicate')
        ) {
          process.stdout.write('⚠️  (already exists)\n');
          successCount++;
        } else {
          throw error;
        }
      } else {
        process.stdout.write('✅\n');
        successCount++;
      }
    } catch (error) {
      process.stdout.write('❌\n');
      errorCount++;
      errors.push({
        statement: firstLine,
        error: error.message
      });
      console.error(`   Error: ${error.message}\n`);
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log('='.repeat(60));

  if (errors.length > 0) {
    console.log('\n⚠️  Errors encountered:');
    errors.forEach((err, idx) => {
      console.log(`\n${idx + 1}. ${err.statement}`);
      console.log(`   ${err.error}`);
    });
  }

  return errorCount === 0;
}

// Alternative approach: Use Supabase SQL editor endpoint directly
async function executeSQLDirect(sql) {
  const { data, error } = await supabase.rpc('exec_sql', {
    sql_query: sql
  });

  if (error) {
    console.error('SQL Error:', error);
    return false;
  }

  return true;
}

// Main execution
async function main() {
  console.log('\n🚀 MasseurMatch - Apply Onboarding Schema\n');
  console.log('Supabase URL:', supabaseUrl);
  console.log('Using service role key:', supabaseServiceKey ? '✓' : '✗');

  const schemaPath = path.join(__dirname, '../sql/onboarding_schema.sql');

  if (!fs.existsSync(schemaPath)) {
    console.error(`❌ Schema file not found: ${schemaPath}`);
    process.exit(1);
  }

  console.log('\n⚠️  WARNING: This will modify your database schema.');
  console.log('    Make sure you have a backup before proceeding.\n');

  // Since we can't prompt in Node script easily, we'll just execute
  // In production, you'd want to add a confirmation prompt

  const success = await executeSQLFile(schemaPath);

  if (success) {
    console.log('\n🎉 Schema applied successfully!');
    process.exit(0);
  } else {
    console.log('\n❌ Schema application failed. Check errors above.');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});
