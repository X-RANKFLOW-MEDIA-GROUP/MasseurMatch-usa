"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, MapPin, Sparkles } from 'lucide-react';

const testimonials = [
  {
    name: 'Antonio Martinez',
    location: 'Miami, FL',
    rating: 5,
    text: 'Finally found a therapist who knows exactly where all my tension builds up. The search filters on MasseurMatch made it so easy to find someone who specializes in deep pressure. Worth every minute!',
    gradient: 'from-indigo-500/10 to-violet-500/10',
    highlight: 'Deep Pressure Expert'
  },
  {
    name: 'David Chen',
    location: 'Los Angeles, CA',
    rating: 5,
    text: 'My back was so tight I could barely move. MasseurMatch connected me with someone who worked out every single knot. I didn\'t know I could feel this loose and relaxed!',
    gradient: 'from-violet-500/10 to-indigo-500/10',
    highlight: 'Tension Relief'
  },
  {
    name: 'Thomas Johnson',
    location: 'New York, NY',
    rating: 5,
    text: 'I was skeptical at first, but WOW. The platform helped me find a therapist who really knows how to work out those stubborn knots. I left feeling like jelly in the best way possible.',
    gradient: 'from-violet-500/10 to-zinc-500/10',
    highlight: 'Knot Specialist'
  },
  {
    name: 'Michael Roberts',
    location: 'Chicago, IL',
    rating: 5,
    text: 'Travel a lot for work and always end up stiff and knotted up. MasseurMatch makes it easy to find legit therapists in any city who can handle serious tension. Game changer.',
    gradient: 'from-indigo-500/10 to-violet-500/10',
    highlight: 'Business Traveler'
  },
  {
    name: 'Daniel Wilson',
    location: 'Austin, TX',
    rating: 5,
    text: 'The reviews on MasseurMatch are honest and detailed. Found a therapist who gets into those hard-to-reach spots and melts away stress. Seriously, I\'m addicted to these sessions now.',
    gradient: 'from-violet-500/10 to-zinc-500/10',
    highlight: 'Regular Client'
  },
  {
    name: 'James Park',
    location: 'Seattle, WA',
    rating: 5,
    text: 'Been dealing with chronic shoulder knots for years. Found a specialist through MasseurMatch who uses techniques I\'ve never experienced before. Finally getting the release I needed!',
    gradient: 'from-violet-500/10 to-indigo-500/10',
    highlight: 'Chronic Pain Relief'
  }
];

export function Testimonials() {
  return (
    <section id="testimonials" className="relative py-32 px-4 bg-zinc-950 border-t border-white/5 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white uppercase tracking-wider mb-6"
          >
            Testimonials
          </motion.span>
          
          {/* Main Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-[1.2]"
          >
            Real Stories, Real Results
          </motion.h2>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed"
          >
            See what our community has to say about their wellness journey
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.7, 
                delay: index * 0.1,
                ease: [0.25, 0.4, 0.25, 1]
              }}
              className="relative group"
            >
              <div className="relative h-full bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/[0.04] hover:border-indigo-500/30 transition-all duration-300">
                {/* Gradient glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-50 transition-opacity duration-500 rounded-2xl -z-10 blur-xl`} />
                
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-violet-400 text-violet-400" />
                  ))}
                </div>

                {/* Testimonial text */}
                <p className="text-zinc-300 leading-relaxed mb-6 text-sm md:text-base">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-white/10 gap-3">
                  <div>
                    <div className="font-semibold text-white mb-1 text-base">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-zinc-500 flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      {testimonial.location}
                    </div>
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                    <span className="text-xs font-medium text-indigo-400 whitespace-nowrap">{testimonial.highlight}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
