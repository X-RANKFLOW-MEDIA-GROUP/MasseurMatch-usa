"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Send, Bot, User, ArrowLeft, Sparkles } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const suggestedQuestions = [
  "What type of massage is best for back pain?",
  "How often should I get a massage?",
  "What's the difference between Swedish and deep tissue?",
  "How do I prepare for my first massage?",
];

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm KnottyBot, your massage therapy assistant. I can help you find the right type of massage, answer questions about techniques, or give you tips for wellness. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    // Simulate AI response - in production, call your AI API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const responses: Record<string, string> = {
      "back pain": "For back pain, I'd recommend starting with a deep tissue massage. It targets the deeper layers of muscle and connective tissue, which is great for chronic tension. If you're new to massage, Swedish massage with medium pressure is also effective and more gentle.",
      "how often": "For general wellness, once a month is a good starting point. If you're dealing with chronic pain or high stress, every 2 weeks may be more beneficial. Athletes or those in physical jobs might benefit from weekly sessions during intense periods.",
      "swedish": "Swedish massage uses long, flowing strokes with light to medium pressure - great for relaxation and first-timers. Deep tissue uses slower, more forceful strokes to target deep muscle layers - ideal for chronic tension and pain relief.",
      "prepare": "Great question! Here are some tips: 1) Hydrate well before and after, 2) Avoid heavy meals 1-2 hours before, 3) Shower beforehand, 4) Communicate your preferences and any health conditions to your therapist, 5) Arrive 10-15 minutes early to relax.",
    };

    let response = "That's a great question! While I can provide general guidance, I'd recommend consulting with a licensed massage therapist for personalized advice. Would you like help finding a therapist near you?";

    for (const [key, value] of Object.entries(responses)) {
      if (userMessage.toLowerCase().includes(key)) {
        response = value;
        break;
      }
    }

    setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    setLoading(false);
  };

  const handleSuggestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-10">
        <nav className="mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-white">KnottyBot</h1>
                <p className="text-xs text-slate-400">AI Massage Assistant</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Sparkles className="h-3 w-3" />
            Powered by AI
          </div>
        </nav>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  message.role === "user"
                    ? "bg-violet-600"
                    : "bg-gradient-to-br from-violet-600 to-indigo-600"
                }`}
              >
                {message.role === "user" ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-violet-600 text-white"
                    : "bg-white/5 border border-white/10 text-slate-300"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="px-4 pb-4">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs text-slate-500 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSuggestion(q)}
                  className="text-sm px-3 py-1.5 rounded-full border border-white/10 text-slate-400 hover:text-white hover:border-violet-500 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-white/5 bg-[#0a0a0f] px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask KnottyBot anything about massage..."
            className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl bg-violet-600 px-4 py-3 text-white hover:bg-violet-500 disabled:opacity-50 transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
