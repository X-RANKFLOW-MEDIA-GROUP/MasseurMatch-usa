"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/src/lib/supabase"; // ajusta o caminho
import styles from "@/src/components/TherapistPublicProfile.module.css";

type TherapistRow = {
  user_id: string;
  display_name: string | null;
  location: string | null;
  services: string[] | string | null;
  profile_photo?: string | null;
  bio?: string | null;
  // adicione aqui apenas o que você quer mostrar PUBLICAMENTE
};

export default function TherapistPublicPage() {
  const params = useParams();
  const therapistId = params?.id as string;

  const [data, setData] = useState<TherapistRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!therapistId) return;

    async function loadTherapist() {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("therapists")
          .select(
            `
            user_id,
            display_name,
            location,
            services,
            profile_photo,
            bio
          `
          )
          .eq("user_id", therapistId)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          setError("Therapist not found.");
          return;
        }

        setData(data as TherapistRow);
      } catch (err: any) {
        console.error("Error loading therapist profile:", err);
        setError("Unable to load therapist profile.");
      } finally {
        setLoading(false);
      }
    }

    loadTherapist();
  }, [therapistId]);

  if (loading) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  if (error || !data) {
    return <div className={styles.error}>{error || "Profile not found."}</div>;
  }

  // trata serviços se vierem como string
  const servicesArray = Array.isArray(data.services)
    ? data.services
    : typeof data.services === "string"
    ? data.services
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const [city = "", state = ""] = String(data.location || "").split("-");

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.photoWrapper}>
          <img
            src={
              data.profile_photo ||
              "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?q=80&w=1600&auto=format&fit=crop"
            }
            alt={data.display_name || "Therapist photo"}
          />
        </div>

        <div className={styles.info}>
          <h1 className={styles.name}>{data.display_name}</h1>
          <p className={styles.location}>
            {city.trim()}
            {state ? ` - ${state.trim()}` : ""}
          </p>

          {servicesArray.length > 0 && (
            <div className={styles.tags}>
              {servicesArray.map((svc) => (
                <span key={svc} className={styles.tag}>
                  {svc}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {data.bio && (
        <section className={styles.section}>
          <h2>About</h2>
          <p>{data.bio}</p>
        </section>
      )}
    </main>
  );
}
