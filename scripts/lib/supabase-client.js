const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const ENV_PATH = path.resolve(__dirname, "..", "..", ".env.local");

function loadEnvFile() {
  if (!fs.existsSync(ENV_PATH)) {
    return;
  }

  const envContent = fs.readFileSync(ENV_PATH, "utf-8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (!match) {
      return;
    }

    const key = match[1].trim();
    const value = match[2].trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

function getSupabaseClient() {
  loadEnvFile();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "❌ Erro: NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY devem estar configurados no .env.local"
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

module.exports = {
  getSupabaseClient,
};
