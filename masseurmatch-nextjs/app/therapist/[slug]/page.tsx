import { redirect, notFound } from 'next/navigation';
import { Metadata } from 'next';
import { absUrl, stripHtml, truncate } from '@/lib/seo';
import PublicTherapistProfile from '@/components/PublicTherapistProfile';
import { getTherapistBySlug, type TherapistRecord } from './data';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { therapist, canonicalSlug } = await getTherapistBySlug(slug);

  if (!therapist) {
    return {
      title: 'Therapist Not Found | MasseurMatch',
      robots: { index: false, follow: true },
    };
  }

  const canonicalPath = `/therapist/${canonicalSlug}`;
  const url = absUrl(canonicalPath);

  const title = `${therapist.display_name} - ${therapist.headline || 'Massage Therapist'} in ${therapist.city}${therapist.state ? `, ${therapist.state}` : ''} | MasseurMatch`;

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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { therapist, canonicalSlug } = await getTherapistBySlug(slug);

  if (!therapist) {
    notFound();
  }

  // Redirect to canonical slug if different
  if (canonicalSlug && canonicalSlug !== slug) {
    redirect(`/therapist/${canonicalSlug}`);
  }

  return <PublicTherapistProfile therapist={therapist} />;
}

