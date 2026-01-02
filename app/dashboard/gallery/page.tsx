"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Image, Upload, Trash2, Loader2, AlertCircle, Plus, GripVertical } from "lucide-react";
import { supabase } from "@/src/lib/supabase";
import { PHOTO_LIMITS, SubscriptionPlan } from "@/src/lib/subscription-limits";
import Link from "next/link";

type Photo = {
  id: string;
  url: string;
  type: string;
  status: string;
  created_at: string;
};

export default function GalleryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [plan, setPlan] = useState<SubscriptionPlan>("free");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login?redirect=/dashboard/gallery");
      return;
    }

    // Get subscription plan
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_plan")
      .eq("user_id", user.id)
      .single();

    setPlan((profile?.subscription_plan as SubscriptionPlan) || "free");

    // Fetch photos
    const res = await fetch("/api/photos?type=all");
    const data = await res.json();

    if (data.photos) {
      setPhotos(data.photos);
    }

    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "gallery");

    try {
      const res = await fetch("/api/photos/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.error === "Photo limit reached") {
        alert(`You've reached your photo limit (${data.limit}). ${data.upgrade}`);
      } else if (data.approved && data.photo) {
        setPhotos((prev) => [{ ...data.photo, status: "approved", created_at: new Date().toISOString() }, ...prev]);
      } else if (!data.approved) {
        alert("Photo rejected: " + data.reasons.join(", "));
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const handleDelete = async (photoId: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;

    setDeleting(photoId);

    try {
      const res = await fetch("/api/photos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId }),
      });

      const data = await res.json();

      if (data.success) {
        setPhotos((prev) => prev.filter((p) => p.id !== photoId));
      } else {
        alert(data.error || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const limit = PHOTO_LIMITS[plan];
  const used = photos.length;
  const remaining = limit - used;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Photo Gallery</h1>
          <p className="text-slate-400">Manage your profile photos</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">
            {used} / {limit} photos used
          </p>
          <div className="w-32 h-2 bg-white/10 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full transition-all"
              style={{ width: `${Math.min(100, (used / limit) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-8"
      >
        {remaining > 0 ? (
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-violet-500/50 transition-colors">
              {uploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-10 w-10 text-violet-400 animate-spin mb-3" />
                  <p className="text-slate-400">Uploading & moderating...</p>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-white font-medium mb-1">Click to upload a photo</p>
                  <p className="text-sm text-slate-500">PNG or JPG, max 5MB. {remaining} slots remaining.</p>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        ) : (
          <div className="text-center py-6">
            <AlertCircle className="h-10 w-10 text-amber-400 mx-auto mb-3" />
            <p className="text-white font-medium mb-2">Photo limit reached</p>
            <p className="text-slate-400 mb-4">
              Upgrade your plan to add more photos
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Upgrade Plan
            </Link>
          </div>
        )}
      </motion.div>

      {/* Photos Grid */}
      {photos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center"
        >
          <Image className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No photos yet</h3>
          <p className="text-slate-400">Upload your first photo to get started</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="relative group aspect-square rounded-2xl overflow-hidden bg-white/5"
            >
              <img
                src={photo.url}
                alt={`Gallery photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-move">
                  <GripVertical className="h-5 w-5 text-white" />
                </button>
                <button
                  onClick={() => handleDelete(photo.id)}
                  disabled={deleting === photo.id}
                  className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 transition-colors"
                >
                  {deleting === photo.id ? (
                    <Loader2 className="h-5 w-5 text-white animate-spin" />
                  ) : (
                    <Trash2 className="h-5 w-5 text-white" />
                  )}
                </button>
              </div>
              {index === 0 && (
                <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-violet-600 text-white text-xs font-medium">
                  Main
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Plan Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Current Plan</p>
            <p className="text-white font-medium capitalize">{plan}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Photo Limit</p>
            <p className="text-white font-medium">{limit} photos</p>
          </div>
          {plan !== "elite" && (
            <Link
              href="/pricing"
              className="text-sm text-violet-400 hover:text-violet-300"
            >
              Upgrade for more →
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}
