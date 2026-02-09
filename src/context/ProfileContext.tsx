"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/src/lib/supabase";

/**
 * Adjust this type to match the real `therapists` table columns.
 * Keep fields optional to avoid breaking if some columns are missing.
 */
export type Therapist = {
  id: string;
  user_id: string;

  // Basic Info
  full_name: string | null;
  headline: string | null;
  about: string | null;
  philosophy: string | null;

  // Location
  city: string | null;
  state: string | null;
  country: string | null;
  neighborhood: string | null;
  address: string | null;
  zip_code: string | null;
  nearest_intersection: string | null;
  latitude: string | null;
  longitude: string | null;

  // Service Info
  mobile_service_radius: number | null;
  services_headline: string | null;
  specialties_headline: string | null;
  promotions_headline: string | null;

  // Massage Setup
  massage_techniques: string[] | null;
  studio_amenities: string[] | null;
  mobile_extras: string[] | null;
  additional_services: string[] | null;
  products_used: string | null;

  // Pricing
  rate_60: string | null;
  rate_90: string | null;
  rate_outcall: string | null;
  payment_methods: string[] | null;

  // Discounts
  regular_discounts: string | null;
  day_of_week_discount: string | null;
  weekly_specials: string | null;
  special_discount_groups: string[] | null;

  // Availability
  availability: any | null;

  // Professional Credentials
  degrees: string | null;
  affiliations: string[] | null;
  massage_start_date: string | null;
  languages: string[] | null;
  business_trips: string | null;

  // Reviews
  rating: number | null;
  override_reviews_count: number | null;

  // Social & Contact
  website: string | null;
  instagram: string | null;
  whatsapp: string | null;

  // Personal / Meta
  birthdate: string | null;
  years_experience: number | null;

  // Media
  profile_photo: string | null;
  gallery: string[] | null;

  // Other
  travel_radius: string | null;
  accepts_first_timers: boolean | null;
  prefers_lgbtq_clients: boolean | null;

  // Any other extra field that exists in the table
  [key: string]: any;
};

type ProfileContextType = {
  therapist: Therapist | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Ensure there is a `therapists` record for the logged-in user.
   * If it does not exist, create one.
   */
  async function ensureTherapistForUser(): Promise<Therapist | null> {
    // 1. Get the current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Error getting session:", sessionError);
      return null;
    }

    const user = session?.user;
    if (!user) {
      // Not logged in
      return null;
    }

    // 2. Try to fetch the therapist by user_id
    const { data, error } = await supabase
      .from("therapists")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error loading therapist profile:", error);
      return null;
    }

    // 3. If it already exists, return it
    if (data) {
      return data as Therapist;
    }

    // 4. If it does not exist, create a basic record
    const { data: inserted, error: insertError } = await supabase
      .from("therapists")
      .insert({
        user_id: user.id,
        full_name: null,
        headline: null,
        about: null,
        philosophy: null,
      })
      .select("*")
      .single();

    if (insertError) {
      console.error("Error creating therapist profile:", insertError);
      return null;
    }

    return inserted as Therapist;
  }

  async function loadProfile() {
    setLoading(true);
    try {
      const therapistData = await ensureTherapistForUser();
      setTherapist(therapistData);
    } catch (err) {
      console.error("Unexpected error loading profile:", err);
      setTherapist(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Load on first render
    loadProfile();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setTherapist(null);
        setLoading(false);
      } else {
        loadProfile();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: ProfileContextType = {
    therapist,
    loading,
    refreshProfile: loadProfile,
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

