"use client";

import { useState } from "react";
import ChatDeepSeek from "./ChatDeepSeek";
import styles from "./Hero.module.css";

export default function Hero() {
  const [aiExpandSignal, setAiExpandSignal] = useState(0);

  const handleOpenAiSearch = () => {
    setAiExpandSignal((prev) => prev + 1);
    const chatAnchor = document.getElementById("ai-search");
    if (chatAnchor) {
      chatAnchor.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className={styles.hero} id="inicio">
      <div className={styles["hero-glow"]} aria-hidden />

      <div className={`${styles["hero-container"]} container`}>
        <h1 className={styles["hero-title"]}>Massage therapists near you</h1>

        <p className={styles["hero-subtitle"]}>
          Find verified massage therapists in your city. Use AI or browse by
          service type and location.
        </p>

        <div className={styles["hero-ctas"]}>
          <a
            href="/explore"
            className={`${styles["btn-cta"]} ${styles["btn-cta-primary"]}`}
          >
            Browse Therapists
          </a>
          <a
            href="/join"
            className={`${styles["btn-cta"]} ${styles["btn-cta-ghost"]}`}
          >
            List Your Services
          </a>
        </div>

        <button
          type="button"
          className={`${styles["hero-headline"]} ${styles["hero-ai-link"]}`}
          onClick={handleOpenAiSearch}
        >
          Or try AI search (opens chat)
        </button>

        <ChatDeepSeek expandSignal={aiExpandSignal} />
      </div>
    </section>
  );
}
