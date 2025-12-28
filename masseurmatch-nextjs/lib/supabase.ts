import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  );
}

// Client-side Supabase client (for use in Client Components)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client (for server-only operations with full privileges).
// Returns null if the service key is not configured.
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export type Database = {
  public: {
    Tables: {
      therapists: {
        Row: {
          user_id: string;
          slug: string;
          display_name: string;
          full_name: string;
          headline: string;
          about: string;
          city: string;
          state: string;
        };
      };
    };
  };
};
