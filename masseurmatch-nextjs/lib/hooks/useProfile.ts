"use client";

import useSWR from "swr";
import { supabase } from "@/lib/supabase/client";
import type { ProfileWithDetails } from "@/lib/types/database";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useProfile(profileId?: string) {
  const { data, error, isLoading, mutate } = useSWR<ProfileWithDetails>(
    profileId ? `/api/profiles/${profileId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const toggleFavorite = async () => {
    if (!profileId) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const response = await fetch(`/api/profiles/${profileId}/favorite`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to toggle favorite");

      // Optimistically update
      mutate();
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  const sendMessage = async (message: string) => {
    if (!profileId) return;

    try {
      const response = await fetch(`/api/profiles/${profileId}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      return await response.json();
    } catch (err) {
      console.error("Error sending message:", err);
      throw err;
    }
  };

  return {
    profile: data,
    isLoading,
    error,
    refetch: mutate,
    toggleFavorite,
    sendMessage,
  };
}

export function useProfileReviews(profileId?: string) {
  const { data, error, isLoading } = useSWR(
    profileId ? `/api/profiles/${profileId}/reviews` : null,
    fetcher
  );

  return {
    reviews: data?.reviews || [],
    averageRating: data?.averageRating || 0,
    totalCount: data?.totalCount || 0,
    isLoading,
    error,
  };
}
