"use client";

import Image from "next/image";
import { statusConfig } from "@/lib/design-tokens";
import { Star, MapPin, Calendar, Users } from "lucide-react";

type AvailabilityStatus = "available" | "visiting_now" | "visiting_soon" | "offline";

interface ProfileHeroProps {
  displayName: string;
  headline?: string;
  profilePhoto?: string;
  city?: string;
  state?: string;
  rating: number;
  reviewCount: number;
  yearsExperience?: number;
  status: AvailabilityStatus;
  travelInfo?: {
    city: string;
    state: string;
    startDate: string;
    endDate: string;
  };
}

export function ProfileHero({
  displayName,
  headline,
  profilePhoto,
  city,
  state,
  rating,
  reviewCount,
  yearsExperience,
  status,
  travelInfo,
}: ProfileHeroProps) {
  const statusInfo = statusConfig[status];
  const location = city && state ? `${city}, ${state}` : city || state || "";

  return (
    <div className="relative bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Profile Image */}
          <div className="lg:col-span-1">
            <div className="relative">
              {/* Status Border Ring */}
              <div
                className="absolute inset-0 rounded-2xl blur-md"
                style={{
                  background: statusInfo.color.bg,
                  opacity: 0.3,
                }}
              />

              {/* Image Container */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white dark:bg-gray-800 ring-4 ring-white dark:ring-gray-800">
                {profilePhoto ? (
                  <Image
                    src={profilePhoto}
                    alt={displayName}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
                    <span className="text-6xl font-bold text-purple-600 dark:text-purple-300">
                      {displayName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full font-semibold text-sm shadow-lg flex items-center gap-2 whitespace-nowrap"
                style={{
                  backgroundColor: statusInfo.color.bg,
                  color: statusInfo.color.text,
                }}
              >
                <span>{statusInfo.icon}</span>
                <span>{statusInfo.label}</span>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Name & Headline */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                {displayName}
              </h1>
              {headline && (
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  {headline}
                </p>
              )}
            </div>

            {/* Rating & Location */}
            <div className="flex flex-wrap items-center gap-6">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.floor(rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : star - 0.5 <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {rating.toFixed(1)}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  ({reviewCount} reviews)
                </span>
              </div>

              {/* Location */}
              {location && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <MapPin className="w-5 h-5" />
                  <span>{location}</span>
                </div>
              )}

              {/* Years Experience */}
              {yearsExperience && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Users className="w-5 h-5" />
                  <span>{yearsExperience} years experience</span>
                </div>
              )}
            </div>

            {/* Travel Info */}
            {travelInfo && (status === "visiting_now" || status === "visiting_soon") && (
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">
                      {status === "visiting_now" ? "Currently Visiting" : "Visiting Soon"}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {travelInfo.city}, {travelInfo.state}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {new Date(travelInfo.startDate).toLocaleDateString()} - {new Date(travelInfo.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard
                label="Rating"
                value={rating.toFixed(1)}
                icon="⭐"
              />
              <StatCard
                label="Reviews"
                value={reviewCount.toString()}
                icon="💬"
              />
              {yearsExperience && (
                <StatCard
                  label="Experience"
                  value={`${yearsExperience}y`}
                  icon="🎓"
                />
              )}
              <StatCard
                label="Status"
                value={statusInfo.label.split(" ")[0]}
                icon={statusInfo.icon}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  );
}
