"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase"; // ajuste se o seu caminho for diferente
import styles from "./ExploreTherapists.module.css";
import ExploreMap from "./ExploreMap";

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
  lat?: number | null;
  lng?: number | null;
};

const STATE_CODE_MAP: Record<string, string> = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
  "District of Columbia": "DC",
};

const normalizeState = (value: string) => {
  const raw = (value || "").trim();
  if (!raw) return "";
  if (raw.length === 2) return raw.toUpperCase();
  return STATE_CODE_MAP[raw] || raw;
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
          {"\u2605"}
        </span>
      ))}
      {Array.from({ length: stars.half }).map((_, i) => (
        <span key={`h${i}`} className={`${styles.star} ${styles["star--half"]}`}>
          {"\u2605"}
        </span>
      ))}
      {Array.from({ length: stars.empty }).map((_, i) => (
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
function Badge({ kind }: { kind: BadgeType }) {
  if (kind === "verified") {
    return (
      <span className={`${styles.badge} ${styles["badge--verified"]}`}>
        Verified
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
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availableServices, setAvailableServices] = useState<string[]>([]);
  const [locationQuery, setLocationQuery] = useState("");
  const [locLoading, setLocLoading] = useState(false);
  const [geoConsent, setGeoConsent] = useState(false);
  const [searchConsent, setSearchConsent] = useState(false);

  const GEO_BACKEND_URL =
    process.env.NEXT_PUBLIC_GEO_BACKEND_URL ||
    process.env.NEXT_PUBLIC_IA_BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:4000";

  useEffect(() => {
    async function fetchTherapists() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("therapists")
          .select(
            "user_id, display_name, city, state, location, services, profile_photo, status, lat, lng"
          )
          .eq("status", "active");

        if (error) throw error;

        const mapped: Therapist[] = (data || []).map((t: any) => {
          const locationRaw = String(t.location || "");
          const [locCityRaw = "", locStateRaw = ""] =
            locationRaw.includes("-")
              ? locationRaw.split("-")
              : locationRaw.split(",");
          const city = (t.city || locCityRaw || "").toString().trim();
          const state = (t.state || locStateRaw || "").toString().trim();
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
            city,
            state,
            rating: 5,
            ratingCount: Math.floor(Math.random() * 100) + 1,
            tags,
            startingPriceUSD: 90 + Math.floor(Math.random() * 60),
            photoUrl:
              t.profile_photo ||
              "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?q=80&w=1600&auto=format&fit=crop",
            badges: ["verified"],
            lat: Number.isFinite(Number(t.lat)) ? Number(t.lat) : null,
            lng: Number.isFinite(Number(t.lng)) ? Number(t.lng) : null,
          };
        });

        setTherapists(mapped);

        const states = Array.from(
          new Set(mapped.map((t) => t.state).filter(Boolean))
        ).sort();
        const cities = Array.from(
          new Set(mapped.map((t) => t.city).filter(Boolean))
        ).sort();
        const services = Array.from(
          new Set(mapped.flatMap((t) => t.tags).filter(Boolean))
        ).sort();

        setAvailableStates(states);
        setAvailableCities(cities);
        setAvailableServices(services);
      } catch (e) {
        console.error("Failed to load therapists:", e);
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

    if (selectedState) {
      const match = normalizeState(selectedState);
      list = list.filter((t) => normalizeState(t.state) === match);
    }

    if (selectedCity) {
      list = list.filter((t) => t.city === selectedCity);
    }

    if (selectedService) {
      const key = selectedService.toLowerCase();
      list = list.filter((t) =>
        t.tags.some((tag) => tag.toLowerCase().includes(key))
      );
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
  }, [
    therapists,
    query,
    showOnlyVerified,
    selectedState,
    selectedCity,
    selectedService,
  ]);

  useEffect(() => {
    if (!selectedState) {
      const allCities = Array.from(
        new Set(therapists.map((t) => t.city).filter(Boolean))
      ).sort();
      setAvailableCities(allCities);
      return;
    }
    const citiesForState = therapists
      .filter((t) => t.state === selectedState)
      .map((t) => t.city)
      .filter(Boolean);
    const unique = Array.from(new Set(citiesForState)).sort();
    setAvailableCities(unique);
    if (selectedCity && !unique.includes(selectedCity)) {
      setSelectedCity("");
    }
  }, [selectedState, selectedCity, therapists]);

  const resolveStateSelection = (raw: string) => {
    const normalized = normalizeState(raw);
    const match = availableStates.find(
      (state) => normalizeState(state) === normalized
    );
    return match || raw;
  };

  const resolveCitySelection = (raw: string) => {
    const match = availableCities.find(
      (city) => city.toLowerCase() === raw.toLowerCase()
    );
    return match || raw;
  };

  const handleGeoLocate = async () => {
    if (!navigator.geolocation) return;
    if (!geoConsent) {
      const ok = window.confirm(
        "Allow us to use your device location to set city and state filters?"
      );
      if (!ok) return;
      setGeoConsent(true);
    }

    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const url = `${GEO_BACKEND_URL}/reverse-geocode?lat=${encodeURIComponent(
            latitude
          )}&lng=${encodeURIComponent(longitude)}`;
          const resp = await fetch(url);
          if (!resp.ok) throw new Error("Location lookup failed.");
          const data = await resp.json();
          const cityRaw = data?.city || "";
          const stateRaw = data?.state || data?.stateCode || "";
          const city = cityRaw ? resolveCitySelection(cityRaw) : "";
          const state = stateRaw ? resolveStateSelection(stateRaw) : "";
          if (city) setSelectedCity(city);
          if (state) setSelectedState(state);
          if (city || state) {
            setLocationQuery([city, state].filter(Boolean).join(", "));
          }
        } catch (err) {
          console.error("Geo lookup error:", err);
        } finally {
          setLocLoading(false);
        }
      },
      () => setLocLoading(false),
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 30000 }
    );
  };

  const handleLocationSearch = async () => {
    if (!locationQuery.trim()) return;
    if (!searchConsent) {
      const ok = window.confirm(
        "Allow us to use a location search provider to find city and state?"
      );
      if (!ok) return;
      setSearchConsent(true);
    }

    setLocLoading(true);
    try {
      const url = `${GEO_BACKEND_URL}/geocode?query=${encodeURIComponent(
        locationQuery.trim()
      )}`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error("Location search failed.");
      const data = await resp.json();
      const cityRaw = data?.city || "";
      const stateRaw = data?.state || data?.stateCode || "";
      const city = cityRaw ? resolveCitySelection(cityRaw) : "";
      const state = stateRaw ? resolveStateSelection(stateRaw) : "";
      if (city) setSelectedCity(city);
      if (state) setSelectedState(state);
    } catch (err) {
      console.error("Search location error:", err);
    } finally {
      setLocLoading(false);
    }
  };

  const mapPoints = useMemo(
    () =>
      results
        .filter((t) => Number.isFinite(t.lat) && Number.isFinite(t.lng))
        .map((t) => ({
          id: t.id,
          name: t.name,
          lat: t.lat as number,
          lng: t.lng as number,
        })),
    [results]
  );

  if (loading) {
    return (
      <div className={styles.explore}>
        <section className={styles.pagehead}>
          <div className={styles.pagehead__left}>
            <Link className={styles.backLink} href="/">
              {"\u2190"} Back to home
            </Link>
            <h1 className={styles.pagehead__title}>Find Your Therapist</h1>
            <p className={styles.pagehead__desc}>
              Browse our directory of professional massage therapists.
            </p>
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
          <Link className={styles.backLink} href="/">
            {"\u2190"} Back to home
          </Link>
          <h1 className={styles.pagehead__title}>Find Your Therapist</h1>
          <p className={styles.pagehead__desc}>
            Browse our directory of professional massage therapists. Filter by
            verified status, availability, and more.
          </p>
          <div className={styles.pagehead__meta}>
            <span>USA focus</span>
            <span>|</span>
            <span>{results.length} profiles</span>
          </div>

          {availableCities.length > 0 && (
            <div className={styles.citySection}>
              <h2 className={styles.sectionLabel}>Browse by city</h2>
              <div className={styles.cityList}>
                <button
                  type="button"
                  className={`${styles.cityChip} ${
                    selectedCity ? "" : styles.cityChipActive
                  }`}
                  onClick={() => setSelectedCity("")}
                >
                  All cities
                </button>
                {availableCities.slice(0, 8).map((city) => (
                  <button
                    key={city}
                    type="button"
                    className={`${styles.cityChip} ${
                      selectedCity === city ? styles.cityChipActive : ""
                    }`}
                    onClick={() => setSelectedCity(city)}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={styles.filters}>
            <button
              type="button"
              className={`${styles.btn} ${styles["btn--chip"]} ${
                showOnlyVerified ? styles["is-on"] : ""
              }`}
              onClick={() => setShowOnlyVerified((s) => !s)}
              aria-pressed={showOnlyVerified}
            >
              Verified only
            </button>

            <div className={styles.filterGroup}>
              <select
                className={styles.select}
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                aria-label="Filter by state"
              >
                <option value="">All states</option>
                {availableStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>

              <select
                className={styles.select}
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                aria-label="Filter by city"
              >
                <option value="">All cities</option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              <select
                className={styles.select}
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                aria-label="Filter by service"
              >
                <option value="">All services</option>
                {availableServices.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.search}>
              <input
                className={styles.search__input}
                placeholder="Search by name, city, or modality..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search therapists"
              />
            </div>

            <div className={styles.filterGroup}>
              <input
                className={styles.search__input}
                placeholder="Find by location"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                aria-label="Search location"
              />
              <button
                type="button"
                className={styles.btn}
                onClick={handleLocationSearch}
                disabled={locLoading}
              >
                {locLoading ? "Searching..." : "Search"}
              </button>
              <button
                type="button"
                className={styles.btn}
                onClick={handleGeoLocate}
                disabled={locLoading}
              >
                {locLoading ? "Locating..." : "Use my location"}
              </button>
            </div>

            <div className={styles.filterGroup}>
              <button
                type="button"
                className={`${styles.btn} ${viewMode === "grid" ? styles["is-on"] : ""}`}
                onClick={() => setViewMode("grid")}
              >
                Grid view
              </button>
              <button
                type="button"
                className={`${styles.btn} ${viewMode === "map" ? styles["is-on"] : ""}`}
                onClick={() => setViewMode("map")}
              >
                Map view
              </button>
            </div>
          </div>
        </div>
      </section>

      {results.length === 0 ? (
        <div className={styles.empty} role="status">
          No results found. Try another search or remove filters.
        </div>
      ) : viewMode === "map" ? (
        <section className={styles.layout} aria-label="Therapists map view">
          <div className={styles.mapPanel}>
            <ExploreMap points={mapPoints} />
          </div>
          <div className={styles.mapList}>
            {results.map((t) => (
              <div key={t.id} className={styles.mapListCard}>
                <h3>{t.name}</h3>
                <p>
                  {t.city}, {t.state}
                </p>
                <div className={styles.tagRow}>
                  {t.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/therapist/${t.id}`}
                  className={styles.link}
                  aria-label={`View ${t.name} profile`}
                >
                  View profile {"\u2192"}
                </Link>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <main className={styles.grid} role="list" aria-label="Therapists list">
          {results.map((t) => (
            <TherapistCard key={t.id} t={t} />
          ))}
        </main>
      )}
    </div>
  );
}


