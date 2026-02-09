"use client";

import Link from "next/link";
import styles from "./ComparisonLinks.module.css";

const COMPARISONS = [
  {
    slug: "masseurfinder",
    name: "MasseurFinder",
    description: "How MasseurMatch compares to MasseurFinder for trust, visibility, and support.",
  },
  {
    slug: "masseurpro",
    name: "MasseurPro",
    description: "See the key differences between MasseurMatch and MasseurPro.",
  },
  {
    slug: "rentmasseur",
    name: "RentMasseur",
    description: "Compare listings, safety, and profile quality against RentMasseur.",
  },
];

export default function ComparisonLinks() {
  return (
    <section className={`${styles.section} mm-fade-up mm-fade-up--delay-3`} id="comparisons">
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Comparisons</p>
          <h2 className={styles.title}>See the Differences</h2>
          <p className={styles.lead}>
            Learn how MasseurMatch compares with other directories and platforms.
          </p>
        </div>
        <div className={styles.grid}>
          {COMPARISONS.map((item) => (
            <Link
              key={item.slug}
              href={`/compare/${item.slug}`}
              className={styles.card}
            >
              <h3 className={styles.cardTitle}>
                Difference with {item.name}
              </h3>
              <p className={styles.cardText}>{item.description}</p>
              <span className={styles.cardLink}>Read comparison \u2192</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
