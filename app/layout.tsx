// app/layout.tsx
import type { Metadata } from "next";
import React from "react";
import { GeistSans } from "geist/font/sans";

import "./globals.css";
import "mapbox-gl/dist/mapbox-gl.css";

// MasseurMatch global styles
import "@/src/components/TherapistProfile.css";
import "@/src/styles/edit-profile.css";

import Header from "@/src/components/Header";
import { ProfileProvider } from "@/src/context/ProfileContext";

export const metadata: Metadata = {
  title: "MasseurMatch",
  description: "Find real massage therapists. Connect with confidence.",
};

const geistSans = GeistSans;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geistSans.variable}>
      {/* suppressHydrationWarning avoids errors caused by browser extensions */}
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.className} glass-theme`}
      >
        <ProfileProvider>
          <div className="glass-root">
            <Header />
            <main>{children}</main>
          </div>
        </ProfileProvider>
      </body>
    </html>
  );
}
