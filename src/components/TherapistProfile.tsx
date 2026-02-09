// src/components/TherapistProfile.tsx
"use client";

import { useMemo, useRef, useState, useId, useEffect } from "react";
import "./TherapistProfile.css";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/src/lib/supabase";

/** ===== Visual types ===== */
export type Status = "online" | "away" | "busy" | "offline";
export type GalleryItem = { id: string; url: string };

type Payments = {
  visa: boolean;
  mastercard: boolean;
  amex: boolean;
  discover: boolean;
  cash: boolean;
  venmo: boolean;
  zelle: boolean;
};

type Discounts = { regular?: string; weekday?: string; weekly?: string };

type AvailabilitySimple = { day: string; hours: string };
export type AvailabilityExtended = {
  day: string;
  incallHours: string;
  mobileHours: string;
};
export type Review = { id: string; author: string; rating: number; text: string };

/** ===== Storage ===== */
const BUCKET = "profiles";
const MAX_GALLERY = 5;

/** ===== Build-safe ID helpers ===== */
const rid = () =>
  (globalThis as any)?.crypto?.randomUUID?.() ??
  Math.random().toString(36).slice(2) + Date.now().toString(36);

/** ===== UI model (mock/preview only) ===== */
export type Therapist = {
  id: string;
  name: string;
  title: string;
  rating: number;
  ratingCount?: number;
  locationCityState: string;
  services: string;
  specialties: string;
  promocoes?: string;
  startingAt: string;

  visitingFrom?: string;
  address?: string;
  zipCode?: string;
  accessNotes?: string;
  rates?: Array<{ name: string; duration: string; price: string; notes?: string }>;
  availability?: Array<AvailabilitySimple> | Array<AvailabilityExtended>;
  reviews?: Array<Review>;
  bio?: string;

  profilePhoto: string;
  gallery: GalleryItem[];

  philosophy?: string[];
  techniques?: string[];
  mobileRadius?: string;
  mobileMiles?: number;
  massageSetup?: string;
  studioAmenities?: string[];
  mobileExtras?: string[];
  additionalServices?: string[];
  productsUsed?: string[];
  policies?: string;
  payments?: Payments;
  discounts?: Discounts;
  degrees?: string[];
  affiliations?: string[];
  startDate?: string;
  languagesSpoken?: string[];
  businessTrips?: string[];

  // gate fields (read-only in UI)
  statusRaw?: string | null;
  planRaw?: string | null;
  paidUntilRaw?: string | null;
  subStatusRaw?: string | null;

  // edit indicators
  hasPendingEdits?: boolean;
  pendingEditsCount?: number;
};

/** ===== Mock visual fallback (only when no DB record exists) ===== */
const SAMPLE: Therapist = {
  id: "sample",
  name: "Bruno",
  title: "Professional Massage Therapist",
  rating: 4.9,
  ratingCount: 126,
  locationCityState: "Dallas, TX",
  services: "In-studio & mobile services",
  specialties: "Deep Tissue, Shiatsu, Swedish",
  promocoes: "25% Off",
  startingAt: "$90",
  visitingFrom: "Chicago, IL",
  address: "Near Main St & Elm Ave",
  zipCode: "75201",
  accessNotes: "Private studio, free parking at the back entrance.",
  rates: [
    { name: "Session", duration: "60 min", price: "$90" },
    { name: "Session", duration: "90 min", price: "$120" },
    { name: "Session", duration: "120 min", price: "$150" },
  ],
  availability: [
    { day: "Mon-Fri", hours: "7 a.m. - 11 p.m." },
    { day: "Sat", hours: "8 a.m. - 10 p.m." },
    { day: "Sun", hours: "10 a.m. - 8 p.m." },
  ],
  reviews: [
    {
      id: "r1",
      author: "J.B., Dallas, TX",
      rating: 5,
      text: "Bruno is incredibly professional and intuitive. Studio was clean and calming.",
    },
    {
      id: "r2",
      author: "M.R., Chicago, IL",
      rating: 5,
      text: "Relaxing and therapeutic. Excellent communication.",
    },
    {
      id: "r3",
      author: "A.S., Dallas, TX",
      rating: 5,
      text: "Great pressure and technique. I felt new afterwards.",
    },
  ],
  bio: "I believe every massage should be more than a service - it's an exchange of presence, trust, and energy...",
  profilePhoto:
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1600&auto=format&fit=crop",
  gallery: [
    {
      id: "g1",
      url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "g2",
      url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1600&auto=format&fit=crop",
    },
  ],
  philosophy: [
    "Over 6 years of professional experience...",
    "Certified in integrated bodywork...",
    "Dedicated to creating a safe environment...",
  ],
  techniques: [
    "Deep Tissue",
    "Shiatsu",
    "Swedish (Relaxing)",
    "Sports Massage",
    "Trigger Point Therapy",
    "Eastern Bodywork",
  ],
  mobileRadius: "15 miles from Dallas city center",
  mobileMiles: 15,
  massageSetup: "Private studio with adjustable massage table...",
  studioAmenities: [
    "Hot Towels",
    "Refreshments (Water, Tea)",
    "Private Shower available",
    "Comfortable waiting area",
  ],
  mobileExtras: ["Portable speaker for ambiance", "Essential oil diffuser"],
  additionalServices: ["Cupping", "Aromatherapy"],
  productsUsed: ["Organic massage oils", "Premium lotions"],
  policies: "Please arrive on time...",
  payments: {
    visa: true,
    mastercard: true,
    amex: true,
    discover: true,
    cash: true,
    venmo: false,
    zelle: true,
  },
  discounts: {
    regular: "Senior, student, and package discounts available.",
    weekday: "Check Tuesday & Wednesday specials.",
    weekly: "See this week's featured offers.",
  },
  degrees: [
    "Certified Massage Therapist (CMT) - American Massage Academy (2017)",
    "Bachelor's Degree in Kinesiology - University of Texas (2015)",
  ],
  affiliations: [
    "Member: National Association of Massage Therapists (NAMT)",
    "Member: American Massage Therapy Association (AMTA)",
  ],
  startDate: "Practicing since: January 2018",
  languagesSpoken: ["English", "Spanish"],
  businessTrips: [
    "Next Visits to Chicago, IL: Dec 5 - Dec 15, 2024 (Bookings open)",
    "Past Visits - Miami, FL: Jan 20 - Feb 1, 2024",
  ],
};

