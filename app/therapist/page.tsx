"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";

export default function TherapistMePage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const uid = data.user?.id;

      if (!uid) {
        router.replace("/login");
        return;
      }

      router.replace(`/therapist/${uid}`);
    })();
  }, [router]);

  return (
    <main style={{ padding: "2rem", color: "#fff" }}>
      <p>Carregando seu perfil...</p>
    </main>
  );
}
