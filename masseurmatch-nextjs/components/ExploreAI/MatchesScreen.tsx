"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./MatchesScreen.module.css";

interface Match {
  id: string;
  name: string;
  age?: number;
  distance: number;
  rating: number;
  matchScore: number;
  tags: string[];
  photoUrl: string;
  price: number;
  likedAt: string;
  superLike: boolean;
  lastAvailable?: string;
}

export default function MatchesScreen() {
  const [matches, setMatches] = useState<Match[]>(() => {
    const savedMatches = typeof window !== "undefined" ? localStorage.getItem("masseurmatch_matches") : null;
    return savedMatches ? JSON.parse(savedMatches) : [];
  });
  const [sortBy, setSortBy] = useState<"recent" | "match" | "distance">("match");

  const sortedMatches = [...matches].sort((a, b) => {
    switch (sortBy) {
      case "match":
        return b.matchScore - a.matchScore;
      case "distance":
        return a.distance - b.distance;
      case "recent":
        return new Date(b.likedAt).getTime() - new Date(a.likedAt).getTime();
      default:
        return 0;
    }
  });

  const removeMatch = (id: string) => {
    const updated = matches.filter((m) => m.id !== id);
    setMatches(updated);
    localStorage.setItem("masseurmatch_matches", JSON.stringify(updated));
  };

  if (matches.length === 0) {
    return (
      <div className={styles.matchesScreen}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>MM</div>
          <h2>No Matches Yet</h2>
          <p>Start swiping to find your perfect massage therapist</p>
          <Link href="/explore-ai" className={styles.buttonPrimary}>
            Start Swiping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.matchesScreen}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          Your Matches <span className={styles.count}>({matches.length})</span>
        </h1>
        <div className={styles.sortButtons}>
          <button
            className={`${styles.sortButton} ${sortBy === "match" ? styles.sortButtonActive : ""}`}
            onClick={() => setSortBy("match")}
          >
            Best Match
          </button>
          <button
            className={`${styles.sortButton} ${sortBy === "distance" ? styles.sortButtonActive : ""}`}
            onClick={() => setSortBy("distance")}
          >
            Nearest
          </button>
          <button
            className={`${styles.sortButton} ${sortBy === "recent" ? styles.sortButtonActive : ""}`}
            onClick={() => setSortBy("recent")}
          >
            Recent
          </button>
        </div>
      </div>

      {/* Matches list */}
      <div className={styles.matchesList}>
        {sortedMatches.map((match) => (
          <div key={match.id} className={styles.matchCard}>
            {/* Photo */}
            <div className={styles.photo} style={{ backgroundImage: `url(${match.photoUrl})` }}>
              {match.superLike && <div className={styles.superLikeBadge}>⭐</div>}
              <div className={styles.matchBadge}>{match.matchScore}%</div>
            </div>

            {/* Info */}
            <div className={styles.info}>
              <h3 className={styles.name}>
                {match.name}
                {match.age && <span className={styles.age}>, {match.age}</span>}
              </h3>
              <div className={styles.meta}>
                <span className={styles.distance}>{match.distance}km away</span>
                <span className={styles.rating}>⭐ {match.rating}</span>
                <span className={styles.price}>${match.price}/hr</span>
              </div>
              <div className={styles.tags}>
                {match.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
              {match.lastAvailable && (
                <div className={styles.availability}>Available: {match.lastAvailable}</div>
              )}
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <Link href={`/therapist/${match.id}`} className={styles.buttonView}>
                View
              </Link>
              <button className={styles.buttonMessage} title="Send message">
                💬
              </button>
              <button className={styles.buttonRemove} onClick={() => removeMatch(match.id)} title="Remove">
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
