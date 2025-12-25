"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setError(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Informe um e-mail para recuperar o acesso.");
      return;
    }

    try {
      setLoading(true);
      const redirectBase =
        process.env.NEXT_PUBLIC_SITE_URL ||
        (typeof window !== "undefined" ? window.location.origin : "");
      const redirectTo = `${redirectBase}/reset`;

      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(
        trimmed,
        { redirectTo }
      );
      if (resetErr) throw resetErr;

      setStatus("Enviamos um e-mail com o link para redefinir a senha.");
    } catch (err: any) {
      setError(err?.message || "Não foi possível iniciar a recuperação.");
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
          Recuperar Acesso
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
          Enviaremos um e-mail com o link para redefinir sua senha. Verifique a
          caixa de entrada e o spam.
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
            <span style={{ fontWeight: 600 }}>E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              required
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
            {loading ? "Enviando..." : "Enviar link de recuperação"}
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



