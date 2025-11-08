/**
 * Tab Layout
 * Bottom tab navigation for main screens
 */

import { Tabs } from 'expo-router';
import { useColors } from '../../theme';

export default function TabLayout() {
  const colors = useColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.separator,
          borderTopWidth: 1
        },
        headerStyle: {
          backgroundColor: colors.background
        },
        headerTintColor: colors.textPrimary,
        headerShadowVisible: false
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Homework',
          tabBarIcon: ({ color, size }) => <TabIcon name="home" color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="capture"
        options={{
          title: 'Capture',
          tabBarIcon: ({ color, size }) => <TabIcon name="camera" color={color} size={size} />
        }}
      />
    </Tabs>
  );
}

// Simple tab icon component (we'll enhance this later)
function TabIcon({ name, color, size }: { name: string; color: string; size: number }) {
  const emoji = name === 'home' ? '📚' : '📸';
  return <span style={{ fontSize: size }}>{emoji}</span>;
}
