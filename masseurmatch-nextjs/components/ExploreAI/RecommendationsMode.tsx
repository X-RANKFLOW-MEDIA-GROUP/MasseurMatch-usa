"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import styles from "./RecommendationsMode.module.css";
import { TherapistCard, Preferences } from "./ai";

interface RecommendationsModeProps {
  preferences: Preferences | null;
  onSwipeThis?: (therapistId: string) => void;
}

export default function RecommendationsMode({ preferences, onSwipeThis }: RecommendationsModeProps) {
  const [recommendations, setRecommendations] = useState<TherapistCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("mode", "recommendations");
      params.set("limit", "8");
      if (preferences?.location.lat) {
        params.set("lat", String(preferences.location.lat));
        params.set("lng", String(preferences.location.lng));
        params.set("radius", String(preferences.location.radius));
      }
      const response = await fetch(`/api/explore-ai/therapists?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Unable to load recommendations right now");
      }
      const payload = (await response.json()) as { cards?: TherapistCard[] };
      setRecommendations(payload.cards ?? []);
    } catch (err) {
      console.error(err);
      setError("We could not refresh recommendations at this moment.");
    } finally {
      setLoading(false);
    }
  }, [preferences]);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  if (loading) {
    return (
      <div className={styles.recommendationsMode}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Curating recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.recommendationsMode}>
        <div className={styles.emptyState}>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button className={styles.buttonView} onClick={loadRecommendations}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.recommendationsMode}>
      <div className={styles.header}>
        <h1 className={styles.title}>Recommended For You</h1>
        <p className={styles.subtitle}>AI-curated based on your preferences</p>
      </div>

      <div className={styles.grid}>
        {recommendations.map((rec) => (
          <div key={rec.id} className={styles.card}>
            <div className={styles.cardPhoto} style={{ backgroundImage: `url(${rec.photoUrl})` }}>
              <div className={styles.matchBadge}>{rec.matchScore}% Match</div>
              {rec.verified && <div className={styles.verifiedBadge}>Verified</div>}
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardHeader}>
                <h3 className={styles.name}>{rec.name}</h3>
                <div className={styles.meta}>
                  <span className={styles.distance}>{rec.distance}km</span>
                  <span className={styles.rating}>⭐ {rec.rating} ({rec.reviewCount})</span>
                </div>
              </div>
              <div className={styles.tags}>
                {rec.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <p className={styles.bio}>{rec.bio}</p>
              <div className={styles.aiExplanation}>
                <div className={styles.aiIcon}>AI Insight</div>
                <p className={styles.aiText}>{rec.aiExplanation}</p>
              </div>
              <div className={styles.footer}>
                <div className={styles.price}>
                  <span className={styles.priceAmount}>{rec.priceLabel}</span>
                </div>
                <div className={styles.actions}>
                  <Link href={`/therapist/${rec.slug ?? rec.id}`} className={styles.buttonView}>
                    View Profile
                  </Link>
                  <button
                    className={styles.buttonSwipe}
                    onClick={() => onSwipeThis?.(rec.id)}
                    type="button"
                  >
                    Swipe this
                  </button>
                  <button className={styles.buttonLike} type="button" aria-label="Favorite">
                    Like
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
