import { createServerSupabaseClient } from "@/src/lib/supabase-server";
import { getAllCities } from "@/src/data/cities";
import { SITE_NAME } from "@/src/lib/site";
import { TherapistCard } from "@/src/types/therapist";
import Link from "next/link";
import ExploreFilters from "@/src/components/ExploreFilters";

// Force dynamic rendering - this page needs fresh data
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Explore Therapists",
  description: "Find professional massage therapists near you. Browse verified profiles, read reviews, and book appointments.",
};

export default async function ExplorePage() {
  const supabase = await createServerSupabaseClient();

  // Fetch therapists and sort client-side for multiple criteria
  const { data: rawTherapists } = await supabase
    .from("therapists")
    .select("user_id, slug, display_name, headline, city, state, rating, override_reviews_count, profile_photo, services, rate_60, identity_verified, available_now")
    .eq("status", "active")
    .limit(100);

  // Sort: Available Now first, then Verified, then by rating
  type RawTherapist = {
    user_id: string;
    slug: string;
    display_name: string;
    headline: string;
    city: string;
    state: string;
    rating: number;
    override_reviews_count?: number;
    profile_photo?: string;
    services?: string[];
    rate_60?: string;
    identity_verified?: boolean;
    available_now?: boolean;
  };

  const therapists = ((rawTherapists || []) as RawTherapist[]).sort((a, b) => {
    // Available Now first
    if (a.available_now && !b.available_now) return -1;
    if (!a.available_now && b.available_now) return 1;
    // Then Verified
    if (a.identity_verified && !b.identity_verified) return -1;
    if (!a.identity_verified && b.identity_verified) return 1;
    // Then by rating
    return (b.rating || 0) - (a.rating || 0);
  });

  const cities = getAllCities();

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-[#0a0a0f] to-indigo-950/20" />
      </div>

      {/* Header */}
      <header className="border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            {SITE_NAME}
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-slate-300 hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/join" className="rounded-full bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors">
              Join
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Title */}
        <div className="mb-12">
          <Link href="/" className="text-sm text-violet-400 hover:text-violet-300 mb-4 inline-block">
            ← Back to home
          </Link>
          <h1 className="text-4xl font-bold text-white mb-4">
            Find Your Therapist
          </h1>
          <p className="text-slate-400 max-w-2xl">
            Browse our directory of professional massage therapists. Filter by verified status, availability, and more.
          </p>
        </div>

        {/* City Quick Links */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-slate-400 mb-3">Browse by city</h2>
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/city/${city.slug}`}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 hover:border-violet-500/50 transition-colors"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Filters and Results */}
        <ExploreFilters
          therapists={(therapists as TherapistCard[]) || []}
          cities={cities}
        />
      </main>
    </div>
  );
}
