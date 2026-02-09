import Link from "next/link";
import styles from "@/src/styles/hubPages.module.css";

export const metadata = {
  title: "Terms of Use | MasseurMatch",
  description:
    "Terms of use for MasseurMatch, the USA-focused gay massage directory.",
};

export default function TermsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>Legal</span>
          <h1 className={styles.heroTitle}>Terms of Use</h1>
          <p className={styles.heroSubtitle}>
            These terms govern your use of MasseurMatch in the United States.
            Please read them carefully before using the platform.
          </p>
          <div className={styles.tagRow}>
            <span className={styles.tag}>Last updated: Feb 8, 2026</span>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Directory only</h2>
          <p className={styles.sectionText}>
            MasseurMatch is a directory platform. We do not provide massage
            services, process payments for sessions, or guarantee outcomes.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Professional conduct</h2>
          <p className={styles.sectionText}>
            All users must follow professional and respectful conduct. Explicit
            content or illegal activity is strictly prohibited.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Profile responsibility</h2>
          <p className={styles.sectionText}>
            Providers are responsible for the accuracy of their profiles and
            compliance with local regulations. Clients are responsible for
            verifying suitability before booking.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Account actions</h2>
          <p className={styles.sectionText}>
            We may suspend or remove accounts that violate our policies or harm
            community trust.
          </p>
        </section>

        <section className={styles.cta}>
          <h2 className={styles.sectionTitle}>Questions?</h2>
          <p className={styles.sectionText}>
            Review our privacy policy or trust center for more details.
          </p>
          <div className={styles.ctaActions}>
            <Link className="btn btn--accent" href="/privacy-policy">
              Privacy policy
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
