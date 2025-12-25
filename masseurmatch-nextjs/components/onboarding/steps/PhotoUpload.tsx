"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/lib/hooks/useOnboarding";
import { Upload, X, Check, AlertCircle, Loader2, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { MediaAsset } from "@/lib/types/database";

interface PhotoUploadProps {
  onNext: () => void;
  onBack: () => void;
}

export function PhotoUpload({ onNext, onBack }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<MediaAsset[]>([]);
  const [maxPhotos, setMaxPhotos] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const { uploadPhoto, getPhotos, loading, error } = useOnboarding();

  const loadPhotos = useCallback(async () => {
    const data = await getPhotos();
    setPhotos(data.photos);
    setMaxPhotos(data.maxPhotos);
  }, [getPhotos]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    if (photos.length >= maxPhotos) {
      alert(`You can only upload up to ${maxPhotos} photos with your current plan`);
      return;
    }

    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        if (photos.length + i >= maxPhotos) break;

        const file = files[i];
        const result = await uploadPhoto(file);
        setPhotos((prev) => [...prev, result]);
      }

      await loadPhotos();
    } catch (err) {
      console.error("Failed to upload photo:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleContinue = () => {
    const approvedCount = photos.filter((p) => p.status === "approved").length;
    if (approvedCount === 0) {
      alert("You need at least one approved photo to continue");
      return;
    }
    onNext();
  };

  const getStatusIcon = (status: MediaAsset["status"]) => {
    switch (status) {
      case "approved":
        return <Check className="w-5 h-5 text-green-400" />;
      case "rejected":
        return <X className="w-5 h-5 text-red-400" />;
      case "pending":
        return <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" />;
    }
  };

  const getStatusText = (status: MediaAsset["status"]) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "pending":
        return "Under Review";
    }
  };

  const canContinue = photos.filter((p) => p.status === "approved").length > 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <ImageIcon className="w-8 h-8 text-purple-400" />
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2">Upload Photos</h2>
        <p className="text-slate-400">
          Add professional photos to your profile ({photos.length}/{maxPhotos})
        </p>
      </div>

      {/* Upload Area */}
      <Card className="glass-effect border-slate-800">
        <CardContent className="pt-6">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all ${
              dragActive
                ? "border-purple-500 bg-purple-500/10"
                : "border-slate-700 hover:border-slate-600"
            }`}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading || photos.length >= maxPhotos}
            />

            <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">
              {uploading ? "Uploading..." : "Drop your photos here"}
            </p>
            <p className="text-sm text-slate-400 mb-4">
              or click to browse from your computer
            </p>
            <p className="text-xs text-slate-500">
              JPG, PNG or WEBP • Max 5MB per file
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <AnimatePresence>
            {photos.map((photo) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square rounded-lg overflow-hidden group"
              >
                <img
                  src={photo.public_url || photo.thumbnail_url || ""}
                  alt="Profile photo"
                  className="w-full h-full object-cover"
                />

                {/* Status Overlay */}
                <div
                  className={`absolute inset-0 flex items-center justify-center ${
                    photo.status === "approved"
                      ? "bg-green-500/20"
                      : photo.status === "rejected"
                      ? "bg-red-500/20"
                      : "bg-yellow-500/20"
                  }`}
                >
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 rounded-full">
                    {getStatusIcon(photo.status)}
                    <span className="text-sm font-medium text-white">
                      {getStatusText(photo.status)}
                    </span>
                  </div>
                </div>

                {photo.status === "rejected" && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-slate-900/90">
                    <p className="text-xs text-red-400">
                      This photo didn't pass moderation
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
            <div className="text-sm text-blue-200">
              <p className="font-medium mb-1">Automatic Moderation</p>
              <p className="text-blue-200/80">
                All photos are automatically reviewed for content safety using Sightengine
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 text-purple-400 mt-0.5" />
            <div className="text-sm text-purple-200">
              <p className="font-medium mb-1">Photo Tips</p>
              <p className="text-purple-200/80">
                Use well-lit, professional photos. Show your workspace and massage setup
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!canContinue || loading}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            "Continue to Review"
          )}
        </Button>
      </div>
    </div>
  );
}
