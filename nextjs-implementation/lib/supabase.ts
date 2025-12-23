import { createClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Client-side Supabase client (for use in Client Components)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-side Supabase client (for Server Components and Server Actions)
// This maintains user authentication via cookies
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Handle error (e.g., in middleware)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.delete({ name, ...options });
          } catch (error) {
            // Handle error (e.g., in middleware)
          }
        },
      },
    }
  );
}

// Admin client (for server-only operations with full privileges)
// Uses service_role key - NEVER expose this to the client!
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Type helper for database types (optional but recommended)
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
          // Add all other fields from your therapists table
        };
      };
      // Add other tables as needed
    };
  };
};
