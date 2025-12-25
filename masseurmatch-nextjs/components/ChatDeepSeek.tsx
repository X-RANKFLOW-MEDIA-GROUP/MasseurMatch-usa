"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, Send, Wand2 } from "lucide-react";
import styles from "./ChatDeepSeek.module.css";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type ChatDeepSeekProps = {
  expandSignal?: number;
};

// Mensagem inicial do assistente
const initialMessages: Message[] = [
  {
    id: "m2",
    role: "assistant",
    text: `Hello, I'm Knotty AI, your directory assistant.
I'm here to help you find professional male massage therapists offering legitimate therapeutic services.
How can I assist you today?`,
  },
];

// Use Next.js API route for better performance and reliability
const IA_BACKEND_URL = "/api";

export default function ChatDeepSeek({ expandSignal }: ChatDeepSeekProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [assistantTyping, setAssistantTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Expand and focus when the parent CTA triggers it
  useEffect(() => {
    if (!expandSignal) return;
    setIsExpanded(true);
    const scrollTimeout = window.setTimeout(() => {
      containerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      inputRef.current?.focus();
    }, 120);
    return () => window.clearTimeout(scrollTimeout);
  }, [expandSignal]);

  // Focus input when expanded (covers both CTA and manual toggle)
  useEffect(() => {
    if (!isExpanded) return;
    const focusTimeout = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
    return () => window.clearTimeout(focusTimeout);
  }, [isExpanded]);

  // Auto-scroll to the end whenever a new message is added
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
    setAssistantTyping(true);

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
        await sleep(450);
        setMessages((prev) => [...prev, errorMsg]);
        return;
      }

      const data: { reply: string } = await res.json();

      const reply: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: data.reply,
      };

      await sleep(450);
      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      console.error("Error calling IA backend:", err);
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        text:
          "There was a connection problem. Please check your internet and try again.",
      };
      await sleep(450);
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setAssistantTyping(false);
      setLoading(false);
    }
  };

  const assistChips = useMemo(
    () => [{ id: "c1", label: "Knotty AI", icon: <Sparkles size={14} /> }],
    []
  );

  return (
    <section
      id="ai-search"
      ref={containerRef}
      className={`${styles["assistant-section"]} ${isExpanded ? styles.expanded : styles.collapsed}`}
    >
      {!isExpanded ? (
        <button
          className={styles["assistant-toggle"]}
          onClick={() => setIsExpanded(true)}
          aria-label="Open AI chat assistant"
        >
          <Sparkles size={20} />
          <span>Try Knotty AI - Your Massage Therapist Finder</span>
        </button>
      ) : (
        <>
          <div className={styles["assistant-header"]}>
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
            <span className={styles["assistant-tagline"]}>Your inclusive assistant</span>
          </div>

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
                    className={`${styles["assistant-bubble"]} ${m.role === "user" ? styles.user : styles.bot}`}
                  >
                    <p>{m.text}</p>
                  </div>
                ))}
                {assistantTyping && (
                  <div
                    className={`${styles["assistant-bubble"]} ${styles.bot} ${styles["assistant-typing"]}`}
                  >
                    <span className={styles["typing-dot"]} />
                    <span className={styles["typing-dot"]} />
                    <span className={styles["typing-dot"]} />
                  </div>
                )}
              </div>

              <form
                className={styles["assistant-inputbar"]}
                onSubmit={handleSend}
                role="search"
              >
                <div className={styles["assistant-inputwrap"]}>
                  <Wand2 className={styles["assistant-inputicon"]} aria-hidden />
                  <input
                    ref={inputRef}
                    aria-label="Type your message"
                    placeholder={loading ? "Waiting for Knotty AI..." : "Type your message..."}
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
        </>
      )}
    </section>
  );
}
