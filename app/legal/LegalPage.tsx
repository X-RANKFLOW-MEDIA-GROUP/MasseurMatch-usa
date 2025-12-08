import Link from "next/link";
import React from "react";

type Section = {
  heading: string;
  body: React.ReactNode;
};

type LegalPageProps = {
  title: string;
  description: string;
  slug: string;
  sections: Section[];
  lastUpdated?: string;
};

const LEGAL_LINKS = [
  { href: "/terms", label: "Terms of Use" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/community-guidelines", label: "Community Guidelines" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/professional-standards", label: "Professional Standards" },
  { href: "/anti-trafficking", label: "Anti-Trafficking" }
];

const CONTACT_BLOCK = (
  <div className="space-y-1">
    <p><strong>Company:</strong> MasseurMatch</p>
    <p><strong>Business contact:</strong> 968-MASSEUR</p>
    <p><strong>Email (legal):</strong> <a href="mailto:legal@masseurmatch.com">legal@masseurmatch.com</a></p>
    <p><strong>Email (billing):</strong> <a href="mailto:billing@masseurmatch.com">billing@masseurmatch.com</a></p>
    <p><strong>Email (support):</strong> <a href="mailto:support@masseurmatch.com">support@masseurmatch.com</a></p>
  </div>
);

export function LegalPage({ title, description, slug, sections, lastUpdated }: LegalPageProps) {
  const updatedLabel = lastUpdated ?? "Last updated: December 3, 2025";

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-10">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-gray-500">MasseurMatch</p>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-base text-gray-700">{description}</p>
        <p className="text-sm text-gray-500">{updatedLabel}</p>
      </header>

      <nav aria-label="Legal navigation" className="rounded-md border border-gray-200 bg-gray-50 p-4">
        <h2 className="text-lg font-semibold">See also</h2>
        <div className="mt-2 flex flex-wrap gap-3">
          {LEGAL_LINKS.filter(link => link.href !== slug).map(link => (
            <Link key={link.href} href={link.href} className="text-blue-700 underline">
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      <section className="space-y-6">
        {sections.map(section => (
          <article key={section.heading} className="space-y-2">
            <h2 className="text-2xl font-semibold">{section.heading}</h2>
            <div className="space-y-3 text-gray-800">
              {section.body}
            </div>
          </article>
        ))}
      </section>

      <section className="space-y-3 rounded-md border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-xl font-semibold">Contact</h2>
        <p className="text-gray-700">
          Reach us for legal, billing, or support matters. We respond as quickly as possible and will reference your account email for verification.
        </p>
        {CONTACT_BLOCK}
      </section>

      <div className="space-y-1 text-sm text-gray-700">
        <p>{updatedLabel}</p>
        <p>Contact: <a href="mailto:legal@masseurmatch.com" className="underline">legal@masseurmatch.com</a></p>
      </div>
    </main>
  );
}

export { LEGAL_LINKS, CONTACT_BLOCK };
