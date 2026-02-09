"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import styles from "./FinalCTA.module.css";

const FinalCTA: React.FC = () => {
  return (
    <section className={`${styles["cta-section"]} mm-fade-up`} aria-labelledby="cta-title">
      <div className={styles["cta-wrap"]}>
        <h2 id="cta-title" className={styles["cta-title"]}>
          Ready to start?
        </h2>

        <p className={styles["cta-sub"]}>
          Join the most inclusive platform for massage therapists in the USA.
        </p>

        <div className={styles["cta-actions"]}>
          {/* Button for /explore */}
          <a
            href="/explore"
            className={`${styles["cta-btn"]} ${styles["cta-primary"]}`}
            aria-label="Explore all profiles"
          >
            <span>Explore All Profiles</span>
            <ArrowRight size={16} aria-hidden />
          </a>

          {/* Button for /join with free plan */}
          <a
            href="/join?plan=free"
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
