import Link from "next/link";
import styles from "@/src/styles/hubPages.module.css";

export const metadata = {
  title: "Privacy Policy | MasseurMatch",
  description:
    "Privacy policy for MasseurMatch, the USA-focused gay massage directory.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>Legal</span>
          <h1 className={styles.heroTitle}>Privacy Policy</h1>
          <p className={styles.heroSubtitle}>
            We respect your privacy and keep data collection minimal. This
            policy explains what we collect, how we use it, and your choices.
          </p>
          <div className={styles.tagRow}>
            <span className={styles.tag}>Last updated: Feb 8, 2026</span>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Data we collect</h2>
          <p className={styles.sectionText}>
            We collect profile data submitted by providers, basic analytics for
            site performance, and optional contact information for account
            support.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. How we use data</h2>
          <p className={styles.sectionText}>
            Data is used to display profiles, improve search relevance, and
            maintain trust and safety across the platform.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Cookies and analytics</h2>
          <p className={styles.sectionText}>
            We use cookies for authentication and performance measurement. You
            can control cookies via your browser settings.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Your choices</h2>
          <p className={styles.sectionText}>
            You can request profile updates, corrections, or removal by
            contacting support.
          </p>
        </section>

        <section className={styles.cta}>
          <h2 className={styles.sectionTitle}>Need more context?</h2>
          <p className={styles.sectionText}>
            Review our community guidelines or trust center for details on
            platform standards.
          </p>
          <div className={styles.ctaActions}>
            <Link className="btn btn--accent" href="/community-guidelines">
              Community guidelines
            </Link>
            <Link className="btn btn--ghost" href="/trust-and-safety">
              Trust & Safety
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
