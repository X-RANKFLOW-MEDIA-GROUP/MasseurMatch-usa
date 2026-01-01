"use client";
import { useState, useCallback } from "react";
import ExploreAIClient from "./ExploreAI/ExploreAIClient";
import ExploreTherapists from "./ExploreTherapists";
import styles from "./UnifiedExplore.module.css";

type ExploreMode = "ai" | "grid";

interface UnifiedExploreProps {
  defaultMode?: ExploreMode;
  isModal?: boolean;
  onClose?: () => void;
}

export default function UnifiedExplore({
  defaultMode = "ai",
  isModal = false,
  onClose
}: UnifiedExploreProps) {
  const [mode, setMode] = useState<ExploreMode>(defaultMode);

  const handleModeSwitch = useCallback((newMode: ExploreMode) => {
    setMode(newMode);
  }, []);

  return (
    <div className={`${styles.unifiedExplore} ${isModal ? styles.modal : ""}`}>
      {/* Header with mode toggle */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            {mode === "ai" ? "Discover Your Match" : "Browse All Therapists"}
          </h1>

          <div className={styles.modeToggle}>
            <button
              className={`${styles.modeButton} ${mode === "ai" ? styles.active : ""}`}
              onClick={() => handleModeSwitch("ai")}
              title="AI-powered card swipe mode"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span>AI Match</span>
            </button>

            <button
              className={`${styles.modeButton} ${mode === "grid" ? styles.active : ""}`}
              onClick={() => handleModeSwitch("grid")}
              title="Traditional grid view with filters"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
              <span>Grid View</span>
            </button>
          </div>

          {isModal && onClose && (
            <button className={styles.closeButton} onClick={onClose} aria-label="Close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {mode === "ai" ? (
          <ExploreAIClient />
        ) : (
          <ExploreTherapists />
        )}
      </div>
    </div>
  );
}
