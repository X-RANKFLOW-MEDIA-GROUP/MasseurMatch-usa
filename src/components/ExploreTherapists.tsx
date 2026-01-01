// @ts-nocheck
"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../lib/supabase";
import styles from "./ExploreTherapists.module.css";

/* ====== Leaflet / React-Leaflet ====== */
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type BadgeType = "verified" | "elite" | "pro";

type Therapist = {
  id: string;
  slug?: string;
  name: string;
  city: string;
  state: string;
  zipCode?: string;
  neighborhood?: string;
  rating: number;
  ratingCount?: number;
  tags: string[];
  startingPriceUSD: number;
  photoUrl: string;
  badges?: BadgeType[];
  phone?: string;
  isHighestRated?: boolean;
  hasHighestReview?: boolean;
  isAvailable?: boolean;
  offersTravelService?: boolean;
  lat?: number;
  lng?: number;
  incall?: boolean;
  outcall?: boolean;
  isFeatured?: boolean;
  distanceMiles?: number;
};

type LatLng = { lat: number; lng: number };

function haversineMiles(a: LatLng, b: LatLng): number {
  const R = 3958.8; // miles
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

/* ----------------------------------------------------------
   Funcao para resolver LOCATION em cidade/estado + lat/lng
----------------------------------------------------------- */
async function resolveLocation(
  rawLocation: unknown
): Promise<{
  city: string;
  state: string;
  lat?: number;
  lng?: number;
}> {
  const loc = String(rawLocation || "").trim();

  if (!loc) return { city: "", state: "" };

  const cepRegexBR = /^\d{5}-?\d{3}$/;
  const zipRegexUSA = /^\d{5}(-\d{4})?$/;

  async function geocodeFreeText(query: string) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );
      const data: unknown[] = await res.json();
      if (data?.length) {
        return {
          lat: Number(data[0].lat),
          lng: Number(data[0].lon),
        };
      }
    } catch {
      // ignore
    }
    return { lat: undefined, lng: undefined };
  }

  if (loc.includes("-") && !cepRegexBR.test(loc) && !zipRegexUSA.test(loc)) {
    const [cityRaw = "", stateRaw = ""] = loc.split("-");
    const city = cityRaw.trim();
    const state = stateRaw.trim();

    const { lat, lng } = await geocodeFreeText(`${city}, ${state}`);
    return { city, state, lat, lng };
  }

  if (zipRegexUSA.test(loc)) {
    try {
      const res = await fetch(`https://api.zippopotam.us/us/${loc}`);
      if (res.ok) {
        const data: unknown = await res.json();
        const place = data?.places?.[0];

        const city = place?.["place name"] ?? "";
        const state = place?.["state abbreviation"] ?? "";
        const lat = place ? Number(place.latitude) : undefined;
        const lng = place ? Number(place.longitude) : undefined;

        return { city, state, lat, lng };
      }
    } catch {
      // fallback
    }
    const { lat, lng } = await geocodeFreeText(loc);
    return { city: loc, state: "", lat, lng };
  }

  if (cepRegexBR.test(loc)) {
    try {
      const sanitized = loc.replace("-", "");
      const res = await fetch(`https://viacep.com.br/ws/${sanitized}/json/`);
      const data: unknown = await res.json();

      if (!data.erro) {
        const city = data.localidade ?? "";
        const state = data.uf ?? "";

        const { lat, lng } = await geocodeFreeText(
          `${city}, ${state}, Brasil`
        );

        return { city, state, lat, lng };
      }
    } catch {
      // fallback
    }

    const { lat, lng } = await geocodeFreeText(loc);
    return { city: loc, state: "", lat, lng };
  }

  const { lat, lng } = await geocodeFreeText(loc);
  return { city: loc, state: "", lat, lng };
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
          {"\u2605"}
        </span>
      ))}
      {Array.from({ length: half }).map((_, i) => (
        <span key={`h${i}`} className={`${styles.star} ${styles["star--half"]}`}>
          {"\u2727"}
        </span>
      ))}
      {Array.from({ length: empty }).map((_, i) => (
        <span
          key={`e${i}`}
          className={`${styles.star} ${styles["star--empty"]}`}
        >
          {"\u2606"}
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
          {t.isHighestRated && (
            <span className={`${styles.badge} ${styles["badge--elite"]}`} title="Highest Rated">
              {"\u2605"} Top Rated
            </span>
          )}
          {t.hasHighestReview && (
            <span className={`${styles.badge} ${styles["badge--pro"]}`} title="Most Reviews">
              Most Reviews
            </span>
          )}
        </div>
      </div>

      <div className={styles["card__body"]}>
        <div className={styles["card__header"]}>
          <h3 className={styles["card__title"]}>{t.name}</h3>
          <div className={styles["card__location"]}>
            <span className={styles.dot} />
            {t.neighborhood && t.neighborhood !== t.city ? (
              <>
                {t.neighborhood}, {t.city}
                {t.state ? `, ${t.state}` : ""}
              </>
            ) : (
              <>
                {t.city}
                {t.state ? `, ${t.state}` : ""}
              </>
            )}
          </div>
        </div>

        <div className={styles["card__ratingrow"]}>
          <StarRow value={t.rating} />
          {typeof t.ratingCount === "number" && (
            <span className={styles["rating-count"]}>({t.ratingCount})</span>
          )}
        </div>

        <div className={styles["card__status"]}>
          {t.isAvailable && (
            <span className={styles["status-badge"]} style={{ background: "#22c55e", color: "white" }}>
              Available now
            </span>
          )}
          {t.offersTravelService && (
            <span className={styles["status-badge"]} style={{ background: "#3b82f6", color: "white" }}>
              Travels
            </span>
          )}
          {t.outcall && (
            <span className={styles["status-badge"]} style={{ background: "#ea580c", color: "white" }}>
              Outcall
            </span>
          )}
          {t.incall && (
            <span className={styles["status-badge"]} style={{ background: "#6366f1", color: "white" }}>
              Incall
            </span>
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
            {typeof t.distanceMiles === "number" && (
              <span className={styles.distance}>~{t.distanceMiles.toFixed(1)} mi</span>
            )}
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            {t.phone && (
              <a
                href={`https://wa.me/${t.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className={styles["btn--primary"]}
                style={{ fontSize: "14px", padding: "8px 12px" }}
              >
                Text now
              </a>
            )}
            <Link href={`/therapist/${t.id}`} className={styles["btn--ghost"]}>
              View profile
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function createPhotoIcon(url: string) {
  return L.divIcon({
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
}

/* ----------------------------------------------------------
   PAGINA PRINCIPAL
----------------------------------------------------------- */
export default function ExploreTherapists() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapCollapsed, setMapCollapsed] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [showMap, setShowMap] = useState(true);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [geoStatus, setGeoStatus] = useState<"idle" | "locating" | "error" | "denied">("idle");
  const [geoError, setGeoError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const [radius, setRadius] = useState(25);
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [filterIncall, setFilterIncall] = useState(false);
  const [filterOutcall, setFilterOutcall] = useState(false);
  const [priceMin, setPriceMin] = useState(80);
  const [priceMax, setPriceMax] = useState(250);
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterFeatured, setFilterFeatured] = useState(false);
  const [filterOffers, setFilterOffers] = useState(false);
  const [sortKey, setSortKey] = useState<"distance" | "availability" | "featured" | "price" | "rating">(
    "distance"
  );

  const allowedSorts = new Set(["distance", "availability", "featured", "price", "rating"]);

  useEffect(() => {
    if (!searchParams) return;

    const r = Number(searchParams.get("radius"));
    if (!Number.isNaN(r) && r > 0) setRadius(r);

    const pmin = Number(searchParams.get("pmin"));
    const pmax = Number(searchParams.get("pmax"));
    if (!Number.isNaN(pmin)) setPriceMin(pmin);
    if (!Number.isNaN(pmax)) setPriceMax(pmax);

    setFilterAvailable(searchParams.get("avail") === "1");
    setFilterIncall(searchParams.get("incall") === "1");
    setFilterOutcall(searchParams.get("outcall") === "1");
    setFilterVerified(searchParams.get("ver") === "1");
    setFilterFeatured(searchParams.get("feat") === "1");
    setFilterOffers(searchParams.get("offer") === "1");

    const sortParam = searchParams.get("sort");
    if (sortParam && allowedSorts.has(sortParam)) {
      setSortKey(sortParam as any);
    }

    const mapParam = searchParams.get("map");
    setShowMap(mapParam !== "0");
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("radius", String(radius));
    params.set("pmin", String(priceMin));
    params.set("pmax", String(priceMax));
    params.set("sort", sortKey);
    params.set("map", showMap ? "1" : "0");

    const setBool = (key: string, value: boolean) => {
      if (value) params.set(key, "1");
      else params.delete(key);
    };

    setBool("avail", filterAvailable);
    setBool("incall", filterIncall);
    setBool("outcall", filterOutcall);
    setBool("ver", filterVerified);
    setBool("feat", filterFeatured);
    setBool("offer", filterOffers);

    router.replace(`${pathname}?${params.toString()}`);
  }, [
    radius,
    priceMin,
    priceMax,
    sortKey,
    showMap,
    filterAvailable,
    filterIncall,
    filterOutcall,
    filterVerified,
    filterFeatured,
    filterOffers,
    router,
    pathname,
    searchParams,
  ]);

  useEffect(() => {
    setVisibleCount(12);
  }, [
    radius,
    filterAvailable,
    filterIncall,
    filterOutcall,
    priceMin,
    priceMax,
    filterVerified,
    filterFeatured,
    filterOffers,
    sortKey,
    userLocation,
  ]);

  const handleUseMyLocation = async () => {
    if (geoStatus === "locating") return;

    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setGeoStatus("error");
      setGeoError("Your browser does not allow geolocation.");
      return;
    }

    setGeoStatus("locating");
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserLocation({ lat: coords.latitude, lng: coords.longitude });
        setGeoStatus("idle");
      },
      (err) => {
        const denied = err.code === err.PERMISSION_DENIED;
        setGeoStatus(denied ? "denied" : "error");
        setGeoError(
          denied
            ? "Permission denied. You can still browse without distance sorting."
            : "Could not collect your location. Try again."
        );
      },
      { enableHighAccuracy: false, timeout: 7000, maximumAge: 300000 }
    );
  };

  useEffect(() => {
    async function fetchTherapists() {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("therapists")
          .select(`
            user_id,
            slug,
            display_name,
            location,
            services,
            profile_photo,
            zip_code,
            phone,
            status,
            rating,
            rating_count,
            is_highest_rated,
            has_highest_review,
            is_featured,
            is_available,
            incall_available,
            outcall_available,
            starting_price_usd
          `)
          .eq("status", "approved")
          .order("is_featured", { ascending: false })
          .order("rating", { ascending: false })
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching therapists:", error);
          throw new Error("Failed to load therapists. Please try again later.");
        }

        const mapped: Therapist[] = await Promise.all(
          (data || []).map(async (t: unknown, index: number, array: unknown[]) => {
            const { city, state, lat, lng } = await resolveLocation(t.location);

            const tags = Array.isArray(t.services)
              ? t.services
              : t.services
              ? t.services
                  .split(",")
                  .map((s: string) => s.trim())
                  .filter(Boolean)
              : [];

            // Use real database values with fallbacks
            const ratingCount = t.rating_count ?? 0;
            const rating = t.rating ?? 0;
            const isHighestRated = t.is_highest_rated ?? false;
            const hasHighestReview = t.has_highest_review ?? false;
            const isFeatured = t.is_featured ?? false;

            const offersTravelService = tags.some((tag: string) =>
              tag.toLowerCase().includes("mobile") ||
              tag.toLowerCase().includes("travel")
            );

            // Use real database availability with intelligent fallbacks
            const incall = t.incall_available ?? true;
            const outcall = t.outcall_available ?? offersTravelService;

            return {
              id: t.slug || t.user_id,
              slug: t.slug || undefined,
              name: t.display_name || "Unnamed Therapist",
              city,
              state,
              zipCode: t.zip_code || undefined,
              neighborhood: city,
              tags,
              rating,
              ratingCount,
              // Use real pricing from database with fallback
              startingPriceUSD: t.starting_price_usd ?? 100,
              photoUrl:
                t.profile_photo ||
                "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?q=80&w=1600&auto=format&fit=crop",
              badges: ["verified"],
              phone: t.phone || undefined,
              isHighestRated,
              hasHighestReview,
              // Use real availability from database with fallback
              isAvailable: t.is_available ?? true,
              offersTravelService,
              lat,
              lng,
              incall,
              outcall,
              isFeatured,
            };
          })
        );

        setTherapists(mapped);
      } catch (e) {
        console.error("Erro ao carregar terapeutas:", e);
        setTherapists([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTherapists();
  }, []);

  useEffect(() => {
    if (therapists.length === 0) return;
    const id = setInterval(() => {
      setHeroIndex((idx) => (idx + 1) % Math.max(therapists.length, 1));
    }, 5200);
    return () => clearInterval(id);
  }, [therapists.length]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const obs = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setVisibleCount((prev) => prev + 8);
      }
    });

    obs.observe(el);
    return () => obs.disconnect();
  }, [sentinelRef]);

  const heroTherapists = useMemo(() => {
    const sorted = [...therapists].sort(
      (a, b) => (b.ratingCount ?? 0) - (a.ratingCount ?? 0)
    );
    return sorted.slice(0, 5);
  }, [therapists]);

  const activeHero =
    heroTherapists.length > 0
      ? heroTherapists[heroIndex % heroTherapists.length]
      : null;

  const enrichedTherapists = useMemo(() => {
    return therapists.map((t) => {
      const distanceMiles =
        userLocation && typeof t.lat === "number" && typeof t.lng === "number"
          ? haversineMiles(userLocation, { lat: t.lat, lng: t.lng })
          : undefined;
      return { ...t, distanceMiles };
    });
  }, [therapists, userLocation]);

  const filtered = useMemo(() => {
    let list = enrichedTherapists;

    if (filterAvailable) {
      list = list.filter((t) => t.isAvailable);
    }

    if (filterIncall) {
      list = list.filter((t) => t.incall);
    }

    if (filterOutcall) {
      list = list.filter((t) => t.outcall);
    }

    if (filterVerified) {
      list = list.filter((t) => t.badges?.includes("verified"));
    }

    if (filterFeatured) {
      list = list.filter((t) => t.isFeatured);
    }

    if (filterOffers) {
      list = list.filter((t) => t.offersTravelService);
    }

    list = list.filter(
      (t) => t.startingPriceUSD >= priceMin && t.startingPriceUSD <= priceMax
    );

    if (userLocation && radius > 0) {
      list = list.filter(
        (t) =>
          typeof t.distanceMiles === "number" &&
          t.distanceMiles <= radius
      );
    }

    return list;
  }, [
    enrichedTherapists,
    filterAvailable,
    filterIncall,
    filterOutcall,
    filterVerified,
    filterFeatured,
    filterOffers,
    priceMin,
    priceMax,
    userLocation,
    radius,
  ]);

  const sorted = useMemo(() => {
    const list = [...filtered];

    const byDistance = (a: Therapist, b: Therapist) => {
      const da = typeof a.distanceMiles === "number" ? a.distanceMiles : Infinity;
      const db = typeof b.distanceMiles === "number" ? b.distanceMiles : Infinity;
      return da - db;
    };

    switch (sortKey) {
      case "distance":
        return list.sort(byDistance);
      case "availability":
        return list.sort((a, b) => Number(b.isAvailable) - Number(a.isAvailable));
      case "featured":
        return list.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
      case "price":
        return list.sort((a, b) => a.startingPriceUSD - b.startingPriceUSD);
      case "rating":
        return list.sort((a, b) => b.rating - a.rating);
      default:
        return list;
    }
  }, [filtered, sortKey]);

  const visibleList = useMemo(
    () => sorted.slice(0, visibleCount),
    [sorted, visibleCount]
  );

  const mapTherapists = useMemo(
    () => sorted.slice(0, 25),
    [sorted]
  );

  const mapCenter: [number, number] = useMemo(() => {
    if (userLocation) return [userLocation.lat, userLocation.lng];
    const first = mapTherapists.find((t) => typeof t.lat === "number" && typeof t.lng === "number");
    if (first) return [first.lat!, first.lng!];
    return [-15.8, -47.9];
  }, [userLocation, mapTherapists]);

  const mapZoom = userLocation ? 10 : mapTherapists.length ? 11 : 3;

  if (loading) {
    return (
      <div className={styles.explore}>
        <section className={styles.banner}>
          <div className={styles.banner__copy}>
            <p className={styles.banner__eyebrow}>Masseurs of the day</p>
            <h1 className={styles.banner__title}>Explore therapists</h1>
            <p className={styles.banner__desc}>Loading featured picks...</p>
          </div>
          <div className={styles.banner__fallback}>Loading featured therapists...</div>
        </section>

        <section className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.filterCard}>
              <p className={styles.filterHint}>Loading filters...</p>
            </div>
          </aside>
          <div className={styles.content}>
            <div className={styles.mapWrapper}>
              <div className={styles.mapLoading}>Loading map...</div>
            </div>
            <div className={styles.empty}>Loading therapists...</div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.explore}>
      <section className={styles.banner}>
        <div className={styles.banner__copy}>
          <p className={styles.banner__eyebrow}>Masseurs of the day</p>
          <h1 className={styles.banner__title}>Explore therapists</h1>
          <p className={styles.banner__desc}>
            Responsive grid, no search bar, filters on the left, map on demand, and distance-first sorting with your consent.
          </p>
          <div className={styles.banner__pills}>
            <span className={styles.pill}>Sort by distance, availability, price, rating</span>
            <span className={styles.pill}>Radius and verified filters saved in URL</span>
            <span className={styles.pill}>Lazy load with infinite scroll</span>
          </div>
        </div>

        {activeHero ? (
          <div className={styles.banner__spotlight}>
            <div
              className={styles.banner__photo}
              style={{ backgroundImage: `url(${activeHero.photoUrl})` }}
            />
            <div className={styles.banner__overlay} />
            <div className={styles.banner__meta}>
              <p className={styles.banner__label}>Featured today</p>
              <h2 className={styles.banner__name}>{activeHero.name}</h2>
              <div className={styles.banner__metaRow}>
                <span className={styles.dot} />
                <span className={styles.banner__location}>
                  {[activeHero.city, activeHero.state].filter(Boolean).join(", ")}
                </span>
                <span className={styles.banner__rating}>
                  {"\u2605"} {activeHero.rating.toFixed(1)}
                  {typeof activeHero.ratingCount === "number" ? ` (${activeHero.ratingCount})` : ""}
                </span>
              </div>
              <div className={styles.banner__actions}>
                <Link href={`/therapist/${activeHero.id}`} className={styles["btn--primary"]}>
                  View profile
                </Link>
                <button
                  type="button"
                  className={`${styles.btn} ${styles["btn--ghostAlt"]}`}
                  onClick={() =>
                    setHeroIndex((idx) => (idx + 1) % Math.max(heroTherapists.length, 1))
                  }
                >
                  Next highlight
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.banner__fallback}>No featured therapists yet.</div>
        )}

        {heroTherapists.length > 1 && (
          <div className={styles.banner__thumbnails}>
            {heroTherapists.map((t, idx) => (
              <button
                key={t.id}
                className={`${styles.thumb} ${idx === heroIndex ? styles["thumb--active"] : ""}`}
                onClick={() => setHeroIndex(idx)}
                aria-label={`See ${t.name}`}
              >
                <img src={t.photoUrl} alt={t.name} />
                <div className={styles.thumb__meta}>
                  <span className={styles.thumb__name}>{t.name}</span>
                  <small className={styles.thumb__city}>
                    {[t.city, t.state].filter(Boolean).join(", ")}
                  </small>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.filterCard}>
            <div className={styles.filterHeader}>
              <p className={styles.filterEyebrow}>Filters</p>
              <h2 className={styles.filterTitle}>Left column only</h2>
              <p className={styles.filterHint}>
                Radius, availability, incall/outcall, price, verified, featured, travel offers.
              </p>
            </div>

            <div className={styles.filterGroup}>
              <div className={styles.fieldLabelRow}>
                <span className={styles.fieldLabel}>Radius (miles)</span>
                {!userLocation && <span className={styles.muted}>Enable location to apply</span>}
              </div>
              <input
                type="range"
                min={5}
                max={100}
                step={5}
                value={radius}
                disabled={!userLocation}
                onChange={(e) => setRadius(Number(e.target.value))}
                className={styles.slider}
              />
              <div className={styles.rangeRow}>
                <span>{radius} mi</span>
                <button
                  type="button"
                  className={styles.btn}
                  onClick={handleUseMyLocation}
                  disabled={geoStatus === "locating"}
                >
                  {geoStatus === "locating" ? "Locating..." : "Use my location"}
                </button>
              </div>
              {geoError && <p className={styles.locationError}>{geoError}</p>}
            </div>

            <div className={styles.filterGroup}>
              <span className={styles.fieldLabel}>Availability and mode</span>
              <div className={styles.filterRow}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles["btn--chip"]} ${
                    filterAvailable ? styles["is-on"] : ""
                  }`}
                  onClick={() => setFilterAvailable((s) => !s)}
                >
                  Available now
                </button>
                <button
                  type="button"
                  className={`${styles.btn} ${styles["btn--chip"]} ${
                    filterIncall ? styles["is-on"] : ""
                  }`}
                  onClick={() => setFilterIncall((s) => !s)}
                >
                  Incall
                </button>
                <button
                  type="button"
                  className={`${styles.btn} ${styles["btn--chip"]} ${
                    filterOutcall ? styles["is-on"] : ""
                  }`}
                  onClick={() => setFilterOutcall((s) => !s)}
                >
                  Outcall
                </button>
              </div>
            </div>

            <div className={styles.filterGroup}>
              <span className={styles.fieldLabel}>Price range (USD)</span>
              <div className={styles.rangeInputs}>
                <label className={styles.rangeInput}>
                  <span>Min</span>
                  <input
                    type="number"
                    min={0}
                    max={priceMax}
                    value={priceMin}
                    onChange={(e) => setPriceMin(Math.min(Number(e.target.value) || 0, priceMax))}
                  />
                </label>
                <label className={styles.rangeInput}>
                  <span>Max</span>
                  <input
                    type="number"
                    min={priceMin}
                    max={1000}
                    value={priceMax}
                    onChange={(e) => setPriceMax(Math.max(Number(e.target.value) || priceMin, priceMin))}
                  />
                </label>
              </div>
            </div>

            <div className={styles.filterGroup}>
              <span className={styles.fieldLabel}>Badges and offers</span>
              <div className={styles.filterRow}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles["btn--chip"]} ${
                    filterVerified ? styles["is-on"] : ""
                  }`}
                  onClick={() => setFilterVerified((s) => !s)}
                >
                  Verified
                </button>
                <button
                  type="button"
                  className={`${styles.btn} ${styles["btn--chip"]} ${
                    filterFeatured ? styles["is-on"] : ""
                  }`}
                  onClick={() => setFilterFeatured((s) => !s)}
                >
                  Featured
                </button>
                <button
                  type="button"
                  className={`${styles.btn} ${styles["btn--chip"]} ${
                    filterOffers ? styles["is-on"] : ""
                  }`}
                  onClick={() => setFilterOffers((s) => !s)}
                >
                  Travels / mobile
                </button>
              </div>
            </div>
          </div>
        </aside>

        <div className={styles.content}>
          <div className={styles.controlsBar}>
            <div>
              <span className={styles.fieldLabel}>Sort</span>
              <select
                className={styles.select}
                value={sortKey}
                onChange={(e) => {
                  const next = e.target.value as any;
                  setSortKey(next);
                  if (next === "distance" && !userLocation) {
                    handleUseMyLocation();
                  }
                }}
              >
                <option value="distance">Distance</option>
                <option value="availability">Availability</option>
                <option value="featured">Featured</option>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
              </select>
              {!userLocation && sortKey === "distance" && (
                <p className={styles.locationError}>Enable location to sort by proximity.</p>
              )}
            </div>

            <div className={styles.mapToggles}>
              <label className={styles.switchLabel}>
                <input
                  type="checkbox"
                  checked={showMap}
                  onChange={() => setShowMap((v) => !v)}
                />
                <span>Show map</span>
              </label>
              <button
                type="button"
                className={styles.btn}
                onClick={() => setMapCollapsed((prev) => !prev)}
              >
                {mapCollapsed ? "Show pins" : "Hide pins"}
              </button>
            </div>
          </div>

          {showMap && (
            <div className={styles.mapWrapper}>
              <div className={styles.mapToolbar}>
                <div>
                  <span className={styles.mapLabel}>
                    Map area: {userLocation ? "Near you" : "Top results"}
                  </span>
                  <p className={styles.mapSub}>Pins are clickable; mini cards below.</p>
                </div>
                <div className={styles.mapActions}>
                  <button
                    type="button"
                    className={styles.btn}
                    onClick={handleUseMyLocation}
                    disabled={geoStatus === "locating"}
                  >
                    {geoStatus === "locating" ? "Locating..." : "Use my location"}
                  </button>
                </div>
              </div>

              {!mapCollapsed ? (
                <div className={styles.mapFrame}>
                  <MapContainer
                    center={mapCenter}
                    zoom={mapZoom}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {mapTherapists.map((t) => (
                      <Marker
                        key={t.id}
                        position={[t.lat ?? mapCenter[0], t.lng ?? mapCenter[1]]}
                        icon={createPhotoIcon(t.photoUrl)}
                        eventHandlers={{
                          click: () => {
                            window.open(`/therapist/${t.id}`, "_blank");
                          },
                        }}
                      />
                    ))}
                  </MapContainer>
                </div>
              ) : (
                <div className={styles.mapLoading}>Map hidden. Show it when you need pins.</div>
              )}

              <div className={styles.mapMiniCards}>
                {mapTherapists.slice(0, 8).map((t) => (
                  <div key={t.id} className={styles.miniCard}>
                    <img src={t.photoUrl} alt={t.name} />
                    <div className={styles.miniMeta}>
                      <strong>{t.name}</strong>
                      <span>{[t.city, t.state].filter(Boolean).join(", ")}</span>
                      {typeof t.distanceMiles === "number" && (
                        <small>~{t.distanceMiles.toFixed(1)} mi</small>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <main className={styles.grid} role="list" aria-label="Therapists list">
            {visibleList.map((t) => (
              <TherapistCard key={t.id} t={t} />
            ))}
          </main>

          {visibleList.length < sorted.length && (
            <div ref={sentinelRef} className={styles.sentinel}>
              Loading more...
            </div>
          )}

          {sorted.length === 0 && (
            <div className={styles.empty}>No results found with the current filters.</div>
          )}
        </div>
      </section>
    </div>
  );
}
