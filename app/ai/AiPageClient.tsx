"use client";

import { useEffect, useRef } from "react";
import "./ai.css";

const industries = [
  {
    title: "Modern businesses",
    description: "Built for teams that need velocity, automation, and reliable support.",
  },
  {
    title: "Professional services",
    description: "Streamline workflows, client updates, and recurring task automation.",
  },
  {
    title: "Government",
    description: "Enterprise-grade security paired with intuitive data visibility.",
  },
];

const highlights = [
  {
    title: "AI Automation Partner",
    description: "Cut complexity with orchestration, integrations, and measurable ROI.",
  },
  {
    title: "Design & workflows",
    description: "We map your current state, then deploy the exact automations you need.",
  },
  {
    title: "Support that scales",
    description: "From first call to rollout, our team ships, iterates, and improves fast.",
  },
];

const benefits = [
  {
    eyebrow: "Give your data context",
    title: "We analyze your stack",
    body: "We find what to automate, who your users are & how AI can optimize your workflow.",
  },
  {
    eyebrow: "Unlock growth",
    title: "Launch faster, ship smarter",
    body: "Clear execution, documentation, and training so teams adopt AI confidently.",
  },
  {
    eyebrow: "Stay supported",
    title: "Dedicated AI partners",
    body: "Real humans, real expertise, with proactive monitoring and iteration.",
  },
];

const metrics = [
  { label: "Projects automated", value: "500+" },
  { label: "Avg. ROI in 6 months", value: "4.2x" },
  { label: "Customer satisfaction", value: "98%" },
];

export default function AiPageClient() {
  const floatingRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("ai-visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    const targets = document.querySelectorAll(".ai-fade");
    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      floatingRefs.current.forEach((element, index) => {
        if (!element) return;
        const speed = 0.08 + index * 0.04;
        element.style.transform = `translateY(${y * speed}px)`;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="ai-page">
      <div className="ai-hero">
        <div className="ai-orb ai-orb--left" ref={(el) => (floatingRefs.current[0] = el)} />
        <div className="ai-orb ai-orb--right" ref={(el) => (floatingRefs.current[1] = el)} />

        <div className="ai-hero__inner">
          <div className="ai-badge ai-fade">NEXT-GEN AI AUTOMATION PARTNER</div>
          <h1 className="ai-title ai-fade">
            Automate Smarter. Grow Faster. <span>With AI.</span>
          </h1>
          <p className="ai-lead ai-fade">
            AI automation for modern businesses made simple. Bring your data, we build the
            workflows and ship results.
          </p>

          <div className="ai-actions ai-fade">
            <button className="ai-btn ai-btn--primary">Book a Free Call</button>
            <button className="ai-btn ai-btn--ghost">Get Lando</button>
          </div>

          <div className="ai-logo-belt ai-fade" aria-label="Industries we serve">
            {industries.map((industry) => (
              <div className="ai-pill" key={industry.title}>
                <div className="ai-pill__dot" />
                <div>
                  <p className="ai-pill__title">{industry.title}</p>
                  <p className="ai-pill__desc">{industry.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="ai-metrics ai-fade">
            {metrics.map((metric) => (
              <div key={metric.label} className="ai-metric">
                <p className="ai-metric__value">{metric.value}</p>
                <p className="ai-metric__label">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="ai-section ai-section--panel ai-fade">
        <div className="ai-section__header">
          <p className="ai-eyebrow">We analyze your data</p>
          <h2>We find what to automate, who your users are & how AI can optimize your workflow.</h2>
          <p className="ai-body">
            Best part is we also build and launch real solutions tailored to your stack and business
            goals.
          </p>
        </div>
        <div className="ai-quote">
          <div className="ai-avatar" aria-hidden="true">LC</div>
          <div>
            <p className="ai-quote__name">Leo Costa</p>
            <p className="ai-quote__role">Co-founder & AI Strategy Lead</p>
          </div>
        </div>
      </section>

      <section className="ai-section ai-grid ai-fade">
        {highlights.map((item) => (
          <article key={item.title} className="ai-card">
            <p className="ai-eyebrow">{item.title}</p>
            <h3>{item.title}</h3>
            <p className="ai-body">{item.description}</p>
          </article>
        ))}
      </section>

      <section className="ai-section ai-section--panel ai-fade">
        <div className="ai-feature">
          <div>
            <p className="ai-eyebrow">Analyze. Automate. Ship.</p>
            <h2>Why choose us?</h2>
            <p className="ai-body">
              We turn complex data into simple, powerful workflows. From discovery to deployment,
              our team builds AI automations that deliver measurable impact.
            </p>
            <div className="ai-bullets">
              <span className="ai-chip">Strategy</span>
              <span className="ai-chip">Automation</span>
              <span className="ai-chip">Design</span>
              <span className="ai-chip">Support</span>
            </div>
          </div>
          <div className="ai-feature__panel">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="ai-feature__item">
                <p className="ai-eyebrow">{benefit.eyebrow}</p>
                <h3>{benefit.title}</h3>
                <p className="ai-body">{benefit.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ai-section ai-cta ai-fade">
        <div className="ai-cta__content">
          <p className="ai-eyebrow">Get a live demo</p>
          <h2>See how we can automate your business with AI.</h2>
          <p className="ai-body">
            Book a free call to explore your use cases. We map the opportunities, design the
            solution, and launch with you.
          </p>
          <div className="ai-actions">
            <button className="ai-btn ai-btn--primary">Book a Free Call</button>
            <button className="ai-btn ai-btn--ghost">Explore our templates</button>
          </div>
        </div>
        <div className="ai-cta__panel" ref={(el) => (floatingRefs.current[2] = el)}>
          <div className="ai-cta__badge">Secure & Reliable</div>
          <p className="ai-body">
            SOC2-ready infrastructure, encryption in transit and at rest, and white-glove onboarding
            to keep your data safe.
          </p>
          <div className="ai-meter">
            <div className="ai-meter__fill" />
          </div>
        </div>
      </section>
    </div>
  );
}
