import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const legalPages: Record<string, { title: string; content: string }> = {
  "terms-of-use": {
    title: "Terms of Use",
    content: `
      <h2>1. Acceptance of Terms</h2>
      <p>By using MasseurMatch, you agree to these terms of use.</p>

      <h2>2. User Responsibilities</h2>
      <p>Users are responsible for maintaining accurate account information and complying with all applicable laws.</p>

      <h2>3. Service Description</h2>
      <p>MasseurMatch provides a platform for connecting clients with massage therapists. We do not directly provide massage services.</p>
    `,
  },
  "acceptable-use": {
    title: "Acceptable Use Policy",
    content: `
      <h2>Permitted Use</h2>
      <p>You may use MasseurMatch only for lawful purposes and in accordance with these terms.</p>

      <h2>Prohibited Activities</h2>
      <ul>
        <li>Harassment or abuse of other users</li>
        <li>Posting false or misleading information</li>
        <li>Attempting to circumvent platform fees</li>
        <li>Any illegal activities</li>
      </ul>
    `,
  },
  "dmca": {
    title: "DMCA Policy",
    content: `
      <h2>Copyright Infringement</h2>
      <p>MasseurMatch respects intellectual property rights. If you believe content infringes your copyright, please contact us.</p>

      <h2>How to File a Claim</h2>
      <p>Send a written notice to our designated agent including identification of the copyrighted work and the infringing material.</p>
    `,
  },
  "refund-policy": {
    title: "Refund Policy",
    content: `
      <h2>Subscription Refunds</h2>
      <p>Monthly subscriptions can be canceled at any time. Refunds are provided on a prorated basis for unused time.</p>

      <h2>Service Disputes</h2>
      <p>Disputes about services provided by therapists should be resolved directly with the therapist. MasseurMatch may assist in mediation.</p>
    `,
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = legalPages[slug];

  if (!page) return { title: "Not Found" };

  return {
    title: `${page.title} | MasseurMatch`,
    description: `Read our ${page.title.toLowerCase()} policy.`,
  };
}

export function generateStaticParams() {
  return Object.keys(legalPages).map((slug) => ({ slug }));
}

export default async function LegalSlugPage({ params }: Props) {
  const { slug } = await params;
  const page = legalPages[slug];

  if (!page) {
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
          href="/legal"
          className="text-sm text-slate-400 hover:text-white transition-colors mb-8 inline-block"
        >
          ← Back to Legal
        </Link>

        <h1 className="text-4xl font-bold text-white mb-8">{page.title}</h1>

        <div
          className="prose prose-invert prose-slate max-w-none
            prose-headings:text-white prose-headings:font-semibold
            prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
            prose-p:text-slate-300 prose-p:leading-relaxed
            prose-li:text-slate-300
            prose-ul:list-disc prose-ul:pl-6"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </main>
    </div>
  );
}
