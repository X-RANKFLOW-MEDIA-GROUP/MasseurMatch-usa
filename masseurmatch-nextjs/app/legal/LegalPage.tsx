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
  { href: "/legal/terms", label: "Terms of Use" },
  { href: "/legal/privacy-policy", label: "Privacy Policy" },
  { href: "/legal/community-guidelines", label: "Community Guidelines" },
  { href: "/legal/cookie-policy", label: "Cookie Policy" },
  { href: "/legal/professional-standards", label: "Professional Standards" },
  { href: "/legal/anti-trafficking", label: "Anti-Trafficking" }
];

const CONTACT_BLOCK = (
  <div className="space-y-1" style={{ color: "var(--muted)" }}>
    <p><strong style={{ color: "var(--text)" }}>Company:</strong> MasseurMatch</p>
    <p><strong style={{ color: "var(--text)" }}>Business contact:</strong> 968-MASSEUR</p>
    <p><strong style={{ color: "var(--text)" }}>Email (legal):</strong> <a href="mailto:legal@masseurmatch.com" style={{ color: "var(--violet)" }}>legal@masseurmatch.com</a></p>
    <p><strong style={{ color: "var(--text)" }}>Email (billing):</strong> <a href="mailto:billing@masseurmatch.com" style={{ color: "var(--violet)" }}>billing@masseurmatch.com</a></p>
    <p><strong style={{ color: "var(--text)" }}>Email (support):</strong> <a href="mailto:support@masseurmatch.com" style={{ color: "var(--violet)" }}>support@masseurmatch.com</a></p>
  </div>
);

export function LegalPage({ title, description, slug, sections, lastUpdated }: LegalPageProps) {
  const updatedLabel = lastUpdated ?? "Last updated: December 3, 2025";

  return (
    <main
      className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-10"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <header className="space-y-2">
        <p
          className="text-sm uppercase tracking-wide"
          style={{ color: "var(--violet)" }}
        >
          MasseurMatch
        </p>
        <h1 className="text-3xl font-bold" style={{ color: "var(--text)" }}>
          {title}
        </h1>
        <p className="text-base" style={{ color: "var(--muted)" }}>
          {description}
        </p>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          {updatedLabel}
        </p>
      </header>

      <nav
        aria-label="Legal navigation"
        className="rounded-md p-4"
        style={{
          background: "var(--panel)",
          border: "1px solid var(--stroke)"
        }}
      >
        <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>
          See also
        </h2>
        <div className="mt-2 flex flex-wrap gap-3">
          {LEGAL_LINKS.filter(link => link.href !== slug).map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="underline"
              style={{ color: "var(--violet)" }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      <section className="space-y-6">
        {sections.map(section => (
          <article key={section.heading} className="space-y-2">
            <h2 className="text-2xl font-semibold" style={{ color: "var(--text)" }}>
              {section.heading}
            </h2>
            <div className="space-y-3" style={{ color: "var(--muted)" }}>
              {section.body}
            </div>
          </article>
        ))}
      </section>

      <section
        className="space-y-3 rounded-md p-4"
        style={{
          background: "var(--panel)",
          border: "1px solid var(--stroke)"
        }}
      >
        <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>
          Contact
        </h2>
        <p style={{ color: "var(--muted)" }}>
          Reach us for legal, billing, or support matters. We respond as quickly as possible and will reference your account email for verification.
        </p>
        {CONTACT_BLOCK}
      </section>

      <div className="space-y-1 text-sm" style={{ color: "var(--muted)" }}>
        <p>{updatedLabel}</p>
        <p>
          Contact:{" "}
          <a
            href="mailto:legal@masseurmatch.com"
            className="underline"
            style={{ color: "var(--violet)" }}
          >
            legal@masseurmatch.com
          </a>
        </p>
      </div>
    </main>
  );
}

export { LEGAL_LINKS, CONTACT_BLOCK };
