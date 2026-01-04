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
    <div className="min-h-screen bg-black">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-black" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_90%)]" />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 glass sticky top-0 z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-white hover:opacity-80 transition-opacity">
            {SITE_NAME}
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-neutral-400 hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/join" className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Join
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Title */}
        <div className="mb-12 animate-fade-up">
          <Link href="/" className="text-sm text-neutral-400 hover:text-white mb-4 inline-flex items-center gap-2 group transition-colors">
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            Back to home
          </Link>
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Find Your Therapist
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl">
            Browse our directory of professional massage therapists. Filter by verified status, availability, and more.
          </p>
        </div>

        {/* City Quick Links */}
        <div className="mb-12 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-sm font-medium text-neutral-500 mb-4 uppercase tracking-wider">Browse by city</h2>
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/city/${city.slug}`}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all backdrop-blur-sm"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Filters and Results */}
        <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <ExploreFilters
            therapists={(therapists as TherapistCard[]) || []}
            cities={cities}
          />
        </div>
      </main>
    </div>
  );
}
