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

      <div className="min-h-screen bg-[#0b0b14] text-white pb-20">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mx-auto max-w-6xl px-6 pt-12">
          <ol className="flex items-center gap-2 text-sm text-slate-400">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li>•</li>
            <li aria-current="page" className="text-white font-medium">Blog</li>
          </ol>
        </nav>

        <div className="mx-auto max-w-6xl px-6 py-12">
          {/* Header */}
          <header className="mb-20 text-center">
            <div className="mx-auto max-w-3xl">
              <p className="mb-4 text-sm font-bold uppercase tracking-widest text-violet-300">
                MasseurMatch Blog
              </p>
              <h1 className="mb-6 text-5xl md:text-6xl font-black leading-tight bg-gradient-to-r from-violet-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Wellness & Massage Insights
              </h1>
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
                Expert advice, wellness tips, and resources to help you on your
                journey to better health and relaxation.
              </p>
            </div>
          </header>

          {/* Featured Post */}
          {posts.length > 0 && (
            <section className="mb-24">
              <Link
                href={`/blog/${posts[0].slug}`}
                className="group block overflow-hidden rounded-3xl bg-[#111123] border border-[#2a2a48] hover:border-violet-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/20"
              >
                <div className="grid gap-8 p-8 md:grid-cols-2 md:p-12">
                  <div className="flex aspect-video items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20">
                    <span className="text-7xl">📖</span>
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="mb-3 inline-block w-fit rounded-full bg-violet-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-violet-300">
                      Featured Article
                    </span>
                    <h2 className="mb-4 text-3xl md:text-4xl font-bold leading-tight text-white group-hover:text-violet-300 transition-colors">
                      {posts[0].title}
                    </h2>
                    <p className="mb-6 text-slate-300 leading-relaxed">
                      {posts[0].excerpt}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                      <span className="font-medium text-white">{posts[0].author}</span>
                      <span>•</span>
                      <span>{posts[0].readingTime} min read</span>
                      <span>•</span>
                      <time dateTime={posts[0].publishedAt}>
                        {new Date(posts[0].publishedAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </time>
                    </div>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* All Posts Grid */}
          <section>
            <div className="mb-12 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white">
                All Articles
              </h2>
              <span className="text-sm font-medium text-slate-400">
                {posts.length - 1} articles
              </span>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.slice(1).map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-[#111123] border border-[#2a2a48] hover:border-violet-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-1"
                >
                  <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-violet-500/15 to-indigo-500/15">
                    <span className="text-5xl transition-transform group-hover:scale-110">✨</span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-medium text-violet-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="mb-3 text-xl font-bold leading-snug text-white group-hover:text-violet-300 transition-colors">
                      {post.title}
                    </h3>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-300 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between border-t border-[#2a2a48] pt-4 text-xs font-medium text-slate-400">
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

          {/* CTA Section */}
          <section className="relative mt-24 overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/30 p-12 md:p-16 text-center shadow-lg shadow-violet-500/20">
            <div className="relative z-10">
              <h2 className="mb-6 text-3xl md:text-4xl font-bold leading-tight text-white">
                Ready to Experience Professional Massage?
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-slate-300">
                Find verified, professional massage therapists in your area. Browse
                profiles, read reviews, and book with confidence.
              </p>
              <Link
                href="/explore"
                className="inline-flex items-center gap-3 rounded-full bg-violet-600 hover:bg-violet-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:shadow-xl hover:shadow-violet-500/40 hover:scale-105"
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
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

