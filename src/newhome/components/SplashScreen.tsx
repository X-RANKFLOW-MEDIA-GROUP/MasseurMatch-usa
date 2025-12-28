"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress animation - VERY SLOW
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 0.5; // Changed from 1 to 0.5 (even slower)
      });
    }, 80); // Changed from 50ms to 80ms

    // Stage transitions - MUCH LONGER DURATIONS
    const timer1 = setTimeout(() => setStage(1), 1500);   // Was 800
    const timer2 = setTimeout(() => setStage(2), 5000);   // Was 2800
    const timer3 = setTimeout(() => setStage(3), 9000);   // Was 5000
    const timer4 = setTimeout(() => setStage(4), 13000);  // Was 7000
    const finalTimer = setTimeout(() => {
      onComplete();
    }, 15000); // Was 8500 - Now 15 seconds total

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(finalTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[10000] bg-black flex items-center justify-center overflow-hidden"
      >
        {/* Animated Background Gradient Orbs - Subtle */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px]"
        />

        {/* Main Content Container - ONLY TEXT */}
        <div className="relative z-10 flex flex-col items-center justify-center max-w-4xl mx-auto px-6 text-center">
          
          {/* Stage 0-1: Brand Name */}
          <AnimatePresence mode="wait">
            {stage >= 0 && stage < 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-4"
              >
                <motion.h1
                  className="text-7xl md:text-8xl lg:text-9xl font-semibold tracking-tight text-white"
                >
                  MasseurMatch
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-xl md:text-2xl text-zinc-500 font-light tracking-wide"
                >
                  Deep Tech Directory
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stage 2: Mission Statement */}
          <AnimatePresence mode="wait">
            {stage === 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center gap-6 max-w-3xl"
              >
                <motion.h2
                  className="text-4xl md:text-6xl font-medium text-white leading-tight"
                >
                  Connecting You With
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-300 font-medium"
                >
                  Verified Massage Therapists
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stage 3: Welcome Message */}
          <AnimatePresence mode="wait">
            {stage === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center gap-8 max-w-3xl"
              >
                <motion.h2
                  className="text-5xl md:text-6xl font-medium text-white leading-tight"
                >
                  Trusted. Verified. Inclusive.
                </motion.h2>
                  
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg md:text-xl text-zinc-400 leading-relaxed"
                >
                  Direct contact with professionals across the United States
                </motion.p>

                {/* Feature Text Pills - Text Only */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap justify-center gap-4 text-sm md:text-base"
                >
                  <span className="px-6 py-2 text-violet-300 font-medium">
                    No Bookings
                  </span>
                  <span className="px-6 py-2 text-violet-300 font-medium">
                    No Commissions
                  </span>
                  <span className="px-6 py-2 text-violet-300 font-medium">
                    Privacy First
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stage 4: Loading Complete */}
          <AnimatePresence mode="wait">
            {stage === 4 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center gap-6"
              >
                <motion.p 
                  className="text-3xl md:text-4xl text-white font-medium"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Preparing Your Experience
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500"
          />
        </div>

        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <filter id="splashNoise">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
            </filter>
            <rect width="100%" height="100%" filter="url(#splashNoise)" />
          </svg>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
