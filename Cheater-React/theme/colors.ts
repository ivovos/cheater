/**
 * Color Tokens
 * iOS-native semantic colors with light/dark mode support
 */

export const Colors = {
  // Primary
  primary: '#007AFF', // iOS Blue
  primaryTint: '#007AFF1A', // 10% opacity

  // Semantic
  success: '#34C759', // iOS Green
  successTint: '#34C75926', // 15% opacity
  error: '#FF3B30', // iOS Red
  errorTint: '#FF3B3026', // 15% opacity
  warning: '#FF9500', // iOS Orange
  warningTint: '#FF950026', // 15% opacity

  // Neutral (Light/Dark adaptive)
  background: {
    light: '#FFFFFF',
    dark: '#000000'
  },
  secondaryBackground: {
    light: '#F2F2F7',
    dark: '#1C1C1E'
  },
  tertiaryBackground: {
    light: '#FFFFFF',
    dark: '#2C2C2E'
  },

  // Card/Surface
  cardBackground: {
    light: '#FFFFFF',
    dark: '#1C1C1E'
  },

  // Text
  textPrimary: {
    light: '#000000',
    dark: '#FFFFFF'
  },
  textSecondary: {
    light: '#8E8E93', // iOS Gray
    dark: '#8E8E93'
  },
  textTertiary: {
    light: '#C7C7CC',
    dark: '#48484A'
  },

  // Separators
  separator: {
    light: '#C6C6C8',
    dark: '#38383A'
  },

  // Gradients
  gradientStart: '#007AFF1A', // Blue 10%
  gradientEnd: '#34C7591A' // Green 10%
};

/**
 * Adaptive color type
 */
export type AdaptiveColor = {
  light: string;
  dark: string;
};
