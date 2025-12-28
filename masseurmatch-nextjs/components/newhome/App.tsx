"use client";

import React, { useEffect } from 'react';
import { Background } from './components/Background';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Marquee } from './components/Marquee';
import { StatsSection } from './components/StatsSection';
import { HowItWorks } from './components/HowItWorks';
import { MassageTypes } from './components/MassageTypes';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { KnottyChat } from './components/KnottyChat';
import { CustomCursor } from './components/CustomCursor';

function App() {
  // Smooth scroll behavior for anchor links
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <>
      <div className="min-h-screen bg-black font-sans text-white selection:bg-violet-500/30 selection:text-white relative">
        {/* Global Noise Overlay */}
        <div className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.03] mix-blend-overlay">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <filter id="noiseFilter">
              <feTurbulence 
                type="fractalNoise" 
                baseFrequency="0.65" 
                numOctaves="3" 
                stitchTiles="stitch" 
              />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>
        </div>

        <Background />
        <div className="relative z-0">
          <Hero />
          <Marquee />
          <StatsSection />
          <Features />
          <HowItWorks />
          <MassageTypes />
          <Testimonials />
          <FAQ />
          <CTASection />
        </div>
        <Footer />
        <ScrollToTop />
        <KnottyChat />
        <CustomCursor />
      </div>
    </>
  );
}

export default App;
