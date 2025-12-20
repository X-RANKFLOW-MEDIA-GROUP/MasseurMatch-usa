"use client";

import { useEffect } from "react";
import Link from "next/link";
import "../styles/ai-page.css";

const processSteps = [
  {
    title: "Data Intake",
    text: "Connect your CRM, support, marketing and billing data in minutes with pre-built connectors.",
  },
  {
    title: "AI Playbooks",
    text: "Map your workflows into reusable AI playbooks that adapt to your rules, tone, and compliance needs.",
  },
  {
    title: "Automation Launch",
    text: "Deploy safely with human-in-the-loop reviews, observability, and continuous optimization dashboards.",
  },
];

const benefits = [
  {
    title: "Precision AI Ops",
    text: "Enterprise-grade guardrails, monitoring, and SOC2-ready infrastructure keep your data safe while your automations stay reliable.",
  },
  {
    title: "Unified Insights",
    text: "See every workflow in a single mission control: latency, success rate, channel hand-offs, and business impact in real time.",
  },
  {
    title: "Human Craftsmanship",
    text: "We pair seasoned AI strategists with your operators to ship automation that feels on-brand and deeply human.",
  },
];

const logos = ["Stripe", "Notion", "Linear", "Webflow", "Figma", "Salesforce"];

const testimonials = [
  {
    quote:
      "They turned our fragmented ops into a single AI layer. Response time dropped 63% while CSAT climbed every month.",
    name: "Jordan Blake",
    role: "VP Ops, Northstar", 
  },
  {
    quote:
      "Their playbooks gave our team superpowers. Launching a new automation feels like publishing a doc.",
    name: "Priya Desai",
    role: "Head of Growth, Orbit",
  },
];

