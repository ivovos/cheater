/**
 * AnswerButton Component
 * Button for quiz answer options with state (default, selected, correct, incorrect)
 */

import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { useColors, Spacing, Typography, Radius, Shadow } from '../theme';
import { lightImpact } from '../theme/haptics';

interface AnswerButtonProps {
  label: string;
  onPress: () => void;
  state?: 'default' | 'selected' | 'correct' | 'incorrect';
  disabled?: boolean;
}

export const AnswerButton: React.FC<AnswerButtonProps> = ({
  label,
  onPress,
  state = 'default',
  disabled = false
}) => {
  const colors = useColors();

  const handlePress = () => {
    if (!disabled) {
      lightImpact();
      onPress();
    }
  };

  const getBackgroundColor = () => {
    switch (state) {
      case 'selected':
        return colors.primary;
      case 'correct':
        return colors.success;
      case 'incorrect':
        return colors.error;
      default:
        return colors.cardBackground;
    }
  };

  const getTextColor = () => {
    switch (state) {
      case 'selected':
      case 'correct':
      case 'incorrect':
        return '#FFFFFF';
      default:
        return colors.textPrimary;
    }
  };

  const getBorderColor = () => {
    if (state === 'default') {
      return colors.separator;
    }
    return 'transparent';
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          opacity: pressed ? 0.8 : disabled ? 0.5 : 1
        },
        state === 'default' && Shadow.small
      ]}
    >
      <Text style={[styles.label, { color: getTextColor() }]}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.large,
    borderRadius: Radius.button,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56
  },
  label: {
    ...Typography.body,
    fontWeight: '600',
    textAlign: 'center'
  }
});
