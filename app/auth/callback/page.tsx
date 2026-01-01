"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/src/lib/supabase";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code from the URL (OAuth callback)
        const code = searchParams?.get("code");
        const next = searchParams?.get("next") || "/dashboard";

        if (code) {
          // Exchange the code for a session
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) throw error;

          // Get the session to verify
          const { data: { session } } = await supabase.auth.getSession();

          if (session) {
            // Successful authentication - redirect
            router.replace(next);
          } else {
            throw new Error("No session found after authentication");
          }
        } else {
          // No code in URL - might be an error
          const errorDescription = searchParams?.get("error_description");
          if (errorDescription) {
            throw new Error(errorDescription);
          }

          // If no code and no error, redirect to login
          router.replace("/login");
        }
      } catch (err: unknown) {
        console.error("OAuth callback error:", err);
        setError(err instanceof Error ? err.message : "Authentication failed");

        // Redirect to login after showing error
        const errorMessage = err instanceof Error ? err.message : "Authentication failed";
        setTimeout(() => {
          router.replace(`/login?error=${encodeURIComponent(errorMessage)}`);
        }, 3000);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at top, #020617 0, #020014 45%, #000 100%)",
          color: "#f9fafb",
          padding: "2rem",
        }}
      >
        <div
          style={{
            maxWidth: "400px",
            textAlign: "center",
            padding: "2rem",
            borderRadius: "1rem",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Authentication Error</h1>
          <p style={{ color: "#fca5a5", marginBottom: "1rem" }}>{error}</p>
          <p style={{ fontSize: "0.875rem", opacity: 0.7 }}>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at top, #020617 0, #020014 45%, #000 100%)",
        color: "#f9fafb",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "3px solid rgba(139, 92, 246, 0.3)",
            borderTop: "3px solid #8b5cf6",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1.5rem",
          }}
        />
        <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Completing Sign In...</h1>
        <p style={{ opacity: 0.7 }}>Please wait while we verify your credentials</p>
      </div>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at top, #020617 0, #020014 45%, #000 100%)",
          color: "#f9fafb",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "3px solid rgba(139, 92, 246, 0.3)",
              borderTop: "3px solid #8b5cf6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1.5rem",
            }}
          />
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Loading...</h1>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
