"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { SITE_URL } from "@/lib/site";

const providers = ["google", "apple"] as const;

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleOAuth = async (provider: typeof providers[number]) => {
    setMessage("Redirecting to provider...");
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${SITE_URL}${redirect}`,
      },
    });

    if (error) setMessage(error.message);
  };

  const handleMagicLink = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    setMessage("Email link sent—check your inbox.");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${SITE_URL}${redirect}`,
      },
    });

    if (error) setMessage(error.message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-3xl space-y-10 px-6 py-20 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold text-white">Sign in to MasseurMatch</h1>
          <p className="text-sm text-slate-400">
            Continue with a magic link or social login to manage your ads and favorites securely.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-white/10 p-8 shadow-2xl backdrop-blur">
          <form onSubmit={handleMagicLink} className="space-y-4">
            <label className="block text-left text-sm font-semibold text-slate-200">
              Email address
              <input
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/40 px-4 py-3 text-white placeholder:text-slate-500 focus:border-white focus:ring-2 focus:ring-white/30"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Send magic link
            </button>
          </form>
          <div className="mt-6 space-y-3">
            {providers.map((provider) => (
              <button
                key={provider}
                onClick={() => handleOAuth(provider)}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm font-semibold text-white transition hover:border-slate-500 hover:bg-slate-800"
              >
                Continue with {provider}
              </button>
            ))}
          </div>
        </div>

        {message && <p className="text-sm text-slate-300">{message}</p>}

        <p className="text-sm text-slate-500">
          Back to the <Link href="/" className="text-white underline">public site</Link>.
        </p>
      </div>
    </div>
  );
}
