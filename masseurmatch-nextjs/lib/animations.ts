/**
 * Framer Motion animation variants and utilities
 * Reusable animations for consistent UX across the app
 */

import { Variants } from "framer-motion";

// ============================================================================
// FADE ANIMATIONS
// ============================================================================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

// ============================================================================
// SCALE ANIMATIONS
// ============================================================================

export const scaleIn: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

export const scaleInCenter: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

// ============================================================================
// SLIDE ANIMATIONS
// ============================================================================

export const slideInFromBottom: Variants = {
  hidden: { y: 100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export const slideInFromTop: Variants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

// ============================================================================
// STAGGER ANIMATIONS
// ============================================================================

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

// ============================================================================
// CARD ANIMATIONS
// ============================================================================

export const cardHover = {
  scale: 1.02,
  transition: {
    duration: 0.2,
    ease: "easeInOut",
  },
};

export const cardTap = {
  scale: 0.98,
};

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  hover: {
    y: -4,
    boxShadow: "0 20px 40px rgba(139, 92, 246, 0.2)",
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

// ============================================================================
// BUTTON ANIMATIONS
// ============================================================================

export const buttonHover = {
  scale: 1.05,
  transition: {
    duration: 0.2,
    ease: "easeInOut",
  },
};

export const buttonTap = {
  scale: 0.95,
};

// ============================================================================
// MODAL ANIMATIONS
// ============================================================================

export const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      delay: 0.1,
    },
  },
};

export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
};

// ============================================================================
// PAGE TRANSITIONS
// ============================================================================

export const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    x: "-100vw",
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: "100vw",
  },
};

// ============================================================================
// NOTIFICATION ANIMATIONS
// ============================================================================

export const notificationSlide: Variants = {
  hidden: { x: 400, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
  exit: {
    x: 400,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

// ============================================================================
// LOADING ANIMATIONS
// ============================================================================

export const pulseAnimation = {
  scale: [1, 1.05, 1],
  opacity: [0.5, 0.8, 0.5],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export const spinAnimation = {
  rotate: 360,
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: "linear",
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Create a stagger delay for child elements
 */
export const createStagger = (index: number, baseDelay: number = 0.1) => ({
  delay: index * baseDelay,
});

/**
 * Bounce animation for success states
 */
export const bounceIn: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: [0, 1.1, 0.9, 1],
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

/**
 * Shake animation for errors
 */
export const shake = {
  x: [0, -10, 10, -10, 10, 0],
  transition: {
    duration: 0.5,
  },
};

/**
 * Glow pulse for highlighted elements
 */
export const glowPulse = {
  boxShadow: [
    "0 0 20px rgba(139, 92, 246, 0.3)",
    "0 0 30px rgba(139, 92, 246, 0.5)",
    "0 0 20px rgba(139, 92, 246, 0.3)",
  ],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

/**
 * Count up animation for numbers
 */
export const countUp = (from: number, to: number, duration: number = 1) => ({
  initial: from,
  animate: to,
  transition: {
    duration,
    ease: "easeOut",
  },
});
