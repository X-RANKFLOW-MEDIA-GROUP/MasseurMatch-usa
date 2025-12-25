import type { Metadata } from "next";

// 🔥 CSS GLOBAL — ordem importa
import "leaflet/dist/leaflet.css";
import "@app/lega";

// 🔥 CSS do Projeto
import "@/components/TherapistProfile.css";

const noIndex = process.env.NEXT_PUBLIC_NO_INDEX === "true";

export const metadata: Metadata = {
  title: 'Legal Center | MasseurMatch',
  description: 'Terms, Privacy Policy, and Compliance Documents for MasseurMatch.',
  robots: {
    index: !noIndex,
    follow: !noIndex,
    googleBot: {
      index: !noIndex,
      follow: !noIndex,
      'max-video-preview': noIndex ? 0 : -1,
      'max-image-preview': noIndex ? 'none' : 'large',
      'max-snippet': noIndex ? 0 : -1,
    },
  },
  alternates: {
    canonical: 'https://masseurmatch.com/legal',
  },
  openGraph: {
    title: 'MasseurMatch Legal Center',
    description: 'Official legal policies, terms of service, and compliance information.',
    url: 'https://masseurmatch.com/legal',
    siteName: 'MasseurMatch',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MasseurMatch Legal Center',
    description: 'Official legal policies and terms.',
  },
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
