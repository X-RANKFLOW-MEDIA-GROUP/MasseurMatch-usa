/**
 * Apply Onboarding Schema - Direct Approach
 *
 * Executes schema via Supabase client with proper error handling
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../masseurmatch-nextjs/.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSQL(sql: string, description: string) {
  console.log(`Executing: ${description}...`);

  try {
    const { data, error } = await supabase.rpc('exec_sql' as any, {
      query: sql
    });

    if (error) {
      // Check if it's an "already exists" error - these are OK
      if (
        error.message?.includes('already exists') ||
        error.message?.includes('already defined') ||
        error.code === '42P07' || // Relation already exists
        error.code === '42710'    // Object already exists
      ) {
        console.log(`  ⚠️  Already exists (OK)`);
        return true;
      }
      throw error;
    }

    console.log(`  ✅ Success`);
    return true;
  } catch (error: any) {
    console.error(`  ❌ Error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('\n🚀 Applying Onboarding Schema via Supabase Dashboard SQL Editor\n');
  console.log('⚠️  Since direct SQL execution is restricted, follow these steps:\n');
  console.log('1. Open Supabase Dashboard: https://app.supabase.com');
  console.log('2. Go to SQL Editor');
  console.log('3. Create a new query');
  console.log('4. Copy the contents of: sql/onboarding_schema.sql');
  console.log('5. Paste and run in the SQL Editor\n');
  console.log('Alternatively, we can create individual migrations...\n');

  // Read the schema file
  const schemaPath = path.join(__dirname, '../sql/onboarding_schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  console.log(`✅ Schema file read successfully (${schema.length} bytes)`);
  console.log('\nSchema file location:');
  console.log(`   ${schemaPath}\n`);

  console.log('📋 Next steps:');
  console.log('1. Open the file above');
  console.log('2. Copy all contents');
  console.log('3. Paste into Supabase SQL Editor');
  console.log('4. Click "Run"\n');
}

main();
