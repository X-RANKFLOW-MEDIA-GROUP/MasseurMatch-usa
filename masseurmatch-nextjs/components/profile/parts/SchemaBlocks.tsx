import type { PublicProfile } from "@/lib/profile";
import { planPhotoLimit, safeAlt, moneyRange, canonicalUrl } from "@/lib/profile";

/**
 * Schema.org structured data for SEO
 * Includes: LocalBusiness, FAQPage, ImageObject
 */
export default function SchemaBlocks({ profile }: { profile: PublicProfile }) {
  const photos = Array.isArray(profile.photos) ? profile.photos : [];
  const limit = planPhotoLimit(profile.plan_tier);
  const primaryImage = photos[0]?.url;
  const canonical = canonicalUrl(profile);

  // LocalBusiness / HealthAndBeautyBusiness schema
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: `${profile.display_name} Massage Therapy`,
    url: canonical,
    image: primaryImage,
    description: profile.short_bio || `Massage therapy services in ${profile.city_name}, ${profile.state_code}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.city_name,
      addressRegion: profile.state_code,
      addressCountry: "US",
    },
    areaServed: profile.service_areas
      ? profile.service_areas.slice(0, 15).map((a) => ({
          "@type": "City",
          name: `${a.city_name}, ${a.state_code}`,
        }))
      : [
          {
            "@type": "City",
            name: `${profile.city_name}, ${profile.state_code}`,
          },
        ],
    priceRange: moneyRange(profile) || undefined,
    knowsLanguage: profile.languages || undefined,
    hasOfferCatalog: profile.services
      ? {
          "@type": "OfferCatalog",
          name: "Massage Services",
          itemListElement: profile.services.slice(0, 10).map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: service,
            },
          })),
        }
      : undefined,
  };

  // FAQPage schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Does MasseurMatch handle booking or payment?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. MasseurMatch is a directory platform only. Contact happens outside the platform and no bookings or payments are processed on this website.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between in-call and out-call?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In-call means the therapist hosts sessions at their location. Out-call means the therapist travels to your location. Availability and areas served vary by provider.",
        },
      },
      {
        "@type": "Question",
        name: "What services are offered?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            profile.services && profile.services.length > 0
              ? `This profile lists services such as: ${profile.services.slice(0, 8).join(", ")}.`
              : "Services vary by provider. Check the Services section or contact the therapist directly.",
        },
      },
      {
        "@type": "Question",
        name: "What is included in verification on MasseurMatch?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Verification scope is limited and does not imply licensing, certification, or background checks. See our Verification Scope page for details.",
        },
      },
    ],
  };

  // ImageObject schema for profile photos
  const imageSchemas = photos.slice(0, limit).map((ph, i) => ({
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: ph.url,
    caption: safeAlt(profile, ph, i),
    description: safeAlt(profile, ph, i),
  }));

  // Person schema (alternative for massage therapist profiles)
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.display_name,
    url: canonical,
    image: primaryImage,
    jobTitle: "Massage Therapist",
    description: profile.short_bio || `Massage therapist serving ${profile.city_name}, ${profile.state_code}`,
    knowsLanguage: profile.languages || undefined,
    workLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: profile.city_name,
        addressRegion: profile.state_code,
        addressCountry: "US",
      },
    },
  };

  return (
    <>
      {/* Primary business schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />

      {/* Person schema for individual therapist */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      {/* FAQ schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Image schemas */}
      {imageSchemas.length > 0 &&
        imageSchemas.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
    </>
  );
}
