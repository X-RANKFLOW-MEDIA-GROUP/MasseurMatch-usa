"use client";

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Send, Search, ArrowRight, MapPin, Shield, Lock, UserCheck } from 'lucide-react';
import { ScrollIndicator } from './ScrollIndicator';
import ExploreModal from '@/components/ExploreModal';

const Typewriter = ({ text, delay = 0, speed = 30 }: { text: string, delay?: number, speed?: number }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
        setStarted(true);
    }, delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, started]);

  return <span>{displayedText}</span>;
};

export function Hero() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const y = useTransform(scrollY, [0, 300], [0, 50]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);
  const blur = useTransform(scrollY, [0, 300], [0, 10]);

  // Geolocation State
  const [location, setLocation] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  // Explore Modal State
  const [isExploreModalOpen, setIsExploreModalOpen] = useState(false);

  // Animated counters for social proof
  const [therapistsCount, setTherapistsCount] = useState(0);
  const [sessionsCount, setSessionsCount] = useState(0);
  const [onlineCount, setOnlineCount] = useState(0);

  // Animated counter effect
  useEffect(() => {
    const animateCounter = (setter: (val: number) => void, target: number, duration: number) => {
      let start = 0;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(start));
        }
      }, 16);
      return timer;
    };

    const timer1 = animateCounter(setTherapistsCount, 2547, 2000);
    const timer2 = animateCounter(setSessionsCount, 12847, 2500);
    const timer3 = animateCounter(setOnlineCount, 342, 1500);

    return () => {
      clearInterval(timer1);
      clearInterval(timer2);
      clearInterval(timer3);
    };
  }, []);

  useEffect(() => {
    setLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Demo API for reverse geocoding
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
            );
            const data = await response.json();
            setLocation(data.city || data.locality || "your area");
          } catch (error) {
            console.error("Error finding city:", error);
            setLocation("your city");
          } finally {
            setLocating(false);
          }
        },
        (error) => {
          console.log("Location permission denied", error);
          setLocating(false);
        }
      );
    } else {
      setLocating(false);
    }
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-10 px-6 overflow-hidden bg-[#050505] selection:bg-indigo-500/30">
      
      {/* --- Animated Background (Aurora Deep Tech) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Moving Gradient Orbs */}
          <motion.div 
            animate={{ 
                x: [ -200, 200, -200],
                y: [ -100, 100, -100],
                opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] left-[20%] w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[120px]" 
          />
          <motion.div 
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-20%] right-[20%] w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[100px]" 
          />

          {/* Subtle Grid */}
          <div 
            className="absolute inset-0 opacity-[0.03]" 
            style={{ 
                backgroundImage: 'linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)',
                backgroundSize: '80px 80px'
            }} 
          />
          
          {/* Noise Texture */}
          <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{ filter: 'url(#noise)' }} />
      </div>

      {/* --- Main Content --- */}
      <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
        
        {/* --- Left Column: SEO Optimized Content --- */}
        <div className="flex flex-col items-start text-left">
            
            {/* Dynamic Location Badge */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
            >
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-sm text-zinc-400 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/5">
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${locating ? 'bg-indigo-400' : 'bg-violet-400'} opacity-75`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${locating ? 'bg-indigo-500' : 'bg-violet-500'}`}></span>
                    </span>
                    <span className="font-medium text-zinc-300 flex items-center gap-1">
                       <MapPin className="w-3 h-3" />
                       {locating ? "Locating you..." : location ? `Verified in ${location}` : "Locating..."}
                    </span>
                </div>
            </motion.div>
            
            {/* Dynamic H1 Headline */}
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-[-0.04em] text-white mb-10 drop-shadow-2xl leading-[1.1] w-full"
                aria-label="Find Trusted Gay Massage Therapists Near You"
            >
              <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500">
                Find Trusted Gay
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500">
                Massage Therapists
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500">
                {location ? `Near You in ${location}` : "Near You"}
              </span>
            </motion.h1>

            {/* Animated Stats - Social Proof */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-3 gap-4 mb-8"
            >
                <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="relative group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:border-violet-500/30 transition-all duration-300">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
                            className="text-3xl font-bold text-white mb-1"
                        >
                            {therapistsCount.toLocaleString()}+
                        </motion.div>
                        <div className="text-xs text-zinc-400 font-medium">Therapists</div>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="relative group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:border-violet-500/30 transition-all duration-300">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.4 }}
                            className="text-3xl font-bold text-white mb-1"
                        >
                            {sessionsCount.toLocaleString()}+
                        </motion.div>
                        <div className="text-xs text-zinc-400 font-medium">Sessions</div>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="relative group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:border-violet-500/30 transition-all duration-300">
                        <div className="flex items-center gap-2 mb-1">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
                                className="text-3xl font-bold text-white"
                            >
                                {onlineCount}
                            </motion.div>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="w-2 h-2 rounded-full bg-green-400"
                            />
                        </div>
                        <div className="text-xs text-zinc-400 font-medium">Online Now</div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap items-center gap-3 mb-10"
            >
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-violet-500/20 bg-violet-500/5 backdrop-blur-sm cursor-pointer hover:bg-violet-500/10 transition-all"
                >
                    <UserCheck className="w-4 h-4 text-violet-300" />
                    <span className="text-sm font-medium text-violet-200">Verified Profiles</span>
                </motion.div>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-violet-500/20 bg-violet-500/5 backdrop-blur-sm cursor-pointer hover:bg-violet-500/10 transition-all"
                >
                    <Lock className="w-4 h-4 text-violet-300" />
                    <span className="text-sm font-medium text-violet-200">Secure Contact</span>
                </motion.div>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-violet-500/20 bg-violet-500/5 backdrop-blur-sm cursor-pointer hover:bg-violet-500/10 transition-all"
                >
                    <Shield className="w-4 h-4 text-violet-300" />
                    <span className="text-sm font-medium text-violet-200">Privacy Protected</span>
                </motion.div>
            </motion.div>

            {/* Call to Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row items-start gap-4 w-full"
            >
              <motion.button
                type="button"
                onClick={() => setIsExploreModalOpen(true)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="group relative h-16 px-10 bg-white text-black text-lg font-semibold tracking-tight overflow-hidden flex items-center gap-2"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-violet-500 via-indigo-500 to-violet-500"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{ opacity: 0 }}
                  whileHover={{ opacity: 0.1 }}
                />
                <span className="relative z-10">Find Your Match</span>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5 relative z-10" />
                </motion.div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-indigo-500/20 blur-xl"
                  animate={{
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.button>

              <motion.a
                href="/join"
                whileHover={{ scale: 1.03, x: 5 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="group relative h-16 px-8 border border-white/10 bg-white/[0.02] backdrop-blur-md text-zinc-300 font-medium hover:bg-white/5 hover:text-white hover:border-white/20 transition-all flex items-center gap-3 overflow-hidden"
              >
                <span>For Professionals</span>
                <motion.div
                  className="w-8 h-8 bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors"
                  whileHover={{ rotate: -45 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                    <ArrowRight className="w-4 h-4 text-white" />
                </motion.div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
              </motion.a>
            </motion.div>
        </div>

        {/* --- Right Column: Dynamic Chat UI --- */}
        <div className="relative flex justify-center lg:justify-end perspective-[2000px] h-full items-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: -25, rotateX: 10 }}
                animate={{ opacity: 1, scale: 1, rotateY: -5, rotateX: 0 }}
                transition={{
                  duration: 1.8,
                  delay: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                  type: "spring",
                  stiffness: 100,
                  damping: 20
                }}
                whileHover={{
                  scale: 1.02,
                  rotateY: 0,
                  transition: { duration: 0.3 }
                }}
                className="relative w-full max-w-[500px]"
            >
                {/* 3D Glass Layer Effects */}
                <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500/20 to-white/10 rounded-[42px] blur-xl opacity-50" />
                <div className="absolute -inset-0.5 bg-gradient-to-b from-white/10 to-transparent rounded-[42px] opacity-20" />

                {/* Main Card Container */}
                <div className="relative rounded-[40px] overflow-hidden bg-[#0a0a0e]/90 backdrop-blur-2xl shadow-2xl border border-white/10">
                    
                    {/* Header */}
                    <div className="h-16 border-b border-white/5 bg-white/[0.02] flex items-center px-6 justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500/20 border border-violet-500/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-violet-500/20 border border-violet-500/50" />
                        </div>
                        <div className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase">Knotty AI v2.0</div>
                    </div>

                    {/* Chat Area */}
                    <div className="p-6 pb-8 min-h-[480px] flex flex-col justify-end relative">
                        {/* Subtle inner glow */}
                        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />

                        <div className="space-y-6 relative z-10">
                            
                            {/* AI Message Bubble */}
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="flex gap-4"
                            >
                                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div className="space-y-2 max-w-[85%]">
                                    <div className="p-5 rounded-2xl rounded-tl-none bg-[#1c1c21] border border-white/5 shadow-lg">
                                        <p className="text-zinc-200 text-[15px] leading-relaxed font-light">
                                            <Typewriter 
                                                text={`Hi there! I see you're in ${location || "town"}. Let me find the best rated therapists near you.`}
                                                delay={800}
                                                speed={20}
                                            />
                                        </p>
                                    </div>
                                    <span className="text-[10px] text-zinc-600 pl-1">Just now</span>
                                </div>
                            </motion.div>

                            {/* User Suggestion Chips */}
                            <div className="pl-14 flex flex-wrap gap-2">
                                {['Near Downtown', 'Deep Tissue', 'Available Today'].map((tag, i) => (
                                    <motion.button 
                                        key={tag}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 2.5 + (i * 0.1) }}
                                        className="px-3 py-1.5 rounded-lg border border-indigo-500/20 bg-indigo-500/5 text-indigo-300 text-xs hover:bg-indigo-500/10 transition-colors"
                                    >
                                        {tag}
                                    </motion.button>
                                ))}
                            </div>

                            {/* Input Field Simulation */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="relative mt-4 group"
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 rounded-xl opacity-30 blur transition duration-500 group-hover:opacity-50" />
                                <div className="relative bg-[#050505] border border-white/10 rounded-xl p-1.5 pl-4 flex items-center gap-3">
                                    <Search className="w-4 h-4 text-zinc-500" />
                                    <input 
                                        type="text" 
                                        disabled
                                        placeholder={location ? `Searching in ${location}...` : "Locating..."}
                                        className="w-full bg-transparent border-none focus:outline-none text-zinc-400 placeholder:text-zinc-600 text-sm h-10"
                                    />
                                    <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg">
                                        <Send className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            </motion.div>

                        </div>
                    </div>
                </div>
            </motion.div>
        </div>

      </div>

      {/* --- Footer / Scroll Indicator --- */}
      <ScrollIndicator opacity={opacity} y={y} />

      {/* SVG Filters for Noise (Hidden but applied) */}
      <svg className="hidden">
        <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
                <feFuncA type="linear" slope="0.5" />
            </feComponentTransfer>
        </filter>
      </svg>

      {/* Explore Modal */}
      <ExploreModal
        isOpen={isExploreModalOpen}
        onClose={() => setIsExploreModalOpen(false)}
        defaultMode="ai"
      />
    </section>
  );
}


