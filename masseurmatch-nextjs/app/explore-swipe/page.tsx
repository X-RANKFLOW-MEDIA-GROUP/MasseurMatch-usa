"use client";

import { useState } from "react";
import { SwipeInterface } from "@/components/explore/SwipeInterface";
import { useExplore, useMatches } from "@/lib/hooks/useExplore";
import { Button } from "@/components/ui/button";
import { CardSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { MapPin, Heart, Sliders } from "lucide-react";
import { motion } from "framer-motion";

export default function ExploreSwipePage() {
  const [filters, setFilters] = useState({
    city: "",
    state: "",
    radius: 25,
    services: [],
    minRating: 0,
  });

  const [showFilters, setShowFilters] = useState(false);

  const { therapists, isLoading, error, refetch, like, pass } = useExplore(filters);
  const { matches } = useMatches();


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 p-4">
        <div className="max-w-md mx-auto py-8">
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center p-4">
        <ErrorState onRetry={refetch} />
      </div>
    );
  }

  if (!therapists || therapists.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center p-4">
        <EmptyState
          icon={MapPin}
          title="No Therapists Found"
          description="Try adjusting your filters or search in a different area."
          action={{
            label: "Clear Filters",
            onClick: () => setFilters({
              city: "",
              state: "",
              radius: 25,
              services: [],
              minRating: 0,
            }),
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gradient">Discover</h1>
              <p className="text-sm text-slate-400">
                Find your perfect massage therapist
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Sliders className="w-4 h-4" />
                Filters
              </Button>

              {matches.length > 0 && (
                <Button
                  size="sm"
                  className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  <Heart className="w-4 h-4" />
                  {matches.length}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-slate-900/30 border-b border-slate-800 overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  placeholder="San Francisco"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={filters.state}
                  onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                  placeholder="CA"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Radius (mi)
                </label>
                <input
                  type="number"
                  value={filters.radius}
                  onChange={(e) => setFilters({ ...filters, radius: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="flex items-end">
                <Button
                  onClick={() => refetch()}
                  className="w-full bg-purple-500 hover:bg-purple-600"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Swipe Interface */}
      <SwipeInterface
        therapists={therapists}
        onLike={like}
        onPass={pass}
        matchCount={matches.length}
      />
    </div>
  );
}
