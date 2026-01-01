/**
 * Create SEO-friendly therapist profiles for testing or launch prep.
 *
 * Usage:
 *   node scripts/seed-seo-therapists.js --csv path\\to\\profiles.csv
 *   node scripts/seed-seo-therapists.js --csv profiles.csv --count 50 --dry-run
 *   node scripts/seed-seo-therapists.js --count 50
 *
 * CSV columns (snake_case recommended):
 * - Required: display_name (or full_name), city, state, email (if user_id not provided)
 * - Optional: user_id, password, slug, headline, about, bio, phone, website, instagram,
 *   whatsapp, neighborhood, zip_code, latitude, longitude, country, profile_photo,
 *   services, massage_techniques, languages, payment_methods, studio_amenities,
 *   mobile_extras, additional_services, services_headline, specialties_headline,
 *   rate_60, rate_90, rate_outcall, rating, override_reviews_count, mobile_service_radius,
 *   years_experience, availability, payments, discounts, status
 *
 * Notes:
 * - Array fields accept JSON arrays or pipe/semicolon/comma-separated values.
 * - JSON fields (availability, payments, discounts) accept JSON objects.
 */

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const envPaths = [
  path.join(__dirname, "..", ".env.local"),
  path.join(__dirname, "..", "masseurmatch-nextjs", ".env.local"),
];

for (const envPath of envPaths) {
  if (!fs.existsSync(envPath)) continue;
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (!match) return;
    const key = match[1].trim();
    const value = match[2].trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
  break;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const args = process.argv.slice(2);
const countIndex = args.indexOf("--count");
const csvIndex = args.indexOf("--csv");
const defaultPasswordIndex = args.indexOf("--default-password");
const requestedCount = countIndex >= 0 ? parseInt(args[countIndex + 1], 10) : 50;
const count = Number.isFinite(requestedCount) && requestedCount > 0 ? requestedCount : 50;
const csvPath = csvIndex >= 0 ? args[csvIndex + 1] : null;
const defaultPassword =
  defaultPasswordIndex >= 0 ? args[defaultPasswordIndex + 1] : "Seed12345!";
const dryRun = args.includes("--dry-run");

const firstNames = [
  "Adrian",
  "Mateo",
  "Lucas",
  "Gabriel",
  "Victor",
  "Samuel",
  "Julian",
  "Andre",
  "Rafael",
  "Noah",
  "Leo",
  "Ethan",
  "Diego",
  "Marco",
  "Thiago",
  "Nicolas",
  "Daniel",
  "Bruno",
  "Pedro",
  "Enzo",
];

const lastNames = [
  "Silva",
  "Santos",
  "Garcia",
  "Mendez",
  "Torres",
  "Alvarez",
  "Lopez",
  "Martins",
  "Costa",
  "Reed",
  "Walker",
  "Hill",
  "Flores",
  "Murphy",
  "Perez",
  "Romero",
  "Young",
  "Brooks",
  "Diaz",
  "Rivera",
];

const cities = [
  { city: "Los Angeles", state: "CA", zip: "90001", lat: 34.0522, lng: -118.2437, neighborhood: "Downtown" },
  { city: "Miami", state: "FL", zip: "33101", lat: 25.7617, lng: -80.1918, neighborhood: "Brickell" },
  { city: "New York", state: "NY", zip: "10001", lat: 40.7128, lng: -74.006, neighborhood: "Midtown" },
  { city: "Dallas", state: "TX", zip: "75201", lat: 32.7767, lng: -96.797, neighborhood: "Uptown" },
  { city: "Chicago", state: "IL", zip: "60601", lat: 41.8781, lng: -87.6298, neighborhood: "River North" },
  { city: "Atlanta", state: "GA", zip: "30303", lat: 33.749, lng: -84.388, neighborhood: "Midtown" },
  { city: "Houston", state: "TX", zip: "77002", lat: 29.7604, lng: -95.3698, neighborhood: "Downtown" },
  { city: "Seattle", state: "WA", zip: "98101", lat: 47.6062, lng: -122.3321, neighborhood: "Belltown" },
  { city: "San Francisco", state: "CA", zip: "94103", lat: 37.7749, lng: -122.4194, neighborhood: "SoMa" },
  { city: "Las Vegas", state: "NV", zip: "89109", lat: 36.1699, lng: -115.1398, neighborhood: "The Strip" },
];

const specialties = [
  {
    headline: "Deep Tissue & Sports Recovery",
    services: ["Deep Tissue Massage", "Sports Massage", "Trigger Point", "Myofascial Release"],
    techniques: ["Deep Tissue", "Sports", "Trigger Point", "Myofascial Release"],
    about: "Focused on recovery, mobility, and relief for active clients.",
  },
  {
    headline: "Relaxation & Stress Relief",
    services: ["Swedish Massage", "Aromatherapy", "Hot Stone", "Relaxation"],
    techniques: ["Swedish", "Aromatherapy", "Hot Stone"],
    about: "Calming sessions that reduce stress and improve sleep quality.",
  },
  {
    headline: "Therapeutic Pain Relief",
    services: ["Therapeutic Massage", "Deep Tissue", "Cupping", "Stretching"],
    techniques: ["Therapeutic", "Cupping", "Stretching"],
    about: "Targeted work for chronic tension and posture-related discomfort.",
  },
  {
    headline: "Thai Stretching & Mobility",
    services: ["Thai Massage", "Assisted Stretching", "Mobility Work"],
    techniques: ["Thai", "Stretching", "Mobility"],
    about: "Dynamic sessions that improve flexibility and range of motion.",
  },
  {
    headline: "Mobile & Hotel-Friendly Care",
    services: ["Mobile Massage", "In-Room Sessions", "Relaxation"],
    techniques: ["Swedish", "Relaxation"],
    about: "On-site sessions designed for travelers and busy professionals.",
  },
  {
    headline: "Lymphatic & Wellness Reset",
    services: ["Lymphatic Drainage", "Gentle Massage", "Wellness Reset"],
    techniques: ["Lymphatic", "Gentle", "Wellness"],
    about: "Light-pressure care that supports circulation and recovery.",
  },
];

const languagesPool = [
  ["English"],
  ["English", "Spanish"],
  ["English", "Portuguese"],
  ["English", "French"],
  ["English", "Italian"],
];

const profilePhotos = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=800&h=800&fit=crop",
];

