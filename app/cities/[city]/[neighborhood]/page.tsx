import Link from "next/link";
import { US_CITY_HUBS, getCityHub, getNeighborhood } from "@/src/data/usCities";
import styles from "@/src/styles/hubPages.module.css";

type PageProps = {
  params: { city: string; neighborhood: string };
};

export function generateStaticParams() {
  return US_CITY_HUBS.flatMap((city) =>
    city.neighborhoods.map((hood) => ({
      city: city.slug,
      neighborhood: hood.slug,
    }))
  );
}

export function generateMetadata({ params }: PageProps) {
  const city = getCityHub(params.city);
  const hood = city ? getNeighborhood(city, params.neighborhood) : null;
  if (!city || !hood) {
    return {
      title: "Neighborhood not found | MasseurMatch",
    };
  }
  return {
    title: `${hood.name}, ${city.stateCode} Gay Massage | MasseurMatch`,
    description: hood.summary,
  };
}

export default function NeighborhoodPage({ params }: PageProps) {
  const city = getCityHub(params.city);
  const hood = city ? getNeighborhood(city, params.neighborhood) : null;

  if (!city || !hood) {
    return (
      <main className={styles.page}>
        <div className={styles.shell}>
          <section className={styles.hero}>
            <span className={styles.eyebrow}>Neighborhood guide</span>
            <h1 className={styles.heroTitle}>Neighborhood not found</h1>
            <p className={styles.heroSubtitle}>
              We could not find this neighborhood. Try another city hub.
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
              <span className={styles.eyebrow}>Neighborhood Focus</span>
              <h1 className={styles.heroTitle}>
                {hood.name}, {city.name}
              </h1>
              <p className={styles.heroSubtitle}>{hood.summary}</p>
              <div className={styles.tagRow}>
                {hood.highlights.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <strong>City hub</strong>
                <p className={styles.sectionText}>
                  Part of {city.name}, {city.stateCode}
                </p>
              </div>
              <div className={styles.stat}>
                <strong>Travel-ready</strong>
                <p className={styles.sectionText}>
                  Discreet, professional sessions tailored for local demand.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Why book in {hood.name}?</h2>
          <div className={styles.gridTwo}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Premium access</h3>
              <p className={styles.sectionText}>
                Neighborhood-specific profiles with clear services and pricing.
              </p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Reliable scheduling</h3>
              <p className={styles.sectionText}>
                Professionals who understand local availability and travel
                patterns.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <h2 className={styles.sectionTitle}>Start your search</h2>
          <p className={styles.sectionText}>
            Filter for specialties, availability, and payment preferences in
            {` ${city.name}`}.
          </p>
          <div className={styles.ctaActions}>
            <Link className="btn btn--accent" href="/explore">
              Explore therapists
            </Link>
            <Link className="btn btn--ghost" href={`/cities/${city.slug}`}>
              Back to {city.name}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
