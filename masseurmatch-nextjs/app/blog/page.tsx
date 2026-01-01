import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "./data/posts";

export const dynamic = "force-dynamic";


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
  const featuredPost = posts[0];
  const extraPosts = posts.slice(1);
  const extraCount = Math.max(posts.length - 1, 0);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      <div
        className="min-h-screen pb-20"
        style={{ background: "var(--bg)", color: "var(--text)" }}
      >
        <div className="mx-auto max-w-6xl px-6 py-12">
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol
              className="flex items-center gap-2 text-sm"
              style={{ color: "var(--muted)" }}
            >
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-white"
                  style={{ color: "var(--muted)" }}
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li
                aria-current="page"
                className="font-medium"
                style={{ color: "var(--text)" }}
              >
                Blog
              </li>
            </ol>
          </nav>

          <header className="mb-16 text-center">
            <div
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))"
              }}
            >
              <svg
                className="h-10 w-10"
                style={{ color: "var(--violet)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6l2 2m-2-2l-2 2m2-2v12m8-4v3a2 2 0 01-2 2H8a2 2 0 01-2-2v-3m12-8V7a2 2 0 00-2-2H8a2 2 0 00-2 2v3"
                />
              </svg>
            </div>
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
              Wellness &amp; Massage Insights
            </h1>
            <p
              className="mx-auto max-w-2xl text-lg"
              style={{ color: "var(--muted)" }}
            >
              Expert advice, wellness tips, and resources to help you on your
              journey to better health and relaxation.
            </p>
          </header>

          {featuredPost && (
            <section className="mb-16">
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group block overflow-hidden rounded-3xl transition-colors"
                style={{
                  background: "var(--panel)",
                  border: "1px solid var(--stroke)"
                }}
              >
                <div className="grid gap-8 p-8 md:grid-cols-2 md:p-10">
                  <div
                    className="flex aspect-video items-center justify-center rounded-2xl"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(139, 92, 246, 0.18), rgba(99, 102, 241, 0.12))"
                    }}
                  >
                    <div className="text-center">
                      <p
                        className="text-xs uppercase tracking-[0.3em]"
                        style={{ color: "var(--muted)" }}
                      >
                        Featured
                      </p>
                      <p
                        className="text-2xl font-semibold"
                        style={{ color: "var(--text)" }}
                      >
                        MasseurMatch
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <span
                      className="mb-3 inline-block w-fit rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider"
                      style={{
                        background: "rgba(139, 92, 246, 0.15)",
                        color: "var(--violet)"
                      }}
                    >
                      Featured Article
                    </span>
                    <h2
                      className="mb-4 text-3xl font-bold leading-tight transition-colors md:text-4xl group-hover:text-white"
                      style={{ color: "var(--text)" }}
                    >
                      {featuredPost.title}
                    </h2>
                    <p className="mb-6" style={{ color: "var(--muted)" }}>
                      {featuredPost.excerpt}
                    </p>
                    <div
                      className="flex flex-wrap items-center gap-3 text-sm"
                      style={{ color: "var(--muted)" }}
                    >
                      <span
                        className="font-medium"
                        style={{ color: "var(--text)" }}
                      >
                        {featuredPost.author}
                      </span>
                      <span aria-hidden="true">|</span>
                      <span>{featuredPost.readingTime} min read</span>
                      <span aria-hidden="true">|</span>
                      <time dateTime={featuredPost.publishedAt}>
                        {new Date(featuredPost.publishedAt).toLocaleDateString(
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

          <section>
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-3xl font-bold" style={{ color: "var(--text)" }}>
                All Articles
              </h2>
              <span className="text-sm font-medium" style={{ color: "var(--muted)" }}>
                {extraCount} articles
              </span>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {extraPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "var(--panel)",
                    border: "1px solid var(--stroke)"
                  }}
                >
                  <div
                    className="flex aspect-video items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(139, 92, 246, 0.16), rgba(99, 102, 241, 0.1))"
                    }}
                  >
                    <span
                      className="text-xs uppercase tracking-[0.35em]"
                      style={{ color: "var(--muted)" }}
                    >
                      Article
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full px-3 py-1 text-xs font-medium"
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
                      className="mb-3 text-xl font-bold leading-snug transition-colors group-hover:text-white"
                      style={{ color: "var(--text)" }}
                    >
                      {post.title}
                    </h3>
                    <p
                      className="mb-4 flex-1 text-sm leading-relaxed line-clamp-2"
                      style={{ color: "var(--muted)" }}
                    >
                      {post.excerpt}
                    </p>
                    <div
                      className="flex items-center justify-between border-t pt-4 text-xs font-medium"
                      style={{ borderColor: "var(--stroke)", color: "var(--muted)" }}
                    >
                      <span>{post.readingTime} min read</span>
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </time>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section
            className="mt-20 rounded-2xl p-10 text-center md:p-12"
            style={{
              background:
                "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))",
              border: "1px solid var(--stroke)"
            }}
          >
            <h2
              className="mb-4 text-2xl font-bold md:text-3xl"
              style={{ color: "var(--text)" }}
            >
              Ready to Experience Professional Massage?
            </h2>
            <p className="mx-auto mb-6 max-w-2xl" style={{ color: "var(--muted)" }}>
              Find verified, professional massage therapists in your area. Browse
              profiles, read reviews, and book with confidence.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-colors"
              style={{ background: "var(--accent-2)", color: "#fff" }}
            >
              Find a Therapist
              <svg
                className="h-5 w-5"
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
        </div>
      </div>
    </>
  );
}


