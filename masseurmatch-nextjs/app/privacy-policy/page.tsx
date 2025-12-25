import { LegalPage } from "@/app/legal/LegalPage";

export async function generateMetadata() {
  const url = "https://www.masseurmatch.com/privacy-policy";

  return {
    title: "Privacy Policy | MasseurMatch",
    description:
      "Official Privacy Policy describing what data we collect, how we use it, how we protect it, and your privacy rights.",
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: "Privacy Policy | MasseurMatch",
      description:
        "Official Privacy Policy describing what data we collect, how we use it, how we protect it, and your privacy rights.",
      url,
      siteName: "MasseurMatch",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: "Privacy Policy | MasseurMatch",
      description:
        "Official Privacy Policy describing what data we collect, how we use it, how we protect it, and your privacy rights.",
    },
  };
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="Official Privacy Policy describing what data we collect, how we use it, how we protect it, and your privacy rights."
      slug="/privacy-policy"
      sections={[
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
      ]}
    />
  );
}
