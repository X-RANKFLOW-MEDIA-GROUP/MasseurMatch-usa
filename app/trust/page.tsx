import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Trust & Safety | MasseurMatch - Your Safety Is Our Priority",
  description:
    "Learn about MasseurMatch's commitment to safety, verification processes, community guidelines, and how we protect both clients and therapists on our platform.",
  keywords: [
    "massage safety",
    "verified therapists",
    "trust and safety",
    "secure platform",
    "lgbtq safe space",
    "background check"
  ],
  alternates: {
    canonical: "https://www.masseurmatch.com/trust"
  },
  openGraph: {
    title: "Trust & Safety | MasseurMatch",
    description:
      "Your safety is our priority. Learn how we verify therapists and protect our community.",
    url: "https://www.masseurmatch.com/trust",
    siteName: "MasseurMatch",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Trust & Safety | MasseurMatch",
    description:
      "Your safety is our priority. Learn how we verify therapists and protect our community."
  }
};

const trustSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Trust & Safety | MasseurMatch",
  description:
    "Learn about MasseurMatch's commitment to safety, verification processes, and community protection.",
  url: "https://www.masseurmatch.com/trust",
  mainEntity: {
    "@type": "Organization",
    name: "MasseurMatch",
    description:
      "The most inclusive massage therapist platform committed to safety and trust."
  }
};

