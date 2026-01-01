"use client";

import { useParams } from "next/navigation";
import { ProfileView } from "@/components/profile/ProfileView";
import { useProfile } from "@/lib/hooks/useProfile";
import { ProfileCardSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { UserX } from "lucide-react";

export default function TherapistProfilePage() {
  const params = useParams();
  const slug = params?.slug as string;

  // In a real implementation, we'd fetch the profile ID from the slug
  const profileId = slug; // Temporary - should convert slug to ID via API

  const { profile, isLoading, error, toggleFavorite } = useProfile(profileId);
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 p-4">
        <div className="max-w-5xl mx-auto py-8">
          <ProfileCardSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center p-4">
        <ErrorState
          title="Failed to Load Profile"
          description="We couldn't load this therapist's profile. Please try again."
        />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center p-4">
        <EmptyState
          icon={UserX}
          title="Profile Not Found"
          description="This therapist profile doesn't exist or has been removed."
          action={{
            label: "Back to Explore",
            onClick: () => window.history.back(),
          }}
        />
      </div>
    );
  }

  // Transform database profile to ProfileView format
  const profileData = {
    id: profile.id,
    name: profile.user?.id || "Therapist", // Get from user table
    photos: profile.media_assets?.map((m) => m.public_url || m.thumbnail_url || "") || [],
    city: "San Francisco", // Get from profile metadata
    state: "CA",
    bio: "Professional massage therapist", // Get from profile
    services: ["Swedish Massage", "Deep Tissue"], // Get from profile
    languages: ["English"], // Get from profile
    rates: {
      incall: "$100/hour",
      outcall: "$150/hour",
    },
    availability: {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      hours: "9 AM - 6 PM",
    },
  };

  return (
    <ProfileView
      profile={profileData}
      onContact={() => console.log("Contact clicked")}
      onLike={toggleFavorite}
      onShare={() => {
        if (navigator.share) {
          navigator.share({
            title: profileData.name,
            text: `Check out ${profileData.name} on MasseurMatch`,
            url: window.location.href,
          });
        }
      }}
    />
  );
}
