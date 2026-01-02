"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, MapPin, Phone, Mail, Globe, Instagram, MessageCircle, Save, Camera, Loader2 } from "lucide-react";
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
  "Lymphatic Drainage",
  "Shiatsu",
  "Trigger Point",
  "Myofascial Release",
];

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [profile, setProfile] = useState({
    display_name: "",
    headline: "",
    about: "",
    philosophy: "",
    city: "",
    state: "",
    neighborhood: "",
    phone: "",
    email: "",
    website: "",
    instagram: "",
    whatsapp: "",
    services: [] as string[],
    rate_60: "",
    rate_90: "",
    rate_outcall: "",
    years_experience: "",
    languages: "",
    degrees: "",
    profile_photo: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login?redirect=/dashboard/profile");
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
        about: data.about || "",
        philosophy: data.philosophy || "",
        city: data.city || "",
        state: data.state || "",
        neighborhood: data.neighborhood || "",
        phone: data.phone || "",
        email: data.email || user.email || "",
        website: data.website || "",
        instagram: data.instagram || "",
        whatsapp: data.whatsapp || "",
        services: data.services || [],
        rate_60: data.rate_60 || "",
        rate_90: data.rate_90 || "",
        rate_outcall: data.rate_outcall || "",
        years_experience: data.years_experience?.toString() || "",
        languages: data.languages?.join(", ") || "",
        degrees: data.degrees || "",
        profile_photo: data.profile_photo || "",
      });
    }
    setLoading(false);
  };

  const handleServiceToggle = (service: string) => {
    setProfile((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "profile");

    try {
      const res = await fetch("/api/photos/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.approved && data.photo) {
        setProfile((prev) => ({ ...prev, profile_photo: data.photo.url }));
      } else if (!data.approved) {
        alert("Photo rejected: " + data.reasons.join(", "));
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: profile.display_name,
          headline: profile.headline,
          about: profile.about,
          philosophy: profile.philosophy,
          city: profile.city,
          state: profile.state,
          neighborhood: profile.neighborhood,
          phone: profile.phone,
          website: profile.website,
          instagram: profile.instagram,
          whatsapp: profile.whatsapp,
          services: profile.services,
          rate_60: profile.rate_60,
          rate_90: profile.rate_90,
          rate_outcall: profile.rate_outcall,
          years_experience: profile.years_experience ? parseInt(profile.years_experience) : null,
          languages: profile.languages.split(",").map((l) => l.trim()).filter(Boolean),
          degrees: profile.degrees,
        }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.pendingReview) {
          alert("Profile updated! Some changes are pending review.");
        } else {
          alert("Profile updated successfully!");
        }
      } else {
        alert(data.error || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-white mb-2">Edit Profile</h1>
      <p className="text-slate-400 mb-8">Update your professional information</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Photo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Camera className="h-5 w-5 text-violet-400" />
            Profile Photo
          </h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              {profile.profile_photo ? (
                <img
                  src={profile.profile_photo}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
                  <User className="h-10 w-10 text-slate-400" />
                </div>
              )}
              {uploadingPhoto && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
            </div>
            <div>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-colors">
                <Camera className="h-4 w-4" />
                {profile.profile_photo ? "Change Photo" : "Upload Photo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={uploadingPhoto}
                />
              </label>
              <p className="text-xs text-slate-500 mt-2">JPG or PNG, max 5MB</p>
            </div>
          </div>
        </motion.div>

        {/* Basic Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-violet-400" />
            Basic Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Display Name</label>
              <input
                type="text"
                value={profile.display_name}
                onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                placeholder="Your professional name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Headline</label>
              <input
                type="text"
                value={profile.headline}
                onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                placeholder="Licensed Massage Therapist with 10+ years experience"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">About</label>
              <textarea
                value={profile.about}
                onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                rows={4}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none resize-none"
                placeholder="Tell clients about yourself and your approach..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Philosophy</label>
              <textarea
                value={profile.philosophy}
                onChange={(e) => setProfile({ ...profile, philosophy: e.target.value })}
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none resize-none"
                placeholder="Your massage philosophy or approach..."
              />
            </div>
          </div>
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-violet-400" />
            Location
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">City</label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                placeholder="Los Angeles"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">State</label>
              <input
                type="text"
                value={profile.state}
                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                placeholder="CA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Neighborhood</label>
              <input
                type="text"
                value={profile.neighborhood}
                onChange={(e) => setProfile({ ...profile, neighborhood: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                placeholder="West Hollywood"
              />
            </div>
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Phone className="h-5 w-5 text-violet-400" />
            Contact Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-slate-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Website</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={profile.website}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                  placeholder="https://yoursite.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Instagram</label>
              <div className="relative">
                <Instagram className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={profile.instagram}
                  onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                  placeholder="@yourusername"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">WhatsApp</label>
              <div className="relative">
                <MessageCircle className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={profile.whatsapp}
                  onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Services Offered</h2>
          <div className="flex flex-wrap gap-2">
            {serviceOptions.map((service) => (
              <button
                key={service}
                type="button"
                onClick={() => handleServiceToggle(service)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  profile.services.includes(service)
                    ? "bg-violet-600 text-white"
                    : "bg-white/5 text-slate-400 hover:text-white border border-white/10"
                }`}
              >
                {service}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Rates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Rates</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">60 Minutes</label>
              <input
                type="text"
                value={profile.rate_60}
                onChange={(e) => setProfile({ ...profile, rate_60: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                placeholder="$100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">90 Minutes</label>
              <input
                type="text"
                value={profile.rate_90}
                onChange={(e) => setProfile({ ...profile, rate_90: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                placeholder="$140"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Outcall</label>
              <input
                type="text"
                value={profile.rate_outcall}
                onChange={(e) => setProfile({ ...profile, rate_outcall: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                placeholder="$150"
              />
            </div>
          </div>
        </motion.div>

        {/* Experience */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Experience & Credentials</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Years of Experience</label>
                <input
                  type="number"
                  value={profile.years_experience}
                  onChange={(e) => setProfile({ ...profile, years_experience: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                  placeholder="10"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Languages (comma separated)</label>
                <input
                  type="text"
                  value={profile.languages}
                  onChange={(e) => setProfile({ ...profile, languages: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                  placeholder="English, Spanish"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Certifications & Degrees</label>
              <textarea
                value={profile.degrees}
                onChange={(e) => setProfile({ ...profile, degrees: e.target.value })}
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none resize-none"
                placeholder="LMT, NCTMB Certified, Bachelor's in Kinesiology..."
              />
            </div>
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-4 font-semibold text-white hover:bg-violet-500 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save Profile
              </>
            )}
          </button>
        </motion.div>
      </form>
    </div>
  );
}
