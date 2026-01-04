"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Shield, Clock, MapPin, Search, Filter, X, Star, CheckCircle, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TherapistCard } from "@/src/types/therapist";

interface ExploreFiltersProps {
  therapists: TherapistCard[];
  cities: { name: string; slug: string }[];
}

export default function ExploreFilters({ therapists, cities }: ExploreFiltersProps) {
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [showAvailableNow, setShowAvailableNow] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Get unique services from all therapists
  const allServices = useMemo(() => {
    const services = new Set<string>();
    therapists.forEach((t) => {
      t.services?.forEach((s: string) => services.add(s));
    });
    return Array.from(services).sort();
  }, [therapists]);

  // Filter therapists
  const filteredTherapists = useMemo(() => {
    return therapists.filter((t) => {
      // Verified filter
      if (showVerifiedOnly && !t.identity_verified) {
        return false;
      }

      // Available Now filter
      if (showAvailableNow && !t.available_now) {
        return false;
      }

      // City filter
      if (selectedCity && t.city?.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }

      // Service filter
      if (selectedService && !t.services?.includes(selectedService)) {
        return false;
      }

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = t.display_name?.toLowerCase().includes(query);
        const matchesHeadline = t.headline?.toLowerCase().includes(query);
        const matchesCity = t.city?.toLowerCase().includes(query);
        if (!matchesName && !matchesHeadline && !matchesCity) {
          return false;
        }
      }

      return true;
    });
  }, [therapists, showVerifiedOnly, showAvailableNow, selectedCity, selectedService, searchQuery]);

  const activeFilterCount = [
    showVerifiedOnly,
    showAvailableNow,
    selectedCity,
    selectedService,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setShowVerifiedOnly(false);
    setShowAvailableNow(false);
    setSelectedCity("");
    setSelectedService("");
    setSearchQuery("");
  };

  return (
    <div>
      {/* Search & Filter Bar */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, city, or specialty..."
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:border-neutral-300 focus:outline-none"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Verified Only Toggle */}
            <button
              onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                showVerifiedOnly
                  ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                  : "bg-white/5 border-white/10 text-slate-300 hover:border-white/20"
              }`}
            >
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Verified Only</span>
            </button>

            {/* Available Now Toggle */}
            <button
              onClick={() => setShowAvailableNow(!showAvailableNow)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                showAvailableNow
                  ? "bg-green-500/20 border-green-500/50 text-green-400"
                  : "bg-white/5 border-white/10 text-slate-300 hover:border-white/20"
              }`}
            >
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">Available Now</span>
            </button>

            {/* More Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                showFilters || activeFilterCount > 0
                  ? "bg-neutral-200/20 border-neutral-300/50 text-white"
                  : "bg-white/5 border-white/10 text-slate-300 hover:border-white/20"
              }`}
            >
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </span>
            </button>

            {/* Clear Filters */}
            {(activeFilterCount > 0 || searchQuery) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-3 rounded-xl text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
                <span className="text-sm">Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="grid md:grid-cols-2 gap-4 mt-4 p-4 rounded-xl border border-white/10 bg-white/5">
                {/* City Select */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    City
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white focus:border-neutral-300 focus:outline-none"
                  >
                    <option value="">All Cities</option>
                    {cities.map((city) => (
                      <option key={city.slug} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Service Type Select */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Service Type
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white focus:border-neutral-300 focus:outline-none"
                  >
                    <option value="">All Services</option>
                    {allServices.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-slate-400">
          Showing <span className="text-white font-medium">{filteredTherapists.length}</span>{" "}
          {filteredTherapists.length === 1 ? "therapist" : "therapists"}
          {activeFilterCount > 0 && " matching your filters"}
        </p>
      </div>

      {/* Results Grid */}
      {filteredTherapists.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTherapists.map((therapist) => (
            <TherapistCardComponent key={therapist.user_id} therapist={therapist} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🔍</p>
          <h2 className="text-xl font-semibold text-white mb-2">No matches found</h2>
          <p className="text-slate-400 mb-6">
            Try adjusting your filters or search terms
          </p>
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-medium text-white hover:bg-neutral-200 transition-colors"
          >
            <X className="h-4 w-4" />
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

function TherapistCardComponent({ therapist }: { therapist: TherapistCard }) {
  return (
    <Link
      href={`/therapist/${therapist.slug}`}
      className="group relative rounded-3xl border border-white/10 bg-white/5 overflow-hidden hover:border-neutral-300/50 transition-all duration-300"
    >
      {/* Available Now Badge - Prominent Position */}
      {therapist.available_now && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500 text-white text-sm font-semibold shadow-lg animate-pulse">
          <Zap className="h-3.5 w-3.5" />
          Available Now
        </div>
      )}

      {/* Verified Badge */}
      {therapist.identity_verified && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-medium">
            <CheckCircle className="h-3 w-3" />
            Verified
          </div>
        </div>
      )}

      {/* Image */}
      <div className="aspect-[4/3] bg-gradient-to-br from-white/20 to-neutral-100/20 flex items-center justify-center">
        {therapist.profile_photo ? (
          <img
            src={therapist.profile_photo}
            alt={therapist.display_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-6xl opacity-50">👤</span>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-white group-hover:text-white transition-colors">
            {therapist.display_name}
          </h3>
        </div>

        <p className="text-sm text-slate-400 mb-3 line-clamp-2">
          {therapist.headline}
        </p>

        <div className="flex items-center gap-3 text-sm text-slate-400 mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {therapist.city}, {therapist.state}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          {therapist.rating > 0 && (
            <>
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="font-medium text-white">{therapist.rating}</span>
              <span className="text-slate-500">
                ({therapist.override_reviews_count || 0} reviews)
              </span>
            </>
          )}
        </div>

        {therapist.services && therapist.services.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {therapist.services.slice(0, 3).map((service: string) => (
              <span
                key={service}
                className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-neutral-300"
              >
                {service}
              </span>
            ))}
            {therapist.services.length > 3 && (
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-400">
                +{therapist.services.length - 3} more
              </span>
            )}
          </div>
        )}

        {therapist.rate_60 && (
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-slate-400">Starting at</span>
            <span className="text-xl font-bold text-white">${therapist.rate_60}/hr</span>
          </div>
        )}
      </div>
    </Link>
  );
}
