/**
 * Quiz Screen
 * Play through quiz questions one by one
 */

import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColors, Spacing, Typography, Radius, Shadow } from '../../theme';
import { QuestionView, ProgressBar } from '../../components';
import { correctAnswerFeedback, wrongAnswerFeedback, successFeedback } from '../../theme/haptics';
import { QuizDB } from '../../services/quizDB';
import { Quiz, Question } from '../../types';

type QuizState = 'loading' | 'playing' | 'feedback' | 'complete';

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();

  const [state, setState] = useState<QuizState>('loading');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Map<string, string | number>>(new Map());
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadQuiz();
  }, [id]);

  const loadQuiz = async () => {
    console.log('🎯 Loading quiz for homework ID:', id);
    try {
      const loadedQuiz = await QuizDB.getByHomeworkId(id);
      console.log('📊 Quiz loaded:', loadedQuiz ? 'Found' : 'Not found');
      if (!loadedQuiz) {
        console.error('❌ No quiz found for homework ID:', id);
        Alert.alert('Error', 'Quiz not found for this homework');
        router.back();
        return;
      }
      console.log('✅ Quiz has', loadedQuiz.questions.length, 'questions');
      setQuiz(loadedQuiz);
      setState('playing');
    } catch (error: any) {
      console.error('❌ Failed to load quiz:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      Alert.alert('Error', `Failed to load quiz: ${error.message || 'Unknown error'}`);
      router.back();
    }
  };

  const handleAnswerSelect = (answer: string | number) => {
    if (!quiz) return;
    const question = quiz.questions[currentQuestionIndex];
    const newAnswers = new Map(userAnswers);
    newAnswers.set(question.id, answer);
    setUserAnswers(newAnswers);
  };

  const checkAnswer = () => {
    if (!quiz) return false;
    const question = quiz.questions[currentQuestionIndex];
    const userAnswer = userAnswers.get(question.id);

    if (question.type === 'mcq') {
      return userAnswer === question.correctIndex;
    } else {
      // For fill-blank and short-answer, do case-insensitive comparison
      const correct = question.correctAnswer?.toLowerCase().trim();
      const user = String(userAnswer || '').toLowerCase().trim();
      return correct === user;
    }
  };

  const handleNext = () => {
    if (!quiz) return;

    // Show feedback first
    if (!showFeedback) {
      const isCorrect = checkAnswer();
      if (isCorrect) {
        correctAnswerFeedback();
      } else {
        wrongAnswerFeedback();
      }
      setShowFeedback(true);
      return;
    }

    // Move to next question
    setShowFeedback(false);
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz complete
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    if (!quiz) return;

    // Calculate final score
    let finalScore = 0;
    quiz.questions.forEach((question) => {
      const userAnswer = userAnswers.get(question.id);
      let isCorrect = false;

      if (question.type === 'mcq') {
        isCorrect = userAnswer === question.correctIndex;
      } else {
        const correct = question.correctAnswer?.toLowerCase().trim();
        const user = String(userAnswer || '').toLowerCase().trim();
        isCorrect = correct === user;
      }

      if (isCorrect) finalScore++;
    });

    setScore(finalScore);
    setState('complete');
    successFeedback();

    // Save attempt to database
    try {
      const answers = Array.from(userAnswers.entries()).map(([questionId, answer]) => ({
        questionId,
        answer: String(answer)
      }));
      await QuizDB.saveAttempt(quiz.id, finalScore, answers);
      await QuizDB.updateProgress(quiz.homeworkId, finalScore);
    } catch (error) {
      console.error('Failed to save attempt:', error);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers(new Map());
    setShowFeedback(false);
    setScore(0);
    setState('playing');
  };

  const handleClose = () => {
    router.back();
  };

  if (state === 'loading') {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!quiz) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>Quiz not found</Text>
      </View>
    );
  }

  if (state === 'complete') {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView contentContainerStyle={styles.content}>
          {/* Results */}
          <View style={styles.resultsContainer}>
            <Text style={[styles.resultsEmoji, { color: colors.textPrimary }]}>
              {passed ? '🎉' : '📚'}
            </Text>
            <Text style={[styles.resultsTitle, { color: colors.textPrimary }]}>
              {passed ? 'Great Job!' : 'Keep Practicing!'}
            </Text>
            <Text style={[styles.resultsScore, { color: colors.primary }]}>
              {score} / {quiz.questions.length}
            </Text>
            <Text style={[styles.resultsPercentage, { color: colors.textSecondary }]}>
              {percentage}% Correct
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.resultsActions}>
            <Pressable
              onPress={handleRetry}
              style={({ pressed }) => [
                styles.actionButton,
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.8 : 1
                },
                Shadow.card
              ]}
            >
              <Text style={styles.actionButtonText}>Try Again</Text>
            </Pressable>

            <Pressable
              onPress={handleClose}
              style={({ pressed }) => [
                styles.actionButton,
                styles.secondaryButton,
                {
                  backgroundColor: colors.cardBackground,
                  opacity: pressed ? 0.8 : 1
                },
                Shadow.card
              ]}
            >
              <Text style={[styles.actionButtonText, { color: colors.textPrimary }]}>
                Done
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const hasAnswer = userAnswers.has(currentQuestion.id);
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Progress */}
      <View style={[styles.progressContainer, { backgroundColor: colors.background }]}>
        <ProgressBar current={currentQuestionIndex + 1} total={quiz.questions.length} />
      </View>

      {/* Question */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <QuestionView
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={quiz.questions.length}
          userAnswer={userAnswers.get(currentQuestion.id)}
          showFeedback={showFeedback}
          onAnswerSelect={handleAnswerSelect}
          disabled={showFeedback}
        />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.separator }]}>
        <Pressable
          onPress={handleNext}
          disabled={!hasAnswer}
          style={({ pressed }) => [
            styles.nextButton,
            {
              backgroundColor: hasAnswer ? colors.primary : colors.separator,
              opacity: pressed ? 0.8 : 1
            }
          ]}
        >
          <Text style={styles.nextButtonText}>
            {showFeedback
              ? isLastQuestion
                ? 'See Results'
                : 'Next Question'
              : 'Check Answer'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorText: {
    ...Typography.title2
  },
  progressContainer: {
    paddingHorizontal: Spacing.medium,
    paddingTop: Spacing.medium,
    paddingBottom: Spacing.small
  },
  scrollView: {
    flex: 1
  },
  content: {
    padding: Spacing.medium,
    paddingBottom: Spacing.xxxLarge
  },
  bottomBar: {
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.medium,
    borderTopWidth: 1
  },
  nextButton: {
    paddingVertical: Spacing.medium,
    borderRadius: Radius.button,
    alignItems: 'center',
    minHeight: 56
  },
  nextButtonText: {
    ...Typography.body,
    fontWeight: '600',
    color: '#FFFFFF'
  },
  resultsContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxLarge
  },
  resultsEmoji: {
    fontSize: 80,
    marginBottom: Spacing.medium
  },
  resultsTitle: {
    ...Typography.largeTitle,
    marginBottom: Spacing.small
  },
  resultsScore: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: Spacing.tiny
  },
  resultsPercentage: {
    ...Typography.title2
  },
  resultsActions: {
    gap: Spacing.medium,
    marginTop: Spacing.large
  },
  actionButton: {
    paddingVertical: Spacing.medium,
    borderRadius: Radius.button,
    alignItems: 'center',
    minHeight: 56
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: 'transparent'
  },
  actionButtonText: {
    ...Typography.body,
    fontWeight: '600',
    color: '#FFFFFF'
  }
});
