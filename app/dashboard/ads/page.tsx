"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Edit, Eye, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { supabase } from "@/src/lib/supabase";

type Ad = {
  id: string;
  title: string;
  status: "active" | "paused" | "pending" | "rejected";
  views: number;
  clicks: number;
  created_at: string;
};

export default function AdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAds() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("ads")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setAds(data || []);
      setLoading(false);
    }
    fetchAds();
  }, []);

  const toggleAdStatus = async (adId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    await supabase.from("ads").update({ status: newStatus }).eq("id", adId);
    setAds(ads.map(ad => ad.id === adId ? { ...ad, status: newStatus as Ad["status"] } : ad));
  };

  const deleteAd = async (adId: string) => {
    if (!confirm("Are you sure you want to delete this ad?")) return;
    await supabase.from("ads").delete().eq("id", adId);
    setAds(ads.filter(ad => ad.id !== adId));
  };

  const statusColors = {
    active: "bg-green-500/20 text-green-400",
    paused: "bg-yellow-500/20 text-yellow-400",
    pending: "bg-blue-500/20 text-blue-400",
    rejected: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Ads</h1>
          <p className="text-slate-400">Manage your listings and advertisements</p>
        </div>
        <Link
          href="/dashboard/ads/new"
          className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-white hover:bg-neutral-200 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Create Ad
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : ads.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 rounded-2xl border border-white/10 bg-white/5"
        >
          <div className="text-6xl mb-4">📢</div>
          <h2 className="text-xl font-semibold text-white mb-2">No ads yet</h2>
          <p className="text-slate-400 mb-6">Create your first ad to start getting clients</p>
          <Link
            href="/dashboard/ads/new"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-white hover:bg-neutral-200 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Create Your First Ad
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {ads.map((ad, index) => (
            <motion.div
              key={ad.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{ad.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[ad.status]}`}>
                      {ad.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" /> {ad.views} views
                    </span>
                    <span>{ad.clicks} clicks</span>
                    <span>Created {new Date(ad.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAdStatus(ad.id, ad.status)}
                    className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    title={ad.status === "active" ? "Pause" : "Activate"}
                  >
                    {ad.status === "active" ? <ToggleRight className="h-5 w-5 text-green-400" /> : <ToggleLeft className="h-5 w-5" />}
                  </button>
                  <Link
                    href={`/dashboard/ads/${ad.id}/edit`}
                    className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  >
                    <Edit className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => deleteAd(ad.id)}
                    className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
