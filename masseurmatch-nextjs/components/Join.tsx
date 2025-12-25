"use client";

import React, { useState } from "react";
import { AlertCircle, Check, Loader2, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { Background } from "./newhome/components/Background";

type PlanKey = "free" | "standard" | "pro" | "elite";
type Step = 1 | 2 | 3 | 4 | 5 | 6;

const LANGUAGE_OPTIONS = [
  "English",
  "Spanish",
  "Portuguese",
  "French",
  "German",
  "Italian",
  "Japanese",
] as const;

const TXT = {
  heroBadge: "Limited founder membership available",
  heroTitleLine1: "Where trust meets opportunity",
  heroTitleLine2:
    "Join the premier directory platform connecting massage therapists and wellness professionals with clients. Build your profile, boost your visibility, and grow your practice.",
  heroStats: ["1,000+ professionals", "4.9/5 average rating", "Growing fast"],

  whyTitle: "Why professionals choose our platform",
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
      title: "Analytics Insights",
      desc: "Track clicks, profile views, and client feedback to optimize your presence",
    },
    {
      title: "Real-Time Updates",
      desc: "Let clients know when you're available with instant status updates",
    },
  ],

  plansHeader: "More visibility. More trust. More clients.",
  plansSub:
    "Plans built for massage therapists and wellness professionals — whether you're just starting or already established",
  monthlyNote: "Monthly plans only — cancel anytime",
  founderNote: "First 100 members earn a Founder badge plus 50% lifetime discount",
  plans: {
    free: {
      name: "Free",
      price: 0,
      tag: "Start my profile",
      pitch: "Perfect for new professionals",
      features: [
        "7-day free trial",
        "Up to 3 photos / 1 featured slide",
        "1 main city",
        '"Available Now" badge up to 3 times/day',
        "Basic Explore ranking",
      ],
    },
    standard: {
      name: "Standard",
      price: 29,
      tag: "Boost visibility",
      pitch: "For part-time pros ready to grow",
      features: [
        "Up to 5 photos / 2 featured slides",
        "1 visiting city",
        '"Available Now" badge up to 6 times/day',
        "Verified badge + standard support",
      ],
    },
    pro: {
      name: "Pro",
      price: 59,
      tag: "Claim the spotlight",
      pitch: "Best value — most popular choice",
      features: [
        "Up to 6 photos / 2 featured slides",
        "Up to 3 visiting cities",
        "Analytics + city heatmap",
        "1 featured credit / month",
      ],
    },
    elite: {
      name: "Elite",
      price: 119,
      tag: "Join the elite circle",
      pitch: "Limited founder offer still active",
      features: [
        "Up to 8 photos / 3 featured slides",
        "Top homepage placement",
        'Auto "Available" every 2 hours',
        "2 featured credits / month",
        "Concierge + VIP support",
      ],
    },
  },
  mostPopular: "Most popular",

  flow: {
    formTitle: "Register your professional profile",
    formNotePlan: "Selected plan: {{plan}}. You can change later.",
    labels: {
      fullName: "Full name",
      displayName: "Display name",
      email: "Email",
      phone: "WhatsApp / Phone",
      location: "ZIP / Postal Code",
      languages: "Languages spoken",
      servicesLegend: "Services offered",
      agree: "I accept the Terms and Privacy Policy",
      password: "Password (min. 6)",
      password2: "Confirm password",
    },
    placeholders: {
      fullName: "Your full name",
      displayName: "Public display name",
      email: "you@example.com",
      phone: "(000) 000-0000",
      location: "ZIP / Postal Code",
      languages: "Select your primary languages",
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
    legalNews: "I'd like to receive product updates by email (optional)",

    checklistTitle: "Final compliance checklist",
    confirmPoints: [
      "I attest that all information is true and my own",
      "I will not post explicit, illegal, or policy-violating content",
      "I will comply with all applicable laws and regulations",
      "I understand this is a directory; payments and services happen outside of the platform",
    ],

    paymentTitle: "Complete verification & payment",
    paymentSubtitle: "Final step to activate your account",
    paymentNote: "You'll be redirected to Stripe's secure checkout",
    paymentButton: "Go to payment",
    paymentFree: "Activate free plan",

    activationTitle: "Account activation in progress",
    activationSubtitle: "We're processing your information",
    activationSteps: [
      "Plan selected",
      "Registration complete",
      "Terms accepted",
      "Identity verified",
      "Awaiting approval",
    ],

    btnBack: "Back",
    btnNext: "Continue",
    toastErr: "Fill all required fields",
    continue: "Continue",
  },
} as const;

