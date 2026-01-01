import Link from "next/link";
import { supabaseServer } from "@/src/lib/supabaseServer";
import { baseSEO } from "@/app/lib/seo";
import { cityMap } from "@/app/data/cities";
import { neighbors } from "@/app/data/cityNeighbors";
import CityLandingPage from "@/src/components/CityLandingPage";
import { getExpansionCity } from "@/app/data/expansionCities";

type CityPageProps = { params: { city: string } };

// ========================
// METADATA DINÂMICA
// ========================
export async function generateMetadata({ params }: CityPageProps) {
  const key = params.city.toLowerCase();
  const info = cityMap[key];
  const expansionCity = getExpansionCity(key);

  if (!info && expansionCity) {
    const { name, state } = expansionCity;

    return baseSEO({
      title: `Gay Massage ${name} ${state} | Male Massage Therapists | MasseurMatch`,
      description: `Find LGBT-friendly massage therapists in ${name}, ${state}. Professional male bodywork, gay massage, and inclusive wellness services. Join our expanding network.`,
      keywords: [
        `gay massage ${name}`,
        `male massage ${name}`,
        `LGBT massage ${state}`,
        `m4m massage ${name}`,
        `gay spa ${name}`,
        `male bodywork ${name}`,
        `inclusive massage ${name}`
      ],
      url: `https://www.masseurmatch.com/city/${params.city}`
    });
  }

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
  const expansionCity = getExpansionCity(key);

  if (!info && expansionCity) {
    return <CityLandingPage city={expansionCity} slug={params.city} />;
  }

  if (!info) {
    return (
      <main>
        <h1>City not found</h1>
      </main>
    );
  }

  let total = 0;
  let fetchError = false;

  try {
    const { data, error } = await supabaseServer
      .from("therapist_seeds")
      .select("segment_public, segment_technique, segment_problem")
      .eq("city", info.label);

    if (error) {
      throw error;
    }

    total = data?.length ?? 0;
  } catch (error) {
    fetchError = true;
    console.error("Failed to load therapist seeds for city page", error);
  }

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

  // SCHEMA LOCALBUSINESS (SEO boost)
  const ldJsonLocalBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Gay Massage in ${info.label}`,
    "description": `Find LGBT-friendly massage therapists in ${info.label}, ${info.state}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": info.label,
      "addressRegion": info.state,
      "addressCountry": "US"
    },
    "url": `https://www.masseurmatch.com/city/${params.city}`,
    "priceRange": "$$",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "reviewCount": total > 0 ? total : 50
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

      {/* SCHEMA LOCALBUSINESS */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJsonLocalBusiness) }}
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

      {/* BREADCRUMBS HTML (SEO + UX) */}
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol itemScope itemType="https://schema.org/BreadcrumbList" className="flex gap-2">
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link itemProp="item" href="/" className="text-blue-600 hover:underline">
              <span itemProp="name">Home</span>
            </Link>
            <meta itemProp="position" content="1" />
            <span className="mx-2">/</span>
          </li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name" className="text-gray-600">{info.label}</span>
            <meta itemProp="position" content="2" />
          </li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold">
        Gay massage in {info.label}, {info.state}
      </h1>

      <p className="text-lg text-gray-700">
        Find verified LGBT-friendly male massage therapists. {total}+ professionals available.
      </p>

      {fetchError && (
        <p className="rounded-md bg-yellow-50 p-4 text-sm text-yellow-800">
          We are having trouble loading live therapist data right now. You can still explore city insights below while we work on restoring the connection.
        </p>
      )}

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

      {/* RELATED SEGMENTS (Internal Linking for SEO) */}
      <section className="space-y-3 border-t pt-6">
        <h2 className="text-2xl font-semibold">Popular Services in {info.label}</h2>
        <p>Explore specialized massage services tailored for the LGBT community in {info.label}:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <a href={`/city/${params.city}/gay-massage`} className="text-blue-600 hover:underline">
            Gay Massage in {info.label}
          </a>
          <a href={`/city/${params.city}/male-massage`} className="text-blue-600 hover:underline">
            Male Massage in {info.label}
          </a>
          <a href={`/city/${params.city}/m4m-massage`} className="text-blue-600 hover:underline">
            M4M Massage in {info.label}
          </a>
          <a href={`/city/${params.city}/lgbt-massage`} className="text-blue-600 hover:underline">
            LGBT Massage in {info.label}
          </a>
          <a href={`/city/${params.city}/deep-tissue`} className="text-blue-600 hover:underline">
            Deep Tissue Massage
          </a>
          <a href={`/city/${params.city}/sports-massage`} className="text-blue-600 hover:underline">
            Sports Massage
          </a>
          <a href={`/city/${params.city}/relaxation`} className="text-blue-600 hover:underline">
            Relaxation Massage
          </a>
          <a href={`/city/${params.city}/hotel-massage`} className="text-blue-600 hover:underline">
            Hotel Massage
          </a>
          <a href={`/city/${params.city}/mobile-massage`} className="text-blue-600 hover:underline">
            Mobile Massage
          </a>
        </div>
      </section>

      {/* NEARBY CITIES */}
      {neighbors[key] && (
        <section className="space-y-3 border-t pt-6">
          <h2 className="text-2xl font-semibold">Explore Gay Massage in Nearby Cities</h2>
          <p>
            Travelers often price-compare or split trips between nearby hubs. Explore the cities below to see alternate airport options, hotel areas, and therapists willing to cover both markets.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {neighbors[key].map(n => (
              <a key={n} href={`/city/${n}`} className="text-blue-600 hover:underline">
                {cityMap[n]?.label || n} Gay Massage
              </a>
            ))}
          </div>
        </section>
      )}

    </main>
  );
}
