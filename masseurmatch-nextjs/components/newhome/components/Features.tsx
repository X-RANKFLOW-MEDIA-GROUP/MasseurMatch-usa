"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { Star, ShieldCheck, MapPin, Clock, Award, Shield, Lock, Users } from 'lucide-react';
import { cn } from '../utils/cn';

// Mock Data for Therapists
const therapists = [
  {
    id: 1,
    name: "Carlos Rodriguez",
    title: "Licensed Sports Therapist",
    rating: 5.0,
    reviews: 142,
    location: "Downtown District",
    experience: "8 years",
    specialties: ["Deep Tissue", "Sports Recovery", "Myofascial Release"],
    bio: "Specializing in injury recovery and performance optimization for elite athletes. Former team therapist for Olympic track & field.",
    imageUrl: "https://images.unsplash.com/photo-1649751361457-01d3a696c7e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwbWFzc2FnZSUyMHRoZXJhcGlzdCUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NjE4OTk5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    gradient: "from-violet-500/10 to-black",
    accent: "text-violet-300"
  },
  {
    id: 2,
    name: "Marcus Rivera",
    title: "Neuromuscular Specialist",
    rating: 4.9,
    location: "Westside Studio",
    experience: "12 years",
    specialties: ["Deep Tissue", "Shiatsu", "Chronic Pain"],
    bio: "Focused on solving chronic pain patterns through precise neuromuscular therapy. Certified in advanced structural integration.",
    imageUrl: "https://images.unsplash.com/photo-1527629300531-2e61183c1438?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYWxlJTIwdGhlcmFwaXN0JTIwY2xpbmljfGVufDF8fHx8MTc2NjE4OTk5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    gradient: "from-violet-500/10 to-black",
    accent: "text-violet-300"
  },
  {
    id: 3,
    name: "Lucas Montgomery",
    title: "Holistic Wellness Practitioner",
    rating: 5.0,
    reviews: 215,
    location: "Mobile / In-Home",
    experience: "15 years",
    specialties: ["Swedish", "Aromatherapy", "Deep Relaxation"],
    bio: "Bringing the spa experience to your home. Dedicated to holistic stress relief and relaxation for busy professionals.",
    imageUrl: "https://images.unsplash.com/photo-1649751361457-01d3a696c7e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwd2VsbG5lc3MlMjB0aGVyYXBpc3QlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY2MTgxNjQ0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    gradient: "from-violet-500/10 to-black",
    accent: "text-violet-300"
  },
];

const MasseurCard = ({
  data,
  index,
  progress,
  range,
  targetScale
}: {
  data: typeof therapists[0];
  index: number;
  progress: MotionValue<number>;
  range: number[];
  targetScale: number;
}) => {
  const scale = useTransform(progress, range, [1, targetScale]);
  
  return (
    <div className="h-screen flex items-center justify-center sticky top-0 px-4 relative">
      <motion.div 
        style={{ 
          scale,
          top: `calc(10vh + ${index * 35}px)`
        }} 
        className="relative flex flex-col md:flex-row w-full max-w-5xl h-[600px] rounded-[32px] overflow-hidden bg-[#0c0c11] border border-white/10 shadow-2xl origin-top"
      >
        {/* Gradient Overlay - Silver/Chrome Aesthetic */}
        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-10 pointer-events-none", data.gradient)} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
        
        {/* Left Side: Image */}
        <div className="md:w-5/12 h-64 md:h-full relative overflow-hidden group">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
            <img 
              src={data.imageUrl} 
              alt={data.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Overlay Info on Image */}
            <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs font-medium text-white flex items-center gap-1 shadow-lg">
                    <ShieldCheck className="w-3 h-3 text-violet-300" /> Verified
                </div>
            </div>
        </div>

        {/* Right Side: Content */}
        <div className="md:w-7/12 p-8 md:p-12 flex flex-col relative z-20">
            {/* Glossy Header Effect */}
            <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                 <div className="w-32 h-32 bg-white rounded-full blur-[80px]" />
            </div>

            {/* Header */}
            <div className="flex justify-between items-start mb-8 relative">
                <div>
                    <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">{data.name}</h3>
                    <p className={cn("text-lg font-medium flex items-center gap-2", data.accent)}>
                        {data.title}
                    </p>
                </div>
                <div className="flex flex-col items-end bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                    <div className="flex items-center gap-1 text-white">
                        <Star className="w-4 h-4 fill-white text-white" />
                        <span className="text-lg font-bold">{data.rating}</span>
                    </div>
                    <span className="text-xs text-zinc-500">{data.reviews} reviews</span>
                </div>
            </div>

            {/* Stats Grid - Metallic Pills */}
            <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                    <MapPin className="w-4 h-4 text-zinc-400" />
                    <div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Location</p>
                        <p className="text-sm text-zinc-200 font-medium">{data.location}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                    <Clock className="w-4 h-4 text-zinc-400" />
                    <div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Experience</p>
                        <p className="text-sm text-zinc-200 font-medium">{data.experience}</p>
                    </div>
                </div>
            </div>

            {/* Bio */}
            <div className="mb-6">
                <p className="text-zinc-400 leading-relaxed text-sm md:text-base font-light">
                    {data.bio}
                </p>
            </div>

            {/* Trust Badges - NEW */}
            <div className="flex flex-wrap gap-2 mb-6">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-xs font-medium text-violet-300">
                    <Shield className="w-3 h-3" />
                    <span>Identity Verified</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-zinc-500/20 bg-zinc-500/5 text-xs font-medium text-zinc-300">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Direct Contact</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-zinc-500/20 bg-zinc-500/5 text-xs font-medium text-zinc-300">
                    <Lock className="w-3 h-3" />
                    <span>Privacy Protected</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-zinc-500/20 bg-zinc-500/5 text-xs font-medium text-zinc-300">
                    <Users className="w-3 h-3" />
                    <span>Inclusive Community</span>
                </div>
            </div>

            {/* Specialties */}
            <div className="flex flex-wrap gap-2 mb-auto">
                {data.specialties.map((tech) => (
                    <span key={tech} className="px-3 py-1 rounded-full text-xs font-medium border border-white/10 bg-white/5 text-zinc-300">
                        {tech}
                    </span>
                ))}
            </div>

            {/* Action */}
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between gap-4">
                <div className="text-sm flex flex-col gap-2">
                    {/* VISITING NOW Badge - Only for Lucas Montgomery (id: 3) */}
                    {data.id === 3 && (
                        <div className="flex items-center gap-1.5 mb-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                            <span className="text-indigo-400 font-bold text-xs uppercase tracking-wider">
                                VISITING NOW
                            </span>
                        </div>
                    )}
                    <span className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Availability</span>
                    <span className="text-violet-300 font-medium flex items-center gap-1.5 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                        Today, 4:00 PM
                    </span>
                </div>
                <button className="h-12 px-8 bg-white text-black font-semibold hover:bg-zinc-100 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.25)]">
                    View Profile
                </button>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export function Features() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  });

  return (
    <section ref={container} id="therapists" className="relative bg-black pt-20">
      
      {/* Section Header */}
      <div className="sticky top-0 z-0 px-4 h-[25vh] flex flex-col items-center justify-center text-center">
      </div>

      <div className="max-w-6xl mx-auto pb-[20vh] relative z-10 -mt-[10vh]">
        {therapists.map((therapist, i) => {
          const targetScale = 1 - ((therapists.length - i) * 0.05);
          return (
            <MasseurCard 
              key={therapist.id} 
              index={i} 
              data={therapist} 
              progress={scrollYProgress}
              range={[i * 0.25, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </div>
    </section>
  );
}

