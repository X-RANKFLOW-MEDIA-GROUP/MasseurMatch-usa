import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";
import rateLimit from "express-rate-limit";
import NodeCache from "node-cache";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;
const GEOCODING_PROVIDER =
  process.env.GEOCODING_PROVIDER || (MAPBOX_TOKEN ? "mapbox" : "nominatim");
const NOMINATIM_USER_AGENT =
  process.env.NOMINATIM_USER_AGENT || "MasseurMatch/1.0 (support@masseurmatch.com)";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ===== Check envs =====
if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("❌ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing");
  process.exit(1);
}

if (!DEEPSEEK_API_KEY) {
  console.error("❌ DEEPSEEK_API_KEY is missing in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

app.use(cors());
app.use(express.json());

const geoCache = new NodeCache({ stdTTL: 60 * 60 * 6, checkperiod: 600 });
const geoLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

// Simple health check route
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "IA backend is running 🚀" });
});

function normalizeStateCode(value = "") {
  const raw = value.trim();
  if (!raw) return "";
  if (raw.length === 2) return raw.toUpperCase();

  const STATES = {
    Alabama: "AL",
    Alaska: "AK",
    Arizona: "AZ",
    Arkansas: "AR",
    California: "CA",
    Colorado: "CO",
    Connecticut: "CT",
    Delaware: "DE",
    Florida: "FL",
    Georgia: "GA",
    Hawaii: "HI",
    Idaho: "ID",
    Illinois: "IL",
    Indiana: "IN",
    Iowa: "IA",
    Kansas: "KS",
    Kentucky: "KY",
    Louisiana: "LA",
    Maine: "ME",
    Maryland: "MD",
    Massachusetts: "MA",
    Michigan: "MI",
    Minnesota: "MN",
    Mississippi: "MS",
    Missouri: "MO",
    Montana: "MT",
    Nebraska: "NE",
    Nevada: "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    Ohio: "OH",
    Oklahoma: "OK",
    Oregon: "OR",
    Pennsylvania: "PA",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    Tennessee: "TN",
    Texas: "TX",
    Utah: "UT",
    Vermont: "VT",
    Virginia: "VA",
    Washington: "WA",
    "West Virginia": "WV",
    Wisconsin: "WI",
    Wyoming: "WY",
    "District of Columbia": "DC",
  };

  return STATES[raw] || raw;
}

function toPayload({ city, state, stateCode, zip, country, lat, lng, source }) {
  return {
    city: city || "",
    state: state || "",
    stateCode: stateCode || normalizeStateCode(state || ""),
    zip: zip || "",
    country: country || "",
    lat: typeof lat === "number" ? lat : null,
    lng: typeof lng === "number" ? lng : null,
    source,
  };
}

async function geocodeMapbox(query) {
  if (!MAPBOX_TOKEN) {
    throw new Error("MAPBOX_TOKEN is missing");
  }

  const url =
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    encodeURIComponent(query) +
    ".json?limit=1&types=place,postcode,address&language=en&access_token=" +
    encodeURIComponent(MAPBOX_TOKEN);

  const resp = await fetch(url);
  if (!resp.ok) throw new Error("Mapbox geocoding failed");
  const data = await resp.json();
  const feature = data?.features?.[0];
  if (!feature) return null;

  const context = feature.context || [];
  const place =
    feature.place_type?.includes("place")
      ? feature.text
      : context.find((c) => c.id?.startsWith("place"))?.text;
  const region = context.find((c) => c.id?.startsWith("region")) || {};
  const country = context.find((c) => c.id?.startsWith("country")) || {};
  const postcode = context.find((c) => c.id?.startsWith("postcode")) || {};
  const [lng, lat] = feature.center || [];

  return toPayload({
    city: place,
    state: region.text,
    stateCode: region.short_code ? region.short_code.replace("us-", "").toUpperCase() : "",
    zip: postcode.text,
    country: country.text,
    lat: typeof lat === "number" ? lat : null,
    lng: typeof lng === "number" ? lng : null,
    source: "mapbox",
  });
}

async function reverseMapbox(lat, lng) {
  if (!MAPBOX_TOKEN) {
    throw new Error("MAPBOX_TOKEN is missing");
  }

  const url =
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    `${lng},${lat}.json?limit=1&types=place,postcode,address&language=en&access_token=` +
    encodeURIComponent(MAPBOX_TOKEN);

  const resp = await fetch(url);
  if (!resp.ok) throw new Error("Mapbox reverse geocoding failed");
  const data = await resp.json();
  const feature = data?.features?.[0];
  if (!feature) return null;

  const context = feature.context || [];
  const place =
    feature.place_type?.includes("place")
      ? feature.text
      : context.find((c) => c.id?.startsWith("place"))?.text;
  const region = context.find((c) => c.id?.startsWith("region")) || {};
  const country = context.find((c) => c.id?.startsWith("country")) || {};
  const postcode = context.find((c) => c.id?.startsWith("postcode")) || {};

  return toPayload({
    city: place,
    state: region.text,
    stateCode: region.short_code ? region.short_code.replace("us-", "").toUpperCase() : "",
    zip: postcode.text,
    country: country.text,
    lat,
    lng,
    source: "mapbox",
  });
}

async function geocodeNominatim(query) {
  const url =
    "https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=1&q=" +
    encodeURIComponent(query);
  const resp = await fetch(url, {
    headers: { "User-Agent": NOMINATIM_USER_AGENT },
  });
  if (!resp.ok) throw new Error("Nominatim geocoding failed");
  const data = await resp.json();
  const row = Array.isArray(data) ? data[0] : null;
  if (!row) return null;
  const addr = row.address || {};
  const city = addr.city || addr.town || addr.village || addr.hamlet || "";
  const state = addr.state || addr.region || "";
  const zip = addr.postcode || "";
  const country = addr.country || "";
  return toPayload({
    city,
    state,
    stateCode: normalizeStateCode(state),
    zip,
    country,
    lat: Number(row.lat),
    lng: Number(row.lon),
    source: "nominatim",
  });
}

