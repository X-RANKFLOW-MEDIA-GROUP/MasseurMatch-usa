"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "../lib/supabase";
import styles from "./ExploreTherapists.module.css";

type BadgeType = "verified" | "elite" | "pro";

type Therapist = {
  id: string;
  name: string;
  city: string;
  state: string;
  zipCode?: string;
  rating: number;
  ratingCount?: number;
  tags: string[];
  startingPriceUSD: number;
  photoUrl: string;
  badges?: BadgeType[];
};

/* ----------------------------------------------------------
   Função para resolver LOCATION em cidade/estado (ZIP/CEP)
----------------------------------------------------------- */
async function resolveLocation(rawLocation: unknown): Promise<{
  city: string;
  state: string;
}> {
  const loc = String(rawLocation || "").trim();

  if (!loc) return { city: "", state: "" };

  const cepRegexBR = /^\d{5}-?\d{3}$/;
  const zipRegexUSA = /^\d{5}(-\d{4})?$/;

  // Cidade-Estado
  if (loc.includes("-") && !cepRegexBR.test(loc) && !zipRegexUSA.test(loc)) {
    const [city = "", state = ""] = loc.split("-");
    return { city: city.trim(), state: state.trim() };
  }

  // ZIP EUA
  if (zipRegexUSA.test(loc)) {
    try {
      const res = await fetch(`https://api.zippopotam.us/us/${loc}`);
      if (res.ok) {
        const data: any = await res.json();
        const place = data?.places?.[0];
        return {
          city: place?.["place name"] ?? "",
          state: place?.["state abbreviation"] ?? "",
        };
      }
    } catch {
      // segue pro fallback abaixo
    }
    return { city: loc, state: "" };
  }

  // CEP Brasil
  if (cepRegexBR.test(loc)) {
    try {
      const sanitized = loc.replace("-", "");
      const res = await fetch(`https://viacep.com.br/ws/${sanitized}/json/`);
      const data: any = await res.json();
      if (!data.erro) {
        return { city: data.localidade ?? "", state: data.uf ?? "" };
      }
    } catch {
      // segue pro fallback abaixo
    }
    return { city: loc, state: "" };
  }

  // Qualquer outro texto é tratado como nome de cidade
  return { city: loc, state: "" };
}

/* ----------------------------------------------------------
   Estrelas
----------------------------------------------------------- */
function StarRow({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  return (
    <div className={styles.stars}>
      {Array.from({ length: full }).map((_, i) => (
        <span key={`f${i}`} className={`${styles.star} ${styles["star--full"]}`}>
          ★
        </span>
      ))}
      {Array.from({ length: half }).map((_, i) => (
        <span key={`h${i}`} className={`${styles.star} ${styles["star--half"]}`}>
          ★
        </span>
      ))}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`e${i}`} className={`${styles.star} ${styles["star--empty"]}`}>
          ☆
        </span>
      ))}
      <span className={styles["stars__value"]}>{value.toFixed(1)}</span>
    </div>
  );
}

/* ----------------------------------------------------------
   Badge
----------------------------------------------------------- */
function Badge({ kind }: { kind: BadgeType }) {
  const className =
    kind === "verified"
      ? "badge--verified"
      : kind === "elite"
      ? "badge--elite"
      : "badge--pro";

  const label =
    kind === "verified" ? "Verified" : kind === "elite" ? "Elite" : "Pro";

  return <span className={`${styles.badge} ${styles[className]}`}>{label}</span>;
}

