import { supabaseServer } from "@/lib/supabaseServer";
import { baseSEO } from "@/app/lib/seo";
import TherapistProfile from "@/src/components/TherapistProfile";

type TherapistPageProps = {
  params: { id: string };
};

// ========================
// METADATA DINA,MICA SEO
// ========================
export async function generateMetadata({ params }: TherapistPageProps) {
  const { data } = await supabaseServer
    .from("therapists")
    .select(
      `
      full_name,
      display_name,
      headline,
      city,
      state,
      locationCityState,
      rating,
      override_reviews_count
    `
    )
    .eq("user_id", params.id)
    .maybeSingle();

  const name =
    data?.display_name?.trim() ||
    data?.full_name?.trim() ||
    "Massage therapist";

  const cityState =
    [data?.city, data?.state].filter(Boolean).join(", ") ||
    data?.locationCityState?.trim() ||
    "";

  const titleText = cityState
    ? `${name} massage therapist in ${cityState} | MasseurMatch`
    : `${name} massage therapist | MasseurMatch`;

  const descText = cityState
    ? `${name} offers professional massage in ${cityState}. View services, experience and availability on MasseurMatch.`
    : `${name} offers professional massage sessions. View services, experience and availability on MasseurMatch.`;

  return baseSEO({
    title: titleText,
    description: descText,
    keywords: [
      "massage therapist",
      "gay massage",
      "male massage",
      name,
      cityState
    ].filter(Boolean),
    url: `https://www.masseurmatch.com/therapist/${params.id}`
  });
}

// ========================
// PAGE SERVER + SEO SCHEMA
// ========================
export default async function TherapistPage({ params }: TherapistPageProps) {
  const { data } = await supabaseServer
    .from("therapists")
    .select(
      `
      full_name,
      display_name,
      headline,
      city,
      state,
      locationCityState,
      zip_code,
      profile_photo,
      rating,
      override_reviews_count
    `
    )
    .eq("user_id", params.id)
    .maybeSingle();

  const name =
    data?.display_name?.trim() ||
    data?.full_name?.trim() ||
    "Massage therapist";

  const cityState =
    [data?.city, data?.state].filter(Boolean).join(", ") ||
    data?.locationCityState?.trim() ||
    "";

  const headline = data?.headline?.trim() || "";

  const photo = data?.profile_photo || undefined;

  const rating = data?.rating ?? undefined;
  const ratingCount = data?.override_reviews_count ?? undefined;

  const narrativeParagraphs = [
    `${name} keeps this profile${cityState ? ` for clients in ${cityState}` : ""} so you can understand availability, rates, and expectations before sending a message. Each booking request should feel professional, with clear boundaries and enough context for both client and therapist to decide if the fit is right.`,
    headline
      ? `The headline "${headline}" hints at the style you can expect. If you want lighter pressure, sports recovery, or a calmer pace, mention it up front so the session plan matches your goals.`
      : `If you prefer lighter pressure, focused recovery, or a calmer pace, mention it up front so the therapist can tailor the session around your goals rather than relying on guesswork.`,
    cityState
      ? `If you are visiting ${cityState}, check whether the profile mentions incall, mobile, or hotel-friendly options. Sharing hotel check-in rules, parking notes, and timing windows helps keep arrivals smooth and avoids delays with elevators or gated parking.`
      : `If you are booking while traveling, share whether you want incall, mobile, or hotel-friendly service. Building rules, parking notes, and timing buffers keep arrivals predictable for both sides.`,
    rating && ratingCount
      ? `You can see social proof here: a ${rating.toFixed(1)} average across ${ratingCount} review${ratingCount === 1 ? "" : "s"}. Reviews help set expectations, but you should still confirm boundaries, draping, and any limitations before the session begins.`
      : `Respectful, consent-first communication matters more than marketing claims. Confirm boundaries, draping, and any limitations before the session begins, and feel free to ask about experience with body types similar to yours.`,
    `Share any injuries, recent workouts, or sensitivities in your first message. Water, clean linens if hosting, and a ventilated room help the therapist deliver a safer, more comfortable session.`,
    `Same-day requests sometimes work, but the best results come when you send a clear time window, location, and desired pressure early. If plans change, update the message thread so both sides can adjust without rushing.`
  ];

  const faqEntries = [
    {
      question: `How do I confirm the location with ${name}?`,
      answer: cityState
        ? `Ask whether sessions happen in ${cityState}, at a studio, or at your hotel. Confirm parking, building entry, and any ID requirements so arrival is smooth.`
        : `Ask whether sessions happen at a studio, in-home, or at your hotel. Confirm parking, building entry, and any ID requirements so arrival is smooth.`
    },
    {
      question: `What should I share about pressure and focus areas?`,
      answer:
        "Be specific about pain points, desired pressure, and any areas to avoid. Mention recent workouts, surgeries, or sensitivities so the therapist can adapt pacing and techniques safely."
    },
    {
      question: `How do payments and timing work?`,
      answer:
        "Most therapists confirm rate, duration, and payment methods in chat before arrival. Having exact start and end times, plus a buffer for setup, keeps the session on track for both sides."
    }
  ];

  const ldJsonPerson: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    "jobTitle": data?.headline || "Massage therapist",
    "address": cityState
      ? {
          "@type": "PostalAddress",
          "addressLocality": cityState
        }
      : undefined,
    "image": photo,
    "aggregateRating":
      rating && ratingCount
        ? {
            "@type": "AggregateRating",
            "ratingValue": rating,
            "reviewCount": ratingCount
          }
        : undefined
  };

  const ldJsonBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.masseurmatch.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Therapists",
        "item": "https://www.masseurmatch.com/explore"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": name,
        "item": `https://www.masseurmatch.com/therapist/${params.id}`
      }
    ]
  };

  return (
    <>
      {/* SCHEMA PERSON */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJsonPerson) }}
      />

      {/* SCHEMA BREADCRUMB */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJsonBreadcrumb) }}
      />

      {/* UI completa vem do componente client que voce ja tem */}
      <TherapistProfile />

      <section className="space-y-4 mt-10">
        <h1 className="text-2xl font-semibold">About {name}</h1>
        {narrativeParagraphs.map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}

        <h2 className="text-xl font-semibold">FAQs about this profile</h2>
        <div className="space-y-3">
          {faqEntries.map((faq) => (
            <article key={faq.question} className="space-y-1">
              <h3 className="font-semibold">{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
