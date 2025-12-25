import { LegalPage } from "@/app/legal/LegalPage";

export async function generateMetadata() {
  const url = "https://www.masseurmatch.com/terms";

  return {
    title: "Terms of Use | MasseurMatch",
    description:
      "Official Terms of Use explaining how the MasseurMatch platform works, user responsibilities, therapist independence, safety standards, and legal limitations.",
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: "Terms of Use | MasseurMatch",
      description: "Official MasseurMatch Terms of Use for clients and therapists.",
      url,
      siteName: "MasseurMatch",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: "Terms of Use | MasseurMatch",
      description: "Official MasseurMatch Terms of Use for clients and therapists.",
    },
  };
}

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="Official Terms of Use explaining how the MasseurMatch platform works, user responsibilities, therapist independence, safety standards, and legal limitations."
      slug="/terms"
      sections={[
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
              <p>Where payments are processed through partners, you agree to their terms. Fees are disclosed before charge. Cancellations, refunds, and rescheduling must follow the provider’s stated policy; abuse of chargebacks may result in account limits.</p>
              <p>We encourage resolving disputes directly. If escalation is needed, contact support with documentation. We may step in at our discretion to mediate policy violations, not as an insurer or guarantor.</p>
            </>
          )
        },
        {
          heading: "Disclaimers and limitation of liability",
          body: (
            <>
              <p>MasseurMatch provides a directory and tools “as is.” We do not guarantee outcomes, availability, or suitability of services. To the extent permitted by law, our liability is limited to the amount you paid for the service giving rise to the claim or a reasonable cap where no payment was made.</p>
              <p>Some jurisdictions do not allow certain limitations; rights that cannot be waived remain unaffected.</p>
            </>
          )
        }
      ]}
    />
  );
}
