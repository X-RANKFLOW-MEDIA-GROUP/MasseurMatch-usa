import Link from "next/link";
import { BLOG_POSTS, getBlogPost } from "@/src/data/blogPosts";
import styles from "@/src/styles/hubPages.module.css";

type PageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: PageProps) {
  const post = getBlogPost(params.slug);
  if (!post) {
    return {
      title: "Article not found | MasseurMatch",
    };
  }
  return {
    title: `${post.title} | MasseurMatch`,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: PageProps) {
  const post = getBlogPost(params.slug);
  if (!post) {
    return (
      <main className={styles.page}>
        <div className={styles.shell}>
          <section className={styles.hero}>
            <span className={styles.eyebrow}>MasseurMatch Journal</span>
            <h1 className={styles.heroTitle}>Article not found</h1>
            <p className={styles.heroSubtitle}>
              The article you requested does not exist or may have moved.
            </p>
            <div className={styles.ctaActions}>
              <Link className="btn btn--accent" href="/blog">
                Back to blog
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
              <span className={styles.eyebrow}>{post.category}</span>
              <h1 className={styles.heroTitle}>{post.title}</h1>
              <p className={styles.heroSubtitle}>{post.excerpt}</p>
              <div className={styles.tagRow}>
                <span className={styles.tag}>{post.date}</span>
                <span className={styles.tag}>{post.readingTime}</span>
                {post.cityFocus && (
                  <span className={styles.tag}>{post.cityFocus}</span>
                )}
              </div>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <strong>USA Focus</strong>
                <p className={styles.sectionText}>
                  Built for American cities and travel-ready booking.
                </p>
              </div>
              <div className={styles.stat}>
                <strong>Trust First</strong>
                <p className={styles.sectionText}>
                  Clear expectations, professional tone, and safety guidance.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.gridTwo}>
            {post.sections.map((section) => (
              <article key={section.heading} className={styles.card}>
                <h2 className={styles.cardTitle}>{section.heading}</h2>
                {section.paragraphs.map((para, index) => (
                  <p key={index} className={styles.sectionText}>
                    {para}
                  </p>
                ))}
              </article>
            ))}
          </div>
        </section>

        <section className={styles.cta}>
          <h2 className={styles.sectionTitle}>Ready to book?</h2>
          <p className={styles.sectionText}>
            Explore vetted profiles across the USA and find your ideal
            therapist today.
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
