"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, UserCheck, Calendar, MessageCircle, Star, Shield, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Find Your Perfect Match",
    description: "Browse verified massage therapists in your area. Filter by technique, availability, and ratings to find the perfect match for your needs.",
  },
  {
    icon: UserCheck,
    title: "Review Profiles",
    description: "Read detailed profiles including credentials, experience, techniques offered, and genuine reviews from other clients.",
  },
  {
    icon: MessageCircle,
    title: "Contact Directly",
    description: "Reach out to therapists directly through phone, email, or WhatsApp. Discuss your needs and schedule your session.",
  },
  {
    icon: Calendar,
    title: "Book Your Session",
    description: "Coordinate directly with your chosen therapist to find a time that works for both of you. Payment is handled directly with the therapist.",
  },
];

const features = [
  {
    icon: Shield,
    title: "Verified Professionals",
    description: "All therapists undergo verification to ensure they're licensed and qualified professionals.",
  },
  {
    icon: Star,
    title: "Honest Reviews",
    description: "Read authentic reviews from real clients to make informed decisions.",
  },
  {
    icon: Search,
    title: "Advanced Search",
    description: "Filter by location, techniques, availability, and more to find exactly what you need.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-black" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />
      </div>

      {/* Header */}
      <header className="border-b border-white/5 glass sticky top-0 z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-white hover:text-neutral-200 transition-colors">
            MasseurMatch
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/explore" className="text-sm text-neutral-400 hover:text-white transition-colors">
              Explore
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
            How It Works
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Finding and booking a professional massage therapist has never been easier. Here's how MasseurMatch works.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-8 mb-20"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={itemVariants}
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

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Choose MasseurMatch?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-white/10 border border-white/20 mb-4">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-neutral-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* For Therapists Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-12 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Are You a Massage Therapist?</h2>
          <p className="text-neutral-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of professionals growing their practice with MasseurMatch.
            Create your profile, reach more clients, and manage your business all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/join"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-black hover:bg-neutral-200 transition-colors"
            >
              Join as a Therapist
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-8 py-4 font-semibold text-white hover:bg-white/10 transition-colors"
            >
              View Pricing
            </Link>
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
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-neutral-400 text-lg mb-8 max-w-xl mx-auto">
            Browse thousands of verified massage therapists and find your perfect match today.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-black hover:bg-neutral-200 transition-colors"
          >
            Explore Therapists
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-20">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-white mb-4">MasseurMatch</h3>
              <p className="text-sm text-neutral-400">
                Connecting clients with professional massage therapists.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">For Clients</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><Link href="/explore" className="hover:text-white transition-colors">Find Therapists</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="/trust" className="hover:text-white transition-colors">Trust & Safety</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">For Therapists</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><Link href="/join" className="hover:text-white transition-colors">Join Now</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/how-it-works-for-therapists" className="hover:text-white transition-colors">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 text-center text-sm text-neutral-500">
            © {new Date().getFullYear()} MasseurMatch. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
