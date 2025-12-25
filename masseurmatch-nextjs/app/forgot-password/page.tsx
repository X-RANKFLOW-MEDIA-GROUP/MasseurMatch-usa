"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setError(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter the email address on your account.");
      return;
    }

    setLoading(true);

    try {
      const redirectBase =
        process.env.NEXT_PUBLIC_SITE_URL ||
        (typeof window !== "undefined" ? window.location.origin : "");
      const redirectTo = `${redirectBase}/reset`;

      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(
        trimmed,
        { redirectTo }
      );
      if (resetErr) throw resetErr;

      setStatus(
        "We've sent a password reset link to your inbox. Follow the instructions to update your password."
      );
    } catch (err: any) {
      setError(err?.message || "Unable to send the reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-3xl space-y-10 px-6 py-20 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold text-white">Forgot your password?</h1>
          <p className="text-sm text-slate-400">
            No worries. Enter the email connected to your account and we&apos;ll send a secure link to reset it.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-white/10 p-10 shadow-2xl backdrop-blur">
          <p className="text-left text-sm font-semibold text-slate-300">
            Reset link will be sent to:
          </p>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-left">
            <label className="block text-sm font-semibold text-slate-200">
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
              className="w-full rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4 py-3 text-sm font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
            >
              {loading ? "Sending reset link…" : "Send reset link"}
            </button>

            {status && (
              <div
                role="status"
                className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-200"
              >
                {status}
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100"
              >
                {error}
              </div>
            )}
          </form>

          <div className="mt-6 border-t border-slate-700 pt-4 text-sm text-left text-slate-400">
            <p>
              Remembered your password?{" "}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 underline font-semibold">
                Sign in
              </Link>
            </p>
            <p className="mt-2">
              Need an account?{" "}
              <Link href="/join" className="text-purple-400 hover:text-purple-300 underline font-semibold">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
