import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "../data/posts";

export const dynamic = "force-dynamic";


type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | MasseurMatch Blog"
    };
  }

  const url = `https://www.masseurmatch.com/blog/${post.slug}`;

  return {
    title: `${post.title} | MasseurMatch Blog`,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: post.author }],
    alternates: {
      canonical: url
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      siteName: "MasseurMatch",
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [post.author],
      tags: post.tags
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt
    }
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = getAllPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .filter((p) => p.tags.some((tag) => post.tags.includes(tag)))
    .slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: {
      "@type": "Organization",
      name: post.author
    },
    publisher: {
      "@type": "Organization",
      name: "MasseurMatch",
      logo: {
        "@type": "ImageObject",
        url: "https://www.masseurmatch.com/logo.png"
      }
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.masseurmatch.com/blog/${post.slug}`
    },
    keywords: post.tags.join(", ")
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <main
        className="mx-auto max-w-4xl px-6 py-12"
        style={{ background: "var(--bg)", color: "var(--text)" }}
      >
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol
            className="flex items-center gap-2 text-sm"
            style={{ color: "var(--muted)" }}
          >
            <li>
              <Link href="/" className="hover:opacity-80" style={{ color: "var(--violet)" }}>
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/blog" className="hover:opacity-80" style={{ color: "var(--violet)" }}>
                Blog
              </Link>
            </li>
            <li>/</li>
            <li className="truncate" style={{ color: "var(--muted)" }}>
              {post.title}
            </li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
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
          <h1
            className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl"
            style={{ color: "var(--text)" }}
          >
            {post.title}
          </h1>
          <p className="mb-6 text-lg" style={{ color: "var(--muted)" }}>
            {post.excerpt}
          </p>
          <div
            className="flex flex-wrap items-center gap-4 text-sm"
            style={{ color: "var(--muted)" }}
          >
            <span className="font-medium" style={{ color: "var(--text)" }}>
              {post.author}
            </span>
            <span>•</span>
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric"
              })}
            </time>
            <span>•</span>
            <span>{post.readingTime} min read</span>
          </div>
        </header>

        {/* Article Content */}
        <article
          className="prose prose-lg max-w-none"
          style={{
            color: "var(--muted)",
            ["--tw-prose-headings" as string]: "var(--text)",
            ["--tw-prose-body" as string]: "var(--muted)",
            ["--tw-prose-links" as string]: "var(--violet)",
            ["--tw-prose-bold" as string]: "var(--text)",
            ["--tw-prose-bullets" as string]: "var(--violet)"
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Share Section */}
        <div
          className="mt-12 pt-8"
          style={{ borderTop: "1px solid var(--stroke)" }}
        >
          <p
            className="mb-4 text-sm font-medium"
            style={{ color: "var(--muted)" }}
          >
            Share this article
          </p>
          <div className="flex gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://www.masseurmatch.com/blog/${post.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors"
              style={{
                background: "var(--panel)",
                color: "var(--text)",
                border: "1px solid var(--stroke)"
              }}
            >
              Twitter
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://www.masseurmatch.com/blog/${post.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors"
              style={{
                background: "var(--panel)",
                color: "var(--text)",
                border: "1px solid var(--stroke)"
              }}
            >
              Facebook
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`https://www.masseurmatch.com/blog/${post.slug}`)}&title=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors"
              style={{
                background: "var(--panel)",
                color: "var(--text)",
                border: "1px solid var(--stroke)"
              }}
            >
              LinkedIn
            </a>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2
              className="mb-6 text-2xl font-bold"
              style={{ color: "var(--text)" }}
            >
              Related Articles
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="group flex flex-col rounded-xl p-5 transition-all"
                  style={{
                    background: "var(--panel)",
                    border: "1px solid var(--stroke)"
                  }}
                >
                  <div className="mb-2 flex flex-wrap gap-2">
                    {relatedPost.tags.slice(0, 2).map((tag) => (
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
                    className="mb-2 font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {relatedPost.title}
                  </h3>
                  <p
                    className="text-sm line-clamp-2"
                    style={{ color: "var(--muted)" }}
                  >
                    {relatedPost.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section
          className="mt-16 rounded-2xl p-8 text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.2))"
          }}
        >
          <h2
            className="mb-4 text-2xl font-bold"
            style={{ color: "var(--text)" }}
          >
            Find Your Perfect Massage Therapist
          </h2>
          <p
            className="mx-auto mb-6 max-w-xl"
            style={{ color: "var(--muted)" }}
          >
            Ready to experience the benefits of professional massage? Browse
            verified therapists in your area.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-colors"
            style={{
              background: "var(--accent-2)",
              color: "#fff"
            }}
          >
            Explore Therapists
          </Link>
        </section>

        {/* Back to Blog */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2"
            style={{ color: "var(--violet)" }}
          >
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
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
            Back to all articles
          </Link>
        </div>
      </main>
    </>
  );
}

