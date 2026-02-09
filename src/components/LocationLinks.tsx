import Link from "next/link";

import { US_CITY_HUBS } from "@/src/data/usCities";
import styles from "./LocationLinks.module.css";

export default function LocationLinks() {
  return (
    <section className={`${styles.section} mm-fade-up mm-fade-up--delay-1`} id="top-cities">
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Popular Cities</p>
          <h2 className={styles.title}>Find Therapists by City</h2>
          <p className={styles.lead}>
            Explore trusted, verified therapists near you. Choose a city to get
            started.
          </p>
        </div>
        <div className={styles.grid}>
          {US_CITY_HUBS.map((location) => (
            <Link
              key={location.slug}
              href={`/massage/${location.slug}`}
              className={styles.card}
            >
              <span className={styles.cardTitle}>
                Massage in {location.name}
              </span>
              <span className={styles.cardMeta}>View local therapists</span>
            </Link>
          ))}
        </div>
        <div className={styles.footer}>
          <Link className={styles.cta} href="/explore">
            Browse all therapists
          </Link>
        </div>
      </div>
    </section>
  );
}
