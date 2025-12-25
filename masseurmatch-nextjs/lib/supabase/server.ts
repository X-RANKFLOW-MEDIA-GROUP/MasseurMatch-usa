import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type CookieStore = Awaited<ReturnType<typeof cookies>>;

function getCookieValue(cookieStore: CookieStore, name: string) {
  if (typeof cookieStore.get === "function") {
    return cookieStore.get(name)?.value;
  }
  if (typeof cookieStore.getAll === "function") {
    return cookieStore
      .getAll()
      .find((cookie) => cookie.name === name)
      ?.value;
  }
  return undefined;
}

async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
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
