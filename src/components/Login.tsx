"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
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
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) throw error;
    } catch (err: any) {
      console.error("Google login error:", err);
      setError(err?.message || "Failed to login with Google");
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      console.error("Apple login error:", err);
      setError(err?.message || "Failed to login with Apple");
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
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Erro inesperado ao entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.glow} aria-hidden />
      <div className={styles.grid}>
        <div className={styles.hero}>
          <div className={styles.badge}>
            <Sparkles size={16} strokeWidth={2} />
            <span>Plataforma inspirada na home</span>
          </div>
          <h1 className={styles.title}>
            Entre na sua conta e continue de onde parou
          </h1>
          <p className={styles.subtitle}>
            Use o mesmo visual da nossa página inicial: fontes fortes, cores
            em gradiente e um layout confortável para acessar rapidamente os
            profissionais que você salvou.
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <CheckCircle2 size={18} />
              <span>Agende com terapeutas verificados na sua cidade</span>
            </div>
            <div className={styles.feature}>
              <ShieldCheck size={18} />
              <span>Segurança e privacidade com Supabase auth</span>
            </div>
            <div className={styles.feature}>
              <Sparkles size={18} />
              <span>Interface alinhada ao hero da home</span>
            </div>
          </div>

          <p className={styles.helper}>
            Novo por aqui? <Link href="/join">Crie sua conta</Link> e receba
            destaques personalizados.
          </p>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.panelKicker}>Login</p>
              <h2 className={styles.panelTitle}>Acesse sua conta</h2>
              <p className={styles.panelSubtitle}>
                Continue com seu email e senha ou use login social.
              </p>
            </div>
            <span className={styles.panelAccent}>MasseurMatch</span>
          </div>

          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className={styles.error}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>
              <span className={styles.labelText}>Email</span>
              <div className={styles.inputShell}>
                <Mail size={18} strokeWidth={1.6} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@email.com"
                  autoComplete="email"
                  className={styles.input}
                  required
                  disabled={loading}
                />
              </div>
            </label>

            <label className={styles.label}>
              <span className={styles.labelText}>Senha</span>
              <div className={`${styles.inputShell} ${styles.passwordShell}`}>
                <Lock size={18} strokeWidth={1.6} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  className={styles.input}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className={styles.toggle}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
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

            <div className={styles.row}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  disabled={loading}
                />
                <span>Lembrar email</span>
              </label>

              <Link href="/recuperar" className={styles.link}>
                Esqueci minha senha
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={styles.primaryButton}
            >
              <span>{loading ? "Entrando…" : "Entrar"}</span>
              <ArrowRight size={18} strokeWidth={2} />
            </button>

            <div className={styles.divider}>
              <span />
              <span className={styles.dividerText}>ou continue com</span>
              <span />
            </div>

            <div className={styles.socialGrid}>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className={`${styles.social} ${styles.google}`}
              >
                <span className={styles.socialIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </span>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={handleAppleLogin}
                disabled={loading}
                className={`${styles.social} ${styles.apple}`}
              >
                <span className={styles.socialIcon}>
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                </span>
                <span>Apple</span>
              </button>
            </div>

            <p className={styles.footerText}>
              Não tem uma conta?{" "}
              <Link href="/join" className={styles.strongLink}>
                Cadastre-se
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
