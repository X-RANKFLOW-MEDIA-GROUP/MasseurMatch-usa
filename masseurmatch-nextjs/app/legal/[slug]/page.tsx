import { LegalPage } from "@/app/legal/LegalPage";
import { legalDocuments, type DocumentSlug } from "@/lib/legal-data";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

const LEGAL_DESCRIPTIONS: Partial<Record<DocumentSlug, string>> = {
  terms:
    "Official Terms of Use explaining how the MasseurMatch platform works, user responsibilities, therapist independence, safety standards, and legal limitations.",
  "privacy-policy":
    "Official Privacy Policy describing what data we collect, how we use it, how we protect it, and your privacy rights.",
  "community-guidelines":
    "Clear rules for acceptable behavior on MasseurMatch, allowed content, prohibited activities, and safety expectations.",
  "cookie-policy":
    "How MasseurMatch uses essential cookies for authentication and security and how users can manage preferences.",
  "professional-standards":
    "Professional expectations for therapists on MasseurMatch including quality, ethics, conduct, and safety standards.",
  "anti-trafficking":
    "MasseurMatch's zero tolerance policy for human trafficking, exploitation, and illegal services, with detailed reporting and enforcement rules.",
};

const DEFAULT_DESCRIPTION =
  "Official MasseurMatch legal policy and compliance information.";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = legalDocuments.find((item) => item.slug === slug);

  if (!doc) {
    return {
      title: "Page Not Found | MasseurMatch",
      robots: { index: false, follow: true },
    };
  }

  const description = LEGAL_DESCRIPTIONS[doc.slug] ?? DEFAULT_DESCRIPTION;
  const url = `https://www.masseurmatch.com/legal/${doc.slug}`;

  return {
    title: `${doc.title} | MasseurMatch`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${doc.title} | MasseurMatch`,
      description,
      url,
      siteName: "MasseurMatch",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${doc.title} | MasseurMatch`,
      description,
    },
  };
}

export default async function LegalSlugPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = legalDocuments.find((item) => item.slug === slug);

  if (!doc) {
    notFound();
  }

  const description = LEGAL_DESCRIPTIONS[doc.slug] ?? DEFAULT_DESCRIPTION;

  return (
    <LegalPage
      title={doc.title}
      description={description}
      slug={`/legal/${doc.slug}`}
      lastUpdated={doc.lastUpdated}
      content={doc.content}
    />
  );
}
