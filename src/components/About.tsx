"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./About.module.css";

export default function About() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add(styles.isVisible);
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const revealables = root.querySelectorAll<HTMLElement>("[data-reveal]");
    revealables.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // FAQ Schema for SEO (Google Rich Results)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is MasseurMatch?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MasseurMatch is an inclusive directory platform connecting clients with independent massage therapists across the USA. We specialize in LGBT-friendly wellness services, including gay massage, male massage, and therapeutic bodywork. Our platform is a visibility tool, not an agency or booking service."
        }
      },
      {
        "@type": "Question",
        "name": "Are massage therapists on MasseurMatch licensed and verified?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MasseurMatch does not verify licenses or credentials. All profile information is self-declared by independent providers. We encourage clients to confirm credentials, certifications, and qualifications directly with therapists before booking sessions."
        }
      },
      {
        "@type": "Question",
        "name": "Is MasseurMatch LGBT-friendly and inclusive?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. MasseurMatch is proudly LGBTQ+ inclusive. We support gay massage therapists, male bodyworkers, and clients seeking LGBT-friendly wellness services. Discrimination, hate speech, or harassment is prohibited and results in immediate account removal."
        }
      },
      {
        "@type": "Question",
        "name": "Does MasseurMatch handle bookings or payments?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. MasseurMatch is a directory platform only. We do not process payments, manage bookings, or facilitate messaging. All communication, scheduling, and payment arrangements happen directly between clients and independent providers."
        }
      },
      {
        "@type": "Question",
        "name": "How do I join MasseurMatch as a massage therapist?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Independent massage therapists can join by creating a profile at masseurmatch.com/join. You must be 18+ years old, comply with local laws, and agree to our terms of service. Profile creation is free, with optional paid promotional features available."
        }
      },
      {
        "@type": "Question",
        "name": "What are the paid promotional features?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer Travel Boost and Masseur of the Day placements for enhanced visibility. These are paid promotional options and do not constitute endorsements by MasseurMatch. All providers maintain independence regardless of promotional status."
        }
      },
      {
        "@type": "Question",
        "name": "Can I trust the therapists on MasseurMatch?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MasseurMatch provides a platform for discovery, but we do not endorse or guarantee any provider. We recommend verifying credentials, reading reviews, checking references, and communicating clearly before booking. Trust your instincts and prioritize your safety."
        }
      },
      {
        "@type": "Question",
        "name": "What services are allowed on MasseurMatch?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MasseurMatch is for lawful, professional massage therapy and wellness services only. We prohibit illegal activities, commercial sexual services, and any content violating our community guidelines. Providers must comply with all local laws and regulations."
        }
      }
    ]
  };

  return (
    <>
      {/* FAQ Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className={styles.about} ref={rootRef}>
        {/* HERO SECTION */}
        <header className={styles.about__hero} data-reveal>
          <h1 className={styles.about__title}>
            About MasseurMatch — Your Trusted Gay Massage &amp; Male Massage Directory
          </h1>

          <p className={styles.about__tagline}>
            Empowering Independent Massage Therapists &amp; Connecting LGBT-Friendly Wellness Services Nationwide
          </p>

          <p className={styles.about__intro}>
            Welcome to <strong>MasseurMatch</strong>, the most inclusive directory for gay massage, male massage, and LGBT wellness services across the United States. We connect clients with independent, professional massage therapists in a safe, transparent, and respectful environment. Whether you&apos;re seeking therapeutic bodywork, relaxation massage, or specialized wellness services, MasseurMatch is your trusted platform for discovery.
          </p>

          <div className={styles.about__cta}>
            <Link
              href="/join"
              className={`${styles.btn} ${styles["btn--primary"]}`}
              aria-label="Join MasseurMatch as Massage Therapist"
            >
              Join as Provider
            </Link>

            <Link
              href="/directory"
              className={`${styles.btn} ${styles["btn--ghost"]}`}
              aria-label="Explore Gay Massage Therapist Directory"
            >
              Explore Directory
            </Link>

            <Link
              href="/before-you-list"
              className={`${styles.btn} ${styles["btn--link"]}`}
              aria-label="Read Before You List Guidelines"
            >
              Before You List
            </Link>
          </div>

          <div className={styles.about__note}>
            <strong>Platform Transparency:</strong> MasseurMatch is a visibility platform for independent providers — not an employment agency or booking service. By joining, you confirm that you operate independently, manage your own client relationships, and comply with all applicable local laws and professional standards.
          </div>
        </header>

        {/* PLATFORM VALUES */}
        <section
          className={styles.about__section}
          aria-labelledby="values-title"
          data-reveal
        >
          <div className={styles.about__sectionHeader}>
            <h2 id="values-title">Why Choose MasseurMatch?</h2>
          </div>

          <p>
            We built MasseurMatch to solve a real problem: finding trusted, LGBT-friendly massage therapists shouldn&apos;t be difficult or uncomfortable. Our platform prioritizes transparency, inclusivity, and provider independence.
          </p>

          <ul className={styles.about__grid}>
            <li className={styles.about__card}>
              <div className={styles.about__cardHead}>
                <h3>🏳️‍🌈 LGBTQ+ Inclusive</h3>
              </div>
              <p>
                We proudly support gay massage therapists, male bodyworkers, and LGBT clients. Discrimination is non-negotiable — hate speech, harassment, or exclusionary practices result in immediate removal.
              </p>
            </li>

            <li className={styles.about__card}>
              <div className={styles.about__cardHead}>
                <h3>🔍 Nationwide Coverage</h3>
              </div>
              <p>
                Find gay massage and male massage therapists in major cities across the USA — from Miami to NYC, Los Angeles to San Francisco, Las Vegas to Chicago, and everywhere in between.
              </p>
            </li>

            <li className={styles.about__card}>
              <div className={styles.about__cardHead}>
                <h3>💼 Provider Independence</h3>
              </div>
              <p>
                You are not employed by MasseurMatch. You operate your own business, set your own rates, manage client communications, and control your schedule. We&apos;re a visibility tool, not an intermediary.
              </p>
            </li>

            <li className={styles.about__card}>
              <div className={styles.about__cardHead}>
                <h3>🛡️ Safety &amp; Transparency</h3>
              </div>
              <p>
                We provide clear disclaimers, transparent policies, and encourage direct verification. While we don&apos;t verify credentials, we empower clients to ask questions, check references, and make informed decisions.
              </p>
            </li>

            <li className={styles.about__card}>
              <div className={styles.about__cardHead}>
                <h3>📍 Local Search Optimization</h3>
              </div>
              <p>
                Search by city and service type — from gay massage in Miami to male massage in NYC. Our platform is optimized to help clients find exactly what they need in their local area.
              </p>
            </li>

            <li className={styles.about__card}>
              <div className={styles.about__cardHead}>
                <h3>✅ Professional Standards</h3>
              </div>
              <p>
                We expect lawful, professional massage therapy only. No illegal services, no medical claims without proper licensing, and no content that misrepresents your qualifications or services.
              </p>
            </li>
          </ul>
        </section>

        {/* HOW IT WORKS */}
        <section
          className={styles.about__section}
          aria-labelledby="how-it-works-title"
          data-reveal
        >
          <div className={styles.about__sectionHeader}>
            <h2 id="how-it-works-title">How MasseurMatch Works</h2>
          </div>

          <div className={styles.about__legal}>
            <article className={styles.about__legalItem}>
              <div className={styles.about__cardHead}>
                <h3>1. Therapists Create Profiles</h3>
              </div>
              <p>
                Independent massage therapists join MasseurMatch by creating a detailed profile. You add your bio, services offered, pricing, location, photos, and contact information. Profiles are self-managed and editable anytime.
              </p>
            </article>

            <article className={styles.about__legalItem}>
              <div className={styles.about__cardHead}>
                <h3>2. Clients Search &amp; Discover</h3>
              </div>
              <p>
                Clients search our directory by city, service type, or keywords like &quot;gay massage in Miami&quot; or &quot;male massage therapist near me.&quot; Search results are optimized for local relevance and user preferences.
              </p>
            </article>

            <article className={styles.about__legalItem}>
              <div className={styles.about__cardHead}>
                <h3>3. Direct Communication</h3>
              </div>
              <p>
                All communication happens directly between clients and providers. MasseurMatch does not facilitate messaging, bookings, or payments. You connect on your own terms using the contact methods you provide.
              </p>
            </article>

            <article className={styles.about__legalItem}>
              <div className={styles.about__cardHead}>
                <h3>4. Optional Promotions</h3>
              </div>
              <p>
                Providers can boost visibility with paid features like Travel Boost or Masseur of the Day. These are promotional placements and do not constitute endorsements or guarantees of quality.
              </p>
            </article>
          </div>
        </section>

        {/* IMPORTANT DISCLAIMERS */}
        <section
          className={styles.about__section}
          aria-labelledby="disclaimers-title"
          data-reveal
        >
          <div className={styles.about__sectionHeader}>
            <h2 id="disclaimers-title">Important Platform Disclaimers</h2>
          </div>

          <p>
            Transparency is our foundation. Here&apos;s what you need to know about how MasseurMatch operates and our limitations as a platform.
          </p>

          <ul className={styles.about__grid}>
            <li className={styles.about__card}>
              <div className={styles.about__cardHead}>
                <h3>No License Verification</h3>
              </div>
              <p>
                MasseurMatch does not verify licenses, certifications, or credentials. All profile information is self-declared by providers. Clients are strongly encouraged to confirm qualifications directly before booking.
              </p>
            </li>

            <li className={styles.about__card}>
              <div className={styles.about__cardHead}>
                <h3>No Endorsements</h3>
              </div>
              <p>
                Featured placements like &quot;Travel Boost&quot; or &quot;Masseur of the Day&quot; are paid promotional options. These do not reflect quality endorsements, recommendations, or guarantees by MasseurMatch.
              </p>
            </li>

            <li className={styles.about__card}>
              <div className={styles.about__cardHead}>
                <h3>Provider-Owned Content</h3>
              </div>
              <p>
                All profile content (bio, pricing, photos, services) is created and controlled by providers. We do not edit, review, or verify listings for accuracy, professionalism, or legal compliance.
              </p>
            </li>

            <li className={styles.about__card}>
              <div className={styles.about__cardHead}>
                <h3>No Medical Claims</h3>
              </div>
              <p>
                MasseurMatch is for wellness discovery only. Providers may not make medical claims, diagnose conditions, or prescribe treatments unless properly licensed and compliant with local healthcare laws.
              </p>
            </li>

            <li className={styles.about__card}>
              <div className={styles.about__cardHead}>
                <h3>Directory Only — No Bookings</h3>
              </div>
              <p>
                We are not a marketplace or booking platform. MasseurMatch does not process payments, manage appointments, or act as an intermediary. All transactions happen directly between you and providers.
              </p>
            </li>

            <li className={styles.about__card}>
              <div className={styles.about__cardHead}>
                <h3>Limitation of Liability</h3>
              </div>
              <p>
                MasseurMatch is not responsible for disputes, damages, or claims arising between providers and clients. All interactions are at your own risk and discretion. See our <Link href="/legal/terms">Terms of Service</Link> for full details.
              </p>
            </li>
          </ul>
        </section>

        {/* FAQ SECTION (SEO-rich) */}
        <section
          className={styles.about__section}
          aria-labelledby="faq-title"
          data-reveal
        >
          <div className={styles.about__sectionHeader}>
            <h2 id="faq-title">Frequently Asked Questions</h2>
          </div>

          <div className={styles.about__legal}>
            <article className={styles.about__legalItem}>
              <div className={styles.about__cardHead}>
                <h3>What is MasseurMatch?</h3>
              </div>
              <p>
                MasseurMatch is an inclusive directory platform connecting clients with independent massage therapists across the USA. We specialize in LGBT-friendly wellness services, including gay massage, male massage, and therapeutic bodywork. Our platform is a visibility tool, not an agency or booking service.
              </p>
            </article>

            <article className={styles.about__legalItem}>
              <div className={styles.about__cardHead}>
                <h3>Are massage therapists on MasseurMatch licensed and verified?</h3>
              </div>
              <p>
                MasseurMatch does not verify licenses or credentials. All profile information is self-declared by independent providers. We encourage clients to confirm credentials, certifications, and qualifications directly with therapists before booking sessions.
              </p>
            </article>

            <article className={styles.about__legalItem}>
              <div className={styles.about__cardHead}>
                <h3>Is MasseurMatch LGBT-friendly and inclusive?</h3>
              </div>
              <p>
                Yes. MasseurMatch is proudly LGBTQ+ inclusive. We support gay massage therapists, male bodyworkers, and clients seeking LGBT-friendly wellness services. Discrimination, hate speech, or harassment is prohibited and results in immediate account removal.
              </p>
            </article>

            <article className={styles.about__legalItem}>
              <div className={styles.about__cardHead}>
                <h3>Does MasseurMatch handle bookings or payments?</h3>
              </div>
              <p>
                No. MasseurMatch is a directory platform only. We do not process payments, manage bookings, or facilitate messaging. All communication, scheduling, and payment arrangements happen directly between clients and independent providers.
              </p>
            </article>

            <article className={styles.about__legalItem}>
              <div className={styles.about__cardHead}>
                <h3>How do I join MasseurMatch as a massage therapist?</h3>
              </div>
              <p>
                Independent massage therapists can join by creating a profile at <Link href="/join">masseurmatch.com/join</Link>. You must be 18+ years old, comply with local laws, and agree to our <Link href="/legal/terms">terms of service</Link>. Profile creation is free, with optional paid promotional features available.
              </p>
            </article>

            <article className={styles.about__legalItem}>
              <div className={styles.about__cardHead}>
                <h3>What are the paid promotional features?</h3>
              </div>
              <p>
                We offer Travel Boost and Masseur of the Day placements for enhanced visibility. These are paid promotional options and do not constitute endorsements by MasseurMatch. All providers maintain independence regardless of promotional status.
              </p>
            </article>

            <article className={styles.about__legalItem}>
              <div className={styles.about__cardHead}>
                <h3>Can I trust the therapists on MasseurMatch?</h3>
              </div>
              <p>
                MasseurMatch provides a platform for discovery, but we do not endorse or guarantee any provider. We recommend verifying credentials, reading reviews, checking references, and communicating clearly before booking. Trust your instincts and prioritize your safety.
              </p>
            </article>

            <article className={styles.about__legalItem}>
              <div className={styles.about__cardHead}>
                <h3>What services are allowed on MasseurMatch?</h3>
              </div>
              <p>
                MasseurMatch is for lawful, professional massage therapy and wellness services only. We prohibit illegal activities, commercial sexual services, and any content violating our <Link href="/legal/community-guidelines">community guidelines</Link>. Providers must comply with all local laws and regulations.
              </p>
            </article>
          </div>
        </section>

        {/* LEGAL ENTITY */}
        <section
          className={styles.about__section}
          aria-labelledby="entity-title"
          data-reveal
        >
          <div className={styles.about__sectionHeader}>
            <h2 id="entity-title">Legal Entity &amp; Contact Information</h2>
          </div>

          <address className={styles.about__address}>
            <div><strong>MasseurMatch</strong> is owned and operated by:</div>
            <div><strong>X RankFlow Media Group LLC</strong></div>
            <div>8 The Green, Ste B</div>
            <div>Dover, DE 19901</div>
            <div>United States</div>
            <div className={styles.about__contact}>
              Legal inquiries:{" "}
              <a href="mailto:legal@masseurmatch.com" className={styles.about__link}>
                legal@masseurmatch.com
              </a>
            </div>
            <div className={styles.about__contact}>
              Support:{" "}
              <a href="mailto:support@masseurmatch.com" className={styles.about__link}>
                support@masseurmatch.com
              </a>
            </div>
          </address>
        </section>

        {/* LEGAL AGREEMENT LINKS */}
        <section
          className={styles.about__section}
          aria-labelledby="agreement-title"
          data-reveal
        >
          <div className={styles.about__sectionHeader}>
            <h2 id="agreement-title">Legal Policies &amp; User Agreements</h2>
          </div>

          <p>
            By using MasseurMatch as a client or creating a provider profile, you confirm that you have read, understood, and agree to the following policies:
          </p>

          <ul className={styles.about__links}>
            <li>
              <Link href="/legal/terms" className={styles.about__link}>
                → Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/legal/privacy-policy" className={styles.about__link}>
                → Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/legal/community-guidelines" className={styles.about__link}>
                → Community Guidelines
              </Link>
            </li>
            <li>
              <Link href="/legal/cookie-policy" className={styles.about__link}>
                → Cookie Policy
              </Link>
            </li>
            <li>
              <Link href="/legal/professional-standards" className={styles.about__link}>
                → Professional Standards
              </Link>
            </li>
            <li>
              <Link href="/legal/anti-trafficking" className={styles.about__link}>
                → Anti-Trafficking Policy
              </Link>
            </li>
          </ul>

          <p className={styles.about__note}>
            <strong>Digital Agreement:</strong> By submitting your profile or using our services, you legally agree to these terms as if you had signed them physically. Any attempt to create a profile with false or stolen identity may be reported to authorities.
          </p>
        </section>

        {/* POPULAR CITIES (Internal Linking for SEO) */}
        <section
          className={styles.about__section}
          aria-labelledby="cities-title"
          data-reveal
        >
          <div className={styles.about__sectionHeader}>
            <h2 id="cities-title">Find Gay Massage &amp; Male Massage in Popular Cities</h2>
          </div>

          <p>
            Explore LGBT-friendly massage therapists in major cities across the United States:
          </p>

          <div className={styles.about__grid}>
            <Link href="/city/miami" className={styles.about__cityLink}>
              Miami Gay Massage
            </Link>
            <Link href="/city/new-york" className={styles.about__cityLink}>
              NYC Male Massage
            </Link>
            <Link href="/city/los-angeles" className={styles.about__cityLink}>
              Los Angeles LGBT Massage
            </Link>
            <Link href="/city/san-francisco" className={styles.about__cityLink}>
              San Francisco Gay Massage
            </Link>
            <Link href="/city/las-vegas" className={styles.about__cityLink}>
              Las Vegas Gay Massage
            </Link>
            <Link href="/city/chicago" className={styles.about__cityLink}>
              Chicago M4M Massage
            </Link>
            <Link href="/city/atlanta" className={styles.about__cityLink}>
              Atlanta Gay Massage
            </Link>
            <Link href="/city/orlando" className={styles.about__cityLink}>
              Orlando Male Massage
            </Link>
            <Link href="/city/fort-lauderdale" className={styles.about__cityLink}>
              Fort Lauderdale LGBT Massage
            </Link>
            <Link href="/city/san-diego" className={styles.about__cityLink}>
              San Diego Gay Massage
            </Link>
            <Link href="/city/seattle" className={styles.about__cityLink}>
              Seattle Male Massage
            </Link>
            <Link href="/city/phoenix" className={styles.about__cityLink}>
              Phoenix Gay Massage
            </Link>
          </div>

          <p className={styles.about__note}>
            Browse the full directory at{" "}
            <Link href="/directory" className={styles.about__link}>
              masseurmatch.com/directory
            </Link>{" "}
            for complete nationwide coverage.
          </p>
        </section>
      </main>
    </>
  );
}
