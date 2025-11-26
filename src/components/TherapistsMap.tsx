"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

type Item = {
  id: string;
  location: string;
  photo: string | null;
  latitude: number;
  longitude: number;
};

export default function TherapistMap() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch("/api/therapists/map")
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  const createPhotoIcon = (url?: string | null) =>
    L.divIcon({
      html: `<div style="
          width: 45px;
          height: 45px;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid white;
          box-shadow: 0 0 8px rgba(0,0,0,0.4);
        ">
          <img src="${url ?? "/default-avatar.png"}" 
               style="width:100%;height:100%;object-fit:cover;" />
        </div>`,
      className: "",
      iconSize: [45, 45],
      iconAnchor: [22, 22],
    });

  return (
    <div style={{ height: "600px", width: "100%" }}>
      <MapContainer
        center={[-15.8, -47.9]}
        zoom={4}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {items.map((t) => (
          <Marker
            key={t.id}
            position={[t.latitude, t.longitude]}
            icon={createPhotoIcon(t.photo)}
          />
        ))}
      </MapContainer>
    </div>
  );
}
