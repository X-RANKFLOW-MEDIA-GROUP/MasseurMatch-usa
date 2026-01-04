import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createServerSupabaseClient } from "@/src/lib/supabase-server";
import { SITE_URL, SITE_NAME } from "@/src/lib/site";
import Link from "next/link";
import { Star, MapPin, Clock, Phone, Mail, Globe, Instagram, Shield, Plane, Calendar } from "lucide-react";
import ProfileViewTracker from "@/src/components/ProfileViewTracker";

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
  total_reviews?: number;
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
  identity_verified?: boolean;
  visitor_cities?: Array<{
    city: string;
    state: string;
    start_date?: string;
    end_date?: string;
  }>;
};

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer: {
    display_name: string;
  } | null;
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

async function getReviews(therapistId: string): Promise<Review[]> {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from("reviews")
    .select(`
      id,
      rating,
      comment,
      created_at,
      reviewer:reviewer_id (display_name)
    `)
    .eq("therapist_id", therapistId)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(10);

  return (data as Review[]) || [];
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
  const description = therapist.about?.slice(0, 160) || `Contact ${therapist.display_name} - Professional massage therapist in ${therapist.city}`;

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

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? "text-amber-400 fill-amber-400" : "text-slate-600"
          }`}
        />
      ))}
    </div>
  );
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return date.toLocaleDateString();
}

function getUpcomingVisit(cities?: Therapist["visitor_cities"]) {
  if (!cities || cities.length === 0) return null;

  const now = new Date();
  for (const city of cities) {
    if (city.start_date) {
      const start = new Date(city.start_date);
      const end = city.end_date ? new Date(city.end_date) : null;

      if (now >= start && (!end || now <= end)) {
        return { ...city, status: "visiting" as const };
      } else if (now < start) {
        return { ...city, status: "upcoming" as const };
      }
    }
  }
  return null;
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

  const reviews = await getReviews(therapist.user_id);
  const reviewCount = therapist.total_reviews || therapist.override_reviews_count || reviews.length;
  const upcomingVisit = getUpcomingVisit(therapist.visitor_cities);

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
      reviewCount: reviewCount,
    } : undefined,
  };

  return (
    <>
      <ProfileViewTracker therapistId={therapist.user_id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
          {/* Visiting Banner */}
          {upcomingVisit && (
            <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${
              upcomingVisit.status === "visiting"
                ? "bg-green-500/10 border border-green-500/20"
                : "bg-blue-500/10 border border-blue-500/20"
            }`}>
              <Plane className={`h-5 w-5 ${upcomingVisit.status === "visiting" ? "text-green-400" : "text-blue-400"}`} />
              <div>
                <p className={`font-medium ${upcomingVisit.status === "visiting" ? "text-green-400" : "text-blue-400"}`}>
                  {upcomingVisit.status === "visiting" ? "Currently visiting" : "Visiting soon"}: {upcomingVisit.city}, {upcomingVisit.state}
                </p>
                {upcomingVisit.start_date && (
                  <p className="text-sm text-slate-400">
                    {upcomingVisit.start_date && upcomingVisit.end_date
                      ? `${new Date(upcomingVisit.start_date).toLocaleDateString()} - ${new Date(upcomingVisit.end_date).toLocaleDateString()}`
                      : `Starting ${new Date(upcomingVisit.start_date).toLocaleDateString()}`}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            {/* Photo */}
            <div className="flex-shrink-0 relative">
              {therapist.profile_photo ? (
                <img
                  src={therapist.profile_photo}
                  alt={therapist.display_name}
                  className="w-48 h-48 rounded-3xl object-cover"
                />
              ) : (
                <div className="w-48 h-48 rounded-3xl bg-white/20 flex items-center justify-center text-6xl">
                  👤
                </div>
              )}
              {therapist.identity_verified && (
                <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-green-500 text-white">
                  <Shield className="h-5 w-5" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-white">
                  {therapist.display_name}
                </h1>
                {therapist.identity_verified && (
                  <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
                    <Shield className="h-3 w-3" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-xl text-white mb-4">{therapist.headline}</p>

              <div className="flex flex-wrap gap-4 mb-6">
                <span className="flex items-center gap-2 text-slate-300">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  {therapist.city}, {therapist.state}
                  {therapist.neighborhood && ` (${therapist.neighborhood})`}
                </span>
                {therapist.rating > 0 && (
                  <span className="flex items-center gap-2 text-slate-300">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    {therapist.rating.toFixed(1)} ({reviewCount} reviews)
                  </span>
                )}
                {therapist.years_experience && (
                  <span className="flex items-center gap-2 text-slate-300">
                    <Clock className="h-4 w-4 text-slate-500" />
                    {therapist.years_experience} years experience
                  </span>
                )}
              </div>

              {/* Availability Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {therapist.is_available && (
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium animate-pulse">
                    🟢 Available Now
                  </span>
                )}
                {therapist.incall_available && (
                  <span className="px-3 py-1 rounded-full bg-neutral-200/20 text-neutral-300 text-sm">
                    In-call
                  </span>
                )}
                {therapist.outcall_available && (
                  <span className="px-3 py-1 rounded-full bg-white/10 text-neutral-300 text-sm">
                    Out-call
                  </span>
                )}
              </div>

              {/* Contact Button */}
              {therapist.phone && (
                <a
                  href={`tel:${therapist.phone}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-medium text-white hover:bg-neutral-200 transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  Contact Now
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
                        className="px-3 py-1 rounded-full bg-white/20 text-neutral-300 text-sm"
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
                        className="px-3 py-1 rounded-full bg-neutral-800/20 text-neutral-300 text-sm"
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

              {/* Reviews Section */}
              <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-400" />
                    Reviews
                  </h2>
                  {therapist.rating > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-white">{therapist.rating.toFixed(1)}</span>
                      <div>
                        <StarRating rating={Math.round(therapist.rating)} />
                        <p className="text-xs text-slate-500">{reviewCount} reviews</p>
                      </div>
                    </div>
                  )}
                </div>

                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="p-4 rounded-xl bg-white/5 border border-white/5"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-white">
                              {review.reviewer?.display_name || "Anonymous"}
                            </p>
                            <StarRating rating={review.rating} />
                          </div>
                          <span className="text-xs text-slate-500">
                            {formatDate(review.created_at)}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-slate-300 text-sm mt-2">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No reviews yet</p>
                    <p className="text-sm text-slate-500">Be the first to leave a review</p>
                  </div>
                )}
              </section>
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
                    <a href={`tel:${therapist.phone}`} className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors">
                      <Phone className="h-4 w-4" />
                      {therapist.phone}
                    </a>
                  )}
                  {therapist.email && (
                    <a href={`mailto:${therapist.email}`} className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors">
                      <Mail className="h-4 w-4" />
                      {therapist.email}
                    </a>
                  )}
                  {therapist.website && (
                    <a href={therapist.website} target="_blank" rel="noopener" className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors">
                      <Globe className="h-4 w-4" />
                      Website
                    </a>
                  )}
                  {therapist.instagram && (
                    <a href={`https://instagram.com/${therapist.instagram.replace("@", "")}`} target="_blank" rel="noopener" className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors">
                      <Instagram className="h-4 w-4" />
                      {therapist.instagram}
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
