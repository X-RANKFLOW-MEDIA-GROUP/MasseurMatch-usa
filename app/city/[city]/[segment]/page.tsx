import Link from "next/link";
import { supabaseServer } from "@/src/lib/supabaseServer";
import { baseSEO } from "@/app/lib/seo";
import { cityMap } from "@/app/data/cities";
import { neighbors } from "@/app/data/cityNeighbors";

const segmentConfig: Record<string, { title: string; type: string }> = {
  "gay-massage": { title: "Gay Massage", type: "public" },
  "male-massage": { title: "Male Massage", type: "public" },
  "m4m-massage": { title: "M4M Massage", type: "public" },
  "lgbt-massage": { title: "LGBT Massage", type: "public" },
  "gay-friendly-massage": { title: "Gay Friendly Massage", type: "public" },
  "men-only-massage": { title: "Men Only Massage", type: "public" },
  "gay-spa": { title: "Gay Spa", type: "public" },
  "gay-bodywork": { title: "Gay Bodywork", type: "public" },

  "deep-tissue": { title: "Deep Tissue Massage", type: "technique" },
  "sports-massage": { title: "Sports Massage", type: "technique" },
  "relaxation": { title: "Relaxation Massage", type: "technique" },
  "thai-massage": { title: "Thai Massage", type: "technique" },

  "stress-relief": { title: "Stress Relief Massage", type: "problem" },
  "back-pain": { title: "Back Pain Massage", type: "problem" },
  "neck-pain": { title: "Neck Pain Massage", type: "problem" },

  "hotel-massage": { title: "Hotel Massage", type: "service" },
  "mobile-massage": { title: "Mobile Massage", type: "service" },

  "late-night-massage": { title: "Late Night Massage", type: "timing" }
};

type SegmentNarrative = {
  focus: (city: string, title: string) => string;
  benefit: (city: string, title: string) => string;
};

const segmentNarratives: Record<string, SegmentNarrative> = {
  "gay-massage": {
    focus: (city) =>
      `Gay massage in ${city} centers LGBT comfort, consent, and privacy for queer travelers and locals who want an affirming space without guessing about safety.`,
    benefit: (city) =>
      `Providers familiar with ${city} nightlife and hotel policies help clients keep things discreet while still getting the pressure and pacing they prefer.`,
  },
  "male-massage": {
    focus: (_city) =>
      `Male massage appeals to clients who prefer working with male practitioners and clear, direct communication from the first message.`,
    benefit: (city) =>
      `In ${city}, many book after workouts or long workdays, asking for balanced pressure that keeps the experience relaxing, not rushed.`,
  },
  "m4m-massage": {
    focus: (_city) =>
      `M4M massage highlights discreet, male-to-male care with emphasis on boundaries and calm, respectful service.`,
    benefit: (city) =>
      `Clients in ${city} often choose private, quiet setups away from crowded bars or shared housing so they can fully unwind.`,
  },
  "lgbt-massage": {
    focus: (_city) =>
      `LGBT massage welcomes all identities, including trans men and nonbinary travelers, with pronoun-aware intake and transparent boundaries.`,
    benefit: (city) =>
      `Providers in ${city} are used to visitors blending work and nightlife, so they time sessions around event traffic and parking rules.`,
  },
  "gay-friendly-massage": {
    focus: (_city, title) =>
      `${title} signals allyship and respect even when the practitioner is not queer, giving clients a low-stress way to book in this city.`,
    benefit: (city) =>
      `That often means extra clarity on privacy, check-in steps, and payment options so guests can relax without surprise policies.`,
  },
  "men-only-massage": {
    focus: (_city) =>
      `Men-only massage offers single-gender comfort and straightforward expectations that some clients prefer on the road.`,
    benefit: (city) =>
      `In ${city}, it often pairs with gym visits or hotel stays where guests want direct, efficient sessions without waiting in traffic.`,
  },
  "gay-spa": {
    focus: (_city) =>
      `Gay spa-style sessions mix massage with calming rituals like music, warm towels, and aromatherapy tailored to queer clients.`,
    benefit: (city) =>
      `Visitors in ${city} lean on these appointments to reset between events without leaving their hotel or rental.`,
  },
  "gay-bodywork": {
    focus: (_city) =>
      `Gay bodywork blends structural techniques with intuitive touch and queer-aware communication so clients feel seen and safe.`,
    benefit: (city) =>
      `In ${city}, guests often ask for pressure that respects boundaries while addressing posture and mobility from travel.`,
  },
  "deep-tissue": {
    focus: (_city) =>
      `Deep tissue sessions target adhesions from flights, lifting, or long desk hours, going slow enough to stay comfortable.`,
    benefit: (city) =>
      `Conference guests and locals who train hard before work frequently book this to keep moving without soreness.`,
  },
  "sports-massage": {
    focus: (city) =>
      `Sports massage supports recovery before and after races, gym sessions, or outdoor miles around parks and trails in ${city}.`,
    benefit: (_city) =>
      `Therapists dial pressure and stretching to match training goals, then share quick aftercare clients can do back at the hotel.`,
  },
  relaxation: {
    focus: (_city) =>
      `Relaxation massage slows the nervous system after loud events, meetings, or travel delays.`,
    benefit: (_city) =>
      `Longer, even strokes and calmer pacing help guests sleep better and reset before the next packed day.`,
  },
  "thai-massage": {
    focus: (_city) =>
      `Thai massage uses stretching and assisted movement to restore mobility without heavy oil, useful after flights.`,
    benefit: (_city) =>
      `Travelers appreciate how it opens hips, shoulders, and back while keeping clothing on or minimal, depending on preference.`,
  },
  "stress-relief": {
    focus: (_city) =>
      `Stress-relief sessions emphasize breathing, lighter pressure, and calming rhythm to counter crowds and traffic.`,
    benefit: (_city) =>
      `They often pair with grounding techniques and gentle neck and shoulder focus to lower tension fast.`,
  },
  "back-pain": {
    focus: (_city) =>
      `Back-pain massage addresses posture changes from flights, rideshare seats, and hotel work setups.`,
    benefit: (_city) =>
      `Slow, focused work plus aftercare tips help clients move comfortably through the rest of their trip.`,
  },
  "neck-pain": {
    focus: (_city) =>
      `Neck-pain sessions target tech neck, heavy bags, and sleep changes that stack up while traveling.`,
    benefit: (_city) =>
      `Therapists combine gentle mobility with specific trigger point attention when requested to keep relief lasting longer.`,
  },
  "hotel-massage": {
    focus: (_city) =>
      `Hotel massage keeps visitors in their rooms, skipping parking and lobby lines after long days moving around the city.`,
    benefit: (_city) =>
      `Therapists who know local hotel policies can move quickly between floors while keeping privacy intact.`,
  },
  "mobile-massage": {
    focus: (_city) =>
      `Mobile massage meets clients in rentals or homes with portable setups, reducing travel across spread-out areas.`,
    benefit: (_city) =>
      `It works well for groups or travelers without cars who still want a full studio-quality session.`,
  },
  "late-night-massage": {
    focus: (_city) =>
      `Late night massage serves shift workers and nightlife crowds who need care after midnight.`,
    benefit: (_city) =>
      `Scheduling around bar close times and limited transit keeps sessions discreet, predictable, and safe for both client and therapist.`,
  }
};

