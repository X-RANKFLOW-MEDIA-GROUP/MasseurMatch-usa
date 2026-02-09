import Link from "next/link";
import { BLOG_POSTS } from "@/src/data/blogPosts";
import styles from "@/src/styles/hubPages.module.css";

export const metadata = {
  title: "MasseurMatch Blog | Gay Massage in the USA",
  description:
    "Wellness, safety, and city guides for gay massage across the United States.",
};

export default function BlogPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <div className={styles.heroGrid}>
            <div>
              <span className={styles.eyebrow}>MasseurMatch Journal</span>
              <h1 className={styles.heroTitle}>
                USA Gay Massage Insights & Guides
              </h1>
              <p className={styles.heroSubtitle}>
                Practical wellness, trusted safety guidance, and local city
                guides to help you book with confidence across the United
                States.
              </p>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <strong>USA Focus</strong>
                <p className={styles.sectionText}>
                  City-first guides for high-intent search and booking.
                </p>
              </div>
              <div className={styles.stat}>
                <strong>Trust & Safety</strong>
                <p className={styles.sectionText}>
                  Clear expectations, etiquette, and verified insights.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Latest Articles</h2>
          <div className={styles.cardGrid}>
            {BLOG_POSTS.map((post) => (
              <article key={post.slug} className={styles.card}>
                <span className={styles.badge}>{post.category}</span>
                <h3 className={styles.cardTitle}>{post.title}</h3>
                <p className={styles.sectionText}>{post.excerpt}</p>
                <div className={styles.tagRow}>
                  <span className={styles.tag}>{post.date}</span>
                  <span className={styles.tag}>{post.readingTime}</span>
                  {post.cityFocus && (
                    <span className={styles.tag}>{post.cityFocus}</span>
                  )}
                </div>
                <div className={styles.divider} />
                <Link className={styles.link} href={`/blog/${post.slug}`}>
                  Read article {"->"}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.cta}>
          <h2 className={styles.sectionTitle}>Looking for a therapist now?</h2>
          <p className={styles.sectionText}>
            Explore verified profiles across the USA, with clear pricing,
            specialties, and availability.
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
