import { Metadata } from "next";
import Link from "next/link";
import { MapPin, Star, ArrowLeft } from "lucide-react";
import { createServerSupabaseClient } from "@/src/lib/supabase-server";
import { getAllCities, getCityBySlug } from "@/src/data/cities";
import type { TherapistCard } from "@/src/types/therapist";

const SEGMENTS = {
  "deep-tissue": { name: "Deep Tissue", description: "Intensive therapy for chronic pain and tension" },
  "swedish": { name: "Swedish Massage", description: "Relaxing full-body massage" },
  "sports": { name: "Sports Massage", description: "For athletes and active individuals" },
  "hot-stone": { name: "Hot Stone", description: "Heated stone therapy for deep relaxation" },
  "thai": { name: "Thai Massage", description: "Traditional stretching and pressure therapy" },
  "prenatal": { name: "Prenatal", description: "Safe massage for expecting mothers" },
  "couples": { name: "Couples Massage", description: "Side-by-side massage experience" },
};

type Props = {
  params: Promise<{ city: string; segment: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, segment } = await params;
  const cityData = getCityBySlug(city);
  const segmentData = SEGMENTS[segment as keyof typeof SEGMENTS];

  if (!cityData || !segmentData) {
    return { title: "Not Found" };
  }

  return {
    title: `${segmentData.name} in ${cityData.name} | MasseurMatch`,
    description: `Find the best ${segmentData.name.toLowerCase()} therapists in ${cityData.name}, ${cityData.state}. ${segmentData.description}.`,
  };
}

export async function generateStaticParams() {
  const cities = getAllCities();
  const params: { city: string; segment: string }[] = [];
  for (const city of cities) {
    for (const segment of Object.keys(SEGMENTS)) {
      params.push({ city: city.slug, segment });
    }
  }
  return params;
}

export default async function CitySegmentPage({ params }: Props) {
  const { city, segment } = await params;
  const cityData = getCityBySlug(city);
  const segmentData = SEGMENTS[segment as keyof typeof SEGMENTS];

  if (!cityData || !segmentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <p className="text-white">Page not found</p>
      </div>
    );
  }

  const supabase = await createServerSupabaseClient();
  const { data: therapists } = await supabase
    .from("profiles")
    .select("user_id, slug, display_name, headline, city, state, rating, profile_photo, services")
    .eq("city", cityData.name)
    .contains("services", [segmentData.name])
    .limit(20);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-neutral-200 to-white bg-clip-text text-transparent">
            MasseurMatch
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Link
          href={`/city/${city}`}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {cityData.name}
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            {segmentData.name} in {cityData.name}
          </h1>
          <p className="text-xl text-slate-400">{segmentData.description}</p>
        </div>

        {/* Segment Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {Object.entries(SEGMENTS).map(([key, seg]) => (
            <Link
              key={key}
              href={`/city/${city}/${key}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                key === segment
                  ? "bg-white text-white"
                  : "bg-white/5 text-slate-400 hover:text-white border border-white/10"
              }`}
            >
              {seg.name}
            </Link>
          ))}
        </div>

        {/* Therapist Grid */}
        {!therapists || therapists.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-white/10 bg-white/5">
            <div className="text-6xl mb-4">💆</div>
            <h2 className="text-xl font-semibold text-white mb-2">No therapists found</h2>
            <p className="text-slate-400 mb-6">
              We don&apos;t have {segmentData.name.toLowerCase()} therapists in {cityData.name} yet.
            </p>
            <Link
              href={`/city/${city}`}
              className="inline-block rounded-xl bg-white px-6 py-3 font-semibold text-white hover:bg-neutral-200 transition-colors"
            >
              View All Therapists
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(therapists as TherapistCard[]).map((t) => (
              <Link
                key={t.user_id}
                href={`/therapist/${t.slug}`}
                className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:bg-white/10 transition-colors"
              >
                <div className="h-48 bg-gradient-to-br from-white/20 to-neutral-100/20 flex items-center justify-center">
                  <span className="text-5xl">💆</span>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-white mb-1">{t.display_name}</h3>
                  <p className="text-sm text-slate-400 line-clamp-1 mb-2">{t.headline}</p>
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
        )}
      </main>
    </div>
  );
}
