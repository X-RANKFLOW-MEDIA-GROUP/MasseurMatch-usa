"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Upload, Plus, X } from "lucide-react";
import { supabase } from "@/src/lib/supabase";

type Props = {
  params: Promise<{ adId: string; section: string }>;
};

const sections = {
  details: {
    title: "Details",
    fields: ["title", "headline", "description"],
  },
  photos: {
    title: "Photos",
    fields: ["photos"],
  },
  services: {
    title: "Services",
    fields: ["services"],
  },
  rates: {
    title: "Rates",
    fields: ["rate_60", "rate_90", "rate_outcall"],
  },
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
];

export default function EditSectionPage({ params }: Props) {
  const router = useRouter();
  const [adId, setAdId] = useState("");
  const [section, setSection] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  useEffect(() => {
    async function init() {
      const { adId, section } = await params;
      setAdId(adId);
      setSection(section);

      const { data } = await supabase
        .from("ads")
        .select("*")
        .eq("id", adId)
        .single();

      if (data) {
        setFormData(data);
      }
      setLoading(false);
    }
    init();
  }, [params]);

  const handleSave = async () => {
    setSaving(true);
    await supabase.from("ads").update(formData).eq("id", adId);
    setSaving(false);
    router.push(`/dashboard/ads/${adId}/edit`);
  };

  const handleServiceToggle = (service: string) => {
    const services = (formData.services as string[]) || [];
    setFormData({
      ...formData,
      services: services.includes(service)
        ? services.filter((s) => s !== service)
        : [...services, service],
    });
  };

  const sectionConfig = sections[section as keyof typeof sections];

  if (loading) {
    return (
      <div className="max-w-3xl">
        <div className="h-8 w-48 bg-white/5 rounded animate-pulse mb-8" />
        <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!sectionConfig) {
    return (
      <div className="max-w-3xl text-center py-16">
        <p className="text-white">Section not found</p>
        <Link href={`/dashboard/ads/${adId}/edit`} className="text-violet-400 hover:underline mt-4 inline-block">
          Back to Edit
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <Link
        href={`/dashboard/ads/${adId}/edit`}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Ad Editor
      </Link>

      <h1 className="text-3xl font-bold text-white mb-2">Edit {sectionConfig.title}</h1>
      <p className="text-slate-400 mb-8">Update this section of your listing</p>

      {/* Section Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {Object.entries(sections).map(([key, sec]) => (
          <Link
            key={key}
            href={`/dashboard/ads/${adId}/edit/${key}`}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              key === section
                ? "bg-violet-600 text-white"
                : "bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            {sec.title}
          </Link>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
        {section === "details" && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
              <input
                type="text"
                value={(formData.title as string) || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white focus:border-violet-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Headline</label>
              <input
                type="text"
                value={(formData.headline as string) || ""}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white focus:border-violet-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea
                value={(formData.description as string) || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white focus:border-violet-500 focus:outline-none resize-none"
              />
            </div>
          </div>
        )}

        {section === "photos" && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="grid grid-cols-3 gap-4 mb-4">
              {/* Placeholder for existing photos */}
              <div className="aspect-square rounded-xl bg-white/5 flex items-center justify-center">
                <span className="text-4xl">📷</span>
              </div>
            </div>
            <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-violet-500/50 transition-colors cursor-pointer">
              <Upload className="h-10 w-10 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-400">Click to upload more photos</p>
              <p className="text-sm text-slate-500 mt-1">PNG, JPG up to 5MB each</p>
            </div>
          </div>
        )}

        {section === "services" && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-slate-400 mb-4">Select the services you offer:</p>
            <div className="flex flex-wrap gap-2">
              {serviceOptions.map((service) => (
                <button
                  key={service}
                  type="button"
                  onClick={() => handleServiceToggle(service)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    ((formData.services as string[]) || []).includes(service)
                      ? "bg-violet-600 text-white"
                      : "bg-white/5 text-slate-400 hover:text-white border border-white/10"
                  }`}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>
        )}

        {section === "rates" && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">60 Minutes</label>
              <input
                type="text"
                value={(formData.rate_60 as string) || ""}
                onChange={(e) => setFormData({ ...formData, rate_60: e.target.value })}
                placeholder="$80"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">90 Minutes</label>
              <input
                type="text"
                value={(formData.rate_90 as string) || ""}
                onChange={(e) => setFormData({ ...formData, rate_90: e.target.value })}
                placeholder="$120"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Outcall Rate</label>
              <input
                type="text"
                value={(formData.rate_outcall as string) || ""}
                onChange={(e) => setFormData({ ...formData, rate_outcall: e.target.value })}
                placeholder="$150"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-4 font-semibold text-white hover:bg-violet-500 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : (
            <>
              <Save className="h-5 w-5" />
              Save {sectionConfig.title}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
