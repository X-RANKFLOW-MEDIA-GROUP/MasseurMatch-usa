import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import styles from "./page.module.css";

type PageProps = {
  params: {
    location: string;
  };
};

const UPPER_TOKENS = new Set(["dc", "usa", "uk"]);

const sanitizeSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");

const formatLocation = (slug: string) =>
  slug
    .split("-")
    .map((word) => {
      if (!word) return "";
      if (UPPER_TOKENS.has(word)) return word.toUpperCase();
      if (word === "st") return "St";
      return word[0].toUpperCase() + word.slice(1);
    })
    .join(" ");

const buildMetadata = (locationName: string, locationSlug: string): Metadata => {
  const title = `Gay Massage in ${locationName} | Premium Services | Book Online`;
  const description = `Find gay massage in ${locationName} with verified therapists. Explore male massage, gay masseurs ${locationName}, and massage techniques for men. Book online with confidence.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.masseurmatch.com/massage/${locationSlug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.masseurmatch.com/massage/${locationSlug}`,
      type: "website",
    },
  };
};

const buildFaq = (locationName: string) => [
  {
    question: `Is gay massage in ${locationName} professional and respectful?`,
    answer:
      "Yes. Sessions are therapeutic and focused on wellness, with full respect for your privacy and boundaries.",
  },
  {
    question: "What are the benefits of male relaxation massage?",
    answer:
      "It helps reduce muscle tension, improve circulation, and support deep relaxation after a long day.",
  },
  {
    question: `How do I find gay masseurs in ${locationName}?`,
    answer:
      "Use MasseurMatch filters by city, specialty, and preferences to discover professionals that match your needs.",
  },
  {
    question: "Which massage techniques for men are available?",
    answer:
      "You can find options like relaxation massage, deep tissue, sports massage, shiatsu, and other recovery therapies.",
  },
  {
    question: "How do I book a session?",
    answer:
      "Pick a profile, check availability, and send a request. The professional confirms your time directly in the platform.",
  },
];

export function generateMetadata({ params }: PageProps): Metadata {
  const safeSlug = sanitizeSlug(params.location || "");
  const locationSlug = safeSlug || "your-city";
  const locationName = safeSlug ? formatLocation(safeSlug) : "Your City";

  return buildMetadata(locationName, locationSlug);
}

export default function LocationMassagePage({ params }: PageProps) {
  const safeSlug = sanitizeSlug(params.location || "");
  const locationName = safeSlug ? formatLocation(safeSlug) : "Your City";
  const faqItems = buildFaq(locationName);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div>
              <span className={styles.eyebrow}>Inclusive local wellness</span>
              <h1 className={styles.title}>
                Gay Massage in {locationName} - Wellness Specialists
              </h1>
              <p className={styles.lead}>
                Find gay massage in {locationName} with verified therapists.
                Whether you want a male relaxation massage or specific massage
                techniques for men, you choose the ideal style with confidence.
              </p>
              <p className={styles.note}>
                Also known as gay massage, this service is professional and
                wellness-focused.
              </p>
              <div className={styles.ctaRow}>
                <Link href="/explore" className={styles.ctaPrimary}>
                  Explore profiles
                </Link>
                <Link href="/join" className={styles.ctaGhost}>
                  Join as a therapist
                </Link>
              </div>
            </div>
            <div className={styles.heroCard}>
              <Image
                src="/images/gay-massage-hero.svg"
                alt={`Gay massage in ${locationName} with verified therapists`}
                width={1200}
                height={800}
                className={styles.heroImage}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
              Why choose MasseurMatch in {locationName}
            </h2>
            <p className={styles.sectionLead}>
              We connect you with professionals who understand your preferences
              and deliver a safe, transparent, and welcoming experience.
            </p>
          </div>
          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <h3>Verified professionals</h3>
              <p>
                Complete profiles, proven experience, and a focus on therapeutic
                wellness.
              </p>
            </div>
            <div className={styles.card}>
              <h3>Gay masseurs in {locationName}</h3>
              <p>
                Inclusive filters to match your style, schedule, and preferences.
              </p>
            </div>
            <div className={styles.card}>
              <h3>Easy booking</h3>
              <p>
                Book directly on the platform and receive fast confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Massage techniques for men in {locationName}
            </h2>
            <p className={styles.sectionLead}>
              Choose the right approach for relaxation, muscle recovery, or
              tension relief. Male relaxation massage is a favorite for fast
              comfort.
            </p>
          </div>
          <ul className={styles.list}>
            <li>Male relaxation massage to reduce stress.</li>
            <li>Deep tissue to release deep tension.</li>
            <li>Sports massage for recovery and performance.</li>
            <li>Shiatsu and eastern therapies for balance.</li>
            <li>Relief techniques for legs and back.</li>
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.split}>
            <div className={styles.panel}>
              <h3>Local and trustworthy care</h3>
              <p>
                We focus on gay massage in {locationName} and nearby areas, with
                clear details about the service location, techniques, and
                availability so you can choose with confidence.
              </p>
            </div>
            <div className={styles.panel}>
              <h3>Client-first experience</h3>
              <p>
                Each profile highlights specialties and practices so you can
                find massage techniques for men aligned with your wellness
                goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Frequently asked questions</h2>
            <p className={styles.sectionLead}>
              Clear answers to help you book with confidence.
            </p>
          </div>
          <dl className={styles.faq}>
            {faqItems.map((item) => (
              <div key={item.question} className={styles.faqItem}>
                <dt>{item.question}</dt>
                <dd>{item.answer}</dd>
              </div>
            ))}
          </dl>
          <div className={styles.bottomCta}>
            <Link href="/explore" className={styles.ctaPrimary}>
              See therapists in {locationName}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
