"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      setScrollProgress(scrollPercent);
      setIsVisible(scrollTop > 500);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={scrollToTop}
          className="fixed left-6 bottom-6 z-40 group"
          aria-label="Scroll to top"
        >
          <div className="relative">
            {/* Circular Progress Ring */}
            <svg className="absolute inset-0 -rotate-90 w-16 h-16">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2"
                fill="none"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="28"
                stroke="url(#gradient)"
                strokeWidth="2"
                fill="none"
                strokeDasharray={2 * Math.PI * 28}
                strokeDashoffset={2 * Math.PI * 28 * (1 - scrollProgress / 100)}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>

            {/* Glass Button Center */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] group-hover:border-violet-500/50 transition-all duration-300"
            >
              <ChevronUp className="w-6 h-6 text-white group-hover:text-violet-300 transition-colors" />
            </motion.div>
            
            {/* Glow Effect */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-violet-500/30 to-indigo-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"
            />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
