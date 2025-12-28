"use client";

import React from 'react';
import { motion, MotionValue } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export function ScrollIndicator({ opacity, y }: { opacity?: MotionValue<number>, y?: MotionValue<number> }) {
  const scrollToContent = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.button
      onClick={scrollToContent}
      style={opacity && y ? { opacity, y } : {}}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 group cursor-pointer"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.5 }}
      aria-label="Scroll down"
    >
      <div className="flex flex-col items-center gap-2">
        <span className="text-zinc-400 text-sm font-medium tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="relative"
        >
          <div className="px-3 py-3 bg-white/5 backdrop-blur-md border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all duration-300">
            <ChevronDown className="w-6 h-6 text-white" />
          </div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg -z-10" />
        </motion.div>
      </div>
    </motion.button>
  );
}
