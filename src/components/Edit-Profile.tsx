// src/pages/EditProfile.tsx  (Next v4 — sincroniza com Supabase e Context)
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";

import { useProfile } from "../context/ProfileContext";
import type { Therapist } from "../context/ProfileContext";
import "../styles/edit-profile.css";

// ÍCONES (Lucide)
import {
  User,
  FileText,
  MapPin,
  Ruler,
  Wrench,
  BadgeDollarSign,
  MessageSquareText,
  Plus,
  Trash2,
  Images,
  Link as LinkIcon,
  CreditCard,
  Calendar,
  Star,
  Building2,
  Umbrella,
  PackageOpen,
  Plane,
  Languages,
  Info,
} from "lucide-react";

/** Opções (checkbox) */
const STUDIO_AMENITY_OPTIONS = [
  "Aromatherapy Enhanced",
  "Bottled Water",
  "Candles",
  "Drinking Water",
  "Free Parking",
  "Fully Handicapped Accessible",
  "Heated Massage Table",
  "Hot Towels",
  "Massage Table",
  "Metered Parking",
  "Music",
  "Pool",
  "Private Parking",
  "Private Restroom",
  "Sauna",
  "Secured Entrance/Doorman",
  "Shower",
  "Soft Drinks",
  "Spa/Hot Tub",
  "Tea",
  "Wine",
];

const MOBILE_EXTRA_OPTIONS = [
  "Aromatherapy Enhanced",
  "Candles",
  "Heated Massage Table",
  "Hot Towels",
  "Massage Table",
  "Music",
];

const ADDITIONAL_SERVICE_OPTIONS = [
  "Acupuncture",
  "Body scrubs",
  "Body trimming",
  "Colonic cleansing",
  "Cupping",
  "Facials",
  "Fitness training",
  "Hair styling",
  "Hydrotherapy",
  "Manicures",
  "Meditation coaching",
  "Mud treatments",
  "Nutrition consulting",
  "Pedicures",
  "Personal coaching",
  "Personal training",
  "Physical therapy",
  "Waxing",
  "Yoga instruction",
];

const AFFILIATION_OPTIONS = [
  "American College of Sports Medicine",
  "National Association of Massage Therapists",
  "American Organization for Bodywork Therapies of Asia",
  "Massage Association of Australia",
  "Esalen Massage and Bodywork Association",
  "Associated Bodywork and Massage Professionals",
  "National Certification Board for Therapeutic Massage & Bodywork",
  "American Massage Therapy Association",
];

const DISCOUNT_GROUP_OPTIONS = [
  "first-time clients",
  "military veterans",
  "students",
  "active military",
  "law enforcement",
  "repeat clients",
  "dancers",
  "entertainment industry",
  "massage therapists",
  "senior citizens",
  "bodybuilders",
  "SAG/Equity members",
  "visiting clients",
  "AIDS ride participants",
  "birthdays",
  "emergency workers",
  "airline crews",
  "ask for details",
];

const RATE_DISCLAIMER_OPTIONS = [
  "Longer sessions available",
  "Amounts listed are base rates only",
  "Ask about discounts for prepaid packages",
  "Gift certificates available",
];

type ExtendedTherapist = Therapist & {
  philosophy?: string[];
  techniques?: string[];
  mobileRadius?: string;
  gallery?: string[];
  massageSetup?: string;
  studioAmenities?: string[];
  mobileExtras?: string[];
  additionalServices?: string[];
  productsUsed?: string[];
  policies?: string;
  payments?: {
    visa: boolean;
    mastercard: boolean;
    amex: boolean;
    discover: boolean;
    cash: boolean;
    venmo: boolean;
    zelle: boolean;
  };
  discounts?: { regular?: string; weekday?: string; weekly?: string };
  discountGroups?: string[];
  rateDisclaimers?: string[];
  availability?: { day: string; incallHours: string; mobileHours: string }[];
  degrees?: string[];
  affiliations?: string[];
  startDate?: string;
  languagesSpoken?: string[];
  businessTrips?: string[];
  ratingCount?: number;
  promocoes?: string;

  zipCode?: string; // CEP/ZIP
  mobileMiles?: number; // raio numérico em milhas

  // campos de "cabeçalho"
  locationCityState?: string;
  address?: string;
  services?: string;
  specialties?: string;
  rates?: { name: string; duration: string; price: string; notes?: string }[];
};

