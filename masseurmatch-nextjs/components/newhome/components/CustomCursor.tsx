"use client";

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState('');
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 200 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check for hoverable elements
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-hover')
      ) {
        setIsHovering(true);
        const text = target.getAttribute('data-cursor-text');
        if (text) setCursorText(text);
      } else {
        setIsHovering(false);
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Main Cursor Dot */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] hidden lg:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          animate={{
            scale: isHovering ? 1.5 : 1,
            opacity: isHovering ? 0.8 : 0.6,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-full h-full rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 mix-blend-difference"
        />
      </motion.div>

      {/* Cursor Ring */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 pointer-events-none z-[9999] hidden lg:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-8px',
          translateY: '-8px',
        }}
      >
        <motion.div
          animate={{
            scale: isHovering ? 2 : 1,
            borderColor: isHovering ? 'rgba(139, 92, 246, 0.6)' : 'rgba(255, 255, 255, 0.3)',
          }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-full h-full rounded-full border-2 border-white/30 mix-blend-difference"
        />
      </motion.div>

      {/* Cursor Text */}
      {cursorText && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9999] hidden lg:block"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            translateX: '40px',
            translateY: '20px',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <div className="px-3 py-1 bg-violet-500 text-white text-xs font-medium rounded-full whitespace-nowrap">
            {cursorText}
          </div>
        </motion.div>
      )}
    </>
  );
}

