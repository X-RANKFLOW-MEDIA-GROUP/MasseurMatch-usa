// src/components/Hero.tsx
"use client";

import ChatDeepSeek from "./ChatDeepSeek";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={`${styles.hero} mm-fade-up`} id="inicio">
      <div className={styles["hero-glow"]} aria-hidden />

      <div className={`${styles["hero-container"]} container`}>
        <h1 className={styles["hero-title"]}>
          <span className={styles["title-line-1"]}>
            Find real massage therapists.
          </span>
          <span className={styles["title-line-2"]}>
            Connect with confidence.
          </span>
        </h1>

        <p className={styles["hero-subtitle"]}>
          AI-powered, inclusive, and human-first wellness.
        </p>

        <ChatDeepSeek />

        <div className={styles["hero-ctas"]}>
          <a
            href="#explore"
            className={`${styles["btn-cta"]} ${styles["btn-cta-primary"]}`}
          >
            Explore Profiles
          </a>
          <a
            href="#therapist"
            className={`${styles["btn-cta"]} ${styles["btn-cta-ghost"]}`}
          >
            Join as Therapist
          </a>
        </div>

        <p className={styles["hero-quote"]}>
          "Wellness meets technology."
        </p>
      </div>
    </section>
  );
}