export default function AiLanding() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    const revealEls = document.querySelectorAll<HTMLElement>(".ai-reveal");
    revealEls.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const floating = document.querySelectorAll<HTMLElement>(".ai-float");

    const onScroll = () => {
      const offset = window.scrollY * 0.08;
      floating.forEach((el, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        el.style.transform = `translateY(${offset * direction}px) translateZ(0)`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="ai-page">
      <div className="ai-background">
        <div className="ai-grid" aria-hidden />
        <div className="ai-glow ai-float" aria-hidden />
        <div className="ai-glow-secondary ai-float" aria-hidden />
      </div>

      <header className="ai-hero" aria-labelledby="ai-hero-title">
        <div className="ai-hero__nav">
          <div className="ai-hero__brand">
            <div className="ai-hero__logo" aria-hidden>
              <span className="ai-hero__logo-dot" />
            </div>
            <span className="ai-hero__brand-name">Lando</span>
          </div>
          <nav className="ai-hero__menu" aria-label="AI services navigation">
            <Link href="#services" className="ai-nav-link">
              Services
            </Link>
            <Link href="#process" className="ai-nav-link">
              Process
            </Link>
            <Link href="#pricing" className="ai-nav-link">
              Pricing
            </Link>
            <Link href="#blog" className="ai-nav-link">
              Blog
            </Link>
            <Link href="#contact" className="ai-nav-link">
              Contact
            </Link>
          </nav>
          <div className="ai-hero__actions">
            <button className="ai-btn ai-btn--ghost" type="button">
              Book a free call
            </button>
            <button className="ai-btn ai-btn--solid" type="button">
              Get Lando
            </button>
          </div>
        </div>

        <div className="ai-hero__badge ai-reveal">NEW GEN AI AUTOMATION PARTNER</div>

        <div className="ai-hero__content ai-reveal" id="ai-hero-title">
          <h1>
            Automate Smarter. Grow Faster. <span className="ai-hero__accent">With AI.</span>
          </h1>
          <p>
            AI automation built for modern businesses. We help you orchestrate every workflow with precision, speed, and
            human-grade quality.
          </p>
          <div className="ai-hero__cta">
            <button className="ai-btn ai-btn--solid" type="button">
              Book a free call
            </button>
            <button className="ai-btn ai-btn--ghost" type="button">
              See Lando in action
            </button>
          </div>
          <div className="ai-hero__stats">
            <div className="ai-stat">
              <div className="ai-stat__value">12+</div>
              <div className="ai-stat__label">AI products launched</div>
            </div>
            <div className="ai-stat">
              <div className="ai-stat__value">20+</div>
              <div className="ai-stat__label">Automated workflows</div>
            </div>
            <div className="ai-stat">
              <div className="ai-stat__value">3+</div>
              <div className="ai-stat__label">Businesses growing with us</div>
            </div>
          </div>
        </div>

        <div className="ai-hero__card ai-reveal">
          <div className="ai-hero__card-top">WE ANALYZE YOUR DATA</div>
          <div className="ai-hero__card-body">
            <div className="ai-hero__card-text">
              <p>
                We find what to automate, who your users are & how AI can optimize your workflow. Best part is we also build and
                launch real solutions.
              </p>
            </div>
            <div className="ai-hero__avatars" aria-label="Team">
              <span className="ai-avatar" aria-hidden />
              <span className="ai-avatar" aria-hidden />
              <div className="ai-hero__avatar-text">
                <span className="ai-hero__avatar-name">Celia Johnson</span>
                <span className="ai-hero__avatar-role">Co-founder & AI Strategy Lead</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="ai-section ai-reveal" id="services">
        <div className="ai-section__header">
          <p className="ai-eyebrow">BENEFITS</p>
          <h2>Why choose us?</h2>
          <p className="ai-subtext">
            We blend strategy, design, and engineering to launch AI that feels inevitable. From automation pilots to scaled
            production systems.
          </p>
        </div>
        <div className="ai-cards">
          {benefits.map((item) => (
            <article className="ai-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ai-section ai-reveal" id="process">
        <div className="ai-section__header">
          <p className="ai-eyebrow">PROCESS</p>
          <h2>How we build with you</h2>
          <p className="ai-subtext">
            Collaborative sprints that turn your data and expertise into dependable AI copilots across every customer touchpoint.
          </p>
        </div>
        <div className="ai-steps">
          {processSteps.map((step, index) => (
            <div className="ai-step" key={step.title}>
              <span className="ai-step__number">0{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="ai-section ai-reveal" id="pricing">
        <div className="ai-cta">
          <div>
            <p className="ai-eyebrow">RESULTS</p>
            <h2>Growth without compromise</h2>
            <p className="ai-subtext">
              Automations that protect your brand, delight your customers, and scale revenue. Launch quickly, iterate safely, and
              measure everything.
            </p>
            <div className="ai-hero__cta">
              <button className="ai-btn ai-btn--solid" type="button">
                Get a roadmap
              </button>
              <button className="ai-btn ai-btn--ghost" type="button">
                Download capabilities
              </button>
            </div>
          </div>
          <div className="ai-cta__panel">
            <h3>What you get</h3>
            <ul>
              <li>Dedicated AI strategy lead</li>
              <li>Implementation squad (design + eng)</li>
              <li>Guardrails, QA, and observability baked in</li>
              <li>Weekly experiments and reports</li>
              <li>Change management and team training</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="ai-section ai-reveal" id="blog">
        <div className="ai-section__header">
          <p className="ai-eyebrow">TRUST</p>
          <h2>Brands that scale with us</h2>
          <p className="ai-subtext">
            From fast-moving startups to enterprise teams, we operate as your AI partner to unlock compound growth.
          </p>
        </div>
        <div className="ai-logos" aria-label="Partner logos">
          {logos.map((logo) => (
            <span key={logo} className="ai-logo-chip">
              {logo}
            </span>
          ))}
        </div>
      </section>

      <section className="ai-section ai-reveal" id="contact">
        <div className="ai-testimonials">
          {testimonials.map((testimonial) => (
            <figure className="ai-testimonial" key={testimonial.name}>
              <blockquote>“{testimonial.quote}”</blockquote>
              <figcaption>
                <div className="ai-hero__avatar-name">{testimonial.name}</div>
                <div className="ai-hero__avatar-role">{testimonial.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="ai-final-cta">
          <div>
            <p className="ai-eyebrow">READY WHEN YOU ARE</p>
            <h2>Let’s build your AI advantage</h2>
            <p className="ai-subtext">
              Tell us about your goals and we’ll design a roadmap that compounds efficiency and revenue.
            </p>
          </div>
          <div className="ai-final-cta__actions">
            <button className="ai-btn ai-btn--solid" type="button">
              Talk to a strategist
            </button>
            <button className="ai-btn ai-btn--ghost" type="button">
              View success stories
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
