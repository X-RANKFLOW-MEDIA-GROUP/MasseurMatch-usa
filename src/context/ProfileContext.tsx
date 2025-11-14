"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

/** Tipo do terapeuta (usado no perfil e no Edit-Profile) */
export type Therapist = {
  id: string;
  user_id: string;

  full_name?: string | null;
  headline?: string | null;
  about?: string | null;

  city?: string | null;
  state?: string | null;
  country?: string | null;
  neighborhood?: string | null;
  address?: string | null;
  latitude?: string | null;
  longitude?: string | null;

  rate_60?: string | null;
  rate_90?: string | null;
  rate_outcall?: string | null;

  studio_amenities?: string[] | null;
  payment_methods?: string[] | null;
  languages?: string[] | null;

  website?: string | null;
  instagram?: string | null;
  whatsapp?: string | null;

  birthdate?: string | null;
  years_experience?: string | null;
  rating?: number | null;

  gallery?: string[] | null;
  travel_radius?: string | null;
  accepts_first_timers?: boolean | null;
  prefers_lgbtq_clients?: boolean | null;

  // Qualquer campo extra da tabela
  [key: string]: any;
};

export interface ProfileContextType {
  therapist: Therapist | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        setTherapist(null);
        return;
      }

      const { data, error: tError } = await supabase
        .from("therapists")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (tError && tError.code !== "PGRST116") {
        throw tError;
      }

      setTherapist((data as Therapist) ?? null);
    } catch (err) {
      console.error("Error loading therapist profile:", err);
      setError("Failed to load therapist profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const value: ProfileContextType = {
    therapist,
    loading,
    error,
    refreshProfile: fetchProfile,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextType {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return ctx;
}
