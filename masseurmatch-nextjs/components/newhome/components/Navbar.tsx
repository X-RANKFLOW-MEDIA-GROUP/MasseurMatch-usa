"use client";

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, ChevronDown } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const [mobileAccordionOpen, setMobileAccordionOpen] = useState<string | null>(null);
  const { scrollY } = useScroll();
  const lastYRef = useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    const diff = y - lastYRef.current;
    if (Math.abs(diff) > 50) {
      setHidden(diff > 0 && y > 100); // Hide on scroll down, show on up. Only hide after 100px
      lastYRef.current = y;
    }
  });

  const navSections = [
    {
      name: 'Find Therapists',
      href: '/massage-therapists-by-city',
      dropdownTitle: 'Clients',
      dropdown: [
        { name: 'Browse by City', href: '/massage-therapists-by-city' },
        { name: 'Browse by Service', href: '/massage-services' },
        { name: 'Top Cities', href: '/top-massage-cities' },
        { name: 'Top Services', href: '/top-massage-services' },
      ],
    },
    {
      name: 'For Therapists',
      href: '/join-as-therapist',
      dropdownTitle: 'Professionals',
      dropdown: [
        { name: 'Join as a Therapist', href: '/join-as-therapist' },
        { name: 'How It Works', href: '/how-it-works-for-therapists' },
        { name: 'Professional Standards', href: '/legal/professional-standards' },
      ],
    },
    {
      name: 'How It Works',
      href: '/how-it-works',
      dropdownTitle: 'About (Institutional)',
      dropdown: [
        { name: 'About MasseurMatch', href: '/about' },
        { name: 'Trust & Safety', href: '/trust-safety' },
      ],
    },
    {
      name: 'Blog',
      href: '/blog',
    },
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
        <div className="pointer-events-auto bg-[#0a0a0f]/60 backdrop-blur-md border border-white/10 rounded-full pl-6 pr-2 py-2 flex items-center justify-between gap-12 shadow-2xl shadow-black/20 ring-1 ring-white/5 relative overflow-visible">
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
              {navSections.map((section, index) => (
                <div
                  key={section.name}
                  className="relative"
                  onMouseEnter={() => setActiveTab(section.name)}
                  onMouseLeave={() => setActiveTab('')}
                >
                  <motion.a
                    href={section.href}
                    className="group flex items-center gap-1.5 relative px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {section.name}
                    {section.dropdown && (
                      <ChevronDown size={12} className="text-gray-400 group-hover:text-white transition-colors" />
                    )}
                    {activeTab === section.name && (
                      <motion.span
                        layoutId="nav-hover"
                        className="absolute inset-0 bg-white/10 rounded-full -z-10"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.a>
                  {section.dropdown && (
                    <AnimatePresence>
                      {activeTab === section.name && (
                        <motion.div
                          key={`${section.name}-dropdown`}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.25 }}
                          className="pointer-events-auto absolute top-full mt-2 w-56 rounded-3xl border border-white/10 bg-[#0b0b11]/95 shadow-2xl shadow-black/40 py-2 flex flex-col gap-1 z-40"
                          onMouseEnter={() => setActiveTab(section.name)}
                        >
                          {section.dropdownTitle && (
                            <span className="px-4 pt-2 text-[10px] uppercase tracking-[0.3em] text-gray-500">
                              {section.dropdownTitle}
                            </span>
                          )}
                          {section.dropdown.map((item) => (
                            <a
                              key={item.name}
                              href={item.href}
                              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors rounded-2xl"
                            >
                              {item.name}
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 relative z-10">
              <motion.a
                href="/join"
                className="h-10 px-5 flex items-center justify-center rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white text-sm font-semibold shadow-[0_8px_30px_rgba(99,102,241,0.45)]"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Up
              </motion.a>
              <motion.a
                href="/login?redirect=/dashboard"
                className="hidden md:flex text-sm font-medium text-white/80 hover:text-white transition-colors"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
              >
                Log In
              </motion.a>
                <button
                    onClick={() =>
                      setIsOpen((prev) => {
                        if (prev) setMobileAccordionOpen(null);
                        return !prev;
                      })
                    }
                    className="md:hidden flex items-center gap-1 rounded-full border border-white/20 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                    <Menu size={16} />
                    <span className="text-white/80">Menu</span>
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
            {navSections.map((section) => (
              <div key={section.name} className="space-y-1">
                <div className="flex items-center justify-between gap-2 px-4 py-3 rounded-2xl bg-white/5 text-base font-semibold text-white">
                  <a
                    href={section.href}
                    onClick={() => setIsOpen(false)}
                    className="flex-1 text-left"
                  >
                    {section.name}
                  </a>
                  {section.dropdown && (
                    <button
                      type="button"
                      onClick={() =>
                        setMobileAccordionOpen((prev) =>
                          prev === section.name ? null : section.name
                        )
                      }
                      className={`text-white/70 transition-transform ${
                        mobileAccordionOpen === section.name ? 'rotate-180' : ''
                      }`}
                      aria-expanded={mobileAccordionOpen === section.name}
                      aria-controls={`${section.name}-submenu`}
                    >
                      <ChevronDown size={18} />
                    </button>
                  )}
                </div>
                {section.dropdown && mobileAccordionOpen === section.name && (
                  <div
                    id={`${section.name}-submenu`}
                    className="flex flex-col gap-1 pl-6"
                  >
                    {section.dropdownTitle && (
                      <span className="px-4 text-[11px] uppercase tracking-[0.2em] text-gray-500">
                        {section.dropdownTitle}
                      </span>
                    )}
                    {section.dropdown.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        onClick={() => {
                          setIsOpen(false);
                          setMobileAccordionOpen(null);
                        }}
                        className="px-4 py-2 rounded-2xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-2 space-y-2 px-2">
              <a
                href="/login?redirect=/dashboard"
                onClick={() => setIsOpen(false)}
                className="block w-full rounded-2xl border border-white/20 bg-white/5 text-center text-base font-semibold text-white/80 hover:text-white hover:border-white/40 transition-colors px-4 py-3"
              >
                Log In
              </a>
            </div>
            <div className="mt-4 border-t border-white/10 pt-3 text-sm text-white/70 space-y-1">
              <a
                href="/about"
                onClick={() => setIsOpen(false)}
                className="block hover:text-white"
              >
                About MasseurMatch
              </a>
              <a
                href="/trust-safety"
                onClick={() => setIsOpen(false)}
                className="block hover:text-white"
              >
                Trust & Safety
              </a>
              <a
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="block hover:text-white"
              >
                Contact
              </a>
            </div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
