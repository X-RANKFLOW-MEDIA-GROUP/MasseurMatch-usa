import Link from "next/link";
import { US_CITY_HUBS, getCityHub } from "@/src/data/usCities";
import styles from "@/src/styles/hubPages.module.css";

type PageProps = {
  params: { city: string };
};

export function generateStaticParams() {
  return US_CITY_HUBS.map((city) => ({ city: city.slug }));
}

export function generateMetadata({ params }: PageProps) {
  const city = getCityHub(params.city);
  if (!city) {
    return {
      title: "City not found | MasseurMatch",
    };
  }
  return {
    title: `${city.name}, ${city.stateCode} Gay Massage | MasseurMatch`,
    description: city.hero,
  };
}

export default function CityPage({ params }: PageProps) {
  const city = getCityHub(params.city);
  if (!city) {
    return (
      <main className={styles.page}>
        <div className={styles.shell}>
          <section className={styles.hero}>
            <span className={styles.eyebrow}>City hub</span>
            <h1 className={styles.heroTitle}>City not found</h1>
            <p className={styles.heroSubtitle}>
              We could not find this city. Explore other USA hubs instead.
            </p>
            <div className={styles.ctaActions}>
              <Link className="btn btn--accent" href="/cities">
                Browse USA cities
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <div className={styles.heroGrid}>
            <div>
              <span className={styles.eyebrow}>USA City Hub</span>
              <h1 className={styles.heroTitle}>
                {city.name}, {city.stateCode} Gay Massage
              </h1>
              <p className={styles.heroSubtitle}>{city.hero}</p>
              <div className={styles.tagRow}>
                {city.vibe.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <strong>Local Focus</strong>
                <p className={styles.sectionText}>{city.summary}</p>
              </div>
              <div className={styles.stat}>
                <strong>Top Searches</strong>
                <p className={styles.sectionText}>
                  {city.keywords.slice(0, 2).join(" | ")}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Neighborhood Guides</h2>
          <div className={styles.cardGrid}>
            {city.neighborhoods.map((hood) => (
              <article key={hood.slug} className={styles.card}>
                <h3 className={styles.cardTitle}>{hood.name}</h3>
                <p className={styles.sectionText}>{hood.summary}</p>
                <div className={styles.tagRow}>
                  {hood.highlights.map((item) => (
                    <span key={item} className={styles.tag}>
                      {item}
                    </span>
                  ))}
                </div>
                <div className={styles.divider} />
                <Link
                  className={styles.link}
                  href={`/cities/${city.slug}/${hood.slug}`}
                >
                  Explore {hood.name} {"\u2192"}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Quick Start</h2>
          <div className={styles.gridTwo}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Search in Explore</h3>
              <p className={styles.sectionText}>
                Filter by specialty, availability, and payment methods across
                {` ${city.name}`}.
              </p>
              <Link className={styles.link} href="/explore">
                Explore therapists {"\u2192"}
              </Link>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Trust & Safety</h3>
              <p className={styles.sectionText}>
                Learn how we review profiles and keep the community safe.
              </p>
              <Link className={styles.link} href="/trust-and-safety">
                Read our trust center {"\u2192"}
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <h2 className={styles.sectionTitle}>
            Are you a therapist in {city.name}?
          </h2>
          <p className={styles.sectionText}>
            Join MasseurMatch and reach high-intent clients in {city.name}.
          </p>
          <div className={styles.ctaActions}>
            <Link className="btn btn--accent" href="/join">
              Join as a therapist
            </Link>
            <Link className="btn btn--ghost" href="/explore">
              Explore profiles
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
