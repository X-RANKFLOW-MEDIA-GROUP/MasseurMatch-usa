"use client";

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const { scrollY } = useScroll();
  const lastYRef = useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    const diff = y - lastYRef.current;
    if (Math.abs(diff) > 50) {
      setHidden(diff > 0 && y > 100); // Hide on scroll down, show on up. Only hide after 100px
      lastYRef.current = y;
    }
  });

  const links = [
    { name: 'Find Therapist', href: '/explore' },
    { name: 'For Masseurs', href: '/join' },
    { name: 'About Us', href: '/about' },
  ];

  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: -100, opacity: 0 },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
      >
        <div className="pointer-events-auto bg-[#0a0a0f]/60 backdrop-blur-md border border-white/10 rounded-full pl-6 pr-2 py-2 flex items-center justify-between gap-12 shadow-2xl shadow-black/20 ring-1 ring-white/5 relative overflow-hidden">
            {/* Glossy sheen overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            {/* Logo */}
            <motion.a 
              href="#top" 
              className="flex items-center gap-2 relative z-10 group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
                <motion.div 
                  className="w-8 h-8 bg-gradient-to-br from-white to-gray-400 rounded-full flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                    <span className="text-black font-bold text-sm tracking-tighter">MM</span>
                </motion.div>
                <motion.span 
                  className="text-sm font-semibold tracking-wide text-white/90 hidden sm:block group-hover:text-white transition-colors"
                  whileHover={{ letterSpacing: "0.05em" }}
                >
                  MasseurMatch
                </motion.span>
            </motion.a>

            {/* Desktop Links - Framer Style Hover */}
            <div className="hidden md:flex items-center gap-1 relative z-10">
                {links.map((link, index) => (
                <motion.a
                    key={link.name}
                    href={link.href}
                    onMouseEnter={() => setActiveTab(link.name)}
                    onMouseLeave={() => setActiveTab('')}
                    className="relative px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                >
                    {activeTab === link.name && (
                    <motion.div
                        layoutId="nav-hover"
                        className="absolute inset-0 bg-white/10 rounded-full -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                    )}
                    {link.name}
                </motion.a>
                ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 relative z-10">
                <motion.a
                  href="/login?redirect=/dashboard"
                  className="hidden sm:flex h-10 px-6 items-center justify-center bg-white text-black text-sm font-semibold hover:bg-zinc-100 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,255,255,0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                    Login
                </motion.a>
                
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/5"
                >
                    {isOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
            </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-24 left-4 right-4 z-40 bg-[#0F0F16] border border-white/10 rounded-3xl p-2 shadow-2xl origin-top"
          >
            <div className="flex flex-col gap-1 p-2">
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-4 rounded-2xl text-base font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-between group"
                >
                  {link.name}
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
              <div className="h-px bg-white/5 my-2" />
              <a href="/login?redirect=/dashboard" className="w-full py-4 rounded-2xl bg-white text-black text-base font-bold hover:bg-gray-200 transition-colors text-center">
                Login
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
