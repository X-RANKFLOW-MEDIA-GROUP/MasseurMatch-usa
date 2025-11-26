// app/layout.tsx
import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import "./globals.css";

import "@/src/components/TherapistProfile.css";
import "@/src/styles/edit-profile.css";

import Header from "@/src/components/Header";
import { ProfileProvider } from "@/src/context/ProfileContext";

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
