import { redirect, notFound } from 'next/navigation';
import { Metadata } from 'next';
import { supabaseAdmin } from '@/server/supabaseAdmin';
import { absUrl, stripHtml, truncate } from '@/lib/seo';
import TherapistProfile from '@/components/TherapistProfile';
import { getTherapistBySlug } from './data';

export const revalidate = 3600; // Revalidate every hour

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
  return <TherapistProfile />;
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
