// app/layout.tsx
import type { Metadata } from "next";

// CSS GLOBAL
import "leaflet/dist/leaflet.css";
import "./globals.css";

// CSS do Projeto
import "@/src/components/TherapistProfile.css";
import "@/src/styles/edit-profile.css";

// Componentes Globais
import Header from "@/src/components/Header";
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
  "founder": {
    "@type": "Person",
    "name": "Segatti"
  },
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
  description: "Find verified gay massage and male massage therapists across the USA. LGBT-friendly wellness directory with licensed professionals in your city. Safe, discreet, inclusive.",
  keywords: ["gay massage", "male massage", "lgbt massage", "m4m massage", "gay massage therapist", "male bodywork", "gay spa", "lgbt wellness"],
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
        </ProfileProvider>
      </body>
    </html>
  );
}
