import type { PublicProfile } from "@/lib/profile";

export default function FAQBlock({ profile }: { profile: PublicProfile }) {
  const faqs = [
    {
      q: "Does MasseurMatch handle booking or payment?",
      a: "No. MasseurMatch is a directory platform only. Contact happens outside the platform and no bookings or payments are processed on this website.",
    },
    {
      q: "What is the difference between in-call and out-call?",
      a: "In-call means the therapist hosts sessions at their location. Out-call means the therapist travels to your location. Availability and areas served vary by provider.",
    },
    {
      q: "What services are offered?",
      a: profile.services && profile.services.length > 0
        ? `This profile lists services such as: ${profile.services.slice(0, 8).join(", ")}.`
        : "Services vary by provider. Check the Services section above or contact the therapist directly.",
    },
    {
      q: "What is included in verification on MasseurMatch?",
      a: "Verification scope is limited and does not imply licensing, certification, or background checks. See our Verification Scope page for details.",
    },
    {
      q: "How do I contact this therapist?",
      a: "Use the contact options displayed on this page. If no contact options are listed, the provider has not published them yet.",
    },
    {
      q: "Are rates negotiable?",
      a: "Rates and services are set by individual providers. Contact the therapist directly to discuss pricing, packages, and any special requests.",
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
      <div className="mt-3 space-y-3">
        {faqs.map((f) => (
          <details
            key={f.q}
            className="rounded-xl border p-4 dark:border-gray-700"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <summary
              className="cursor-pointer text-sm font-medium"
              itemProp="name"
            >
              {f.q}
            </summary>
            <div
              className="mt-2 text-sm text-gray-700 dark:text-gray-300"
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <div itemProp="text">{f.a}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
