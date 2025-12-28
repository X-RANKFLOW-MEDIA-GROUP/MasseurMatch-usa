const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ijsdpozjfjjufjsoexod.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlqc2Rwb3pqZmpqdWZqc29leG9kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjAwNzE1NiwiZXhwIjoyMDc3NTgzMTU2fQ.WFqvMNcsLshaWzaVgW63RT_c9ptIB_r9NjHYDDR8o1k';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

(async () => {
  try {
    console.log('Testing connection...');
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    console.log('Error code:', error?.code);
    console.log('Error message:', error?.message);
    console.log('Data:', data);
    
    // Ignore expected errors
    if (error && error.code !== 'PGRST116' && error.code !== '42P01' && error.code !== '42501') {
      console.error('Database test failed:', error.message);
      process.exit(1);
    }
    
    console.log('Connection successful!');
    process.exit(0);
  } catch (err) {
    console.error('Connection error:', err);
    process.exit(1);
  }
})();
