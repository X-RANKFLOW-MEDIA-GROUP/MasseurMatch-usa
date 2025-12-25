"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { TherapistCard, Preferences } from "./ai";
import styles from "./SwipeMode.module.css";

interface SwipeModeProps {
  preferences: Preferences | null;
  highlightTherapistId?: string | null;
  onHighlightConsumed?: () => void;
}

export default function SwipeMode({
  preferences,
  highlightTherapistId,
  onHighlightConsumed,
}: SwipeModeProps) {
  const [orderedTherapists, setOrderedTherapists] = useState<TherapistCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | "up" | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const isDraggingRef = useRef(false);

  const reorderDeck = useCallback((deck: TherapistCard[], highlightId?: string | null) => {
    if (!highlightId) return deck;
    const index = deck.findIndex((therapist) => therapist.id === highlightId);
    if (index <= 0) return deck;
    const clone = [...deck];
    const [highlighted] = clone.splice(index, 1);
    return [highlighted, ...clone];
  }, []);

  const fetchDeck = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("mode", "swipe");
      params.set("limit", "30");
      if (preferences?.location.lat) {
        params.set("lat", String(preferences.location.lat));
        params.set("lng", String(preferences.location.lng));
        params.set("radius", String(preferences.location.radius));
      }
      const response = await fetch(`/api/explore-ai/therapists?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Unable to load therapists");
      }
      const payload = (await response.json()) as { cards?: TherapistCard[] };
      const cards = payload.cards ?? [];
      setOrderedTherapists(cards);
      setCurrentIndex(0);
    } catch (err) {
      console.error(err);
      setError("It looks like the deck could not be loaded right now.");
    } finally {
      setLoading(false);
    }
  }, [preferences]);

  useEffect(() => {
    fetchDeck();
  }, [fetchDeck]);

  useEffect(() => {
    if (!highlightTherapistId) return;
    setOrderedTherapists((prev) => {
      const next = reorderDeck(prev, highlightTherapistId);
      return next;
    });
    setCurrentIndex(0);
    onHighlightConsumed?.();
  }, [highlightTherapistId, onHighlightConsumed, reorderDeck]);

  const trackSwipe = useCallback(async (therapist: TherapistCard, direction: "left" | "right" | "up") => {
    try {
      await fetch("/api/explore-ai/swipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          therapistId: therapist.id,
          direction,
          matchScore: therapist.matchScore,
          context: {
            specialties: therapist.specialties,
            services: therapist.services,
            mode: therapist.mode,
          },
        }),
      });
    } catch (error) {
      console.error("Swipe tracking failed", error);
    }
  }, []);

  const handleSwipe = (direction: "left" | "right" | "up") => {
    if (currentIndex >= orderedTherapists.length) return;

    setSwipeDirection(direction);

    setTimeout(() => {
      const therapist = orderedTherapists[currentIndex];
      if (direction === "right" || direction === "up") {
        const matches = JSON.parse(localStorage.getItem("masseurmatch_matches") || "[]");
        matches.push({
          ...therapist,
          likedAt: new Date().toISOString(),
          superLike: direction === "up",
        });
        localStorage.setItem("masseurmatch_matches", JSON.stringify(matches));
      }

      trackSwipe(therapist, direction);

      setCurrentIndex((prev) => prev + 1);
      setSwipeDirection(null);
    }, 300);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    startYRef.current = e.touches[0].clientY;
    isDraggingRef.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !cardRef.current) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - startXRef.current;
    const deltaY = currentY - startYRef.current;
    const rotation = deltaX * 0.1;
    cardRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)`;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !cardRef.current) return;
    const currentX = e.changedTouches[0].clientX;
    const currentY = e.changedTouches[0].clientY;
    const deltaX = currentX - startXRef.current;
    const deltaY = currentY - startYRef.current;
    isDraggingRef.current = false;
    cardRef.current.style.transform = "";
    const threshold = 100;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > threshold) {
        handleSwipe("right");
      } else if (deltaX < -threshold) {
        handleSwipe("left");
      }
    } else if (deltaY < -threshold) {
      handleSwipe("up");
    }
  };

  if (loading) {
    return (
      <div className={styles.swipeMode}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Finding your perfect matches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.swipeMode}>
        <div className={styles.emptyState}>
          <h2>Error</h2>
          <p>{error}</p>
          <button className={styles.buttonPrimary} onClick={fetchDeck}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (currentIndex >= orderedTherapists.length) {
    return (
      <div className={styles.swipeMode}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>✨</div>
          <h2>No More Profiles</h2>
          <p>Check back tomorrow or adjust your filters</p>
          <button className={styles.buttonPrimary} onClick={fetchDeck}>
            Refresh Deck
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className={styles.swipeMode}>
      <div className={styles.deckStack}>
        {orderedTherapists.slice(currentIndex, currentIndex + 3).map((therapist, index) => (
          <div
            key={therapist.id}
            className={`${styles.card} ${index === 0 ? styles.cardActive : ""} ${
              swipeDirection
                ? styles[`swipe${swipeDirection.charAt(0).toUpperCase() + swipeDirection.slice(1)}`]
                : ""
            }`}
            style={{
              zIndex: 10 - index,
              transform: `scale(${1 - index * 0.05}) translateY(${index * -10}px)`,
              opacity: 1 - index * 0.3,
            }}
            ref={index === 0 ? cardRef : null}
            onTouchStart={index === 0 ? handleTouchStart : undefined}
            onTouchMove={index === 0 ? handleTouchMove : undefined}
            onTouchEnd={index === 0 ? handleTouchEnd : undefined}
          >
            {index === 0 && (
              <>
                <div className={styles.cardPhoto} style={{ backgroundImage: `url(${therapist.photoUrl})` }}>
                  <div className={styles.matchBadge}>
                    <div className={styles.matchScore}>{therapist.matchScore}%</div>
                    <div className={styles.matchLabel}>Match</div>
                  </div>
                </div>
                <div className={styles.cardInfo}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h2 className={styles.cardName}>{therapist.name}</h2>
                      <div className={styles.cardMeta}>
                        <span className={styles.distance}>{therapist.distance.toFixed(1)}km away</span>
                        <span className={styles.rating}>
                          ⭐ {therapist.rating} ({therapist.reviewCount})
                        </span>
                      </div>
                    </div>
                    {therapist.verified && <div className={styles.verifiedBadge}>Verified</div>}
                  </div>
                  <div className={styles.tags}>
                    {therapist.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className={styles.bio}>{therapist.bio}</p>
                  <div className={styles.price}>
                    <span className={styles.priceAmount}>{therapist.priceLabel}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <div className={styles.actions}>
        <button
          className={`${styles.actionButton} ${styles.buttonNope}`}
          onClick={() => handleSwipe("left")}
          title="Pass"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <button
          className={`${styles.actionButton} ${styles.buttonSuperLike}`}
          onClick={() => handleSwipe("up")}
          title="Super Like"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12,2 15,10 23,10 17,15 19,23 12,18 5,23 7,15 1,10 9,10" />
          </svg>
        </button>
        <button
          className={`${styles.actionButton} ${styles.buttonLike}`}
          onClick={() => handleSwipe("right")}
          title="Like"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>
      <div className={styles.counter}>
        {currentIndex + 1} / {orderedTherapists.length}
      </div>
    </div>
  );
}