const PLANS: Record<
  PlanKey,
  { key: PlanKey; highlight?: boolean; priceMonthly: number }
> = {
  free: { key: "free", priceMonthly: 0 },
  standard: { key: "standard", priceMonthly: 29 },
  pro: { key: "pro", priceMonthly: 59, highlight: true },
  elite: { key: "elite", priceMonthly: 119 },
};

const PROGRESS_STEPS = [
  "Plan selection",
  "Registration",
  "Legal agreement",
  "Compliance",
  "Payment",
  "Activation",
];

const REQUIRE_ID_VERIFICATION =
  process.env.NEXT_PUBLIC_REQUIRE_ID_VERIFICATION !== "false";

const STRIPE_BACKEND =
  process.env.NEXT_PUBLIC_STRIPE_BACKEND ||
  process.env.NEXT_PUBLIC_STRIPE_BACKEND_URL ||
  process.env.NEXT_PUBLIC_STRIPE_API ||
  "https://backend-massuer-stripe.onrender.com";

const POLICY_VERSION = "2025-11-11";

function priceLabel(price: number) {
  if (price === 0) return "";
  return `$${price}`;
}

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

  // Call API endpoint to create user and profile (uses service role to bypass RLS)
  const response = await fetch("/api/therapist/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
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
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to create account");
  }

  if (!data.userId) {
    throw new Error("Failed to get user ID");
  }

  // Sign in the user on the client side
  const { error: signInErr } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (signInErr) {
    // User was created but sign-in failed, this is OK for now
    console.warn("User created but auto sign-in failed:", signInErr.message);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem("mm_user", JSON.stringify({ email: email.trim() }));
  }

  return { userId: data.userId };
}

