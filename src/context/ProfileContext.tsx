"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/src/lib/supabase";
import type { Therapist } from "@/src/components/TherapistProfile"; // se quiser, pode mover o tipo pra cá depois

type ProfileContextType = {
  therapist: Therapist | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType>({
  therapist: null,
  loading: true,
  refreshProfile: async () => {},
});

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile() {
    try {
      setLoading(true);

      const { data: auth } = await supabase.auth.getUser();
      const uid = auth?.user?.id;
      if (!uid) {
        setTherapist(null);
        return;
      }

      const { data, error } = await supabase
        .from("therapists")
        .select("*")
        .eq("user_id", uid)
        .maybeSingle();

      if (error) {
        console.error("Erro ao carregar therapist:", error);
        setTherapist(null);
        return;
      }

      if (!data) {
        setTherapist(null);
        return;
      }

      // aqui você pode reaproveitar a lógica dbToUi se quiser,
      // ou fazer um map simples:
      const ui: Therapist = {
        ...data, // se os campos já baterem com o tipo Therapist
        // ou mapeia manualmente: name, title, profilePhoto etc.
      } as Therapist;

      setTherapist(ui);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  async function refreshProfile() {
    await loadProfile();
  }

  return (
    <ProfileContext.Provider value={{ therapist, loading, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
