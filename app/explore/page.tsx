"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, MapPin, Star, Filter } from "lucide-react";

// Mock data - will be replaced with Supabase query
const therapists = [
  {
    id: "1",
    name: "Marcus Johnson",
    city: "Los Angeles",
    state: "CA",
    rating: 4.9,
    reviews: 47,
    specialties: ["Deep Tissue", "Sports Massage"],
    rate: 120,
    image: null,
  },
  {
    id: "2",
    name: "David Chen",
    city: "Los Angeles",
    state: "CA",
    rating: 4.8,
    reviews: 32,
    specialties: ["Swedish", "Thai Massage"],
    rate: 100,
    image: null,
  },
  {
    id: "3",
    name: "James Williams",
    city: "San Francisco",
    state: "CA",
    rating: 5.0,
    reviews: 28,
    specialties: ["Relaxation", "Hot Stone"],
    rate: 130,
    image: null,
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function ExplorePage() {
  return (
    <div className="min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-[#0a0a0f] to-indigo-950/20" />
      </div>

      {/* Header */}
      <header className="border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            MasseurMatch
          </Link>
          <div className="flex items-center gap-4">
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
              Join
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Find Your Therapist
          </h1>
          <p className="text-slate-400 max-w-2xl">
            Browse our directory of licensed, professional massage therapists.
            Filter by location, specialty, and availability.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-wrap gap-4"
        >
          <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors">
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors">
            All Cities
          </button>
          <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors">
            All Specialties
          </button>
          <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors">
            Price Range
          </button>
        </motion.div>

        {/* Results Grid */}
        <motion.div
          initial="initial"
          animate="animate"
          transition={{ staggerChildren: 0.1 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {therapists.map((therapist) => (
            <motion.div key={therapist.id} variants={fadeInUp}>
              <Link
                href={`/therapist/${therapist.id}`}
                className="group block rounded-3xl border border-white/10 bg-white/5 overflow-hidden hover:border-violet-500/50 transition-all duration-300"
              >
                {/* Image Placeholder */}
                <div className="aspect-[4/3] bg-gradient-to-br from-violet-600/20 to-indigo-600/20 flex items-center justify-center">
                  <span className="text-6xl opacity-50">👤</span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white group-hover:text-violet-400 transition-colors mb-2">
                    {therapist.name}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                    <MapPin className="h-4 w-4" />
                    {therapist.city}, {therapist.state}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-medium text-white">
                        {therapist.rating}
                      </span>
                    </div>
                    <span className="text-slate-500">
                      ({therapist.reviews} reviews)
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {therapist.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="rounded-full bg-violet-600/20 px-3 py-1 text-xs font-medium text-violet-300"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-slate-400">Starting at</span>
                    <span className="text-xl font-bold text-white">
                      ${therapist.rate}/hr
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {therapists.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">
              No therapists found. Try adjusting your filters.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
