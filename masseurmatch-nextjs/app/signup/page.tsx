import { Metadata } from "next";
import Link from "next/link";
import SignupForm from "@/components/signup/SignupForm";

export const metadata: Metadata = {
  title: "Join MasseurMatch | List Your Massage Services & Get Discovered",
  description:
    "Create your professional massage profile on MasseurMatch. Get discovered by clients searching for massage services in your city. No bookings or payments processed.",
  keywords: [
    "massage therapist directory",
    "list massage services",
    "find clients online massage",
    "gay massage directory",
    "independent massage therapist listing",
    "massage therapist marketing",
    "massage business listing",
    "massage directory"
  ],
  alternates: {
    canonical: "https://www.masseurmatch.com/signup"
  },
  openGraph: {
    title: "Join MasseurMatch | List Your Massage Services & Get Discovered",
    description:
      "Create your professional massage profile on MasseurMatch. Get discovered by clients searching for massage services in your city.",
    url: "https://www.masseurmatch.com/signup",
    siteName: "MasseurMatch",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Join MasseurMatch - List Your Massage Services"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Join MasseurMatch | List Your Massage Services",
    description:
      "Create your professional massage profile and get discovered by clients."
  }
};

const signupSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://www.masseurmatch.com/signup",
      url: "https://www.masseurmatch.com/signup",
      name: "Join MasseurMatch | List Your Massage Services",
      description:
        "Create your professional massage profile on MasseurMatch directory and get discovered by clients searching for massage services.",
      isPartOf: {
        "@id": "https://www.masseurmatch.com/#website"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://www.masseurmatch.com/#organization",
      name: "MasseurMatch",
      url: "https://www.masseurmatch.com",
      description:
        "Premier directory connecting massage therapists with clients"
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is MasseurMatch free to join?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "MasseurMatch offers both free and paid plans. The free plan allows you to create a basic profile with photos and get discovered by clients searching in your area. Paid plans offer additional features like more photos, analytics, and enhanced visibility."
          }
        },
        {
          "@type": "Question",
          name: "Does MasseurMatch process bookings or payments?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No, MasseurMatch is a directory platform only. We do not process bookings, handle payments, or verify professional licenses. Clients contact you directly through your provided contact information, and you manage all bookings and payments independently."
          }
        }
      ]
    }
  ]
};

export default function SignupPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(signupSchema) }}
      />
      <div
        className="mx-auto max-w-4xl px-6 py-12"
        style={{ background: "var(--bg)", color: "var(--text)" }}
      >
        {/* Hero Section */}
        <header className="mb-12 text-center">
          <h1
            className="mb-6 text-4xl font-bold md:text-5xl"
            style={{ color: "var(--text)" }}
          >
            List Your Massage Services on MasseurMatch
          </h1>
        </header>

        {/* Value Statement Section */}
        <section className="mb-12">
          <h2
            className="mb-4 text-center text-2xl font-bold md:text-3xl"
            style={{ color: "var(--text)" }}
          >
            A Directory Built for Independent Massage Professionals
          </h2>
          <p
            className="mx-auto max-w-2xl text-center text-lg"
            style={{ color: "var(--muted)" }}
          >
            MasseurMatch helps massage professionals showcase their services,
            locations, and availability so clients can discover and contact them
            directly.
          </p>
        </section>

        {/* Trust & Clarity Section */}
        <section
          className="mb-12 rounded-2xl p-8"
          style={{
            background: "var(--panel)",
            border: "1px solid var(--stroke)"
          }}
        >
          <ul className="space-y-3" style={{ color: "var(--muted)" }}>
            <li className="flex items-start gap-3">
              <svg
                className="mt-1 h-5 w-5 shrink-0"
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
              <span>No bookings or payments handled by the platform</span>
            </li>
            <li className="flex items-start gap-3">
              <svg
                className="mt-1 h-5 w-5 shrink-0"
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
              <span>You control your profile and contact details</span>
            </li>
            <li className="flex items-start gap-3">
              <svg
                className="mt-1 h-5 w-5 shrink-0"
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
              <span>Clients reach out to you directly</span>
            </li>
            <li className="flex items-start gap-3">
              <svg
                className="mt-1 h-5 w-5 shrink-0"
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
              <span>Listing visibility options available</span>
            </li>
          </ul>
        </section>

        {/* Signup Form */}
        <SignupForm />

        {/* SEO Content Block */}
        <section className="mb-12 mt-16">
          <h2
            className="mb-4 text-2xl font-bold"
            style={{ color: "var(--text)" }}
          >
            Why Massage Professionals Choose MasseurMatch
          </h2>
          <p
            className="leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Unlike platforms that control bookings or payments, MasseurMatch
            operates as a discovery-focused directory. Professionals can create
            detailed profiles that appear in city and service-based searches,
            helping clients find massage services that match their needs. Our
            platform empowers massage therapists and bodywork professionals to
            maintain full control over their business while benefiting from
            increased online visibility. Whether you specialize in deep tissue,
            sports massage, relaxation therapy, or mobile services, MasseurMatch
            provides the tools to showcase your expertise and connect with
            clients actively searching for your specific services in your area.
            Join thousands of professionals who have enhanced their online
            presence and grown their practice through our inclusive directory
            platform.
          </p>
        </section>

        {/* Internal Links */}
        <section className="mt-12">
          <h3
            className="mb-4 text-lg font-semibold"
            style={{ color: "var(--text)" }}
          >
            Learn More
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/trust"
              className="rounded-lg px-4 py-2 text-sm transition-colors"
              style={{
                background: "var(--panel)",
                color: "var(--violet)",
                border: "1px solid var(--stroke)"
              }}
            >
              Trust & Safety
            </Link>
            <Link
              href="/about"
              className="rounded-lg px-4 py-2 text-sm transition-colors"
              style={{
                background: "var(--panel)",
                color: "var(--violet)",
                border: "1px solid var(--stroke)"
              }}
            >
              How It Works
            </Link>
            <Link
              href="/join#plans"
              className="rounded-lg px-4 py-2 text-sm transition-colors"
              style={{
                background: "var(--panel)",
                color: "var(--violet)",
                border: "1px solid var(--stroke)"
              }}
            >
              Pricing
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
