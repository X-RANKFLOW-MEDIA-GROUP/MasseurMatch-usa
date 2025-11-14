"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { supabase } from "../lib/supabase";
import styles from "./Login.module.css";

type PlanKey = "free" | "standard" | "pro" | "elite" | "testedecompra";

export default function Login() {
  const router = useRouter();

  // Agora os params vêm do window.location (somente client-side)
  const [redirectToParam, setRedirectToParam] = useState<string | undefined>();
  const [planKeyParam, setPlanKeyParam] = useState<PlanKey | undefined>();

  // Lê os parâmetros da URL no client
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirectTo") || undefined;
    const plan = (params.get("planKey") as PlanKey | null) ?? undefined;

    setRedirectToParam(redirect);
    setPlanKeyParam(plan);
  }, []);

  const [email, setEmail] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("massur:last-email") || "";
  });

  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("massur:last-email");
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Se já estiver logado, redireciona
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!cancelled && data.session?.user) {
        const userId = data.session.user.id;
        const redirectTo = redirectToParam || `/therapist/${userId}`;
        router.replace(redirectTo);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router, redirectToParam]);

  function validate(): string | null {
    if (!email.trim()) return "Informe seu e-mail.";
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) return "E-mail inválido.";
    if (!password || password.length < 6)
      return "A senha deve ter pelo menos 6 caracteres.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const msg = validate();
    if (msg) return setError(msg);

    try {
      setLoading(true);

      const { data, error: signErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signErr) throw signErr;
      if (!data.user) throw new Error("Usuário não encontrado.");

      const userId = data.user.id;

      if (typeof window !== "undefined") {
        if (remember) {
          localStorage.setItem("massur:last-email", email);
        } else {
          localStorage.removeItem("massur:last-email");
        }
      }

      // Se veio com planKey pago, manda para /join já com o plano na URL
      if (planKeyParam && planKeyParam !== "free") {
        const url = new URL("/join", window.location.origin);
        url.searchParams.set("planKey", planKeyParam);
        router.replace(url.pathname + url.search);
        return;
      }

      // Redireciona para o perfil com ID
      const redirectTo = redirectToParam || `/therapist/${userId}`;
      router.replace(redirectTo);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Erro inesperado ao entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles["login-page"]}>
      <div className={styles["login-glow"]} aria-hidden />
      <div className={styles["login-container"]}>
        <header className={styles["login-header"]}>
          <h1 className={styles["login-title"]}>Welcome Back</h1>
          <p className={styles["login-subtitle"]}>
            Log in to access your account
          </p>
        </header>

        <main className={styles["login-card"]}>
          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className={styles["login-error"]}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles["login-form"]}>
            <label className={styles["login-label"]}>
              <span className={styles["label-text"]}>Email Address</span>
              <div className={styles["input-wrap"]}>
                <span className={styles["input-icon"]}>
                  <Mail size={18} strokeWidth={1.6} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  autoComplete="email"
                  className={styles.input}
                  required
                  disabled={loading}
                />
              </div>
            </label>

            <label className={styles["login-label"]}>
              <span className={styles["label-text"]}>Password</span>
              <div
                className={`${styles["input-wrap"]} ${styles["password-wrap"]}`}
              >
                <span className={styles["input-icon"]}>
                  <Lock size={18} strokeWidth={1.6} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={styles.input}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className={styles["toggle-pass"]}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff size={17} strokeWidth={1.7} />
                  ) : (
                    <Eye size={17} strokeWidth={1.7} />
                  )}
                </button>
              </div>
            </label>

            <div className={styles["row-between"]}>
              <label className={styles["checkbox-label"]}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  disabled={loading}
                />
                <span>Remember me</span>
              </label>

              <Link href="/recuperar" className={styles.link}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={styles["btn-primary"]}
            >
              <span>{loading ? "Logging in…" : "Log In"}</span>
              <span className={styles["btn-icon"]}>
                <ArrowRight size={18} strokeWidth={2} />
              </span>
            </button>

            <div className={styles.divider}>
              <span className={styles.line} />
              <span className={styles["divider-text"]}>or</span>
              <span className={styles.line} />
            </div>

            <p className={styles["signup-text"]}>
              Don&apos;t have an account?{" "}
              <Link href="/join" className={styles["link-strong"]}>
                Sign up
              </Link>
            </p>
          </form>
        </main>
      </div>
    </div>
  );
}
