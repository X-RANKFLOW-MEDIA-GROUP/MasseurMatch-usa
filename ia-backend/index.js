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

app.listen(PORT, () => {
  console.log(`✅ IA backend running on http://localhost:${PORT}`);
});
