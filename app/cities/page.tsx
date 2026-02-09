import Link from "next/link";
import { US_CITY_HUBS } from "@/src/data/usCities";
import styles from "@/src/styles/hubPages.module.css";

export const metadata = {
  title: "USA Cities | MasseurMatch",
  description:
    "Explore gay massage professionals by city across the United States.",
};

export default function CitiesPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <div className={styles.heroGrid}>
            <div>
              <span className={styles.eyebrow}>USA City Hubs</span>
              <h1 className={styles.heroTitle}>
                Find Gay Massage by City in the USA
              </h1>
              <p className={styles.heroSubtitle}>
                Browse curated hubs for the most searched US markets, including
                neighborhood guides and local insights.
              </p>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <strong>Local SEO</strong>
                <p className={styles.sectionText}>
                  City and neighborhood pages built for high-intent searches.
                </p>
              </div>
              <div className={styles.stat}>
                <strong>Trusted Profiles</strong>
                <p className={styles.sectionText}>
                  Verified, professional listings with consistent data.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Featured USA Markets</h2>
          <div className={styles.cardGrid}>
            {US_CITY_HUBS.map((city) => (
              <article key={city.slug} className={styles.card}>
                <span className={styles.badge}>{city.region}</span>
                <h3 className={styles.cardTitle}>
                  {city.name}, {city.stateCode}
                </h3>
                <p className={styles.sectionText}>{city.summary}</p>
                <div className={styles.tagRow}>
                  {city.vibe.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className={styles.divider} />
                <Link className={styles.link} href={`/cities/${city.slug}`}>
                  View city hub {"->"}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.cta}>
          <h2 className={styles.sectionTitle}>Want a quick search?</h2>
          <p className={styles.sectionText}>
            Jump into Explore and filter by city, specialty, or availability.
          </p>
          <div className={styles.ctaActions}>
            <Link className="btn btn--accent" href="/explore">
              Explore now
            </Link>
            <Link className="btn btn--ghost" href="/join">
              Join as a therapist
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