const DEFAULT_AVAILABILITY = [
  {
    day: "Monday",
    incallHours: "7 a.m. - 11 p.m.",
    mobileHours: "9 a.m. - 9 p.m.",
  },
  {
    day: "Tuesday",
    incallHours: "7 a.m. - 11 p.m.",
    mobileHours: "9 a.m. - 9 p.m.",
  },
  {
    day: "Wednesday",
    incallHours: "7 a.m. - 11 p.m.",
    mobileHours: "9 a.m. - 9 p.m.",
  },
  {
    day: "Thursday",
    incallHours: "7 a.m. - 11 p.m.",
    mobileHours: "9 a.m. - 9 p.m.",
  },
  {
    day: "Friday",
    incallHours: "7 a.m. - 11 p.m.",
    mobileHours: "9 a.m. - 9 p.m.",
  },
  {
    day: "Saturday",
    incallHours: "8 a.m. - 10 p.m.",
    mobileHours: "9 a.m. - 9 p.m.",
  },
  {
    day: "Sunday",
    incallHours: "9 a.m. - 8 p.m.",
    mobileHours: "9 a.m. - 6 p.m.",
  },
];

/** Componente utilitário de checkbox group */
const CheckboxGroup: React.FC<{
  options: string[];
  value: string[] | undefined;
  onChange: (next: string[]) => void;
  columns?: 1 | 2;
}> = ({ options, value = [], onChange, columns = 1 }) => {
  function toggle(opt: string, checked: boolean) {
    const set = new Set(value);
    checked ? set.add(opt) : set.delete(opt);
    onChange(Array.from(set));
  }
  return (
    <div
      className="ep-checkgrid"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {options.map((opt) => (
        <label key={opt} className="check">
          <input
            type="checkbox"
            checked={value.includes(opt)}
            onChange={(e) => toggle(opt, e.target.checked)}
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
};

const EditProfile: React.FC = () => {
  const router = useRouter();
  const { profile, setProfile } = useProfile();

  // ======= AUTH & LOAD =======
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(
    null
  );

  // Estados baseados no Context enquanto não carrega do DB
  const data = (profile ?? ({} as ExtendedTherapist));

  // ======= Sessão 3 — ABOUT & PHILOSOPHY =======
  const [firstName, setFirstName] = useState<string>(data.name ?? "");
  const [about, setAbout] = useState<string>(data.bio ?? "");
  const [philosophy, setPhilosophy] = useState<string[]>(data.philosophy ?? []);
  const [gallery, setGallery] = useState<string[]>(data.gallery ?? []);

  // ======= Sessão 4 — LOCATION & SERVICES =======
  const [location, setLocation] = useState<string>(
    data.locationCityState ?? ""
  );
  const [nearest, setNearest] = useState<string>(data.address ?? "");
  const [zipCode, setZipCode] = useState<string>(data.zipCode ?? "");
  const [mobileMiles, setMobileMiles] = useState<number>(data.mobileMiles ?? 0);
  const [services, setServices] = useState<string>(data.services ?? "");
  const [specialties, setSpecialties] = useState<string>(
    data.specialties ?? ""
  );
  const [promocoes, setPromocoes] = useState<string>(data.promocoes ?? "");
  const [techniques, setTechniques] = useState<string[]>(
    data.techniques ?? []
  );
  const [massageSetup, setMassageSetup] = useState<string>(
    data.massageSetup ?? ""
  );
  const [studioAmenities, setStudioAmenities] = useState<string[]>(
    data.studioAmenities ?? []
  );
  const [mobileExtras, setMobileExtras] = useState<string[]>(
    data.mobileExtras ?? []
  );
  const [additionalServices, setAdditionalServices] = useState<string[]>(
    data.additionalServices ?? []
  );
  const [productsUsed, setProductsUsed] = useState<string[]>(
    data.productsUsed ?? []
  );

  // ======= Sessão 5 — PRICING & AVAILABILITY =======
  const [pricing, setPricing] = useState<
    { duration: string; incall: string; outcall: string }[]
  >(
    data.rates?.map((r) => ({
      duration: r.duration,
      incall: r.price,
      outcall: r.notes ?? "",
    })) ?? []
  );
  const [policies, setPolicies] = useState<string>(data.policies ?? "");
  const [payments, setPayments] =
    useState<NonNullable<ExtendedTherapist["payments"]>>(
      data.payments ?? {
        visa: false,
        mastercard: false,
        amex: false,
        discover: false,
        cash: true,
        venmo: false,
        zelle: false,
      }
    );
  const [discounts, setDiscounts] =
    useState<NonNullable<ExtendedTherapist["discounts"]>>(
      data.discounts ?? { regular: "", weekday: "", weekly: "" }
    );
  const [discountGroups, setDiscountGroups] = useState<string[]>(
    data.discountGroups ?? []
  );
  const [rateDisclaimers, setRateDisclaimers] = useState<string[]>(
    data.rateDisclaimers ?? []
  );
  const [availability, setAvailability] =
    useState<NonNullable<ExtendedTherapist["availability"]>>(
      data.availability ?? DEFAULT_AVAILABILITY
    );

  // ======= Sessão 6 — PROFESSIONAL HISTORY =======
  const [degrees, setDegrees] = useState<string[]>(data.degrees ?? []);
  const [affiliations, setAffiliations] = useState<string[]>(
    data.affiliations ?? []
  );
  const [startDate, setStartDate] = useState<string>(data.startDate ?? "");
  const [languagesSpoken, setLanguagesSpoken] = useState<string[]>(
    data.languagesSpoken ?? []
  );
  const [businessTrips, setBusinessTrips] = useState<string[]>(
    data.businessTrips ?? []
  );

  // ======= Sessão 7 — REVIEWS =======
  const [reviews, setReviews] = useState<
    { author: string; date: string; text: string; rating: number }[]
  >(
    data.reviews?.map((r) => ({
      author: r.author,
      date: "",
      text: r.text,
      rating: r.rating,
    })) ?? []
  );
  const [ratingCountOverride, setRatingCountOverride] = useState<
    number | undefined
  >(data.ratingCount);
  const overallRating = useMemo(
    () =>
      reviews.length
        ? Math.round(
          (reviews.reduce((a, r) => a + (r.rating || 0), 0) / reviews.length) *
          10
        ) / 10
        : 0,
    [reviews]
  );
  const ratingCount = ratingCountOverride ?? reviews.length;

  // ======= LOAD FROM SUPABASE =======
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data: auth } = await supabase.auth.getUser();
        const u = auth?.user?.id ?? null;
        if (!u) {
          // não logado -> envia pro login
          router.replace("/login");
          return;
        }
        setUid(u);

        const { data: row, error } = await supabase
          .from("therapists")
          .select("*")
          .eq("user_id", u)
          .maybeSingle();

        if (error) throw error;

        if (row) {
          // Aqui assumo que as colunas extras já existem na tabela.
          // Se ainda não existirem, você pode ir removendo do payload depois.
          setFirstName(row.full_name ?? row.display_name ?? "");
          setAbout(row.bio ?? "");
          setPhilosophy(row.philosophy ?? []);
          setGallery(row.gallery ?? []);

          setLocation(row.locationCityState ?? row.location ?? "");
          setNearest(row.address ?? "");
          setZipCode(row.zip_code ?? "");
          setMobileMiles(
            Number.isFinite(row.mobileMiles) ? row.mobileMiles : 0
          );
          setServices(row.services_headline ?? row.services ?? "");
          setSpecialties(row.specialties ?? "");
          setPromocoes(row.promocoes ?? "");
          setTechniques(row.techniques ?? []);
          setMassageSetup(row.massageSetup ?? "");
          setStudioAmenities(row.studioAmenities ?? []);
          setMobileExtras(row.mobileExtras ?? []);
          setAdditionalServices(row.additionalServices ?? []);
          setProductsUsed(row.productsUsed ?? []);

          const normalizedRates = Array.isArray(row.rates)
            ? row.rates.map((r: any) => ({
              duration: r.duration ?? "",
              incall: r.price ?? "",
              outcall: r.notes ?? "",
            }))
            : [];
          setPricing(normalizedRates);

          setPolicies(row.policies ?? "");
          setPayments(
            row.payments ?? {
              visa: false,
              mastercard: false,
              amex: false,
              discover: false,
              cash: true,
              venmo: false,
              zelle: false,
            }
          );
          setDiscounts(
            row.discounts ?? { regular: "", weekday: "", weekly: "" }
          );
          setDiscountGroups(row.discountGroups ?? []);
          setRateDisclaimers(row.rateDisclaimers ?? []);
          setAvailability(row.availability ?? DEFAULT_AVAILABILITY);

          setDegrees(row.degrees ?? []);
          setAffiliations(row.affiliations ?? []);
          setStartDate(row.startDate ?? "");
          setLanguagesSpoken(row.languagesSpoken ?? []);
          setBusinessTrips(row.businessTrips ?? []);

          const normalizedReviews = Array.isArray(row.reviews)
            ? row.reviews.map((r: any) => ({
              author: r.author ?? "",
              date: "",
              text: r.text ?? "",
              rating: r.rating ?? 5,
            }))
            : [];
          setReviews(normalizedReviews);
          setRatingCountOverride(row.ratingCount ?? undefined);

          // também atualiza o Context/localStorage
          const updatedFromDb: ExtendedTherapist = {
            name: row.full_name ?? row.display_name ?? "",
            bio: row.bio ?? "",
            philosophy: row.philosophy ?? [],
            gallery: row.gallery ?? [],
            locationCityState: row.locationCityState ?? row.location ?? "",
            address: row.address ?? "",
            zipCode: row.zip_code ?? "",
            services: row.services_headline ?? row.services ?? "",
            specialties: row.specialties ?? "",
            promocoes: row.promocoes ?? "",
            mobileMiles: row.mobileMiles ?? 0,
            mobileRadius: row.mobileMiles
              ? `${row.mobileMiles} miles`
              : undefined,
            techniques: row.techniques ?? [],
            massageSetup: row.massageSetup ?? "",
            studioAmenities: row.studioAmenities ?? [],
            mobileExtras: row.mobileExtras ?? [],
            additionalServices: row.additionalServices ?? [],
            productsUsed: row.productsUsed ?? [],
            policies: row.policies ?? "",
            payments: row.payments ?? undefined,
            discounts: row.discounts ?? undefined,
            discountGroups: row.discountGroups ?? [],
            rateDisclaimers: row.rateDisclaimers ?? [],
            availability: row.availability ?? DEFAULT_AVAILABILITY,
            rates: row.rates ?? [],
            degrees: row.degrees ?? [],
            affiliations: row.affiliations ?? [],
            startDate: row.startDate ?? "",
            languagesSpoken: row.languagesSpoken ?? [],
            businessTrips: row.businessTrips ?? [],
            reviews: row.reviews ?? [],
            ratingCount: row.ratingCount ?? undefined,
            accessNotes: row.accessNotes ?? undefined,
          };
          setProfile(updatedFromDb as Therapist);
          try {
            localStorage.setItem("mm_profile", JSON.stringify(updatedFromDb));
          } catch { }
        }
      } catch (e) {
        console.error(e);
        setToast({
          type: "err",
          msg: "Não foi possível carregar seu perfil.",
        });
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ======= SALVAR =======
  async function handleSave() {
    if (!uid) {
      router.replace("/login");
      return;
    }

    const updated: Partial<ExtendedTherapist> = {
      // Sessão 3
      name: firstName,
      bio: about,
      philosophy,
      gallery,
      // Sessão 4
      locationCityState: location,
      address: nearest,
      zipCode,
      services,
      specialties,
      promocoes,
      mobileMiles,
      mobileRadius: mobileMiles ? `${mobileMiles} miles` : undefined,
      techniques,
      massageSetup,
      studioAmenities,
      mobileExtras,
      additionalServices,
      productsUsed,
      // Sessão 5
      policies,
      payments,
      discounts,
      discountGroups,
      rateDisclaimers,
      availability,
      rates: pricing.map((p) => ({
        name: "Session",
        duration: p.duration,
        price: p.incall,
        notes: p.outcall,
      })),
      // Sessão 6
      degrees,
      affiliations,
      startDate,
      languagesSpoken,
      businessTrips,
      // Sessão 7
      reviews: reviews.map((r, idx) => ({
        id: `rev-${idx}`,
        author: r.author,
        rating: r.rating,
        text: `${r.text}${r.date ? ` (${r.date})` : ""}`,
      })),
      ratingCount,
      accessNotes: `Nearest: ${nearest} • Mobile radius: ${mobileMiles} miles`,
    };

    // Atualiza Context/localStorage (otimista)
    setProfile((prev) => {
      const next = {
        ...(prev ?? ({} as ExtendedTherapist)),
        ...updated,
      } as ExtendedTherapist;
      try {
        localStorage.setItem("mm_profile", JSON.stringify(next));
      } catch { }
      return next as Therapist;
    });

    const payloadForDb: Record<string, any> = {
      user_id: uid,
      full_name: firstName || null,
      bio: about || null,
      philosophy,
      gallery,
      locationCityState: location || null,
      location: location || null,
      address: nearest || null,
      // ❌ NÃO envie zipCode para o banco
      zip_code: zipCode || null, // usamos só essa coluna no Postgres
      mobileMiles: Number.isFinite(mobileMiles) ? mobileMiles : 0,
      services_headline: services || null,
      services: services || null,
      specialties: specialties || null,
      promocoes: promocoes || null,
      techniques,
      massageSetup: massageSetup || null,
      studioAmenities,
      mobileExtras,
      additionalServices,
      productsUsed,
      rates: updated.rates ?? [],
      policies: policies || null,
      payments,
      discounts,
      discountGroups,
      rateDisclaimers,
      availability,
      degrees,
      affiliations,
      startDate: startDate || null,
      languagesSpoken,
      businessTrips,
      reviews: updated.reviews ?? [],
      ratingCount: ratingCount ?? null,
      accessNotes: `Nearest: ${nearest} • Mobile radius: ${mobileMiles} miles`,
      updated_at: new Date().toISOString(),
    };

    try {
      setSaving(true);
      const { error } = await supabase
        .from("therapists")
        .upsert(payloadForDb, { onConflict: "user_id" });
      if (error) {
        console.error("SUPABASE UPSERT ERROR:", error);
        return setToast({
          type: "err",
          msg: "Erro ao salvar: " + error.message,
        });
      }

      setToast({ type: "ok", msg: "✅ Perfil atualizado com sucesso!" });

      router.replace("/therapist");
    } catch (e: any) {
      console.error("SAVE ERROR DETAILS:", e);
      setToast({
        type: "err",
        msg: "⚠️ Não foi possível salvar as alterações.",
      });
    }
  }

  // Helpers de lista simples
  const ListEditor = ({
    items,
    setItems,
    placeholder = "",
    ariaLabel = "item",
  }: {
    items: string[];
    setItems: (v: string[]) => void;
    placeholder?: string;
    ariaLabel?: string;
  }) => (
    <>
      {items.map((item, index) => (
        <div key={index} className="ep-rowline">
          <input
            placeholder={placeholder}
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[index] = e.target.value;
              setItems(next);
            }}
            aria-label={`${ariaLabel}-${index}`}
          />
          <button
            className="btn btn--ghost"
            type="button"
            onClick={() =>
              setItems(items.filter((_, i) => i !== index))
            }
            aria-label="Remove"
            title="Remove"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button
        type="button"
        className="addbar"
        onClick={() => setItems([...(items || []), ""])}
      >
        <Plus size={16} /> <span>Add</span>
      </button>
    </>
  );

  if (loading) {
    return (
      <div className="edit-profile" style={{ padding: 16 }}>
        <span className="muted">Carregando perfil…</span>
      </div>
    );
  }

  return (
    <div className="edit-profile">
      {/* HEADER */}
      <header className="ep-header">
        <h2>Edit Profile</h2>
        <div className="ep-actions">
          <button
            className="btn btn--ghost"
            type="button"
            onClick={() => router.back()}
          >
            ← Back
          </button>
          <button
            className="btn btn--accent"
            type="button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </header>

      {toast && (
        <div className={`ep-toast ${toast.type === "ok" ? "ok" : "err"}`}>
          {toast.msg}
        </div>
      )}

      {/* ===================== 3 — ABOUT ===================== */}
      <section className="ep-section">
        <h3 className="ep-title">
          <User className="ep-icon" size={18} /> About
        </h3>
        <label className="ep-label">
          <User className="ep-icon" size={16} /> First Name
        </label>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <label className="ep-label">
          <FileText className="ep-icon" size={16} /> Massage Summary
        </label>
        <textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          rows={6}
        />

        <h4 className="ep-subtitle">
          <FileText className="ep-icon" size={16} /> My Philosophy &amp; Approach
        </h4>
        <ListEditor
          items={philosophy}
          setItems={setPhilosophy}
          placeholder="Add a philosophy point"
          ariaLabel="philosophy"
        />

        <h4 className="ep-subtitle">
          <Images className="ep-icon" size={16} /> Photo Gallery (Studio / Work)
        </h4>
        <ListEditor
          items={gallery}
          setItems={setGallery}
          placeholder="https://image-url"
          ariaLabel="gallery"
        />
      </section>

      {/* ===================== 4 — LOCATION & SERVICES ===================== */}
      <section className="ep-section">
        <h3 className="ep-title">
          <MapPin className="ep-icon" size={18} /> Service Location &amp; Offerings
        </h3>

        <div className="ep-grid-2">
          <div>
            <label className="ep-label">
              <MapPin className="ep-icon" size={16} /> City / State
            </label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div>
            <label className="ep-label">
              <MapPin className="ep-icon" size={16} /> Nearest Intersection
            </label>
            <input
              value={nearest}
              onChange={(e) => setNearest(e.target.value)}
            />
          </div>
        </div>

        <div className="ep-grid-3">
          <div>
            <label className="ep-label">
              <MapPin className="ep-icon" size={16} /> CEP / ZIP Code
            </label>
            <input
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Ex.: 01001-000"
            />
          </div>
          <div>
            <label className="ep-label">
              <Ruler className="ep-icon" size={16} /> Mobile Service Radius (miles)
            </label>
            <input
              type="number"
              min={0}
              step={1}
              value={Number.isFinite(mobileMiles) ? mobileMiles : 0}
              onChange={(e) => setMobileMiles(Number(e.target.value))}
            />
          </div>
          <div />
        </div>

        <label className="ep-label">
          <FileText className="ep-icon" size={16} /> Services (headline)
        </label>
        <input value={services} onChange={(e) => setServices(e.target.value)} />

        <label className="ep-label">
          <FileText className="ep-icon" size={16} /> Specialties (headline)
        </label>
        <input
          value={specialties}
          onChange={(e) => setSpecialties(e.target.value)}
        />

        <label className="ep-label">
          <FileText className="ep-icon" size={16} /> Promoções (headline)
        </label>
        <input
          value={promocoes}
          onChange={(e) => setPromocoes(e.target.value)}
        />

        <h4 className="ep-subtitle">
          <Wrench className="ep-icon" size={16} /> Massage Techniques
        </h4>
        <ListEditor
          items={techniques}
          setItems={setTechniques}
          placeholder="Add a technique"
          ariaLabel="technique"
        />

        <h4 className="ep-subtitle">
          <Building2 className="ep-icon" size={16} /> Massage Setup
        </h4>
        <textarea
          value={massageSetup}
          onChange={(e) => setMassageSetup(e.target.value)}
          rows={4}
        />

        {/* Studio amenities */}
        <h4 className="ep-subtitle">
          <Umbrella className="ep-icon" size={16} /> Studio (Incall) Amenities
        </h4>
        <CheckboxGroup
          options={STUDIO_AMENITY_OPTIONS}
          value={studioAmenities}
          onChange={setStudioAmenities}
          columns={2}
        />

        {/* Mobile extras */}
        <h4 className="ep-subtitle">
          <PackageOpen className="ep-icon" size={16} /> Mobile Extras
        </h4>
        <CheckboxGroup
          options={MOBILE_EXTRA_OPTIONS}
          value={mobileExtras}
          onChange={setMobileExtras}
          columns={2}
        />

        {/* Additional services */}
        <h4 className="ep-subtitle">
          <Info className="ep-icon" size={16} /> Additional Services
        </h4>
        <CheckboxGroup
          options={ADDITIONAL_SERVICE_OPTIONS}
          value={additionalServices}
          onChange={setAdditionalServices}
          columns={2}
        />

        <h4 className="ep-subtitle">
          <PackageOpen className="ep-icon" size={16} /> Products Used
        </h4>
        <ListEditor
          items={productsUsed}
          setItems={setProductsUsed}
          placeholder="e.g., Organic oils"
          ariaLabel="product-used"
        />

        <div className="hint">
          <LinkIcon size={14} /> Tip: informe CEP/ZIP e intersecção para facilitar
          rotas no Google Maps na página pública.
        </div>
      </section>

      {/* ===================== 5 — PRICING & AVAILABILITY ===================== */}
      <section className="ep-section">
        <h3 className="ep-title">
          <BadgeDollarSign className="ep-icon" size={18} /> Pricing &amp; Availability
        </h3>

        <div className="ep-table">
          <div className="ep-row ep-head">
            <div>Duration</div>
            <div>Incall Rate</div>
            <div>Outcall Rate</div>
            <div></div>
          </div>
          {pricing.map((p, i) => (
            <div key={i} className="ep-row">
              <input
                value={p.duration}
                onChange={(e) => {
                  const n = [...pricing];
                  n[i].duration = e.target.value;
                  setPricing(n);
                }}
              />
              <input
                value={p.incall}
                onChange={(e) => {
                  const n = [...pricing];
                  n[i].incall = e.target.value;
                  setPricing(n);
                }}
              />
              <input
                value={p.outcall}
                onChange={(e) => {
                  const n = [...pricing];
                  n[i].outcall = e.target.value;
                  setPricing(n);
                }}
              />
              <button
                className="btn btn--ghost"
                type="button"
                onClick={() =>
                  setPricing(pricing.filter((_, idx) => idx !== i))
                }
                title="Remove"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="addbar"
          onClick={() =>
            setPricing([...pricing, { duration: "", incall: "", outcall: "" }])
          }
        >
          <Plus size={16} /> <span>Add Pricing</span>
        </button>

        {/* Payment Methods */}
        <h4 className="ep-subtitle">
          <CreditCard className="ep-icon" size={16} /> Payment Methods
        </h4>
        <div className="ep-checks">
          {([
            ["visa", "Visa"],
            ["mastercard", "MasterCard"],
            ["amex", "Amex"],
            ["discover", "Discover"],
            ["cash", "Cash"],
            ["venmo", "Venmo"],
            ["zelle", "Zelle"],
          ] as const).map(([key, label]) => (
            <label key={key} className="check">
              <input
                type="checkbox"
                checked={Boolean((payments as any)[key])}
                onChange={(e) =>
                  setPayments({ ...payments, [key]: e.target.checked } as any)
                }
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        {/* Discounts & Specials */}
        <h4 className="ep-subtitle">
          <BadgeDollarSign className="ep-icon" size={16} /> Discounts &amp; Specials
        </h4>
        <label className="ep-label">
          Regular Discounts (texto livre, opcional)
        </label>
        <input
          value={discounts?.regular ?? ""}
          onChange={(e) =>
            setDiscounts({ ...discounts, regular: e.target.value })
          }
        />
        <label className="ep-label">Day of Week Discount</label>
        <input
          value={discounts?.weekday ?? ""}
          onChange={(e) =>
            setDiscounts({ ...discounts, weekday: e.target.value })
          }
        />
        <label className="ep-label">Weekly Specials</label>
        <input
          value={discounts?.weekly ?? ""}
          onChange={(e) =>
            setDiscounts({ ...discounts, weekly: e.target.value })
          }
        />

        <div style={{ marginTop: 10 }} />
        <b style={{ display: "block", margin: "8px 0" }}>
          Special discounts for these groups:
        </b>
        <CheckboxGroup
          options={DISCOUNT_GROUP_OPTIONS}
          value={discountGroups}
          onChange={setDiscountGroups}
          columns={2}
        />

        <div style={{ marginTop: 10 }} />
        <b style={{ display: "block", margin: "8px 0" }}>Rate disclaimers:</b>
        <CheckboxGroup
          options={RATE_DISCLAIMER_OPTIONS}
          value={rateDisclaimers}
          onChange={setRateDisclaimers}
          columns={1}
        />

        {/* Policies */}
        <h4 className="ep-subtitle">
          <Info className="ep-icon" size={16} /> Booking &amp; Cancellation Policies
        </h4>
        <textarea
          rows={4}
          value={policies}
          onChange={(e) => setPolicies(e.target.value)}
        />

        {/* Availability */}
        <h4 className="ep-subtitle">
          <Calendar className="ep-icon" size={16} /> Availability (In-Studio /
          Mobile)
        </h4>
        <div className="ep-avail">
          {availability.map((a, i) => (
            <div key={i} className="ep-row ep-av">
              <div className="day">{a.day}</div>
              <input
                value={a.incallHours}
                onChange={(e) => {
                  const n = [...availability];
                  n[i].incallHours = e.target.value;
                  setAvailability(n);
                }}
                placeholder="In-studio hours"
              />
              <input
                value={a.mobileHours}
                onChange={(e) => {
                  const n = [...availability];
                  n[i].mobileHours = e.target.value;
                  setAvailability(n);
                }}
                placeholder="Mobile hours"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ===================== 6 — PROFESSIONAL HISTORY ===================== */}
      <section className="ep-section">
        <h3 className="ep-title">
          <Building2 className="ep-icon" size={18} /> Professional Credentials
          &amp; Background
        </h3>

        <h4 className="ep-subtitle">
          <GraduationCapIcon /> Degrees
        </h4>
        <ListEditor
          items={degrees}
          setItems={setDegrees}
          placeholder="Add a degree"
          ariaLabel="degree"
        />

        {/* Affiliations por checkbox */}
        <h4 className="ep-subtitle">
          <BadgeIcon /> Affiliations
        </h4>
        <CheckboxGroup
          options={AFFILIATION_OPTIONS}
          value={affiliations}
          onChange={setAffiliations}
          columns={2}
        />

        <label className="ep-label">
          <Calendar className="ep-icon" size={16} /> Massage Start Date
        </label>
        <input
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <h4 className="ep-subtitle">
          <Languages className="ep-icon" size={16} /> Languages Spoken
        </h4>
        <ListEditor
          items={languagesSpoken}
          setItems={setLanguagesSpoken}
          placeholder="Add a language"
          ariaLabel="language"
        />

        <h4 className="ep-subtitle">
          <Plane className="ep-icon" size={16} /> Business Trips
        </h4>
        <ListEditor
          items={businessTrips}
          setItems={setBusinessTrips}
          placeholder="Add a trip note"
          ariaLabel="trip"
        />
      </section>

      {/* ===================== 7 — REVIEWS ===================== */}
      <section className="ep-section">
        <h3 className="ep-title">
          <MessageSquareText className="ep-icon" size={18} /> Client Reviews
        </h3>

        <div className="rating-agg">
          <Star className="ep-icon" size={18} />
          <b>Overall Rating:</b>&nbsp;{overallRating} out of 5 stars
          <span className="muted">
            &nbsp; (Based on {ratingCount} reviews)
          </span>
        </div>

        <label className="ep-label">
          Override Reviews Count (optional)
        </label>
        <input
          type="number"
          min={0}
          value={ratingCountOverride ?? reviews.length}
          onChange={(e) => setRatingCountOverride(Number(e.target.value))}
        />

        {reviews.map((r, i) => (
          <div key={i} className="ep-review">
            <label className="ep-label">
              <MessageSquareText className="ep-icon" size={16} /> Text
            </label>
            <textarea
              value={r.text}
              onChange={(e) => {
                const n = [...reviews];
                n[i].text = e.target.value;
                setReviews(n);
              }}
            />
            <div className="ep-grid-3">
              <div>
                <label className="ep-label">
                  <User className="ep-icon" size={16} /> Author
                </label>
                <input
                  value={r.author}
                  onChange={(e) => {
                    const n = [...reviews];
                    n[i].author = e.target.value;
                    setReviews(n);
                  }}
                />
              </div>
              <div>
                <label className="ep-label">
                  <FileText className="ep-icon" size={16} /> Date
                </label>
                <input
                  value={r.date}
                  onChange={(e) => {
                    const n = [...reviews];
                    n[i].date = e.target.value;
                    setReviews(n);
                  }}
                />
              </div>
              <div>
                <label className="ep-label">
                  <Star className="ep-icon" size={16} /> Rating
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={r.rating}
                  onChange={(e) => {
                    const n = [...reviews];
                    n[i].rating = Number(e.target.value);
                    setReviews(n);
                  }}
                />
              </div>
            </div>
            <div style={{ marginTop: 8 }}>
              <button
                className="btn btn--ghost"
                type="button"
                onClick={() =>
                  setReviews(reviews.filter((_, idx) => idx !== i))
                }
              >
                <Trash2 size={16} /> Remove
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="addbar"
          onClick={() =>
            setReviews([
              ...reviews,
              { author: "", date: "", text: "", rating: 5 },
            ])
          }
        >
          <Plus size={16} /> <span>Add Review</span>
        </button>
      </section>

      {/* ===================== 8 — STICKY FOOTER ===================== */}
      <footer className="sticky-footer">
        <button
          className="btn btn--accent"
          type="button"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
        <div className="spacer" />
        <button className="btn" type="button">
          TEXT NOW
        </button>
        <button className="btn" type="button">
          CALL
        </button>
        <button className="btn" type="button">
          BOOK ONLINE
        </button>
        <button className="btn" type="button">
          SAVE PROFILE
        </button>
      </footer>

      {/* estilos mínimos extras específicos deste componente */}
      <style>{`
        .ep-title{ display:flex; align-items:center; gap:8px; margin:0 0 10px; font-weight:800; }
        .ep-subtitle{ display:flex; align-items:center; gap:8px; margin:14px 0 8px; font-weight:700; opacity:.95 }
        .ep-label{ display:flex; align-items:center; gap:6px; font-weight:700; margin:10px 0 6px; }
        .ep-icon{ opacity:.9; }
        .ep-rowline{ display:flex; gap:8px; align-items:center; margin-bottom:8px; }
        .addbar{ display:inline-flex; align-items:center; gap:8px; margin-top:8px; padding:8px 12px; border-radius:10px; border:1px dashed rgba(139,92,246,.55); background:rgba(139,92,246,.06); color:#e9e9f1; font-weight:800; cursor:pointer; }
        .addbar:hover{ background: rgba(139,92,246,.12); }
        .ep-checks{ display:flex; flex-wrap:wrap; gap:10px; margin:6px 0 10px; }
        .check{ display:flex; align-items:center; gap:6px; padding:6px 10px; border-radius:8px; background:rgba(139,92,246,.08); }
        .ep-grid-2{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .ep-grid-3{ display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; }
        .ep-avail .ep-av{ display:grid; grid-template-columns: 160px 1fr 1fr; align-items:center; gap:10px; margin-bottom:8px; }
        .rating-agg{ display:flex; align-items:center; gap:8px; margin: 4px 0 10px; }
        .muted{ opacity:.7 }
        .hint{ margin-top:8px; font-size:.9rem; opacity:.8; display:flex; align-items:center; gap:6px; }
        .ep-checkgrid{ display:grid; gap:8px 14px; align-items:start; margin: 6px 0 8px; }
        .ep-header{ display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
        .ep-actions{ display:flex; gap:8px; align-items:center; }
        .ep-toast{ margin: 8px 0 0; padding:10px 12px; border-radius:10px; font-weight:700; }
        .ep-toast.ok{ background: rgba(34,197,94,.12); border:1px solid rgba(34,197,94,.4); }
        .ep-toast.err{ background: rgba(239,68,68,.12); border:1px solid rgba(239,68,68,.4); }
      `}</style>
    </div>
  );
};

// Ícones simples (sem libs extras)
const GraduationCapIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity: 0.9 }}
  >
    <path
      d="M22 10L12 4 2 10l10 6 10-6Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 12v5c3 2 9 2 12 0v-5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BadgeIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity: 0.9 }}
  >
    <path
      d="M12 2l3 6 6 .9-4.5 4.2 1 6-5.5-3-5.5 3 1-6L3 8.9 9 8l3-6Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default EditProfile;
