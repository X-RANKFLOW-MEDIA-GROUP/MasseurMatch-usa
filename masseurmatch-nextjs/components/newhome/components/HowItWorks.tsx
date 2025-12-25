"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, PanInfo } from 'framer-motion';
import { 
  Search, 
  User, 
  Eye,
  Mail,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Star,
  Award,
  ArrowUpRight,
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
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center">
                <MessageSquare className="w-10 h-10 text-violet-400" />
              </div>
              <p className="text-zinc-400 text-sm font-medium mb-1">Knotty Chat Preview</p>
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

const slides = [
  {
    id: 'knotty',
    category: 'AI Chat Companion',
    title: 'Chat with Knotty',
    subtitle: 'Your AI assistant for finding therapists',
    description: 'Knotty is your AI-powered assistant that helps you find therapists, compare services, and get answers 24/7. Get instant recommendations, pricing info, and connect with the right professionalâ€”all through direct conversation.',
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
    description: 'Search verified massage therapists by specialty, location, and ratings. View detailed profiles with reviews and credentials. Contact them directlyâ€”no middleman, no hassle.',
    impact: [
      { metric: '100%', label: 'Direct Contact' },
      { metric: '2,500+', label: 'Therapists' },
      { metric: '4.9', label: 'Avg Rating' },
      { metric: '50+', label: 'Cities' }
    ],
    steps: [
      { number: '01', title: 'Browse & Search', description: 'Filter by specialty, location, ratings & availability' },
      { number: '02', title: 'View Profiles', description: 'Read reviews, credentials & therapist background' },
      { number: '03', title: 'Contact Directly', description: 'Get contact info and reach outâ€”simple and direct' }
    ],
    mockupType: 'phone'
  },
  {
    id: 'therapists',
    category: 'For Therapists',
    title: 'Grow your practice',
    subtitle: 'Create profile, get visibility, receive contacts',
    description: 'Join MasseurMatch to increase your visibility and connect with clients. Create your profile, appear in search results, and receive direct contactâ€”100% of your earnings stay with you.',
    impact: [
      { metric: '100%', label: 'Your Earnings' },
      { metric: '10k+', label: 'Monthly Views' },
      { metric: '3x', label: 'More Clients' },
      { metric: 'Free', label: 'To Join' }
    ],
    steps: [
      { number: '01', title: 'Create Profile', description: 'Add specialties, credentials, photos & availability' },
      { number: '02', title: 'Get Discovered', description: 'Appear in search results for clients in your area' },
      { number: '03', title: 'Receive Contacts', description: 'Clients reach you directlyâ€”manage your schedule your way' }
    ],
    mockupType: 'dashboard'
  }
];

// Phone Mockup Component (For Clients)
const PhoneMockup = () => {
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSearchFocused(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: 15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      className="relative"
      style={{ perspective: '1200px' }}
    >
      {/* Phone Frame */}
      <div className="relative w-[320px] mx-auto">
        {/* Phone Shell */}
        <div className="relative bg-black rounded-[50px] p-4 border-[12px] border-zinc-900 shadow-2xl">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl z-20" />
          
          {/* Screen */}
          <div className="relative bg-white rounded-[38px] overflow-hidden h-[640px]">
            {/* Status Bar */}
            <div className="px-6 py-3 flex justify-between items-center text-xs bg-white">
              <span className="font-semibold text-black">9:41</span>
              <div className="flex gap-1 items-center">
                <div className="w-4 h-3 border border-black rounded-sm" />
                <div className="w-3 h-3 border border-black rounded-full" />
                <div className="w-5 h-3 bg-black rounded-sm" />
              </div>
            </div>

            {/* App Content */}
            <div className="bg-zinc-50 h-full p-5 overflow-hidden">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mb-5"
              >
                <h1 className="text-2xl font-bold text-black mb-1">Find a Therapist</h1>
                <p className="text-sm text-zinc-600">Search by specialty or location</p>
              </motion.div>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  boxShadow: searchFocused ? '0 10px 40px rgba(99, 102, 241, 0.2)' : '0 2px 10px rgba(0,0,0,0.1)'
                }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="relative mb-5 bg-white rounded-2xl p-4 border-2 border-indigo-500/30 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-indigo-600" />
                  <div className="flex-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: searchFocused ? '100%' : 0 }}
                      transition={{ delay: 0.8, duration: 0.6 }}
                      className="h-0.5 bg-indigo-600 mb-1"
                    />
                    <input
                      type="text"
                      placeholder="Deep Tissue, Sports..."
                      className="w-full bg-transparent text-sm text-black placeholder:text-zinc-400 focus:outline-none"
                      disabled
                    />
                  </div>
                </div>
              </motion.div>

              {/* Therapist Cards */}
              <div className="space-y-3">
                {[
                  { name: 'Marcus Rivera', specialty: 'Deep Tissue', rating: '4.9', reviews: '142' },
                  { name: 'Lucas Montgomery', specialty: 'Swedish', rating: '5.0', reviews: '215' }
                ].map((therapist, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + i * 0.15, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-black mb-0.5 truncate">{therapist.name}</h3>
                        <p className="text-xs text-zinc-600 mb-2">{therapist.specialty}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-violet-400 text-violet-400" />
                            ))}
                          </div>
                          <span className="text-xs text-zinc-600">{therapist.rating} ({therapist.reviews})</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/30 via-transparent to-transparent rounded-[50px] blur-2xl -z-10" />
      </div>
    </motion.div>
  );
};

