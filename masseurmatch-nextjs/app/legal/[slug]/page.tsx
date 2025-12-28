import { LegalPage } from "@/app/legal/LegalPage";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

// Legal Pages Data
const LEGAL_PAGES = {
  "terms": {
    title: "Terms of Service",
    description: "Official Terms of Use explaining how the MasseurMatch platform works, user responsibilities, therapist independence, safety standards, and legal limitations.",
    sections: [
      {
        heading: "Eligibility and accounts",
        body: (
          <>
            <p>You must be of legal age in your jurisdiction and able to form a binding contract. Keep account credentials secure and notify us if you suspect unauthorized access. We may suspend accounts for policy violations or safety concerns.</p>
            <p>Profile information must be accurate. Misrepresentation, identity abuse, or fraudulent reviews are prohibited and subject to removal.</p>
          </>
        )
      },
      {
        heading: "Platform use and conduct",
        body: (
          <>
            <p>Use MasseurMatch only for lawful massage-related services. Do not engage in harassment, hate speech, trafficking, or requests for illegal activity. We may moderate, remove, or limit content that violates policies or harms user trust.</p>
            <p>Service availability, pricing, and booking terms are set by therapists. Clients agree to respect boundaries, timing, and cancellation policies communicated before sessions.</p>
          </>
        )
      },
      {
        heading: "Payments, cancellations, and disputes",
        body: (
          <>
            <p>Where payments are processed through partners, you agree to their terms. Fees are disclosed before charge. Cancellations, refunds, and rescheduling must follow the provider's stated policy; abuse of chargebacks may result in account limits.</p>
            <p>We encourage resolving disputes directly. If escalation is needed, contact support with documentation. We may step in at our discretion to mediate policy violations, not as an insurer or guarantor.</p>
          </>
        )
      },
      {
        heading: "Disclaimers and limitation of liability",
        body: (
          <>
            <p>MasseurMatch provides a directory and tools "as is." We do not guarantee outcomes, availability, or suitability of services. To the extent permitted by law, our liability is limited to the amount you paid for the service giving rise to the claim or a reasonable cap where no payment was made.</p>
            <p>Some jurisdictions do not allow certain limitations; rights that cannot be waived remain unaffected.</p>
          </>
        )
      }
    ]
  },
  "privacy-policy": {
    title: "Privacy Policy",
    description: "Official Privacy Policy describing what data we collect, how we use it, how we protect it, and your privacy rights.",
    sections: [
      {
        heading: "Information we collect",
        body: (
          <>
            <p>We collect account details, profile content, usage analytics, device data, and optional location inputs used to surface relevant listings. Sensitive attributes you choose to share are used only to deliver requested services.</p>
            <p>We do not sell personal data. We use trusted processors for hosting, analytics, payments, messaging, and security. Aggregated and de-identified insights may be used to improve safety and performance.</p>
          </>
        )
      },
      {
        heading: "How we use your information",
        body: (
          <>
            <p>We use data to operate the platform, personalize search results, prevent abuse, process payments, and comply with legal obligations. Communications about account status, safety, or policy changes are required notices; marketing messages are opt-in and can be revoked.</p>
            <p>We restrict employee access to need-to-know scenarios, log administrative actions, and apply least-privilege controls. Data retention follows product necessity and legal requirements; you may request deletion subject to preservation duties.</p>
          </>
        )
      },
      {
        heading: "Your choices and rights",
        body: (
          <>
            <p>You can access, update, or delete profile data, control visibility settings, and manage marketing preferences. Subject to local law, you may request data export, correction, objection to certain processing, or deletion.</p>
            <p>For identity-sensitive actions, we may require verification to protect your account. If you believe your data is misused, contact support and legal so we can investigate quickly.</p>
          </>
        )
      },
      {
        heading: "Data security and transfers",
        body: (
          <>
            <p>We use encryption in transit, secure credential storage, and routine monitoring. Third-country transfers rely on contractual safeguards where applicable. Incident response procedures prioritize containment, notification, and remediation.</p>
            <p>Report suspected vulnerabilities to <a href="mailto:security@masseurmatch.com">security@masseurmatch.com</a>. We review disclosures promptly and appreciate detailed reproduction steps.</p>
          </>
        )
      }
    ]
  },
  "community-guidelines": {
    title: "Community Guidelines",
    description: "Clear rules for acceptable behavior on MasseurMatch, allowed content, prohibited activities, and safety expectations.",
    sections: [
      {
        heading: "Respect, consent, and boundaries",
        body: (
          <>
            <p>Consent is required at every stage. Discuss expectations, draping, and pressure preferences before and during a session. Aggressive, discriminatory, or sexual conduct is prohibited.</p>
            <p>Therapists may decline requests that fall outside their services or comfort. Clients must honor a "no" immediately.</p>
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
    ]
  },
  "cookie-policy": {
    title: "Cookie Policy",
    description: "How MasseurMatch uses cookies, analytics, tracking tools, and how users can manage preferences.",
    sections: [
      {
        heading: "What cookies we use",
        body: (
          <>
            <p>We use essential cookies for authentication and security, preference cookies to remember settings, and analytics cookies to understand feature performance. Marketing cookies are limited and optional.</p>
            <p>Third-party providers may place cookies when delivering analytics, payments, fraud prevention, or embedded content. Their use is governed by their policies in addition to ours.</p>
          </>
        )
      },
      {
        heading: "Why we use them",
        body: (
          <>
            <p>Cookies keep you signed in, help route traffic efficiently, detect abuse, and measure site reliability. Preference cookies store language or region selections to reduce friction.</p>
            <p>Analytics help us improve search relevance, page performance, and safety tooling. We avoid collecting more data than needed for these purposes.</p>
          </>
        )
      },
      {
        heading: "How you can control cookies",
        body: (
          <>
            <p>You can adjust browser settings to block or delete cookies, though essential cookies are required for core functionality. Where available, in-product controls let you opt out of non-essential categories.</p>
            <p>Blocking certain cookies may affect login persistence, personalization, or loading speed. You can revisit preferences at any time.</p>
          </>
        )
      },
      {
        heading: "Data retention and updates",
        body: (
          <>
            <p>Retention varies by cookie type and purpose. Security logs are kept as needed to enforce our policies and comply with legal obligations. We review vendors regularly to ensure alignment with our standards.</p>
            <p>We will update this policy when we add or change vendors or controls. Material changes will be noted in-product where feasible.</p>
          </>
        )
      }
    ]
  },
  "professional-standards": {
    title: "Professional Standards",
    description: "Professional expectations for therapists on MasseurMatch including quality, ethics, conduct, verification, and safety standards.",
    sections: [
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
    ]
  },
  "anti-trafficking": {
    title: "Anti-Trafficking Policy",
    description: "MasseurMatch's zero tolerance policy for human trafficking, exploitation, and illegal services, with detailed reporting and enforcement rules.",
    sections: [
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
    ]
  }
};

type LegalPageData = {
  title: string;
  description: string;
  sections: Array<{
    heading: string;
    body: React.ReactNode;
  }>;
};

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const pageData = LEGAL_PAGES[slug as keyof typeof LEGAL_PAGES];

  if (!pageData) {
    return {
      title: "Page Not Found | MasseurMatch"
    };
  }

  const url = `https://www.masseurmatch.com/legal/${slug}`;

  return {
    title: `${pageData.title} | MasseurMatch`,
    description: pageData.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${pageData.title} | MasseurMatch`,
      description: pageData.description,
      url,
      siteName: "MasseurMatch",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageData.title} | MasseurMatch`,
      description: pageData.description,
    },
  };
}

export default async function LegalSlugPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const pageData = LEGAL_PAGES[slug as keyof typeof LEGAL_PAGES];

  if (!pageData) {
    notFound();
  }

  return (
    <LegalPage
      title={pageData.title}
      description={pageData.description}
      slug={`/legal/${slug}`}
      sections={pageData.sections}
    />
  );
}
