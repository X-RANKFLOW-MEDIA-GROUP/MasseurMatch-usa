"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase"; // ajuste o caminho conforme necessário

export default function TherapistRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // Verifica se há usuário logado
        const { data: { session }, error } = await supabase.auth.getSession();

        if (!mounted) return;

        if (error) {
          console.error("Erro ao verificar sessão:", error);
          router.replace("/login");
          return;
        }

        if (!session?.user) {
          // Não está logado, redireciona para login
          router.replace("/login");
          return;
        }

        // Está logado, redireciona para o perfil com ID
        router.replace(`/therapist/${session.user.id}`);
      } catch (err) {
        console.error("Erro inesperado:", err);
        if (mounted) {
          router.replace("/login");
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid rgba(255,255,255,0.2)",
            borderTop: "3px solid #fff",
            borderRadius: "50%",
            margin: "0 auto 1rem",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p style={{ fontSize: "1.1rem", opacity: 0.9 }}>Redirecionando...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}