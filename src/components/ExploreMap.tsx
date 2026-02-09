"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import styles from "./ExploreTherapists.module.css";

type MapPoint = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

type ExploreMapProps = {
  points: MapPoint[];
};

export default function ExploreMap({ points }: ExploreMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

  useEffect(() => {
    if (!containerRef.current || mapRef.current || !token) return;

    mapboxgl.accessToken = token;
    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-98.5795, 39.8283],
      zoom: 3.2,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }));

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [token]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const bounds = new mapboxgl.LngLatBounds();

    points.forEach((point) => {
      const el = document.createElement("button");
      el.className = styles.mapMarker;
      el.type = "button";
      el.title = point.name;

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([point.lng, point.lat])
        .addTo(map);

      markersRef.current.push(marker);
      bounds.extend([point.lng, point.lat]);
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 60, maxZoom: 11, duration: 500 });
    }
  }, [points]);

  if (!token) {
    return (
      <div className={styles.mapFallback}>
        Map requires `NEXT_PUBLIC_MAPBOX_TOKEN`.
      </div>
    );
  }

  return <div ref={containerRef} className={styles.mapCanvas} />;
}
