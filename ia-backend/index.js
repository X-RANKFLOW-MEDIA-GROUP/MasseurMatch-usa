import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

if (!DEEPSEEK_API_KEY) {
  console.error("❌ DEEPSEEK_API_KEY is missing in .env");
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// Rota de teste simples
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "IA backend is running 🚀" });
});

// Rota principal de chat com a DeepSeek
app.post("/deepseek", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const response = await fetch(
      "https://api.deepseek.com/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content:
                "You are Knotty AI, an inclusive assistant that helps users understand and use the MasseurMatch platform. Be friendly, concise and clear.",
            },
            ...messages,
          ],
        }),
      }
    );

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
