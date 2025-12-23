import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

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

// Simple health check route
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "IA backend is running 🚀" });
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
      .eq("status", "approved")
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

// ========================================
// THERAPIST PROFILE ENDPOINTS
// ========================================

/**
 * GET /api/therapist/:user_id
 * Public endpoint - Get therapist profile by user_id
 * Used for public profile pages (e.g., /therapist/abc123)
 */
app.get("/api/therapist/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    // Fetch therapist profile from Supabase
    const { data, error } = await supabase
      .from("therapists")
      .select("*")
      .eq("user_id", user_id)
      .eq("status", "active") // Only show active profiles
      .single();

    if (error || !data) {
      return res.status(404).json({
        error: "Profile not found",
        details: error?.message || "No profile found with this ID",
      });
    }

    // Return the profile data
    return res.json({
      success: true,
      therapist: data,
    });
  } catch (error) {
    console.error("❌ Error fetching therapist profile:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: String(error),
    });
  }
});

/**
 * GET /api/therapist/dashboard/:user_id
 * Private endpoint - Get therapist's own profile for editing
 * Requires authentication (add auth middleware in production)
 */
app.get("/api/therapist/dashboard/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    // TODO: Add authentication middleware to verify user owns this profile
    // const authHeader = req.headers.authorization;

    // Fetch therapist profile (including non-public fields)
    const { data, error } = await supabase
      .from("therapists")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        error: "Profile not found",
        details: error?.message || "No profile found with this ID",
      });
    }

    return res.json({
      success: true,
      therapist: data,
    });
  } catch (error) {
    console.error("❌ Error fetching dashboard profile:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: String(error),
    });
  }
});

/**
 * PUT /api/therapist/update/:user_id
 * Private endpoint - Update therapist profile
 * Requires authentication
 */
app.put("/api/therapist/update/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const updates = req.body;

    // TODO: Add authentication middleware to verify user owns this profile
    // const authHeader = req.headers.authorization;

    // Whitelist of allowed fields to update
    const allowedFields = [
      "display_name",
      "full_name",
      "headline",
      "about",
      "philosophy",
      "phone",
      "city",
      "state",
      "country",
      "neighborhood",
      "address",
      "zip_code",
      "nearest_intersection",
      "latitude",
      "longitude",
      "mobile_service_radius",
      "services_headline",
      "specialties_headline",
      "promotions_headline",
      "services",
      "massage_techniques",
      "studio_amenities",
      "mobile_extras",
      "additional_services",
      "products_used",
      "rate_60",
      "rate_90",
      "rate_outcall",
      "payment_methods",
      "regular_discounts",
      "day_of_week_discount",
      "weekly_specials",
      "special_discount_groups",
      "availability",
      "degrees",
      "affiliations",
      "massage_start_date",
      "languages",
      "business_trips",
      "website",
      "instagram",
      "whatsapp",
      "birthdate",
      "years_experience",
      "profile_photo",
      "gallery",
    ];

    // Filter updates to only allowed fields
    const filteredUpdates = {};
    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    // Add updated_at timestamp
    filteredUpdates.updated_at = new Date().toISOString();

    // Update the profile
    const { data, error } = await supabase
      .from("therapists")
      .update(filteredUpdates)
      .eq("user_id", user_id)
      .select()
      .single();

    if (error) {
      console.error("❌ Error updating therapist profile:", error);
      return res.status(400).json({
        error: "Failed to update profile",
        details: error.message,
      });
    }

    return res.json({
      success: true,
      message: "Profile updated successfully",
      therapist: data,
    });
  } catch (error) {
    console.error("❌ Error in profile update:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: String(error),
    });
  }
});

/**
 * GET /api/therapists
 * Public endpoint - Get all active therapists (with optional filters)
 * Query params: city, services, limit, offset
 */
app.get("/api/therapists", async (req, res) => {
  try {
    const { city, services, limit = 50, offset = 0 } = req.query;

    let query = supabase
      .from("therapists")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    // Add city filter if provided
    if (city) {
      query = query.ilike("city", `%${city}%`);
    }

    // Add services filter if provided
    if (services) {
      query = query.contains("services", [services]);
    }

    const { data, error, count } = await query;

    if (error) {
      return res.status(400).json({
        error: "Failed to fetch therapists",
        details: error.message,
      });
    }

    return res.json({
      success: true,
      therapists: data || [],
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    console.error("❌ Error fetching therapists:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: String(error),
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ IA backend running on http://localhost:${PORT}`);
  console.log(`\n📌 Available endpoints:`);
  console.log(`   GET  /api/therapist/:user_id          - View public profile`);
  console.log(`   GET  /api/therapist/dashboard/:user_id - View own profile (auth required)`);
  console.log(`   PUT  /api/therapist/update/:user_id   - Update profile (auth required)`);
  console.log(`   GET  /api/therapists                   - List all therapists\n`);
});
