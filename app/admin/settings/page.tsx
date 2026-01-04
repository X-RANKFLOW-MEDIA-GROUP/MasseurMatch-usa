"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Settings,
  Shield,
  Mail,
  Bell,
  DollarSign,
  Image,
  Users,
  Loader2,
  Save,
  Check,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "@/src/lib/supabase";
import Link from "next/link";

type PlatformSettings = {
  maintenance_mode: boolean;
  registration_enabled: boolean;
  require_email_verification: boolean;
  require_identity_verification: boolean;
  photo_moderation_enabled: boolean;
  text_moderation_enabled: boolean;
  min_photos_required: number;
  max_photos_free: number;
  max_photos_standard: number;
  max_photos_pro: number;
  max_photos_elite: number;
  support_email: string;
  notification_email: string;
};

export default function AdminSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState<PlatformSettings>({
    maintenance_mode: false,
    registration_enabled: true,
    require_email_verification: true,
    require_identity_verification: false,
    photo_moderation_enabled: true,
    text_moderation_enabled: true,
    min_photos_required: 1,
    max_photos_free: 3,
    max_photos_standard: 5,
    max_photos_pro: 6,
    max_photos_elite: 8,
    support_email: "support@masseurmatch.com",
    notification_email: "admin@masseurmatch.com",
  });

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login?redirect=/admin/settings");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (profile?.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    // Fetch platform settings from database
    const { data: platformSettings } = await supabase
      .from("platform_settings")
      .select("*")
      .single();

    if (platformSettings) {
      setSettings({ ...settings, ...platformSettings });
    }

    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);

    // In production, save to platform_settings table
    const { error } = await supabase
      .from("platform_settings")
      .upsert({
        id: 1,
        ...settings,
        updated_at: new Date().toISOString(),
      });

    setSaving(false);

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleToggle = (key: keyof PlatformSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleChange = (key: keyof PlatformSettings, value: string | number) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-200" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5 bg-[#0a0a0f]">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="text-xl font-bold bg-gradient-to-r from-neutral-200 to-white bg-clip-text text-transparent">
            MasseurMatch Admin
          </Link>
          <Link href="/admin" className="text-sm text-slate-400 hover:text-white transition-colors">
            ← Back to Dashboard
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Platform Settings</h1>
            <p className="text-slate-400">Configure your platform settings</p>
          </div>
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-white hover:bg-neutral-200 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : saved ? (
              <Check className="h-5 w-5" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>

        {/* Maintenance Mode Warning */}
        {settings.maintenance_mode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3"
          >
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <p className="text-amber-400">Maintenance mode is enabled. Users cannot access the platform.</p>
          </motion.div>
        )}

        {/* General Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Settings className="h-5 w-5 text-white" />
            General Settings
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <div>
                <p className="text-white font-medium">Maintenance Mode</p>
                <p className="text-sm text-slate-400">Temporarily disable access to the platform</p>
              </div>
              <button
                onClick={() => handleToggle("maintenance_mode")}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.maintenance_mode ? "bg-amber-500" : "bg-white/20"
                }`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.maintenance_mode ? "translate-x-6" : ""
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <div>
                <p className="text-white font-medium">Registration Enabled</p>
                <p className="text-sm text-slate-400">Allow new users to sign up</p>
              </div>
              <button
                onClick={() => handleToggle("registration_enabled")}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.registration_enabled ? "bg-white" : "bg-white/20"
                }`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.registration_enabled ? "translate-x-6" : ""
                }`} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Verification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Shield className="h-5 w-5 text-white" />
            Verification Settings
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <div>
                <p className="text-white font-medium">Email Verification Required</p>
                <p className="text-sm text-slate-400">Users must verify email before using the platform</p>
              </div>
              <button
                onClick={() => handleToggle("require_email_verification")}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.require_email_verification ? "bg-white" : "bg-white/20"
                }`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.require_email_verification ? "translate-x-6" : ""
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <div>
                <p className="text-white font-medium">Identity Verification Required</p>
                <p className="text-sm text-slate-400">Require Stripe identity verification for all users</p>
              </div>
              <button
                onClick={() => handleToggle("require_identity_verification")}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.require_identity_verification ? "bg-white" : "bg-white/20"
                }`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.require_identity_verification ? "translate-x-6" : ""
                }`} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Moderation Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Image className="h-5 w-5 text-white" />
            Content Moderation
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <div>
                <p className="text-white font-medium">Photo Moderation</p>
                <p className="text-sm text-slate-400">Automatically screen photos with Sightengine AI</p>
              </div>
              <button
                onClick={() => handleToggle("photo_moderation_enabled")}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.photo_moderation_enabled ? "bg-white" : "bg-white/20"
                }`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.photo_moderation_enabled ? "translate-x-6" : ""
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <div>
                <p className="text-white font-medium">Text Moderation</p>
                <p className="text-sm text-slate-400">Screen profile text for inappropriate content</p>
              </div>
              <button
                onClick={() => handleToggle("text_moderation_enabled")}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.text_moderation_enabled ? "bg-white" : "bg-white/20"
                }`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.text_moderation_enabled ? "translate-x-6" : ""
                }`} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Photo Limits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Users className="h-5 w-5 text-white" />
            Photo Limits by Plan
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: "max_photos_free", label: "Free", color: "slate" },
              { key: "max_photos_standard", label: "Standard", color: "blue" },
              { key: "max_photos_pro", label: "Pro", color: "violet" },
              { key: "max_photos_elite", label: "Elite", color: "amber" },
            ].map((item) => (
              <div key={item.key} className="p-4 rounded-xl bg-white/5">
                <p className={`text-sm text-${item.color}-400 mb-2`}>{item.label}</p>
                <input
                  type="number"
                  value={settings[item.key as keyof PlatformSettings] as number}
                  onChange={(e) => handleChange(item.key as keyof PlatformSettings, parseInt(e.target.value))}
                  min="1"
                  max="20"
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-2 px-3 text-white text-center focus:border-neutral-300 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Email Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Mail className="h-5 w-5 text-white" />
            Email Settings
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Support Email
              </label>
              <input
                type="email"
                value={settings.support_email}
                onChange={(e) => handleChange("support_email", e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-neutral-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Admin Notification Email
              </label>
              <input
                type="email"
                value={settings.notification_email}
                onChange={(e) => handleChange("notification_email", e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-neutral-300 focus:outline-none"
              />
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
