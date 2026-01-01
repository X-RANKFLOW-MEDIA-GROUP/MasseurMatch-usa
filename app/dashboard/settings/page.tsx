"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Shield, Eye, Trash2, Mail, Smartphone } from "lucide-react";
import { supabase } from "@/src/lib/supabase";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notifications, setNotifications] = useState({
    email_messages: true,
    email_bookings: true,
    email_marketing: false,
    sms_messages: true,
    sms_bookings: true,
  });
  const [privacy, setPrivacy] = useState({
    profile_visible: true,
    show_location: true,
    allow_messages: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setEmail(user.email || "");

      const { data } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setPhone(data.phone || "");
        setNotifications(data.notifications || notifications);
        setPrivacy(data.privacy || privacy);
      }
      setLoading(false);
    }
    fetchSettings();
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("user_settings").upsert({
      user_id: user.id,
      phone,
      notifications,
      privacy,
      updated_at: new Date().toISOString(),
    });

    setSaving(false);
  };

  const deleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
    if (!confirm("This will permanently delete all your data. Type 'DELETE' to confirm.")) return;

    // In production, this would call a secure server endpoint
    alert("Please contact support to delete your account.");
  };

  if (loading) {
    return (
      <div className="max-w-2xl space-y-6">
        <div className="h-12 w-48 bg-white/5 rounded animate-pulse" />
        <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
        <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
      <p className="text-slate-400 mb-8">Manage your account preferences</p>

      {/* Account Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Mail className="h-5 w-5 text-violet-400" />
          Account
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
              disabled
            />
            <p className="text-xs text-slate-500 mt-1">Contact support to change your email</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
            <div className="relative">
              <Smartphone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notifications Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-violet-400" />
          Notifications
        </h3>
        <div className="space-y-4">
          {[
            { key: "email_messages", label: "Email me about new messages" },
            { key: "email_bookings", label: "Email me about booking updates" },
            { key: "email_marketing", label: "Email me tips and promotions" },
            { key: "sms_messages", label: "SMS for new messages" },
            { key: "sms_bookings", label: "SMS for booking updates" },
          ].map((item) => (
            <label key={item.key} className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">{item.label}</span>
              <button
                onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications[item.key as keyof typeof notifications] ? "bg-violet-600" : "bg-white/20"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    notifications[item.key as keyof typeof notifications] ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </label>
          ))}
        </div>
      </motion.div>

      {/* Privacy Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Eye className="h-5 w-5 text-violet-400" />
          Privacy
        </h3>
        <div className="space-y-4">
          {[
            { key: "profile_visible", label: "Make my profile visible to everyone" },
            { key: "show_location", label: "Show my location on profile" },
            { key: "allow_messages", label: "Allow messages from anyone" },
          ].map((item) => (
            <label key={item.key} className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">{item.label}</span>
              <button
                onClick={() => setPrivacy({ ...privacy, [item.key]: !privacy[item.key as keyof typeof privacy] })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  privacy[item.key as keyof typeof privacy] ? "bg-violet-600" : "bg-white/20"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    privacy[item.key as keyof typeof privacy] ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </label>
          ))}
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between"
      >
        <button
          onClick={saveSettings}
          disabled={saving}
          className="rounded-xl bg-violet-600 px-8 py-3 font-semibold text-white hover:bg-violet-500 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 mt-8"
      >
        <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Danger Zone
        </h3>
        <p className="text-slate-400 mb-4">Once you delete your account, there is no going back.</p>
        <button
          onClick={deleteAccount}
          className="flex items-center gap-2 rounded-xl border border-red-500/50 px-6 py-3 text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          Delete Account
        </button>
      </motion.div>
    </div>
  );
}
