"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import styles from "./BackToTop.module.css";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 320);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      className={`${styles.button} ${isVisible ? styles.visible : ""}`}
      aria-label="Back to top"
      onClick={scrollToTop}
    >
      <ChevronUp size={18} />
      <span>Top</span>
    </button>
  );
}
