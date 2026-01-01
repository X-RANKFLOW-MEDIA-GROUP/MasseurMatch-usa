"use client";

import { FormEvent, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/src/lib/supabase";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  // Tenta consumir o código do e-mail (recovery) e criar sessão temporária
  useEffect(() => {
    let cancelled = false;
    const code = searchParams?.get("code");

    async function prepareSession() {
      try {
        setLoading(true);
        setError(null);

        if (code) {
          const { error: exchErr } = await supabase.auth.exchangeCodeForSession(
            code
          );
          if (exchErr) throw exchErr;
          if (!cancelled) setSessionReady(true);
          return;
        }

        if (typeof window !== "undefined" && window.location.hash.includes("access_token")) {
          const params = new URLSearchParams(window.location.hash.slice(1));
          const access_token = params.get("access_token");
          const refresh_token = params.get("refresh_token");
          if (access_token && refresh_token) {
            const { error: urlErr } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            if (urlErr) throw urlErr;
            if (!cancelled) setSessionReady(true);
            return;
          }
        }

        setError("Código de recuperação não encontrado. Abra o link enviado no e-mail.");
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || "Não foi possível validar o link de recuperação.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    prepareSession();
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setError(null);

    if (!sessionReady) {
      setError("Valide o link de recuperação antes de redefinir a senha.");
      return;
    }
    if (password.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== password2) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);
      const { error: updErr } = await supabase.auth.updateUser({
        password,
      });
      if (updErr) throw updErr;

      setStatus("Senha atualizada com sucesso. Você já pode fazer login.");
      setTimeout(() => router.replace("/login"), 1200);
    } catch (err: any) {
      setError(err?.message || "Não foi possível atualizar a senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "2rem 1.25rem",
        background:
          "radial-gradient(circle at top, #020617 0, #020014 45%, #000 100%)",
        color: "#f9fafb",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
      }}
    >
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background:
            "radial-gradient(circle at top left, #1e1b4b, #020617 80%)",
          padding: "1.75rem 1.5rem",
          borderRadius: "1rem",
          border: "1px solid rgba(139,92,246,0.6)",
          boxShadow: "0 22px 45px rgba(0,0,0,0.6)",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            marginBottom: "0.75rem",
            letterSpacing: "0.03em",
          }}
        >
          Redefinir senha
        </h1>
        <p
          style={{
            maxWidth: "560px",
            fontSize: "1rem",
            opacity: 0.85,
            marginBottom: "1.5rem",
            lineHeight: 1.6,
          }}
        >
          Escolha uma nova senha para continuar usando sua conta.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            maxWidth: "420px",
          }}
        >
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontWeight: 600 }}>Nova senha</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="mínimo 6 caracteres"
              required
              minLength={6}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "0.75rem",
                border: "1px solid rgba(148,163,184,0.5)",
                background: "rgba(15,23,42,0.7)",
                color: "#fff",
              }}
              disabled={loading}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontWeight: 600 }}>Confirmar nova senha</span>
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="repita a senha"
              required
              minLength={6}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "0.75rem",
                border: "1px solid rgba(148,163,184,0.5)",
                background: "rgba(15,23,42,0.7)",
                color: "#fff",
              }}
              disabled={loading}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.8rem 1.1rem",
              borderRadius: "0.75rem",
              border: "1px solid rgba(99,102,241,0.5)",
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.9), rgba(139,92,246,0.9))",
              color: "#0b1220",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Atualizando..." : "Salvar nova senha"}
          </button>

          {status && (
            <p
              role="status"
              style={{
                background: "rgba(139,92,246,0.16)",
                border: "1px solid rgba(139,92,246,0.5)",
                color: "#e9d5ff",
                padding: "0.75rem",
                borderRadius: "0.75rem",
              }}
            >
              {status}
            </p>
          )}
          {error && (
            <p
              role="alert"
              style={{
                background: "rgba(248,113,113,0.1)",
                border: "1px solid rgba(248,113,113,0.5)",
                color: "#fecdd3",
                padding: "0.75rem",
                borderRadius: "0.75rem",
              }}
            >
              {error}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at top, #020617 0, #020014 45%, #000 100%)",
        color: "#f9fafb"
      }}>
        <p>Loading...</p>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}



