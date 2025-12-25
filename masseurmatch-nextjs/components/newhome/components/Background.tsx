"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export function Background() {
  const { scrollY } = useScroll();

  // Parallax effects
  const y1 = useTransform(scrollY, [0, 2000], [0, -300]);
  const y2 = useTransform(scrollY, [0, 2000], [0, 400]);
  const opacity = useTransform(scrollY, [0, 800], [1, 0]); // Fade out background on scroll
  
  const springConfig = { stiffness: 40, damping: 20 };
  const smoothY1 = useSpring(y1, springConfig);
  const smoothY2 = useSpring(y2, springConfig);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#030305] pointer-events-none">
      {/* 1. Base Gradient - Deep Space / Midnight */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#05050a] via-[#0a0a15] to-[#05050a]" />

      {/* 2. Central Glow - The "Intelligence" Light */}
      <motion.div 
        style={{ opacity }}
        className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80vw] h-[60vw] rounded-full blur-[150px] mix-blend-screen pointer-events-none"
        animate={{
          backgroundColor: ['rgba(79, 70, 229, 0.2)', 'rgba(99, 102, 241, 0.15)', 'rgba(79, 70, 229, 0.2)']
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* 3. Animated Blobs (Deep Tech Palette) */}
      <motion.div 
        className="absolute top-[10%] left-[-10%] w-[50vw] h-[50vw] min-w-[600px] min-h-[600px] rounded-full mix-blend-screen opacity-15 blur-[120px]"
        style={{ y: smoothY1 }}
        animate={{
          scale: [1, 1.1],
          x: [0, 30],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      >
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(30,27,75,1)_0%,rgba(30,58,138,0)_100%)] rounded-full" />
      </motion.div>

      <motion.div 
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] min-w-[700px] min-h-[700px] rounded-full mix-blend-screen opacity-10 blur-[120px]"
        style={{ y: smoothY2 }}
        animate={{
          scale: [1, 1.2],
          x: [0, -40],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      >
         <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(46,16,101,0.4)_0%,rgba(15,23,42,0)_100%)] rounded-full" />
      </motion.div>

      {/* 4. Grid Texture - Tech Feel */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      <div 
        className="absolute inset-0 opacity-[0.02]" 
        style={{ 
            backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`, 
            backgroundSize: '100px 100px' 
        }} 
      />
    </div>
  );
}
