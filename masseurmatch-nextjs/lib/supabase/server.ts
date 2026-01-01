import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";

type CookieStore = Awaited<ReturnType<typeof cookies>>;

async function createServerSupabaseClient() {
  // Handle case where cookies() is called outside request context (e.g., during build)
  let cookieStore: CookieStore;

  try {
    cookieStore = await cookies();
  } catch {
    // During static generation, create a client without cookies
    // This allows read-only operations to work during build
    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return [];
          },
          setAll() {
            // No-op during static generation
          },
        },
      }
    );
  }

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

export { createServerSupabaseClient };
export { createServerSupabaseClient as supabaseServer };
export { createServerSupabaseClient as createClient };
