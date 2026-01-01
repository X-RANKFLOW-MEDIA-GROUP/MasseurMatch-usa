import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";
import { notFound } from "next/navigation";

// Mock posts data
const posts: Record<string, {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
}> = {
  "benefits-of-regular-massage": {
    title: "10 Benefits of Regular Massage Therapy",
    excerpt: "Discover how regular massage therapy can improve your physical and mental health.",
    content: `
      <p>Regular massage therapy offers numerous benefits for both physical and mental health. Here are ten compelling reasons to make massage a regular part of your wellness routine:</p>

      <h2>1. Reduces Stress and Anxiety</h2>
      <p>Massage therapy triggers the release of endorphins and reduces cortisol levels, helping you feel more relaxed and less anxious.</p>

      <h2>2. Relieves Muscle Tension</h2>
      <p>Whether from exercise, poor posture, or stress, massage helps release tight muscles and improve flexibility.</p>

      <h2>3. Improves Sleep Quality</h2>
      <p>Regular massage can help regulate sleep patterns and promote deeper, more restful sleep.</p>

      <h2>4. Boosts Immune Function</h2>
      <p>Studies show that massage therapy can increase the activity of white blood cells, strengthening your immune system.</p>

      <h2>5. Reduces Pain</h2>
      <p>From chronic back pain to headaches, massage therapy has been shown to provide significant pain relief.</p>

      <h2>6. Improves Circulation</h2>
      <p>The pressure and movement of massage helps blood flow more efficiently throughout the body.</p>

      <h2>7. Enhances Athletic Performance</h2>
      <p>Regular massage helps athletes recover faster and maintain peak performance.</p>

      <h2>8. Reduces Blood Pressure</h2>
      <p>Regular massage sessions have been linked to lower blood pressure levels.</p>

      <h2>9. Improves Posture</h2>
      <p>Massage can help correct muscular imbalances that contribute to poor posture.</p>

      <h2>10. Promotes Mental Clarity</h2>
      <p>By reducing stress and promoting relaxation, massage can help improve focus and mental clarity.</p>
    `,
    category: "Wellness",
    date: "2025-01-15",
    readTime: "5 min",
    author: "Dr. Sarah Chen",
  },
  "choosing-right-massage-type": {
    title: "How to Choose the Right Type of Massage",
    excerpt: "From Swedish to deep tissue, learn which massage style is best for your needs.",
    content: `
      <p>With so many massage styles available, it can be overwhelming to choose the right one. Here's a guide to help you decide:</p>

      <h2>Swedish Massage</h2>
      <p>Best for: Relaxation, first-time massage clients. Uses long, flowing strokes with light to medium pressure.</p>

      <h2>Deep Tissue Massage</h2>
      <p>Best for: Chronic pain, muscle tension. Uses slow, firm pressure to target deep muscle layers.</p>

      <h2>Sports Massage</h2>
      <p>Best for: Athletes, active individuals. Focuses on areas stressed by repetitive movements.</p>

      <h2>Hot Stone Massage</h2>
      <p>Best for: Muscle relaxation, stress relief. Uses heated stones to warm and relax muscles.</p>

      <h2>Thai Massage</h2>
      <p>Best for: Flexibility, energy balance. Combines stretching with pressure point work.</p>
    `,
    category: "Guide",
    date: "2025-01-10",
    readTime: "7 min",
    author: "Mike Thompson",
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | MasseurMatch Blog`,
    description: post.excerpt,
  };
}

export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            MasseurMatch
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>

        <article>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-violet-600/20 text-violet-400 mb-4">
            {post.category}
          </span>

          <h1 className="text-4xl font-bold text-white mb-6">{post.title}</h1>

          <div className="flex items-center gap-6 text-sm text-slate-400 mb-8 pb-8 border-b border-white/10">
            <span>By {post.author}</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </span>
            <button className="ml-auto flex items-center gap-1 hover:text-white transition-colors">
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>

          <div
            className="prose prose-invert prose-slate max-w-none
              prose-headings:text-white prose-headings:font-semibold
              prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
              prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-4
              prose-li:text-slate-300"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Related Posts */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <h3 className="text-xl font-semibold text-white mb-6">Related Posts</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(posts)
              .filter(([s]) => s !== slug)
              .slice(0, 2)
              .map(([s, p]) => (
                <Link
                  key={s}
                  href={`/blog/${s}`}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
                >
                  <h4 className="font-semibold text-white mb-2">{p.title}</h4>
                  <p className="text-sm text-slate-400 line-clamp-2">{p.excerpt}</p>
                </Link>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}
