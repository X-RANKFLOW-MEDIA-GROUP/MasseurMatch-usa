// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is required");
}
if (!supabaseAnonKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is required");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to create admin client (only use on server-side)
export function createServiceRoleClient() {
  if (typeof window !== 'undefined') {
    throw new Error('createServiceRoleClient must be called from the server.');
  }
  if (!supabaseServiceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required on the server to create a service role client.');
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Lazy initialization of admin client - only created when accessed
let _supabaseAdmin: ReturnType<typeof createClient> | null = null;
export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    if (!_supabaseAdmin) {
      if (typeof window !== 'undefined') {
        throw new Error('supabaseAdmin can only be used on the server side');
      }
      if (!supabaseServiceRoleKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for supabaseAdmin');
      }
      _supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
    }
    return _supabaseAdmin[prop as keyof typeof _supabaseAdmin];
  }
});
