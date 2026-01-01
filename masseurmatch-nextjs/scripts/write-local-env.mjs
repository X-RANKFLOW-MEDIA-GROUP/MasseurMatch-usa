import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(appRoot, "..");
const envPath = path.join(appRoot, ".env.local");

function pick(value, fallback) {
  return value ?? fallback ?? "";
}

const statusRaw = execSync("npx supabase status --output json", {
  cwd: repoRoot,
  stdio: ["ignore", "pipe", "pipe"],
}).toString();

const status = JSON.parse(statusRaw);
const apiUrl = pick(status.api_url, status.API_URL);
const anonKey = pick(status.anon_key, status.ANON_KEY);
const serviceRoleKey = pick(status.service_role_key, status.SERVICE_ROLE_KEY);

if (!apiUrl || !anonKey || !serviceRoleKey) {
  throw new Error("Supabase status is missing required fields for local env.");
}

const updates = new Map([
  ["NEXT_PUBLIC_SUPABASE_URL", apiUrl],
  ["SUPABASE_URL", apiUrl],
  ["NEXT_PUBLIC_SUPABASE_ANON_KEY", anonKey],
  ["SUPABASE_ANON_KEY", anonKey],
  ["SUPABASE_SERVICE_ROLE_KEY", serviceRoleKey],
]);

const existing = fs.existsSync(envPath)
  ? fs.readFileSync(envPath, "utf8").split(/\r?\n/)
  : [];

const output = [];
const seen = new Set();

for (const line of existing) {
  if (!line || line.trim().startsWith("#") || !line.includes("=")) {
    output.push(line);
    continue;
  }

  const [key] = line.split("=");
  if (updates.has(key)) {
    output.push(`${key}=${updates.get(key)}`);
    seen.add(key);
    continue;
  }

  output.push(line);
}

for (const [key, value] of updates.entries()) {
  if (!seen.has(key)) {
    output.push(`${key}=${value}`);
  }
}

fs.writeFileSync(envPath, output.join("\n"));
console.log("Updated .env.local with local Supabase keys.");
