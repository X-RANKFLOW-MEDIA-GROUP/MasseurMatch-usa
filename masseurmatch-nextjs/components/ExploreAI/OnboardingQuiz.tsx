"use client";
import { useState } from "react";
import styles from "./OnboardingQuiz.module.css";
import { Preferences, createPreferenceDraft } from "./ai";

type QuizStep =
  | "location"
  | "massage-type"
  | "pressure"
  | "gender"
  | "mode"
  | "availability"
  | "budget"
  | "pain-points";

const TOTAL_STEPS = 8;

interface OnboardingQuizProps {
  onComplete: (preferences: Preferences) => void;
}

export default function OnboardingQuiz({ onComplete }: OnboardingQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<Preferences>(() => createPreferenceDraft());

  const steps: QuizStep[] = [
    "location",
    "massage-type",
    "pressure",
    "gender",
    "mode",
    "availability",
    "budget",
    "pain-points",
  ];

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(preferences);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updatePreference = <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (key: "massageTypes" | "painPoints", item: string) => {
    setPreferences((prev) => {
      const array = prev[key] as string[];
      const exists = array.includes(item);
      return {
        ...prev,
        [key]: exists ? array.filter((i) => i !== item) : [...array, item],
      };
    });
  };

  const currentStepName = steps[currentStep];
  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;

  return (
    <div className={styles.quiz}>
      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>
      <div className={styles.progressText}>
        {currentStep + 1} / {TOTAL_STEPS}
      </div>

      {/* Step content */}
      <div className={styles.stepContent}>
        {/* Location */}
        {currentStepName === "location" && (
          <div className={styles.step}>
            <h2 className={styles.stepTitle}>Where are you located?</h2>
            <p className={styles.stepSubtitle}>We will find therapists near you</p>
            <button
              className={styles.buttonPrimary}
              onClick={() => {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    updatePreference("location", {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude,
                      zipCode: "",
                      radius: 25,
                    });
                  },
                  (error) => {
                    console.error("Geolocation error:", error);
                  }
                );
              }}
            >
              📍 Use My Location
            </button>
            <div className={styles.divider}>OR</div>
            <input
              type="text"
              placeholder="Enter ZIP code"
              className={styles.input}
              value={preferences.location.zipCode}
              onChange={(e) =>
                updatePreference("location", { ...preferences.location, zipCode: e.target.value })
              }
            />
            <div className={styles.radiusSlider}>
              <label>Search radius: {preferences.location.radius} km</label>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={preferences.location.radius}
                onChange={(e) =>
                  updatePreference("location", { ...preferences.location, radius: Number(e.target.value) })
                }
              />
            </div>
          </div>
        )}

        {/* Massage Type */}
        {currentStepName === "massage-type" && (
          <div className={styles.step}>
            <h2 className={styles.stepTitle}>What type of massage?</h2>
            <p className={styles.stepSubtitle}>Select all that interest you</p>
            <div className={styles.optionsGrid}>
              {["Relaxing", "Deep Tissue", "Sports", "Prenatal", "Swedish", "Thai", "Hot Stone", "Shiatsu"].map(
                (type) => (
                  <button
                    key={type}
                    className={`${styles.optionButton} ${
                      preferences.massageTypes.includes(type) ? styles.optionButtonActive : ""
                    }`}
                    onClick={() => toggleArrayItem("massageTypes", type)}
                  >
                    {type}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Pressure */}
        {currentStepName === "pressure" && (
          <div className={styles.step}>
            <h2 className={styles.stepTitle}>Preferred pressure?</h2>
            <div className={styles.optionsVertical}>
              {([
                { value: "light" as const, label: "Light & Gentle", emoji: "🌸" },
                { value: "medium" as const, label: "Medium Pressure", emoji: "💆" },
                { value: "firm" as const, label: "Firm & Deep", emoji: "💪" },
              ] as const).map((option) => (
                <button
                  key={option.value}
                  className={`${styles.optionButtonLarge} ${
                    preferences.pressure === option.value ? styles.optionButtonActive : ""
                  }`}
                  onClick={() => updatePreference("pressure", option.value)}
                >
                  <span className={styles.optionEmoji}>{option.emoji}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Gender */}
        {currentStepName === "gender" && (
          <div className={styles.step}>
            <h2 className={styles.stepTitle}>Therapist gender preference?</h2>
            <div className={styles.optionsVertical}>
              {([
                { value: "male" as const, label: "Male Therapists" },
                { value: "female" as const, label: "Female Therapists" },
                { value: "any" as const, label: "No Preference" },
              ] as const).map((option) => (
                <button
                  key={option.value}
                  className={`${styles.optionButtonLarge} ${
                    preferences.gender === option.value ? styles.optionButtonActive : ""
                  }`}
                  onClick={() => updatePreference("gender", option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mode */}
        {currentStepName === "mode" && (
          <div className={styles.step}>
            <h2 className={styles.stepTitle}>Session location?</h2>
            <div className={styles.optionsVertical}>
              {([
                { value: "incall" as const, label: "In-Call (Studio/Spa)", emoji: "🏢" },
                { value: "outcall" as const, label: "Out-Call (Home/Hotel)", emoji: "🏠" },
                { value: "any" as const, label: "Either Works", emoji: "✨" },
              ] as const).map((option) => (
                <button
                  key={option.value}
                  className={`${styles.optionButtonLarge} ${
                    preferences.mode === option.value ? styles.optionButtonActive : ""
                  }`}
                  onClick={() => updatePreference("mode", option.value)}
                >
                  <span className={styles.optionEmoji}>{option.emoji}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Availability */}
        {currentStepName === "availability" && (
          <div className={styles.step}>
            <h2 className={styles.stepTitle}>When do you need a massage?</h2>
            <div className={styles.optionsVertical}>
              {([
                { value: "now" as const, label: "Available Now", emoji: "⚡" },
                { value: "today" as const, label: "Today", emoji: "📅" },
                { value: "this-week" as const, label: "This Week", emoji: "📆" },
                { value: "anytime" as const, label: "Anytime", emoji: "🕐" },
              ] as const).map((option) => (
                <button
                  key={option.value}
                  className={`${styles.optionButtonLarge} ${
                    preferences.availability === option.value ? styles.optionButtonActive : ""
                  }`}
                  onClick={() => updatePreference("availability", option.value)}
                >
                  <span className={styles.optionEmoji}>{option.emoji}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Budget */}
        {currentStepName === "budget" && (
          <div className={styles.step}>
            <h2 className={styles.stepTitle}>Your budget per hour?</h2>
            <div className={styles.budgetRange}>
              <div className={styles.budgetValues}>
                <span>${preferences.budget.min}</span>
                <span>${preferences.budget.max}</span>
              </div>
              <div className={styles.rangeInputs}>
                <input
                  type="range"
                  min="50"
                  max="300"
                  step="10"
                  value={preferences.budget.min}
                  onChange={(e) =>
                    updatePreference("budget", { ...preferences.budget, min: Number(e.target.value) })
                  }
                />
                <input
                  type="range"
                  min="50"
                  max="300"
                  step="10"
                  value={preferences.budget.max}
                  onChange={(e) =>
                    updatePreference("budget", { ...preferences.budget, max: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Pain Points */}
        {currentStepName === "pain-points" && (
          <div className={styles.step}>
            <h2 className={styles.stepTitle}>Main areas of concern?</h2>
            <p className={styles.stepSubtitle}>Select all that apply</p>
            <div className={styles.optionsGrid}>
              {["Back Pain", "Neck", "Shoulders", "Stress", "Muscle Tension", "Headaches", "Legs", "Full Body"].map(
                (point) => (
                  <button
                    key={point}
                    className={`${styles.optionButton} ${
                      preferences.painPoints.includes(point) ? styles.optionButtonActive : ""
                    }`}
                    onClick={() => toggleArrayItem("painPoints", point)}
                  >
                    {point}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className={styles.navigation}>
        {currentStep > 0 && (
          <button className={styles.buttonSecondary} onClick={handleBack}>
            ← Back
          </button>
        )}
        <button
          className={styles.buttonPrimary}
          onClick={handleNext}
          disabled={
            currentStepName === "massage-type" && preferences.massageTypes.length === 0 ||
            currentStepName === "pain-points" && preferences.painPoints.length === 0
          }
        >
          {currentStep === TOTAL_STEPS - 1 ? "Start Exploring 🎉" : "Next →"}
        </button>
      </div>
    </div>
  );
}

