"use client";

import { notFound } from "next/navigation";
import { supabase } from "@/src/lib/supabase";
import { SITE_NAME } from "@/src/lib/site";
import Link from "next/link";
import { Star, MapPin, Clock, Phone, Mail, Globe, Instagram, Shield, Plane, CheckCircle, Award, Briefcase } from "lucide-react";
import ProfileViewTracker from "@/src/components/ProfileViewTracker";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Therapist = {
  user_id: string;
  slug: string;
  display_name: string;
  full_name: string;
  headline: string;
  professional_title?: string;
  about: string;
  philosophy?: string;
  city: string;
  state: string;
  street_address?: string;
  zip_code?: string;
  neighborhood?: string;
  phone?: string;
  email?: string;
  website?: string;
  instagram?: string;
  whatsapp?: string;
  rating: number;
  total_reviews?: number;
  override_reviews_count?: number;
  profile_photo?: string;
  gallery?: string[];
  gallery_photos?: string[];
  services?: string[];
  massage_techniques?: string[];
  studio_amenities?: string[];
  mobile_extras?: string[];
  product_sales?: string[];
  rate_60?: string;
  rate_90?: string;
  rate_120?: string;
  rate_outcall?: string;
  payment_methods?: string[];
  discount_new_client?: string;
  discount_multiple_sessions?: string;
  discount_referrals?: string;
  discount_group?: string;
  years_experience?: number;
  languages?: string[];
  degrees_certifications?: string;
  professional_affiliations?: string;
  travel_schedule?: string;
  is_available?: boolean;
  incall_available?: boolean;
  in_studio?: boolean;
  outcall_available?: boolean;
  mobile_service?: boolean;
  hotel_visits?: boolean;
  identity_verified?: boolean;
  preference_lgbtq_only?: boolean;
  preference_men_only?: boolean;
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

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? "text-white fill-white" : "text-neutral-600"
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

export default function TherapistPage({
  params,
}: {
  params: { slug: string };
}) {
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // Fetch therapist data
      const { data: therapistData } = await supabase
        .from("therapists")
        .select("*")
        .eq("slug", params.slug)
        .eq("status", "active")
        .single();

      if (!therapistData) {
        setLoading(false);
        return;
      }

      setTherapist(therapistData);

      // Fetch reviews
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select(`
          id,
          rating,
          comment,
          created_at,
          reviewer:reviewer_id (display_name)
        `)
        .eq("therapist_id", therapistData.user_id)
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(10);

      setReviews((reviewsData as any) || []);
      setLoading(false);
    }

    loadData();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-white border-t-transparent" />
      </div>
    );
  }

  if (!therapist) {
    notFound();
  }

  const reviewCount = therapist.total_reviews || therapist.override_reviews_count || reviews.length;
  const upcomingVisit = getUpcomingVisit(therapist.visitor_cities);
  const allPhotos = [...(therapist.gallery || []), ...(therapist.gallery_photos || [])];

  return (
    <>
      <ProfileViewTracker therapistId={therapist.user_id} />

      <div className="min-h-screen bg-black">
        {/* Background Effects */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-black" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />
        </div>

        {/* Header */}
        <header className="border-b border-white/5 glass sticky top-0 z-50">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-xl font-bold text-white hover:text-neutral-200 transition-colors">
              {SITE_NAME}
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/explore" className="text-sm text-neutral-400 hover:text-white transition-colors">
                Explore
              </Link>
              <Link href="/login" className="text-sm text-neutral-400 hover:text-white transition-colors">
                Login
              </Link>
            </div>
          </nav>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-12">
          {/* Visiting Banner */}
          {upcomingVisit && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${
                upcomingVisit.status === "visiting"
                  ? "bg-white/10 border border-white/20"
                  : "bg-white/5 border border-white/10"
              }`}
            >
              <Plane className="h-5 w-5 text-white" />
              <div>
                <p className="font-medium text-white">
                  {upcomingVisit.status === "visiting" ? "Currently visiting" : "Visiting soon"}: {upcomingVisit.city}, {upcomingVisit.state}
                </p>
                {upcomingVisit.start_date && (
                  <p className="text-sm text-neutral-400">
                    {upcomingVisit.start_date && upcomingVisit.end_date
                      ? `${new Date(upcomingVisit.start_date).toLocaleDateString()} - ${new Date(upcomingVisit.end_date).toLocaleDateString()}`
                      : `Starting ${new Date(upcomingVisit.start_date).toLocaleDateString()}`}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row gap-8 mb-12"
          >
            {/* Photo */}
            <div className="flex-shrink-0 relative">
              {therapist.profile_photo ? (
                <img
                  src={therapist.profile_photo}
                  alt={therapist.display_name}
                  className="w-48 h-48 rounded-3xl object-cover border border-white/10"
                />
              ) : (
                <div className="w-48 h-48 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-6xl">
                  👤
                </div>
              )}
              {therapist.identity_verified && (
                <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-white text-black">
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
                  <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 text-white text-xs border border-white/20">
                    <Shield className="h-3 w-3" />
                    Verified
                  </span>
                )}
              </div>

              {therapist.professional_title && (
                <p className="text-xl text-white mb-2">{therapist.professional_title}</p>
              )}
              {therapist.headline && (
                <p className="text-lg text-neutral-400 mb-4">{therapist.headline}</p>
              )}

              <div className="flex flex-wrap gap-4 mb-6">
                <span className="flex items-center gap-2 text-neutral-300">
                  <MapPin className="h-4 w-4 text-neutral-500" />
                  {therapist.city}, {therapist.state}
                  {therapist.neighborhood && ` (${therapist.neighborhood})`}
                </span>
                {therapist.rating > 0 && (
                  <span className="flex items-center gap-2 text-neutral-300">
                    <Star className="h-4 w-4 text-white fill-white" />
                    {therapist.rating.toFixed(1)} ({reviewCount} reviews)
                  </span>
                )}
                {therapist.years_experience && (
                  <span className="flex items-center gap-2 text-neutral-300">
                    <Clock className="h-4 w-4 text-neutral-500" />
                    {therapist.years_experience} years experience
                  </span>
                )}
              </div>

              {/* Availability Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {therapist.is_available && (
                  <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium border border-white/30">
                    🟢 Available Now
                  </span>
                )}
                {therapist.in_studio && (
                  <span className="px-3 py-1 rounded-full bg-white/5 text-neutral-300 text-sm border border-white/10">
                    In-Studio
                  </span>
                )}
                {therapist.mobile_service && (
                  <span className="px-3 py-1 rounded-full bg-white/5 text-neutral-300 text-sm border border-white/10">
                    Mobile Service
                  </span>
                )}
                {therapist.hotel_visits && (
                  <span className="px-3 py-1 rounded-full bg-white/5 text-neutral-300 text-sm border border-white/10">
                    Hotel Visits
                  </span>
                )}
              </div>

              {/* Contact Button */}
              {therapist.phone && (
                <a
                  href={`tel:${therapist.phone}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-medium text-black hover:bg-neutral-200 transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  Contact Now
                </a>
              )}
            </div>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* About */}
              {therapist.about && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <h2 className="text-xl font-semibold text-white mb-4">About</h2>
                  <p className="text-neutral-300 whitespace-pre-line leading-relaxed">{therapist.about}</p>
                </motion.section>
              )}

              {/* Philosophy */}
              {therapist.philosophy && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <h2 className="text-xl font-semibold text-white mb-4">My Philosophy</h2>
                  <p className="text-neutral-300 whitespace-pre-line leading-relaxed">{therapist.philosophy}</p>
                </motion.section>
              )}

              {/* Massage Techniques */}
              {therapist.massage_techniques && therapist.massage_techniques.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <h2 className="text-xl font-semibold text-white mb-4">Massage Techniques</h2>
                  <div className="flex flex-wrap gap-2">
                    {therapist.massage_techniques.map((technique) => (
                      <span
                        key={technique}
                        className="px-3 py-1.5 rounded-full bg-white/10 text-neutral-300 text-sm border border-white/10"
                      >
                        {technique}
                      </span>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Amenities & Extras */}
              {((therapist.studio_amenities && therapist.studio_amenities.length > 0) ||
                (therapist.mobile_extras && therapist.mobile_extras.length > 0)) && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <h2 className="text-xl font-semibold text-white mb-4">Amenities & Extras</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {therapist.studio_amenities && therapist.studio_amenities.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-neutral-400 mb-3">Studio Amenities</h3>
                        <ul className="space-y-2">
                          {therapist.studio_amenities.map((amenity) => (
                            <li key={amenity} className="text-neutral-300 flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-white" /> {amenity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {therapist.mobile_extras && therapist.mobile_extras.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-neutral-400 mb-3">Mobile Extras</h3>
                        <ul className="space-y-2">
                          {therapist.mobile_extras.map((extra) => (
                            <li key={extra} className="text-neutral-300 flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-white" /> {extra}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.section>
              )}

              {/* Products for Sale */}
              {therapist.product_sales && therapist.product_sales.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <h2 className="text-xl font-semibold text-white mb-4">Products for Sale</h2>
                  <div className="flex flex-wrap gap-2">
                    {therapist.product_sales.map((product) => (
                      <span
                        key={product}
                        className="px-3 py-1.5 rounded-full bg-white/10 text-neutral-300 text-sm border border-white/10"
                      >
                        {product}
                      </span>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Gallery */}
              {allPhotos.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <h2 className="text-xl font-semibold text-white mb-4">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {allPhotos.map((photo, i) => (
                      <img
                        key={i}
                        src={photo}
                        alt={`${therapist.display_name} gallery ${i + 1}`}
                        className="rounded-xl aspect-square object-cover border border-white/10"
                      />
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Professional Credentials */}
              {(therapist.degrees_certifications || therapist.professional_affiliations) && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Professional Credentials
                  </h2>
                  {therapist.degrees_certifications && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-neutral-400 mb-2">Degrees & Certifications</h3>
                      <p className="text-neutral-300 whitespace-pre-line">{therapist.degrees_certifications}</p>
                    </div>
                  )}
                  {therapist.professional_affiliations && (
                    <div>
                      <h3 className="text-sm font-medium text-neutral-400 mb-2">Professional Affiliations</h3>
                      <p className="text-neutral-300 whitespace-pre-line">{therapist.professional_affiliations}</p>
                    </div>
                  )}
                </motion.section>
              )}

              {/* Travel Schedule */}
              {therapist.travel_schedule && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Business Travel Schedule
                  </h2>
                  <p className="text-neutral-300 whitespace-pre-line">{therapist.travel_schedule}</p>
                </motion.section>
              )}

              {/* Reviews Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Star className="h-5 w-5 text-white" />
                    Reviews
                  </h2>
                  {therapist.rating > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-white">{therapist.rating.toFixed(1)}</span>
                      <div>
                        <StarRating rating={Math.round(therapist.rating)} />
                        <p className="text-xs text-neutral-500">{reviewCount} reviews</p>
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
                          <span className="text-xs text-neutral-500">
                            {formatDate(review.created_at)}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-neutral-300 text-sm mt-2">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="h-10 w-10 text-neutral-600 mx-auto mb-3" />
                    <p className="text-neutral-400">No reviews yet</p>
                    <p className="text-sm text-neutral-500">Be the first to leave a review</p>
                  </div>
                )}
              </motion.section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pricing */}
              {(therapist.rate_60 || therapist.rate_90 || therapist.rate_120) && (
                <motion.section
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <h2 className="text-xl font-semibold text-white mb-4">Rates</h2>
                  <div className="space-y-3">
                    {therapist.rate_60 && (
                      <div className="flex justify-between">
                        <span className="text-neutral-400">60 min</span>
                        <span className="text-white font-medium">${therapist.rate_60}</span>
                      </div>
                    )}
                    {therapist.rate_90 && (
                      <div className="flex justify-between">
                        <span className="text-neutral-400">90 min</span>
                        <span className="text-white font-medium">${therapist.rate_90}</span>
                      </div>
                    )}
                    {therapist.rate_120 && (
                      <div className="flex justify-between">
                        <span className="text-neutral-400">120 min</span>
                        <span className="text-white font-medium">${therapist.rate_120}</span>
                      </div>
                    )}
                  </div>
                  {therapist.payment_methods && therapist.payment_methods.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-sm text-neutral-400 mb-2">Payment Methods</p>
                      <p className="text-sm text-neutral-300">
                        {therapist.payment_methods.join(", ")}
                      </p>
                    </div>
                  )}
                </motion.section>
              )}

              {/* Discounts */}
              {(therapist.discount_new_client || therapist.discount_multiple_sessions ||
                therapist.discount_referrals || therapist.discount_group) && (
                <motion.section
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <h2 className="text-xl font-semibold text-white mb-4">Special Offers</h2>
                  <div className="space-y-3">
                    {therapist.discount_new_client && (
                      <div>
                        <p className="text-xs text-neutral-400">New Client</p>
                        <p className="text-sm text-white">{therapist.discount_new_client}</p>
                      </div>
                    )}
                    {therapist.discount_multiple_sessions && (
                      <div>
                        <p className="text-xs text-neutral-400">Multiple Sessions</p>
                        <p className="text-sm text-white">{therapist.discount_multiple_sessions}</p>
                      </div>
                    )}
                    {therapist.discount_referrals && (
                      <div>
                        <p className="text-xs text-neutral-400">Referrals</p>
                        <p className="text-sm text-white">{therapist.discount_referrals}</p>
                      </div>
                    )}
                    {therapist.discount_group && (
                      <div>
                        <p className="text-xs text-neutral-400">Group/Couples</p>
                        <p className="text-sm text-white">{therapist.discount_group}</p>
                      </div>
                    )}
                  </div>
                </motion.section>
              )}

              {/* Languages */}
              {therapist.languages && therapist.languages.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <h2 className="text-xl font-semibold text-white mb-4">Languages</h2>
                  <p className="text-neutral-300">{therapist.languages.join(", ")}</p>
                </motion.section>
              )}

              {/* Contact Info */}
              <motion.section
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <h2 className="text-xl font-semibold text-white mb-4">Contact</h2>
                <div className="space-y-3">
                  {therapist.phone && (
                    <a href={`tel:${therapist.phone}`} className="flex items-center gap-3 text-neutral-300 hover:text-white transition-colors">
                      <Phone className="h-4 w-4" />
                      {therapist.phone}
                    </a>
                  )}
                  {therapist.whatsapp && (
                    <a href={`https://wa.me/${therapist.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener" className="flex items-center gap-3 text-neutral-300 hover:text-white transition-colors">
                      <Phone className="h-4 w-4" />
                      WhatsApp: {therapist.whatsapp}
                    </a>
                  )}
                  {therapist.email && (
                    <a href={`mailto:${therapist.email}`} className="flex items-center gap-3 text-neutral-300 hover:text-white transition-colors">
                      <Mail className="h-4 w-4" />
                      {therapist.email}
                    </a>
                  )}
                  {therapist.website && (
                    <a href={therapist.website} target="_blank" rel="noopener" className="flex items-center gap-3 text-neutral-300 hover:text-white transition-colors">
                      <Globe className="h-4 w-4" />
                      Website
                    </a>
                  )}
                  {therapist.instagram && (
                    <a href={`https://instagram.com/${therapist.instagram.replace("@", "")}`} target="_blank" rel="noopener" className="flex items-center gap-3 text-neutral-300 hover:text-white transition-colors">
                      <Instagram className="h-4 w-4" />
                      {therapist.instagram}
                    </a>
                  )}
                </div>
              </motion.section>

              {/* Client Preferences */}
              {(therapist.preference_lgbtq_only || therapist.preference_men_only) && (
                <motion.section
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <h2 className="text-xl font-semibold text-white mb-4">Client Preferences</h2>
                  <div className="space-y-2">
                    {therapist.preference_lgbtq_only && (
                      <p className="text-sm text-neutral-300">🏳️‍🌈 LGBTQ+ Clients Welcome</p>
                    )}
                    {therapist.preference_men_only && (
                      <p className="text-sm text-neutral-300">👨 Male Clients Only</p>
                    )}
                  </div>
                </motion.section>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
