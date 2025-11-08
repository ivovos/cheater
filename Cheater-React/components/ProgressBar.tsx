/**
 * ProgressBar Component
 * Shows progress through a quiz with animated fill
 */

import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';
import { useColors, Spacing, Typography, Radius } from '../theme';
import { Spring } from '../theme/animations';

interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  showLabel = true
}) => {
  const colors = useColors();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(current / total, Spring.default);
  }, [current, total]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`
  }));

  return (
    <View style={styles.container}>
      {showLabel && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {current} of {total}
        </Text>
      )}
      <View style={[styles.track, { backgroundColor: colors.separator }]}>
        <Animated.View
          style={[
            styles.fill,
            { backgroundColor: colors.primary },
            animatedStyle
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.small
  },
  label: {
    ...Typography.caption1,
    fontWeight: '600'
  },
  track: {
    height: 6,
    borderRadius: Radius.pill,
    overflow: 'hidden'
  },
  fill: {
    height: '100%',
    borderRadius: Radius.pill
  }
});
