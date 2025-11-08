/**
 * Home Screen
 * Shows list of all homework assignments
 */

import { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useHomeworkStore } from '../../stores/homeworkStore';
import { useColors, Spacing, Typography } from '../../theme';
import { HomeworkCard } from '../../components/HomeworkCard';

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { homework, isLoading, loadHomework } = useHomeworkStore();

  // Load homework on mount
  useEffect(() => {
    loadHomework();
  }, []);

  const handleRefresh = () => {
    loadHomework();
  };

  const handleHomeworkPress = (homeworkId: string) => {
    router.push(`/quiz/${homeworkId}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.secondaryBackground }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            My Homework
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {homework.length} assignment{homework.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Homework List */}
        {homework.length === 0 && !isLoading ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No homework yet
            </Text>
            <Text style={[styles.emptyHint, { color: colors.textTertiary }]}>
              Tap the Capture tab to add your first homework
            </Text>
          </View>
        ) : (
          homework.map((hw) => (
            <HomeworkCard
              key={hw.id}
              homework={hw}
              onPress={() => handleHomeworkPress(hw.id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    flex: 1
  },
  content: {
    padding: Spacing.medium
  },
  header: {
    marginBottom: Spacing.large
  },
  title: {
    ...Typography.largeTitle,
    marginBottom: Spacing.tiny
  },
  subtitle: {
    ...Typography.callout
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxLarge
  },
  emptyText: {
    ...Typography.title2,
    marginBottom: Spacing.small
  },
  emptyHint: {
    ...Typography.body,
    textAlign: 'center'
  }
});
