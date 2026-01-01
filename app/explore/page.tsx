import { createServerSupabaseClient } from "@/src/lib/supabase-server";
import { getAllCities } from "@/src/data/cities";
import { SITE_NAME } from "@/src/lib/site";
import { TherapistCard } from "@/src/types/therapist";
import Link from "next/link";

export const metadata = {
  title: "Explore Therapists",
  description: "Find professional massage therapists near you. Browse verified profiles, read reviews, and book appointments.",
};

export default async function ExplorePage() {
  const supabase = await createServerSupabaseClient();

  const { data: therapists } = await supabase
    .from("therapists")
    .select("user_id, slug, display_name, headline, city, state, rating, override_reviews_count, profile_photo, services, rate_60")
    .eq("status", "active")
    .order("rating", { ascending: false })
    .limit(30);

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
            Browse our directory of licensed, professional massage therapists.
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

        {/* Results Grid */}
        {therapists && therapists.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(therapists as TherapistCard[]).map((therapist) => (
              <Link
                key={therapist.user_id}
                href={`/therapist/${therapist.slug}`}
                className="group rounded-3xl border border-white/10 bg-white/5 overflow-hidden hover:border-violet-500/50 transition-all duration-300"
              >
                {/* Image */}
                <div className="aspect-[4/3] bg-gradient-to-br from-violet-600/20 to-indigo-600/20 flex items-center justify-center">
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
                  <h3 className="text-xl font-semibold text-white group-hover:text-violet-400 transition-colors mb-2">
                    {therapist.display_name}
                  </h3>

                  <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                    {therapist.headline}
                  </p>

                  <div className="flex items-center gap-3 text-sm text-slate-400 mb-3">
                    <span>📍 {therapist.city}, {therapist.state}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    {therapist.rating > 0 && (
                      <>
                        <span className="text-yellow-500">⭐</span>
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
                          className="rounded-full bg-violet-600/20 px-2 py-0.5 text-xs font-medium text-violet-300"
                        >
                          {service}
                        </span>
                      ))}
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
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <h2 className="text-xl font-semibold text-white mb-2">No therapists yet</h2>
            <p className="text-slate-400 mb-6">
              Be the first to create a profile and start receiving clients.
            </p>
            <Link
              href="/join"
              className="inline-flex rounded-xl bg-violet-600 px-6 py-3 font-medium text-white hover:bg-violet-500 transition-colors"
            >
              Create Your Profile
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