async function reverseNominatim(lat, lng) {
  const url =
    "https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1" +
    `&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}`;
  const resp = await fetch(url, {
    headers: { "User-Agent": NOMINATIM_USER_AGENT },
  });
  if (!resp.ok) throw new Error("Nominatim reverse geocoding failed");
  const data = await resp.json();
  const addr = data?.address || {};
  const city = addr.city || addr.town || addr.village || addr.hamlet || "";
  const state = addr.state || addr.region || "";
  const zip = addr.postcode || "";
  const country = addr.country || "";
  return toPayload({
    city,
    state,
    stateCode: normalizeStateCode(state),
    zip,
    country,
    lat: Number(data?.lat),
    lng: Number(data?.lon),
    source: "nominatim",
  });
}

app.get("/geocode", geoLimiter, async (req, res) => {
  try {
    const query = String(req.query.query || "").trim();
    if (!query) {
      return res.status(400).json({ error: "query is required" });
    }

    const cacheKey = `geocode:${GEOCODING_PROVIDER}:${query.toLowerCase()}`;
    const cached = geoCache.get(cacheKey);
    if (cached) return res.json(cached);

    const payload =
      GEOCODING_PROVIDER === "mapbox"
        ? await geocodeMapbox(query)
        : await geocodeNominatim(query);

    if (!payload) {
      return res.status(404).json({ error: "No results found" });
    }

    geoCache.set(cacheKey, payload);
    return res.json(payload);
  } catch (err) {
    console.error("❌ Geocode error:", err);
    return res.status(500).json({ error: "Geocode failed" });
  }
});

app.get("/reverse-geocode", geoLimiter, async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ error: "lat and lng are required" });
    }

    const cacheKey = `reverse:${GEOCODING_PROVIDER}:${lat.toFixed(4)},${lng.toFixed(4)}`;
    const cached = geoCache.get(cacheKey);
    if (cached) return res.json(cached);

    const payload =
      GEOCODING_PROVIDER === "mapbox"
        ? await reverseMapbox(lat, lng)
        : await reverseNominatim(lat, lng);

    if (!payload) {
      return res.status(404).json({ error: "No results found" });
    }

    geoCache.set(cacheKey, payload);
    return res.json(payload);
  } catch (err) {
    console.error("❌ Reverse geocode error:", err);
    return res.status(500).json({ error: "Reverse geocode failed" });
  }
});

/**
 * Fetch a snapshot of approved therapists.
 * Adjust fields to match your "therapists" table.
 */
async function getTherapistsSnapshot() {
  try {
    const { data, error } = await supabase
      .from("therapists")
      .select(
        `
        id,
        display_name,
        full_name,
        location,
        services,
        languages,
        status
      `
      )
      .eq("status", "active")
      .limit(30);

    if (error) {
      console.error("❌ Error fetching therapists from Supabase:", error);
      return [];
    }

    console.log("📊 Therapists loaded for AI directory:", (data || []).length);
    return data || [];
  } catch (err) {
    console.error("❌ Unexpected error fetching therapists:", err);
    return [];
  }
}

// Main chat route with DeepSeek
app.post("/deepseek", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array is required" });
    }

    // 1) Fetch approved therapists from Supabase
    const therapists = await getTherapistsSnapshot();
    const directoryJson = JSON.stringify(therapists);

    // 2) Build messages for the AI with the directory in context
    const dsMessages = [
      {
        role: "system",
        content:
          "LANGUAGE INSTRUCTION (MANDATORY):\n" +
          "You must respond ONLY in **English**. This rule is absolute.\n" +
          "Even if the user writes in another language, you must understand it and reply in English.\n" +
          "Do not mix languages in the same answer, except for proper names (cities, people, brands).\n\n" +
          "ROLE:\n" +
          "You are Knotty AI, the official assistant of the MasseurMatch platform.\n" +
          "You help users find real massage therapists based on the provided directory.\n" +
          "Be friendly, inclusive, and concise, but still professional and clear.",
      },
      {
        role: "system",
        content:
          "RESPONSE RULES:\n" +
          "1) Use ONLY therapists from the provided directory when making suggestions.\n" +
          "2) NEVER return the full JSON or raw directory to the user.\n" +
          "3) Suggest at MOST 3 therapists per answer.\n" +
          "4) For each suggested therapist, show: public name, city/state (from location), main services and languages.\n" +
          "5) If the user's request is vague (no city or no service type), ask up to 2 short clarifying questions before recommending.\n" +
          "6) If there are no good matches, say that clearly and suggest adjusting city, service type or language.\n" +
          "7) Keep answers short: ideally 1–3 short paragraphs or a small bullet list.",
      },
      {
        role: "system",
        content:
          "This is the current therapist directory in JSON format. " +
          "You must use it INTERNALLY to decide which therapists to recommend, " +
          "but you MUST NOT show this JSON directly to the user:\n\n" +
          directoryJson,
      },
      ...messages,
    ];

    // 3) Call DeepSeek API
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: dsMessages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ DeepSeek API error:", errText);
      return res
        .status(500)
        .json({ error: "DeepSeek API error", details: errText });
    }

    const data = await response.json();
    const reply =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    return res.json({ reply });
  } catch (error) {
    console.error("❌ Internal server error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", details: String(error) });
  }
});

app.listen(PORT, () => {
  console.log(`✅ IA backend running on http://localhost:${PORT}`);
});
