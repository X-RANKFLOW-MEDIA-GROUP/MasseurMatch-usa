"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Search, ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section id="join" className="relative py-24 md:py-32 px-4 overflow-hidden bg-gradient-to-br from-[#1a0b2e] via-[#2d1b4e] to-[#0f0520]">
      {/* Background effects - Deep Purple style */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent" />
      
      {/* Animated gradient orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-500/20 rounded-full blur-[150px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[140px] pointer-events-none" 
      />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Main Headline - Large and Bold like reference */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.2] px-4"
          >
            <span className="text-white">
              Are you a massage therapist?
            </span>
            <br />
            <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
              Get discovered in your city.
            </span>
          </motion.h2>

          {/* Subheadline - Smaller text like reference */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-300 mb-10 md:mb-12 leading-relaxed px-4 max-w-2xl mx-auto"
          >
            Create your profile, show your services, and receive direct contact.
            <br className="hidden sm:block" />
            <span className="text-zinc-400">No booking, no commissions.</span>
          </motion.p>

          {/* Primary CTA Button - Centered like reference */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center gap-5 mb-6"
          >
            <a
              href="/join"
              className="group relative px-8 md:px-10 py-4 md:py-5 bg-white text-black font-semibold text-base md:text-lg hover:bg-zinc-100 transition-all duration-300 flex items-center gap-3 shadow-[0_0_50px_-10px_rgba(255,255,255,0.2)]"
            >
              <UserPlus className="w-5 h-5 md:w-6 md:h-6" />
              Join MasseurMatch
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-zinc-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10" />
            </a>

            {/* Secondary CTA - Glass style */}
            <a
              href="/explore"
              className="group relative px-6 md:px-8 py-3 md:py-3.5 bg-white/5 backdrop-blur-md border border-white/20 text-zinc-300 font-medium hover:bg-white/10 hover:border-white/40 hover:text-white transition-all duration-300 flex items-center gap-2 text-sm md:text-base"
            >
              <Search className="w-4 h-4 md:w-5 md:h-5" />
              Explore therapists near you
            </a>
          </motion.div>

          {/* Trust line - Below buttons */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm md:text-base text-zinc-500 font-light"
          >
            Free to join. You control your visibility.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
