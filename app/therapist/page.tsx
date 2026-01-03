import { Metadata } from "next";
import Link from "next/link";
import { MapPin, Star, Search, Filter } from "lucide-react";
import { createServerSupabaseClient } from "@/src/lib/supabase-server";
import type { TherapistCard } from "@/src/types/therapist";

export const metadata: Metadata = {
  title: "Find Massage Therapists | MasseurMatch",
  description: "Browse and find licensed massage therapists near you. Search by location, specialty, and availability.",
};

export default async function TherapistListPage() {
  const supabase = await createServerSupabaseClient();

  const { data: therapists } = await supabase
    .from("profiles")
    .select("user_id, slug, display_name, headline, city, state, rating, profile_photo, services, rate_60")
    .eq("status", "active")
    .order("rating", { ascending: false })
    .limit(50);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            MasseurMatch
          </Link>
          <Link
            href="/join"
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
          >
            Join as Therapist
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Find a Massage Therapist</h1>
          <p className="text-xl text-slate-400">Browse our network of licensed professionals</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, city, or service..."
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
            />
          </div>
          <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-white hover:bg-white/10 transition-colors">
            <Filter className="h-5 w-5" />
            Filters
          </button>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["All", "Deep Tissue", "Swedish", "Sports", "Hot Stone", "Thai", "Couples"].map((filter) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === "All"
                  ? "bg-violet-600 text-white"
                  : "bg-white/5 text-slate-400 hover:text-white border border-white/10"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Results */}
        {!therapists || therapists.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-white/10 bg-white/5">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-white mb-2">No therapists found</h2>
            <p className="text-slate-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <p className="text-slate-400 mb-6">{therapists.length} therapists found</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(therapists as TherapistCard[]).map((t) => (
                <Link
                  key={t.user_id}
                  href={`/therapist/${t.slug}`}
                  className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:bg-white/10 transition-colors group"
                >
                  <div className="h-48 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 flex items-center justify-center relative overflow-hidden">
                    <span className="text-5xl group-hover:scale-110 transition-transform">💆</span>
                    {t.rate_60 && (
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white">
                        From {t.rate_60}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-white mb-1 group-hover:text-violet-400 transition-colors">
                      {t.display_name}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-1 mb-3">{t.headline}</p>

                    {t.services && t.services.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {t.services.slice(0, 2).map((service: string) => (
                          <span
                            key={service}
                            className="px-2 py-0.5 rounded-full text-xs bg-violet-600/20 text-violet-400"
                          >
                            {service}
                          </span>
                        ))}
                        {t.services.length > 2 && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-slate-400">
                            +{t.services.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-slate-400">
                        <MapPin className="h-3 w-3" />
                        {t.city}, {t.state}
                      </span>
                      {t.rating && (
                        <span className="flex items-center gap-1 text-yellow-400">
                          <Star className="h-3 w-3 fill-current" />
                          {t.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