// Dashboard Mockup Component (For Therapists)
const DashboardMockup = () => {
  const stats = [
    { label: 'Profile Views', value: '1,247', change: '+12%', icon: Eye },
    { label: 'Contact Requests', value: '89', change: '+45%', icon: Mail },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: -10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      className="relative"
      style={{ perspective: '1200px' }}
    >
      {/* Dashboard Container */}
      <div className="relative bg-zinc-950 rounded-3xl border border-zinc-800 p-8 shadow-2xl max-w-lg mx-auto overflow-hidden">
        {/* Gradient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Header */}
        <div className="relative z-10 mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center justify-between mb-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Dashboard</h2>
              <p className="text-sm text-zinc-500">Your practice at a glance</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div className="grid grid-cols-2 gap-4 mb-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 transition-all"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs text-zinc-500 uppercase tracking-wider">{stat.label}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white">{stat.value}</span>
                    <span className="text-sm font-medium text-white">{stat.change}</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Specialties */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mb-8"
          >
            <p className="text-xs text-zinc-600 uppercase tracking-wider mb-3 font-semibold">Specialties</p>
            <div className="flex flex-wrap gap-2">
              {['Deep Tissue', 'Sports Recovery', 'Myofascial'].map((spec, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + i * 0.05, duration: 0.3 }}
                  className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs font-medium text-white"
                >
                  {spec}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Rating */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="mt-auto p-5 rounded-2xl bg-white/5 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wider">Average Rating</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-white">5.0</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-white text-white" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-500 mb-1">From</p>
                <p className="text-xl font-bold text-white">247 reviews</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Labels */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.3, type: "spring" }}
        className="absolute -top-6 -right-6 px-4 py-2 rounded-xl bg-white border border-zinc-200 shadow-lg"
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-black" />
          <span className="text-sm font-semibold text-black">Growing</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.5, type: "spring" }}
        className="absolute -bottom-6 -left-6 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 shadow-lg"
      >
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-white" />
          <span className="text-sm font-semibold text-white">0% Fees</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Chat Mockup Component (For Knotty)
const ChatMockup = () => {
  const messages = [
    { sender: 'knotty', text: 'Hello! How can I assist you today with your wellness needs?' },
    { sender: 'user', text: 'I\'m looking for a deep tissue massage therapist in New York.' },
    { sender: 'knotty', text: 'Sure! I can help with that. Let me find the best match for you.' },
    { sender: 'knotty', text: 'Marcus Rivera is a highly rated deep tissue therapist in New York. Would you like his contact?' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: 15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      className="relative"
      style={{ perspective: '1200px' }}
    >
      {/* Chat Frame */}
      <div className="relative w-[320px] mx-auto">
        {/* Chat Shell */}
        <div className="relative bg-black rounded-[50px] p-4 border-[12px] border-zinc-900 shadow-2xl">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl z-20" />
          
          {/* Screen */}
          <div className="relative bg-white rounded-[38px] overflow-hidden h-[640px]">
            {/* Status Bar */}
            <div className="px-6 py-3 flex justify-between items-center text-xs bg-white">
              <span className="font-semibold text-black">9:41</span>
              <div className="flex gap-1 items-center">
                <div className="w-4 h-3 border border-black rounded-sm" />
                <div className="w-3 h-3 border border-black rounded-full" />
                <div className="w-5 h-3 bg-black rounded-sm" />
              </div>
            </div>

            {/* App Content */}
            <div className="bg-zinc-50 h-full flex flex-col">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="p-5 pb-3 border-b border-zinc-200"
              >
                <h1 className="text-xl font-bold text-black mb-0.5">Knotty</h1>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-violet-400" />
                  <p className="text-xs text-zinc-600">Online now</p>
                </div>
              </motion.div>

              {/* Chat Messages */}
              <div className="flex-1 p-5 space-y-3 overflow-y-auto">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.15, duration: 0.5 }}
                    className={`flex ${msg.sender === 'knotty' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`${
                        msg.sender === 'knotty' 
                          ? 'bg-violet-500 text-white' 
                          : 'bg-white text-black border border-zinc-200'
                      } rounded-2xl px-4 py-3 max-w-[75%] shadow-sm`}
                    >
                      <p className="text-xs leading-relaxed">
                        {msg.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Input Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="p-4 border-t border-zinc-200 bg-white"
              >
                <div className="flex items-center gap-2 bg-zinc-100 rounded-full px-4 py-3">
                  <MessageSquare className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-sm text-black placeholder:text-zinc-400 focus:outline-none"
                    disabled
                  />
                  <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center flex-shrink-0">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-violet-600/30 via-transparent to-transparent rounded-[50px] blur-2xl -z-10" />
      </div>
    </motion.div>
  );
};

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

  const slide = slides[currentSlide];

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
                    Connect instantly with Knotty â€“ your private chat companion for exploring wellness and connections.
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


