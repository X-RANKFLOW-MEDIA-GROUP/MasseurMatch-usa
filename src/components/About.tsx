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
      { threshold: 0.12 }
    );

    const revealables = root.querySelectorAll<HTMLElement>("[data-reveal]");
    revealables.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <main className={styles.about} ref={rootRef}>
      {/* HERO */}
      <header className={styles.about__hero} data-reveal>
        <h1 className={styles.about__title}>About Our Platform</h1>

        <p className={styles.about__tagline}>
          Join <strong>MasseurMatch</strong> — Empowering Independent Professionals
        </p>

        <p className={styles.about__intro}>
          Welcome to a transparent, inclusive directory built for trusted wellness connections.
          This is your space to be seen, be respected, and connect directly with clients — on your terms.
        </p>

        <div className={styles.about__cta}>
          <Link
            href="/join"
            className={`${styles.btn} ${styles["btn--primary"]}`}
            aria-label="Join as Provider"
          >
            Join as Provider
          </Link>

          <Link
            href="/directory"
            className={`${styles.btn} ${styles["btn--ghost"]}`}
            aria-label="Explore Directory"
          >
            Explore Directory
          </Link>

          <Link
            href="/before-you-list"
            className={`${styles.btn} ${styles["btn--link"]}`}
            aria-label="Before You List"
          >
            Before You List
          </Link>
        </div>

        <div className={styles.about__note}>
          <strong>Platform note:</strong> MasseurMatch is a visibility platform — not an agency. By joining, you confirm
          that you are an independent provider responsible for your own services, communications, and compliance with all
          local laws and standards.
        </div>
      </header>

      {/* TRANSPARENCY & DISCLAIMERS */}
      <section
        className={styles.about__section}
        aria-labelledby="transparency-title"
        data-reveal
      >
        <div className={styles.about__sectionHeader}>
          <h2 id="transparency-title">Platform Transparency &amp; Disclaimers</h2>
        </div>

        <p>
          We are committed to transparency and inclusivity. Here&apos;s what you need to know
          about how MasseurMatch works.
        </p>

        <ul className={styles.about__grid}>
          <li className={styles.about__card} data-reveal>
            <div className={styles.about__cardHead}>
              <h3>You Are Independent</h3>
            </div>
            <p>
              You are not employed by MasseurMatch. You operate independently and manage your own business, including
              client communication and bookings.
            </p>
          </li>

          <li className={styles.about__card} data-reveal>
            <div className={styles.about__cardHead}>
              <h3>No License Verification</h3>
            </div>
            <p>
              MasseurMatch does not verify credentials. If you list a license or certification, it is self-declared.
              Clients are encouraged to confirm credentials directly before booking.
            </p>
          </li>

          <li className={styles.about__card} data-reveal>
            <div className={styles.about__cardHead}>
              <h3>No Endorsements</h3>
            </div>
            <p>
              Featured placements like &quot;Travel Boost&quot; or &quot;Masseur of the Day&quot; are paid promotional options.
              These do not reflect endorsements by MasseurMatch or its owners.
            </p>
          </li>

          <li className={styles.about__card} data-reveal>
            <div className={styles.about__cardHead}>
              <h3>Provider-Owned Content</h3>
            </div>
            <p>
              All profile content (bio, pricing, photos, etc.) is submitted and controlled by you. We do not review or
              edit listings for accuracy, professionalism, or legality.
            </p>
          </li>

          <li className={styles.about__card} data-reveal>
            <div className={styles.about__cardHead}>
              <h3>No Medical Claims</h3>
            </div>
            <p>
              MasseurMatch is for wellness discovery. Listings may not be used to diagnose, treat, or prescribe unless
              you are properly licensed and compliant with your jurisdiction&apos;s laws.
            </p>
          </li>

          <li className={styles.about__card} data-reveal>
            <div className={styles.about__cardHead}>
              <h3>Inclusion is Non-Negotiable</h3>
            </div>
            <p>
              We proudly support LGBTQ+ providers and clients. Discrimination, hate speech, or harassment will result in
              immediate removal.
            </p>
          </li>

          <li className={styles.about__card} data-reveal>
            <div className={styles.about__cardHead}>
              <h3>Directory Only — No Bookings</h3>
            </div>
            <p> mjr
              MasseurMatch does not process payments, bookings, or messaging. We are not a marketplace or intermediary —
              we&apos;re a visibility tool.
            </p>
          </li>
        </ul>
      </section>

      {/* LEGAL ENTITY */}
      <section
        className={styles.about__section}
        aria-labelledby="entity-title"
        data-reveal
      >
        <div className={styles.about__sectionHeader}>
          <h2 id="entity-title">Legal Entity &amp; Contact</h2>
        </div>

        <address className={styles.about__address}>
          <div><strong>MasseurMatch</strong> is owned and operated by:</div>
          <div>X RankFlow Media Group LLC</div>
          <div>8 The Green, Ste B</div>
          <div>Dover, DE 19901</div>
          <div className={styles.about__contact}>
            Legal Contact:{" "}
            <a href="mailto:legal@masseurmatch.com" className={styles.about__link}>
              legal@masseurmatch.com
            </a>
          </div>
        </address>
      </section>

      {/* AGREEMENT TERMS */}
      <section
        className={styles.about__section}
        aria-labelledby="agreement-title"
        data-reveal
      >
        <div className={styles.about__sectionHeader}>
          <h2 id="agreement-title">Agreement Terms</h2>
        </div>

        <p>By submitting your profile, you confirm that you have read and agree to:</p>

        <ul className={styles.about__links}>
          <li>
            <Link href="/terms" className={styles.about__link}>
              → Terms of Service
            </Link>
          </li>
          <li>
            <Link href="/privacy" className={styles.about__link}>
              → Privacy Policy
            </Link>
          </li>
          <li>
            <Link href="/community-guidelines" className={styles.about__link}>
              → Community Guidelines
            </Link>
          </li>
          <li>
            <Link href="/platform-disclaimer" className={styles.about__link}>
              → Platform Disclaimer
            </Link>
          </li>
        </ul>
      </section>

      {/* LEGAL CLAUSES */}
      <section
        className={styles.about__section}
        aria-labelledby="legal-title"
        data-reveal
      >
        <div className={styles.about__sectionHeader}>
          <h2 id="legal-title">Legal Clauses &amp; User Terms</h2>
        </div>

        <p>Important information about liability, user responsibilities, and platform policies.</p>

        <div className={styles.about__legal}>
          <article className={styles.about__legalItem} data-reveal>
            <div className={styles.about__cardHead}>
              <h3>Limitation of Liability</h3>
            </div>
            <p>
              MasseurMatch is not responsible for losses, damages, claims, or disputes arising between providers and
              clients. By using this platform, you accept that any interaction or transaction is at your own risk and
              discretion.
            </p>
          </article>

          <article className={styles.about__legalItem} data-reveal>
            <div className={styles.about__cardHead}>
              <h3>User Responsibility &amp; Eligibility</h3>
            </div>
            <p>
              By creating a profile, you confirm that you are at least 18 years old, comply with local laws, and are
              legally eligible to offer the services you advertise.
            </p>
          </article>

          <article className={styles.about__legalItem} data-reveal>
            <div className={styles.about__cardHead}>
              <h3>Prohibited Conduct</h3>
            </div>
            <p>
              It is prohibited to use this platform for illegal purposes, commercial sexual activities, identity
              impersonation, or sending offensive content. Accounts that violate these rules will be deleted without
              notice.
            </p>
          </article>

          <article className={styles.about__legalItem} data-reveal>
            <div className={styles.about__cardHead}>
              <h3>Right to Remove Listings</h3>
            </div>
            <p>
              MasseurMatch reserves the right to reject or remove any profile that violates our policies, damages our
              reputation, or creates legal risks, at our sole discretion.
            </p>
          </article>

          <article className={styles.about__legalItem} data-reveal>
            <div className={styles.about__cardHead}>
              <h3>Governing Law &amp; Jurisdiction</h3>
            </div>
            <p>
              This platform operates under the laws of the State of Delaware, USA. Any disputes will be resolved in the
              courts of that jurisdiction.
            </p>
          </article>

          <article className={styles.about__legalItem} data-reveal>
            <div className={styles.about__cardHead}>
              <h3>Digital Signature &amp; No Impersonation</h3>
            </div>
            <p>
              By submitting your profile, you legally agree to the terms described here as if you had signed them
              physically. Any attempt to create a profile with false or stolen identity may be reported to authorities.
            </p>
          </article>
        </div>
      </section>

      {/* LEGACY / EXTRA SECTION */}
      <section
        className={`${styles.about__section} ${styles.about__legacy}`}
        aria-labelledby="legacy-title"
        data-reveal
      >
        <div className={styles.about__sectionHeader}>
          <h2 id="legacy-title">About Us</h2>
        </div>
        <p>
          Welcome to our massage therapy website. We are dedicated to providing the best services to help you relax and
          rejuvenate.
        </p>
      </section>
    </main>
  );
}
