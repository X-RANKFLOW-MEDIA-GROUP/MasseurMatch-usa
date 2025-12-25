"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame
} from "framer-motion";

// Helper function to wrap a number between a min and max range
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

interface ParallaxProps {
  children: React.ReactNode;
  baseVelocity: number;
}

function ParallaxText({ children, baseVelocity = 100 }: ParallaxProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const [isHovered, setIsHovered] = React.useState(false);
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  
  useAnimationFrame((t, delta) => {
    // Slow down on hover
    const hoverMultiplier = isHovered ? 0.3 : 1;
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000) * hoverMultiplier;

    // Dynamic speed change based on scroll velocity
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div 
      className="parallax overflow-hidden m-0 whitespace-nowrap flex flex-nowrap"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div className="scroller font-bold uppercase text-6xl md:text-8xl flex whitespace-nowrap gap-12" style={{ x }}>
        {children}
        {children}
        {children}
        {children}
      </motion.div>
    </div>
  );
}

export function Marquee() {
  // City data with slugs for URLs
  const cities = {
    line1: [
      { name: "New York City", slug: "new-york-city" },
      { name: "San Francisco", slug: "san-francisco" },
      { name: "Los Angeles", slug: "los-angeles" },
      { name: "Chicago", slug: "chicago" },
      { name: "Miami Beach", slug: "miami-beach" },
      { name: "Washington DC", slug: "washington-dc" },
      { name: "Orlando", slug: "orlando" },
      { name: "San Diego", slug: "san-diego" },
      { name: "Boston", slug: "boston" },
      { name: "Palm Springs", slug: "palm-springs" }
    ],
    line2: [
      { name: "Fort Lauderdale", slug: "fort-lauderdale" },
      { name: "Dallas", slug: "dallas" },
      { name: "Houston", slug: "houston" },
      { name: "Atlanta", slug: "atlanta" },
      { name: "Seattle", slug: "seattle" },
      { name: "Portland", slug: "portland" },
      { name: "Las Vegas", slug: "las-vegas" },
      { name: "New Orleans", slug: "new-orleans" },
      { name: "Austin", slug: "austin" },
      { name: "Philadelphia", slug: "philadelphia" }
    ]
  };

  return (
    <div id="top-cities" className="py-20 bg-black border-y border-white/5 relative overflow-hidden z-20">
       {/* Left gradient fade */}
       <div className="absolute top-0 left-0 w-80 h-full bg-gradient-to-r from-black via-black to-transparent z-10 pointer-events-none" />
       {/* Right gradient fade */}
       <div className="absolute top-0 right-0 w-40 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
       
       {/* TOP CITIES Label - Fixed on left */}
       <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
         <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8, delay: 0.2 }}
         >
           <span className="text-6xl md:text-8xl font-bold tracking-[-0.05em] text-white/10 uppercase">
             Top Cities
           </span>
         </motion.div>
       </div>
      
      <div className="opacity-80 hover:opacity-100 transition-opacity duration-500">
        <ParallaxText baseVelocity={-2}>
          {cities.line1.map((city, index) => (
            <a
              key={`line1-${city.slug}`}
              href={`/city/${city.slug}`}
              className={`mr-12 transition-all duration-300 hover:scale-110 inline-block cursor-pointer ${
                index % 2 === 0 
                  ? 'text-white hover:text-zinc-300' 
                  : 'text-transparent text-stroke-1 text-stroke-white/30 hover:text-white hover:text-stroke-0'
              }`}
            >
              {city.name}
            </a>
          ))}
        </ParallaxText>
        
        <div className="h-4" /> {/* Spacer */}
        
        <ParallaxText baseVelocity={2}>
          {cities.line2.map((city, index) => (
            <a
              key={`line2-${city.slug}`}
              href={`/city/${city.slug}`}
              className={`mr-12 transition-all duration-300 hover:scale-110 inline-block cursor-pointer ${
                index % 2 === 0 
                  ? 'text-transparent text-stroke-1 text-stroke-white/30 hover:text-white hover:text-stroke-0' 
                  : 'text-white hover:text-zinc-300'
              }`}
            >
              {city.name}
            </a>
          ))}
        </ParallaxText>
      </div>

      <style>{`
        .text-stroke-1 {
          -webkit-text-stroke: 1px;
        }
        .text-stroke-white\\/30 {
          -webkit-text-stroke-color: rgba(255, 255, 255, 0.3);
        }
        .text-stroke-0 {
          -webkit-text-stroke: 0px;
        }
      `}</style>
    </div>
  );
}
