"use client";

import React, { useState } from "react";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import "./Join.css";

type PlanKey = "free" | "standard" | "pro" | "elite";
type Step = 1 | 2 | 3 | 4 | 5 | 6;

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
      location: "Location (City / Base)",
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
      location: "City - State / Region",
      languages: "English, Spanish",
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

    paymentTitle: "Complete Payment",
    paymentSubtitle: "Final step to activate your account",
    paymentNote: "You'll be redirected to Stripe's secure checkout.",
    paymentButton: "Go to Payment",
    paymentFree: "Activate Free Trial",

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

/** Stripe backend URL */
const STRIPE_BACKEND =
  process.env.NEXT_PUBLIC_STRIPE_BACKEND ||
  process.env.NEXT_PUBLIC_STRIPE_BACKEND_URL ||
  process.env.NEXT_PUBLIC_STRIPE_API ||
  "https://backend-massuer-stripe.onrender.com";

const POLICY_VERSION = "2025-11-11";
const FREE_TRIAL_DAYS = 7;

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
  languages: string;
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
    languages: languages
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean),
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

  localStorage.setItem("mm_user", JSON.stringify({ email: email.trim() }));

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
        <p className="small mt-8" style={{ color: "#f59e0b" }}>
          {TXT.founderNote}
        </p>
      </div>

      <div className="plans-grid">
        {(Object.keys(PLANS) as PlanKey[]).map((key) => {
          const pCfg = PLANS[key];
          const pTxt = TXT.plans[key];
          const cardClass = `card ${pCfg.highlight ? "card--highlight" : ""}`;
          return (
            <div
              key={key}
              className={cardClass}
              style={{ position: "relative" }}
            >
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
    languages: "",
    services: [] as string[],
    agree: false,
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");

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
    if (form.password !== form.password2) {
      setError("Passwords do not match.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Invalid email.");
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
        <input
          type="email"
          placeholder={L.placeholders.email}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="mb-12"
        />

        <input
          type="password"
          placeholder={L.placeholders.password}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="mb-12"
        />
        <input
          type="password"
          placeholder={L.placeholders.password2}
          value={form.password2}
          onChange={(e) =>
            setForm({ ...form, password2: e.target.value })
          }
          className="mb-12"
        />

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
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="mb-12"
        />
        <input
          type="text"
          placeholder={L.placeholders.languages}
          value={form.languages}
          onChange={(e) =>
            setForm({ ...form, languages: e.target.value })
          }
          className="mb-16"
        />

        <fieldset className="mb-16">
          <legend>{L.labels.servicesLegend}</legend>
          {L.servicesList.map((svc: string, i: number) => (
            <label key={i} className="check-row">
              <input
                type="checkbox"
                checked={form.services.includes(svc)}
                onChange={(e) =>
                  setForm({
                    ...form,
                    services: e.target.checked
                      ? [...form.services, svc]
                      : form.services.filter((s) => s !== svc),
                  })
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

/* ===== Step 5: Payment / Free Trial + Stripe Identity ===== */
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

  const isFree = plan === "free";

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
        languages: formData.languages,
        services: formData.services,
        agree: formData.agree,
        plan,
        planName,
        priceMonthly,
      });

      if (!userId) {
        throw new Error("Could not get user ID for this account.");
      }

      // 2) Se for plano Free: só ativa trial e vai para ativação
      if (isFree) {
        const trialEnds = new Date();
        trialEnds.setDate(trialEnds.getDate() + FREE_TRIAL_DAYS);

        try {
          await supabase
            .from("therapists")
            .update({
              subscription_status: "trialing",
              trial_ends_at: trialEnds.toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId);
        } catch (err) {
          console.error("Error updating free trial info:", err);
        }

        localStorage.setItem(
          "mm_pending_activation",
          JSON.stringify({
            userId,
            plan,
            formData,
            trialEndsAt: trialEnds.toISOString(),
            timestamp: new Date().toISOString(),
          })
        );

        setLoading(false);
        onSuccess(); // step 6: ActivationStatus
        return;
      }

      // 3) Planos pagos: iniciar fluxo Stripe Identity → depois Checkout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      let resp: Response;
      try {
        resp = await fetch(`${STRIPE_BACKEND}/start-payment-flow`, {
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

      const data = await resp.json().catch(() => ({} as any));

      if (!resp.ok) {
        const msg = (data as any)?.error || `Error ${resp.status}`;
        throw new Error(msg);
      }

      if (!(data as any)?.url) {
        throw new Error("Invalid server response (missing url).");
      }

      // Guarda contexto local (útil se quiser usar na tela de retorno)
      localStorage.setItem(
        "mm_pending_activation",
        JSON.stringify({
          userId,
          plan,
          formData,
          timestamp: new Date().toISOString(),
        })
      );

      // 👉 Redireciona para a página de verificação de identidade da Stripe
      window.location.href = (data as any).url;
    } catch (err: any) {
      console.error("Payment/verification error:", err);
      setError(
        err.message || "Error starting identity verification and payment."
      );
      setLoading(false);
    }
  };

  const trialNote = isFree
    ? "Free 7-day trial. No charge will be made. Your profile will be reviewed by our team."
    : "You will first complete identity verification via Stripe. After your identity is confirmed, you will be automatically redirected to Stripe Checkout to complete the subscription payment.";

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
        <div style={{ fontSize: 48, marginBottom: 16 }}>
          {isFree ? "Free Trial" : "Identity + Checkout"}
        </div>
        <h3 className="mb-8">{TXT.plans[plan].name}</h3>
        <p
          style={{
            fontSize: 40,
            fontWeight: 800,
            color: "#667eea",
            marginBottom: 8,
          }}
        >
          {priceLabel(PLANS[plan].priceMonthly)}
          <span className="small" style={{ marginLeft: 6 }}>
            /month
          </span>
        </p>
        <p className="payment-legend">{trialNote}</p>

        <button
          className="btn btn-primary btn-block"
          disabled={loading}
          onClick={handlePayment}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {isFree
                ? "Activating..."
                : "Starting verification & payment..."}
            </>
          ) : isFree ? (
            L.paymentFree
          ) : (
            "Start verification & go to payment"
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

      {!isFree && (
        <div className="alert alert-info mt-16 center">
          Secure Lock – Identity verification and payment are processed via
          Stripe.
        </div>
      )}
    </section>
  );
}

/* ===== Step 6: Activation Status ===== */
function ActivationStatus() {
  const L = TXT.flow;
  return (
    <section className="section-narrow center">
      <div style={{ fontSize: 64 }} className="mb-16">
        ⏳
      </div>
      <h2 className="mb-8">{L.activationTitle}</h2>
      <p className="muted mb-24">{L.activationSubtitle}</p>

      <div className="activation-steps">
        <ul>
          {L.activationSteps.map((s: string, i: number) => (
            <li key={i}>
              <span style={{ fontSize: 20 }}>{i < 3 ? "✅" : "⏳"}</span>
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
            <p
              className="mt-12"
              style={{ fontSize: 18, maxWidth: 720, margin: "0 auto" }}
            >
              {L.heroTitleLine2}
            </p>
            <div
              className="mt-24"
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {L.heroStats.map((stat, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Check size={18} />
                  <span style={{ fontSize: 14, fontWeight: 700 }}>
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

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 ProDirectory. All rights reserved.</p>
      </footer>
    </main>
  );
}
