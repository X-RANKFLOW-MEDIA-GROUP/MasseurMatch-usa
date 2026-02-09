import Link from "next/link";
import { TRUST_PILLARS, SAFETY_STEPS, POLICY_NOTICES } from "@/src/data/trustContent";
import styles from "@/src/styles/hubPages.module.css";

export const metadata = {
  title: "Trust & Safety | MasseurMatch",
  description:
    "Clear, transparent safety standards for gay massage in the USA.",
};

export default function TrustAndSafetyPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <div className={styles.heroGrid}>
            <div>
              <span className={styles.eyebrow}>Trust Center</span>
              <h1 className={styles.heroTitle}>Trust & Safety, USA First</h1>
              <p className={styles.heroSubtitle}>
                We keep expectations clear and professional. Here is what we
                verify, how we review profiles, and how you can book with
                confidence.
              </p>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <strong>Transparent verification</strong>
                <p className={styles.sectionText}>
                  We disclose what is checked and what is not.
                </p>
              </div>
              <div className={styles.stat}>
                <strong>Community-first</strong>
                <p className={styles.sectionText}>
                  Respectful, professional wellness is the standard.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>What we verify</h2>
          <div className={styles.cardGrid}>
            {TRUST_PILLARS.map((pillar) => (
              <article key={pillar.title} className={styles.card}>
                <h3 className={styles.cardTitle}>{pillar.title}</h3>
                <p className={styles.sectionText}>{pillar.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Safety checklist</h2>
          <ul className={styles.list}>
            {SAFETY_STEPS.map((step) => (
              <li key={step} className={styles.listItem}>
                <span className={styles.tag}>Step</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Community rules</h2>
          <div className={styles.cardGrid}>
            {POLICY_NOTICES.map((notice) => (
              <article key={notice.title} className={styles.card}>
                <h3 className={styles.cardTitle}>{notice.title}</h3>
                <p className={styles.sectionText}>{notice.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.cta}>
          <h2 className={styles.sectionTitle}>Need more detail?</h2>
          <p className={styles.sectionText}>
            Review our policies or learn etiquette guidelines before booking.
          </p>
          <div className={styles.ctaActions}>
            <Link className="btn btn--accent" href="/community-guidelines">
              Community guidelines
            </Link>
            <Link className="btn btn--ghost" href="/massage-etiquette">
              Massage etiquette
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
