"use client";

import React, { useState } from "react";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import "./Join.css";

// Social Login helpers
const handleSocialLogin = async (provider: 'google' | 'apple') => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/join`,
        queryParams: provider === 'google' ? {
          access_type: 'offline',
          prompt: 'consent',
        } : undefined,
      },
    });

    if (error) throw error;
  } catch (err: any) {
    console.error(`${provider} login error:`, err);
    throw err;
  }
};

type PlanKey = "free" | "standard" | "pro" | "elite";
type Step = 1 | 2 | 3 | 4 | 5 | 6;

/* ===== Idiomas principais ===== */
const LANGUAGE_OPTIONS = [
  "English",
  "Spanish",
  "Portuguese",
  "French",
  "German",
  "Italian",
  "Japanese",
] as const;

/* ===== Copy (English only) ===== */
const TXT = {
  heroBadge: "Limited Founder Membership Available",
  heroTitleLine1: "Where trust meets opportunity",
  heroTitleLine2:
    "Join the premier directory platform connecting massage therapists and wellness professionals with clients. Build your profile, boost your visibility, and grow your practice.",
  heroStats: ["1,000+ Professionals", "4.9/5 Rating", "Growing Fast"],

  whyTitle: "Why Professionals Choose Our Platform",
  whySubtitle:
    "Everything you need to build your online presence and attract more clients",
  whyBullets: [
    {
      title: "Instant Visibility",
      desc: "Get discovered by clients searching for massage and wellness services in your area",
    },
    {
      title: "Verified Profiles",
      desc: "Build trust with verification badges and professional credentials",
    },
    {
      title: "Analytics Dashboard",
      desc: "Track your profile views, engagement, and optimize your presence",
    },
    {
      title: "Real-Time Updates",
      desc: "Let clients know when you're available with instant status updates",
    },
  ],

  plansHeader: "More Visibility. More Trust. More Clients.",
  plansSub:
    "Plans built for massage therapists and wellness professionals — whether you're just starting or already at the top.",
  monthlyNote: "Monthly plans only • cancel anytime",
  founderNote: "First 100 members get Founder badge + 50% lifetime discount.",
  plans: {
    free: {
      name: "Free",
      price: 0,
      tag: "Start My Profile",
      pitch: "Perfect for new professionals.",
      features: [
        "7-day free trial",
        "Up to 3 photos (1 slide)",
        "1 main city",
        '"Available Now" up to 3×/day',
        "Basic Explore ranking",
      ],
    },
    standard: {
      name: "Standard",
      price: 49,
      tag: "Boost Visibility",
      pitch: "For part-time pros ready to grow.",
      features: [
        "Up to 5 photos (2 slides)",
        "1 visiting city",
        '"Available Now" up to 6×/day',
        "Verified Badge + standard support",
      ],
    },
    pro: {
      name: "Pro",
      price: 89,
      tag: "Claim Spotlight",
      pitch: "Best value — most popular choice.",
      features: [
        "Up to 6 photos (2 slides)",
        "Up to 3 visiting cities",
        "Analytics + city heatmap",
        "1 featured credit/month",
      ],
    },
    elite: {
      name: "Elite",
      price: 149,
      tag: "Join Elite Circle",
      pitch: "Limited Founder Offer active.",
      features: [
        "Up to 8 photos (3 slides)",
        "Top homepage placement",
        'Auto "Available" every 2h',
        "2 featured credits/month",
        "Concierge + VIP support",
      ],
    },
  },
  mostPopular: "MOST POPULAR",

  flow: {
    formTitle: "Register Your Professional Profile",
    formNotePlan: "Selected plan: {{plan}}. You can change later.",
    labels: {
      fullName: "Full name",
      displayName: "Display name",
      email: "Email",
      phone: "WhatsApp / Phone",
      location: "ZIP / Postal Code",
      languages: "Languages spoken",
      servicesLegend: "Services offered",
      agree: "I accept the Terms and Privacy Policy.",
      password: "Password (min. 6)",
      password2: "Confirm password",
    },
    placeholders: {
      fullName: "Your full name",
      displayName: "Public display name",
      email: "you@example.com",
      phone: "(000) 000-0000",
      location: "ZIP / Postal Code",
      languages: "Select your main languages",
      password: "Create a password",
      password2: "Repeat the password",
    },
    servicesList: [
      "Relaxing Massage",
      "Deep Tissue",
      "Sports",
      "Lymphatic Drainage",
      "Reflexology",
      "Shiatsu",
      "Mobile service",
    ],

    legalTitle: "Legal Terms & Consent",
    legalAgree:
      "I have read and agree to the Terms of Service, Privacy Policy, Community Guidelines, and Disclaimer. I confirm I am 18+.",
    legalNews: "I'd like to receive product news by email (optional).",

    checklistTitle: "Final Compliance Checklist",
    confirmPoints: [
      "I attest that all information is true and my own.",
      "I will not post explicit, illegal, or policy-violating content.",
      "I will comply with all applicable laws and regulations.",
      "I understand this is a directory (no service/payment intermediation).",
    ],

    paymentTitle: "Complete Verification & Payment",
    paymentSubtitle: "Final step to activate your account",
    paymentNote: "You'll be redirected to Stripe's secure checkout.",
    paymentButton: "Go to Payment",
    paymentFree: "Activate Free Plan",

    activationTitle: "Account Activation in Progress",
    activationSubtitle: "We're processing your information",
    activationSteps: [
      "Plan selected",
      "Registration complete",
      "Terms accepted",
      "Identity verified",
      "Awaiting approval...",
    ],

    btnBack: "Back",
    btnNext: "Continue",
    toastErr: "Fill all required fields.",
    continue: "Continue",
  },
} as const;

/* ===== Plans / Stripe ===== */
const PLANS: Record<
  PlanKey,
  { key: PlanKey; highlight?: boolean; priceMonthly: number }
> = {
  free: { key: "free", priceMonthly: 0 },
  standard: { key: "standard", priceMonthly: 49 },
  pro: { key: "pro", priceMonthly: 89, highlight: true },
  elite: { key: "elite", priceMonthly: 149 },
};

const REQUIRE_ID_VERIFICATION =
  process.env.NEXT_PUBLIC_REQUIRE_ID_VERIFICATION !== "false";

/** Stripe backend URL */
const STRIPE_BACKEND =
  process.env.NEXT_PUBLIC_STRIPE_BACKEND ||
  process.env.NEXT_PUBLIC_STRIPE_BACKEND_URL ||
  process.env.NEXT_PUBLIC_STRIPE_API ||
  "https://backend-massuer-stripe.onrender.com";

const POLICY_VERSION = "2025-11-11";

/* ===== Utils ===== */
function priceLabel(price: number) {
  return `$${price.toFixed(2)}`;
}

/* ===== Auth + Profile ===== */
async function ensureAuthAndUpsertProfile(opts: {
  email: string;
  password: string;
  fullName: string;
  displayName: string;
  phone: string;
  location: string;
  languages: string[];
  services: string[];
  agree: boolean;
  plan: PlanKey;
  planName: string;
  priceMonthly: number;
}) {
  const {
    email,
    password,
    fullName,
    displayName,
    phone,
    location,
    languages,
    services,
    agree,
    plan,
    planName,
    priceMonthly,
  } = opts;

  let userId: string | undefined;
  const { data: signData, error: signErr } = await supabase.auth.signUp({
    email: email.trim(),
    password,
  });

  if (signErr) {
    const alreadyExists =
      (signErr as any).status === 422 ||
      signErr.message?.toLowerCase().includes("already registered") ||
      signErr.message?.toLowerCase().includes("already exists");

    if (alreadyExists) {
      const { data: si, error: siErr } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
      if (siErr) {
        throw new Error(
          "This email already has an account. Please log in or reset your password."
        );
      }
      userId = si.user?.id;
    } else {
      throw signErr;
    }
  } else {
    userId = signData.user?.id;
  }

  if (!userId) throw new Error("Failed to authenticate user.");

  const payload = {
    user_id: userId,
    full_name: fullName.trim(),
    display_name: displayName.trim(),
    email: email.trim(),
    phone: phone.trim(),
    location: location.trim(),
    languages,
    services,
    agree_terms: agree,
    plan,
    plan_name: planName,
    price_monthly: Math.round(Number(priceMonthly) * 100),
    updated_at: new Date().toISOString(),
    status: "pending",
  };

  const { error: upErr } = await supabase
    .from("therapists")
    .upsert(payload, { onConflict: "user_id" });

  if (upErr) throw upErr;

  if (typeof window !== "undefined") {
    localStorage.setItem("mm_user", JSON.stringify({ email: email.trim() }));
  }

  return { userId };
}

/* ===== Step 1: Plan Selection ===== */
function PlanSelection({
  onSelectPlan,
}: {
  onSelectPlan: (plan: PlanKey) => void;
}) {
  const [loading, setLoading] = useState<PlanKey | null>(null);

  const handleSelect = async (key: PlanKey) => {
    setLoading(key);
    await new Promise((r) => setTimeout(r, 250));
    onSelectPlan(key);
    setLoading(null);
  };

  return (
    <section className="container mt-32">
      <div className="center mb-24">
        <h2>{TXT.plansHeader}</h2>
        <p className="muted">{TXT.plansSub}</p>
        <p className="small mt-8">{TXT.monthlyNote}</p>
        <p className="small mt-8 founder-note">
          {TXT.founderNote}
        </p>
      </div>

      <div className="plans-grid">
        {(Object.keys(PLANS) as PlanKey[]).map((key) => {
          const pCfg = PLANS[key];
          const pTxt = TXT.plans[key];
          const cardClass = `card ${pCfg.highlight ? "card--highlight" : ""}`;
          return (
            <div key={key} className={cardClass}>
              {pCfg.highlight && (
                <span className="popular">{TXT.mostPopular}</span>
              )}

              <div className="card-title">{pTxt.name}</div>
              <div className="card-price">
                <b>{priceLabel(pCfg.priceMonthly)}</b>
                <span className="sub">/month</span>
              </div>
              <p className="muted">{pTxt.pitch}</p>

              <ul className="card-list mt-16">
                {pTxt.features.map((f, i) => (
                  <li key={i}>
                    <Check size={18} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`btn btn-block btn-primary mt-16`}
                disabled={loading === key}
                onClick={() => handleSelect(key)}
              >
                {loading === key ? "..." : pTxt.tag}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ===== Step 2: Registration Form ===== */
function RegistrationForm({
  planName,
  onBack,
  onContinue,
}: {
  planName: string;
  onBack: () => void;
  onContinue: (data: any) => void;
}) {
  const L = TXT.flow;
  const [form, setForm] = useState({
    fullName: "",
    displayName: "",
    email: "",
    phone: "",
    location: "",
    languages: [] as string[],
    services: [] as string[],
    agree: false,
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const toggleLanguage = (lang: string) => {
    setForm((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  // Real-time validation
  const validateEmail = (email: string) => {
    if (!email) return "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "";
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  const handleEmailBlur = () => {
    const err = validateEmail(form.email);
    setFieldErrors((prev) => ({ ...prev, email: err }));
  };

  const handlePasswordBlur = () => {
    const err = validatePassword(form.password);
    setFieldErrors((prev) => ({ ...prev, password: err }));
  };

  const handleSubmit = () => {
    if (
      !form.fullName ||
      !form.email ||
      !form.phone ||
      !form.location ||
      !form.agree
    ) {
      setError(L.toastErr);
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Invalid email.");
      return;
    }
    if (form.languages.length === 0) {
      setError("Select at least one language.");
      return;
    }
    if (form.services.length === 0) {
      setError("Select at least one service.");
      return;
    }
    setError("");
    onContinue(form);
  };

  return (
    <section className="section-narrow">
      <h2>{L.formTitle}</h2>
      <p className="muted mb-16">
        {L.formNotePlan.replace("{{plan}}", planName)}
      </p>

      {error && <div className="alert alert-error mb-16">{error}</div>}

      {/* Social Login Options - 2025 Best Practice */}
      <div className="mb-16">
        <div className="grid gap-3 sm:grid-cols-2 mb-6">
          <button
            type="button"
            className="btn btn-ghost btn-outline-stroke flex items-center justify-center gap-2"
            onClick={async () => {
              try {
                await handleSocialLogin('google');
              } catch (err: any) {
                setError(err?.message || 'Failed to login with Google');
              }
            }}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-outline-stroke flex items-center justify-center gap-2"
            onClick={async () => {
              try {
                await handleSocialLogin('apple');
              } catch (err: any) {
                setError(err?.message || 'Failed to login with Apple');
              }
            }}
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Continue with Apple
          </button>
        </div>
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t divider-line"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 divider-pill">
              or continue with email
            </span>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <input
          type="text"
          placeholder={L.placeholders.fullName}
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          className="mb-12"
        />
        <input
          type="text"
          placeholder={L.placeholders.displayName}
          value={form.displayName}
          onChange={(e) =>
            setForm({ ...form, displayName: e.target.value })
          }
          className="mb-12"
        />
        <div className="mb-12">
          <input
            type="email"
            placeholder={L.placeholders.email}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            onBlur={handleEmailBlur}
            aria-invalid={!!fieldErrors.email ? "true" : "false"}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
          />
          {fieldErrors.email && (
            <p id="email-error" className="mt-2 text-xs error-text">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div className="mb-12 relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder={L.placeholders.password}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onBlur={handlePasswordBlur}
            aria-invalid={!!fieldErrors.password ? "true" : "false"}
            aria-describedby={fieldErrors.password ? "password-error" : undefined}
            className="password-input"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium password-toggle"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
          {fieldErrors.password && (
            <p id="password-error" className="mt-2 text-xs error-text">
              {fieldErrors.password}
            </p>
          )}
        </div>

        <input
          type="tel"
          placeholder={L.placeholders.phone}
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="mb-12"
        />
        <input
          type="text"
          placeholder={L.placeholders.location}
          value={form.location}
          onChange={(e) =>
            setForm({ ...form, location: e.target.value })
          }
          className="mb-12"
        />

        {/* Languages */}
        <fieldset className="mb-16">
          <legend>{L.labels.languages}</legend>
          <p className="small muted mb-8">
            Select one or more languages you speak.
          </p>
          {LANGUAGE_OPTIONS.map((lang) => (
            <label key={lang} className="check-row">
              <input
                type="checkbox"
                checked={form.languages.includes(lang)}
                onChange={() => toggleLanguage(lang)}
              />
              <span>{lang}</span>
            </label>
          ))}
        </fieldset>

        <fieldset className="mb-16">
          <legend>{L.labels.servicesLegend}</legend>
          {L.servicesList.map((svc: string, i: number) => (
            <label key={i} className="check-row">
              <input
                type="checkbox"
                checked={form.services.includes(svc)}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    services: e.target.checked
                      ? [...prev.services, svc]
                      : prev.services.filter((s) => s !== svc),
                  }))
                }
              />
              <span>{svc}</span>
            </label>
          ))}
        </fieldset>

        <label className="check-row">
          <input
            type="checkbox"
            checked={form.agree}
            onChange={(e) => setForm({ ...form, agree: e.target.checked })}
          />
          <span className="small">{L.labels.agree}</span>
        </label>

        <div className="mt-16 btn-row">
          <button className="btn btn-ghost" onClick={onBack}>
            {L.btnBack}
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {L.btnNext}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ===== Step 3: Legal Terms ===== */
function LegalTerms({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: (data: any) => void;
}) {
  const L = TXT.flow;
  const [agree, setAgree] = useState(false);
  const [marketing, setMarketing] = useState(false);

  return (
    <section className="section-narrow">
      <h2>{L.legalTitle}</h2>

      <div className="card mt-12">
        <label className="check-row">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <span>{L.legalAgree}</span>
        </label>

        <label className="check-row">
          <input
            type="checkbox"
            checked={marketing}
            onChange={(e) => setMarketing(e.target.checked)}
          />
          <span>{L.legalNews}</span>
        </label>

        <p className="small mt-12">
          Version: <strong>{POLICY_VERSION}</strong>
        </p>
      </div>

      <div className="mt-16 btn-row">
        <button className="btn btn-ghost" onClick={onBack}>
          {L.btnBack}
        </button>
        <button
          className="btn btn-primary"
          disabled={!agree}
          onClick={() =>
            onContinue({
              agree,
              marketing,
              timestamp: new Date().toISOString(),
            })
          }
        >
          {L.continue}
        </button>
      </div>
    </section>
  );
}

/* ===== Step 4: Compliance Checklist ===== */
function ComplianceChecklist({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: (data: any) => void;
}) {
  const L = TXT.flow;
  const [checks, setChecks] = useState([false, false, false, false]);
  const allChecked = checks.every(Boolean);

  return (
    <section className="section-narrow">
      <h2>{L.checklistTitle}</h2>

      <div className="card mt-12">
        {L.confirmPoints.map((point: string, index: number) => (
          <label key={index} className="check-row">
            <input
              type="checkbox"
              checked={checks[index]}
              onChange={() => {
                const next = [...checks];
                next[index] = !next[index];
                setChecks(next);
              }}
            />
            <span>{point}</span>
          </label>
        ))}

        <p className="small mt-12">
          Version: <strong>{POLICY_VERSION}</strong>
        </p>
      </div>

      <div className="mt-16 btn-row">
        <button className="btn btn-ghost" onClick={onBack}>
          {L.btnBack}
        </button>
        <button
          className="btn btn-primary"
          disabled={!allChecked}
          onClick={() =>
            onContinue({ checks, timestamp: new Date().toISOString() })
          }
        >
          {L.continue}
        </button>
      </div>
    </section>
  );
}

/* ===== Step 5: Payment / Identity (Free + Paid) ===== */
function PaymentStep({
  plan,
  formData,
  onBack,
  onSuccess,
}: {
  plan: PlanKey;
  formData: any;
  onBack: () => void;
  onSuccess: () => void;
}) {
  const L = TXT.flow;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const requiresId = REQUIRE_ID_VERIFICATION;

  const isFree = plan === "free";

  const handleFinishWithoutId = async () => {
    try {
      setLoading(true);
      setError("");

      const priceMonthly = PLANS[plan].priceMonthly;
      const planName = TXT.plans[plan].name;

      const { userId } = await ensureAuthAndUpsertProfile({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        displayName: formData.displayName,
        phone: formData.phone,
        location: formData.location,
        languages: formData.languages || [],
        services: formData.services || [],
        agree: formData.agree,
        plan,
        planName,
        priceMonthly,
      });

      if (!userId) throw new Error("Não foi possível salvar o perfil.");

      onSuccess();
      router.replace("/dashboard");
    } catch (err: any) {
      console.error("Erro ao salvar perfil:", err);
      setError(err?.message || "Não foi possível salvar o perfil.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      const priceMonthly = PLANS[plan].priceMonthly;
      const planName = TXT.plans[plan].name;

      // 1) Cria ou loga usuário + upsert therapist
      const { userId } = await ensureAuthAndUpsertProfile({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        displayName: formData.displayName,
        phone: formData.phone,
        location: formData.location,
        languages: formData.languages || [],
        services: formData.services || [],
        agree: formData.agree,
        plan,
        planName,
        priceMonthly,
      });

      if (!userId) {
        throw new Error("Could not get user ID for this account.");
      }

      // 2) Iniciar fluxo na API:
      //   FREE  → Stripe Identity → redireciona direto pro perfil (/therapist/:id)
      //   PAID  → Stripe Identity → backend /after-identity → Checkout → success → perfil
      const endpoint = isFree
        ? `${STRIPE_BACKEND}/start-identity-flow`
        : `${STRIPE_BACKEND}/start-payment-flow`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      let resp: Response;
      try {
        resp = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planKey: plan,
            userId,
            customerEmail: formData.email,
          }),
          signal: controller.signal,
        });
      } catch (err: any) {
        if (err.name === "AbortError") {
          throw new Error(
            "Request timed out. Please try again in a few seconds."
          );
        }
        throw new Error("Network error. Check your connection or CORS.");
      } finally {
        clearTimeout(timeoutId);
      }

      const data = (await resp.json().catch(() => ({}))) as any;

      if (!resp.ok) {
        const msg = data?.error || `Error ${resp.status}`;
        throw new Error(msg);
      }

      if (!data?.url) {
        throw new Error("Invalid server response (missing url).");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "mm_pending_activation",
          JSON.stringify({
            userId,
            plan,
            formData,
            timestamp: new Date().toISOString(),
          })
        );
        // Free: abre Stripe Identity → volta direto pro perfil
        // Paid: abre Stripe Identity → backend /after-identity → Checkout → success → perfil
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error("Payment/verification error:", err);
      setError(
        err.message ||
          "Error starting identity verification (and payment, if applicable)."
      );
      setLoading(false);
    }
  };

  const trialNote = isFree
    ? "You will complete a quick identity verification via Stripe. No payment will be charged for the Free plan. After your ID is verified, you'll be redirected directly to your public profile."
    : "You will first complete identity verification via Stripe. After your identity is confirmed, you will be redirected to Stripe Checkout to complete the payment, and then back to your profile.";

  const titleLabel = requiresId
    ? isFree
      ? "Identity Verification"
      : "Identity + Checkout"
    : "Finalize Profile (ID opcional no ambiente de teste)";

  return (
    <section className="section-narrow">
      <h2>{L.paymentTitle}</h2>
      <p className="muted mb-16">{L.paymentSubtitle}</p>

      {error && (
        <div className="alert alert-error mb-16">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="payment-panel">
        <div className="payment-title">{titleLabel}</div>
        <h3 className="mb-8">{TXT.plans[plan].name}</h3>
        <p className="payment-price-amount">
          {priceLabel(PLANS[plan].priceMonthly)}
          <span className="small payment-price-sub">
            /month
          </span>
        </p>
        <p className="payment-legend">
          {requiresId
            ? trialNote
            : "ID verification foi desativada para este ambiente. Vamos salvar o perfil e você acessa o dashboard."}
        </p>

        <button
          className="btn btn-primary btn-block"
          disabled={loading}
          onClick={requiresId ? handlePayment : handleFinishWithoutId}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {requiresId
                ? isFree
                  ? "Starting verification..."
                  : "Starting verification & payment..."
                : "Salvando perfil..."}
            </>
          ) : requiresId ? (
            isFree ? (
              "Start identity verification"
            ) : (
              "Start verification & go to payment"
            )
          ) : (
            "Finalizar perfil e ir para o dashboard"
          )}
        </button>

        <button
          className="btn btn-ghost btn-block mt-12"
          disabled={loading}
          onClick={onBack}
        >
          {L.btnBack}
        </button>
      </div>

      <div className="alert alert-info mt-16 center">
        {requiresId
          ? isFree
            ? "Identity verification is processed via Stripe. No payment will be charged for the Free plan."
            : "Identity verification and payment are processed via Stripe."
          : "Neste ambiente a verificação por ID está desativada para facilitar a criação do perfil."}
      </div>
    </section>
  );
}

/* ===== Step 6: Activation Status ===== */
function ActivationStatus() {
  const L = TXT.flow;
  return (
    <section className="section-narrow center">
      <div className="activation-emoji mb-16">
        ⏳
      </div>
      <h2 className="mb-8">{L.activationTitle}</h2>
      <p className="muted mb-24">{L.activationSubtitle}</p>

      <div className="activation-steps">
        <ul>
          {L.activationSteps.map((s: string, i: number) => (
            <li key={i}>
              <span className="activation-step-index">{i < 3 ? "✅" : "⏳"}</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="alert alert-warn mt-16">
        You'll receive an email once your account is approved (24–48h).
      </div>
    </section>
  );
}

/* ===== Main Component ===== */
export default function JoinPage() {
  const [step, setStep] = useState<Step>(1);
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("pro");
  const [formData, setFormData] = useState<any>({});
  const [legalData, setLegalData] = useState<any>({});
  const [complianceData, setComplianceData] = useState<any>({});

  const L = TXT;

  return (
    <main>
      {/* Progress Indicator */}
      <div className="progress">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className={`bar ${step >= s ? "is-on" : ""}`} />
        ))}
      </div>

      {/* Hero (only step 1) */}
      {step === 1 && (
        <section className="join-hero">
          <div className="container center">
            <span className="pill">{L.heroBadge}</span>
            <h1 className="mt-12">{L.heroTitleLine1}</h1>
            <p className="mt-12 hero-description">
              {L.heroTitleLine2}
            </p>
            <div className="mt-24 hero-stats">
              {L.heroStats.map((stat, i) => (
                <div key={i} className="hero-stat">
                  <Check size={18} />
                  <span className="hero-stat-label">
                    {stat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why (only step 1) */}
      {step === 1 && (
        <section className="container mt-32">
          <h2 className="center">{L.whyTitle}</h2>
          <p className="muted center mb-24">{L.whySubtitle}</p>
          <div className="grid">
            {L.whyBullets.map((b, i) => (
              <div key={i} className="card">
                <div className="card-title">{b.title}</div>
                <p className="muted">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Steps */}
      {step === 1 && (
        <PlanSelection
          onSelectPlan={(p) => {
            setSelectedPlan(p);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <RegistrationForm
          planName={TXT.plans[selectedPlan].name}
          onBack={() => setStep(1)}
          onContinue={(data: any) => {
            setFormData(data);
            setStep(3);
          }}
        />
      )}

      {step === 3 && (
        <LegalTerms
          onBack={() => setStep(2)}
          onContinue={(data: any) => {
            setLegalData(data);
            setStep(4);
          }}
        />
      )}

      {step === 4 && (
        <ComplianceChecklist
          onBack={() => setStep(3)}
          onContinue={(data: any) => {
            setComplianceData(data);
            setStep(5);
          }}
        />
      )}

      {step === 5 && (
        <PaymentStep
          plan={selectedPlan}
          formData={formData}
          onBack={() => setStep(4)}
          onSuccess={() => setStep(6)}
        />
      )}

      {step === 6 && <ActivationStatus />}
    </main>
  );
}

