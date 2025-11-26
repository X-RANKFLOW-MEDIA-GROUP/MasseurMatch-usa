// app/layout.tsx
import type { Metadata } from "next";

// 🔥 CSS GLOBAL — ordem importa
import "leaflet/dist/leaflet.css";   // obrigatório para o mapa
import "./globals.css";

// 🔥 CSS do Projeto
import "@/src/components/TherapistProfile.css";
import "@/src/styles/edit-profile.css";

// 🔥 Componentes Globais
import Header from "@/src/components/Header";
import { ProfileProvider } from "@/src/context/ProfileContext";

export const metadata: Metadata = {
  title: "MasseurMatch",
  description: "Find real massage therapists. Connect with confidence.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* 
        suppressHydrationWarning:
        Evita erros ao misturar componentes server/client com dados dinâmicos.
      */}
      <body suppressHydrationWarning={true}>
        <ProfileProvider>
          {/* Header global do site */}
          <Header />

          {/* Conteúdo das páginas */}
          <main>{children}</main>
        </ProfileProvider>
      </body>
    </html>
  );
}
