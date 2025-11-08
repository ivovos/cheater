/**
 * HomeworkCard Component
 * Displays a homework assignment card with image, title, and progress
 */

import React from 'react';
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';
import { Homework } from '../types';
import { useColors, Spacing, Typography, Radius, Shadow } from '../theme';
import { lightImpact } from '../theme/haptics';

interface HomeworkCardProps {
  homework: Homework;
  onPress: () => void;
}

export const HomeworkCard: React.FC<HomeworkCardProps> = ({ homework, onPress }) => {
  const colors = useColors();

  const handlePress = () => {
    lightImpact();
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.cardBackground,
          opacity: pressed ? 0.8 : 1
        },
        Shadow.card
      ]}
    >
      {/* Thumbnail */}
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: homework.imageURL }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text
          style={[styles.title, { color: colors.textPrimary }]}
          numberOfLines={2}
        >
          {homework.title}
        </Text>

        {/* Subject Badge */}
        {homework.subject && (
          <View style={[styles.badge, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.badgeText, { color: colors.primary }]}>
              {homework.subject}
            </Text>
          </View>
        )}

        {/* Progress Info */}
        <View style={styles.footer}>
          {homework.completionPercentage > 0 && (
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.success }]}>
                {homework.completionPercentage}%
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Completed
              </Text>
            </View>
          )}

          {homework.bestScore !== undefined && (
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {homework.bestScore}/10
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Best Score
              </Text>
            </View>
          )}

          {homework.totalAttempts > 0 && (
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                {homework.totalAttempts}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                {homework.totalAttempts === 1 ? 'Attempt' : 'Attempts'}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: Radius.card,
    marginBottom: Spacing.medium,
    overflow: 'hidden'
  },
  thumbnailContainer: {
    width: 100,
    height: 100
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E5EA'
  },
  content: {
    flex: 1,
    padding: Spacing.medium,
    justifyContent: 'space-between'
  },
  title: {
    ...Typography.headline,
    marginBottom: Spacing.tiny
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.small,
    paddingVertical: Spacing.tiny,
    borderRadius: Radius.pill,
    marginBottom: Spacing.small
  },
  badgeText: {
    ...Typography.caption1,
    fontWeight: '600'
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.medium
  },
  stat: {
    alignItems: 'flex-start'
  },
  statValue: {
    ...Typography.callout,
    fontWeight: '600'
  },
  statLabel: {
    ...Typography.caption2
  }
});
