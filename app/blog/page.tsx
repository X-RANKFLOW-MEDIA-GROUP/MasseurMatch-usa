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
      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <header className="mb-12 text-center">
          <p className="mb-2 text-sm uppercase tracking-wide text-purple-400">
            MasseurMatch Blog
          </p>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Wellness & Massage Insights
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Expert advice, wellness tips, and resources to help you on your
            journey to better health and relaxation.
          </p>
        </header>

        {/* Featured Post */}
        {posts.length > 0 && (
          <section className="mb-16">
            <Link
              href={`/blog/${posts[0].slug}`}
              className="group block overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 transition-all hover:border-purple-500/50 hover:bg-gray-900"
            >
              <div className="grid gap-6 p-6 md:grid-cols-2 md:p-8">
                <div className="flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20">
                  <span className="text-6xl">📖</span>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="mb-2 text-sm font-medium text-purple-400">
                    Featured Article
                  </span>
                  <h2 className="mb-3 text-2xl font-bold text-white group-hover:text-purple-300 md:text-3xl">
                    {posts[0].title}
                  </h2>
                  <p className="mb-4 text-gray-400">{posts[0].excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
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
          <h2 className="mb-8 text-2xl font-bold text-white">All Articles</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(1).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 transition-all hover:border-purple-500/50 hover:bg-gray-900"
              >
                <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-purple-600/10 to-pink-600/10">
                  <span className="text-4xl">✨</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2 flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-purple-500/10 px-2 py-0.5 text-xs text-purple-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white group-hover:text-purple-300">
                    {post.title}
                  </h3>
                  <p className="mb-4 flex-1 text-sm text-gray-400 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
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
        <section className="mt-16 rounded-2xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-8 text-center md:p-12">
          <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
            Ready to Experience Professional Massage?
          </h2>
          <p className="mx-auto mb-6 max-w-xl text-gray-300">
            Find verified, professional massage therapists in your area. Browse
            profiles, read reviews, and book with confidence.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-purple-500"
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
