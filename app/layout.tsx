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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MasseurMatch",
  "alternateName": "Masseur Match",
  "url": "https://www.masseurmatch.com",
  "logo": "https://www.masseurmatch.com/logo.png",
  "description": "Find real massage therapists. Connect with confidence.",
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
    "Bodywork"
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
  title: "MasseurMatch",
  description: "Find real massage therapists. Connect with confidence.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ProfileProvider>
          <Header />
          <main>{children}</main>
        </ProfileProvider>
      </body>
    </html>
  );
}
