"use client";

import useSWR from "swr";
import { supabase } from "@/lib/supabase/client";
import type { TherapistCardData, SwipeAction } from "@/lib/types/database";

interface ExploreFilters {
  city?: string;
  state?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  services?: string[];
  minRating?: number;
  offset?: number;
  limit?: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useExplore(filters: ExploreFilters = {}) {
  const queryParams = new URLSearchParams();

  if (filters.city) queryParams.append("city", filters.city);
  if (filters.state) queryParams.append("state", filters.state);
  if (filters.lat) queryParams.append("lat", filters.lat.toString());
  if (filters.lng) queryParams.append("lng", filters.lng.toString());
  if (filters.radius) queryParams.append("radius", filters.radius.toString());
  if (filters.services) queryParams.append("services", filters.services.join(","));
  if (filters.minRating) queryParams.append("minRating", filters.minRating.toString());
  if (filters.offset) queryParams.append("offset", filters.offset.toString());
  if (filters.limit) queryParams.append("limit", filters.limit.toString());

  const { data, error, isLoading, mutate } = useSWR<{
    therapists: TherapistCardData[];
    hasMore: boolean;
    total: number;
  }>(`/api/explore/therapists?${queryParams.toString()}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const recordSwipe = async (therapistId: string, action: SwipeAction) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("explore_swipe_events").insert({
        user_id: user.id,
        profile_id: therapistId,
        action: action,
        match_score: 0,
      });

      if (error) throw error;

      // Also call API endpoint for additional processing
      if (action === "swipe_right") {
        await fetch("/api/explore/like", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ therapistId }),
        });
      } else {
        await fetch("/api/explore/pass", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ therapistId }),
        });
      }
    } catch (err) {
      console.error("Error recording swipe:", err);
    }
  };

  const like = async (therapist: TherapistCardData) => {
    await recordSwipe(therapist.id, "swipe_right");
  };

  const pass = async (therapist: TherapistCardData) => {
    await recordSwipe(therapist.id, "swipe_left");
  };

  return {
    therapists: data?.therapists || [],
    hasMore: data?.hasMore || false,
    total: data?.total || 0,
    isLoading,
    error,
    refetch: mutate,
    like,
    pass,
  };
}

export function useMatches() {
  const { data, error, isLoading } = useSWR("/api/explore/matches", fetcher);

  return {
    matches: data?.matches || [],
    isLoading,
    error,
  };
}