export default function TrustPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(trustSchema) }}
      />
      <div
        className="mx-auto max-w-4xl px-6 py-12"
        style={{ background: "var(--bg)", color: "var(--text)" }}
      >
        {/* Hero Section */}
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <p
            className="mb-2 text-sm uppercase tracking-wide"
            style={{ color: "var(--violet)" }}
          >
            Trust & Safety
          </p>
          <h1
            className="mb-4 text-4xl font-bold md:text-5xl"
            style={{ color: "var(--text)" }}
          >
            Your Safety Is Our Priority
          </h1>
          <p
            className="mx-auto max-w-2xl text-lg"
            style={{ color: "var(--muted)" }}
          >
            At MasseurMatch, we&apos;re committed to creating a safe, inclusive,
            and trustworthy platform for both clients and massage therapists.
          </p>
        </header>

        {/* Trust Pillars */}
        <section className="mb-16 grid gap-6 md:grid-cols-3">
          <div
            className="rounded-xl p-6 text-center"
            style={{
              background: "var(--panel)",
              border: "1px solid var(--stroke)"
            }}
          >
            <div
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: "rgba(139, 92, 246, 0.16)" }}
            >
              <svg
                className="h-6 w-6"
                style={{ color: "var(--success)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3
              className="mb-2 text-lg font-semibold"
              style={{ color: "var(--text)" }}
            >
              Verified Profiles
            </h3>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Every therapist goes through our verification process
            </p>
          </div>
          <div
            className="rounded-xl p-6 text-center"
            style={{
              background: "var(--panel)",
              border: "1px solid var(--stroke)"
            }}
          >
            <div
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: "rgba(139, 92, 246, 0.15)" }}
            >
              <svg
                className="h-6 w-6"
                style={{ color: "var(--violet)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3
              className="mb-2 text-lg font-semibold"
              style={{ color: "var(--text)" }}
            >
              Secure Platform
            </h3>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Your data is protected with industry-standard encryption
            </p>
          </div>
          <div
            className="rounded-xl p-6 text-center"
            style={{
              background: "var(--panel)",
              border: "1px solid var(--stroke)"
            }}
          >
            <div
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: "rgba(236, 72, 153, 0.15)" }}
            >
              <svg
                className="h-6 w-6"
                style={{ color: "var(--pink)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3
              className="mb-2 text-lg font-semibold"
              style={{ color: "var(--text)" }}
            >
              Inclusive Community
            </h3>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              A welcoming space for everyone, especially LGBTQ+ individuals
            </p>
          </div>
        </section>

        {/* Detailed Sections */}
        <div className="space-y-12">
          {/* Verification Process */}
          <section
            className="rounded-2xl p-8"
            style={{
              background: "var(--panel)",
              border: "1px solid var(--stroke)"
            }}
          >
            <h2
              className="mb-6 flex items-center gap-3 text-2xl font-bold"
              style={{ color: "var(--text)" }}
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ background: "rgba(139, 92, 246, 0.16)" }}
              >
                <svg
                  className="h-5 w-5"
                  style={{ color: "var(--success)" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </span>
              Therapist Verification Process
            </h2>
            <p className="mb-6" style={{ color: "var(--muted)" }}>
              We take verification seriously. Every therapist on MasseurMatch
              goes through a comprehensive screening process:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span
                  className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                  style={{
                    background: "rgba(139, 92, 246, 0.2)",
                    color: "var(--violet)"
                  }}
                >
                  1
                </span>
                <div>
                  <p className="font-medium" style={{ color: "var(--text)" }}>
                    Identity Verification
                  </p>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    Government-issued ID verification to confirm therapist
                    identity
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                  style={{
                    background: "rgba(139, 92, 246, 0.2)",
                    color: "var(--violet)"
                  }}
                >
                  2
                </span>
                <div>
                  <p className="font-medium" style={{ color: "var(--text)" }}>
                    License & Certification Check
                  </p>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    Verification of massage therapy licenses and professional
                    certifications
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                  style={{
                    background: "rgba(139, 92, 246, 0.2)",
                    color: "var(--violet)"
                  }}
                >
                  3
                </span>
                <div>
                  <p className="font-medium" style={{ color: "var(--text)" }}>
                    Profile Review
                  </p>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    Manual review of profile information, photos, and service
                    descriptions
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                  style={{
                    background: "rgba(139, 92, 246, 0.2)",
                    color: "var(--violet)"
                  }}
                >
                  4
                </span>
                <div>
                  <p className="font-medium" style={{ color: "var(--text)" }}>
                    Ongoing Monitoring
                  </p>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    Continuous monitoring of reviews and reports to maintain
                    quality standards
                  </p>
                </div>
              </li>
            </ul>
          </section>

          {/* Community Guidelines */}
          <section
            className="rounded-2xl p-8"
            style={{
              background: "var(--panel)",
              border: "1px solid var(--stroke)"
            }}
          >
            <h2
              className="mb-6 flex items-center gap-3 text-2xl font-bold"
              style={{ color: "var(--text)" }}
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ background: "rgba(139, 92, 246, 0.15)" }}
              >
                <svg
                  className="h-5 w-5"
                  style={{ color: "var(--violet)" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </span>
              Community Standards
            </h2>
            <p className="mb-6" style={{ color: "var(--muted)" }}>
              Our community guidelines ensure a respectful and professional
              environment for everyone:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div
                className="rounded-lg p-4"
                style={{ background: "var(--panel-2)" }}
              >
                <p className="mb-2 font-medium" style={{ color: "var(--text)" }}>
                  Professional Conduct
                </p>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  All interactions must remain professional and respectful
                </p>
              </div>
              <div
                className="rounded-lg p-4"
                style={{ background: "var(--panel-2)" }}
              >
                <p className="mb-2 font-medium" style={{ color: "var(--text)" }}>
                  Zero Tolerance
                </p>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  No harassment, discrimination, or inappropriate behavior
                </p>
              </div>
              <div
                className="rounded-lg p-4"
                style={{ background: "var(--panel-2)" }}
              >
                <p className="mb-2 font-medium" style={{ color: "var(--text)" }}>
                  Honest Representation
                </p>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Accurate profiles and truthful service descriptions required
                </p>
              </div>
              <div
                className="rounded-lg p-4"
                style={{ background: "var(--panel-2)" }}
              >
                <p className="mb-2 font-medium" style={{ color: "var(--text)" }}>
                  Boundary Respect
                </p>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Clear boundaries must be communicated and honored
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Link
                href="/legal/community-guidelines"
                className="inline-flex items-center gap-2"
                style={{ color: "var(--violet)" }}
              >
                Read full Community Guidelines
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
            </div>
          </section>

          {/* Reporting & Support */}
          <section
            className="rounded-2xl p-8"
            style={{
              background: "var(--panel)",
              border: "1px solid var(--stroke)"
            }}
          >
            <h2
              className="mb-6 flex items-center gap-3 text-2xl font-bold"
              style={{ color: "var(--text)" }}
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ background: "rgba(239, 68, 68, 0.15)" }}
              >
                <svg
                  className="h-5 w-5"
                  style={{ color: "var(--danger)" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </span>
              Reporting & Support
            </h2>
            <p className="mb-6" style={{ color: "var(--muted)" }}>
              We make it easy to report concerns and get help when you need it:
            </p>
            <div className="space-y-4">
              <div
                className="flex items-start gap-4 rounded-lg p-4"
                style={{
                  background: "var(--panel-2)",
                  border: "1px solid var(--stroke)"
                }}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "var(--panel)" }}
                >
                  <svg
                    className="h-5 w-5"
                    style={{ color: "var(--muted)" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium" style={{ color: "var(--text)" }}>
                    Email Support
                  </p>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    Contact us at{" "}
                    <a
                      href="mailto:support@masseurmatch.com"
                      style={{ color: "var(--violet)" }}
                    >
                      support@masseurmatch.com
                    </a>{" "}
                    for general inquiries
                  </p>
                </div>
              </div>
              <div
                className="flex items-start gap-4 rounded-lg p-4"
                style={{
                  background: "var(--panel-2)",
                  border: "1px solid var(--stroke)"
                }}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "var(--panel)" }}
                >
                  <svg
                    className="h-5 w-5"
                    style={{ color: "var(--muted)" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium" style={{ color: "var(--text)" }}>
                    Report a Concern
                  </p>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    Use the report button on any profile or contact{" "}
                    <a
                      href="mailto:safety@masseurmatch.com"
                      style={{ color: "var(--violet)" }}
                    >
                      safety@masseurmatch.com
                    </a>
                  </p>
                </div>
              </div>
              <div
                className="flex items-start gap-4 rounded-lg p-4"
                style={{
                  background: "var(--panel-2)",
                  border: "1px solid var(--stroke)"
                }}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "var(--panel)" }}
                >
                  <svg
                    className="h-5 w-5"
                    style={{ color: "var(--muted)" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium" style={{ color: "var(--text)" }}>
                    Emergency Response
                  </p>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    Urgent safety concerns are prioritized and addressed within
                    24 hours
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Anti-Trafficking */}
          <section
            className="rounded-2xl p-8"
            style={{
              background: "var(--panel)",
              border: "1px solid var(--stroke)"
            }}
          >
            <h2
              className="mb-6 flex items-center gap-3 text-2xl font-bold"
              style={{ color: "var(--text)" }}
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ background: "rgba(139, 92, 246, 0.16)" }}
              >
                <svg
                  className="h-5 w-5"
                  style={{ color: "#8b5cf6" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>
              Anti-Trafficking Commitment
            </h2>
            <p className="mb-4" style={{ color: "var(--muted)" }}>
              MasseurMatch maintains a strict zero-tolerance policy against
              human trafficking and exploitation. We actively work to:
            </p>
            <ul className="mb-6 space-y-2" style={{ color: "var(--muted)" }}>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4"
                  style={{ color: "var(--success)" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Monitor for suspicious activity and patterns
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4"
                  style={{ color: "var(--success)" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Cooperate with law enforcement agencies
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4"
                  style={{ color: "var(--success)" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Train our team to identify warning signs
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4"
                  style={{ color: "var(--success)" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Provide resources for those who need help
              </li>
            </ul>
            <Link
              href="/legal/anti-trafficking"
              className="inline-flex items-center gap-2"
              style={{ color: "var(--violet)" }}
            >
              Read our Anti-Trafficking Policy
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

          {/* Data Privacy */}
          <section
            className="rounded-2xl p-8"
            style={{
              background: "var(--panel)",
              border: "1px solid var(--stroke)"
            }}
          >
            <h2
              className="mb-6 flex items-center gap-3 text-2xl font-bold"
              style={{ color: "var(--text)" }}
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ background: "rgba(6, 182, 212, 0.15)" }}
              >
                <svg
                  className="h-5 w-5"
                  style={{ color: "#06b6d4" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                  />
                </svg>
              </span>
              Data Privacy & Security
            </h2>
            <p className="mb-6" style={{ color: "var(--muted)" }}>
              Your privacy matters. Here&apos;s how we protect your information:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <svg
                  className="mt-1 h-5 w-5 shrink-0"
                  style={{ color: "#06b6d4" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p style={{ color: "var(--muted)" }}>
                  256-bit SSL encryption for all data transmission
                </p>
              </div>
              <div className="flex items-start gap-3">
                <svg
                  className="mt-1 h-5 w-5 shrink-0"
                  style={{ color: "#06b6d4" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p style={{ color: "var(--muted)" }}>
                  Secure payment processing through trusted partners
                </p>
              </div>
              <div className="flex items-start gap-3">
                <svg
                  className="mt-1 h-5 w-5 shrink-0"
                  style={{ color: "#06b6d4" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p style={{ color: "var(--muted)" }}>
                  No selling of personal data to third parties
                </p>
              </div>
              <div className="flex items-start gap-3">
                <svg
                  className="mt-1 h-5 w-5 shrink-0"
                  style={{ color: "#06b6d4" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p style={{ color: "var(--muted)" }}>
                  Regular security audits and updates
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Link
                href="/legal/privacy-policy"
                className="inline-flex items-center gap-2"
                style={{ color: "var(--violet)" }}
              >
                Read our Privacy Policy
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
            </div>
          </section>
        </div>

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
            Have Questions About Safety?
          </h2>
          <p
            className="mx-auto mb-6 max-w-xl"
            style={{ color: "var(--muted)" }}
          >
            Our team is here to help. Reach out with any concerns or questions
            about our safety measures.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="mailto:support@masseurmatch.com"
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-colors"
              style={{
                background: "var(--accent-2)",
                color: "#fff"
              }}
            >
              Contact Support
            </a>
            <Link
              href="/support"
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-colors"
              style={{
                background: "transparent",
                color: "var(--text)",
                border: "1px solid var(--stroke)"
              }}
            >
              Help Center
            </Link>
          </div>
        </section>

        {/* Related Links */}
        <section className="mt-12">
          <h3
            className="mb-4 text-lg font-semibold"
            style={{ color: "var(--text)" }}
          >
            Related Policies
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/legal/terms"
              className="rounded-lg px-4 py-2 text-sm transition-colors"
              style={{
                background: "var(--panel)",
                color: "var(--muted)",
                border: "1px solid var(--stroke)"
              }}
            >
              Terms of Use
            </Link>
            <Link
              href="/legal/privacy-policy"
              className="rounded-lg px-4 py-2 text-sm transition-colors"
              style={{
                background: "var(--panel)",
                color: "var(--muted)",
                border: "1px solid var(--stroke)"
              }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/legal/community-guidelines"
              className="rounded-lg px-4 py-2 text-sm transition-colors"
              style={{
                background: "var(--panel)",
                color: "var(--muted)",
                border: "1px solid var(--stroke)"
              }}
            >
              Community Guidelines
            </Link>
            <Link
              href="/legal/professional-standards"
              className="rounded-lg px-4 py-2 text-sm transition-colors"
              style={{
                background: "var(--panel)",
                color: "var(--muted)",
                border: "1px solid var(--stroke)"
              }}
            >
              Professional Standards
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

