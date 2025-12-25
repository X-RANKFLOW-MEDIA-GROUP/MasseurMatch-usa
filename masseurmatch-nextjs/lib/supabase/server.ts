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
        get(name: string) {
          return getCookieValue(cookieStore, name);
        },
        set(name, value, options) {
          if (typeof cookieStore.set === "function") {
            cookieStore.set({ name, value, ...options });
          }
        },
        delete(name, options) {
          if (typeof cookieStore.delete === "function") {
            cookieStore.delete({ name, ...options });
          }
        },
      },
    }
  );
}

export { createServerSupabaseClient };
export { createServerSupabaseClient as supabaseServer };
