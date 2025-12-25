import { absUrl, SITE_URL, stripHtml } from '@/lib/seo';
import { getTherapistBySlug, TherapistRecord } from './data';

const SEARCH_ACTION_URL = `${absUrl('/explore')}?query={search_term_string}`;
const WEBSITE_NODE_ID = `${SITE_URL}/#website`;

export default async function Head({
  params,
}: {
  params: { slug: string };
}) {
  const { therapist } = await getTherapistBySlug(params.slug);

  if (!therapist || !isPublicProfile(therapist)) {
    return null;
  }

  const graph = buildGraph(therapist);
  if (!graph.length) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  );
}

function isPublicProfile(therapist: TherapistRecord): boolean {
  return (therapist.publication_status ?? '').toLowerCase() === 'public';
}

function buildGraph(therapist: TherapistRecord): Array<Record<string, unknown>> {
  const displayName = therapist.display_name || therapist.full_name || 'Massage Therapist';
  const profileUrl = absUrl(`/therapist/${therapist.slug}`);
  const localBusinessId = `${profileUrl}#localbusiness`;
  const personId = `${profileUrl}#person`;
  const breadcrumbId = `${profileUrl}#breadcrumb`;
  const webpageId = `${profileUrl}#webpage`;
  const cityLabel = therapist.city || slugToName(therapist.city_slug);
  const cityUrl = therapist.city_slug ? absUrl(`/city/${therapist.city_slug}`) : undefined;
  const description = stripHtml(
    therapist.about ||
      therapist.headline ||
      `Book ${displayName}${cityLabel ? ` in ${cityLabel}` : ''}.`
  );
  const pageTitle = `${displayName} — ${therapist.headline || 'Massage Therapist'}${
    cityLabel ? ` in ${cityLabel}` : ''
  } | MasseurMatch`;

  const images = collectImageUrls(therapist);
  const languages = toStringArray(therapist.languages);
  const servicesList = toStringArray(therapist.services);
  const sameAs = collectSameAs(therapist);

  const breadcrumbItems = buildBreadcrumbItems(cityLabel, cityUrl, displayName, profileUrl);
  const geo = buildGeoCoordinates(therapist);
  const areaServed = buildAreaServed(therapist, cityLabel, geo);
  const offers = buildOfferList(therapist, localBusinessId, servicesList[0]);
  const aggregateRating = buildAggregateRating(therapist);
  const additionalProperty = buildAdditionalProperties(therapist);

  const websiteNode = {
    '@type': 'WebSite',
    '@id': WEBSITE_NODE_ID,
    url: SITE_URL,
    name: 'MasseurMatch',
    potentialAction: {
      '@type': 'SearchAction',
      target: SEARCH_ACTION_URL,
      'query-input': 'required name=search_term_string',
    },
  };

  const breadcrumbNode = {
    '@type': 'BreadcrumbList',
    '@id': breadcrumbId,
    itemListElement: breadcrumbItems,
  };

  const webpageNode = {
    '@type': ['WebPage', 'ProfilePage'],
    '@id': webpageId,
    url: profileUrl,
    name: pageTitle,
    description,
    isPartOf: { '@id': WEBSITE_NODE_ID },
    breadcrumb: { '@id': breadcrumbId },
    about: { '@id': localBusinessId },
    mainEntity: { '@id': localBusinessId },
  };

  const personNode: Record<string, unknown> = {
    '@type': 'Person',
    '@id': personId,
    name: displayName,
    url: profileUrl,
    worksFor: { '@id': localBusinessId },
  };
  if (images.length) personNode.image = images;
  if (therapist.phone) personNode.telephone = therapist.phone;
  if (sameAs.length) personNode.sameAs = sameAs;
  if (languages.length) personNode.knowsLanguage = languages;

  const localBusinessNode: Record<string, unknown> = {
    '@type': 'LocalBusiness',
    '@id': localBusinessId,
    name: displayName,
    url: profileUrl,
    description,
    serviceType: servicesList.length ? servicesList[0] : 'Massage',
  };
  if (images.length) localBusinessNode.image = images;
  if (therapist.phone) localBusinessNode.telephone = therapist.phone;
  if (therapist.email) localBusinessNode.email = therapist.email;
  if (therapist.rate_60) localBusinessNode.priceRange = therapist.rate_60;
  const address = buildAddress(therapist);
  if (address) localBusinessNode.address = address;
  if (geo) localBusinessNode.geo = geo;
  if (areaServed.length) localBusinessNode.areaServed = areaServed;
  if (aggregateRating) localBusinessNode.aggregateRating = aggregateRating;
  if (additionalProperty.length) localBusinessNode.additionalProperty = additionalProperty;
  if (offers.length) {
    localBusinessNode.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: 'Serviços e Rates',
      itemListElement: offers,
    };
  }

  return [websiteNode, breadcrumbNode, webpageNode, personNode, localBusinessNode];
}

function buildBreadcrumbItems(
  cityLabel: string | undefined,
  cityUrl: string | undefined,
  displayName: string,
  profileUrl: string
) {
  const items: Array<Record<string, unknown>> = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_URL,
    },
  ];
  let position = 1;
  if (cityLabel && cityUrl) {
    position += 1;
    items.push({
      '@type': 'ListItem',
      position,
      name: cityLabel,
      item: cityUrl,
    });
  }
  position += 1;
  items.push({
    '@type': 'ListItem',
    position,
    name: displayName,
    item: profileUrl,
  });
  return items;
}

