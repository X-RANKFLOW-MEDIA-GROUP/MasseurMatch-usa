"use client";

import { useEffect } from "react";
import type { MutableRefObject } from "react";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { StarRow } from "./StarRow";
import type { Therapist } from "./ExploreTherapists";
import styles from "./ExploreTherapists.module.css";

const iconCache = new Map<string, L.DivIcon>();

function createPhotoIcon(url: string) {
  if (iconCache.has(url)) {
    return iconCache.get(url)!;
  }

  const icon = L.divIcon({
    html: `<div style="
        width: 46px;
        height: 46px;
        border-radius: 8px;
        overflow: hidden;
        border: 2px solid white;
        box-shadow: 0 0 8px rgba(0,0,0,0.45);
      ">
        <img src="${url}" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>`,
    className: "",
    iconSize: [46, 46],
    iconAnchor: [23, 23],
  });

  iconCache.set(url, icon);
  return icon;
}

interface ExploreTherapistsMapProps {
  mapTherapists: Therapist[];
  mapCenter: [number, number];
  mapZoom: number;
  mapRef: MutableRefObject<L.Map | null>;
  setSelectedTherapist: (t: Therapist | null) => void;
}

export function ExploreTherapistsMap({
  mapTherapists,
  mapCenter,
  mapZoom,
  mapRef,
  setSelectedTherapist,
}: ExploreTherapistsMapProps) {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      style={{ width: "100%", height: "100%" }}
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {mapTherapists
        .filter((t) => typeof t.lat === "number" && typeof t.lng === "number")
        .map((t) => (
          <Marker
            key={t.id}
            position={[t.lat!, t.lng!]}
            icon={createPhotoIcon(t.photoUrl)}
            eventHandlers={{
              click: () => {
                setSelectedTherapist(t);
              },
            }}
          >
            <Popup>
              <div className={styles.mapPopup}>
                <img src={t.photoUrl} alt={t.name} className={styles.popupPhoto} />
                <div className={styles.popupContent}>
                  <h3 className={styles.popupName}>{t.name}</h3>
                  <div className={styles.popupLocation}>
                    {t.city}, {t.state}
                  </div>
                  <StarRow value={t.rating} />
                  <div className={styles.popupPrice}>
                    Starting at ${t.startingPriceUSD}
                  </div>
                  {typeof t.distanceMiles === "number" && (
                    <div className={styles.popupDistance}>
                      ~{t.distanceMiles.toFixed(1)} miles away
                    </div>
                  )}
                  <div className={styles.popupTags}>
                    {t.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className={styles.popupTag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link href={`/therapist/${t.id}`} className={styles.popupButton}>
                    View Profile
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
