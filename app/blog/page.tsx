import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | MasseurMatch",
  description: "Tips, insights, and news about massage therapy and wellness.",
};

// Mock blog posts - in production, fetch from Supabase
const posts = [
  {
    slug: "benefits-of-regular-massage",
    title: "10 Benefits of Regular Massage Therapy",
    excerpt: "Discover how regular massage therapy can improve your physical and mental health.",
    image: null,
    category: "Wellness",
    date: "2025-01-15",
    readTime: "5 min",
  },
  {
    slug: "choosing-right-massage-type",
    title: "How to Choose the Right Type of Massage",
    excerpt: "From Swedish to deep tissue, learn which massage style is best for your needs.",
    image: null,
    category: "Guide",
    date: "2025-01-10",
    readTime: "7 min",
  },
  {
    slug: "massage-for-athletes",
    title: "Massage Therapy for Athletes: A Complete Guide",
    excerpt: "How sports massage can enhance performance and speed up recovery.",
    image: null,
    category: "Sports",
    date: "2025-01-05",
    readTime: "8 min",
  },
  {
    slug: "self-massage-techniques",
    title: "Self-Massage Techniques for Daily Relief",
    excerpt: "Simple techniques you can do at home to relieve tension and pain.",
    image: null,
    category: "Tips",
    date: "2025-01-01",
    readTime: "4 min",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-neutral-200 to-white bg-clip-text text-transparent">
            MasseurMatch
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Blog</h1>
          <p className="text-xl text-slate-400">Tips, insights, and news about massage therapy</p>
        </div>

        {/* Featured Post */}
        <Link
          href={`/blog/${posts[0].slug}`}
          className="block rounded-2xl border border-white/10 bg-white/5 overflow-hidden mb-12 hover:bg-white/10 transition-colors"
        >
          <div className="md:flex">
            <div className="md:w-1/2 h-64 md:h-auto bg-gradient-to-br from-white/30 to-neutral-100/30 flex items-center justify-center">
              <span className="text-6xl">📖</span>
            </div>
            <div className="md:w-1/2 p-8">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white mb-4">
                {posts[0].category}
              </span>
              <h2 className="text-2xl font-bold text-white mb-4">{posts[0].title}</h2>
              <p className="text-slate-400 mb-6">{posts[0].excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(posts[0].date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {posts[0].readTime}
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Post Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(1).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:bg-white/10 transition-colors"
            >
              <div className="h-40 bg-gradient-to-br from-white/20 to-neutral-100/20 flex items-center justify-center">
                <span className="text-4xl">📝</span>
              </div>
              <div className="p-6">
                <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white mb-3">
                  {post.category}
                </span>
                <h3 className="font-semibold text-white mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1 text-white">
                    Read more <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
