import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "@/src/styles/comparePages.module.css";

const COMPARISONS: Record<
  string,
  {
    name: string;
    summary: string;
    highlights: { title: string; text: string }[];
    differences: string[];
  }
> = {
  masseurfinder: {
    name: "MasseurFinder",
    summary:
      "Compare coverage, trust signals, and experience between MasseurMatch and MasseurFinder.",
    highlights: [
      {
        title: "Trust-First Profiles",
        text: "MasseurMatch emphasizes verification cues, clear policies, and community standards.",
      },
      {
        title: "Modern Discovery",
        text: "Search, filters, and map views are designed for fast, high-intent browsing.",
      },
      {
        title: "Inclusive Experience",
        text: "Built with a modern, respectful tone for clients and therapists.",
      },
    ],
    differences: [
      "Profile presentation optimized for clarity and safety context.",
      "Cleaner mobile experience with faster navigation.",
      "Transparent plans that prioritize visibility for professionals.",
    ],
  },
  masseurpro: {
    name: "MasseurPro",
    summary:
      "See the core differences between MasseurMatch and MasseurPro for professionals and clients.",
    highlights: [
      {
        title: "Professional Positioning",
        text: "MasseurMatch focuses on premium profile storytelling and credibility cues.",
      },
      {
        title: "Search Intent",
        text: "City-first discovery and SEO-driven structure support local visibility.",
      },
      {
        title: "Client Confidence",
        text: "Clear expectations and guidelines help clients book with confidence.",
      },
    ],
    differences: [
      "Stronger focus on trust, safety, and community standards.",
      "Refined UI built for high conversion and ease of use.",
      "Content and guides designed to reduce booking friction.",
    ],
  },
  rentmasseur: {
    name: "RentMasseur",
    summary:
      "Compare MasseurMatch and RentMasseur on profile quality, trust signals, and UX.",
    highlights: [
      {
        title: "Clear Profile Structure",
        text: "MasseurMatch profiles highlight availability, specialties, and pricing with clarity.",
      },
      {
        title: "Safety & Transparency",
        text: "Policies and user guidance are surfaced across the experience.",
      },
      {
        title: "High-Intent Leads",
        text: "Focused SEO and city hubs help connect professionals with ready-to-book clients.",
      },
    ],
    differences: [
      "Streamlined, modern interface built for speed.",
      "Explicit guidelines that promote safer community standards.",
      "Emphasis on consistent branding and professional trust signals.",
    ],
  },
};

export const generateMetadata = ({ params }: { params: { brand: string } }) => {
  const data = COMPARISONS[params.brand];
  if (!data) return { title: "Comparison | MasseurMatch" };
  return {
    title: `MasseurMatch vs ${data.name}`,
    description: `See the differences between MasseurMatch and ${data.name}.`,
  };
};

export default function CompareBrandPage({
  params,
}: {
  params: { brand: string };
}) {
  const data = COMPARISONS[params.brand];

  if (!data) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={`${styles.hero} mm-fade-up`}>
          <span className={styles.eyebrow}>Comparison</span>
          <h1 className={styles.title}>Difference with {data.name}</h1>
          <p className={styles.subtitle}>{data.summary}</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Key highlights</h2>
          <div className={styles.grid}>
            {data.highlights.map((item) => (
              <div key={item.title} className={styles.card}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardText}>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>What stands out</h2>
          <ul className={styles.list}>
            {data.differences.map((item) => (
              <li key={item} className={styles.listItem}>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.cta}>
          <h2 className={styles.sectionTitle}>Explore MasseurMatch</h2>
          <p className={styles.subtitle}>
            Browse verified profiles, compare specialties, and connect with
            professionals today.
          </p>
          <div className={styles.ctaActions}>
            <Link className={styles.ctaLink} href="/explore">
              Explore therapists
            </Link>
            <Link className={styles.ctaLinkGhost} href="/join">
              Join as a therapist
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
