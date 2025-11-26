// src/components/TherapistsMap.tsx
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "../lib/supabase";
import "leaflet/dist/leaflet.css";

// Carrega react-leaflet só no client (evita window is not defined)
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);

// Leaflet “puro” para criar o ícone com foto
let L: any = null;
if (typeof window !== "undefined") {
  // só carrega no browser
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  L = require("leaflet");
}

type MarkerData = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  photoUrl: string;
};

function createAvatarIcon(photoUrl: string) {
  if (!L) return undefined as any;

  return L.divIcon({
    className: "therapist-avatar-marker",
    html: `<img src="${photoUrl}" alt="" />`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

export default function TherapistsMap() {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [loading, setLoading] = useState(true);

  // centro padrão (Atlanta)
  const [center, setCenter] = useState<[number, number]>([33.749, -84.388]);
  const [zoom, setZoom] = useState(10);

  // Tenta pegar a localização do usuário para centralizar o mapa
  useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter([pos.coords.latitude, pos.coords.longitude]);
        setZoom(11);
      },
      () => {
        // se o usuário negar a permissão, fica no centro padrão mesmo
      }
    );
  }, []);

  // Carrega terapeutas com latitude/longitude
  useEffect(() => {
    async function fetchMarkers() {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("therapists")
          .select("user_id, display_name, profile_photo, latitude, longitude");

        if (error) throw error;

        const mapped: MarkerData[] =
          (data || [])
            .filter(
              (t: any) =>
                typeof t.latitude === "number" &&
                typeof t.longitude === "number"
            )
            .map((t: any) => ({
              id: t.user_id,
              name: t.display_name || "Therapist",
              lat: t.latitude,
              lng: t.longitude,
              photoUrl:
                t.profile_photo ||
                "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop",
            }));

        setMarkers(mapped);

        // Se tiver pelo menos 1 terapeuta, recentra o mapa na região dele
        if (mapped.length > 0) {
          const first = mapped[0];
          setCenter([first.lat, first.lng]);
          setZoom(11);
        }
      } catch (e) {
        console.error("Erro ao carregar marcadores do mapa:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchMarkers();
  }, []);

  return (
    <div className="therapists-map-wrapper">
      {/* overlay de loading */}
      {loading && (
        <div className="therapists-map-loading">
          Loading map...
        </div>
      )}

      {/* mapa em si */}
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="therapists-map"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {markers.map((m) => (
          <Marker
            key={m.id}
            position={[m.lat, m.lng]}
            icon={createAvatarIcon(m.photoUrl)}
          />
        ))}
      </MapContainer>

      {/* texto caso ninguém tenha localização cadastrada */}
      {!loading && markers.length === 0 && (
        <div className="therapists-map-empty">
          No therapists with location yet.
        </div>
      )}
    </div>
  );
}
