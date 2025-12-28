"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Heart, Zap, Flame, Droplet, Wind } from 'lucide-react';

const massageTypes = [
  {
    id: 'deep-tissue',
    name: 'Deep Tissue Massage',
    description: 'Chronic pain relief through targeted pressure on muscle layers',
    icon: Activity,
    benefits: ['Pain Relief', 'Muscle Recovery', 'Posture Improvement'],
    slug: 'deep-tissue-massage'
  },
  {
    id: 'swedish',
    name: 'Swedish Massage',
    description: 'Relaxation & stress relief with gentle, flowing strokes',
    icon: Heart,
    benefits: ['Relaxation', 'Stress Relief', 'Better Sleep'],
    slug: 'swedish-massage'
  },
  {
    id: 'sports',
    name: 'Sports Massage',
    description: 'Athletic performance enhancement and injury prevention',
    icon: Zap,
    benefits: ['Performance', 'Injury Prevention', 'Recovery'],
    slug: 'sports-massage'
  },
  {
    id: 'thai',
    name: 'Thai Massage',
    description: 'Energy balance & flexibility through assisted stretching',
    icon: Wind,
    benefits: ['Flexibility', 'Energy Balance', 'Joint Mobility'],
    slug: 'thai-massage'
  },
  {
    id: 'hot-stone',
    name: 'Hot Stone Massage',
    description: 'Deep relaxation with heated stones and gentle pressure',
    icon: Flame,
    benefits: ['Deep Relaxation', 'Circulation', 'Tension Relief'],
    slug: 'hot-stone-massage'
  },
  {
    id: 'aromatherapy',
    name: 'Aromatherapy Massage',
    description: 'Holistic healing combining essential oils with massage',
    icon: Droplet,
    benefits: ['Holistic Healing', 'Mood Enhancement', 'Aromatherapy'],
    slug: 'aromatherapy-massage'
  }
];

export function MassageTypes() {
  // JSON-LD Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Massage Types Offered by MasseurMatch",
    "description": "Professional massage therapy services including Deep Tissue, Swedish, Sports, Thai, Hot Stone, and Aromatherapy",
    "itemListElement": massageTypes.map((type, index) => ({
      "@type": "Service",
      "position": index + 1,
      "name": type.name,
      "description": type.description,
      "url": `https://masseurmatch.com/massage-types/${type.slug}`,
      "serviceType": type.name,
      "provider": {
        "@type": "Organization",
        "name": "MasseurMatch"
      }
    }))
  };

  return (
    <section 
      id="treatments" 
      className="relative py-24 md:py-32 px-6 bg-[#050505] overflow-hidden"
      itemScope 
      itemType="https://schema.org/ItemList"
    >
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Background Aurora Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            x: [-200, 200, -200],
            y: [-100, 100, -100],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[20%] w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            x: [200, -200, 200],
            y: [100, -100, 100],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[20%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[100px]" 
        />
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white uppercase tracking-wider mb-6"
          >
            Massage Modalities
          </motion.span>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-[1.2]"
          >
            Explore Techniques
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed"
          >
            Find the perfect style for your wellness journey
          </motion.p>
        </motion.div>

        {/* Massage Type Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {massageTypes.map((type, index) => {
            const Icon = type.icon;
            
            return (
              <motion.article
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.08,
                  ease: [0.25, 0.4, 0.25, 1]
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
                itemScope
                itemType="https://schema.org/Service"
                itemProp="itemListElement"
              >
                {/* Hover Gradient Background */}
                <div className="absolute -inset-0.5 bg-gradient-to-br from-white/0 via-white/0 to-white/0 group-hover:from-white/10 group-hover:via-white/5 group-hover:to-white/10 rounded-2xl blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
                
                {/* Card */}
                <div className="relative h-full bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/5 hover:border-white/30 transition-all duration-500">
                  
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all duration-500">
                      <Icon className="w-7 h-7 text-white transition-colors duration-500" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 
                    className="text-xl font-bold text-white mb-3 transition-all duration-500"
                    itemProp="name"
                  >
                    {type.name}
                  </h3>

                  {/* Description */}
                  <p 
                    className="text-zinc-400 text-sm leading-relaxed mb-6 font-light"
                    itemProp="description"
                  >
                    {type.description}
                  </p>

                  {/* Benefits Pills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {type.benefits.map((benefit) => (
                      <span
                        key={benefit}
                        className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-500 text-xs font-medium group-hover:border-white/20 group-hover:bg-white/10 group-hover:text-zinc-300 transition-all duration-500"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>

                  {/* Learn More Link */}
                  <a
                    href="/explore"
                    className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white font-medium transition-colors duration-300 group/link"
                    itemProp="url"
                    aria-label={`Learn more about ${type.name}`}
                  >
                    <span>Learn More</span>
                    <svg 
                      className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>

                  {/* Hidden SEO metadata */}
                  <meta itemProp="serviceType" content={type.name} />
                  <meta itemProp="provider" content="MasseurMatch" />
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-zinc-400 mb-6 font-light">
            Not sure which massage type is right for you?
          </p>
          <button className="inline-flex items-center px-8 py-3 rounded-xl bg-black border border-white text-white font-medium hover:bg-white hover:text-black transition-all duration-300 group">
            <span>Take Our Quiz</span>
            <svg 
              className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
