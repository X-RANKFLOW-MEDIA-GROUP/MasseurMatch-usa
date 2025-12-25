"use strict";

import { createClient } from "@supabase/supabase-js";

type Args = {
  email?: string;
  password?: string;
};

const parseArgs = (): Args => {
  const rawArgs = process.argv.slice(2);
  return rawArgs.reduce<Args>((acc, arg) => {
    const [key, value] = arg.split("=");
    if (!key.startsWith("--") || !value) return acc;
    acc[key.slice(2) as keyof Args] = value;
    return acc;
  }, {});
};

const { email = "e@e.com", password = "123456" } = parseArgs();
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error(
    "Error: NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY are required."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function createUser() {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    if (error.message.includes("already exists")) {
      console.warn(`User ${email} already exists. Skipping creation.`);
      process.exit(0);
    }
    console.error("Failed to create user:", error.message);
    process.exit(1);
  }

  const user = data?.user;
  console.log("Test user created:", {
    id: user?.id,
    email: user?.email,
  });
}

createUser().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
