import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { cityMap, CityInfo } from '@/data/cityMap';
import { absUrl } from '@/lib/seo';
import CityLandingPage from '@/components/CityLandingPage';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: { city: string };
}): Promise<Metadata> {
  const city = cityMap[params.city];

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
  params: { city: string };
}) {
  const city = cityMap[params.city];

  if (!city) {
    notFound();
  }

  return <CityLandingPage city={city} segment={null} />;
}

// Generate static params for all configured cities
export async function generateStaticParams() {
  return Object.keys(cityMap).map((citySlug) => ({
    city: citySlug,
  }));
}
