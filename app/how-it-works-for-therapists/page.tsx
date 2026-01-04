"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus, FileEdit, Users, TrendingUp, DollarSign, Shield, ArrowRight, Check } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up in Minutes",
    description: "Create your account with just your email. No complex onboarding or lengthy forms to fill out initially.",
  },
  {
    icon: FileEdit,
    title: "Build Your Profile",
    description: "Add your credentials, techniques, availability, and photos. Showcase what makes your practice unique with our comprehensive profile editor.",
  },
  {
    icon: Shield,
    title: "Get Verified",
    description: "Complete our simple verification process to earn your Verified badge and build trust with potential clients.",
  },
  {
    icon: Users,
    title: "Start Getting Clients",
    description: "Your profile goes live immediately. Clients can find you through search, browse, and direct your profile link.",
  },
];

const benefits = [
  "No commission fees - keep 100% of what you earn",
  "Reach thousands of potential clients in your area",
  "SEO-optimized profiles that rank in search engines",
  "Display your contact info and availability",
  "Professional photo gallery for your studio and work",
  "Showcase credentials, techniques, and specializations",
  "Client reviews to build your reputation",
  "Mobile and desktop optimized profiles",
];

const pricing = [
  {
    name: "Free",
    price: "$0",
    features: [
      "3 photos",
      "7 days trial",
      "1 main city",
      '"Available Now" 3×/day',
      "Basic search ranking",
    ],
  },
  {
    name: "Pro",
    price: "$89",
    popular: true,
    features: [
      "6 photos",
      "Up to 3 cities",
      "Analytics + Heatmap",
      "1 highlight credit/month",
      "Verified badge",
      "Priority ranking",
    ],
  },
  {
    name: "Elite",
    price: "$149",
    features: [
      "8 photos",
      "Top homepage placement",
      'Auto "Available" every 2h',
      "2 highlight credits/month",
      "VIP Support + Concierge",
      "Maximum visibility",
    ],
  },
];

export default function HowItWorksForTherapistsPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-black" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />

        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px]"
        />
      </div>

      {/* Header */}
      <header className="border-b border-white/5 glass sticky top-0 z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-white hover:text-neutral-200 transition-colors">
            MasseurMatch
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm text-neutral-400 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="text-sm text-neutral-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link
              href="/join"
              className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-200 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            How It Works for Therapists
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-8">
            Join thousands of massage therapists growing their practice with MasseurMatch. Simple, transparent, and built for professionals.
          </p>
          <Link
            href="/join"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-black hover:bg-neutral-200 transition-colors"
          >
            Start Your Free Trial
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid md:grid-cols-2 gap-8 mb-20"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative rounded-2xl border border-white/10 bg-white/5 p-8"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                <span className="text-xl font-bold text-black">{index + 1}</span>
              </div>

              <step.icon className="h-12 w-12 text-white mb-6" />

              <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
              <p className="text-neutral-300 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Benefits Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 rounded-3xl border border-white/10 bg-white/5 p-12"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Therapists Choose Us
          </h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-neutral-300">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Pricing Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-neutral-400 text-center mb-12 max-w-2xl mx-auto">
            Choose the plan that fits your practice. Upgrade, downgrade, or cancel anytime.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricing.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`relative rounded-2xl border p-8 ${
                  plan.popular
                    ? "border-white bg-gradient-to-br from-white/10 to-white/5"
                    : "border-white/10 bg-white/5"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white text-black text-xs font-medium">
                    MOST POPULAR
                  </div>
                )}

                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-neutral-400">/month</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-neutral-300">
                      <Check className="h-4 w-4 text-white flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.name === "Free" ? "/join" : `/checkout?plan=${plan.name.toLowerCase()}`}
                  className={`block w-full text-center rounded-xl py-3 font-semibold transition-all ${
                    plan.popular
                      ? "bg-white text-black hover:bg-neutral-200"
                      : "border border-white/20 text-white hover:bg-white/10"
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-neutral-400 mt-8">
            <Link href="/pricing" className="text-white hover:underline">
              View detailed pricing comparison →
            </Link>
          </p>
        </motion.section>

        {/* Business Model */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-12"
        >
          <div className="max-w-3xl mx-auto text-center">
            <DollarSign className="h-16 w-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-6">
              You Keep 100% of What You Earn
            </h2>
            <p className="text-neutral-300 text-lg leading-relaxed mb-6">
              Unlike other platforms that take 15-30% of every booking, we believe in transparent subscription pricing.
              Pay a simple monthly fee and keep all your earnings. No hidden fees, no commissions, no surprises.
            </p>
            <p className="text-neutral-400">
              Clients contact you directly, you handle payments your way, and we never touch your money.
            </p>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Grow Your Practice?</h2>
          <p className="text-neutral-400 text-lg mb-8 max-w-xl mx-auto">
            Join MasseurMatch today and start connecting with thousands of potential clients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/join"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-black hover:bg-neutral-200 transition-colors"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-8 py-4 font-semibold text-white hover:bg-white/10 transition-colors"
            >
              View All Plans
            </Link>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
