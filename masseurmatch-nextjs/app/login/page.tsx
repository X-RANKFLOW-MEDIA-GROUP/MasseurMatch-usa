"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const providers = ["google", "apple"] as const;

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams?.get("redirectTo") ?? "/dashboard";

  const [mode, setMode] = useState<"email" | "magic">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleOAuth = async (provider: typeof providers[number]) => {
    setMessage("Redirecting to provider...");
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
      },
    });

    if (error) setMessage(error.message);
  };

  const handleEmailPasswordLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) {
      setMessage("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      if (data.session) {
        setMessage("Login successful! Redirecting...");
        router.push(redirectTo);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setMessage(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
        },
      });

      if (error) throw error;

      setMessage("✅ Magic link sent! Check your inbox and click the link to sign in.");
    } catch (err: any) {
      console.error("Magic link error:", err);
      setMessage(err.message || "Failed to send magic link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-3xl space-y-10 px-6 py-20 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold text-white">Sign in to MasseurMatch</h1>
          <p className="text-sm text-slate-400">
            Access your dashboard to manage your listings and connect with clients.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-white/10 p-8 shadow-2xl backdrop-blur">
          {/* Toggle between Email/Password and Magic Link */}
          <div className="mb-6 flex gap-2 p-1 bg-slate-900/60 rounded-xl">
            <button
              type="button"
              onClick={() => setMode("email")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                mode === "email"
                  ? "bg-white text-slate-900"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => setMode("magic")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                mode === "magic"
                  ? "bg-white text-slate-900"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Magic Link
            </button>
          </div>

          {/* Email & Password Login */}
          {mode === "email" && (
            <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
              <label className="block text-left text-sm font-semibold text-slate-200">
                Email address
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/40 px-4 py-3 text-white placeholder:text-slate-500 focus:border-white focus:ring-2 focus:ring-white/30"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={loading}
                />
              </label>

              <label className="block text-left text-sm font-semibold text-slate-200">
                Password
                <div className="relative mt-2">
                  <input
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900/40 px-4 py-3 text-white placeholder:text-slate-500 focus:border-white focus:ring-2 focus:ring-white/30"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-purple-400 hover:text-purple-300"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4 py-3 text-sm font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <div className="text-center">
                <Link
                  href="/forgot-password"
                  className="text-sm text-purple-400 hover:text-purple-300 underline"
                >
                  Forgot password?
                </Link>
              </div>
            </form>
          )}

          {/* Magic Link Login */}
          {mode === "magic" && (
            <form onSubmit={handleMagicLink} className="space-y-4">
              <label className="block text-left text-sm font-semibold text-slate-200">
                Email address
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/40 px-4 py-3 text-white placeholder:text-slate-500 focus:border-white focus:ring-2 focus:ring-white/30"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={loading}
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending link..." : "Send magic link"}
              </button>
              <p className="text-xs text-slate-400 text-left">
                We'll send you an email with a link to sign in instantly, no password needed.
              </p>
            </form>
          )}

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-slate-400">or continue with</span>
              </div>
            </div>

            <div className="space-y-3">
              {providers.map((provider) => (
                <button
                  key={provider}
                  type="button"
                  onClick={() => handleOAuth(provider)}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm font-semibold text-white transition hover:border-slate-500 hover:bg-slate-800"
                >
                  {provider === "google" ? (
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                  )}
                  Continue with {provider.charAt(0).toUpperCase() + provider.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {message && (
          <div className={`rounded-xl p-4 ${
            message.includes("✅") || message.includes("successful")
              ? "bg-green-500/10 border border-green-500/20 text-green-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}>
            <p className="text-sm">{message}</p>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            Don't have an account?{" "}
            <Link href="/join" className="text-purple-400 hover:text-purple-300 underline font-semibold">
              Sign up here
            </Link>
          </p>
          <p className="text-sm text-slate-500">
            Back to the{" "}
            <Link href="/" className="text-white underline">
              public site
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
