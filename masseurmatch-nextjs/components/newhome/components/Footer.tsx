"use client";

import React from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { Twitter, Facebook, Linkedin, Instagram, ArrowRight } from 'lucide-react';

export function Footer() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  } satisfies Variants;

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15 
      } 
    },
  } satisfies Variants;

  return (
    <footer className="relative bg-black text-[#B0B0B0] pt-16 pb-10 overflow-hidden">
      {/* Very subtle dark purple tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-black to-black" />
      
      {/* Extremely subtle gradient overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-950/10 via-transparent to-transparent opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-950/10 via-transparent to-transparent opacity-30" />
      
      {/* Very subtle animated orbs - barely visible */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[150px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.05, 0.08, 0.05]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" 
      />

      <motion.div 
        ref={ref}
        variants={container}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
        className="max-w-[1200px] mx-auto px-5 relative z-10"
      >
        {/* Newsletter Section */}
        <motion.div 
          variants={item}
          className="mb-16 pb-12 border-b border-white/10"
        >
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Join our newsletter</h3>
            <p className="text-sm text-zinc-400 mb-6">Stay updated with the latest therapists, wellness tips, and exclusive offers.</p>
            
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <input 
                type="email" 
                placeholder="name@email.com"
                className="w-full sm:w-auto flex-1 max-w-xs px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 focus:bg-white/10 transition-all"
              />
              <button className="w-full sm:w-auto px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)]">
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12 mb-10">
          
          {/* Product */}
          <motion.div variants={item}>
            <h4 className="text-base font-bold text-white mb-3">Product</h4>
            <ul className="space-y-2.5">
              <li><a href="/about" className="text-[#B0B0B0] hover:text-violet-300 transition-colors text-sm">About MasseurMatch</a></li>
              <li><a href="#how-it-works" className="text-[#B0B0B0] hover:text-violet-300 transition-colors text-sm">How It Works</a></li>
              <li><a href="/join" className="text-[#B0B0B0] hover:text-violet-300 transition-colors text-sm">Join as a Therapist</a></li>
              <li><a href="/explore" className="text-[#B0B0B0] hover:text-violet-300 transition-colors text-sm">Explore Therapists</a></li>
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={item}>
            <h4 className="text-base font-bold text-white mb-3">Support</h4>
            <ul className="space-y-2.5">
              <li><a href="mailto:support@masseurmatch.com" className="text-[#B0B0B0] hover:text-violet-300 transition-colors text-sm">Support: support@masseurmatch.com</a></li>
              <li><a href="mailto:billing@masseurmatch.com" className="text-[#B0B0B0] hover:text-violet-300 transition-colors text-sm">Billing: billing@masseurmatch.com</a></li>
              <li><a href="mailto:legal@masseurmatch.com" className="text-[#B0B0B0] hover:text-violet-300 transition-colors text-sm">Legal: legal@masseurmatch.com</a></li>
            </ul>
          </motion.div>

          {/* Trust and Safety */}
          <motion.div variants={item}>
            <h4 className="text-base font-bold text-white mb-3">Trust & Safety</h4>
            <ul className="space-y-2.5">
              <li><a href="/trust" className="text-[#B0B0B0] hover:text-violet-300 transition-colors text-sm">Trust and Safety</a></li>
              <li><a href="/professional-standards" className="text-[#B0B0B0] hover:text-violet-300 transition-colors text-sm">Verification Scope</a></li>
              <li><a href="/privacy-policy" className="text-[#B0B0B0] hover:text-violet-300 transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="/terms" className="text-[#B0B0B0] hover:text-violet-300 transition-colors text-sm">Terms of Use</a></li>
            </ul>
          </motion.div>

          {/* Browse SEO */}
          <motion.div variants={item}>
            <h4 className="text-base font-bold text-white mb-3">Browse</h4>
            <ul className="space-y-2.5">
              <li><a href="#top-cities" className="text-[#B0B0B0] hover:text-violet-300 transition-colors text-sm">Top Cities</a></li>
              <li><a href="#treatments" className="text-[#B0B0B0] hover:text-violet-300 transition-colors text-sm">Top Services</a></li>
              <li><a href="#therapists" className="text-[#B0B0B0] hover:text-violet-300 transition-colors text-sm">Browse by Location</a></li>
              <li><a href="/sitemap.xml" className="text-[#B0B0B0] hover:text-violet-300 transition-colors text-sm">Sitemap</a></li>
            </ul>
          </motion.div>

          {/* Inclusion */}
          <motion.div variants={item} className="max-w-[250px]">
            <h4 className="text-base font-bold text-white mb-3">Inclusion</h4>
            <p className="text-xs text-[#B0B0B0] leading-relaxed">
              MasseurMatch is committed to creating an inclusive and welcoming platform for all users.
            </p>
          </motion.div>

          {/* Compare */}
          <motion.div variants={item}>
            <h4 className="text-base font-bold text-white mb-3">Compare</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-[#B0B0B0] hover:text-violet-300 transition-colors text-sm">MasseurFinder</a></li>
              <li><a href="#" className="text-[#B0B0B0] hover:text-violet-300 transition-colors text-sm">MasseurPro</a></li>
              <li><a href="#" className="text-[#B0B0B0] hover:text-violet-300 transition-colors text-sm">MasseurHub</a></li>
              <li><a href="#" className="text-[#B0B0B0] hover:text-violet-300 transition-colors text-sm">MassageDirectory</a></li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          variants={item}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs pt-5 mt-10 border-t border-[#333]"
        >
          {/* Legal */}
          <p className="text-[#B0B0B0] leading-relaxed max-w-2xl">
            Â© {new Date().getFullYear()} MasseurMatch. All rights reserved. Directory platform only. No bookings or payments are processed on this website.
          </p>

          {/* Social Links */}
          <div className="flex gap-4 text-sm">
            <a 
              href="https://www.instagram.com/masseurmatch" 
              className="text-[#B0B0B0] hover:text-violet-300 transition-colors"
              aria-label="Instagram"
            >
              Instagram
            </a>
            <a 
              href="https://www.facebook.com/masseurmatch" 
              className="text-[#B0B0B0] hover:text-violet-300 transition-colors"
              aria-label="Facebook"
            >
              Facebook
            </a>
            <a 
              href="https://www.linkedin.com/company/masseurmatch" 
              className="text-[#B0B0B0] hover:text-violet-300 transition-colors"
              aria-label="LinkedIn"
            >
              LinkedIn
            </a>
            <a 
              href="https://twitter.com/masseurmatch" 
              className="text-[#B0B0B0] hover:text-violet-300 transition-colors"
              aria-label="Twitter"
            >
              Twitter
            </a>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
