import { LegalPage } from "@/app/legal/LegalPage";

export async function generateMetadata() {
  const url = "https://www.masseurmatch.com/community-guidelines";

  return {
    title: "Community Guidelines | MasseurMatch",
    description:
      "Clear rules for acceptable behavior on MasseurMatch, allowed content, prohibited activities, and safety expectations.",
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: "Community Guidelines | MasseurMatch",
      description:
        "Clear rules for acceptable behavior on MasseurMatch, allowed content, prohibited activities, and safety expectations.",
      url,
      siteName: "MasseurMatch",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: "Community Guidelines | MasseurMatch",
      description:
        "Clear rules for acceptable behavior on MasseurMatch, allowed content, prohibited activities, and safety expectations.",
    },
  };
}

export default function CommunityGuidelinesPage() {
  return (
    <LegalPage
      title="Community Guidelines"
      description="Clear rules for acceptable behavior on MasseurMatch, allowed content, prohibited activities, and safety expectations."
      slug="/community-guidelines"
      sections={[
        {
          heading: "Respect, consent, and boundaries",
          body: (
            <>
              <p>Consent is required at every stage. Discuss expectations, draping, and pressure preferences before and during a session. Aggressive, discriminatory, or sexual conduct is prohibited.</p>
              <p>Therapists may decline requests that fall outside their services or comfort. Clients must honor a “no” immediately.</p>
            </>
          )
        },
        {
          heading: "Authenticity and transparency",
          body: (
            <>
              <p>Profiles should use accurate photos, qualifications, and availability. False claims, impersonation, or manipulated reviews undermine trust and may result in removal.</p>
              <p>Rates, location, and any travel or parking fees must be clear before confirming a booking.</p>
            </>
          )
        },
        {
          heading: "Safety and reporting",
          body: (
            <>
              <p>Report harassment, threats, suspected trafficking, or unsafe conduct immediately. We prioritize user safety over convenience and may pause accounts during investigations.</p>
              <p>Emergency situations should be directed to local authorities first; follow with a report to support so we can take action on-platform.</p>
            </>
          )
        },
        {
          heading: "Communication and professionalism",
          body: (
            <>
              <p>Keep communication on-platform when possible. Avoid spam, pressure tactics, or last-minute changes without notice. Show up on time, maintain hygiene, and respect the space being used.</p>
              <p>Cancellations should follow the stated policy. Repeated no-shows or late cancels may result in account limits.</p>
            </>
          )
        }
      ]}
    />
  );
}
