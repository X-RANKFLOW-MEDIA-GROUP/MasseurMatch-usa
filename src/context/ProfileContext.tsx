"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// ===== Tipos básicos =====
export type Status = "online" | "away" | "busy" | "offline";

export type Rate = {
  name: string;
  duration: string;
  price: string;
  notes?: string;
};

export type Availability = {
  day: string;
  // para compatibilizar com versões antigas e novas
  hours?: string;
  incallHours?: string;
  mobileHours?: string;
};

export type Review = {
  id?: string;
  author: string;
  rating: number;
  text: string;
};

// ===== Tipo principal do terapeuta =====
export type Therapist = {
  id?: string;
  name?: string;
  title?: string;
  rating?: number;
  ratingCount?: number;
  status?: Status;

  locationCityState?: string;
  services?: string;
  specialties?: string;
  startingAt?: string;

  visitingFrom?: string;
  address?: string;
  accessNotes?: string;

  rates?: Rate[];
  availability?: Availability[];
  reviews?: Review[];
  bio?: string;

  profilePhoto?: string;
  // vamos trabalhar com lista de URLs aqui
  gallery?: string[];

  // ===== Campos extras usados no EditProfile =====
  philosophy?: string[];
  techniques?: string[];
  mobileRadius?: string;
  zipCode?: string;
  promocoes?: string;

  massageSetup?: string;
  studioAmenities?: string[];
  mobileExtras?: string[];
  additionalServices?: string[];
  productsUsed?: string[];

  payments?: {
    visa: boolean;
    mastercard: boolean;
    amex: boolean;
    discover: boolean;
    cash: boolean;
    venmo: boolean;
    zelle: boolean;
  };
  discounts?: { regular?: string; weekday?: string; weekly?: string };
  discountGroups?: string[];
  rateDisclaimers?: string[];

  languagesSpoken?: string[];
  degrees?: string[];
  affiliations?: string[];
  startDate?: string;
  businessTrips?: string[];
};

type ProfileContextType = {
  profile: Therapist | null;
  setProfile: React.Dispatch<React.SetStateAction<Therapist | null>>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Therapist | null>(null);

  // Carrega do localStorage (se existir) quando o app inicializa
  useEffect(() => {
    try {
      const raw = localStorage.getItem("mm_profile");
      if (raw) {
        const parsed = JSON.parse(raw);
        setProfile(parsed);
      }
    } catch {
      // se der erro, só ignora
    }
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile deve ser usado dentro de um ProfileProvider");
  }
  return ctx;
}
