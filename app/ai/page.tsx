"use client";

import type { Metadata } from "next";
import { useEffect } from "react";
import "./ai.css";

const highlights = [
  {
    title: "We analyze your data",
    body: "We find what to automate, who your users are & how AI can optimize your workflow. Best part is we also build and launch real solutions.",
  },
  {
    title: "Human-led automation",
    body: "Strategy sessions, white-glove implementation, and iterative training so your team actually trusts the AI you deploy.",
  },
  {
    title: "Fast, measurable impact",
    body: "Launch pilots in weeks, not months—without compromising on security, governance, or brand voice.",
  },
];

const benefits = [
  {
    title: "Enterprise-grade security",
    copy: "SOC2-aligned practices, private data handling, and zero-trust defaults to keep your stack safe.",
  },
  {
    title: "Precise AI copilots",
    copy: "Context-aware bots that learn from your knowledge base and escalate to humans when needed.",
  },
  {
    title: "Scalable automations",
    copy: "Reusable workflows for onboarding, support, sales, and ops that adapt as you grow.",
  },
  {
    title: "Observability built-in",
    copy: "Live dashboards, guardrails, and continuous evals so every AI action is transparent.",
  },
];

const steps = [
  {
    label: "01",
    title: "Discovery & design",
    copy: "We map your goals, uncover quick wins, and design the ideal AI operating model for your team.",
  },
  {
    label: "02",
    title: "Build & deploy",
    copy: "Secure integrations, custom prompts, and agent orchestration shipped with iterative testing.",
  },
  {
    label: "03",
    title: "Measure & scale",
    copy: "Analytics, A/B experiments, and continuous tuning keep performance climbing month over month.",
  },
];

export const metadata: Metadata = {
  title: "AI Automation Partner | MasseurMatch",
  description:
    "A new AI landing experience showcasing automation strategy, secure copilots, and scalable workflows built for modern teams.",
};

export default function AIPage() {
  useEffect(() => {
    const revealTargets = Array.from(
      document.querySelectorAll<HTMLElement>(".ai-reveal"),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.18 },
    );

    revealTargets.forEach((el) => observer.observe(el));

    const handleScroll = () => {
      const y = window.scrollY;
      document.documentElement.style.setProperty(
        "--ai-parallax",
        `${Math.min(y * 0.08, 60)}px`,
      );
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="ai-page">
      <section className="ai-hero">
        <div className="ai-orbs" aria-hidden="true">
          <span className="ai-orb ai-orb--primary" />
          <span className="ai-orb ai-orb--accent" />
          <span className="ai-grid" />
        </div>

        <div className="ai-container ai-hero__content">
          <div className="ai-pill">New Gen AI Automation Partner</div>
          <h1 className="ai-title">
            Automate Smarter. Grow Faster. <em>With AI.</em>
          </h1>
          <p className="ai-subtitle">
            AI automation for modern businesses made simple.
          </p>

          <div className="ai-cta">
            <button className="ai-button ai-button--solid">Book a free call</button>
            <button className="ai-button ai-button--ghost">Get Lando</button>
          </div>

          <div className="ai-floating-card ai-reveal">
            <div className="ai-floating-card__header">
              <span className="ai-dot" aria-hidden="true" />
              <span className="ai-floating-card__label">We analyze your data</span>
              <span className="ai-floating-card__sep" />
              <span className="ai-floating-card__label">We strategize your automation</span>
            </div>
            <p className="ai-floating-card__body">
              We find what to automate, who your users are &amp; how AI can optimize your
              workflow. Best part is we also build and launch real solutions.
            </p>
            <div className="ai-floating-card__footer">
              <div className="ai-avatar" aria-hidden="true" />
              <div>
                <div className="ai-floating-card__name">Sufiyan U.</div>
                <div className="ai-floating-card__role">Co-founder &amp; AI Strategy Lead</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ai-panels ai-container">
        {highlights.map((item) => (
          <article key={item.title} className="ai-panel ai-reveal">
            <div className="ai-panel__tag">{item.title}</div>
            <p className="ai-panel__copy">{item.body}</p>
          </article>
        ))}
      </section>

      <section className="ai-section ai-container ai-reveal">
        <header className="ai-section__head">
          <p className="ai-kicker">Benefits</p>
          <h2 className="ai-heading">Why choose us?</h2>
          <p className="ai-section__lead">
            Sophisticated AI automation that respects your data, your voice, and your customers.
          </p>
        </header>
        <div className="ai-grid-cards">
          {benefits.map((benefit) => (
            <article key={benefit.title} className="ai-card">
              <h3>{benefit.title}</h3>
              <p>{benefit.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ai-section ai-section--muted ai-reveal">
        <div className="ai-container">
          <header className="ai-section__head">
            <p className="ai-kicker">Process</p>
            <h2 className="ai-heading">How we work together</h2>
            <p className="ai-section__lead">
              Collaborative sprints that move from idea to production-ready automations with confidence.
            </p>
          </header>
          <div className="ai-steps">
            {steps.map((step) => (
              <article key={step.title} className="ai-step">
                <div className="ai-step__badge">{step.label}</div>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ai-section ai-container ai-reveal">
        <header className="ai-section__head">
          <p className="ai-kicker">Ready to move?</p>
          <h2 className="ai-heading">Let&apos;s build your AI advantage</h2>
          <p className="ai-section__lead">
            Tell us about your workflows and we&apos;ll design a roadmap that pays back in weeks.
          </p>
        </header>
        <div className="ai-cta ai-cta--center">
          <button className="ai-button ai-button--solid">Book a free call</button>
          <button className="ai-button ai-button--ghost">Download overview</button>
        </div>
      </section>
    </div>
  );
}
