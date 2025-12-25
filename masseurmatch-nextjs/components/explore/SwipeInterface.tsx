"use client";

import { useState } from "react";
import { SwipeCard } from "./SwipeCard";
import { Button } from "@/components/ui/button";
import { Heart, X, RotateCcw, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TherapistCardData {
  id: string;
  name: string;
  photo: string;
  age?: number;
  city: string;
  state: string;
  distance?: string;
  rating?: number;
  reviewCount?: number;
  services: string[];
  bio: string;
}

interface SwipeInterfaceProps {
  therapists: TherapistCardData[];
  onLike?: (therapist: TherapistCardData) => void;
  onPass?: (therapist: TherapistCardData) => void;
  onMatchesClick?: () => void;
  matchCount?: number;
}

export function SwipeInterface({
  therapists = [],
  onLike,
  onPass,
  onMatchesClick,
  matchCount = 0,
}: SwipeInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeHistory, setSwipeHistory] = useState<Array<{ therapist: TherapistCardData; action: "left" | "right" }>>([]);

  const currentTherapist = therapists[currentIndex];
  const hasMore = currentIndex < therapists.length - 1;

  const handleSwipe = (direction: "left" | "right", therapist: TherapistCardData) => {
    setSwipeHistory((prev) => [...prev, { therapist, action: direction }]);

    if (direction === "right" && onLike) {
      onLike(therapist);
    } else if (direction === "left" && onPass) {
      onPass(therapist);
    }

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 300);
  };

  const handleUndo = () => {
    if (swipeHistory.length > 0) {
      setSwipeHistory((prev) => prev.slice(0, -1));
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const handleButtonSwipe = (direction: "left" | "right") => {
    if (currentTherapist) {
      handleSwipe(direction, currentTherapist);
    }
  };

  if (!currentTherapist && currentIndex === 0) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-10 h-10 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">No Therapists Found</h3>
          <p className="text-slate-400 max-w-md">
            We couldn't find any therapists matching your criteria. Try adjusting your filters or search in a different area.
          </p>
        </div>
      </div>
    );
  }

  if (!hasMore && !currentTherapist) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-10 h-10 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">You've Seen Everyone!</h3>
          <p className="text-slate-400 max-w-md">
            You've reviewed all available therapists. Check back later for new profiles or expand your search area.
          </p>
          <div className="flex gap-3 justify-center">
            {swipeHistory.length > 0 && (
              <Button
                variant="outline"
                onClick={handleUndo}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Undo Last
              </Button>
            )}
            {matchCount > 0 && onMatchesClick && (
              <Button
                onClick={onMatchesClick}
                className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500"
              >
                <Heart className="w-4 h-4" />
                View {matchCount} Match{matchCount !== 1 ? "es" : ""}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Discover</h2>
          <p className="text-slate-400 text-sm">
            {therapists.length - currentIndex} therapist{therapists.length - currentIndex !== 1 ? "s" : ""} nearby
          </p>
        </div>
        {matchCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onMatchesClick}
            className="gap-2"
          >
            <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
            {matchCount}
          </Button>
        )}
      </div>

      {/* Swipe Cards */}
      <div className="relative h-[600px] mb-8">
        <AnimatePresence>
          {currentTherapist && (
            <SwipeCard
              key={currentTherapist.id}
              therapist={currentTherapist}
              onSwipe={handleSwipe}
              style={{ zIndex: therapists.length - currentIndex }}
            />
          )}

          {/* Next Card Preview */}
          {hasMore && therapists[currentIndex + 1] && (
            <motion.div
              className="absolute inset-0"
              style={{
                zIndex: therapists.length - currentIndex - 1,
                scale: 0.95,
                opacity: 0.5,
              }}
            >
              <div className="w-full h-full bg-slate-900 rounded-2xl border border-slate-800" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleButtonSwipe("left")}
          className="w-16 h-16 rounded-full bg-white/5 border-2 border-red-500/20 hover:border-red-500 hover:bg-red-500/10 flex items-center justify-center transition-all"
        >
          <X className="w-7 h-7 text-red-500" />
        </motion.button>

        {swipeHistory.length > 0 && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUndo}
            className="w-12 h-12 rounded-full bg-white/5 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 flex items-center justify-center transition-all"
          >
            <RotateCcw className="w-5 h-5 text-slate-400" />
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleButtonSwipe("right")}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30 transition-all"
        >
          <Heart className="w-7 h-7 text-white" />
        </motion.button>
      </div>

      {/* Card Counter */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-slate-800">
          <span className="text-sm text-slate-400">
            {currentIndex + 1} / {therapists.length}
          </span>
        </div>
      </div>
    </div>
  );
}
