"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Bot,
  Cpu,
  CheckCircle2,
  MapPin,
  Radar,
  ShieldCheck,
  Sparkles,
  Star,
  Waves,
  Globe2,
  Lock,
  Zap,
} from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Verified therapists", value: "4,200+" },
  { label: "Cities covered", value: "280+" },
  { label: "Match success", value: "94%" },
  { label: "Avg. response", value: "8 min" },
];

const features = [
  {
    icon: Bot,
    title: "Ktonny AI concierge",
    description:
      "Share what you need and Ktonny builds a tailored short-list in seconds.",
  },
  {
    icon: ShieldCheck,
    title: "Verified & LGBTQ+ affirming",
    description:
      "Every profile is vetted for licensing, reviews, and community safety.",
  },
  {
    icon: MapPin,
    title: "Directory-first discovery",
    description:
      "Browse by city, specialty, availability, or style with precision filters.",
  },
];

const futuristHighlights = [
  {
    icon: Waves,
    title: "Predictive match signals",
    description:
      "Ktonny learns preferences and flags the right therapists before you even search.",
  },
  {
    icon: Globe2,
    title: "Global LGBTQ+ coverage",
    description:
      "Structured city directories and neighborhood tags help search engines surface you.",
  },
  {
    icon: Lock,
    title: "Privacy-first intelligence",
    description:
      "Zero ambiguity on consent, safety, and data handling across every touchpoint.",
  },
];

const aiSignals = [
  {
    icon: Radar,
    title: "Ktonny signal scan",
    description: "Real-time AI scoring combines reviews, specialties, and availability.",
  },
  {
    icon: Cpu,
    title: "Adaptive preference graph",
    description: "Behavioral cues shape matching without ever exposing personal data.",
  },
  {
    icon: Activity,
    title: "Live demand radar",
    description: "Trend intelligence highlights cities and modalities clients search most.",
  },
];

const commandModules = [
  {
    icon: Zap,
    title: "Neural intake",
    metric: "1.8s",
    description: "Ktonny parses intent, location, and goals into a secure preference graph.",
  },
  {
    icon: Activity,
    title: "Live availability mesh",
    metric: "24/7",
    description: "Availability pings refresh continuously so you only see open time slots.",
  },
  {
    icon: ShieldCheck,
    title: "Safety intelligence",
    metric: "100%",
    description: "Identity, licensing, and review signals are verified before any match appears.",
  },
];

const signalFlows = [
  {
    title: "Intent capture",
    description: "Natural-language prompts become tailored filters in milliseconds.",
  },
  {
    title: "Match scoring",
    description: "Ktonny ranks therapists using verified credentials and community feedback.",
  },
  {
    title: "Precision routing",
    description: "Location-aware routing highlights top providers in your neighborhood.",
  },
  {
    title: "Continuous refinement",
    description: "Every tap helps Ktonny improve your next recommendation.",
  },
];

const trustSignals = [
  {
    title: "Verified credentials",
    description: "License checks and identity verification on every therapist profile.",
  },
  {
    title: "Community standards",
    description: "LGBTQ+ safety policies enforced with transparent reporting tools.",
  },
  {
    title: "Secure payments",
    description: "Encrypted booking flows with clear consent and cancellation terms.",
  },
];

const seoPillars = [
  {
    title: "Schema-first profiles",
    description: "Each therapist profile is built with structured data for rich snippets.",
  },
  {
    title: "City intelligence hubs",
    description: "Dedicated pages for top LGBTQ+ metro areas with localized keywords.",
  },
  {
    title: "Authority content",
    description: "Guides, FAQs, and safety standards build trust and search visibility.",
  },
];

const steps = [
  {
    title: "Tell Ktonny your goals",
    description:
      "Share location, focus areas, and the vibe you want. Privacy-first by design.",
  },
  {
    title: "Compare best-fit therapists",
    description:
      "Review verified profiles, pricing, and availability in one refined feed.",
  },
  {
    title: "Book with confidence",
    description:
      "Secure bookings, transparent policies, and support throughout your care.",
  },
];

