"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Lock, User, Phone, Chrome, ArrowRight, Check } from "lucide-react";
import { supabase } from "@/src/lib/supabase";
import { SITE_URL } from "@/src/lib/site";

const benefits = [
  "Reach thousands of potential clients",
  "Professional profile with SEO optimization",
  "Secure messaging and booking system",
  "Manage your schedule easily",
  "Get paid directly - no middleman fees",
];

export default function JoinPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.name,
          phone: formData.phone,
        },
        emailRedirectTo: `${SITE_URL}/auth/callback?redirect=/join/form`,
      },
    });

    setIsLoading(false);

    if (signUpError) {
      setError(signUpError.message);
    } else if (data.user) {
      router.push("/join/form");
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    setIsLoading(true);
    setError("");

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${SITE_URL}/auth/callback?redirect=/join/form`,
      },
    });

    if (oauthError) {
      setIsLoading(false);
      setError(oauthError.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Benefits */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-white to-neutral-800 p-12 flex-col justify-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold text-white mb-6">
            Grow your massage therapy practice
          </h1>
          <p className="text-neutral-200 text-lg mb-8">
            Join MasseurMatch and connect with clients looking for professional massage therapists like you.
          </p>
          <ul className="space-y-4">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3 text-white">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Check className="h-4 w-4" />
                </div>
                {benefit}
              </li>
            ))}
          </ul>

          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-neutral-200 mb-4">Already have clients?</p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-white font-medium hover:underline"
            >
              View our pricing plans
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-[#0a0a0f]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Create your account</h2>
            <p className="text-slate-400">Start your 14-day free trial</p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleOAuth("google")}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3 font-medium text-white hover:bg-white/10 disabled:opacity-50 transition-colors"
            >
              <Chrome className="h-5 w-5" />
              Continue with Google
            </button>
            <button
              onClick={() => handleOAuth("apple")}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3 font-medium text-white hover:bg-white/10 disabled:opacity-50 transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continue with Apple
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 border-t border-white/10" />
            <span className="text-sm text-slate-500">or sign up with email</span>
            <div className="flex-1 border-t border-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Smith"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:border-neutral-300 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:border-neutral-300 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:border-neutral-300 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:border-neutral-300 focus:outline-none"
                  required
                  minLength={8}
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <p className="text-xs text-slate-500">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-white hover:underline">Terms</Link> and{" "}
              <Link href="/privacy-policy" className="text-white hover:underline">Privacy Policy</Link>
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-white py-3 font-semibold text-white hover:bg-neutral-200 disabled:opacity-50 transition-colors"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-white hover:text-neutral-300 font-medium">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
