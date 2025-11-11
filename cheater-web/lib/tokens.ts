/**
 * Design Tokens
 * Migrated from React Native iOS design system to web
 * Used in Tailwind config and components
 */

/**
 * Color Tokens
 * iOS-native semantic colors with light/dark mode support
 */
export const colors = {
  // Brand Colors (Headway-inspired)
  primary: {
    DEFAULT: 'hsl(217, 100%, 52%)', // #0066FF Headway Blue
    hover: 'hsl(217, 100%, 48%)',
    active: 'hsl(217, 100%, 44%)',
    tint: 'hsl(217, 100%, 52%, 0.1)', // 10% opacity
  },

  // Semantic Colors
  success: {
    DEFAULT: 'hsl(160, 100%, 42%)', // #00D395 Headway Green
    hover: 'hsl(160, 100%, 38%)',
    tint: 'hsl(160, 100%, 42%, 0.15)',
  },
  error: {
    DEFAULT: 'hsl(4, 100%, 60%)', // #FF3B30 iOS Red
    hover: 'hsl(4, 100%, 55%)',
    tint: 'hsl(4, 100%, 60%, 0.15)',
  },
  warning: {
    DEFAULT: 'hsl(35, 100%, 50%)', // #FF9500 iOS Orange
    hover: 'hsl(35, 100%, 45%)',
    tint: 'hsl(35, 100%, 50%, 0.15)',
  },

  // Neutral Colors (Light/Dark adaptive via CSS variables)
  background: {
    DEFAULT: 'hsl(var(--background))',
    secondary: 'hsl(var(--background-secondary))',
    tertiary: 'hsl(var(--background-tertiary))',
  },

  // Card/Surface
  card: {
    DEFAULT: 'hsl(var(--card))',
    foreground: 'hsl(var(--card-foreground))',
  },

  // Text Colors
  foreground: {
    DEFAULT: 'hsl(var(--foreground))',
    secondary: 'hsl(var(--foreground-secondary))',
    tertiary: 'hsl(var(--foreground-tertiary))',
  },

  // Borders & Separators
  border: 'hsl(var(--border))',
  separator: 'hsl(var(--separator))',

  // Gradients
  gradient: {
    from: 'hsl(211, 100%, 50%, 0.1)', // Blue 10%
    to: 'hsl(145, 63%, 49%, 0.1)', // Green 10%
  },
} as const

/**
 * Spacing Scale
 * 8px base scale mapped to Tailwind spacing units
 */
export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem', // 4px (tiny)
  2: '0.5rem', // 8px (small)
  3: '0.75rem', // 12px
  4: '1rem', // 16px (medium)
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px (large)
  8: '2rem', // 32px (xLarge)
  10: '2.5rem', // 40px
  12: '3rem', // 48px (xxLarge)
  16: '4rem', // 64px (xxxLarge)
  20: '5rem', // 80px
  24: '6rem', // 96px

  // Semantic spacing
  cardPadding: '1.5rem', // 24px
  cardGap: '1.5rem', // 24px
  listGap: '0.75rem', // 12px
  buttonPadding: '1rem', // 16px
  screenPadding: '1rem', // 16px
  sectionGap: '1.5rem', // 24px
} as const

/**
 * Border Radius
 * iOS-native corner radius values
 */
export const radius = {
  none: '0',
  sm: '0.5rem', // 8px
  DEFAULT: '0.75rem', // 12px (medium)
  md: '0.75rem', // 12px
  lg: '1rem', // 16px
  xl: '1.25rem', // 20px
  '2xl': '1.5rem', // 24px
  '3xl': '1.75rem', // 28px
  full: '9999px', // Pill/circle

  // Semantic radius
  button: '0.75rem', // 12px
  card: '1.5rem', // 24px (more consumer-friendly than RN's 16px)
  modal: '1.75rem', // 28px
  input: '0.625rem', // 10px
  image: '0.75rem', // 12px
} as const

/**
 * Shadows
 * iOS-native shadow configurations converted to CSS box-shadow
 */
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',

  // Semantic shadows (iOS style)
  card: '0 2px 8px 0 rgb(0 0 0 / 0.1)', // offset-y: 2px, blur: 8px, opacity: 0.1
  button: '0 4px 12px 0 rgb(0 0 0 / 0.15)', // offset-y: 4px, blur: 12px, opacity: 0.15
  modal: '0 10px 20px 0 rgb(0 0 0 / 0.25)', // offset-y: 10px, blur: 20px, opacity: 0.25
  pressed: '0 1px 4px 0 rgb(0 0 0 / 0.05)', // Reduced shadow for pressed state
} as const

/**
 * Typography
 * iOS-native font sizes, weights, and line heights
 */
export const typography = {
  // Display
  largeTitle: {
    fontSize: '2.125rem', // 34px
    lineHeight: '2.5625rem', // 41px
    fontWeight: '700', // Bold
    letterSpacing: '0.02em',
  },

  // Titles
  title1: {
    fontSize: '1.75rem', // 28px
    lineHeight: '2.125rem', // 34px
    fontWeight: '400', // Regular
    letterSpacing: '0.01em',
  },
  title2: {
    fontSize: '1.375rem', // 22px
    lineHeight: '1.75rem', // 28px
    fontWeight: '400',
    letterSpacing: '0.01em',
  },
  title3: {
    fontSize: '1.25rem', // 20px
    lineHeight: '1.5625rem', // 25px
    fontWeight: '600', // Semibold
    letterSpacing: '0.01em',
  },

  // Body
  headline: {
    fontSize: '1.0625rem', // 17px
    lineHeight: '1.375rem', // 22px
    fontWeight: '600',
    letterSpacing: '-0.02em',
  },
  body: {
    fontSize: '1.0625rem', // 17px
    lineHeight: '1.375rem', // 22px
    fontWeight: '400',
    letterSpacing: '-0.02em',
  },
  callout: {
    fontSize: '1rem', // 16px
    lineHeight: '1.3125rem', // 21px
    fontWeight: '400',
    letterSpacing: '-0.01em',
  },
  subheadline: {
    fontSize: '0.9375rem', // 15px
    lineHeight: '1.25rem', // 20px
    fontWeight: '400',
    letterSpacing: '-0.01em',
  },

  // Small
  footnote: {
    fontSize: '0.8125rem', // 13px
    lineHeight: '1.125rem', // 18px
    fontWeight: '400',
    letterSpacing: '0',
  },
  caption1: {
    fontSize: '0.75rem', // 12px
    lineHeight: '1rem', // 16px
    fontWeight: '400',
    letterSpacing: '0',
  },
  caption2: {
    fontSize: '0.6875rem', // 11px
    lineHeight: '0.8125rem', // 13px
    fontWeight: '400',
    letterSpacing: '0.01em',
  },
} as const

/**
 * Animation Durations (milliseconds)
 */
export const duration = {
  instant: 0,
  fast: 200, // 0.2s
  medium: 300, // 0.3s
  slow: 500, // 0.5s
  xSlow: 800, // 0.8s
} as const

/**
 * Z-index Scale
 */
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  toast: 1700,
} as const

/**
 * Breakpoints
 */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const
