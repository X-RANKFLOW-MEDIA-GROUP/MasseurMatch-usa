"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, Plus, X, Save } from "lucide-react";
import { supabase } from "@/src/lib/supabase";

const serviceOptions = [
  "Swedish Massage",
  "Deep Tissue",
  "Sports Massage",
  "Hot Stone",
  "Thai Massage",
  "Prenatal Massage",
  "Reflexology",
  "Aromatherapy",
  "Couples Massage",
  "Chair Massage",
];

export default function NewAdPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    headline: "",
    description: "",
    city: "",
    state: "",
    rate_60: "",
    rate_90: "",
    services: [] as string[],
  });

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login?redirect=/dashboard/ads/new");
      return;
    }

    const { data, error } = await supabase
      .from("ads")
      .insert({
        user_id: user.id,
        ...formData,
        status: "pending",
        views: 0,
        clicks: 0,
      })
      .select()
      .single();

    setSaving(false);

    if (error) {
      alert("Error creating ad: " + error.message);
    } else if (data) {
      router.push(`/dashboard/ads/${data.id}/edit`);
    }
  };

  return (
    <div className="max-w-3xl">
      <Link
        href="/dashboard/ads"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Ads
      </Link>

      <h1 className="text-3xl font-bold text-white mb-2">Create New Ad</h1>
      <p className="text-slate-400 mb-8">Fill in the details to create your listing</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Ad Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Professional Massage Therapy in LA"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Headline
              </label>
              <input
                type="text"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                placeholder="Licensed Massage Therapist with 10+ years experience"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your services, experience, and what makes you unique..."
                rows={5}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none resize-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Location</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Los Angeles"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="CA"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Rates */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Rates</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">60 Minutes</label>
              <input
                type="text"
                value={formData.rate_60}
                onChange={(e) => setFormData({ ...formData, rate_60: e.target.value })}
                placeholder="$80"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">90 Minutes</label>
              <input
                type="text"
                value={formData.rate_90}
                onChange={(e) => setFormData({ ...formData, rate_90: e.target.value })}
                placeholder="$120"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
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
                type="button"
                onClick={() => handleServiceToggle(service)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  formData.services.includes(service)
                    ? "bg-violet-600 text-white"
                    : "bg-white/5 text-slate-400 hover:text-white border border-white/10"
                }`}
              >
                {service}
              </button>
            ))}
          </div>
        </div>

        {/* Photos */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Photos</h2>
          <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-violet-500/50 transition-colors cursor-pointer">
            <Upload className="h-10 w-10 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-400">Click to upload photos</p>
            <p className="text-sm text-slate-500 mt-1">PNG, JPG up to 5MB each</p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-4 font-semibold text-white hover:bg-violet-500 disabled:opacity-50 transition-colors"
          >
            {saving ? "Creating..." : (
              <>
                <Plus className="h-5 w-5" />
                Create Ad
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
