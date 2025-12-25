"use client";
import { useState, useEffect, useCallback } from "react";
import OnboardingQuiz from "./OnboardingQuiz";
import SwipeMode from "./SwipeMode";
import RecommendationsMode from "./RecommendationsMode";
import MatchesScreen from "./MatchesScreen";
import MapOverlay from "./MapOverlay";
import styles from "./ExploreAI.module.css";
import { Preferences } from "./ai";

type ViewMode = "onboarding" | "swipe" | "recommendations" | "matches" | "map";

export default function ExploreAIClient() {
  const [currentView, setCurrentView] = useState<ViewMode>("onboarding");
  const [userPreferences, setUserPreferences] = useState<Preferences | null>(null);
  const [activeTab, setActiveTab] = useState<"swipe" | "recommendations" | "matches" | "map">(
    "swipe"
  );
  const [highlightedTherapistId, setHighlightedTherapistId] = useState<string | null>(null);
  const [loadingPreferences, setLoadingPreferences] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      setLoadingPreferences(true);
      try {
        const response = await fetch("/api/preferences");
        if (response.ok) {
          const payload = await response.json();
          if (payload?.preferences) {
            setUserPreferences(payload.preferences);
            setCurrentView("swipe");
            return;
          }
        }
      } finally {
        setLoadingPreferences(false);
      }
    };

    loadPreferences();
  }, []);

  const handleOnboardingComplete = useCallback(async (preferences: Preferences) => {
    try {
      await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences }),
      });
    } catch (error) {
      console.error("Failed to save preferences", error);
    }
    setUserPreferences(preferences);
    setCurrentView("swipe");
    setActiveTab("swipe");
  }, []);

  const handleTabChange = (tab: "swipe" | "recommendations" | "matches" | "map") => {
    setActiveTab(tab);
    setCurrentView(tab);
  };

  const handleRecommendationSwipe = (therapistId: string) => {
    setHighlightedTherapistId(therapistId);
    handleTabChange("swipe");
  };

  if (loadingPreferences) {
    return (
      <div className={styles.exploreAI}>
        <div className={styles.loadingBlock}>Loading your Explore AI setup...</div>
      </div>
    );
  }

  if (currentView === "onboarding") {
    return <OnboardingQuiz onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className={styles.exploreAI}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>MasseurMatch</h1>
          <nav className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === "swipe" ? styles.tabActive : ""}`}
              onClick={() => handleTabChange("swipe")}
            >
              Swipe
            </button>
            <button
              className={`${styles.tab} ${activeTab === "recommendations" ? styles.tabActive : ""}`}
              onClick={() => handleTabChange("recommendations")}
            >
              For You
            </button>
            <button
              className={`${styles.tab} ${activeTab === "matches" ? styles.tabActive : ""}`}
              onClick={() => handleTabChange("matches")}
            >
              Matches
            </button>
            <button
              className={`${styles.tab} ${activeTab === "map" ? styles.tabActive : ""}`}
              onClick={() => handleTabChange("map")}
            >
              Map
            </button>
          </nav>
        </div>
      </header>

      <main className={styles.mainContent}>
        {currentView === "swipe" && (
          <SwipeMode
            preferences={userPreferences}
            highlightTherapistId={highlightedTherapistId}
            onHighlightConsumed={() => setHighlightedTherapistId(null)}
          />
        )}
        {currentView === "recommendations" && (
          <RecommendationsMode preferences={userPreferences} onSwipeThis={handleRecommendationSwipe} />
        )}
        {currentView === "matches" && <MatchesScreen />}
        {currentView === "map" && <MapOverlay onClose={() => handleTabChange("swipe")} />}
      </main>

      <footer className={styles.footerNav}>
        {[
          { label: "Explore", active: true },
          { label: "Booked", active: false },
          { label: "Messages", active: false },
          { label: "Profile", active: false },
        ].map((item) => (
          <div
            key={item.label}
            className={`${styles.footerItem} ${item.active ? styles.footerItemActive : ""}`}
          >
            {item.label}
          </div>
        ))}
      </footer>

      <button
        className={styles.fabFilters}
        onClick={() => setCurrentView("onboarding")}
        title="Edit preferences"
      >
        ⚙️
      </button>
    </div>
  );
}
