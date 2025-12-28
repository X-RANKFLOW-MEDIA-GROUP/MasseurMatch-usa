import { Metadata } from 'next';
import ComingSoonContent from '@/components/ComingSoon';

export const metadata: Metadata = {
  title: 'Coming Soon - MasseurMatch',
  description: 'MasseurMatch is launching soon! Connect with professional massage therapists in your area. Be the first to know when we launch. Sign up for early access and exclusive benefits.',
  keywords: [
    'massage therapist directory',
    'find massage therapist',
    'professional massage',
    'massage booking',
    'wellness directory',
    'therapeutic massage',
    'massage professionals',
  ],
  openGraph: {
    title: 'MasseurMatch - Coming Soon',
    description: 'Connect with professional massage therapists in your area. Launching soon with exclusive features for wellness professionals and clients.',
    type: 'website',
    url: 'https://masseurmatch.com/coming-soon',
    siteName: 'MasseurMatch',
    images: [
      {
        url: '/og-coming-soon.jpg',
        width: 1200,
        height: 630,
        alt: 'MasseurMatch - Coming Soon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MasseurMatch - Coming Soon',
    description: 'Connect with professional massage therapists. Launching soon!',
    images: ['/og-coming-soon.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://masseurmatch.com/coming-soon',
  },
};

export default function ComingSoonPage() {
  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'MasseurMatch Coming Soon',
    description: 'MasseurMatch is launching soon! Connect with professional massage therapists in your area.',
    url: 'https://masseurmatch.com/coming-soon',
    publisher: {
      '@type': 'Organization',
      name: 'MasseurMatch',
      url: 'https://masseurmatch.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://masseurmatch.com/logo.png',
      },
    },
    potentialAction: {
      '@type': 'RegisterAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://masseurmatch.com/coming-soon',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ComingSoonContent />
    </>
  );
}
