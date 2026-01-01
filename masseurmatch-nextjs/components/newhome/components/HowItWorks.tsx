"use client";

import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, PanInfo } from 'framer-motion';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  Lock,
  Shield
} from 'lucide-react';

// Video Mockup Component (For Knotty Chat)
const KnottyVideoMockup = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: 15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      className="relative w-full max-w-[600px] mx-auto"
      style={{ perspective: '1200px' }}
    >
      {/* Video Container */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-violet-500/30 shadow-2xl bg-black">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 via-indigo-500/10 to-transparent blur-2xl -z-10" />
        
        {/* Animated Chat Preview */}
        <div className="relative aspect-video bg-gradient-to-br from-zinc-900 via-black to-zinc-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.18),_transparent_60%)]" />
          <div className="relative h-full p-6">
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3 text-xs text-zinc-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="uppercase tracking-[0.2em] text-[10px]">Live chat</span>
                <span className="ml-auto text-[10px] text-zinc-500">Knotty AI</span>
              </div>
              <div className="relative flex-1 overflow-hidden px-4 py-3">
                <motion.div
                  className="space-y-3"
                  animate={{ y: ["0%", "-50%"] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                >
                  {[
                    { from: "user", text: "Looking for a deep tissue session near Downtown." },
                    { from: "knotty", text: "Got it. I can match you with verified therapists within 2 miles." },
                    { from: "user", text: "Prefer evening availability and mobile." },
                    { from: "knotty", text: "Three options fit. Want the top-rated profile first?" },
                    { from: "user", text: "Yes, show me the best match." },
                    { from: "knotty", text: "Sending profile and contact details now." },
                  ]
                    .concat([
                      { from: "user", text: "Looking for a deep tissue session near Downtown." },
                      { from: "knotty", text: "Got it. I can match you with verified therapists within 2 miles." },
                      { from: "user", text: "Prefer evening availability and mobile." },
                      { from: "knotty", text: "Three options fit. Want the top-rated profile first?" },
                      { from: "user", text: "Yes, show me the best match." },
                      { from: "knotty", text: "Sending profile and contact details now." },
                    ])
                    .map((message, index) => (
                      <div
                        key={`${message.from}-${index}`}
                        className={`max-w-[80%] rounded-2xl px-4 py-2 text-xs leading-relaxed ${
                          message.from === "user"
                            ? "ml-auto bg-violet-500/20 text-violet-100"
                            : "mr-auto bg-white/10 text-zinc-200"
                        }`}
                      >
                        {message.text}
                      </div>
                    ))}
                </motion.div>
                <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-2 text-xs text-zinc-400">
                  <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
                  <span className="flex-1">Knotty is typing</span>
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "120ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "240ms" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video UI Chrome */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold">Knotty AI Assistant</p>
              <p className="text-zinc-400 text-xs truncate">Interactive chat preview</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.8, type: "spring" }}
        className="absolute -top-4 -right-4 px-4 py-2 rounded-xl bg-violet-500 border border-violet-400 shadow-lg"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-sm font-semibold text-white">Preview</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Video Mockup Component (For Find Therapist)
const FindTherapistVideoMockup = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: 15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      className="relative w-full max-w-[600px] mx-auto"
      style={{ perspective: '1200px' }}
    >
      {/* Video Container */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-indigo-500/30 shadow-2xl bg-black">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-violet-500/10 to-transparent blur-2xl -z-10" />
        
        {/* Video Element - Replace src with actual video URL */}
        <div className="relative aspect-video bg-gradient-to-br from-zinc-900 via-black to-zinc-950">
          <video
            muted
            playsInline
            preload="none"
            className="w-full h-full object-cover"
            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E%3Crect fill='%23000' width='800' height='450'/%3E%3C/svg%3E"
          />
          
          {/* Placeholder Overlay (remove when video is ready) */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-950">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                <Search className="w-10 h-10 text-indigo-400" />
              </div>
              <p className="text-zinc-400 text-sm font-medium mb-1">Find Therapists Preview</p>
            </div>
          </div>
          
          {/* Play Button Overlay */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1" />
            </div>
          </motion.div>
        </div>

        {/* Video UI Chrome */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
              <Search className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold">Browse Therapists</p>
              <p className="text-zinc-400 text-xs truncate">Search, filter, and connect walkthrough</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.8, type: "spring" }}
        className="absolute -top-4 -right-4 px-4 py-2 rounded-xl bg-indigo-500 border border-indigo-400 shadow-lg"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-sm font-semibold text-white">Preview</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Dashboard Mockup Component (For Therapists)
const DashboardMockup = () => {
  const stats = [
    { label: 'Profile Views', value: '10.4k', trend: '+24%' },
    { label: 'Inquiries', value: '312', trend: '+12%' },
    { label: 'Bookings', value: '86', trend: '+9%' }
  ];

  const activity = [
    { label: 'New client request', detail: 'Swedish • 60 min', time: '5m ago' },
    { label: 'Profile approved', detail: 'Visible in search', time: '1h ago' },
    { label: 'Payment received', detail: '$120 session', time: '3h ago' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: 15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      className="relative w-full max-w-[600px] mx-auto"
      style={{ perspective: '1200px' }}
    >
      <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/30 shadow-2xl bg-zinc-950">
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-transparent blur-2xl -z-10" />

        <div className="relative p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Therapist Dashboard</p>
                <p className="text-zinc-400 text-xs">Performance overview</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
              Live
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {stats.map((stat) => (
              <div key={stat.label} className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-zinc-500">{stat.label}</p>
                <p className="text-xl text-white font-semibold">{stat.value}</p>
                <p className="text-xs text-emerald-300">{stat.trend}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 mb-6">
            <p className="text-xs text-zinc-500 mb-3">Weekly activity</p>
            <div className="flex items-end gap-2 h-16">
              {[32, 48, 40, 72, 52, 60, 38].map((height) => (
                <div
                  key={height}
                  className="flex-1 rounded-md bg-gradient-to-t from-emerald-500/40 to-emerald-500/10"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {activity.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="mt-1 w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white font-semibold">{item.label}</p>
                  <p className="text-xs text-zinc-400">{item.detail}</p>
                </div>
                <span className="text-xs text-zinc-500">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.8, type: "spring" }}
        className="absolute -top-4 -left-4 px-4 py-2 rounded-xl bg-emerald-500 border border-emerald-400 shadow-lg"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-sm font-semibold text-white">Preview</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

const slides = [
  {
    id: 'knotty',
    category: 'AI Chat Companion',
    title: 'Chat with Knotty',
    subtitle: 'Your AI assistant for finding therapists',
    description: 'Knotty is your AI-powered assistant that helps you find therapists, compare services, and get answers 24/7. Get instant recommendations, pricing info, and connect with the right professional—all through direct conversation.',
    impact: [
      { metric: '24/7', label: 'Available' },
      { metric: 'Instant', label: 'Responses' },
      { metric: '100%', label: 'Private' },
      { metric: 'Free', label: 'Always' }
    ],
    steps: [
      { number: '01', title: 'Ask Anything', description: 'Questions about services, pricing, locations, or therapists' },
      { number: '02', title: 'Get Recommendations', description: 'Knotty analyzes your needs and suggests perfect matches' },
      { number: '03', title: 'Connect Instantly', description: 'Direct contact info or seamless chat with therapists' }
    ],
    mockupType: 'chat'
  },
  {
    id: 'clients',
    category: 'For Clients',
    title: 'Find your perfect therapist',
    subtitle: 'Browse, choose, and connect directly',
    description: 'Search verified massage therapists by specialty, location, and ratings. View detailed profiles with reviews and credentials. Contact them directly—no middleman, no hassle.',
    impact: [
      { metric: '100%', label: 'Direct Contact' },
      { metric: '2,500+', label: 'Therapists' },
      { metric: '4.9', label: 'Avg Rating' },
      { metric: '50+', label: 'Cities' }
    ],
    steps: [
      { number: '01', title: 'Browse & Search', description: 'Filter by specialty, location, ratings & availability' },
      { number: '02', title: 'View Profiles', description: 'Read reviews, credentials & therapist background' },
      { number: '03', title: 'Contact Directly', description: 'Get contact info and reach out—simple and direct' }
    ],
    mockupType: 'phone'
  },
  {
    id: 'therapists',
    category: 'For Therapists',
    title: 'Grow your practice',
    subtitle: 'Create profile, get visibility, receive contacts',
    description: 'Join MasseurMatch to increase your visibility and connect with clients. Create your profile, appear in search results, and receive direct contact—100% of your earnings stay with you.',
    impact: [
      { metric: '100%', label: 'Your Earnings' },
      { metric: '10k+', label: 'Monthly Views' },
      { metric: '3x', label: 'More Clients' },
      { metric: 'Free', label: 'To Join' }
    ],
    steps: [
      { number: '01', title: 'Create Profile', description: 'Add specialties, credentials, photos & availability' },
      { number: '02', title: 'Get Discovered', description: 'Appear in search results for clients in your area' },
      { number: '03', title: 'Receive Contacts', description: 'Clients reach you directly—manage your schedule your way' }
    ],
    mockupType: 'dashboard'
  }
];

export const HowItWorks: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);

  // const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    
    if (info.offset.x < -threshold && currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else if (info.offset.x > threshold && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <section 
      id="how-it-works" 
      ref={containerRef}
      className="relative py-32 overflow-hidden bg-black"
    >
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          style={{ opacity, scale }}
          className="text-center mb-20"
        >
          {/* Badge */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white uppercase tracking-wider mb-6"
          >
            How It Works
          </motion.p>
          
          {/* Main Title */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-white leading-[1.2]"
          >
            Simple & Direct
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed"
          >
            Zero friction. No middleman. Direct connections.
          </motion.p>
        </motion.div>

        {/* KNOTTY AI CONCIERGE SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto mb-32"
        >
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-zinc-950/90 to-black backdrop-blur-xl">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-indigo-500/5" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="relative z-10 p-10 md:p-16">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                
                {/* Left: Content */}
                <div>
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-sm font-medium text-violet-300 mb-6">
                    <MessageSquare className="w-4 h-4" />
                    <span>AI Chat Box</span>
                  </div>

                  {/* Headline */}
                  <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-[1.2]">
                    Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-white">Knotty</span>
                  </h3>

                  {/* Tagline */}
                  <p className="text-xl text-violet-200 mb-4 font-medium leading-relaxed">
                    Connect instantly with Knotty – your private chat companion for exploring wellness and connections.
                  </p>

                  {/* Description */}
                  <p className="text-base text-zinc-300 mb-8 leading-relaxed">
                    Knotty Chat Box lets you communicate directly, safely, and anonymously with massage therapists and wellness experts. Designed for seamless interaction, it combines privacy, speed, and convenience in a single interface.
                  </p>

                  {/* Benefits */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 shrink-0">
                        <Shield className="w-4 h-4 text-violet-300" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Privacy First</h4>
                        <p className="text-sm text-zinc-400 leading-relaxed">Your conversations are encrypted and confidential. Browse and connect safely.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 shrink-0">
                        <Sparkles className="w-4 h-4 text-violet-300" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Smart AI Prompts</h4>
                        <p className="text-sm text-zinc-400 leading-relaxed">AI suggests topics and responses for smoother conversations and better matching.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-violet-300" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Multi-Platform Access</h4>
                        <p className="text-sm text-zinc-400 leading-relaxed">Connect from anywhere, anytime on mobile or desktop with intuitive design.</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <button className="group h-14 px-8 bg-white text-black font-semibold hover:bg-zinc-100 transition-all duration-300 flex items-center gap-3 shadow-[0_0_30px_rgba(139,92,246,0.15)] hover:shadow-[0_0_40px_rgba(139,92,246,0.25)]">
                    Start chatting with Knotty
                    <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>
                  <p className="text-xs text-zinc-500 mt-3 leading-relaxed">Your direct line to wellness experts is just a click away</p>
                </div>

                {/* Right: Visual Card */}
                <div className="relative">
                  {/* Main Chat Box Card */}
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-zinc-900/80 to-black backdrop-blur-xl p-8">
                    {/* Glow Effect */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/20 rounded-full blur-[100px] pointer-events-none" />
                    
                    {/* Icon */}
                    <div className="relative mb-6 inline-flex p-4 rounded-2xl bg-violet-500/10 border border-violet-500/20">
                      <MessageSquare className="w-10 h-10 text-violet-300" />
                    </div>

                    {/* Features */}
                    <div className="relative space-y-6">
                      <div>
                        <p className="text-sm text-zinc-500 font-medium mb-3">Key Features</p>
                        <div className="flex flex-wrap gap-2">
                          {['Encrypted Chat', 'AI Suggestions', 'Anonymous', 'Real-time'].map((item) => (
                            <span key={item} className="px-3 py-1.5 rounded-full text-xs font-medium border border-violet-500/20 bg-violet-500/5 text-violet-200">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-white/5">
                        <div className="flex items-center gap-3 mb-3">
                          <Lock className="w-5 h-5 text-zinc-400" />
                          <p className="text-white font-semibold">100% Secure & Private</p>
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                          All conversations are end-to-end encrypted. Your privacy is our top priority.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Floating Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="absolute -bottom-4 -left-4 bg-black border border-violet-500/30 rounded-2xl px-6 py-4 shadow-2xl"
                  >
                    <p className="text-xs text-zinc-500 mb-1">Active Users</p>
                    <p className="text-3xl font-bold text-white">12k+<span className="text-lg text-violet-300"> online</span></p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative max-w-[1600px] mx-auto">
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            className="cursor-grab active:cursor-grabbing"
          >
            <motion.div
              animate={{ x: -currentSlide * 100 + '%' }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                mass: 0.8
              }}
              className="flex"
            >
              {slides.map((slideData) => (
                <div key={slideData.id} className="min-w-full px-4">
                  {/* Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative rounded-3xl bg-zinc-950 border border-zinc-900 overflow-hidden"
                  >
                    <div className="grid lg:grid-cols-2 min-h-[700px]">
                      {/* Left: Visual */}
                      <div className="relative bg-zinc-900 flex items-center justify-center p-12 lg:p-16">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-transparent to-violet-950/20" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
                        
                        <div className="relative z-10">
                          {slideData.mockupType === 'phone' && <FindTherapistVideoMockup />}
                          {slideData.mockupType === 'dashboard' && <DashboardMockup />}
                          {slideData.mockupType === 'chat' && <KnottyVideoMockup />}
                        </div>
                      </div>

                      {/* Right: Content */}
                      <div className="p-10 lg:p-16 flex flex-col justify-center">
                        {/* Category Badge */}
                        <motion.span
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                          className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white uppercase tracking-wider mb-6 w-fit"
                        >
                          {slideData.category}
                        </motion.span>

                        {/* Title */}
                        <motion.h3
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                          className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-[1.2]"
                        >
                          {slideData.title}
                        </motion.h3>

                        {/* Subtitle */}
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.5 }}
                          className="text-lg text-zinc-300 mb-6 leading-relaxed"
                        >
                          {slideData.subtitle}
                        </motion.p>

                        {/* Description */}
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.6 }}
                          className="text-base text-zinc-400 mb-10 leading-relaxed"
                        >
                          {slideData.description}
                        </motion.p>

                        {/* Impact Metrics */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.7 }}
                          className="grid grid-cols-2 gap-4 mb-10"
                        >
                          {slideData.impact.map((item, i) => (
                            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                              <p className="text-3xl font-bold text-white mb-1">{item.metric}</p>
                              <p className="text-sm text-zinc-500">{item.label}</p>
                            </div>
                          ))}
                        </motion.div>

                        {/* Steps */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.8 }}
                          className="space-y-5"
                        >
                          {slideData.steps.map((step, i) => (
                            <div key={i} className="flex gap-4">
                              <span className="text-4xl font-bold text-white/10 leading-none">{step.number}</span>
                              <div className="flex-1">
                                <h4 className="text-white font-semibold mb-1">{step.title}</h4>
                                <p className="text-sm text-zinc-400 leading-relaxed">{step.description}</p>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            <div className="flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/30'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
              disabled={currentSlide === slides.length - 1}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};





