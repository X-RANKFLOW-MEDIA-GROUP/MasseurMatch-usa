import { LegalPage } from "@/app/legal/LegalPage";

export async function generateMetadata() {
  const url = "https://www.masseurmatch.com/anti-trafficking";

  return {
    title: "Anti-Trafficking Policy | MasseurMatch",
    description:
      "MasseurMatch’s zero tolerance policy for human trafficking, exploitation, and illegal services, with detailed reporting and enforcement rules.",
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: "Anti-Trafficking Policy | MasseurMatch",
      description:
        "MasseurMatch’s zero tolerance policy for human trafficking, exploitation, and illegal services, with detailed reporting and enforcement rules.",
      url,
      siteName: "MasseurMatch",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: "Anti-Trafficking Policy | MasseurMatch",
      description:
        "MasseurMatch’s zero tolerance policy for human trafficking, exploitation, and illegal services, with detailed reporting and enforcement rules.",
    },
  };
}

export default function AntiTraffickingPage() {
  return (
    <LegalPage
      title="Anti-Trafficking Policy"
      description="MasseurMatch’s zero tolerance policy for human trafficking, exploitation, and illegal services, with detailed reporting and enforcement rules."
      slug="/anti-trafficking"
      sections={[
        {
          heading: "Zero tolerance commitment",
          body: (
            <>
              <p>Any behavior tied to trafficking, coercion, or exploitation is prohibited. Accounts tied to suspected trafficking are subject to immediate suspension while we investigate with urgency.</p>
              <p>We cooperate with lawful requests from authorities consistent with due process and user safety.</p>
            </>
          )
        },
        {
          heading: "Detection and enforcement",
          body: (
            <>
              <p>We review signals such as report volume, payment anomalies, and repeated policy violations. We may require identity checks or additional verification when red flags appear.</p>
              <p>Content, listings, or messages that suggest trafficking or coercion are removed. We reserve the right to notify platforms or partners to prevent harm.</p>
            </>
          )
        },
        {
          heading: "How to report concerns",
          body: (
            <>
              <p>If you suspect trafficking, immediately contact local law enforcement. After reporting to authorities, alert us so we can restrict accounts and preserve data for lawful requests.</p>
              <p>Include screenshots, user IDs, and timestamps when possible. We prioritize these reports above other queues.</p>
            </>
          )
        },
        {
          heading: "Support for impacted users",
          body: (
            <>
              <p>We provide account holds, data preservation for investigations, and safety guidance. We will not reactivate accounts tied to credible trafficking evidence.</p>
              <p>Appeals require documented proof and may be denied if risk remains high.</p>
            </>
          )
        }
      ]}
    />
  );
}
