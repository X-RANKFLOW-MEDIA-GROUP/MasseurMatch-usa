import { supabaseServer } from "@/src/lib/supabaseServer";
import { baseSEO } from "@/app/lib/seo";
import { cityMap } from "@/app/data/cities";
import { neighbors } from "@/app/data/cityNeighbors";

type CityPageProps = { params: { city: string } };

// ========================
// METADATA DINÂMICA
// ========================
export async function generateMetadata({ params }: CityPageProps) {
  const key = params.city.toLowerCase();
  const info = cityMap[key];

  if (!info) {
    return baseSEO({
      title: "City not found",
      description: "This location does not exist on MasseurMatch",
      keywords: ["gay massage", "male massage"],
      url: `https://www.masseurmatch.com/city/${params.city}`
    });
  }

  return baseSEO({
    title: `Gay massage in ${info.label}, ${info.state} | MasseurMatch`,
    description: `Find verified gay and male massage therapists in ${info.label}. Explore LGBT friendly professionals offering deep tissue, relaxation and therapeutic services.`,
    keywords: [
      "gay massage",
      "male massage",
      `${info.label} gay massage`,
      `${info.label} massage`,
      `${info.state} massage`,
      "lgbt massage"
    ],
    url: `https://www.masseurmatch.com/city/${params.city}`
  });
}

// ========================
// CITY PAGE FINAL
// ========================
export default async function CityPage({ params }: CityPageProps) {
  const key = params.city.toLowerCase();
  const info = cityMap[key];

  if (!info) {
    return (
      <main>
        <h1>City not found</h1>
      </main>
    );
  }

  const { data } = await supabaseServer
    .from("therapist_seeds")
    .select("segment_public, segment_technique, segment_problem")
    .eq("city", info.label);

  const total = data?.length ?? 0;

  // SCHEMA SERVICE
  const ldJsonService = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `Gay massage and male massage in ${info.label}`,
    "provider": { "@type": "Organization", "name": "MasseurMatch" },
    "areaServed": {
      "@type": "City",
      "name": info.label,
      "addressRegion": info.state
    }
  };

  // SCHEMA BREADCRUMB
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
        "name": info.label,
        "item": `https://www.masseurmatch.com/city/${params.city}`
      }
    ]
  };

  // SCHEMA FAQ
  const ldJsonFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": info.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <main className="space-y-10">
      {/* SCHEMA SERVICE */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJsonService) }}
      />

      {/* SCHEMA BREADCRUMB */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJsonBreadcrumb) }}
      />

      {/* SCHEMA FAQ */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJsonFAQ) }}
      />

      <h1 className="text-3xl font-bold">
        Gay massage in {info.label}, {info.state}
      </h1>

      <p>
        MasseurMatch highlights inclusive massage therapists in {info.label} so visitors and locals can book safely. This directory blends public profiles with {total} vetted seed profiles to keep pages useful, human, and aligned with real demand in the metro area.
      </p>

      <p>
        {info.description}
      </p>

      <p>
        {info.lgbtContext}
      </p>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Neighborhoods locals mention</h2>
        <p>
          Bookings in {info.label} tend to cluster where travel, nightlife, and hotels overlap. The areas below show where visitors usually stay and where locals prefer to host calm, respectful sessions.
        </p>
        <ul className="list-disc space-y-2 pl-6">
          {info.neighborhoods.map((n) => (
            <li key={n.name}>
              <strong>{n.name}:</strong> {n.vibe}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Events and local rhythm</h2>
        <p>
          Festivals, sports, and nightlife change how people move around {info.label}. Busy weekends push more visitors to in-hotel or mobile sessions so they can skip parking stress.
        </p>
        <ul className="list-disc space-y-2 pl-6">
          {info.events.map((ev) => (
            <li key={ev.name}>
              <strong>{ev.name}:</strong> {ev.detail}
            </li>
          ))}
        </ul>
        <p>{info.weather}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Travel demand, culture, and timing</h2>
        <p>{info.tourism}</p>
        <p>{info.culture}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Why hire a massage in {info.label}</h2>
        <p>
          Clients here want restorative sessions that match the city&apos;s pace. Whether it is post-flight tension, post-event fatigue, or a quiet hour away from crowds, the reasons below come up most often.
        </p>
        <ul className="list-disc space-y-2 pl-6">
          {info.massageReasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">City-specific FAQs</h2>
        <div className="space-y-3">
          {info.faqs.map((faq) => (
            <article key={faq.question} className="space-y-1">
              <h3 className="font-semibold">{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      {/* NEARBY CITIES */}
      {neighbors[key] && (
        <section>
          <h2 className="text-2xl font-semibold">Nearby Cities</h2>
          <p>
            Travelers often price-compare or split trips between nearby hubs. Explore the cities below to see alternate airport options, hotel areas, and therapists willing to cover both markets.
          </p>
          <div className="flex flex-wrap gap-3">
            {neighbors[key].map(n => (
              <a key={n} href={`/city/${n}`}>
                {cityMap[n].label}
              </a>
            ))}
          </div>
        </section>
      )}

    </main>
  );
}
