"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, Eye, Upload } from "lucide-react";
import { supabase } from "@/src/lib/supabase";

type Props = {
  params: Promise<{ adId: string }>;
};

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

export default function EditAdPage({ params }: Props) {
  const router = useRouter();
  const [adId, setAdId] = useState<string>("");
  const [loading, setLoading] = useState(true);
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
    status: "pending",
  });

  useEffect(() => {
    async function init() {
      const { adId } = await params;
      setAdId(adId);

      const { data } = await supabase
        .from("ads")
        .select("*")
        .eq("id", adId)
        .single();

      if (data) {
        setFormData({
          title: data.title || "",
          headline: data.headline || "",
          description: data.description || "",
          city: data.city || "",
          state: data.state || "",
          rate_60: data.rate_60 || "",
          rate_90: data.rate_90 || "",
          services: data.services || [],
          status: data.status || "pending",
        });
      }
      setLoading(false);
    }
    init();
  }, [params]);

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    await supabase
      .from("ads")
      .update(formData)
      .eq("id", adId);
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this ad?")) return;
    await supabase.from("ads").delete().eq("id", adId);
    router.push("/dashboard/ads");
  };

  if (loading) {
    return (
      <div className="max-w-3xl">
        <div className="h-8 w-48 bg-white/5 rounded animate-pulse mb-8" />
        <div className="space-y-6">
          <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
          <div className="h-48 bg-white/5 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard/ads"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Ads
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={`/therapist/${adId}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-white mb-2">Edit Ad</h1>
      <p className="text-slate-400 mb-8">Update your listing details</p>

      {/* Section Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {["details", "photos", "services", "rates"].map((section) => (
          <Link
            key={section}
            href={`/dashboard/ads/${adId}/edit/${section}`}
            className="px-4 py-2 rounded-lg bg-white/5 text-slate-400 hover:text-white whitespace-nowrap transition-colors"
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </Link>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Ad Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white focus:border-violet-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Headline</label>
              <input
                type="text"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white focus:border-violet-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white focus:border-violet-500 focus:outline-none resize-none"
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
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white focus:border-violet-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white focus:border-violet-500 focus:outline-none"
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
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white focus:border-violet-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">90 Minutes</label>
              <input
                type="text"
                value={formData.rate_90}
                onChange={(e) => setFormData({ ...formData, rate_90: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white focus:border-violet-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Services</h2>
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

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-4 font-semibold text-white hover:bg-violet-500 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : (
            <>
              <Save className="h-5 w-5" />
              Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
}
