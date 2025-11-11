import type { Config } from 'tailwindcss'
import { colors, spacing, radius, shadows, breakpoints } from './lib/tokens'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Brand colors
        primary: colors.primary,
        success: colors.success,
        error: colors.error,
        warning: colors.warning,

        // Adaptive colors (use CSS variables)
        background: colors.background.DEFAULT,
        'background-secondary': colors.background.secondary,
        'background-tertiary': colors.background.tertiary,

        // Card colors
        card: colors.card.DEFAULT,
        'card-foreground': colors.card.foreground,

        // Text colors
        foreground: colors.foreground.DEFAULT,
        'foreground-secondary': colors.foreground.secondary,
        'foreground-tertiary': colors.foreground.tertiary,

        // Borders
        border: colors.border,
        separator: colors.separator,

        // Gradients
        gradient: colors.gradient,
      },
      borderRadius: {
        ...radius,
      },
      spacing: {
        ...spacing,
      },
      boxShadow: {
        ...shadows,
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        // Display
        'large-title': ['2.125rem', { lineHeight: '2.5625rem', fontWeight: '700', letterSpacing: '0.02em' }],

        // Titles
        'title-1': ['1.75rem', { lineHeight: '2.125rem', fontWeight: '400', letterSpacing: '0.01em' }],
        'title-2': ['1.375rem', { lineHeight: '1.75rem', fontWeight: '400', letterSpacing: '0.01em' }],
        'title-3': ['1.25rem', { lineHeight: '1.5625rem', fontWeight: '600', letterSpacing: '0.01em' }],

        // Body
        'headline': ['1.0625rem', { lineHeight: '1.375rem', fontWeight: '600', letterSpacing: '-0.02em' }],
        'body': ['1.0625rem', { lineHeight: '1.375rem', fontWeight: '400', letterSpacing: '-0.02em' }],
        'callout': ['1rem', { lineHeight: '1.3125rem', fontWeight: '400', letterSpacing: '-0.01em' }],
        'subheadline': ['0.9375rem', { lineHeight: '1.25rem', fontWeight: '400', letterSpacing: '-0.01em' }],

        // Small
        'footnote': ['0.8125rem', { lineHeight: '1.125rem', fontWeight: '400', letterSpacing: '0' }],
        'caption-1': ['0.75rem', { lineHeight: '1rem', fontWeight: '400', letterSpacing: '0' }],
        'caption-2': ['0.6875rem', { lineHeight: '0.8125rem', fontWeight: '400', letterSpacing: '0.01em' }],
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'slide-up': {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          from: { transform: 'translateY(-20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          from: { transform: 'scale(0.95)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        'scale-out': {
          from: { transform: 'scale(1)', opacity: '1' },
          to: { transform: 'scale(0.95)', opacity: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-in-out',
        'fade-out': 'fade-out 0.2s ease-in-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'scale-out': 'scale-out 0.2s ease-in',
      },
    },
  },
  plugins: [],
} satisfies Config

export default config