/** ===== Utils ===== */
function asArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.filter((v) => typeof v === "string") as string[];
  if (val == null) return [];
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed.filter((v) => typeof v === "string");
    } catch {}
    return val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function coerceGallery(g: unknown): GalleryItem[] {
  if (!g) return SAMPLE.gallery;
  if (Array.isArray(g)) {
    if (g.length && typeof g[0] === "string") {
      return (g as string[]).map((url, i) => ({ id: rid() + i, url }));
    }
    return g as GalleryItem[];
  }
  return SAMPLE.gallery;
}

/** ===== Raw DB type (therapists table) ===== */
type DbTherapist = {
  id?: string | null;
  user_id: string;

  // Basics
  full_name: string | null;
  display_name?: string | null;
  headline: string | null;
  about: string | null;
  philosophy: string | null;

  email?: string | null;
  phone?: string | null;

  // New location
  city: string | null;
  state: string | null;
  country: string | null;
  neighborhood: string | null;
  address: string | null;
  zip_code: string | null;
  nearest_intersection: string | null;
  latitude?: string | null;
  longitude?: string | null;
  mobile_service_radius: number | null;

  // Legacy location (fallback)
  location?: string | null;
  locationCityState?: string | null;

  // Services / headings
  services_headline: string | null;
  specialties_headline: string | null;
  promotions_headline: string | null;

  // Detailed services (arrays)
  services?: string[] | string | null;
  massage_techniques: string[] | string | null;
  studio_amenities: string[] | string | null;
  mobile_extras: string[] | string | null;
  additional_services: string[] | string | null;
  products_used: string | null;

  // Pricing
  rate_60: string | null;
  rate_90: string | null;
  rate_outcall: string | null;
  payment_methods: string[] | string | null;

  // Discounts
  regular_discounts: string | null;
  day_of_week_discount: string | null;
  weekly_specials: string | null;
  special_discount_groups: string[] | string | null;

  // Availability (JSON from Edit-Profile)
  availability: any | null;

  // Credentials
  degrees: string | null;
  affiliations: string[] | string | null;
  massage_start_date: string | null;
  languages: string[] | string | null;
  business_trips: string | string[] | null;

  // Reviews / rating
  rating: number | null;
  override_reviews_count: number | null;
  reviews?: Review[] | null;

  // Social
  website: string | null;
  instagram: string | null;
  whatsapp: string | null;

  // Meta
  birthdate: string | null;
  years_experience: number | null;

  // Media
  profile_photo: string | null;
  gallery: string[] | { id: string; url: string }[] | null;

  // Other
  travel_radius: string | null;
  accepts_first_timers: boolean | null;
  prefers_lgbtq_clients: boolean | null;
  accessNotes?: string | null;
  mobileMiles?: number | null;

  // Plan / billing / gate
  agree_terms?: boolean | null;
  plan?: string | null;
  plan_name?: string | null;
  price_monthly?: number | null;
  updated_at?: string | null;

  status?: string | null;
  paid_until?: string | null;
  subscription_status?: string | null;
  stripe_current_period_end?: string | null;

  // Legacy fallbacks to keep compatibility
  promocoes?: string | null;
  title?: string | null;
  bio?: string | null;
  languagesSpoken?: string[] | null;
  studioAmenities?: string[] | null;
  mobileExtras?: string[] | null;
  additionalServices?: string[] | null;
  productsUsedArr?: string[] | null;
  policies?: string | null;
  payments?: Payments | null;
  discounts?: Discounts | null;
  discountGroups?: string[] | null;
  rateDisclaimers?: string[] | null;
  rates?: Therapist["rates"] | null;
  degreesArr?: string[] | null;
  affiliationsArr?: string[] | null;
  startDate?: string | null;
  businessTripsArr?: string[] | null;
  ratingCount?: number | null;
};

/** ===== NEW: pending edits counter ===== */
async function loadPendingEditsCount(therapistId: string) {
  try {
    const { count, error } = await supabase
      .from("profile_edits")
      .select("*", { count: "exact", head: true })
      .eq("therapist_id", therapistId)
      .eq("status", "pending");

    if (error) {
      return 0;
    }

    return count || 0;
  } catch {
    return 0;
  }
}

/** ===== Availability helpers (JSON -> UI) ===== */
function mapAvailabilityFromJson(av: any): Therapist["availability"] {
  if (!av || typeof av !== "object") return [];

  const result: AvailabilityExtended[] = [];

  for (const day of Object.keys(av)) {
    const info = av[day] || {};
    const incall = info.incall || {};
    const outcall = info.outcall || {};

    const incallStr =
      incall.start && incall.end ? `${incall.start} - ${incall.end}` : "";
    const outcallStr =
      outcall.start && outcall.end ? `${outcall.start} - ${outcall.end}` : "";

    if (!incallStr && !outcallStr) continue;

    result.push({
      day,
      incallHours: incallStr || "-",
      mobileHours: outcallStr || "-",
    });
  }

  return result;
}

/** ===== Gate helpers (therapists) ===== */
function isAdminApproved(row?: DbTherapist | null) {
  return (row?.status ?? "").toLowerCase() === "active";
}

function isPaymentOkByTherapists(row?: DbTherapist | null) {
  const plan = (row?.plan || "").toLowerCase();
  if (plan === "free") return true;

  const sub = (row?.subscription_status || "").toLowerCase();
  if (sub === "active" || sub === "trialing") return true;

  const now = Date.now();
  const paidUntil = row?.paid_until ? Date.parse(row.paid_until) : undefined;
  const periodEnd = row?.stripe_current_period_end
    ? Date.parse(row.stripe_current_period_end)
    : undefined;
  if (typeof paidUntil === "number" && paidUntil > now) return true;
  if (typeof periodEnd === "number" && periodEnd > now) return true;

  return false;
}

