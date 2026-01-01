"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Star, Shield, Search } from "lucide-react";
import Link from "next/link";

const cities = [
  { name: "Los Angeles", slug: "los-angeles", state: "CA" },
  { name: "New York", slug: "new-york", state: "NY" },
  { name: "San Francisco", slug: "san-francisco", state: "CA" },
  { name: "Miami", slug: "miami", state: "FL" },
];

const features = [
  {
    icon: Shield,
    title: "Verified Professionals",
    description: "All therapists are licensed and background-checked",
  },
  {
    icon: Star,
    title: "Honest Reviews",
    description: "Real reviews from verified clients",
  },
  {
    icon: MapPin,
    title: "Find Nearby",
    description: "Discover therapists in your neighborhood",
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function HomePage() {
  return (
    <div className="relative">
      {/* Gradient Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/50 via-[#0a0a0f] to-indigo-950/30" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            MasseurMatch
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/explore"
              className="text-sm text-slate-300 hover:text-white transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/login"
              className="text-sm text-slate-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/join"
              className="rounded-full bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
            >
              Join as Therapist
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="text-center"
          >
            <motion.p
              variants={fadeInUp}
              className="mb-4 text-sm font-semibold uppercase tracking-widest text-violet-400"
            >
              Professional Massage Directory
            </motion.p>
            <motion.h1
              variants={fadeInUp}
              className="mb-6 text-5xl md:text-7xl font-bold leading-tight"
            >
              Find Your Perfect{" "}
              <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Massage Therapist
              </span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="mx-auto mb-10 max-w-2xl text-lg text-slate-400"
            >
              Connect with licensed, professional male massage therapists in your area.
              Inclusive, safe, and therapeutic services.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              variants={fadeInUp}
              className="mx-auto mb-12 max-w-xl"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter your city or zip code..."
                  className="w-full rounded-full border border-white/10 bg-white/5 py-4 pl-12 pr-32 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-violet-600 px-6 py-2 font-medium text-white hover:bg-violet-500 transition-colors">
                  Search
                </button>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link
                href="/explore"
                className="group flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-black hover:bg-slate-100 transition-colors"
              >
                Browse Therapists
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/join"
                className="rounded-full border border-white/20 px-8 py-4 font-semibold text-white hover:bg-white/5 transition-colors"
              >
                List Your Practice
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid gap-8 md:grid-cols-3"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className="group rounded-3xl border border-white/10 bg-white/5 p-8 hover:border-violet-500/50 hover:bg-white/10 transition-all duration-300"
              >
                <div className="mb-4 inline-flex rounded-2xl bg-violet-600/20 p-3">
                  <feature.icon className="h-6 w-6 text-violet-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Cities */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">
                Explore by City
              </h2>
              <p className="text-slate-400">
                Find therapists in major cities across the US
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
              {cities.map((city) => (
                <motion.div key={city.slug} variants={fadeInUp}>
                  <Link
                    href={`/city/${city.slug}`}
                    className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-violet-500/50 hover:bg-white/10 transition-all duration-300"
                  >
                    <div>
                      <p className="text-lg font-semibold text-white group-hover:text-violet-400 transition-colors">
                        {city.name}
                      </p>
                      <p className="text-sm text-slate-500">{city.state}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-violet-400" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-white">
              Are You a Massage Therapist?
            </h2>
            <p className="mb-8 text-lg text-white/80">
              Join our directory and connect with clients looking for professional
              massage services.
            </p>
            <Link
              href="/join"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-violet-600 hover:bg-slate-100 transition-colors"
            >
              Create Your Profile
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              MasseurMatch
            </p>
            <div className="flex gap-6 text-sm text-slate-400">
              <Link href="/about" className="hover:text-white transition-colors">
                About
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} MasseurMatch. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