const therapists = [
  {
    name: "Adrian Cole",
    city: "New York, NY",
    specialty: "Sports recovery & deep tissue",
    rating: "4.9",
  },
  {
    name: "Malik Rivera",
    city: "Los Angeles, CA",
    specialty: "Trauma-informed bodywork",
    rating: "4.8",
  },
  {
    name: "Jules Martin",
    city: "Chicago, IL",
    specialty: "Mind-body relaxation",
    rating: "4.9",
  },
  {
    name: "Owen Hart",
    city: "Miami, FL",
    specialty: "Lymphatic & wellness",
    rating: "4.7",
  },
];

const testimonials = [
  {
    quote:
      "Ktonny narrowed my search to three therapists who actually fit my needs. I felt seen and safe.",
    name: "D. Thompson",
  },
  {
    quote:
      "The directory feels premium and respectful. Booking was clear and fast.",
    name: "L. Ramirez",
  },
];

const cities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Miami",
  "San Francisco",
  "Houston",
  "Atlanta",
  "Seattle",
  "Boston",
  "Denver",
  "Dallas",
  "Phoenix",
];

const faqItems = [
  {
    question: "How does Ktonny AI match me with a gay therapist?",
    answer:
      "Ktonny reviews your goals, location, and availability to recommend verified LGBTQ+ affirming therapists with the right specialties.",
  },
  {
    question: "Are therapists verified on MasseurMatch?",
    answer:
      "Yes. We confirm licensing, identity, and community standards before listing any therapist profile.",
  },
  {
    question: "Can I search by city or neighborhood?",
    answer:
      "Absolutely. The directory is optimized for city and neighborhood search to help you find local care fast.",
  },
  {
    question: "Is my data private when I use Ktonny?",
    answer:
      "Ktonny sessions stay private and are never shared or sold. You control what you reveal in your search.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const chatMessages = [
  {
    role: "user",
    text: "I want a gay therapist in Brooklyn focused on recovery and anxiety relief.",
  },
  {
    role: "ai",
    text: "Got it. I found 12 verified therapists in Brooklyn with trauma-informed and recovery-focused specialties.",
  },
  {
    role: "ai",
    text: "Want me to prioritize evening availability or price range?",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "MasseurMatch",
  url: "https://www.masseurmatch.com",
  description:
    "Gay therapist directory with AI-powered matching, verified LGBTQ+ affirming massage professionals, and city-based discovery.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.masseurmatch.com/explore?query={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MasseurMatch",
  url: "https://www.masseurmatch.com",
  description:
    "AI-powered gay therapist directory delivering verified LGBTQ+ affirming massage and bodywork professionals.",
};

export default function HomePage() {
  return (
    <div className="relative bg-black text-white">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <motion.div
          initial={{ opacity: 0.2 }}
          animate={{ opacity: [0.2, 0.45, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(29,78,216,0.18),transparent_55%)]"
        />
        <motion.div
          initial={{ rotate: 0, opacity: 0.3 }}
          animate={{ rotate: 360, opacity: [0.1, 0.35, 0.1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -left-1/3 top-1/3 h-[600px] w-[600px] rounded-full bg-[conic-gradient(from_90deg,rgba(29,78,216,0.25),transparent,rgba(255,255,255,0.15))] blur-3xl"
        />
        <motion.div
          initial={{ x: "-30%", opacity: 0.3 }}
          animate={{ x: ["-30%", "30%", "-30%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 h-px w-[160%] bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
        <motion.div
          initial={{ x: "40%", opacity: 0.25 }}
          animate={{ x: ["40%", "-20%", "40%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 h-px w-[140%] bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:80px_80px] opacity-40" />
      </div>

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur"
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            <span className="text-xl font-semibold tracking-tight">MasseurMatch</span>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link className="text-sm text-neutral-400 hover:text-white" href="/explore">
              Directory
            </Link>
            <Link className="text-sm text-neutral-400 hover:text-white" href="/ai">
              Ktonny AI
            </Link>
            <Link className="text-sm text-neutral-400 hover:text-white" href="/trust">
              Trust & Safety
            </Link>
            <Link className="text-sm text-neutral-400 hover:text-white" href="/blog">
              Insights
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 hover:border-white/40 hover:text-white sm:inline-flex"
            >
              Sign in
            </Link>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                href="/join"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white shadow-[0_0_30px_rgba(29,78,216,0.45)]"
              >
                Join as therapist
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </nav>
      </motion.header>

      <section className="relative px-6 pb-24 pt-32">
        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div initial="initial" animate="animate" variants={stagger}>
            <motion.div
              variants={fadeIn}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70"
            >
              <span className="h-2 w-2 rounded-full bg-accent" />
              LGBTQ+ affirming directory
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="mt-6 text-4xl font-semibold leading-tight tracking-tight md:text-6xl"
            >
              The most advanced
              <span className="block text-white">gay therapist directory</span>
              for 2026 and beyond.
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 text-lg text-neutral-400 md:text-xl">
              MasseurMatch pairs LGBTQ+ clients with licensed massage and bodywork professionals.
              Ktonny AI refines your search, highlights verified reviews, and surfaces the best
              local matches instantly.
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="mt-6 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.24em] text-white/50"
            >
              <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                <Zap className="h-3 w-3 text-accent-soft" />
                AI-precision matching
              </span>
              <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                <ShieldCheck className="h-3 w-3 text-accent-soft" />
                Verified LGBTQ+ care
              </span>
            </motion.div>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-4">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white"
                >
                  Browse directory
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/ai"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/80 hover:border-white/40 hover:text-white"
                >
                  Meet Ktonny AI
                  <Bot className="h-4 w-4" />
                </Link>
              </motion.div>
            </motion.div>
            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-6 text-sm text-neutral-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent-soft" />
                Background-checked professionals
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-accent-soft" />
                4.8 average community rating
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeUp}
            className="rounded-3xl border border-white/10 bg-background-card p-8 shadow-[0_0_40px_rgba(29,78,216,0.15)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Ktonny AI</p>
                <h2 className="text-xl font-semibold">Smart therapist matching</h2>
              </div>
              <span className="rounded-full border border-accent/40 bg-accent/20 px-3 py-1 text-xs text-accent-soft">
                Live
              </span>
            </div>
            <div className="mt-6 space-y-4">
              {chatMessages.map((message) => (
                <motion.div
                  key={message.text}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={
                    message.role === "user"
                      ? "ml-auto max-w-[85%] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                      : "mr-auto max-w-[85%] rounded-2xl border border-white/10 bg-background-hover px-4 py-3 text-sm text-white/90"
                  }
                >
                  {message.text}
                </motion.div>
              ))}
            </div>
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="mt-6 rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white/60"
            >
              Ask about specialties, pricing, or availability...
            </motion.div>
            <div className="mt-6 flex items-center gap-3 text-xs text-white/50">
              <CheckCircle2 className="h-4 w-4 text-accent-soft" />
              Ktonny never shares data outside your search session.
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-6xl gap-6 rounded-3xl border border-white/10 bg-black/60 p-10 md:grid-cols-4">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4 }}
              className="space-y-2 rounded-2xl border border-white/5 bg-black/40 p-4"
            >
              <p className="text-3xl font-semibold text-white">{stat.value}</p>
              <p className="text-sm text-neutral-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid gap-8 rounded-3xl border border-white/10 bg-background-card p-10 lg:grid-cols-[0.7fr_1.3fr]"
          >
            <motion.div variants={fadeUp} className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                Ktonny command center
              </p>
              <h2 className="text-3xl font-semibold md:text-4xl">
                The AI operating system for LGBTQ+ therapist discovery.
              </h2>
              <p className="text-sm text-neutral-400">
                Every search is routed through Ktonny&apos;s neural intake, safety checks, and
                availability mesh—so your results feel curated, fast, and fully verified.
              </p>
              <motion.div
                variants={fadeUp}
                className="rounded-2xl border border-white/10 bg-black/60 p-4"
              >
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span>Signal latency</span>
                  <span>0.18ms</span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="h-full w-1/2 rounded-full bg-gradient-to-r from-transparent via-accent to-transparent"
                  />
                </div>
              </motion.div>
            </motion.div>
            <div className="grid gap-6 md:grid-cols-3">
              {commandModules.map((module) => (
                <motion.div
                  key={module.title}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className="rounded-3xl border border-white/10 bg-black/60 p-6"
                >
                  <module.icon className="h-6 w-6 text-accent-soft" />
                  <h3 className="mt-4 text-lg font-semibold">{module.title}</h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.24em] text-white/40">
                    {module.metric}
                  </p>
                  <p className="mt-3 text-sm text-neutral-400">{module.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid gap-6 rounded-3xl border border-white/10 bg-background-card p-10 md:grid-cols-3"
          >
            {aiSignals.map((signal) => (
              <motion.div
                key={signal.title}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="rounded-3xl border border-white/10 bg-black/60 p-6"
              >
                <signal.icon className="h-6 w-6 text-accent-soft" />
                <h3 className="mt-4 text-lg font-semibold">{signal.title}</h3>
                <p className="mt-3 text-sm text-neutral-400">{signal.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid gap-10 md:grid-cols-[0.5fr_1fr]"
          >
            <motion.div variants={fadeUp}>
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Why MasseurMatch</p>
              <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
                Built for precision, safety, and LGBTQ+ care.
              </h2>
            </motion.div>
            <div className="grid gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className="rounded-3xl border border-white/10 bg-background-card p-6"
                >
                  <feature.icon className="h-6 w-6 text-accent-soft" />
                  <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-3 text-sm text-neutral-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid gap-10 rounded-3xl border border-white/10 bg-black/70 p-10 lg:grid-cols-[1fr_0.9fr]"
          >
            <motion.div variants={fadeUp} className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                Ktonny signal pipeline
              </p>
              <h2 className="text-3xl font-semibold md:text-4xl">
                From intent to therapist match in seconds.
              </h2>
              <p className="text-sm text-neutral-400">
                Ktonny combines natural language, real-time availability, and verification
                data to serve hyper-accurate suggestions tailored to LGBTQ+ clients.
              </p>
              <motion.div
                variants={fadeUp}
                className="rounded-2xl border border-white/10 bg-background-card p-5"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Live pulse</p>
                <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-white/60">
                  <div className="rounded-xl border border-white/10 bg-black/60 px-3 py-2">
                    Trust index
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/60 px-3 py-2">
                    Response time
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/60 px-3 py-2">
                    Availability
                  </div>
                </div>
              </motion.div>
            </motion.div>
            <div className="grid gap-4">
              {signalFlows.map((flow, index) => (
                <motion.div
                  key={flow.title}
                  variants={fadeUp}
                  whileHover={{ x: 6 }}
                  className="flex items-start gap-4 rounded-2xl border border-white/10 bg-background-card p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black text-sm font-semibold text-white">
                    0{index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{flow.title}</h3>
                    <p className="mt-2 text-sm text-neutral-400">{flow.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid gap-10 lg:grid-cols-3"
          >
            <motion.div variants={fadeUp} className="lg:col-span-1">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                2026 futurist system
              </p>
              <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
                A next-gen directory engineered for visibility and trust.
              </h2>
              <p className="mt-4 text-sm text-neutral-400">
                Semantic SEO, structured data, and AI-guided discovery make MasseurMatch
                the highest-performing gay therapist directory on the web.
              </p>
            </motion.div>
            {futuristHighlights.map((highlight) => (
              <motion.div
                key={highlight.title}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="rounded-3xl border border-white/10 bg-background-card p-6"
              >
                <highlight.icon className="h-6 w-6 text-accent-soft" />
                <h3 className="mt-4 text-lg font-semibold">{highlight.title}</h3>
                <p className="mt-3 text-sm text-neutral-400">{highlight.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"
          >
            <motion.div variants={fadeUp}>
              <h2 className="text-3xl font-semibold md:text-4xl">How Ktonny matches you</h2>
              <p className="mt-4 text-neutral-400">
                Ktonny is trained to understand LGBTQ+ wellness needs, so every match
                prioritizes safety, alignment, and consent-driven care.
              </p>
              <div className="mt-8 space-y-6">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    variants={fadeUp}
                    className="flex gap-4 rounded-2xl border border-white/10 bg-background-card p-5"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black text-sm font-semibold text-white">
                      0{index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                      <p className="mt-2 text-sm text-neutral-400">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="rounded-3xl border border-white/10 bg-background-card p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Featured therapists</p>
              <div className="mt-6 space-y-4">
                {therapists.map((therapist) => (
                  <motion.div
                    key={therapist.name}
                    whileHover={{ x: 6 }}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/60 px-4 py-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{therapist.name}</p>
                      <p className="text-xs text-neutral-500">{therapist.city}</p>
                      <p className="mt-2 text-xs text-neutral-400">{therapist.specialty}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-white">
                      <Star className="h-4 w-4 text-accent-soft" />
                      {therapist.rating}
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/explore"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-2xl border border-white/15 py-3 text-sm font-semibold text-white/80 hover:border-white/40 hover:text-white"
                >
                  View full directory
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]"
          >
            <motion.div variants={fadeUp} className="rounded-3xl border border-white/10 bg-background-card p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Community voice</p>
              <div className="mt-6 space-y-6">
                {testimonials.map((testimonial) => (
                  <motion.div
                    key={testimonial.name}
                    whileHover={{ scale: 1.01 }}
                    className="rounded-2xl border border-white/10 bg-black/60 p-5"
                  >
                    <p className="text-sm text-white/90">“{testimonial.quote}”</p>
                    <p className="mt-3 text-xs text-neutral-500">{testimonial.name}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div variants={fadeUp}>
              <h2 className="text-3xl font-semibold md:text-4xl">
                SEO-first content for gay therapists, massage, and bodywork searches.
              </h2>
              <p className="mt-4 text-neutral-400">
                MasseurMatch is optimized for search engines with structured data, city hubs,
                therapist profiles, and guidance content for LGBTQ+ wellness. Every profile
                highlights specialties, pricing, availability, and reviews to build trust.
              </p>
              <motion.ul variants={fadeUp} className="mt-6 grid gap-3 text-sm text-neutral-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent-soft" />
                  Structured directory profiles with specialties, pricing, and availability.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent-soft" />
                  Location-based pages for top LGBTQ+ destinations across the US.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent-soft" />
                  Trust & safety content to build confidence for clients and therapists.
                </li>
              </motion.ul>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {seoPillars.map((pillar) => (
                  <motion.div
                    key={pillar.title}
                    whileHover={{ y: -4 }}
                    className="rounded-2xl border border-white/10 bg-background-card p-4"
                  >
                    <p className="text-sm font-semibold text-white">{pillar.title}</p>
                    <p className="mt-2 text-xs text-neutral-400">{pillar.description}</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {cities.map((city) => (
                  <motion.div
                    key={city}
                    whileHover={{ y: -4 }}
                    className="rounded-2xl border border-white/10 bg-background-card px-4 py-3 text-sm text-white/80"
                  >
                    {city} gay therapist directory
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="rounded-3xl border border-white/10 bg-background-card p-10"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-semibold md:text-4xl">
              Frequently asked questions
            </motion.h2>
            <motion.div variants={fadeUp} className="mt-8 grid gap-6 md:grid-cols-2">
              {faqItems.map((item) => (
                <div key={item.question} className="rounded-2xl border border-white/10 bg-black/60 p-5">
                  <p className="text-sm font-semibold text-white">{item.question}</p>
                  <p className="mt-3 text-sm text-neutral-400">{item.answer}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid gap-6 rounded-3xl border border-white/10 bg-black/70 p-10 md:grid-cols-3"
          >
            {trustSignals.map((signal) => (
              <motion.div
                key={signal.title}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="rounded-3xl border border-white/10 bg-background-card p-6"
              >
                <h3 className="text-lg font-semibold">{signal.title}</h3>
                <p className="mt-3 text-sm text-neutral-400">{signal.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="px-6 pb-32">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto flex max-w-6xl flex-col items-center gap-6 rounded-3xl border border-white/10 bg-black/80 p-12 text-center"
        >
          <h2 className="text-3xl font-semibold md:text-4xl">
            Ready to join the most trusted gay therapist directory?
          </h2>
          <p className="text-neutral-400">
            List your practice on MasseurMatch and let Ktonny connect you with clients
            who need your expertise.
          </p>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link
              href="/join"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white"
            >
              Become a featured therapist
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