/** ===== Payment lookup: status 'paid' (by user_id or email/text) ===== */
async function hasPaidOnPayments(opts: { uid?: string | null; email?: string | null }) {
  const { uid, email } = opts;
  const now = Date.now();

  if (uid) {
    const { data, error } = await supabase
      .from("payments")
      .select("status, paid_until")
      .eq("user_id", uid)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (!error && data?.length) {
      const row: any = data[0];
      if (row.status !== "paid") return false;
      if (!row.paid_until) return true;
      const exp = Date.parse(row.paid_until);
      return typeof exp === "number" && !Number.isNaN(exp) && exp > now;
    }
  }

  if (email) {
    const { data } = await supabase
      .from("payments")
      .select("status, paid_until")
      .or(`customer_email.eq.${email},email.eq.${email},txt.eq.${email}`)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (data?.length) {
      const row: any = data[0];
      if (row.status !== "paid") return false;
      if (!row.paid_until) return true;
      const exp = Date.parse(row.paid_until);
      return typeof exp === "number" && !Number.isNaN(exp) && exp > now;
    }
  }

  return false;
}

/** ===== Map DB -> UI ===== */
function dbToUi(row: DbTherapist | null | undefined): Therapist {
  // if there is no DB record, use the full mock
  if (!row) return { ...SAMPLE };

  // base starts empty (except photo/gallery)
  const baseEmpty: Therapist = {
    ...SAMPLE,
    id: "",
    name: "",
    title: "",
    rating: 0,
    ratingCount: undefined,
    locationCityState: "",
    services: "",
    specialties: "",
    promocoes: "",
    startingAt: "",
    visitingFrom: "",
    address: "",
    zipCode: "",
    accessNotes: "",
    rates: [],
    availability: [],
    reviews: [],
    bio: "",
    philosophy: [],
    techniques: [],
    mobileRadius: "",
    mobileMiles: undefined,
    studioAmenities: [],
    mobileExtras: [],
    additionalServices: [],
    productsUsed: [],
    policies: "",
    payments: {
      visa: false,
      mastercard: false,
      amex: false,
      discover: false,
      cash: false,
      venmo: false,
      zelle: false,
    },
    discounts: {},
    degrees: [],
    affiliations: [],
    startDate: "",
    languagesSpoken: [],
    businessTrips: [],
    statusRaw: null,
    planRaw: null,
    paidUntilRaw: null,
    subStatusRaw: null,
    hasPendingEdits: false,
    pendingEditsCount: 0,
  };

  // Name: only field prefilled by default
  const name = row.display_name?.trim() || row.full_name?.trim() || "";

  // Location
  const locCityState =
    [row.city, row.state].filter(Boolean).join(", ") ||
    row.locationCityState?.trim() ||
    row.location?.trim() ||
    "";

  // About / bio
  const bio = row.about?.trim() || row.bio?.trim() || "";

  // Languages
  const langsNew = Array.isArray(row.languages)
    ? row.languages.filter(Boolean).map(String)
    : asArray(row.languages);
  const langsArr =
    (langsNew && langsNew.length ? langsNew : row.languagesSpoken) || [];

  // services + specialties
  const servicesHeadline = row.services_headline?.trim() || "";
  const servicesArr = asArray(row.services);
  const servicesText =
    servicesHeadline || (servicesArr.length ? servicesArr.join(", ") : "");

  const specialtiesText =
    row.specialties_headline?.trim() ||
    (servicesArr.length ? servicesArr.join(", ") : "");

  // Techniques / setup
  const techniquesArr = asArray(row.massage_techniques);
  const studioAmenitiesArr = asArray(row.studio_amenities);
  const mobileExtrasArr = asArray(row.mobile_extras);
  const additionalServicesArr = asArray(row.additional_services);

  let productsUsedArr: string[] = [];
  if (Array.isArray(row.products_used)) {
    productsUsedArr = (row.products_used as any[]).map(String);
  } else if (typeof row.products_used === "string") {
    productsUsedArr = row.products_used
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  // Payment methods (array -> object)
  const pmArray = asArray(row.payment_methods);
  let payments: Payments;
  if (pmArray.length) {
    payments = {
      visa: pmArray.some((p) => /visa/i.test(p)),
      mastercard: pmArray.some((p) => /master/i.test(p)),
      amex: pmArray.some((p) => /(amex|american)/i.test(p)),
      discover: pmArray.some((p) => /discover/i.test(p)),
      cash: pmArray.some((p) => /cash/i.test(p)),
      venmo: pmArray.some((p) => /venmo/i.test(p)),
      zelle: pmArray.some((p) => /zelle/i.test(p)),
    };
  } else {
    payments =
      row.payments ?? {
        visa: false,
        mastercard: false,
        amex: false,
        discover: false,
        cash: false,
        venmo: false,
        zelle: false,
      };
  }

  // Discounts
  const discounts: Discounts = {
    regular: row.regular_discounts || row.discounts?.regular,
    weekday: row.day_of_week_discount || row.discounts?.weekday,
    weekly: row.weekly_specials || row.discounts?.weekly,
  };

  // Availability
  const availability = mapAvailabilityFromJson(row.availability);

  // Trips (textarea => list)
  let businessTrips: string[] | undefined;
  if (Array.isArray(row.business_trips)) {
    businessTrips = row.business_trips.filter(Boolean).map(String);
  } else if (typeof row.business_trips === "string") {
    businessTrips = row.business_trips
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  } else {
    businessTrips = row.businessTripsArr || [];
  }

  // Simple rates
  const rates: Therapist["rates"] = [];
  if (row.rate_60) {
    rates.push({
      name: "Session",
      duration: "60 min",
      price: row.rate_60,
      notes: row.rate_outcall ? `Outcall: ${row.rate_outcall}` : undefined,
    });
  }
  if (row.rate_90) {
    rates.push({
      name: "Session",
      duration: "90 min",
      price: row.rate_90,
      notes: row.rate_outcall ? `Outcall: ${row.rate_outcall}` : undefined,
    });
  }

  // startingAt = first price
  const startingAt = row.rate_60 || "";

  // Philosophy
  const philosophyArr = row.philosophy ? [row.philosophy] : [];

  // Start date
  const startDate =
    row.massage_start_date
      ? `Practicing since: ${new Date(row.massage_start_date).toLocaleDateString()}`
      : row.startDate ?? "";

  // Mobile miles
  const mobileMiles =
    typeof row.mobileMiles === "number" && !Number.isNaN(row.mobileMiles)
      ? row.mobileMiles
      : typeof row.mobile_service_radius === "number" &&
        !Number.isNaN(row.mobile_service_radius)
      ? row.mobile_service_radius
      : undefined;

  const ui: Therapist = {
    ...baseEmpty,

    id: row.user_id || "",
    name,
    title: row.headline?.trim() || row.title?.trim() || "",
    bio,
    locationCityState: locCityState,
    zipCode: row.zip_code || "",
    address: row.nearest_intersection || row.address || "",

    profilePhoto: row.profile_photo || SAMPLE.profilePhoto,
    gallery: coerceGallery(row.gallery ?? SAMPLE.gallery),

    services: servicesText,
    specialties: specialtiesText,
    promocoes: row.promotions_headline ?? row.promocoes ?? "",
    startingAt,

    languagesSpoken: langsArr,

    mobileMiles,
    mobileRadius:
      typeof mobileMiles === "number"
        ? `${mobileMiles} miles`
        : row.travel_radius ||
          (typeof row.mobile_service_radius === "number"
            ? `${row.mobile_service_radius} miles`
            : ""),

    philosophy: philosophyArr,
    techniques: techniquesArr,
    // massageSetup column does not exist in DB, so we use user text only (change later if needed)
    massageSetup: baseEmpty.massageSetup,
    studioAmenities: studioAmenitiesArr,
    mobileExtras: mobileExtrasArr,
    additionalServices: additionalServicesArr,
    productsUsed: productsUsedArr,

    policies: row.policies ?? "",
    payments,
    discounts,
    availability,
    rates: rates && rates.length ? rates : row.rates ?? [],

    degrees: row.degrees ? asArray(row.degrees) : row.degreesArr ?? [],
    affiliations: asArray(row.affiliations ?? row.affiliationsArr) || [],
    startDate,
    businessTrips,

    reviews: row.reviews ?? [],
    rating: row.rating ?? 0,
    ratingCount: row.override_reviews_count ?? row.ratingCount ?? undefined,

    accessNotes: row.accessNotes ?? "",

    statusRaw: row.status ?? null,
    planRaw: row.plan ?? null,
    paidUntilRaw: row.paid_until ?? row.stripe_current_period_end ?? null,
    subStatusRaw: row.subscription_status ?? null,
  };

  return ui;
}

/** ===== Component ===== */
export default function TherapistProfile() {
  const router = useRouter();
  const params = useParams();
  const routeIdRaw = (params as any)?.id;
  const routeId =
    typeof routeIdRaw === "string"
      ? routeIdRaw
      : Array.isArray(routeIdRaw)
      ? routeIdRaw[0]
      : undefined;

  const [data, setData] = useState<Therapist>(SAMPLE);
  const [status] = useState<Status>("online");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const [saving, setSaving] = useState(false);

  const [isOwner, setIsOwner] = useState(false);
  const [adminApproved, setAdminApproved] = useState<boolean>(false);
  const [paymentOk, setPaymentOk] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const [shouldPoll, setShouldPoll] = useState(false);
  const pollStopAtRef = useRef<number | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  // ===== Auth helpers =====
  async function getUid(): Promise<string> {
    const { data: auth } = await supabase.auth.getUser();
    const uid = auth?.user?.id;
    if (!uid) throw new Error("Please log in to continue.");
    return uid;
  }

  function extFromType(file: File) {
    const m = file.type.split("/")[1] || "bin";
    return m === "jpeg" ? "jpg" : m;
  }

  async function uploadToStorage(file: File, path: string) {
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type || "application/octet-stream",
    });
    if (error) throw error;
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl as string;
  }

  // ===== Load profile (self/public) + resolve owner/admin + gate =====
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const { data: auth } = await supabase.auth.getUser();
        const uid = auth?.user?.id || null;
        const email = auth?.user?.email || null;

        if (!routeId && !uid) {
          router.replace("/login");
          setLoading(false);
          return;
        }

        let adminFlag = false;
        if (uid) {
          const { data: prof } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", uid)
            .maybeSingle();
          adminFlag = !!prof?.is_admin;
        }
        if (mounted) setIsAdmin(adminFlag);

        const owner = routeId ? uid === routeId : !!uid;
        if (mounted) setIsOwner(owner);

        const q = supabase.from("therapists").select("*").limit(1);
        const { data: rowData, error } = routeId
          ? await q.eq("user_id", routeId)
          : await q.eq("user_id", uid as string);

        if (error) throw error;
        const row = (rowData?.[0] as DbTherapist) ?? null;

        const ui = dbToUi(row);

        // load pending edits counter (by therapists.id)
        const therapistRowId = row?.id || null;
        const pendingCount = therapistRowId
          ? await loadPendingEditsCount(therapistRowId)
          : 0;
        ui.hasPendingEdits = pendingCount > 0;
        ui.pendingEditsCount = pendingCount;

        const approved = isAdminApproved(row);
        const paidTherapists = isPaymentOkByTherapists(row);
        const paidPayments = await hasPaidOnPayments({ uid, email });
        const paid = paidTherapists || paidPayments;

        if (mounted) {
          setAdminApproved(approved);
          setPaymentOk(paid);
        }

        if (owner) {
          const fromLocal = localStorage.getItem("mm_profile");
          if (fromLocal) {
            try {
              const parsed = JSON.parse(fromLocal) as Partial<Therapist>;
              const merged: Therapist = {
                ...ui,
                ...parsed,
                gallery: coerceGallery((parsed as any).gallery ?? ui.gallery),
                profilePhoto: parsed.profilePhoto ?? ui.profilePhoto,
                techniques: parsed.techniques ?? ui.techniques,
                studioAmenities: parsed.studioAmenities ?? ui.studioAmenities,
                mobileExtras: parsed.mobileExtras ?? ui.mobileExtras,
                additionalServices: parsed.additionalServices ?? ui.additionalServices,
                productsUsed: parsed.productsUsed ?? ui.productsUsed,
                languagesSpoken: parsed.languagesSpoken ?? ui.languagesSpoken,
                hasPendingEdits: ui.hasPendingEdits,
                pendingEditsCount: ui.pendingEditsCount,
              };
              if (mounted) setData(merged);
            } catch {
              if (mounted) setData(ui);
            }
          } else if (mounted) {
            setData(ui);
          }
        } else if (mounted) {
          setData(ui);
        }

        if (owner && !(approved && paid)) {
          pollStopAtRef.current = Date.now() + 2 * 60 * 1000;
          setShouldPoll(true);
        } else {
          setShouldPoll(false);
        }
      } catch (e: any) {
        if (mounted) setErr(e?.message || "Failed to load profile.");
        if (mounted) setData(SAMPLE);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [routeId, router]);

  // ===== Light polling to unlock right after payment/webhook =====
  useEffect(() => {
    if (!shouldPoll) return;
    let canceled = false;

    const tick = async () => {
      if (canceled) return;
      if (pollStopAtRef.current && Date.now() > pollStopAtRef.current) {
        setShouldPoll(false);
        return;
      }
      try {
        const { data: auth } = await supabase.auth.getUser();
        const uid = auth?.user?.id || null;
        const email = auth?.user?.email || null;
        const key = routeId || uid;
        if (!key) return;

        const { data: rowData } = await supabase
          .from("therapists")
          .select("*")
          .eq("user_id", key)
          .maybeSingle<DbTherapist>();

        const row = rowData || null;

        const approved = isAdminApproved(row || undefined);
        const paidTherapists = isPaymentOkByTherapists(row || undefined);
        const paidPayments = await hasPaidOnPayments({ uid, email });
        const paid = paidTherapists || paidPayments;

        setAdminApproved(approved);
        setPaymentOk(paid);

        if (approved && paid) {
          const ui = dbToUi(row || null);
          const therapistRowId = row?.id || null;
          const pendingCount = therapistRowId
            ? await loadPendingEditsCount(therapistRowId)
            : 0;
          ui.hasPendingEdits = pendingCount > 0;
          ui.pendingEditsCount = pendingCount;
          setData(ui);
          setShouldPoll(false);
        }
      } catch {
        // silencioso
      }
    };

    const id = setInterval(tick, 8000);
    tick();
    return () => {
      canceled = true;
      clearInterval(id);
    };
  }, [shouldPoll, routeId]);

  /** ===== Persist profilePhoto and gallery in DB (owner only) ===== */
  async function saveProfile(partial: Partial<Therapist>) {
    if (!isOwner) {
      alert("Only the profile owner can change photos.");
      return;
    }
    const uid = await getUid();
    setSaving(true);
    try {
      const payload: Partial<DbTherapist> = {
        profile_photo: partial.profilePhoto ?? data.profilePhoto,
        gallery: (partial.gallery ?? data.gallery).map((g) =>
          typeof g === "string" ? g : (g as any).url
        ),
        updated_at: new Date().toISOString(),
      } as any;

      const { error } = await supabase
        .from("therapists")
        .update(payload)
        .eq("user_id", uid);

      if (error) throw error;

      setData((prev) => ({
        ...prev,
        profilePhoto: payload.profile_photo || prev.profilePhoto,
        gallery: ((payload.gallery as any[]) || prev.gallery).map((url: string) => ({
          id: rid(),
          url,
        })),
      }));

      if (isOwner) {
        const cached = {
          ...data,
          profilePhoto: payload.profile_photo || data.profilePhoto,
          gallery: ((payload.gallery as any[]) || data.gallery).map((url: string) => ({
            id: rid(),
            url,
          })),
        };
        localStorage.setItem("mm_profile", JSON.stringify(cached));
      }
    } finally {
      setSaving(false);
    }
  }

  /** ===== Image handlers (owner only) ===== */
  function openFileDialog() {
    if (!isOwner) return;
    fileRef.current?.click();
  }

  async function handleAddImages(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isOwner) return;
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    e.target.value = "";

    try {
      const uid = await getUid();
      const space = Math.max(0, MAX_GALLERY - data.gallery.length);
      const slice = files.slice(0, space);
      if (!slice.length) return;

      const urls = await Promise.all(
        slice.map(async (file) => {
          const ext = extFromType(file);
          const objectPath = `${uid}/gallery/${rid()}.${ext}`;
          const publicUrl = await uploadToStorage(file, objectPath);
          return publicUrl;
        })
      );

      const newGallery = [...data.gallery.map((g) => g.url), ...urls];
      await saveProfile({
        gallery: newGallery.map((url) => ({ id: rid(), url })),
      });
    } catch {
      alert("Failed to upload images. Please try again.");
    }
  }

  function setAsProfile(url: string) {
    if (!isOwner) return;
    saveProfile({ profilePhoto: url }).catch(() => {
      alert("Failed to save profile photo.");
    });
  }

  function removeFromGallery(id: string) {
    if (!isOwner) return;
    const remaining = data.gallery.filter((g) => g.id !== id);
    saveProfile({ gallery: remaining }).catch(() => {
      alert("Failed to remove image.");
    });
  }

  /** ===== Logout (owner only) ===== */
  async function handleLogout() {
    try {
      setSigningOut(true);
      await supabase.auth.signOut();
      localStorage.removeItem("mm_profile");
      router.replace("/login");
    } catch (e) {
      console.error(e);
      alert("Could not sign out. Please try again.");
    } finally {
      setSigningOut(false);
    }
  }

  /** ===== UI Helpers ===== */
  const overallRating = useMemo(() => {
    if (!data.reviews?.length) return data.rating;
    const avg =
      data.reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / data.reviews.length;
    return Math.round(avg * 10) / 10;
  }, [data.reviews, data.rating]);

  const roundedRating = Math.round(overallRating);

  const textCircleId = useId();
  const textOffsetDeg = 10;
  const startOffsetPercent = `${(textOffsetDeg % 360) / 2.6}%`;

  const mapQuery = useMemo(() => {
    const parts: string[] = [];
    if (data.address) parts.push(data.address);
    if (data.locationCityState) parts.push(data.locationCityState);
    if (data.zipCode) parts.push(data.zipCode);
    return parts.join(", ").trim();
  }, [data.address, data.locationCityState, data.zipCode]);

  const mapEmbedSrc = mapQuery
    ? `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`
    : undefined;

  const mapDirectionsHref = mapQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        mapQuery
      )}`
    : undefined;

  const mobileRadiusText = useMemo(() => {
    if (typeof data.mobileMiles === "number" && !Number.isNaN(data.mobileMiles)) {
      return `${data.mobileMiles} miles`;
    }
    return data.mobileRadius;
  }, [data.mobileMiles, data.mobileRadius]);

  /** ===== Loading/error screen ===== */
  if (loading) {
    return (
      <main className="page">
        <p style={{ color: "#fff", padding: "1rem" }}>Loading...</p>
      </main>
    );
  }

  if (err) {
    return (
      <main className="page">
        <p style={{ color: "#fff", padding: "1rem" }}>{err}</p>
      </main>
    );
  }

  /** ===== Gate (standard users need approval + payment; ADMIN bypass) ===== */
  const unlocked = isAdmin || (adminApproved && paymentOk);

  if (!unlocked) {
    const reasons: string[] = [];
    if (!adminApproved)
      reasons.push("your profile is still under review by the team (status: pending).");
    if (adminApproved && !paymentOk)
      reasons.push("your payment or subscription is not active right now.");

    const planLabel = (data.planRaw || "-").toString();
    const validity = data.paidUntilRaw
      ? `Valid until: ${new Date(data.paidUntilRaw).toLocaleString()}`
      : null;
    const subStatus = data.subStatusRaw
      ? `Subscription status: ${data.subStatusRaw}`
      : null;

    return (
      <main className="tp container">
        <section className="tp-block">
          <h2 className="tp-block__title">Profile Locked</h2>
          <article className="tp-box tp-box--wide">
            <p className="tp-p">
              This professional profile is not public yet because{" "}
              {reasons.join(" and ")}
            </p>

            <ul className="tp-list" style={{ marginTop: 8 }}>
              <li>
                <strong>Plan:</strong> {planLabel}
              </li>
              {validity && <li>{validity}</li>}
              {subStatus && <li>{subStatus}</li>}
              {!adminApproved && (
                <li>
                  When approved, the status will change to <b>active</b>.
                </li>
              )}
              {adminApproved && !paymentOk && (
                <li>Activate or renew your subscription to unlock the profile.</li>
              )}
            </ul>

            <div className="tp-actions-row" style={{ marginTop: 12 }}>
              {isOwner ? (
                <>
                  {!adminApproved && (
                    <button className="btn" onClick={() => router.push("/pending")}>
                      Track approval
                    </button>
                  )}
                  {!paymentOk && (
                    <button
                      className="btn btn--accent"
                      onClick={() => router.push("/join")}
                    >
                      Go to plans / payment
                    </button>
                  )}
                  <button
                    className="btn btn--ghost"
                    onClick={() => router.push("/edit-profile")}
                  >
                    Edit details
                  </button>
                </>
              ) : (
                <button className="btn" onClick={() => router.push("/explore")}>
                  See other professionals
                </button>
              )}
            </div>

            {isOwner && (
              <div className="tp-actions-row" style={{ marginTop: 8 }}>
                <button
                  className="btn btn--ghost"
                  onClick={() => setShouldPoll(true)}
                  title="Recheck status"
                >
                  Check again
                </button>
                {shouldPoll && (
                  <span className="tp-muted">Checking for updates...</span>
                )}
              </div>
            )}
          </article>
        </section>
      </main>
    );
  }

  /** ===== Normal render (unlocked) ===== */
  return (
    <main className={`tp container status-${status}`}>
      <div className="tp-grid" aria-hidden />

      {/* Pending edits banner */}
      {isOwner && data.hasPendingEdits && (
        <div
          style={{
            background:
              "radial-gradient(circle at top left, rgba(234, 179, 8, 0.2), rgba(15, 23, 42, 0.95))",
            border: "1px solid rgba(234, 179, 8, 0.5)",
            borderRadius: "1.1rem",
            padding: "1.125rem 1.25rem",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            boxShadow: "0 14px 32px rgba(15, 23, 42, 1)",
          }}
        >
          <span style={{ fontSize: "16px", fontWeight: 700 }}>Pending</span>
          <div>
            <p
              style={{
                margin: 0,
                fontWeight: 600,
                color: "#fde68a",
                fontSize: "0.95rem",
              }}
            >
              {data.pendingEditsCount}{" "}
              {data.pendingEditsCount === 1 ? "pending edit" : "pending edits"}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "0.875rem",
                color: "rgba(253, 230, 138, 0.7)",
              }}
            >
              Your changes are awaiting admin approval
            </p>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="tp-hero tp-hero--mock">
        <div className="tp-hero-left">
          <div className="tp-avatar tp-avatar--framed">
            <svg
              className="tp-circletxt tp-circletxt--static"
              viewBox="-8 -8 116 116"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden
              style={{ overflow: "visible" }}
            >
              <defs>
                <path
                  id={textCircleId}
                  d="M50,50 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
                />
              </defs>
              <text>
                <textPath
                  href={`#${textCircleId}`}
                  startOffset={startOffsetPercent}
                  textAnchor="start"
                  dominantBaseline="middle"
                  dy="-1.5"
                >
                  AVAILABLE NOW
                </textPath>
              </text>
            </svg>

            <div className="tp-avatar__clip">
              <img src={data.profilePhoto} alt={`${data.name} profile`} />
            </div>
          </div>

          <div className="tp-rating-under">
            <div
              className="tp-stars-row"
              aria-label={`Rating ${overallRating.toFixed(1)} out of 5`}
            >
              {Array.from({ length: Math.floor(overallRating) }).map((_, i) => (
                <span key={`sf-${i}`} className="star star--full">
                  *
                </span>
              ))}
              {overallRating - Math.floor(overallRating) >= 0.5 && (
                <span className="star star--half">*</span>
              )}
              {Array.from({
                length:
                  5 -
                  Math.floor(overallRating) -
                  (overallRating - Math.floor(overallRating) >= 0.5 ? 1 : 0),
              }).map((_, i) => (
                <span key={`se-${i}`} className="star star--empty">
                  -
                </span>
              ))}
            </div>
            <div className="tp-rating-text">
              <b>{roundedRating}/5</b>
              {data.ratingCount ? (
                <span className="tp-muted">
                  {" "}
                  &nbsp;(Based on {data.ratingCount} reviews)
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="tp-hero-right">
          <h1 className="tp-title">
            Male Massage by {data.name || "Your Name"}
          </h1>
          <div className="tp-subtitle">{data.title}</div>

          <div className="tp-cards">
            <div className="tp-card">
              <div className="tp-card__title">Location</div>
              <div className="tp-card__value">
                {data.locationCityState || "Add your city & state"}
              </div>
              {data.zipCode && (
                <div className="tp-card__muted">ZIP {data.zipCode}</div>
              )}
              {data.visitingFrom && (
                <div className="tp-card__muted">
                  Visiting from {data.visitingFrom}
                </div>
              )}
            </div>

            <div className="tp-card">
              <div className="tp-card__title">Services</div>
              <div className="tp-card__value">
                {data.services || "Describe your services"}{" "}
                {data.startingAt && <>- Starting at {data.startingAt}</>}
              </div>
            </div>

            <div className="tp-card">
              <div className="tp-card__title">Specialties</div>
              <div className="tp-card__value">
                {data.specialties || "Add your specialties"}
              </div>
            </div>

            <div className="tp-card">
              <div className="tp-card__title">Promotions</div>
              <div className="tp-card__value">
                {data.promocoes || "Add promos or leave blank"}
              </div>
            </div>
          </div>

          <div className="tp-actions">
            <button className="btn btn--accent btn--pill">TEXT NOW</button>
            <button className="btn btn--ghost btn--pill">CALL</button>

            {isOwner && (
              <>
                <button
                  className="btn btn--ghost btn--pill"
                  onClick={() => router.push("/edit-profile")}
                >
                  EDIT PROFILE
                </button>
                <button
                  className="btn btn--ghost btn--pill"
                  onClick={handleLogout}
                  disabled={signingOut}
                  title="Sign out"
                >
                  {signingOut ? "Signing out..." : "Log out"}
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* THUMBS */}
      <section className="tp-thumbs-row">
        {isOwner && (
          <>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleAddImages}
            />
            <button
              className="tp-add-tile tp-thumb--fixed"
              type="button"
              onClick={openFileDialog}
            >
              <div className="tp-add-plus">+</div>
              <div className="tp-add-text">Add photo</div>
              <div className="tp-add-count">
                {data.gallery.length}/{MAX_GALLERY}
              </div>
            </button>
          </>
        )}

        {data.gallery.map((g) => {
          const isActive = g.url === data.profilePhoto;
          return (
            <div
              key={g.id}
              className={`tp-thumb tp-thumb--fixed ${
                isOwner && isActive ? "is-active" : ""
              }`}
            >
              <img
                src={g.url}
                alt="Gallery"
                onClick={isOwner ? () => setAsProfile(g.url) : undefined}
                style={{ cursor: isOwner ? "pointer" : "default" }}
              />
              {isOwner && (
                <div className="tp-thumb-bar">
                  <button
                    className="tp-icon-btn tp-icon-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromGallery(g.id);
                    }}
                  >
                    <span className="tp-ico">x</span>
                    <span className="tp-ico-label">Remove</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* ABOUT */}
      <section className="tp-block">
        <h2 className="tp-block__title">ABOUT</h2>
        <article className="tp-box tp-box--wide">
          <h4>About {data.name || "you"}</h4>
          <p className="tp-p">
            {data.bio || "Use the Edit Profile to tell clients about you."}
          </p>
        </article>

        <div className="tp-two-col">
          <article className="tp-box">
            <h4>My Philosophy &amp; Approach</h4>
            {data.philosophy?.length ? (
              <ul className="tp-list">
                {data.philosophy.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            ) : (
              <p className="tp-muted">Add your approach points in Edit Profile.</p>
            )}
          </article>

          <article className="tp-box">
            <h4>Languages &amp; Credentials</h4>
            {data.languagesSpoken?.length ? (
              <p>
                <strong>Languages:</strong> {data.languagesSpoken.join(", ")}
              </p>
            ) : (
              <p className="tp-muted">-</p>
            )}
            {data.affiliations?.length && (
              <>
                <h5 className="tp-sub">Affiliations</h5>
                <ul className="tp-list">
                  {data.affiliations.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </>
            )}
            {data.startDate && <p className="tp-muted">{data.startDate}</p>}
          </article>
        </div>
      </section>

      {/* LOCATION & OFFERINGS */}
      <section className="tp-block">
        <h2 className="tp-block__title">Service Location &amp; Offerings</h2>

        <div className="tp-two-col">
          <article className="tp-box">
            <p>
              <strong>Location & Service Area</strong>
              <br />
              {data.locationCityState || "Add your city & state in Edit Profile"}
            </p>
            {data.zipCode && (
              <p>
                <strong>ZIP:</strong> {data.zipCode}
              </p>
            )}
            {data.visitingFrom && (
              <p>
                <strong>Visiting From:</strong> {data.visitingFrom}
              </p>
            )}
            {data.address && (
              <p>
                <strong>Nearest Intersection:</strong> {data.address}
              </p>
            )}
            {mobileRadiusText && (
              <p>
                <strong>Mobile Service Radius:</strong> {mobileRadiusText}
              </p>
            )}
            {data.accessNotes && <p className="tp-muted">{data.accessNotes}</p>}
            <p>
              <strong>Services:</strong>{" "}
              {data.services || "Add your services list."}
            </p>
            <p>
              <strong>Specialties:</strong>{" "}
              {data.specialties || "Add your specialties."}
            </p>
            {data.startingAt && (
              <p>
                <strong>Starting at:</strong> {data.startingAt}
              </p>
            )}
          </article>

          <article className="tp-box tp-box--map">
            <h4>Map</h4>
            {mapEmbedSrc ? (
              <div className="tp-mapwrap">
                <iframe
                  title="Location Map"
                  src={mapEmbedSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : (
              <p className="tp-muted">
                Add City/State, ZIP or Nearest Intersection to show the map.
              </p>
            )}
            {mapDirectionsHref && (
              <div className="tp-actions-row">
                <a
                  className="btn btn--ghost btn--pill"
                  href={mapDirectionsHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  Map Me
                </a>
              </div>
            )}
          </article>
        </div>

        {data.businessTrips?.length ? (
          <article className="tp-box tp-box--wide">
            <h4>Upcoming Business Trips</h4>
            <ul className="tp-list">
              {data.businessTrips.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </article>
        ) : null}
      </section>

      {/* RATES & PAYMENTS */}
      <section className="tp-block">
        <h2 className="tp-block__title">RATES &amp; PAYMENTS</h2>

        <div className="tp-two-col">
          <article className="tp-box">
            {data.rates?.length ? (
              <div className="tp-portfolio__table">
                <div className="tp-ptable__head">
                  <span>SESSION (MIN)</span>
                  <span>INCALL RATE</span>
                  <span>OUTCALL RATE</span>
                </div>
                {data.rates.map((r, i) => (
                  <div key={i} className="tp-ptable__row">
                    <span>{r.duration}</span>
                    <span className="tp-ptable__price">{r.price}</span>
                    <span className="tp-ptable__notes">
                      {r.notes ?? "Consultation"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="tp-muted">Add your pricing in Edit Profile.</p>
            )}
          </article>

          <article className="tp-box">
            {data.payments && Object.values(data.payments).some(Boolean) && (
              <>
                <h4>Payment Methods</h4>
                <ul className="tp-tags">
                  {Object.entries(data.payments)
                    .filter(([, on]) => on)
                    .map(([k]) => (
                      <li key={k} className="tp-tag">
                        {k.toUpperCase()}
                      </li>
                    ))}
                </ul>
              </>
            )}
            {data.discounts &&
              (data.discounts.regular ||
                data.discounts.weekday ||
                data.discounts.weekly) && (
                <>
                  <h4 style={{ marginTop: 12 }}>Discounts</h4>
                  <ul className="tp-list">
                    {data.discounts.regular && <li>{data.discounts.regular}</li>}
                    {data.discounts.weekday && <li>{data.discounts.weekday}</li>}
                    {data.discounts.weekly && <li>{data.discounts.weekly}</li>}
                  </ul>
                </>
              )}
            {data.policies && (
              <>
                <h4 style={{ marginTop: 12 }}>Policies</h4>
                <p className="tp-p">{data.policies}</p>
              </>
            )}
          </article>
        </div>
      </section>

      {/* AVAILABILITY & SERVICES */}
      <section className="tp-block">
        <h2 className="tp-block__title">AVAILABILITY &amp; SERVICES</h2>

        <div className="tp-as-grid">
          <article className="tp-box">
            <h4>Hours</h4>
            {Array.isArray(data.availability) &&
            (data.availability as any)[0] &&
            "incallHours" in (data.availability as any)[0] ? (
              <div className="tp-ptable tp-ptable--avail">
                <div className="tp-ptable__head">
                  <span>in-studio hours</span>
                  <span>outcall hours</span>
                </div>
                {(data.availability as AvailabilityExtended[]).map((a, i) => (
                  <div key={i} className="tp-ptable__row tp-ptable__row--2">
                    <span>
                      <b>{a.day}:</b> {a.incallHours}
                    </span>
                    <span>{a.mobileHours}</span>
                  </div>
                ))}
              </div>
            ) : data.availability && data.availability.length ? (
              <ul className="tp-list">
                {(data.availability as AvailabilitySimple[]).map((a, i) => (
                  <li key={i}>
                    <strong>{a.day}</strong> - {a.hours}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="tp-muted">Set your availability in Edit Profile.</p>
            )}
          </article>

          <article className="tp-box">
            <h4>Techniques Offered</h4>
            {data.techniques?.length ? (
              <ul className="tp-list">
                {data.techniques.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            ) : (
              <p className="tp-muted">Add techniques in Edit Profile.</p>
            )}
          </article>

          <article className="tp-box">
            <h4>Incall Setup / Mobile</h4>
            {data.massageSetup && <p className="tp-p">{data.massageSetup}</p>}
            {data.studioAmenities?.length && (
              <>
                <h5 className="tp-sub">Studio (Incall) Amenities</h5>
                <ul className="tp-list">
                  {data.studioAmenities.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </>
            )}
            {data.mobileExtras?.length && (
              <>
                <h5 className="tp-sub">Add-ons (Mobile)</h5>
                <ul className="tp-list">
                  {data.mobileExtras.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </>
            )}
            {data.additionalServices?.length && (
              <>
                <h5 className="tp-sub">Additional Services</h5>
                <ul className="tp-list">
                  {data.additionalServices.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </>
            )}
            {data.productsUsed?.length && (
              <>
                <h5 className="tp-sub">Products</h5>
                <ul className="tp-list">
                  {data.productsUsed.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </>
            )}
          </article>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="tp-block">
        <h2 className="tp-block__title">CLIENT REVIEWS</h2>
        {data.reviews?.length ? (
          <>
            <div className="tp-rev-grid">
              {data.reviews.slice(0, 4).map((rv) => (
                <article key={rv.id} className="tp-box">
                  <div className="tp-list__head">
                    <strong>{rv.author}</strong>
                    <span className="tp-stars">{"*".repeat(rv.rating)}</span>
                  </div>
                  <p className="tp-p">{rv.text}</p>
                </article>
              ))}
            </div>
            <article className="tp-box tp-box--wide">
              <h4>
                Overall Rating: {overallRating.toFixed(1)} out of 5 stars{" "}
                {data.ratingCount ? (
                  <span className="tp-muted">
                    (Based on {data.ratingCount} reviews)
                  </span>
                ) : null}
              </h4>
              <div className="tp-actions-row">
                <button className="btn btn--ghost btn--pill">Write a Review</button>
              </div>
            </article>
          </>
        ) : (
          <p className="tp-muted">No reviews yet.</p>
        )}
      </section>

      <footer className="tp-sticky">
        <button className="btn btn--accent">TEXT NOW</button>
        <button className="btn">CALL</button>
        <button className="btn">BOOK ONLINE</button>
        {isOwner && (
          <button className="btn" disabled={saving}>
            {saving ? "SAVING..." : "SAVE PROFILE"}
          </button>
        )}
      </footer>
    </main>
  );
}







