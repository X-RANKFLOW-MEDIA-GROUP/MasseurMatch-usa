"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./MapOverlay.module.css";
import { TherapistCard } from "./ai";

interface MapOverlayProps {
  onClose: () => void;
}

export default function MapOverlay({ onClose }: MapOverlayProps) {
  const [therapists, setTherapists] = useState<TherapistCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMap = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("mode", "map");
        params.set("limit", "20");
        const response = await fetch(`/api/explore-ai/therapists?${params.toString()}`);
        if (!response.ok) return;
        const payload = (await response.json()) as { cards?: TherapistCard[] };
        setTherapists(payload.cards ?? []);
      } catch (error) {
        console.error("Map load failed", error);
      } finally {
        setLoading(false);
      }
    };

    loadMap();
  }, []);

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h2>Map Overlay</h2>
            <p>See therapists pinned by distance and availability.</p>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            Close
          </button>
        </header>
        <div className={styles.mapShell}>
          <div className={styles.mapPlaceholder}>
            {loading ? "Loading map..." : "Map pins here"}
          </div>
          <section className={styles.pinList}>
            {therapists.map((therapist) => (
              <Link key={therapist.id} href={`/therapist/${therapist.slug ?? therapist.id}`} className={styles.pinItem}>
                <div>
                  <strong>{therapist.name}</strong>
                  <p>{therapist.distance.toFixed(1)}km | {therapist.mode}</p>
                </div>
                <span>{therapist.priceLabel}</span>
              </Link>
            ))}
            {therapists.length === 0 && !loading && (
              <div className={styles.emptyState}>No therapists to pin just yet.</div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
