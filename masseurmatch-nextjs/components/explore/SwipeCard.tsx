"use client";

import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Heart, X, MapPin, Star } from "lucide-react";
import { useState } from "react";

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

interface SwipeCardProps {
  therapist: TherapistCardData;
  onSwipe: (direction: "left" | "right", therapist: TherapistCardData) => void;
  onDismiss?: () => void;
  style?: React.CSSProperties;
}

export function SwipeCard({ therapist, onSwipe, onDismiss, style }: SwipeCardProps) {
  const [exitX, setExitX] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;

    if (Math.abs(info.offset.x) > threshold) {
      const direction = info.offset.x > 0 ? "right" : "left";
      setExitX(info.offset.x > 0 ? 300 : -300);
      onSwipe(direction, therapist);
      if (onDismiss) {
        setTimeout(onDismiss, 300);
      }
    }
  };

  return (
    <motion.div
      className="absolute w-full h-full"
      style={{
        x,
        rotate,
        opacity,
        ...style,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={exitX !== 0 ? { x: exitX } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="relative w-full h-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
        {/* Image */}
        <div className="relative h-3/5 overflow-hidden">
          <img
            src={therapist.photo}
            alt={therapist.name}
            className="w-full h-full object-cover"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

          {/* Distance Badge */}
          {therapist.distance && (
            <div className="absolute top-4 right-4 glass-effect px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-sm font-medium text-white">{therapist.distance}</span>
            </div>
          )}

          {/* Rating Badge */}
          {therapist.rating && (
            <div className="absolute top-4 left-4 glass-effect px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-white">
                {therapist.rating}
                {therapist.reviewCount && (
                  <span className="text-slate-400"> ({therapist.reviewCount})</span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="h-2/5 p-6 flex flex-col">
          {/* Name and Location */}
          <div className="mb-3">
            <h3 className="text-2xl font-bold text-white mb-1">
              {therapist.name}
              {therapist.age && (
                <span className="text-slate-400 font-normal ml-2">{therapist.age}</span>
              )}
            </h3>
            <p className="text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {therapist.city}, {therapist.state}
            </p>
          </div>

          {/* Services */}
          <div className="mb-3 flex flex-wrap gap-2">
            {therapist.services.slice(0, 3).map((service) => (
              <span
                key={service}
                className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs text-purple-300"
              >
                {service}
              </span>
            ))}
            {therapist.services.length > 3 && (
              <span className="px-2.5 py-1 bg-slate-800 rounded-full text-xs text-slate-400">
                +{therapist.services.length - 3} more
              </span>
            )}
          </div>

          {/* Bio */}
          <p className="text-sm text-slate-300 line-clamp-2 flex-1">
            {therapist.bio}
          </p>
        </div>

        {/* Swipe Indicators */}
        <motion.div
          className="absolute top-1/3 left-8 transform -rotate-12"
          style={{
            opacity: useTransform(x, [0, 100], [0, 1]),
          }}
        >
          <div className="px-6 py-3 border-4 border-green-500 rounded-xl">
            <Heart className="w-8 h-8 text-green-500 fill-green-500" />
          </div>
        </motion.div>

        <motion.div
          className="absolute top-1/3 right-8 transform rotate-12"
          style={{
            opacity: useTransform(x, [-100, 0], [1, 0]),
          }}
        >
          <div className="px-6 py-3 border-4 border-red-500 rounded-xl">
            <X className="w-8 h-8 text-red-500" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
