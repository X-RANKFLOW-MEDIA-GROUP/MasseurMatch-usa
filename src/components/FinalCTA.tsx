"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import styles from "./FinalCTA.module.css";

const FinalCTA: React.FC = () => {
  return (
    <section
      className={styles["cta-section"]}
      aria-labelledby="cta-title"
    >
      <div className={styles["cta-wrap"]}>
        <h2 id="cta-title" className={styles["cta-title"]}>
          Ready to start?
        </h2>

        <p className={styles["cta-sub"]}>
          Join Brazil’s most inclusive platform for massage therapists.
        </p>

        <div className={styles["cta-actions"]}>
          <a
            href="#explore"
            className={`${styles["cta-btn"]} ${styles["cta-primary"]}`}
            aria-label="Explore all profiles"
          >
            <span>Explore All Profiles</span>
            <ArrowRight size={16} aria-hidden />
          </a>

          <a
            href="#signup"
            className={`${styles["cta-btn"]} ${styles["cta-secondary"]}`}
            aria-label="Create a free account"
          >
            Create Free Account
          </a>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
