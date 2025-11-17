// app/layout.tsx
import type { Metadata } from "next";
import React from "react";

import "./globals.css";
import "@/src/components/TherapistProfile.css"; // estilos globais do profile

import Header from "@/src/components/Header";
import { ProfileProvider } from "@/src/context/ProfileContext";
import "@/src/styles/edit-profile.css";

  
export const metadata: Metadata = {
  title: "MasseurMatch",
  description: "Find real massage therapists. Connect with confidence.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ProfileProvider>
          <Header />
          <main>{children}</main>
        </ProfileProvider>
      </body>
    </html>
  );
}