type SegmentPageProps = {
  params: { city: string; segment: string };
};

export async function generateMetadata({ params }: SegmentPageProps) {
  const cityKey = params.city.toLowerCase();
  const info = cityMap[cityKey];
  const cfg = segmentConfig[params.segment];

  if (!info || !cfg) {
    return baseSEO({
      title: "Not found",
      description: "This page does not exist on MasseurMatch",
      keywords: ["massage directory"],
      url: `https://www.masseurmatch.com/city/${params.city}/${params.segment}`
    });
  }

  return baseSEO({
    title: `${cfg.title} in ${info.label} | MasseurMatch`,
    description: `Find ${cfg.title.toLowerCase()} in ${info.label}. Explore verified LGBT friendly male massage therapists available for local sessions and mobile visits.`,
    keywords: [
      cfg.title.toLowerCase(),
      `${cfg.title.toLowerCase()} ${info.label}`,
      `${info.label} massage`,
      "gay massage",
      "male massage"
    ],
    url: `https://www.masseurmatch.com/city/${params.city}/${params.segment}`
  });
}

export default async function SegmentPage({ params }: SegmentPageProps) {
  const cityKey = params.city.toLowerCase();
  const info = cityMap[cityKey];
  const cfg = segmentConfig[params.segment];

  if (!info || !cfg) {
    return (
      <main>
        <h1>Not found</h1>
      </main>
    );
  }

  let query = supabaseServer
    .from("therapist_seeds")
    .select("id")
    .eq("city", info.label);

  if (cfg.type === "public") {
    query = query.eq("segment_public", params.segment);
  } else if (cfg.type === "technique") {
    query = query.eq("segment_technique", params.segment);
  } else if (cfg.type === "problem") {
    query = query.eq("segment_problem", params.segment);
  }

  const { data } = await query;
  const total = data?.length ?? 0;

  const narrative =
    segmentNarratives[params.segment] ?? {
      focus: (city: string, title: string) =>
        `${title} in ${city} is tailored around clear communication, comfort, and respecting client boundaries from the first message.`,
      benefit: (city: string) =>
        `Therapists in ${city} adapt pressure and pacing based on goals, whether you book in-room or visit a local studio.`
    };

  const segmentFaqs = [
    {
      question: `Who books ${cfg.title.toLowerCase()} in ${info.label}?`,
      answer:
        `Locals with regular routines, business travelers staying downtown, and visitors near ${info.neighborhoods[0]?.name ?? "central hotels"} often choose ${cfg.title.toLowerCase()} when they want privacy and LGBT-aware service.`
    },
    {
      question: `Where do people schedule ${cfg.title.toLowerCase()} in ${info.label}?`,
      answer:
        `Most requests cluster around ${info.neighborhoods.slice(0, 2).map(n => n.name).join(" and ")} plus hotel corridors near events. Mobile providers cover other districts when parking and timing are confirmed in advance.`
    },
    {
      question: `How should I prepare for ${cfg.title.toLowerCase()} in ${info.label}?`,
      answer:
        "Share any hotel or building check-in rules, preferred pressure, and pronouns when you message. Having water, ID, and a clear start time ready helps keep arrivals smooth."
    }
  ];

  const ldJsonService = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${cfg.title} in ${info.label}`,
    "provider": { "@type": "Organization", "name": "MasseurMatch" },
    "areaServed": { "@type": "City", "name": info.label }
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
        "name": info.label,
        "item": `https://www.masseurmatch.com/city/${params.city}/${params.segment}`
      }
    ]
  };

  const ldJsonFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": segmentFaqs.map((faq) => ({
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
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJsonService) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJsonBreadcrumb) }}
      />
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
            <a itemProp="item" href={`/city/${params.city}`} className="text-blue-600 hover:underline">
              <span itemProp="name">{info.label}</span>
            </a>
            <meta itemProp="position" content="2" />
            <span className="mx-2">/</span>
          </li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name" className="text-gray-600">{cfg.title}</span>
            <meta itemProp="position" content="3" />
          </li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold">
        {cfg.title} in {info.label}
      </h1>

      <p className="text-lg text-gray-700">
        Find {cfg.title.toLowerCase()} specialists in {info.label}. {total}+ verified therapists available.
      </p>

      <p>
        {info.description}
      </p>

      <p>
        {narrative.focus(info.label, cfg.title)}
      </p>

      <p>
        {info.lgbtContext}
      </p>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Where bookings cluster</h2>
        <p>
          Visitors and locals choose areas that balance privacy, easy parking, and short rideshare times. The neighborhoods below are where {cfg.title.toLowerCase()} requests tend to concentrate.
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
        <h2 className="text-2xl font-semibold">Events, seasons, and timing</h2>
        <p>
          Crowds shift with the calendar, so timing matters for {cfg.title.toLowerCase()} in {info.label}. Busy weekends push more guests to in-room sessions and earlier messaging.
        </p>
        <ul className="list-disc space-y-2 pl-6">
          {info.events.map((ev) => (
            <li key={ev.name}>
              <strong>{ev.name}:</strong> {ev.detail}
            </li>
          ))}
        </ul>
        <p>{info.weather}</p>
        <p>{info.tourism}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">How {cfg.title} fits {info.label}</h2>
        <p>{narrative.benefit(info.label, cfg.title)}</p>
        <p>{info.culture}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Common reasons people book</h2>
        <p>
          Seed profiles tracked for quality control: {total}. Clients mention the reasons below most often when they book {cfg.title.toLowerCase()} in {info.label}.
        </p>
        <ul className="list-disc space-y-2 pl-6">
          {info.massageReasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">FAQs about {cfg.title.toLowerCase()} in {info.label}</h2>
        <div className="space-y-3">
          {segmentFaqs.map((faq) => (
            <article key={faq.question} className="space-y-1">
              <h3 className="font-semibold">{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      {/* RELATED SEGMENTS (Internal Linking for SEO) */}
      <section className="space-y-3 border-t pt-6">
        <h2 className="text-2xl font-semibold">Other Services in {info.label}</h2>
        <p>Explore more massage options in {info.label}:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <a href={`/city/${params.city}/gay-massage`} className="text-blue-600 hover:underline">
            Gay Massage
          </a>
          <a href={`/city/${params.city}/male-massage`} className="text-blue-600 hover:underline">
            Male Massage
          </a>
          <a href={`/city/${params.city}/m4m-massage`} className="text-blue-600 hover:underline">
            M4M Massage
          </a>
          <a href={`/city/${params.city}/deep-tissue`} className="text-blue-600 hover:underline">
            Deep Tissue
          </a>
          <a href={`/city/${params.city}/sports-massage`} className="text-blue-600 hover:underline">
            Sports Massage
          </a>
          <a href={`/city/${params.city}/relaxation`} className="text-blue-600 hover:underline">
            Relaxation
          </a>
          <a href={`/city/${params.city}/hotel-massage`} className="text-blue-600 hover:underline">
            Hotel Massage
          </a>
          <a href={`/city/${params.city}/mobile-massage`} className="text-blue-600 hover:underline">
            Mobile Massage
          </a>
        </div>
      </section>

      {neighbors[cityKey] && (
        <section className="space-y-3 border-t pt-6">
          <h2 className="text-2xl font-semibold">Nearby cities</h2>
          <p>
            If you split your trip across nearby hubs, these links help you compare availability and travel time before booking.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {neighbors[cityKey].map(n => (
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
