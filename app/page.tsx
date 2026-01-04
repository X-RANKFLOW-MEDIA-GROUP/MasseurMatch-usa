"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MapPin, Star, Shield, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

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
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const fadeInScale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const glowVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: [0.3, 0.6, 0.3],
    scale: [0.8, 1.2, 0.8],
  },
};

const glowTransition = {
  duration: 4,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

export default function HomePage() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

  return (
    <div className="relative bg-black" ref={ref}>
      {/* Animated Background - Monochrome */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-black" />

        {/* Animated glow orbs - white only */}
        <motion.div
          variants={glowVariants}
          initial="initial"
          animate="animate"
          transition={glowTransition}
          className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]"
        />
        <motion.div
          variants={glowVariants}
          initial="initial"
          animate="animate"
          transition={glowTransition}
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-[120px]"
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 glass"
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="group flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Sparkles className="h-5 w-5 text-white" />
            </motion.div>
            <span className="text-2xl font-bold text-white">MasseurMatch</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/explore"
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/login"
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
              Login
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/join"
                className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                Join as Therapist
              </Link>
            </motion.div>
          </div>
        </nav>
      </motion.header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 min-h-screen flex items-center">
        <div className="mx-auto max-w-6xl w-full">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="text-center"
            style={{ y, opacity }}
          >
            <motion.div
              variants={fadeInScale}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm"
            >
              <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
              <span className="text-sm font-medium text-white">
                Professional Massage Directory
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="mb-6 text-6xl md:text-8xl font-bold leading-[1.1] tracking-tight"
            >
              Find Your Perfect{" "}
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 text-white">
                  Massage Therapist
                </span>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                  className="absolute bottom-2 left-0 h-3 bg-white/20 -z-0"
                />
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mx-auto mb-12 max-w-2xl text-xl text-neutral-400 leading-relaxed"
            >
              Connect with licensed, professional male massage therapists in your area.
              Inclusive, safe, and therapeutic services.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              variants={fadeInUp}
              className="mx-auto mb-12 max-w-2xl"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative group"
              >
                <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500 group-hover:text-white transition-colors" />
                <input
                  type="text"
                  placeholder="Enter your city or zip code..."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-5 pl-14 pr-36 text-white placeholder:text-neutral-600 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10 backdrop-blur-sm transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  Search
                </motion.button>
              </motion.div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/explore"
                  className="group flex items-center gap-2 rounded-2xl bg-white px-8 py-4 font-semibold text-black hover:bg-neutral-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                  Browse Therapists
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/join"
                  className="rounded-2xl border border-white/20 px-8 py-4 font-semibold text-white hover:bg-white/5 hover:border-white/30 transition-all backdrop-blur-sm"
                >
                  List Your Practice
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-neutral-500"
          >
            <span className="text-xs uppercase tracking-wider">Scroll</span>
            <div className="h-8 w-[2px] bg-gradient-to-b from-white/20 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-32 px-6 relative">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid gap-6 md:grid-cols-3"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeInScale}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-8 hover:border-white/20 hover:from-white/10 transition-all duration-500"
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="mb-6 inline-flex rounded-2xl bg-white/10 p-4 backdrop-blur-sm"
                >
                  <feature.icon className="h-7 w-7 text-white" />
                </motion.div>
                <h3 className="mb-3 text-2xl font-bold text-white">
                  {feature.title}
                </h3>
                <p className="text-neutral-400 leading-relaxed">{feature.description}</p>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Cities */}
      <section className="py-32 px-6 border-t border-white/5 relative">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="mb-16 text-center">
              <h2 className="mb-4 text-5xl font-bold text-white">
                Explore by City
              </h2>
              <p className="text-xl text-neutral-400">
                Find therapists in major cities across the US
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
              {cities.map((city, index) => (
                <motion.div
                  key={city.slug}
                  variants={fadeInScale}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={`/city/${city.slug}`}
                    className="group relative flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-white/20 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm overflow-hidden"
                  >
                    <div className="relative z-10">
                      <p className="text-lg font-bold text-white mb-1">
                        {city.name}
                      </p>
                      <p className="text-sm text-neutral-500">{city.state}</p>
                    </div>
                    <ArrowRight className="relative z-10 h-5 w-5 text-neutral-500 transition-all group-hover:translate-x-1 group-hover:text-white" />

                    {/* Animated gradient on hover */}
                    <motion.div
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                    />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.02 }}
            className="relative rounded-3xl bg-gradient-to-br from-white via-neutral-100 to-white p-12 text-center overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.1)]"
          >
            {/* Animated gradient background */}
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent"
            />

            <div className="relative z-10">
              <h2 className="mb-4 text-4xl font-bold text-black">
                Are You a Massage Therapist?
              </h2>
              <p className="mb-8 text-lg text-black/70">
                Join our directory and connect with clients looking for professional
                massage services.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/join"
                  className="inline-flex items-center gap-2 rounded-2xl bg-black px-8 py-4 font-semibold text-white hover:bg-neutral-800 transition-all shadow-[0_0_30px_rgba(0,0,0,0.3)]"
                >
                  Create Your Profile
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <Sparkles className="h-5 w-5 text-white" />
              <p className="text-2xl font-bold text-white">
                MasseurMatch
              </p>
            </motion.div>
            <div className="flex gap-8 text-sm text-neutral-400">
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
          <p className="text-center text-sm text-neutral-600">
            &copy; {new Date().getFullYear()} MasseurMatch. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
