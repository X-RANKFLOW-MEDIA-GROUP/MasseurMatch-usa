"use client";

import { Search, MessageSquare, Shield } from "lucide-react";
import styles from "./HowItWorks.module.css";

type StepColor = "purple" | "pink" | "blue";

interface Step {
  id: number;
  icon: JSX.Element;
  title: string;
  description: string;
  color: StepColor;
}

export default function HowItWorks() {
  const steps: Step[] = [
    {
      id: 1,
      icon: <Search size={32} />,
      title: "Search & Filter",
      description:
        "Find massage therapists by city, price, specialty and preferences. Our inclusive filters respect your choices.",
      color: "purple",
    },
    {
      id: 2,
      icon: <MessageSquare size={32} />,
      title: "Chat with Knotty AI",
      description:
        "Our AI assists you in finding the perfect match, ensuring respect and privacy at every step.",
      color: "pink",
    },
    {
      id: 3,
      icon: <Shield size={32} />,
      title: "Connect Safely",
      description:
        "All profiles are verified. Real client reviews ensure a secure and respectful environment.",
      color: "blue",
    },
  ];

  return (
    <section className={styles["how-it-works"]}>
      <div className={styles["hiw-inner"]}>
        <h2>How It Works</h2>
        <p>Simple, fast and inclusive</p>

        <div className={styles.steps}>
          {steps.map((step) => (
            <div key={step.id} className={styles["step-card"]}>
              <div
                className={`${styles.icon} ${
                  styles[`icon-${step.color}`]
                }`}
              >
                {step.icon}
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
