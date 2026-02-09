import Link from "next/link";
import styles from "@/src/styles/hubPages.module.css";

export const metadata = {
  title: "Massage Etiquette | MasseurMatch",
  description:
    "Professional etiquette tips for gay massage bookings in the USA.",
};

export default function MassageEtiquettePage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>Etiquette</span>
          <h1 className={styles.heroTitle}>Gay Massage Etiquette</h1>
          <p className={styles.heroSubtitle}>
            A respectful, professional guide for clients and therapists across
            the USA.
          </p>
          <div className={styles.tagRow}>
            <span className={styles.tag}>Updated Feb 8, 2026</span>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Before the session</h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span className={styles.tag}>1</span>
              <span>Read the profile and confirm services offered.</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.tag}>2</span>
              <span>Communicate goals, injuries, and timing clearly.</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.tag}>3</span>
              <span>Arrive on time and prepared for a wellness session.</span>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>During the session</h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span className={styles.tag}>1</span>
              <span>Keep communication respectful and professional.</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.tag}>2</span>
              <span>Share feedback about pressure or comfort levels.</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.tag}>3</span>
              <span>Respect boundaries and community rules.</span>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>After the session</h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span className={styles.tag}>1</span>
              <span>Hydrate and rest for optimal recovery.</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.tag}>2</span>
              <span>Leave a review if available.</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.tag}>3</span>
              <span>Report any issues to keep the community safe.</span>
            </li>
          </ul>
        </section>

        <section className={styles.cta}>
          <h2 className={styles.sectionTitle}>Ready to book?</h2>
          <p className={styles.sectionText}>
            Explore trusted therapists across the USA.
          </p>
          <div className={styles.ctaActions}>
            <Link className="btn btn--accent" href="/explore">
              Explore therapists
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
