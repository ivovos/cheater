/**
 * Quiz Store
 * Manages quiz state, current question, answers, and scoring
 * Uses Zustand for state management
 */

import { create } from 'zustand';
import { Quiz, Question } from '../types';
import { QuizDB } from '../services/quizDB';
import { aiService } from '../services/aiService';

interface QuizState {
  // State
  currentQuiz: Quiz | null;
  currentQuestionIndex: number;
  userAnswers: Map<string, string | number>; // questionId -> answer
  isLoading: boolean;
  error: string | null;
  showResults: boolean;
  score: number;

  // Actions
  loadQuiz: (homeworkId: string) => Promise<Quiz | null>;
  generateQuiz: (imageUri: string, homeworkId: string, subject?: string) => Promise<Quiz>;
  startQuiz: () => void;
  answerQuestion: (questionId: string, answer: string | number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  submitQuiz: () => Promise<void>;
  resetQuiz: () => void;
  clearError: () => void;

  // Getters
  getCurrentQuestion: () => Question | null;
  getAnswerForQuestion: (questionId: string) => string | number | undefined;
  isQuestionAnswered: (questionId: string) => boolean;
  canGoNext: () => boolean;
  canGoPrevious: () => boolean;
  getProgress: () => number;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  // Initial state
  currentQuiz: null,
  currentQuestionIndex: 0,
  userAnswers: new Map(),
  isLoading: false,
  error: null,
  showResults: false,
  score: 0,

  // Load existing quiz
  loadQuiz: async (homeworkId: string) => {
    set({ isLoading: true, error: null });

    try {
      const quiz = await QuizDB.getByHomeworkId(homeworkId);
      set({ currentQuiz: quiz, isLoading: false });
      return quiz;
    } catch (error: any) {
      console.error('Error loading quiz:', error);
      set({
        error: error.message || 'Failed to load quiz',
        isLoading: false
      });
      return null;
    }
  },

  // Generate new quiz
  generateQuiz: async (imageUri: string, homeworkId: string, subject?: string) => {
    set({ isLoading: true, error: null });

    try {
      // Generate quiz using AI service
      const quiz = await aiService.generateQuiz(imageUri, subject);
      quiz.homeworkId = homeworkId;

      // Save to database
      await QuizDB.create(quiz);

      set({ currentQuiz: quiz, isLoading: false });
      return quiz;
    } catch (error: any) {
      console.error('Error generating quiz:', error);
      set({
        error: error.message || 'Failed to generate quiz',
        isLoading: false
      });
      throw error;
    }
  },

  // Start quiz
  startQuiz: () => {
    set({
      currentQuestionIndex: 0,
      userAnswers: new Map(),
      showResults: false,
      score: 0
    });
  },

  // Answer current question
  answerQuestion: (questionId: string, answer: string | number) => {
    const { userAnswers } = get();
    const newAnswers = new Map(userAnswers);
    newAnswers.set(questionId, answer);
    set({ userAnswers: newAnswers });
  },

  // Next question
  nextQuestion: () => {
    const { currentQuestionIndex, currentQuiz } = get();
    if (currentQuiz && currentQuestionIndex < currentQuiz.questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  // Previous question
  previousQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },

  // Submit quiz
  submitQuiz: async () => {
    const { currentQuiz, userAnswers } = get();

    if (!currentQuiz) {
      set({ error: 'No quiz loaded' });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      // Calculate score
      let score = 0;
      const answers: Array<{
        questionId: string;
        userAnswer: string | number;
        correct: boolean;
      }> = [];

      currentQuiz.questions.forEach((question) => {
        const userAnswer = userAnswers.get(question.id);
        let correct = false;

        if (userAnswer !== undefined) {
          if (question.type === 'mcq' && typeof userAnswer === 'number') {
            correct = userAnswer === question.correctIndex;
          } else if (
            (question.type === 'fillBlank' || question.type === 'shortAnswer') &&
            typeof userAnswer === 'string'
          ) {
            // Case-insensitive comparison, trim whitespace
            const normalizedUser = userAnswer.trim().toLowerCase();
            const normalizedCorrect = question.correctAnswer?.trim().toLowerCase() || '';
            correct = normalizedUser === normalizedCorrect;
          }
        }

        if (correct) score++;

        answers.push({
          questionId: question.id,
          userAnswer: userAnswer as string | number,
          correct
        });
      });

      // Save attempt to database
      await QuizDB.saveAttempt(currentQuiz.id, score, answers);

      // Update homework progress
      await QuizDB.updateProgress(currentQuiz.homeworkId, score);

      set({
        score,
        showResults: true,
        isLoading: false
      });
    } catch (error: any) {
      console.error('Error submitting quiz:', error);
      set({
        error: error.message || 'Failed to submit quiz',
        isLoading: false
      });
    }
  },

  // Reset quiz
  resetQuiz: () => {
    set({
      currentQuiz: null,
      currentQuestionIndex: 0,
      userAnswers: new Map(),
      showResults: false,
      score: 0,
      error: null
    });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Get current question
  getCurrentQuestion: () => {
    const { currentQuiz, currentQuestionIndex } = get();
    return currentQuiz?.questions[currentQuestionIndex] || null;
  },

  // Get answer for question
  getAnswerForQuestion: (questionId: string) => {
    const { userAnswers } = get();
    return userAnswers.get(questionId);
  },

  // Check if question is answered
  isQuestionAnswered: (questionId: string) => {
    const { userAnswers } = get();
    return userAnswers.has(questionId);
  },

  // Can go to next question
  canGoNext: () => {
    const { currentQuestionIndex, currentQuiz } = get();
    return (
      currentQuiz !== null &&
      currentQuestionIndex < currentQuiz.questions.length - 1
    );
  },

  // Can go to previous question
  canGoPrevious: () => {
    const { currentQuestionIndex } = get();
    return currentQuestionIndex > 0;
  },

  // Get progress (percentage)
  getProgress: () => {
    const { userAnswers, currentQuiz } = get();
    if (!currentQuiz) return 0;
    return (userAnswers.size / currentQuiz.questions.length) * 100;
  }
}));
