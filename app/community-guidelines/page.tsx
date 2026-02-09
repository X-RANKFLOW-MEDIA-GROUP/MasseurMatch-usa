import Link from "next/link";
import styles from "@/src/styles/hubPages.module.css";

export const metadata = {
  title: "Community Guidelines | MasseurMatch",
  description:
    "Community guidelines for the USA-focused gay massage directory.",
};

export default function CommunityGuidelinesPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>Community</span>
          <h1 className={styles.heroTitle}>Community Guidelines</h1>
          <p className={styles.heroSubtitle}>
            MasseurMatch is a professional wellness directory. We keep the
            platform respectful, safe, and focused on massage services only.
          </p>
          <div className={styles.tagRow}>
            <span className={styles.tag}>Last updated: Feb 8, 2026</span>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Professional conduct</h2>
          <p className={styles.sectionText}>
            Treat everyone with respect. Harassment, hate speech, or explicit
            content will result in removal.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Accurate profiles</h2>
          <p className={styles.sectionText}>
            Providers must keep pricing, services, and availability accurate.
            Misleading profiles are removed.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Safety first</h2>
          <p className={styles.sectionText}>
            We encourage bookings in safe environments. Use the report feature
            for any concern.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. No explicit services</h2>
          <p className={styles.sectionText}>
            MasseurMatch is a wellness directory. Explicit or illegal services
            are prohibited.
          </p>
        </section>

        <section className={styles.cta}>
          <h2 className={styles.sectionTitle}>Learn more</h2>
          <p className={styles.sectionText}>
            Read our etiquette guide or trust center to book responsibly.
          </p>
          <div className={styles.ctaActions}>
            <Link className="btn btn--accent" href="/massage-etiquette">
              Massage etiquette
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
