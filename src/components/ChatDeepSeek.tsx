"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, Send, Wand2 } from "lucide-react";
import styles from "./ChatDeepSeek.module.css";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

// Mensagem inicial do assistente
const initialMessages: Message[] = [
  {
    id: "m2",
    role: "assistant",
    text: "Hello, I'm Knotty AI, your assistant. How can I help you today?",
  },
];

// URL do backend da IA (configurada via .env)
const IA_BACKEND_URL =
  process.env.NEXT_PUBLIC_IA_BACKEND_URL || "http://localhost:4000";

export default function ChatDeepSeek() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll pro final sempre que uma nova mensagem é adicionada
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text: trimmed,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Formato que o backend espera
      const payloadMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.text,
      }));

      const res = await fetch(`${IA_BACKEND_URL}/deepseek`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      if (!res.ok) {
        console.error("DeepSeek API error:", res.status);
        const errorMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          text:
            "Sorry, I had a problem talking to the AI. Please try again in a moment.",
        };
        setMessages((prev) => [...prev, errorMsg]);
        return;
      }

      const data: { reply: string } = await res.json();

      const reply: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: data.reply,
      };

      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      console.error("Error calling IA backend:", err);
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        text:
          "There was a connection problem. Please check your internet and try again.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const assistChips = useMemo(
    () => [{ id: "c1", label: "Knotty AI", icon: <Sparkles size={14} /> }],
    []
  );

  return (
    <section className={styles["assistant-section"]}>
      <div className={styles["assistant-header-chips"]}>
        {assistChips.map((c) => (
          <span
            key={c.id}
            className={styles["assistant-chip"]}
            aria-label={c.label}
          >
            {c.icon}
            {c.label}
          </span>
        ))}
      </div>

      <h2 className={styles["assistant-title"]}>Your inclusive assistant</h2>
      <p className={styles["assistant-subtitle"]}>
        Chat naturally and find exactly what you need
      </p>

      <div className={styles["assistant-chat"]}>
        <div className={styles["assistant-chat-inner"]}>
          <div
            ref={listRef}
            className={styles["assistant-messages"]}
            role="log"
            aria-live="polite"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`${styles["assistant-bubble"]} ${
                  m.role === "user" ? styles.user : styles.bot
                }`}
              >
                <p>{m.text}</p>
              </div>
            ))}
          </div>

          <form
            className={styles["assistant-inputbar"]}
            onSubmit={handleSend}
            role="search"
          >
            <div className={styles["assistant-inputwrap"]}>
              <Wand2 className={styles["assistant-inputicon"]} aria-hidden />
              <input
                aria-label="Type your message"
                placeholder={
                  loading ? "Waiting for Knotty AI..." : "Type your message…"
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
            </div>
            <button
              className={styles["assistant-send"]}
              aria-label="Send"
              disabled={loading || !input.trim()}
            >
              <Send size={18} />
              <span>{loading ? "Thinking..." : "Send"}</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
