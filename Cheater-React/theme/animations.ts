/**
 * Animation Configuration
 * iOS-native animation timings, springs, and easings
 */

/**
 * Animation Durations (milliseconds)
 */
export const Duration = {
  instant: 0,
  fast: 200, // 0.2s
  medium: 300, // 0.3s
  slow: 500, // 0.5s
  xSlow: 800 // 0.8s
};

/**
 * iOS Spring Configurations
 * Used with react-native-reanimated or Animated API
 */
export const Spring = {
  // Default iOS spring
  default: {
    damping: 15,
    stiffness: 150,
    mass: 1,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 2
  },

  // Bouncy (more playful)
  bouncy: {
    damping: 10,
    stiffness: 200,
    mass: 1,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 2
  },

  // Gentle (more subtle)
  gentle: {
    damping: 20,
    stiffness: 100,
    mass: 1,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 2
  },

  // Snappy (quick response)
  snappy: {
    damping: 12,
    stiffness: 250,
    mass: 0.8,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 2
  }
};

/**
 * Easing Curves
 * Cubic bezier values for timing animations
 */
export const Easing = {
  // iOS native curves
  easeInOut: [0.42, 0, 0.58, 1] as const,
  easeOut: [0, 0, 0.58, 1] as const,
  easeIn: [0.42, 0, 1, 1] as const,
  linear: [0, 0, 1, 1] as const
};
