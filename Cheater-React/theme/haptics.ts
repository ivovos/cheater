/**
 * Haptic Feedback Helpers
 * Simplified wrappers for expo-haptics
 */

import * as Haptics from 'expo-haptics';

/**
 * Light impact (button press)
 */
export function lightImpact() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

/**
 * Medium impact (selection)
 */
export function mediumImpact() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

/**
 * Heavy impact (significant action)
 */
export function heavyImpact() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
}

/**
 * Success notification
 */
export function successFeedback() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

/**
 * Error notification
 */
export function errorFeedback() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}

/**
 * Warning notification
 */
export function warningFeedback() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
}

/**
 * Selection change (picker)
 */
export function selectionFeedback() {
  Haptics.selectionAsync();
}

/**
 * Haptic feedback for correct answer
 */
export function correctAnswerFeedback() {
  successFeedback();
}

/**
 * Haptic feedback for wrong answer
 */
export function wrongAnswerFeedback() {
  errorFeedback();
}
