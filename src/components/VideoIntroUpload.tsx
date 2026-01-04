"use client";

import { useState, useRef } from "react";
import { Video, Upload, Trash2, Loader2, Play, AlertCircle } from "lucide-react";

interface VideoIntroUploadProps {
  currentVideo?: string | null;
  onVideoChange: (url: string | null) => void;
}

export default function VideoIntroUpload({
  currentVideo,
  onVideoChange,
}: VideoIntroUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Client-side validation
    const allowedTypes = ["video/mp4", "video/webm", "video/quicktime"];
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload MP4, WebM, or MOV format");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError("Video must be under 50MB");
      return;
    }

    // Check duration (client-side)
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = async () => {
      window.URL.revokeObjectURL(video.src);

      if (video.duration > 60) {
        setError("Video must be 60 seconds or less");
        return;
      }

      // Upload
      await uploadVideo(file);
    };

    video.src = URL.createObjectURL(file);
  };

  const uploadVideo = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/video/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        onVideoChange(data.video.url);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete your intro video?")) return;

    setDeleting(true);
    setError(null);

    try {
      const res = await fetch("/api/video/upload", {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        onVideoChange(null);
        setPlaying(false);
      } else {
        setError(data.error || "Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Delete failed. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Video or Upload Area */}
      {currentVideo ? (
        <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
          <video
            ref={videoRef}
            src={currentVideo}
            className="w-full h-full object-contain"
            onEnded={() => setPlaying(false)}
            playsInline
          />

          {/* Play overlay */}
          {!playing && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                <Play className="h-8 w-8 text-violet-600 ml-1" />
              </div>
            </button>
          )}

          {/* Controls */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={togglePlay}
              className="p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              {playing ? "Pause" : "Play"}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-2 rounded-lg bg-red-500/80 text-white hover:bg-red-500 transition-colors disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Trash2 className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      ) : (
        <label
          className={`flex flex-col items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed transition-colors cursor-pointer ${
            uploading
              ? "border-violet-500/50 bg-violet-500/10"
              : "border-white/20 bg-white/5 hover:border-violet-500/50 hover:bg-violet-500/10"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-violet-500 animate-spin mb-4" />
              <p className="text-slate-300">Uploading video...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center p-8">
              <div className="p-4 rounded-full bg-violet-600/20 mb-4">
                <Video className="h-8 w-8 text-violet-400" />
              </div>
              <p className="text-white font-medium mb-2">Upload Intro Video</p>
              <p className="text-sm text-slate-400 text-center mb-4">
                30-60 seconds recommended. Show clients who you are!
              </p>
              <div className="flex items-center gap-2 text-violet-400">
                <Upload className="h-4 w-4" />
                <span className="text-sm">Click to upload</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                MP4, WebM, or MOV • Max 50MB • Max 60 seconds
              </p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </label>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Tips */}
      <div className="p-4 rounded-xl bg-violet-600/10 border border-violet-500/20">
        <h4 className="font-medium text-white mb-2">Video Tips</h4>
        <ul className="text-sm text-slate-400 space-y-1">
          <li>• Introduce yourself and your massage style</li>
          <li>• Show your personality - clients want to know you</li>
          <li>• Good lighting and clear audio make a difference</li>
          <li>• Keep it professional but personable</li>
        </ul>
      </div>
    </div>
  );
}
