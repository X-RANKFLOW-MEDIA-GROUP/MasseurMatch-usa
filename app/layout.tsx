// app/layout.tsx
import type { Metadata } from "next";

const noIndex = process.env.NEXT_PUBLIC_NO_INDEX === "true";

// 🔥 CSS GLOBAL — ordem importa
import "leaflet/dist/leaflet.css";   // obrigatório para o mapa
import "./global.css";              // estilos globais do projeto

// Componentes Globais
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { ProfileProvider } from "@/src/context/ProfileContext";

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MasseurMatch",
  "alternateName": "Masseur Match",
  "url": "https://www.masseurmatch.com",
  "logo": "https://www.masseurmatch.com/logo.png",
  "description": "Find verified gay massage and male massage therapists across the USA. LGBT-friendly wellness directory.",
  "foundingDate": "2024",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "support@masseurmatch.com",
    "availableLanguage": ["English", "Portuguese"]
  },
  "areaServed": {
    "@type": "Country",
    "name": "United States"
  },
  "knowsAbout": [
    "Massage Therapy",
    "Gay Massage",
    "Male Massage",
    "LGBT Wellness",
    "Bodywork",
    "M4M Massage",
    "Gay-Friendly Massage"
  ],
  "sameAs": [
    "https://www.instagram.com/masseurmatch",
    "https://www.facebook.com/masseurmatch",
    "https://twitter.com/masseurmatch",
    "https://www.tiktok.com/@masseurmatch",
    "https://www.linkedin.com/company/masseurmatch"
  ]
};

export const metadata: Metadata = {
  title: "MasseurMatch | Gay Massage & Male Massage Therapist Directory USA",
  description:
    "Find verified gay massage and male massage therapists across the USA. LGBT-friendly wellness directory with licensed professionals in your city. Safe, discreet, inclusive.",
  keywords: [
    "gay massage",
    "male massage",
    "lgbt massage",
    "m4m massage",
    "gay massage therapist",
    "male bodywork",
    "gay spa",
    "lgbt wellness"
  ],
  metadataBase: new URL('https://www.masseurmatch.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.masseurmatch.com',
    siteName: 'MasseurMatch',
    title: 'MasseurMatch | Gay Massage & Male Massage Therapist Directory',
    description: 'Find verified gay massage and male massage therapists across the USA. LGBT-friendly wellness directory with licensed professionals.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MasseurMatch - LGBT-Friendly Massage Therapist Directory',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@masseurmatch',
    creator: '@masseurmatch',
    title: 'MasseurMatch | Gay Massage & Male Massage Therapist Directory',
    description: 'Find verified gay massage and male massage therapists across the USA. LGBT-friendly wellness directory.',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: !noIndex,
    follow: !noIndex,
    googleBot: {
      index: !noIndex,
      follow: !noIndex,
      'max-image-preview': noIndex ? 'none' : 'large',
      'max-snippet': noIndex ? 0 : -1,
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body suppressHydrationWarning={true}>
        <ProfileProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </ProfileProvider>
      </body>
    </html>
  );
}
