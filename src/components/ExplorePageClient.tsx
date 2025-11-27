// src/components/ExplorePageClient.tsx
"use client";

import dynamic from "next/dynamic";

// Carrega o ExploreTherapists SOMENTE no client (Leaflet não roda no SSR)
const ExploreTherapists = dynamic(
  () => import("@/src/components/ExploreTherapists"),
  {
    ssr: false,
  }
);

export default function ExplorePageClient() {
  return <ExploreTherapists />;
}
