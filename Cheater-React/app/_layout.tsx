/**
 * Root Layout
 * Sets up authentication and navigation structure
 */

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { signInAnonymously, isSupabaseConfigured } from '../services/supabase';

export default function RootLayout() {
  // Auto sign-in on app load
  useEffect(() => {
    const init = async () => {
      if (!isSupabaseConfigured()) {
        console.warn('⚠️  Supabase not configured. Database features disabled.');
        return;
      }

      try {
        console.log('🔐 Signing in anonymously...');
        await signInAnonymously();
        console.log('✅ Signed in successfully!');
      } catch (err) {
        console.error('❌ Sign-in failed:', err);
      }
    };

    init();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="quiz/[id]"
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'Quiz'
        }}
      />
      <Stack.Screen
        name="homework/[id]"
        options={{
          presentation: 'card',
          headerShown: true,
          title: 'Homework'
        }}
      />
    </Stack>
  );
}
