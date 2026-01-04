"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Camera, Save, Loader2 } from "lucide-react";
import { supabase } from "@/src/lib/supabase";

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    display_name: "",
    headline: "",
    bio: "",
    city: "",
    state: "",
    phone: "",
    rate_60: "",
    rate_90: "",
    services: [] as string[],
  });

  const serviceOptions = [
    "Swedish Massage",
    "Deep Tissue",
    "Sports Massage",
    "Hot Stone",
    "Thai Massage",
    "Prenatal Massage",
    "Reflexology",
    "Aromatherapy",
  ];

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?redirect=/edit-profile");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setProfile({
          display_name: data.display_name || "",
          headline: data.headline || "",
          bio: data.bio || "",
          city: data.city || "",
          state: data.state || "",
          phone: data.phone || "",
          rate_60: data.rate_60 || "",
          rate_90: data.rate_90 || "",
          services: data.services || [],
        });
      }
      setLoading(false);
    }
    fetchProfile();
  }, [router]);

  const handleServiceToggle = (service: string) => {
    setProfile((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("profiles")
      .upsert({
        user_id: user.id,
        ...profile,
        updated_at: new Date().toISOString(),
      });

    setSaving(false);
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5">
        <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-medium text-white hover:bg-neutral-200 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : "Save"}
          </button>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Edit Profile</h1>

        <div className="space-y-8">
          {/* Photo */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/30 to-neutral-100/30 flex items-center justify-center">
                <span className="text-4xl">👤</span>
              </div>
              <button className="absolute bottom-0 right-0 p-2 rounded-full bg-white text-white hover:bg-neutral-200 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <h3 className="font-semibold text-white">Profile Photo</h3>
              <p className="text-sm text-slate-400">Click to upload a new photo</p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={profile.display_name}
                  onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                  placeholder="John Smith"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-neutral-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Headline
                </label>
                <input
                  type="text"
                  value={profile.headline}
                  onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                  placeholder="Licensed Massage Therapist"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-neutral-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell clients about yourself..."
                  rows={4}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-neutral-300 focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Location</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  placeholder="Los Angeles"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-neutral-300 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  placeholder="CA"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-neutral-300 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Rates */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Rates</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  60 Minutes
                </label>
                <input
                  type="text"
                  value={profile.rate_60}
                  onChange={(e) => setProfile({ ...profile, rate_60: e.target.value })}
                  placeholder="$80"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-neutral-300 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  90 Minutes
                </label>
                <input
                  type="text"
                  value={profile.rate_90}
                  onChange={(e) => setProfile({ ...profile, rate_90: e.target.value })}
                  placeholder="$120"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-neutral-300 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Services Offered</h2>
            <div className="flex flex-wrap gap-2">
              {serviceOptions.map((service) => (
                <button
                  key={service}
                  onClick={() => handleServiceToggle(service)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    profile.services.includes(service)
                      ? "bg-white text-white"
                      : "bg-white/5 text-slate-400 hover:text-white border border-white/10"
                  }`}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