function slugToName(slug?: string | null): string | undefined {
  if (!slug) return undefined;
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function collectImageUrls(therapist: TherapistRecord): string[] {
  const urls = new Set<string>();
  if (therapist.profile_photo) urls.add(therapist.profile_photo);
  if (Array.isArray(therapist.gallery)) {
    for (const entry of therapist.gallery) {
      if (typeof entry === 'string') {
        urls.add(entry);
      } else if (entry?.url) {
        urls.add(entry.url);
      }
    }
  }
  return Array.from(urls);
}

function toStringArray(value?: string[] | string | null): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function collectSameAs(therapist: TherapistRecord): string[] {
  const list: string[] = [];
  if (therapist.website) {
    const cleaned = ensureUrl(therapist.website);
    if (cleaned) list.push(cleaned);
  }
  if (therapist.instagram) {
    const handle = therapist.instagram.trim();
    if (handle) {
      if (handle.startsWith('http')) {
        list.push(handle);
      } else {
        const sanitized = handle.replace(/^@/, '').replace(/^\/+/, '');
        list.push(`https://instagram.com/${sanitized}`);
      }
    }
  }
  return Array.from(new Set(list));
}

function ensureUrl(raw: string): string | undefined {
  const value = raw.trim();
  if (!value) return undefined;
  if (value.startsWith('http')) return value;
  return `https://${value.replace(/^\/+/, '')}`;
}

function buildAddress(therapist: TherapistRecord): Record<string, unknown> | undefined {
  if (!therapist.city && !therapist.state && !therapist.address && !therapist.neighborhood) {
    return undefined;
  }
  return {
    '@type': 'PostalAddress',
    streetAddress: therapist.address || therapist.neighborhood || undefined,
    addressLocality: therapist.city || undefined,
    addressRegion: therapist.state || undefined,
    postalCode: therapist.zip_code || undefined,
    addressCountry: therapist.country || 'US',
  };
}

function buildGeoCoordinates(therapist: TherapistRecord) {
  const lat = therapist.latitude ? Number(therapist.latitude) : NaN;
  const lng = therapist.longitude ? Number(therapist.longitude) : NaN;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return undefined;
  }
  return {
    '@type': 'GeoCoordinates',
    latitude: lat,
    longitude: lng,
  };
}

function buildAreaServed(
  therapist: TherapistRecord,
  cityLabel: string | undefined,
  geo?: Record<string, unknown>
): Array<Record<string, unknown>> {
  const area: Array<Record<string, unknown>> = [];
  if (cityLabel) {
    area.push({
      '@type': 'City',
      name: cityLabel,
      address: {
        '@type': 'PostalAddress',
        addressLocality: therapist.city || undefined,
        addressRegion: therapist.state || undefined,
        addressCountry: therapist.country || 'US',
      },
    });
  }
  if (geo && typeof therapist.mobile_service_radius === 'number' && therapist.mobile_service_radius > 0) {
    area.push({
      '@type': 'GeoCircle',
      geoMidpoint: geo,
      geoRadius: {
        '@type': 'QuantitativeValue',
        value: therapist.mobile_service_radius,
        unitText: 'mi',
      },
    });
  }
  return area;
}

function buildOfferList(
  therapist: TherapistRecord,
  localBusinessId: string,
  serviceType: string | undefined
): Array<Record<string, unknown>> {
  const rates: Array<{ field: keyof TherapistRecord; label: string; duration?: string }> = [
    { field: 'rate_60', label: 'Swedish Massage — 60 min (Incall)', duration: 'PT60M' },
    { field: 'rate_90', label: 'Swedish Massage — 90 min (Incall)', duration: 'PT90M' },
    { field: 'rate_outcall', label: 'Outcall Session', duration: 'PT60M' },
  ];

  return rates
    .map((rate) => {
      const raw = therapist[rate.field];
      const price = typeof raw === 'string' ? raw.trim() : undefined;
      if (!price) return null;
      const itemOffered = {
        '@type': 'Service',
        name: rate.label,
        serviceType: serviceType || 'Massage Therapy',
        provider: { '@id': localBusinessId },
      };
      return {
        '@type': 'Offer',
        name: rate.label,
        price,
        priceCurrency: 'USD',
        eligibleDuration: rate.duration,
        itemOffered,
        availability: 'https://schema.org/InStock',
      };
    })
    .filter(Boolean) as Array<Record<string, unknown>>;
}

function buildAggregateRating(therapist: TherapistRecord) {
  const ratingValue = therapist.rating;
  const reviewCount = therapist.override_reviews_count;
  if (typeof ratingValue !== 'number' || !reviewCount) {
    return undefined;
  }
  return {
    '@type': 'AggregateRating',
    ratingValue,
    reviewCount,
    bestRating: 5,
    worstRating: 1,
  };
}

function buildAdditionalProperties(therapist: TherapistRecord): Array<Record<string, unknown>> {
  const properties: Array<Record<string, unknown>> = [];
  if (therapist.mobile_service_radius) {
    properties.push({
      '@type': 'PropertyValue',
      name: 'Mobile service radius',
      value: `${therapist.mobile_service_radius} miles`,
    });
  }
  if (therapist.services_headline) {
    properties.push({
      '@type': 'PropertyValue',
      name: 'Services headline',
      value: therapist.services_headline,
    });
  }
  return properties;
}
