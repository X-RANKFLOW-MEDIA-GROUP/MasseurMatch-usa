"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type {
  OnboardingStage,
  Profile,
  SubscriptionPlan,
  MediaAsset,
} from "@/lib/types/database";

export function useOnboarding() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentProfile = async (): Promise<Profile | null> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error fetching profile:", err);
      return null;
    }
  };

  const selectPlan = async (planId: SubscriptionPlan) => {
    setLoading(true);
    setError(null);

    try {
      // Call API endpoint to create subscription
      const response = await fetch("/api/onboarding/select-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to select plan");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createPaymentSetup = async (planId: SubscriptionPlan) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/subscription/create-setup-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) throw new Error("Failed to create payment setup");

      const data = await response.json();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const confirmPayment = async (setupIntentId: string, subscriptionId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/subscription/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setupIntentId, subscriptionId }),
      });

      if (!response.ok) throw new Error("Failed to confirm payment");

      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createIdentitySession = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/onboarding/create-identity-session", {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to create identity session");

      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: {
    displayName: string;
    city: string;
    state: string;
    phone: string;
    languages: string[];
    services: string[];
    setups: string[];
    bio: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/onboarding/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRates = async (rates: {
    incall?: Array<{ duration: number; price: number }>;
    outcall?: Array<{ duration: number; price: number }>;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/onboarding/update-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rates }),
      });

      if (!response.ok) throw new Error("Failed to update rates");

      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateHours = async (hours: Record<string, { open: string; close: string }>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/onboarding/update-hours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hours }),
      });

      if (!response.ok) throw new Error("Failed to update hours");

      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (file: File): Promise<MediaAsset> => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/onboarding/upload-photo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload photo");

      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPhotos = async (): Promise<{
    photos: MediaAsset[];
    maxPhotos: number;
    currentCount: number;
  }> => {
    try {
      const response = await fetch("/api/onboarding/photos");
      if (!response.ok) throw new Error("Failed to fetch photos");
      return await response.json();
    } catch (err) {
      console.error("Error fetching photos:", err);
      return { photos: [], maxPhotos: 1, currentCount: 0 };
    }
  };

  const submitForReview = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/onboarding/submit-for-review", {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit for review");
      }

      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateOnboardingStage = async (stage: OnboardingStage) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({ onboarding_stage: stage, updated_at: new Date().toISOString() })
        .eq("user_id", user.id);

      if (error) throw error;
    } catch (err) {
      console.error("Error updating onboarding stage:", err);
      throw err;
    }
  };

  return {
    loading,
    error,
    getCurrentProfile,
    selectPlan,
    createPaymentSetup,
    confirmPayment,
    createIdentitySession,
    updateProfile,
    updateRates,
    updateHours,
    uploadPhoto,
    getPhotos,
    submitForReview,
    updateOnboardingStage,
  };
}
