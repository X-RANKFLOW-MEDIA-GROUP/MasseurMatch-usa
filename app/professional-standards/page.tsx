import { LegalPage } from "@/app/legal/LegalPage";

export async function generateMetadata() {
  const url = "https://www.masseurmatch.com/professional-standards";

  return {
    title: "Professional Standards | MasseurMatch",
    description:
      "Professional expectations for therapists on MasseurMatch including quality, ethics, conduct, verification, and safety standards.",
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: "Professional Standards | MasseurMatch",
      description:
        "Professional expectations for therapists on MasseurMatch including quality, ethics, conduct, verification, and safety standards.",
      url,
      siteName: "MasseurMatch",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: "Professional Standards | MasseurMatch",
      description:
        "Professional expectations for therapists on MasseurMatch including quality, ethics, conduct, verification, and safety standards.",
    },
  };
}

export default function ProfessionalStandardsPage() {
  return (
    <LegalPage
      title="Professional Standards"
      description="Professional expectations for therapists on MasseurMatch including quality, ethics, conduct, verification, and safety standards."
      slug="/professional-standards"
      sections={[
        {
          heading: "Licensing and qualifications",
          body: (
            <>
              <p>Therapists are responsible for holding all required licenses, permits, and insurance for their jurisdiction. Misrepresentation of credentials is grounds for removal.</p>
              <p>Provide clear descriptions of modalities offered, experience, and any scope limitations. Do not perform services you are not trained or licensed to deliver.</p>
            </>
          )
        },
        {
          heading: "Safety, hygiene, and environment",
          body: (
            <>
              <p>Maintain clean linens, sanitized equipment, and safe workspaces. Communicate draping practices and respect client comfort and privacy at all times.</p>
              <p>Mobile sessions must follow the same standards for cleanliness and professionalism as studio sessions.</p>
            </>
          )
        },
        {
          heading: "Ethics and boundaries",
          body: (
            <>
              <p>Follow consent-first care, including ongoing check-ins about pressure and comfort. Sexual services, coercion, or harassment are prohibited.</p>
              <p>Keep communication transparent, professional, and free of misleading claims. Respect cancellation policies and timing commitments.</p>
            </>
          )
        },
        {
          heading: "Quality assurance and feedback",
          body: (
            <>
              <p>Respond to client feedback constructively. Repeat patterns of poor conduct, no-shows, or unsafe behavior can lead to moderation, suspension, or removal.</p>
              <p>We may request proof of credentials or training for verification and periodic reviews to maintain platform quality.</p>
            </>
          )
        }
      ]}
    />
  );
}
