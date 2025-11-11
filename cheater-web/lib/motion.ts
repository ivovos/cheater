/**
 * Framer Motion Presets
 * iOS-native animation configurations adapted for web
 */

import { Transition, Variants } from 'framer-motion'

/**
 * Spring Configurations
 * Converted from React Native spring configs
 */
export const spring = {
  // Default iOS spring (damping: 15, stiffness: 150)
  default: {
    type: 'spring' as const,
    damping: 15,
    stiffness: 150,
    mass: 1,
  },

  // Bouncy (more playful)
  bouncy: {
    type: 'spring' as const,
    damping: 10,
    stiffness: 200,
    mass: 1,
  },

  // Gentle (more subtle)
  gentle: {
    type: 'spring' as const,
    damping: 20,
    stiffness: 100,
    mass: 1,
  },

  // Snappy (quick response)
  snappy: {
    type: 'spring' as const,
    damping: 12,
    stiffness: 250,
    mass: 0.8,
  },
} satisfies Record<string, Transition>

/**
 * Transition Presets
 */
export const transition = {
  fast: { duration: 0.2, ease: [0.42, 0, 0.58, 1] },
  medium: { duration: 0.3, ease: [0.42, 0, 0.58, 1] },
  slow: { duration: 0.5, ease: [0.42, 0, 0.58, 1] },
} satisfies Record<string, Transition>

/**
 * Card Animations
 * For homework cards, quiz cards, etc.
 */
export const cardMotion = {
  rest: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: spring.snappy,
  },
  tap: {
    scale: 0.97,
    transition: spring.snappy,
  },
} as const

/**
 * Button Animations
 */
export const buttonMotion = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.02,
    transition: spring.gentle,
  },
  tap: {
    scale: 0.97,
    transition: spring.snappy,
  },
} as const

/**
 * Modal/Dialog Animations
 */
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      ...spring.default,
      opacity: { duration: 0.2 },
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2,
      ease: [0.42, 0, 1, 1],
    },
  },
}

/**
 * Page Transition Variants
 */
export const pageVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.42, 0, 0.58, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: [0.42, 0, 1, 1],
    },
  },
}

/**
 * Fade In Animation
 */
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
}

/**
 * Slide Up Animation
 */
export const slideUp: Variants = {
  hidden: {
    y: 20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: spring.default,
  },
  exit: {
    y: -20,
    opacity: 0,
    transition: transition.fast,
  },
}

/**
 * Stagger Children Animation
 * For lists, grids, etc.
 */
export const staggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: spring.snappy,
  },
}

/**
 * Collapse/Expand Animation
 * For accordions, expandable sections
 */
export const collapse: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: transition.fast,
  },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: spring.gentle,
  },
}

/**
 * Scale In Animation
 * For popovers, tooltips
 */
export const scaleIn: Variants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: spring.snappy,
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    transition: transition.fast,
  },
}

/**
 * Progress Bar Animation
 */
export const progressVariants: Variants = {
  initial: {
    scaleX: 0,
    originX: 0,
  },
  animate: (progress: number) => ({
    scaleX: progress,
    transition: spring.default,
  }),
}

/**
 * Hover/Tap Helpers
 * Reusable motion props for interactive elements
 */
export const interactionMotion = {
  card: {
    whileHover: cardMotion.hover,
    whileTap: cardMotion.tap,
  },
  button: {
    whileHover: buttonMotion.hover,
    whileTap: buttonMotion.tap,
  },
  subtle: {
    whileHover: { scale: 1.01 },
    whileTap: { scale: 0.99 },
  },
} as const

/**
 * Layout Transition
 * For shared layout animations
 */
export const layoutTransition = {
  layout: true,
  transition: spring.default,
} as const
