/**
 * Capture Screen
 * Pick an image and generate a quiz
 */

import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, Image, Pressable, ActivityIndicator, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useFocusEffect } from 'expo-router';
import { useColors, Spacing, Typography, Radius, Shadow } from '../../theme';
import { lightImpact, successFeedback } from '../../theme/haptics';
import { aiService } from '../../services/aiService';
import { HomeworkDB } from '../../services/homeworkDB';
import { QuizDB } from '../../services/quizDB';
import { useHomeworkStore } from '../../stores/homeworkStore';
import { isSupabaseConfigured } from '../../services/supabase';

type CaptureState = 'idle' | 'selecting' | 'generating' | 'uploading' | 'saving' | 'complete';

export default function CaptureScreen() {
  const colors = useColors();
  const router = useRouter();
  const { loadHomework } = useHomeworkStore();

  const [state, setState] = useState<CaptureState>('idle');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  // Reset state when screen comes back into focus (e.g., after navigating back from quiz)
  useFocusEffect(
    useCallback(() => {
      // If we're in a processing/complete state when returning to this screen, reset it
      if (state === 'complete' || state === 'saving' || state === 'uploading') {
        console.log('🔄 Screen focused - resetting state from:', state);
        reset();
      }
    }, [state])
  );

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera roll permission is required');
      return;
    }

    // Pick image
    setState('selecting');
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setSelectedImage(uri);

      // Convert to blob for web upload
      if (uri.startsWith('blob:') || uri.startsWith('data:')) {
        try {
          const response = await fetch(uri);
          const blob = await response.blob();
          setImageBlob(blob);
        } catch (err) {
          console.error('Failed to convert image to blob:', err);
        }
      }
    }

    setState('idle');
  };

  const generateQuiz = async () => {
    if (!selectedImage) return;

    setState('generating');
    setStatusMessage('Analyzing homework with AI...');
    lightImpact();

    try {
      // Generate quiz
      console.log('🧪 Generating quiz...');
      const quiz = await aiService.generateQuiz(selectedImage);
      console.log('✅ Quiz generated:', quiz.topic, quiz.questions.length, 'questions');

      // Save to database if configured
      if (!isSupabaseConfigured()) {
        console.log('⚠️ Supabase not configured - skipping save');
        Alert.alert('Success', 'Quiz generated! (Database not configured - add Supabase credentials to save)');
        setState('idle');
        return;
      }

      // Upload image
      setState('uploading');
      setStatusMessage('Uploading image...');
      console.log('📤 Uploading image...');

      let imageUrl: string;
      if (imageBlob) {
        try {
          imageUrl = await HomeworkDB.uploadImage(imageBlob, quiz.id);
          console.log('✅ Image uploaded:', imageUrl);
        } catch (uploadError: any) {
          console.error('❌ Image upload failed:', uploadError);
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }
      } else {
        imageUrl = selectedImage;
        console.log('ℹ️ Using local image URL');
      }

      // Create homework
      setState('saving');
      setStatusMessage('Saving homework...');
      console.log('💾 Creating homework record...');

      const title = quiz.topic
        ? `${quiz.topic}${quiz.subtopic ? ' - ' + quiz.subtopic : ''}`
        : 'Homework Quiz';

      let homework;
      try {
        homework = await HomeworkDB.create(title, imageUrl, quiz.topic);
        console.log('✅ Homework created:', homework.id);
      } catch (homeworkError: any) {
        console.error('❌ Homework creation failed:', homeworkError);
        throw new Error(`Failed to create homework: ${homeworkError.message}`);
      }

      // Save quiz
      console.log('💾 Saving quiz...');
      quiz.homeworkId = homework.id;
      try {
        await QuizDB.create(quiz);
        console.log('✅ Quiz saved');
      } catch (quizError: any) {
        console.error('❌ Quiz save failed:', quizError);
        throw new Error(`Failed to save quiz: ${quizError.message}`);
      }

      // Success
      setState('complete');
      successFeedback();
      console.log('🎉 All data saved successfully!');

      // Reload homework list
      await loadHomework();

      // Navigate to quiz
      setTimeout(() => {
        router.push(`/quiz/${homework.id}`);
      }, 500);

    } catch (error: any) {
      console.error('❌ Error in generateQuiz:', error);
      console.error('Error stack:', error.stack);
      Alert.alert(
        'Error',
        error.message || 'Failed to generate quiz. Check console for details.'
      );
      setState('idle');
      setStatusMessage('');
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setImageBlob(null);
    setState('idle');
    setStatusMessage('');
  };

  const isProcessing = state !== 'idle' && state !== 'selecting';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.secondaryBackground }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Capture Homework
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Take a photo or choose from library
        </Text>
      </View>

      {/* Image Preview */}
      {selectedImage ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: selectedImage }}
            style={styles.image}
            resizeMode="contain"
          />
          {!isProcessing && (
            <Pressable
              onPress={reset}
              style={[styles.resetButton, { backgroundColor: colors.error }]}
            >
              <Text style={styles.resetButtonText}>✕</Text>
            </Pressable>
          )}
        </View>
      ) : (
        <Pressable
          onPress={pickImage}
          style={({ pressed }) => [
            styles.pickButton,
            {
              backgroundColor: colors.cardBackground,
              opacity: pressed ? 0.8 : 1
            },
            Shadow.card
          ]}
        >
          <Text style={styles.pickIcon}>📷</Text>
          <Text style={[styles.pickText, { color: colors.textPrimary }]}>
            Pick an Image
          </Text>
        </Pressable>
      )}

      {/* Actions */}
      {selectedImage && !isProcessing && (
        <View style={styles.actions}>
          <Pressable
            onPress={generateQuiz}
            style={({ pressed }) => [
              styles.generateButton,
              {
                backgroundColor: colors.primary,
                opacity: pressed ? 0.8 : 1
              },
              Shadow.card
            ]}
          >
            <Text style={styles.generateButtonText}>Generate Quiz</Text>
          </Pressable>
        </View>
      )}

      {/* Processing State */}
      {isProcessing && (
        <View style={[styles.processingContainer, { backgroundColor: colors.cardBackground }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.processingText, { color: colors.textPrimary }]}>
            {statusMessage}
          </Text>
          <Text style={[styles.processingHint, { color: colors.textSecondary }]}>
            This may take 30-60 seconds
          </Text>
        </View>
      )}

      {/* Instructions */}
      {!selectedImage && state === 'idle' && (
        <View style={styles.instructions}>
          <Text style={[styles.instructionsTitle, { color: colors.textPrimary }]}>
            How it works
          </Text>
          <View style={styles.instructionsList}>
            <InstructionItem
              number="1"
              text="Pick a photo of your homework"
              colors={colors}
            />
            <InstructionItem
              number="2"
              text="AI analyzes the content"
              colors={colors}
            />
            <InstructionItem
              number="3"
              text="Get a personalized quiz"
              colors={colors}
            />
            <InstructionItem
              number="4"
              text="Practice and improve"
              colors={colors}
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const InstructionItem: React.FC<{ number: string; text: string; colors: any }> = ({
  number,
  text,
  colors
}) => (
  <View style={styles.instructionItem}>
    <View style={[styles.instructionNumber, { backgroundColor: colors.primary + '20' }]}>
      <Text style={[styles.instructionNumberText, { color: colors.primary }]}>
        {number}
      </Text>
    </View>
    <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
      {text}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
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
  imageContainer: {
    width: '100%',
    height: 300,
    borderRadius: Radius.card,
    overflow: 'hidden',
    marginBottom: Spacing.large,
    backgroundColor: '#E5E5EA',
    position: 'relative'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  resetButton: {
    position: 'absolute',
    top: Spacing.medium,
    right: Spacing.medium,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.card
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold'
  },
  pickButton: {
    height: 300,
    borderRadius: Radius.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.large
  },
  pickIcon: {
    fontSize: 64,
    marginBottom: Spacing.medium
  },
  pickText: {
    ...Typography.title2,
    fontWeight: '600'
  },
  actions: {
    marginBottom: Spacing.large
  },
  generateButton: {
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.large,
    borderRadius: Radius.button,
    alignItems: 'center',
    minHeight: 56
  },
  generateButtonText: {
    ...Typography.body,
    fontWeight: '600',
    color: '#FFFFFF'
  },
  processingContainer: {
    padding: Spacing.large,
    borderRadius: Radius.card,
    alignItems: 'center',
    marginBottom: Spacing.large
  },
  processingText: {
    ...Typography.body,
    fontWeight: '600',
    marginTop: Spacing.medium
  },
  processingHint: {
    ...Typography.caption1,
    marginTop: Spacing.small
  },
  instructions: {
    marginTop: Spacing.large
  },
  instructionsTitle: {
    ...Typography.title2,
    marginBottom: Spacing.medium
  },
  instructionsList: {
    gap: Spacing.medium
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.medium
  },
  instructionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  instructionNumberText: {
    ...Typography.callout,
    fontWeight: 'bold'
  },
  instructionText: {
    ...Typography.body,
    flex: 1
  }
});