const arrayFields = new Set([
  "services",
  "massage_techniques",
  "languages",
  "payment_methods",
  "studio_amenities",
  "mobile_extras",
  "additional_services",
  "special_discount_groups",
  "business_trips",
  "photos",
  "gallery_urls",
  "gallery",
]);

const jsonFields = new Set(["availability", "payments", "discounts", "social_links", "rates"]);
const numberFields = new Set([
  "rating",
  "override_reviews_count",
  "mobile_service_radius",
  "outcall_radius",
  "years_experience",
]);
const booleanFields = new Set(["accepts_first_timers", "prefers_lgbtq_clients", "enable_mapping"]);

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function pick(list, index) {
  return list[index % list.length];
}

function parseCsv(content) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];
    if (inQuotes) {
      if (char === '"') {
        if (content[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const headerRow = rows.shift() || [];
  const headers = headerRow.map((h) =>
    h
      .replace(/^\uFEFF/, "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "")
  );

  return rows
    .filter((cells) => cells.some((cell) => cell && cell.trim().length))
    .map((cells) => {
      const record = {};
      headers.forEach((header, index) => {
        if (!header) return;
        record[header] = (cells[index] ?? "").trim();
      });
      return record;
    });
}

function parseList(value) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch (error) {
      // Ignore JSON parse errors and fallback to delimiter split.
    }
  }
  const separator = trimmed.includes("|")
    ? "|"
    : trimmed.includes(";")
    ? ";"
    : trimmed.includes(",")
    ? ","
    : null;
  if (!separator) return [trimmed];
  return trimmed
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseNumber(value) {
  if (!value) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function parseBoolean(value) {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (["true", "1", "yes", "y"].includes(normalized)) return true;
  if (["false", "0", "no", "n"].includes(normalized)) return false;
  return null;
}

function parseJson(value) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

function compactObject(input) {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined)
  );
}

function buildProfile(index) {
  const firstName = pick(firstNames, index);
  const lastName = pick(lastNames, index * 3);
  const city = pick(cities, index);
  const specialty = pick(specialties, index * 2);
  const displayName = `${firstName} ${lastName}`;
  const slugBase = slugify(`${displayName}-${city.city}-${city.state}`);
  const slug = `${slugBase}-${index + 1}`;
  const baseRate = 80 + (index % 6) * 10;
  const phone = `+1 (555) 2${String(index + 1).padStart(3, "0")}-0000`;

  const about = `${displayName} is a certified massage therapist in ${city.city}, ${city.state}. ${specialty.about} Sessions are tailored for comfort, clear boundaries, and consistent results.`;

  return {
    auth: {
      email: `seo${index + 1}@example.com`,
      password: defaultPassword,
      fullName: displayName,
    },
    therapist: {
      slug,
      display_name: displayName,
      full_name: displayName,
      headline: specialty.headline,
      about,
      city: city.city,
      state: city.state,
      country: "USA",
      neighborhood: city.neighborhood,
      zip_code: city.zip,
      latitude: city.lat.toString(),
      longitude: city.lng.toString(),
      services: specialty.services,
      massage_techniques: specialty.techniques,
      languages: pick(languagesPool, index),
      profile_photo: pick(profilePhotos, index),
      phone,
      email: `seo${index + 1}@example.com`,
      rate_60: `$${baseRate}`,
      rate_90: `$${baseRate + 30}`,
      status: "active",
    },
  };
}

function buildProfileFromCsv(row, index, slugSet) {
  const displayName = row.display_name || row.full_name;
  const city = row.city;
  const state = row.state;
  const email = row.email;
  const userId = row.user_id || null;

  if (!displayName || !city || !state) {
    return { error: `Row ${index + 1}: missing display_name/full_name, city, or state.` };
  }

  if (!userId && !email) {
    return { error: `Row ${index + 1}: missing email and user_id.` };
  }

  const baseSlug = row.slug || slugify(`${displayName}-${city}-${state}`);
  let slug = baseSlug;
  let suffix = 1;
  while (slugSet.has(slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
  slugSet.add(slug);

  const therapist = {
    slug,
    display_name: displayName,
    full_name: row.full_name || displayName,
    headline: row.headline || row.services_headline || undefined,
    about: row.about || row.bio || undefined,
    phone: row.phone || undefined,
    email: row.email || undefined,
    website: row.website || undefined,
    instagram: row.instagram || undefined,
    whatsapp: row.whatsapp || undefined,
    city,
    state,
    country: row.country || "USA",
    neighborhood: row.neighborhood || undefined,
    address: row.address || undefined,
    zip_code: row.zip_code || undefined,
    nearest_intersection: row.nearest_intersection || undefined,
    latitude: row.latitude || undefined,
    longitude: row.longitude || undefined,
    services_headline: row.services_headline || undefined,
    specialties_headline: row.specialties_headline || undefined,
    promotions_headline: row.promotions_headline || undefined,
    rate_60: row.rate_60 || undefined,
    rate_90: row.rate_90 || undefined,
    rate_outcall: row.rate_outcall || undefined,
    profile_photo: row.profile_photo || undefined,
    status: row.status || "active",
  };

  Object.keys(row).forEach((key) => {
    if (!arrayFields.has(key) && !jsonFields.has(key) && !numberFields.has(key) && !booleanFields.has(key)) {
      return;
    }
    if (arrayFields.has(key)) {
      therapist[key] = parseList(row[key]);
      return;
    }
    if (jsonFields.has(key)) {
      therapist[key] = parseJson(row[key]);
      return;
    }
    if (numberFields.has(key)) {
      therapist[key] = parseNumber(row[key]);
      return;
    }
    if (booleanFields.has(key)) {
      therapist[key] = parseBoolean(row[key]);
    }
  });

  return {
    auth: email
      ? {
          email,
          password: row.password || defaultPassword,
          fullName: displayName,
        }
      : null,
    therapist: compactObject(therapist),
    userId,
  };
}

async function findUserIdByEmail(email) {
  let page = 1;
  const perPage = 1000;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) {
      console.warn(`Unable to list users for ${email}: ${error.message}`);
      return null;
    }
    const match = data?.users?.find(
      (user) => user.email && user.email.toLowerCase() === email.toLowerCase()
    );
    if (match) return match.id;
    if (!data?.users || data.users.length < perPage) return null;
    page += 1;
  }
}

async function resolveUserId(record) {
  if (record.userId) return record.userId;
  if (!record.auth) return null;

  const { data, error } = await supabase.auth.admin.createUser({
    email: record.auth.email,
    password: record.auth.password,
    email_confirm: true,
    user_metadata: {
      full_name: record.auth.fullName,
    },
  });

  if (!error && data?.user?.id) {
    return data.user.id;
  }

  if (error && error.message && error.message.toLowerCase().includes("already registered")) {
    const existing = await findUserIdByEmail(record.auth.email);
    if (existing) return existing;
  }

  console.warn(`Skip ${record.auth.email}: ${error ? error.message : "unknown error"}`);
  return null;
}

async function createProfile(record) {
  const timestamp = new Date().toISOString();

  if (dryRun) {
    console.log(`[dry-run] ${record.therapist.display_name} -> ${record.therapist.city}, ${record.therapist.state}`);
    return record.auth?.email || record.therapist.display_name;
  }

  const userId = await resolveUserId(record);
  if (!userId) return null;

  const payload = {
    ...record.therapist,
    user_id: userId,
    created_at: timestamp,
    updated_at: timestamp,
  };

  const { error } = await supabase
    .from("therapists")
    .upsert(payload, { onConflict: "user_id" });

  if (error) {
    console.error(`Error creating profile for ${record.therapist.display_name}:`, error.message);
    return null;
  }

  console.log(`Created ${record.therapist.display_name} (${record.therapist.city}, ${record.therapist.state})`);
  return record.auth?.email || record.therapist.display_name;
}

function loadCsvRecords(csvFile) {
  const csvContent = fs.readFileSync(csvFile, "utf-8");
  const rows = parseCsv(csvContent);
  const slugSet = new Set();

  return rows
    .map((row, index) => buildProfileFromCsv(row, index, slugSet))
    .filter((record) => {
      if (record.error) {
        console.warn(record.error);
        return false;
      }
      return true;
    });
}

async function main() {
  let records = [];

  if (csvPath) {
    const resolvedPath = path.isAbsolute(csvPath)
      ? csvPath
      : path.resolve(process.cwd(), csvPath);
    if (!fs.existsSync(resolvedPath)) {
      console.error(`CSV file not found: ${resolvedPath}`);
      process.exit(1);
    }
    records = loadCsvRecords(resolvedPath);
    if (count && records.length > count) {
      records = records.slice(0, count);
    }
  } else {
    records = Array.from({ length: count }, (_, index) => buildProfile(index));
  }

  console.log(`Creating ${records.length} therapist profiles...`);
  if (dryRun) {
    console.log("Dry run enabled. No data will be written.");
  }

  const created = [];
  for (const record of records) {
    // eslint-disable-next-line no-await-in-loop
    const email = await createProfile(record);
    if (email) created.push(email);
  }

  if (!dryRun) {
    console.log(`Completed. Created ${created.length} profiles.`);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
