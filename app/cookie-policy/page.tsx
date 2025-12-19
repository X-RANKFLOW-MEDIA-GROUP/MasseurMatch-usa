import { LegalPage } from "@/app/legal/LegalPage";

export async function generateMetadata() {
  const url = "https://www.masseurmatch.com/cookie-policy";

  return {
    title: "Cookie Policy | MasseurMatch",
    description:
      "How MasseurMatch uses cookies, analytics, tracking tools, and how users can manage preferences.",
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: "Cookie Policy | MasseurMatch",
      description:
        "How MasseurMatch uses cookies, analytics, tracking tools, and how users can manage preferences.",
      url,
      siteName: "MasseurMatch",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: "Cookie Policy | MasseurMatch",
      description:
        "How MasseurMatch uses cookies, analytics, tracking tools, and how users can manage preferences.",
    },
  };
}

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      description="How MasseurMatch uses cookies, analytics, tracking tools, and how users can manage preferences."
      slug="/cookie-policy"
      sections={[
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
      ]}
    />
  );
}
