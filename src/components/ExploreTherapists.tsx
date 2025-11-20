"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase"; // ajuste se o seu caminho for diferente
import styles from "./ExploreTherapists.module.css";

type BadgeType = "verified" | "elite" | "pro";

type Therapist = {
  id: string;
  name: string;
  city: string;
  state: string;
  rating: number;
  ratingCount?: number;
  tags: string[];
  startingPriceUSD: number;
  photoUrl: string;
  badges?: BadgeType[];
};

function StarRow({ value }: { value: number }) {
  const stars = useMemo(() => {
    const full = Math.floor(value);
    const half = value - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return { full, half, empty };
  }, [value]);

  return (
    <div
      className={styles.stars}
      aria-label={`Rating ${value.toFixed(1)} out of 5`}
    >
      {Array.from({ length: stars.full }).map((_, i) => (
        <span key={`f${i}`} className={`${styles.star} ${styles["star--full"]}`}>
          ★
        </span>
      ))}
      {Array.from({ length: stars.half }).map((_, i) => (
        <span key={`h${i}`} className={`${styles.star} ${styles["star--half"]}`}>
          ★
        </span>
      ))}
      {Array.from({ length: stars.empty }).map((_, i) => (
        <span
          key={`e${i}`}
          className={`${styles.star} ${styles["star--empty"]}`}
        >
          ☆
        </span>
      ))}
      <span className={styles["stars__value"]}>{value.toFixed(1)}</span>
    </div>
  );
}

function Badge({ kind }: { kind: BadgeType }) {
  if (kind === "verified") {
    return (
      <span className={`${styles.badge} ${styles["badge--verified"]}`}>
        ✔ Verified
      </span>
    );
  }
  if (kind === "elite") {
    return (
      <span className={`${styles.badge} ${styles["badge--elite"]}`}>
        Elite
      </span>
    );
  }
  return (
    <span className={`${styles.badge} ${styles["badge--pro"]}`}>Pro</span>
  );
}

function TherapistCard({ t }: { t: Therapist }) {
  return (
    <article className={styles.card} role="listitem">
      <div className={styles["card__media"]}>
        <img src={t.photoUrl} alt={`${t.name} photo`} loading="lazy" />
        <div className={styles["card__badges"]}>
          {t.badges?.map((b) => (
            <Badge key={b} kind={b} />
          ))}
        </div>
      </div>

      <div className={styles["card__body"]}>
        <div className={styles["card__header"]}>
          <h3 className={styles["card__title"]}>{t.name}</h3>
          <div
            className={styles["card__location"]}
            title={`${t.city}, ${t.state}`}
          >
            <span className={styles.dot} aria-hidden />
            {t.city}, {t.state}
          </div>
        </div>

        <div className={styles["card__ratingrow"]}>
          <StarRow value={t.rating} />
          {typeof t.ratingCount === "number" && (
            <span className={styles["rating-count"]}>
              ({t.ratingCount})
            </span>
          )}
        </div>

        <div className={styles["card__tags"]}>
          {t.tags.map((tag) => (
            <span className={styles.tag} key={tag}>
              {tag}
            </span>
          ))}
        </div>

        <div className={styles["card__footer"]}>
          <div className={styles.price}>
            <span className={styles["price__label"]}>Starting at</span>
            <span className={styles["price__value"]}>
              ${t.startingPriceUSD.toLocaleString("en-US")}
            </span>
          </div>

          <Link
            href={`/therapist/${t.id}`}
            className={`${styles.btn} ${styles["btn--ghost"]}`}
            aria-label={`View ${t.name} profile`}
          >
            View Profile
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function ExploreTherapists() {
  const [query, setQuery] = useState("");
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTherapists() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("therapists")
          .select("user_id, display_name, location, services, profile_photo");

        if (error) throw error;

        const mapped: Therapist[] = (data || []).map((t: any) => {
          const [city = "", state = ""] = String(t.location || "").split("-");
          const tags = Array.isArray(t.services)
            ? t.services
            : typeof t.services === "string"
            ? t.services
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean)
            : [];

          return {
            id: t.user_id,
            name: t.display_name || "Unnamed Therapist",
            city: city.trim(),
            state: state.trim(),
            rating: 5,
            ratingCount: Math.floor(Math.random() * 100) + 1,
            tags,
            startingPriceUSD: 90 + Math.floor(Math.random() * 60),
            photoUrl:
              t.profile_photo ||
              "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?q=80&w=1600&auto=format&fit=crop",
            badges: ["verified"],
          };
        });

        setTherapists(mapped);
      } catch (e) {
        console.error("Erro ao carregar terapeutas:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchTherapists();
  }, []);

  const results = useMemo(() => {
    let list = therapists;
    if (showOnlyVerified) {
      list = list.filter((t) => t.badges?.includes("verified"));
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.city.toLowerCase().includes(q) ||
          t.tags.some((x) => x.toLowerCase().includes(q))
      );
    }
    return list;
  }, [therapists, query, showOnlyVerified]);

  if (loading) {
    return (
      <div className={styles.explore}>
        <section className={styles.pagehead}>
          <div className={styles.pagehead__left}>
            <h1 className={styles.pagehead__title}>Explore Therapists</h1>
          </div>
        </section>
        <div className={styles.empty} role="status">
          Loading therapists...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.explore}>
      <section className={styles.pagehead}>
        <div className={styles.pagehead__left}>
          <h1 className={styles.pagehead__title}>Explore Therapists</h1>

          <div className={styles.filters}>
            <button
              type="button"
              className={`${styles.btn} ${styles["btn--chip"]} ${
                showOnlyVerified ? styles["is-on"] : ""
              }`}
              onClick={() => setShowOnlyVerified((s) => !s)}
              aria-pressed={showOnlyVerified}
            >
              <span className={styles["chip-icon"]} aria-hidden>
                ⚙
              </span>
              Filters
            </button>

            <div className={styles.search}>
              <input
                className={styles.search__input}
                placeholder="Search by name, city, or modality..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search therapists"
              />
            </div>
          </div>
        </div>
      </section>

      <main className={styles.grid} role="list" aria-label="Therapists list">
        {results.map((t) => (
          <TherapistCard key={t.id} t={t} />
        ))}

        {results.length === 0 && (
          <div className={styles.empty} role="status">
            No results found. Try another search or remove filters.
          </div>
        )}
      </main>
    </div>
  );
}
