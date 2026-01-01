// @ts-nocheck
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

  // Social Login handlers
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (err: unknown) {
      console.error('Google login error:', err);
      setError((err instanceof Error ? err.message : String(err)) || 'Failed to login with Google');
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err: unknown) {
      console.error('Apple login error:', err);
      setError((err instanceof Error ? err.message : String(err)) || 'Failed to login with Apple');
      setLoading(false);
    }
  };

  // Se já estiver logado, redireciona
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!cancelled && data.session?.user) {
        const redirectTo = redirectToParam || "/dashboard";
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

      const { error: signErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signErr) throw signErr;

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
      const redirectTo = redirectToParam || "/dashboard";
      router.replace(redirectTo);
    } catch (err: unknown) {
      console.error(err);
      setError((err instanceof Error ? err.message : String(err)) || "Erro inesperado ao entrar.");
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
              <span className={styles["divider-text"]}>or continue with</span>
              <span className={styles.line} />
            </div>

            {/* Social Login Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className={styles["btn-social"]}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Google</span>
              </button>

              <button
                type="button"
                onClick={handleAppleLogin}
                disabled={loading}
                className={styles["btn-social"]}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                }}
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Apple</span>
              </button>
            </div>

            <div className={styles.divider} style={{ marginTop: '16px' }}>
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
