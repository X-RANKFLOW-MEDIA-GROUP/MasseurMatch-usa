"use client";

import { Dashboard } from "@/src/components/dashboard/Dashboard";
import { Toaster } from "@/src/components/ui/sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear any local storage
      if (typeof window !== "undefined") {
        localStorage.removeItem("massur:last-email");
      }

      // Redirect to login
      router.replace("/login");
    } catch (err: any) {
      console.error("Logout error:", err);
      // Even if there's an error, redirect to login
      router.replace("/login");
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        setLoadingProfile(true);
        setProfileError(null);

        const { data: sessionData, error: sessionErr } =
          await supabase.auth.getSession();
        if (sessionErr) throw sessionErr;

        const userId = sessionData.session?.user?.id;
        if (!userId) {
          router.replace("/login?redirectTo=/dashboard");
          return;
        }

        const { data, error } = await supabase
          .from("therapists")
          .select(
            "display_name, full_name, location, plan, plan_name, status, profile_photo, services, languages"
          )
          .eq("user_id", userId)
          .maybeSingle();

        if (error) throw error;
        if (!cancelled) setProfile(data);
      } catch (err: any) {
        if (!cancelled)
          setProfileError(err?.message || "Não foi possível carregar o perfil.");
      } finally {
        if (!cancelled) setLoadingProfile(false);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-[#05050A] text-slate-200">
      <main className="flex-1 relative">
        <Dashboard
          onViewProfile={() => router.push("/therapist")}
          onLogout={handleLogout}
          profile={profile}
          loadingProfile={loadingProfile}
          profileError={profileError}
        />
      </main>
      <Toaster position="top-center" />
    </div>
  );
}
