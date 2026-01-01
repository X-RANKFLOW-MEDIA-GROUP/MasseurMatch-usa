import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createServerSupabaseClient } from "@/src/lib/supabase-server";
import { SITE_URL, SITE_NAME } from "@/src/lib/site";
import Link from "next/link";

type Therapist = {
  user_id: string;
  slug: string;
  display_name: string;
  full_name: string;
  headline: string;
  about: string;
  philosophy?: string;
  city: string;
  state: string;
  neighborhood?: string;
  phone?: string;
  email?: string;
  website?: string;
  instagram?: string;
  rating: number;
  override_reviews_count?: number;
  profile_photo?: string;
  gallery?: string[];
  services?: string[];
  massage_techniques?: string[];
  studio_amenities?: string[];
  rate_60?: string;
  rate_90?: string;
  rate_outcall?: string;
  payment_methods?: string[];
  years_experience?: number;
  languages?: string[];
  degrees?: string;
  is_available?: boolean;
  incall_available?: boolean;
  outcall_available?: boolean;
};

async function getTherapist(slug: string): Promise<Therapist | null> {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from("therapists")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const therapist = await getTherapist(slug);

  if (!therapist) {
    return { title: "Therapist Not Found" };
  }

  const title = `${therapist.display_name} - ${therapist.headline || "Massage Therapist"} in ${therapist.city}, ${therapist.state}`;
  const description = therapist.about?.slice(0, 160) || `Book ${therapist.display_name} in ${therapist.city}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: therapist.profile_photo ? [therapist.profile_photo] : [],
    },
  };
}

export default async function TherapistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const therapist = await getTherapist(slug);

  if (!therapist) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: therapist.display_name,
    description: therapist.about || therapist.headline,
    url: `${SITE_URL}/therapist/${therapist.slug}`,
    telephone: therapist.phone,
    image: therapist.profile_photo,
    address: {
      "@type": "PostalAddress",
      addressLocality: therapist.city,
      addressRegion: therapist.state,
      addressCountry: "US",
    },
    aggregateRating: therapist.rating ? {
      "@type": "AggregateRating",
      ratingValue: therapist.rating,
      reviewCount: therapist.override_reviews_count || 0,
    } : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#0a0a0f]">
        {/* Header */}
        <header className="border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-50">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
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
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            {/* Photo */}
            <div className="flex-shrink-0">
              {therapist.profile_photo ? (
                <img
                  src={therapist.profile_photo}
                  alt={therapist.display_name}
                  className="w-48 h-48 rounded-3xl object-cover"
                />
              ) : (
                <div className="w-48 h-48 rounded-3xl bg-violet-600/20 flex items-center justify-center text-6xl">
                  👤
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">
                {therapist.display_name}
              </h1>
              <p className="text-xl text-violet-400 mb-4">{therapist.headline}</p>

              <div className="flex flex-wrap gap-4 mb-6">
                <span className="flex items-center gap-2 text-slate-300">
                  📍 {therapist.city}, {therapist.state}
                  {therapist.neighborhood && ` (${therapist.neighborhood})`}
                </span>
                {therapist.rating > 0 && (
                  <span className="flex items-center gap-2 text-slate-300">
                    ⭐ {therapist.rating} ({therapist.override_reviews_count || 0} reviews)
                  </span>
                )}
                {therapist.years_experience && (
                  <span className="flex items-center gap-2 text-slate-300">
                    🎓 {therapist.years_experience} years experience
                  </span>
                )}
              </div>

              {/* Availability Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {therapist.is_available && (
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
                    Available Now
                  </span>
                )}
                {therapist.incall_available && (
                  <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-sm">
                    In-call
                  </span>
                )}
                {therapist.outcall_available && (
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm">
                    Out-call
                  </span>
                )}
              </div>

              {/* Contact Button */}
              {therapist.phone && (
                <a
                  href={`tel:${therapist.phone}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-medium text-white hover:bg-violet-500 transition-colors"
                >
                  📞 Contact
                </a>
              )}
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* About */}
              {therapist.about && (
                <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">About</h2>
                  <p className="text-slate-300 whitespace-pre-line">{therapist.about}</p>
                </section>
              )}

              {/* Philosophy */}
              {therapist.philosophy && (
                <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Philosophy</h2>
                  <p className="text-slate-300 whitespace-pre-line">{therapist.philosophy}</p>
                </section>
              )}

              {/* Services */}
              {therapist.services && therapist.services.length > 0 && (
                <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Services</h2>
                  <div className="flex flex-wrap gap-2">
                    {therapist.services.map((service) => (
                      <span
                        key={service}
                        className="px-3 py-1 rounded-full bg-violet-600/20 text-violet-300 text-sm"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Techniques */}
              {therapist.massage_techniques && therapist.massage_techniques.length > 0 && (
                <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Massage Techniques</h2>
                  <div className="flex flex-wrap gap-2">
                    {therapist.massage_techniques.map((technique) => (
                      <span
                        key={technique}
                        className="px-3 py-1 rounded-full bg-indigo-600/20 text-indigo-300 text-sm"
                      >
                        {technique}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Gallery */}
              {therapist.gallery && therapist.gallery.length > 0 && (
                <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {therapist.gallery.map((photo, i) => (
                      <img
                        key={i}
                        src={photo}
                        alt={`${therapist.display_name} gallery ${i + 1}`}
                        className="rounded-xl aspect-square object-cover"
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pricing */}
              {(therapist.rate_60 || therapist.rate_90 || therapist.rate_outcall) && (
                <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Rates</h2>
                  <div className="space-y-3">
                    {therapist.rate_60 && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">60 min</span>
                        <span className="text-white font-medium">${therapist.rate_60}</span>
                      </div>
                    )}
                    {therapist.rate_90 && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">90 min</span>
                        <span className="text-white font-medium">${therapist.rate_90}</span>
                      </div>
                    )}
                    {therapist.rate_outcall && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Outcall</span>
                        <span className="text-white font-medium">+${therapist.rate_outcall}</span>
                      </div>
                    )}
                  </div>
                  {therapist.payment_methods && therapist.payment_methods.length > 0 && (
                    <p className="mt-4 text-sm text-slate-500">
                      Accepts: {therapist.payment_methods.join(", ")}
                    </p>
                  )}
                </section>
              )}

              {/* Amenities */}
              {therapist.studio_amenities && therapist.studio_amenities.length > 0 && (
                <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Amenities</h2>
                  <ul className="space-y-2">
                    {therapist.studio_amenities.map((amenity) => (
                      <li key={amenity} className="text-slate-300 flex items-center gap-2">
                        <span className="text-green-400">✓</span> {amenity}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Languages */}
              {therapist.languages && therapist.languages.length > 0 && (
                <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Languages</h2>
                  <p className="text-slate-300">{therapist.languages.join(", ")}</p>
                </section>
              )}

              {/* Contact Info */}
              <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Contact</h2>
                <div className="space-y-3">
                  {therapist.phone && (
                    <a href={`tel:${therapist.phone}`} className="flex items-center gap-2 text-slate-300 hover:text-violet-400">
                      📞 {therapist.phone}
                    </a>
                  )}
                  {therapist.email && (
                    <a href={`mailto:${therapist.email}`} className="flex items-center gap-2 text-slate-300 hover:text-violet-400">
                      📧 {therapist.email}
                    </a>
                  )}
                  {therapist.website && (
                    <a href={therapist.website} target="_blank" rel="noopener" className="flex items-center gap-2 text-slate-300 hover:text-violet-400">
                      🌐 Website
                    </a>
                  )}
                  {therapist.instagram && (
                    <a href={`https://instagram.com/${therapist.instagram.replace("@", "")}`} target="_blank" rel="noopener" className="flex items-center gap-2 text-slate-300 hover:text-violet-400">
                      📸 {therapist.instagram}
                    </a>
                  )}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
