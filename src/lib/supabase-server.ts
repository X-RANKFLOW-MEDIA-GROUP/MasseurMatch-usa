import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const emptyListResponse = { data: [], error: null };
const emptySingleResponse = { data: null, error: null };

function createLimitHandler() {
  return {
    limit: async () => emptyListResponse,
  };
}

function createConditionQuery() {
  const limitHandler = createLimitHandler();
  return {
    single: async () => emptySingleResponse,
    order: () => limitHandler,
    ilike: () => limitHandler,
    contains: () => createLimitHandler(),
  };
}

function createSelectQuery() {
  const limitHandler = createLimitHandler();
  return {
    eq: () => createConditionQuery(),
    order: () => limitHandler,
  };
}

function createMockFrom() {
  return {
    select: () => createSelectQuery(),
  };
}

function createMockClient() {
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      signOut: async () => ({ error: null }),
    },
    from: createMockFrom,
  } as ReturnType<typeof createServerClient>;
}

export async function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Return a mock client during build if env vars not set
  if (!supabaseUrl || !supabaseAnonKey) {
    return createMockClient();
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from Server Component - ignore
        }
      },
    },
  });
}