/* ----------------------------------------------------------
   CARD
----------------------------------------------------------- */
function TherapistCard({ t }: { t: Therapist }) {
  return (
    <article className={styles.card} role="listitem">
      <div className={styles["card__media"]}>
        <img src={t.photoUrl} alt={`${t.name} photo`} />
        <div className={styles["card__badges"]}>
          {t.badges?.map((b) => (
            <Badge key={b} kind={b} />
          ))}
        </div>
      </div>

      <div className={styles["card__body"]}>
        <div className={styles["card__header"]}>
          <h3 className={styles["card__title"]}>{t.name}</h3>
          <div className={styles["card__location"]}>
            <span className={styles.dot} /> {t.city}
            {t.state ? `, ${t.state}` : ""}
          </div>
        </div>

        <div className={styles["card__ratingrow"]}>
          <StarRow value={t.rating} />
          {typeof t.ratingCount === "number" && (
            <span className={styles["rating-count"]}>({t.ratingCount})</span>
          )}
        </div>

        <div className={styles["card__tags"]}>
          {t.tags?.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        <div className={styles["card__footer"]}>
          <div className={styles.price}>
            <span className={styles.price__label}>Starting at</span>
            <span className={styles.price__value}>
              ${t.startingPriceUSD.toLocaleString("en-US")}
            </span>
          </div>

          <Link href={`/therapist/${t.id}`} className={styles["btn--ghost"]}>
            View Profile
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ----------------------------------------------------------
   PÁGINA PRINCIPAL
----------------------------------------------------------- */
export default function ExploreTherapists() {
  const searchParams = useSearchParams();
  const cityFilterParam = searchParams.get("city");

  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [query, setQuery] = useState("");
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);

  /* ------------------------ CARREGAR TERAPEUTAS ------------------------ */
  useEffect(() => {
    async function fetchTherapists() {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("therapists")
          .select(
            "user_id, display_name, location, services, profile_photo, zip_code"
          );

        if (error) throw error;

        const mapped: Therapist[] = await Promise.all(
          (data || []).map(async (t: any) => {
            const { city, state } = await resolveLocation(t.location);

            const tags = Array.isArray(t.services)
              ? t.services
              : t.services
              ? t.services
                  .split(",")
                  .map((s: string) => s.trim())
                  .filter(Boolean)
              : [];

            return {
              id: t.user_id,
              name: t.display_name || "Unnamed Therapist",
              city,
              state,
              zipCode: t.zip_code || undefined,
              tags,
              rating: 5,
              ratingCount: Math.floor(Math.random() * 100) + 1,
              startingPriceUSD: 100 + Math.floor(Math.random() * 40),
              photoUrl:
                t.profile_photo ||
                "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?q=80&w=1600&auto=format&fit=crop",
              badges: ["verified"],
            };
          })
        );

        setTherapists(mapped);
      } catch (e) {
        console.error("Erro ao carregar terapeutas:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchTherapists();
  }, []);

  /* ------------------------ FILTROS ------------------------ */
  const results = useMemo(() => {
    let list = therapists;

    if (cityFilterParam) {
      const target = cityFilterParam.toLowerCase();
      list = list.filter((t) => t.city.toLowerCase().includes(target));
    }

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
  }, [therapists, query, showOnlyVerified, cityFilterParam]);

  /* ------------------------ MAPA (MESMO ESTILO DO PERFIL) ------------------------ */
  const mapQuery = useMemo(() => {
    // 1) Se veio da home /cities?city=...
    if (cityFilterParam) return cityFilterParam;

    // 2) Se usuário digitou cidade/estado/ZIP no search
    if (query.trim()) return query.trim();

    // 3) Usa o primeiro terapeuta da lista como referência
    const first = results[0] || therapists[0];
    if (first) {
      const parts = [first.city, first.state].filter(Boolean);
      if (first.zipCode) parts.push(first.zipCode);
      const joined = parts.join(", ").trim();
      if (joined) return joined;
    }

    // 4) fallback genérico
    return "United States";
  }, [cityFilterParam, query, results, therapists]);

  const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    mapQuery
  )}&output=embed`;

  const mapDirectionsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mapQuery
  )}`;

  const pageTitle = cityFilterParam
    ? `Therapists in ${cityFilterParam}`
    : "Explore Therapists";

  /* ------------------------ LOADING ------------------------ */
  if (loading) {
    return (
      <div className={styles.explore}>
        <section className={styles.pagehead}>
          <div className={styles.pagehead__left}>
            <h1 className={styles.pagehead__title}>{pageTitle}</h1>
            <div className={styles.mapWrapper}>
              <div className={styles.mapLoading}>Loading map...</div>
            </div>
          </div>
        </section>
        <div className={styles.empty}>Loading therapists...</div>
      </div>
    );
  }

  /* ------------------------ RENDER ------------------------ */
  return (
    <div className={styles.explore}>
      <section className={styles.pagehead}>
        <div className={styles.pagehead__left}>
          <h1 className={styles.pagehead__title}>{pageTitle}</h1>

          {/* 🔥 MAPA NO MESMO ESTILO DO PERFIL */}
          <div className={styles.mapWrapper}>
            <iframe
              title="Therapists map"
              src={mapEmbedSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className={styles.mapFrame}
            />
            <div className={styles.mapToolbar}>
              <span className={styles.mapLabel}>Showing area: {mapQuery}</span>
              <a
                href={mapDirectionsHref}
                target="_blank"
                rel="noreferrer"
                className={styles.mapButton}
              >
                Open in Google Maps
              </a>
            </div>
          </div>

          {/* FILTROS */}
          <div className={styles.filters}>
            <button
              type="button"
              className={`${styles.btn} ${styles["btn--chip"]} ${
                showOnlyVerified ? styles["is-on"] : ""
              }`}
              onClick={() => setShowOnlyVerified((s) => !s)}
            >
              ⚙ Filters
            </button>

            <div className={styles.search}>
              <input
                className={styles.search__input}
                placeholder="Search by name, city, state, or ZIP..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* LISTA */}
      <main className={styles.grid} role="list" aria-label="Therapists list">
        {results.map((t) => (
          <TherapistCard key={t.id} t={t} />
        ))}

        {results.length === 0 && (
          <div className={styles.empty}>No results found.</div>
        )}
      </main>
    </div>
  );
}