function PlanSelection({ onSelectPlan }: { onSelectPlan: (plan: PlanKey) => void }) {
  const [loading, setLoading] = useState<PlanKey | null>(null);

  const handleSelect = async (key: PlanKey) => {
    setLoading(key);
    await new Promise((r) => setTimeout(r, 250));
    onSelectPlan(key);
    setLoading(null);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-fuchsia-300/80">
          {TXT.plansHeader}
        </p>
        <h2 className="text-3xl font-semibold text-white md:text-4xl">
          {TXT.plansHeader}
        </h2>
        <p className="text-lg text-slate-300">{TXT.plansSub}</p>
        <p className="text-sm text-slate-400">{TXT.monthlyNote}</p>
        <p className="text-sm font-semibold text-violet-200">{TXT.founderNote}</p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {(Object.keys(PLANS) as PlanKey[]).map((key) => {
          const pCfg = PLANS[key];
          const pTxt = TXT.plans[key];
          return (
            <div
              key={key}
              className="relative flex h-full flex-col gap-5 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl transition hover:border-white/30"
            >
              {pCfg.highlight && (
                <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white">
                  {TXT.mostPopular}
                </div>
              )}

              <div className="space-y-2">
                <p className="text-base font-medium uppercase tracking-[0.3em] text-slate-300">
                  {pTxt.name}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">
                    {priceLabel(pCfg.priceMonthly)}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">/month</span>
                </div>
                <p className="text-sm text-slate-300">{pTxt.pitch}</p>
              </div>

              <ul className="space-y-3 text-sm text-slate-200">
                {pTxt.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check size={16} className="mt-1 text-violet-300" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className="mt-auto rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:brightness-110 disabled:opacity-60"
                onClick={() => handleSelect(key)}
                disabled={loading === key}
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

const HERO_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80",
    alt: "Terapeuta preparando óleos antes da sessão",
    label: "Studio dedicado",
    badge: "Incall",
    height: "h-56",
  },
  {
    src: "https://images.unsplash.com/photo-1559757175-570136cf47df?auto=format&fit=crop&w=900&q=80",
    alt: "Profissional de massagem aplicando técnicas em um cliente",
    label: "Atendimento móvel",
    badge: "Outcall",
    height: "h-72",
  },
  {
    src: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80",
    alt: "Toalhas e óleos dispostos com iluminação suave",
    label: "Spa urbano",
    badge: "VIP",
    height: "h-64",
  },
];

const A15_BULLETS = [
  {
    title: "Resposta em 15 minutos",
    desc: "Suporte ativo e onboarding guiado para acelerar seu primeiro perfil.",
  },
  {
    title: "15 compromissos de confiança",
    desc: "Revisões, privacidade e curadoria afinadas para manter sua reputação intacta.",
  },
  {
    title: "Visibilidade A15",
    desc: "Fotos, destaques e listas inteligentes focados nos pontos fortes do seu atendimento.",
  },
];

const FAQ_ITEMS = [
  {
    question: "O que é o selo A15?",
    answer:
      "A15 resume 15 compromissos de transparência, verificação e resposta rápida que acompanha cada novo perfil ativo.",
  },
  {
    question: "Quais informações preciso enviar?",
    answer:
      "Depois de escolher o plano, você registra o nome, e-mail, telefone, localização, idiomas e serviços, aceita os termos e conclui o checklist de compliance e verificação.",
  },
  {
    question: "Preciso pagar para aparecer na busca?",
    answer:
      "Não. Clientes pesquisam e entram em contato gratuitamente. Os planos pagos ampliam fotos, cidades e prioridade nos resultados.",
  },
  {
    question: "Como acontece a aprovação?",
    answer:
      "Revisamos os dados em cinco etapas (plano, registro, termos, checklist e pagamento/identidade). Após o envio completo, mandamos um e-mail em até 48h com o status.",
  },
  {
    question: "Posso trocar de plano depois?",
    answer:
      "Sim. A qualquer momento você atualiza, pausa ou troca o plano pelo painel sem perder fotos ou histórico.",
  },
];

function JoinHero({ onPlanScroll }: { onPlanScroll: () => void }) {
  return (
    <section className="relative isolate overflow-hidden px-4 pt-10 pb-16 lg:pt-16 lg:pb-24">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 via-slate-950 to-transparent" />
      <div className="relative z-10 mx-auto max-w-6xl grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-6 rounded-[36px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.4em] text-slate-200">
            {TXT.heroBadge}
          </span>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl">
              {TXT.heroTitleLine1}
            </h1>
            <p className="text-lg text-slate-300">{TXT.heroTitleLine2}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {TXT.heroStats.map((stat) => (
              <div
                key={stat}
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-slate-200"
              >
                <Check size={14} className="text-violet-300" />
                <span>{stat}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              className="rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white"
              onClick={onPlanScroll}
            >
              Ver planos
            </button>
            <a
              href="/login"
              className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white"
            >
              Já sou membro
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {HERO_IMAGES.map((image, index) => (
            <div
              key={image.src}
              className={`group relative overflow-hidden rounded-[32px] border border-white/10 bg-black/20 shadow-2xl ${image.height}`}
              style={{
                transform:
                  index === 1
                    ? "translateY(-1.5rem)"
                    : index === 2
                    ? "translateY(1rem)"
                    : undefined,
              }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute left-4 bottom-4 flex flex-col gap-1 text-xs uppercase tracking-[0.4em] text-white">
                <span className="font-semibold">{image.label}</span>
                <span className="rounded-full border border-white/30 px-2 py-0.5 text-[10px] tracking-[0.5em]">
                  {image.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section className="relative px-4 pb-16 pt-10 lg:pt-20">
      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        <div className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-fuchsia-300/70">Porque assinar</p>
          <h2 className="text-4xl font-semibold text-white md:text-5xl">
            Vantagens para sua agenda crescer
          </h2>
          <p className="text-base text-slate-300">{TXT.whySubtitle}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TXT.whyBullets.map((benefit) => (
            <div
              key={benefit.title}
              className="group relative flex flex-col gap-4 rounded-[36px] border border-white/10 bg-gradient-to-br from-white/5 to-black/30 p-6 shadow-2xl transition-all hover:-translate-y-1 hover:border-white/30"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-200">
                  <Check size={20} />
                </div>
                <p className="text-lg font-semibold text-white">{benefit.title}</p>
              </div>
              <p className="text-sm text-slate-300">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function A15FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative px-4 pb-20 pt-16 lg:pb-24">
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-indigo-900/80 via-transparent to-transparent" />
      <div className="relative z-10 max-w-6xl mx-auto grid gap-8 lg:grid-cols-[1.05fr,0.95fr]">
        <div className="rounded-[36px] border border-white/10 bg-white/5 p-8 shadow-2xl">
          <p className="text-xs uppercase tracking-[0.4em] text-fuchsia-300/80">A15</p>
          <h2 className="mt-3 text-4xl font-semibold text-white">A15 Perguntas Frequentes</h2>
          <p className="mt-2 text-sm text-slate-300">
            Um compêndio dos 15 compromissos que orientam onboarding, suporte e visibilidade.
          </p>
          <div className="mt-8 space-y-4">
            {A15_BULLETS.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4"
              >
                <p className="text-xs uppercase tracking-[0.4em] text-violet-300">{item.title}</p>
                <p className="mt-2 text-sm text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[36px] border border-white/10 bg-black/60 p-6 shadow-2xl backdrop-blur-xl">
          <div className="space-y-5">
            {FAQ_ITEMS.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={faq.question}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 transition"
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 text-left text-sm font-semibold text-white"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <Minus size={18} className="text-white" />
                    ) : (
                      <Plus size={18} className="text-white" />
                    )}
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-sm text-slate-300 leading-relaxed">{faq.answer}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

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

  const toggleService = (service: string) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const validateEmail = (value: string) => {
    if (!value) return "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) return "";
    if (value.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
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
      setError("Password must be at least 6 characters");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Invalid email");
      return;
    }
    if (form.languages.length === 0) {
      setError("Select at least one language");
      return;
    }
    if (form.services.length === 0) {
      setError("Select at least one service");
      return;
    }
    setError("");
    onContinue(form);
  };

  const inputBase =
    "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30" +
    " transition";

  return (
    <section className="max-w-4xl mx-auto space-y-6 rounded-[32px] border border-white/10 bg-white/5 px-6 py-10 shadow-2xl backdrop-blur-xl">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-fuchsia-300/80">Step 2</p>
        <h2 className="text-3xl font-semibold text-white">{L.formTitle}</h2>
        <p className="text-sm text-slate-300">
          {L.formNotePlan.replace("{{plan}}", planName)}
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            placeholder={L.placeholders.fullName}
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className={inputBase}
          />
          <input
            type="text"
            placeholder={L.placeholders.displayName}
            value={form.displayName}
            onChange={(e) =>
              setForm({ ...form, displayName: e.target.value })
            }
            className={inputBase}
          />
        </div>

        <input
          type="email"
          placeholder={L.placeholders.email}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          onBlur={() => {
            const err = validateEmail(form.email);
            setFieldErrors((prev) => ({ ...prev, email: err }));
          }}
          className={inputBase}
        />
        {fieldErrors.email && (
          <p className="text-xs text-red-300">{fieldErrors.email}</p>
        )}

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder={L.placeholders.password}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onBlur={() => {
              const err = validatePassword(form.password);
              setFieldErrors((prev) => ({ ...prev, password: err }));
            }}
            className={inputBase}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-300"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {fieldErrors.password && (
          <p className="text-xs text-red-300">{fieldErrors.password}</p>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="tel"
            placeholder={L.placeholders.phone}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputBase}
          />
          <input
            type="text"
            placeholder={L.placeholders.location}
            value={form.location}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
            className={inputBase}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-white">{L.labels.languages}</p>
          <p className="text-xs text-slate-400">Select one or more languages</p>
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            {LANGUAGE_OPTIONS.map((lang) => (
              <label
                key={lang}
                className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:border-violet-400"
              >
                <input
                  type="checkbox"
                  checked={form.languages.includes(lang)}
                  onChange={() => toggleLanguage(lang)}
                  className="accent-violet-400"
                />
                <span>{lang}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">
            {L.labels.servicesLegend}
          </p>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {L.servicesList.map((service) => (
              <label
                key={service}
                className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:border-violet-400"
              >
                <input
                  type="checkbox"
                  checked={form.services.includes(service)}
                  onChange={() => toggleService(service)}
                  className="accent-violet-400"
                />
                <span>{service}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
        <input
          type="checkbox"
          checked={form.agree}
          onChange={(e) => setForm({ ...form, agree: e.target.checked })}
          className="accent-violet-400"
        />
        <span>{L.labels.agree}</span>
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/40"
          onClick={onBack}
        >
          {L.btnBack}
        </button>
        <button
          className="rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:brightness-110"
          onClick={handleSubmit}
        >
          {L.btnNext}
        </button>
      </div>
    </section>
  );
}

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
    <section className="max-w-4xl mx-auto space-y-6 rounded-[32px] border border-white/10 bg-white/5 px-6 py-10 shadow-2xl backdrop-blur-xl">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-fuchsia-300/80">Step 3</p>
        <h2 className="text-3xl font-semibold text-white">{L.legalTitle}</h2>
      </div>

      <div className="space-y-4 rounded-3xl border border-white/10 bg-black/20 p-6">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-200">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="accent-violet-400"
          />
          <span>{L.legalAgree}</span>
        </label>

        <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-200">
          <input
            type="checkbox"
            checked={marketing}
            onChange={(e) => setMarketing(e.target.checked)}
            className="accent-violet-400"
          />
          <span>{L.legalNews}</span>
        </label>

        <p className="text-xs text-slate-400">
          Version: <span className="font-semibold text-white">{POLICY_VERSION}</span>
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white"
          onClick={onBack}
        >
          {L.btnBack}
        </button>
        <button
          className="rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white disabled:opacity-60"
          disabled={!agree}
          onClick={() =>
            onContinue({ agree, marketing, timestamp: new Date().toISOString() })
          }
        >
          {L.continue}
        </button>
      </div>
    </section>
  );
}

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
    <section className="max-w-4xl mx-auto space-y-6 rounded-[32px] border border-white/10 bg-white/5 px-6 py-10 shadow-2xl backdrop-blur-xl">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-fuchsia-300/80">Step 4</p>
        <h2 className="text-3xl font-semibold text-white">{L.checklistTitle}</h2>
      </div>

      <div className="space-y-4 rounded-3xl border border-white/10 bg-black/20 p-6">
        {L.confirmPoints.map((point, index) => (
          <label
            key={point}
            className="flex cursor-pointer items-start gap-3 text-sm text-slate-200"
          >
            <input
              type="checkbox"
              checked={checks[index]}
              onChange={() => {
                const next = [...checks];
                next[index] = !next[index];
                setChecks(next);
              }}
              className="accent-violet-400"
            />
            <span>{point}</span>
          </label>
        ))}

        <p className="text-xs text-slate-400">
          Version: <span className="font-semibold text-white">{POLICY_VERSION}</span>
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white"
          onClick={onBack}
        >
          {L.btnBack}
        </button>
        <button
          className="rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white disabled:opacity-60"
          disabled={!allChecked}
          onClick={() => onContinue({ checks, timestamp: new Date().toISOString() })}
        >
          {L.continue}
        </button>
      </div>
    </section>
  );
}

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

      if (!userId) throw new Error("Failed to save the profile.");

      onSuccess();
      router.replace("/dashboard");
    } catch (err: any) {
      console.error("Error saving profile:", err);
      console.error("Error details:", {
        message: err?.message,
        name: err?.name,
        stack: err?.stack,
        raw: JSON.stringify(err, Object.getOwnPropertyNames(err))
      });
      setError(err?.message || "Failed to save the profile.");
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
          throw new Error("Request timed out. Please try again in a few seconds.");
        }
        throw new Error("Network error. Check your connection or CORS.");
      } finally {
        clearTimeout(timeoutId);
      }

      const data = (await resp.json().catch(() => ({}))) as any;

      if (!resp.ok) {
        const msg = data?.error || Error ;
        throw new Error(msg);
      }

      if (!data?.url) {
        throw new Error("Invalid server response (missing url)");
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
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error("Payment/verification error:", err);
      setError(
        err.message ||
          "Error starting identity verification or payment."
      );
      setLoading(false);
    }
  };

  const trialNote = isFree
    ? "You will complete a quick identity verification via Stripe. No payment is charged for the Free plan. After verification you'll be redirected to your profile."
    : "You will first complete Stripe Identity verification and then proceed to Stripe Checkout for payment before returning to your profile.";

  const titleLabel = requiresId
    ? isFree
      ? "Identity verification"
      : "Identity + checkout"
    : "Finalize profile (ID optional in this environment)";

  return (
    <section className="max-w-4xl mx-auto rounded-[32px] border border-white/10 bg-gradient-to-b from-white/10 to-transparent px-6 py-10 shadow-[0_25px_60px_rgba(2,3,24,0.9)] backdrop-blur-xl">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-fuchsia-300/80">Step 5</p>
        <h2 className="text-3xl font-semibold text-white">{L.paymentTitle}</h2>
        <p className="text-sm text-slate-300">{L.paymentSubtitle}</p>
      </div>

      {error && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-8 rounded-3xl border border-white/10 bg-black/40 p-6 text-center shadow-2xl">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-400">{titleLabel}</p>
        <h3 className="mt-4 text-3xl font-semibold text-white">
          {TXT.plans[plan].name}
        </h3>
        <div className="mt-2 flex items-baseline justify-center gap-2">
          <span className="text-5xl font-bold text-white">
            {priceLabel(PLANS[plan].priceMonthly)}
          </span>
          <span className="text-sm text-slate-400">/month</span>
        </div>
        <p className="mt-4 text-sm text-slate-300">{trialNote}</p>

        <button
          className="mt-10 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white disabled:opacity-60"
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
                : "Saving profile..."}
            </>
          ) : requiresId ? (
            isFree
              ? "Start identity verification"
              : "Start verification & go to payment"
          ) : (
            "Finalize profile & go to dashboard"
          )}
        </button>

        <button
          className="mt-4 w-full rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white"
          disabled={loading}
          onClick={onBack}
        >
          {L.btnBack}
        </button>
      </div>

      <p className="mt-6 text-xs text-slate-400">
        {requiresId
          ? isFree
            ? "Identity verification is processed via Stripe. Free plan members are never charged."
            : "Identity verification and payment are processed via Stripe."
          : "Identity verification is disabled in this environment for faster testing."}
      </p>
    </section>
  );
}

function ActivationStatus() {
  const L = TXT.flow;
  return (
    <section className="max-w-4xl mx-auto space-y-6 rounded-[32px] border border-white/10 bg-white/5 px-6 py-10 shadow-2xl backdrop-blur-xl">
      <div className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-fuchsia-300/80">Step 6</p>
        <h2 className="text-3xl font-semibold text-white">{L.activationTitle}</h2>
        <p className="text-sm text-slate-300">{L.activationSubtitle}</p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
        <ol className="space-y-4 text-sm text-slate-200">
          {L.activationSteps.map((stepLabel, index) => (
            <li
              key={stepLabel}
              className="flex items-center gap-3 text-white"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20 text-xs font-semibold text-violet-200">
                {index + 1}
              </span>
              {stepLabel}
            </li>
          ))}
        </ol>
      </div>

      <p className="text-sm text-slate-400">
        You will receive an email once your account is approved (usually within 24-48h).
      </p>
    </section>
  );
}

export default function JoinPage() {
  const [step, setStep] = useState<Step>(1);
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("pro");
  const [formData, setFormData] = useState<any>({});

  const progressLabel = PROGRESS_STEPS[Math.min(step - 1, PROGRESS_STEPS.length - 1)];
  const progressPercent = Math.min(100, (step / PROGRESS_STEPS.length) * 100);

  const scrollToPlans = () => {
    const target = document.getElementById("plan-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#010104] text-white selection:bg-violet-500/30 selection:text-white">
      <Background />
      <div className="relative z-10">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="sticky top-4 z-30">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl shadow-xl">
              <div className="flex flex-col gap-2 text-xs uppercase tracking-[0.4em] text-slate-300 md:flex-row md:items-center md:justify-between">
                <span>
                  Step {Math.min(step, PROGRESS_STEPS.length)} of {PROGRESS_STEPS.length}
                </span>
                <span className="font-semibold text-white">{progressLabel}</span>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-400 transition-[width]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {step === 1 && (
          <>
            <JoinHero onPlanScroll={scrollToPlans} />
            <BenefitsSection />
            <div id="plan-section" className="px-4 pb-16">
              <PlanSelection
                onSelectPlan={(plan) => {
                  setSelectedPlan(plan);
                  setStep(2 as Step);
                }}
              />
            </div>
            <A15FAQSection />
          </>
        )}

        {step === 2 && (
          <div className="px-4 pb-16">
            <RegistrationForm
              planName={TXT.plans[selectedPlan].name}
              onBack={() => setStep(1)}
              onContinue={(data) => {
                setFormData(data);
                setStep(3 as Step);
              }}
            />
          </div>
        )}

        {step === 3 && (
          <div className="px-4 pb-16">
            <LegalTerms
              onBack={() => setStep(2)}
              onContinue={() => {
                setStep(4 as Step);
              }}
            />
          </div>
        )}

        {step === 4 && (
          <div className="px-4 pb-16">
            <ComplianceChecklist
              onBack={() => setStep(3)}
              onContinue={() => {
                setStep(5 as Step);
              }}
            />
          </div>
        )}

        {step === 5 && (
          <div className="px-4 pb-16">
            <PaymentStep
              plan={selectedPlan}
              formData={formData}
              onBack={() => setStep(4)}
              onSuccess={() => setStep(6 as Step)}
            />
          </div>
        )}

        {step === 6 && (
          <div className="px-4 pb-16">
            <ActivationStatus />
          </div>
        )}
      </div>
    </main>
  );
}
