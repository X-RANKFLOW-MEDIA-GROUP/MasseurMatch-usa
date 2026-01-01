import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = requireEnv(
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

export const supabase = createClient();
