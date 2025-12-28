import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { cityMap } from '@/data/cityMap';
import { segmentConfig } from '@/data/segmentConfig';
import { absUrl } from '@/lib/seo';
import CityLandingPage from '@/components/CityLandingPage';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; segment: string }>;
}): Promise<Metadata> {
  const { city: citySlug, segment } = await params;
  const city = cityMap[citySlug];
  const segmentData = segmentConfig[segment];

  if (!city || !segmentData) {
    return {
      title: 'Page Not Found | MasseurMatch',
      robots: { index: false, follow: true },
    };
  }

  const title = segmentData.titleTemplate(city.name, city.state);
  const description = segmentData.descriptionTemplate(city.name, city.state);
  const url = absUrl(`/city/${city.slug}/${segmentData.slug}`);

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

export default async function CitySegmentPage({
  params,
}: {
  params: Promise<{ city: string; segment: string }>;
}) {
  const { city: citySlug, segment } = await params;
  const city = cityMap[citySlug];
  const segmentData = segmentConfig[segment];

  if (!city || !segmentData) {
    notFound();
  }

  return <CityLandingPage city={city} slug={segment} />;
}
