import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createServerSupabaseClient } from "@/src/lib/supabase-server";
import { getCityBySlug, getAllCities } from "@/src/data/cities";
import { SITE_NAME } from "@/src/lib/site";
import { TherapistCard } from "@/src/types/therapist";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);

  if (!city) {
    return { title: "City Not Found" };
  }

  return {
    title: `Massage Therapists in ${city.name}, ${city.state}`,
    description: `Find professional massage therapists in ${city.name}, ${city.state}. Browse verified profiles, read reviews, and book appointments.`,
  };
}

export async function generateStaticParams() {
  return getAllCities().map((city) => ({
    city: city.slug,
  }));
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  const supabase = await createServerSupabaseClient();

  const { data: therapists } = await supabase
    .from("therapists")
    .select("user_id, slug, display_name, headline, city, state, rating, profile_photo, services, rate_60")
    .eq("status", "active")
    .ilike("city", `%${city.name}%`)
    .order("rating", { ascending: false })
    .limit(20);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-50">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-neutral-200 to-white bg-clip-text text-transparent">
            {SITE_NAME}
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/explore" className="text-sm text-slate-300 hover:text-white">
              Explore
            </Link>
            <Link href="/login" className="text-sm text-slate-300 hover:text-white">
              Login
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Hero */}
        <div className="mb-12">
          <Link href="/explore" className="text-sm text-white hover:text-neutral-300 mb-4 inline-block">
            ← All Cities
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Massage Therapists in{" "}
            <span className="bg-gradient-to-r from-neutral-200 to-white bg-clip-text text-transparent">
              {city.name}, {city.state}
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Find licensed, professional massage therapists in {city.name}.
            Browse profiles, read reviews, and book your next appointment.
          </p>
        </div>

        {/* Results */}
        {therapists && therapists.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(therapists as TherapistCard[]).map((therapist) => (
              <Link
                key={therapist.user_id}
                href={`/therapist/${therapist.slug}`}
                className="group rounded-3xl border border-white/10 bg-white/5 overflow-hidden hover:border-neutral-300/50 transition-all"
              >
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
                  <h2 className="text-xl font-semibold text-white group-hover:text-white transition-colors mb-2">
                    {therapist.display_name}
                  </h2>
                  <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                    {therapist.headline}
                  </p>

                  <div className="flex items-center gap-3 mb-4">
                    {therapist.rating > 0 && (
                      <span className="text-sm text-slate-300">
                        ⭐ {therapist.rating}
                      </span>
                    )}
                    <span className="text-sm text-slate-500">
                      📍 {therapist.city}
                    </span>
                  </div>

                  {therapist.services && therapist.services.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {therapist.services.slice(0, 3).map((service: string) => (
                        <span
                          key={service}
                          className="px-2 py-0.5 rounded-full bg-white/20 text-neutral-300 text-xs"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  )}

                  {therapist.rate_60 && (
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <span className="text-slate-500 text-sm">Starting at</span>
                      <span className="text-white font-semibold">${therapist.rate_60}/hr</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <h2 className="text-xl font-semibold text-white mb-2">No therapists found</h2>
            <p className="text-slate-400 mb-6">
              We don&apos;t have any therapists in {city.name} yet.
            </p>
            <Link
              href="/join"
              className="inline-flex rounded-xl bg-white px-6 py-3 font-medium text-white hover:bg-neutral-200 transition-colors"
            >
              Be the first to join
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
