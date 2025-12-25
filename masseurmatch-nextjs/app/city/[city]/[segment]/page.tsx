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
  params: { city: string; segment: string };
}): Promise<Metadata> {
  const city = cityMap[params.city];
  const segment = segmentConfig[params.segment];

  if (!city || !segment) {
    return {
      title: 'Page Not Found | MasseurMatch',
      robots: { index: false, follow: true },
    };
  }

  const title = segment.titleTemplate(city.name, city.state);
  const description = segment.descriptionTemplate(city.name, city.state);
  const url = absUrl(`/city/${city.slug}/${segment.slug}`);

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
  params: { city: string; segment: string };
}) {
  const city = cityMap[params.city];
  const segment = segmentConfig[params.segment];

  if (!city || !segment) {
    notFound();
  }

  return <CityLandingPage city={city} slug={params.segment} />;
}

// Generate static params for all city + segment combinations
export async function generateStaticParams() {
  const cities = Object.keys(cityMap);
  const segments = Object.keys(segmentConfig);

  const params: { city: string; segment: string }[] = [];

  for (const city of cities) {
    for (const segment of segments) {
      params.push({ city, segment });
    }
  }

  return params;
}
