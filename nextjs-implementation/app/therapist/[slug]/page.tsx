import { redirect, notFound } from 'next/navigation';
import { Metadata } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import { absUrl, stripHtml, truncate } from '@/lib/seo';
import TherapistProfile from '@/components/TherapistProfile';

export const revalidate = 3600; // Revalidate every hour

type Therapist = {
  user_id: string;
  slug: string;
  display_name: string;
  full_name: string;
  headline: string;
  about: string;
  city: string;
  state: string;
  services: string[];
  rating: number;
  phone: string;
  email: string;
  profile_photo?: string;
  gallery?: string[];
  massage_techniques?: string[];
  // Add all other fields from your therapists table
};

async function getTherapistBySlug(slug: string): Promise<{
  therapist: Therapist | null;
  canonicalSlug: string | null;
}> {
  // 1) Try current slug
  const { data: therapist } = await supabaseAdmin
    .from('therapists')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .maybeSingle();

  if (therapist) {
    return { therapist, canonicalSlug: therapist.slug };
  }

  // 2) Check slug redirects table (old slug → therapist_id)
  const { data: redirect } = await supabaseAdmin
    .from('therapist_slug_redirects')
    .select('therapist_id, old_slug')
    .eq('old_slug', slug)
    .maybeSingle();

  if (!redirect?.therapist_id) {
    return { therapist: null, canonicalSlug: null };
  }

  // 3) Get therapist by ID from redirect
  const { data: therapist2 } = await supabaseAdmin
    .from('therapists')
    .select('*')
    .eq('user_id', redirect.therapist_id)
    .eq('status', 'active')
    .maybeSingle();

  return {
    therapist: therapist2,
    canonicalSlug: therapist2?.slug ?? null,
  };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { therapist, canonicalSlug } = await getTherapistBySlug(params.slug);

  if (!therapist) {
    return {
      title: 'Therapist Not Found | MasseurMatch',
      robots: { index: false, follow: true },
    };
  }

  const canonicalPath = `/therapist/${canonicalSlug}`;
  const url = absUrl(canonicalPath);

  const title = `${therapist.display_name} – ${therapist.headline || 'Massage Therapist'} in ${therapist.city}${therapist.state ? `, ${therapist.state}` : ''} | MasseurMatch`;

  const description = truncate(
    stripHtml(therapist.headline || therapist.about || `Book ${therapist.display_name} in ${therapist.city}.`),
    160
  );

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'profile',
      images: therapist.profile_photo ? [therapist.profile_photo] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: therapist.profile_photo ? [therapist.profile_photo] : [],
    },
  };
}

export default async function TherapistPage({
  params,
}: {
  params: { slug: string };
}) {
  const { therapist, canonicalSlug } = await getTherapistBySlug(params.slug);

  if (!therapist) {
    notFound();
  }

  // Redirect to canonical slug if different
  if (canonicalSlug && canonicalSlug !== params.slug) {
    redirect(`/therapist/${canonicalSlug}`);
  }

  // Generate JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': absUrl(`/therapist/${therapist.slug}`),
    name: therapist.display_name,
    description: stripHtml(therapist.about || therapist.headline),
    url: absUrl(`/therapist/${therapist.slug}`),
    telephone: therapist.phone,
    email: therapist.email,
    image: therapist.profile_photo,
    priceRange: therapist.rate_60 || '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: therapist.city,
      addressRegion: therapist.state,
      addressCountry: therapist.country || 'US',
    },
    geo: therapist.latitude && therapist.longitude ? {
      '@type': 'GeoCoordinates',
      latitude: parseFloat(therapist.latitude),
      longitude: parseFloat(therapist.longitude),
    } : undefined,
    areaServed: {
      '@type': 'City',
      name: therapist.city,
    },
    aggregateRating: therapist.rating && therapist.override_reviews_count ? {
      '@type': 'AggregateRating',
      ratingValue: therapist.rating,
      reviewCount: therapist.override_reviews_count,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
    serviceType: therapist.services,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TherapistProfile therapist={therapist} />
    </>
  );
}

// Optional: Generate static params for top therapists
export async function generateStaticParams() {
  const { data: therapists } = await supabaseAdmin
    .from('therapists')
    .select('slug')
    .eq('status', 'active')
    .limit(100); // Generate top 100 at build time

  return (therapists || []).map((t) => ({
    slug: t.slug,
  }));
}
