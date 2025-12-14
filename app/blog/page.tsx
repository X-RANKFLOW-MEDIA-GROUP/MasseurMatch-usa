import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "./data/posts";

export const metadata: Metadata = {
  title: "Blog | MasseurMatch - Wellness & Massage Therapy Insights",
  description:
    "Explore our blog for expert insights on massage therapy, wellness tips, self-care guides, and LGBTQ+ inclusive health resources. Your journey to better wellness starts here.",
  keywords: [
    "massage therapy blog",
    "wellness tips",
    "self-care",
    "LGBTQ wellness",
    "massage benefits",
    "health blog"
  ],
  alternates: {
    canonical: "https://www.masseurmatch.com/blog"
  },
  openGraph: {
    title: "Blog | MasseurMatch - Wellness & Massage Therapy Insights",
    description:
      "Expert insights on massage therapy, wellness tips, and inclusive health resources.",
    url: "https://www.masseurmatch.com/blog",
    siteName: "MasseurMatch",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | MasseurMatch",
    description:
      "Expert insights on massage therapy, wellness tips, and inclusive health resources."
  }
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "MasseurMatch Blog",
  description:
    "Expert insights on massage therapy, wellness tips, self-care guides, and LGBTQ+ inclusive health resources.",
  url: "https://www.masseurmatch.com/blog",
  publisher: {
    "@type": "Organization",
    name: "MasseurMatch",
    logo: {
      "@type": "ImageObject",
      url: "https://www.masseurmatch.com/logo.png"
    }
  }
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <main
        className="mx-auto max-w-6xl px-6 py-12"
        style={{ background: "var(--bg)", color: "var(--text)" }}
      >
        {/* Header */}
        <header className="mb-12 text-center">
          <p
            className="mb-2 text-sm uppercase tracking-wide"
            style={{ color: "var(--violet)" }}
          >
            MasseurMatch Blog
          </p>
          <h1
            className="mb-4 text-4xl font-bold md:text-5xl"
            style={{ color: "var(--text)" }}
          >
            Wellness & Massage Insights
          </h1>
          <p
            className="mx-auto max-w-2xl text-lg"
            style={{ color: "var(--muted)" }}
          >
            Expert advice, wellness tips, and resources to help you on your
            journey to better health and relaxation.
          </p>
        </header>

        {/* Featured Post */}
        {posts.length > 0 && (
          <section className="mb-16">
            <Link
              href={`/blog/${posts[0].slug}`}
              className="group block overflow-hidden rounded-2xl transition-all"
              style={{
                background: "var(--panel)",
                border: "1px solid var(--stroke)"
              }}
            >
              <div className="grid gap-6 p-6 md:grid-cols-2 md:p-8">
                <div
                  className="flex aspect-video items-center justify-center rounded-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))"
                  }}
                >
                  <span className="text-6xl">📖</span>
                </div>
                <div className="flex flex-col justify-center">
                  <span
                    className="mb-2 text-sm font-medium"
                    style={{ color: "var(--violet)" }}
                  >
                    Featured Article
                  </span>
                  <h2
                    className="mb-3 text-2xl font-bold md:text-3xl"
                    style={{ color: "var(--text)" }}
                  >
                    {posts[0].title}
                  </h2>
                  <p className="mb-4" style={{ color: "var(--muted)" }}>
                    {posts[0].excerpt}
                  </p>
                  <div
                    className="flex items-center gap-4 text-sm"
                    style={{ color: "var(--muted)" }}
                  >
                    <span>{posts[0].author}</span>
                    <span>•</span>
                    <span>{posts[0].readingTime} min read</span>
                    <span>•</span>
                    <time dateTime={posts[0].publishedAt}>
                      {new Date(posts[0].publishedAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric"
                        }
                      )}
                    </time>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* All Posts Grid */}
        <section>
          <h2
            className="mb-8 text-2xl font-bold"
            style={{ color: "var(--text)" }}
          >
            All Articles
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(1).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl transition-all"
                style={{
                  background: "var(--panel)",
                  border: "1px solid var(--stroke)"
                }}
              >
                <div
                  className="flex aspect-video items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))"
                  }}
                >
                  <span className="text-4xl">✨</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2 flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full px-2 py-0.5 text-xs"
                        style={{
                          background: "rgba(139, 92, 246, 0.15)",
                          color: "var(--violet)"
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3
                    className="mb-2 text-lg font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {post.title}
                  </h3>
                  <p
                    className="mb-4 flex-1 text-sm line-clamp-2"
                    style={{ color: "var(--muted)" }}
                  >
                    {post.excerpt}
                  </p>
                  <div
                    className="flex items-center justify-between text-xs"
                    style={{ color: "var(--muted)" }}
                  >
                    <span>{post.readingTime} min read</span>
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric"
                      })}
                    </time>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="mt-16 rounded-2xl p-8 text-center md:p-12"
          style={{
            background:
              "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))"
          }}
        >
          <h2
            className="mb-4 text-2xl font-bold md:text-3xl"
            style={{ color: "var(--text)" }}
          >
            Ready to Experience Professional Massage?
          </h2>
          <p
            className="mx-auto mb-6 max-w-xl"
            style={{ color: "var(--muted)" }}
          >
            Find verified, professional massage therapists in your area. Browse
            profiles, read reviews, and book with confidence.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-colors"
            style={{
              background: "var(--accent-2)",
              color: "#fff"
            }}
          >
            Find a Therapist
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </section>
      </main>
    </>
  );
}
