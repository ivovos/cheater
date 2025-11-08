/**
 * useColors Hook
 * Returns colors adapted for current color scheme (light/dark)
 */

import { useColorScheme } from 'react-native';
import { Colors } from './colors';

export function useColors() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return {
    // Static colors
    primary: Colors.primary,
    primaryTint: Colors.primaryTint,
    success: Colors.success,
    successTint: Colors.successTint,
    error: Colors.error,
    errorTint: Colors.errorTint,
    warning: Colors.warning,
    warningTint: Colors.warningTint,
    gradientStart: Colors.gradientStart,
    gradientEnd: Colors.gradientEnd,

    // Adaptive colors
    background: isDark ? Colors.background.dark : Colors.background.light,
    secondaryBackground: isDark
      ? Colors.secondaryBackground.dark
      : Colors.secondaryBackground.light,
    tertiaryBackground: isDark
      ? Colors.tertiaryBackground.dark
      : Colors.tertiaryBackground.light,
    cardBackground: isDark
      ? Colors.cardBackground.dark
      : Colors.cardBackground.light,
    textPrimary: isDark ? Colors.textPrimary.dark : Colors.textPrimary.light,
    textSecondary: Colors.textSecondary.light, // Same for both
    textTertiary: isDark
      ? Colors.textTertiary.dark
      : Colors.textTertiary.light,
    separator: isDark ? Colors.separator.dark : Colors.separator.light,

    // Helper
    isDark
  };
}
