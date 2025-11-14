"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, Send, Wand2 } from "lucide-react";
import styles from "./ChatDeepSeek.module.css";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const initialMessages: Message[] = [
  {
    id: "m2",
    role: "assistant",
    text: "Hello, I'm here to help you.",
  },
];

export default function ChatDeepSeek() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  // auto-scroll to bottom on new message
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // mock reply (sem API ainda)
    const reply: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      text:
        "Thanks! I’ll refine the results using that preference. Would you also like to set a price range or preferred technique?",
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, reply]);
    }, 400);
  };

  const assistChips = useMemo(
    () => [
      { id: "c1", label: "Knotty AI", icon: <Sparkles size={14} /> },
    ],
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
                placeholder="Type your message…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <button className={styles["assistant-send"]} aria-label="Send">
              <Send size={18} />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
