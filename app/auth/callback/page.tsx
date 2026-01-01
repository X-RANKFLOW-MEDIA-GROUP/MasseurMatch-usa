"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/src/lib/supabase";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      if (!isSupabaseConfigured()) {
        router.push("/login?error=not_configured");
        return;
      }

      const { error } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth error:", error);
        router.push("/login?error=auth_failed");
        return;
      }

      const redirect = searchParams?.get("redirect") || "/dashboard";
      router.push(redirect);
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500 mx-auto mb-4" />
      <p className="text-white text-lg">Signing you in...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
      <Suspense
        fallback={
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500 mx-auto mb-4" />
            <p className="text-white text-lg">Loading...</p>
          </div>
        }
      >
        <AuthCallbackContent />
      </Suspense>
    </div>
  );
}
