import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { cityMap } from '@/data/cityMap';
import { absUrl } from '@/lib/seo';
import CityLandingPage from '@/components/CityLandingPage';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = cityMap[citySlug];

  if (!city) {
    return {
      title: 'City Not Found | MasseurMatch',
      robots: { index: false, follow: true },
    };
  }

  const title = `Massage Therapists in ${city.name}${city.state ? `, ${city.state}` : ''} | MasseurMatch`;
  const description = `Find professional massage therapists in ${city.name}${city.state ? `, ${city.state}` : ''}. Browse verified profiles, read reviews, and book appointments with local massage professionals.`;
  const url = absUrl(`/city/${city.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: citySlug } = await params;
  const city = cityMap[citySlug];

  if (!city) {
    notFound();
  }

  return <CityLandingPage city={city} slug={citySlug} />;
}
