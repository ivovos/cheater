/**
 * Quiz types and interfaces
 * Based on docs/01-DATA-MODELS.md
 */

import { Question, isValidQuestion } from './question';

export interface Quiz {
  id: string;                    // UUID v4
  homeworkId: string;            // Foreign key to Homework
  questions: Question[];         // Array of exactly 10 questions
  createdAt: Date;

  // Classification metadata (from Claude Vision API)
  topic?: string;                // "maths", "english", "science", "history", "generic"
  subtopic?: string;             // e.g., "algebra", "grammar", "biology", "world_war_2"
  classificationConfidence?: number; // 0.0 - 1.0
}

// Helper functions
export function getTotalQuestions(quiz: Quiz): number {
  return quiz.questions.length;
}

export function isValidQuiz(quiz: Quiz): boolean {
  return quiz.questions.length === 10 &&
         quiz.questions.every(q => isValidQuestion(q));
}

export function getTopicDisplay(quiz: Quiz): string {
  if (!quiz.topic) return 'General';

  const topicMap: Record<string, string> = {
    maths: 'Maths',
    english: 'English',
    science: 'Science',
    history: 'History',
    generic: 'General'
  };

  return topicMap[quiz.topic] || quiz.topic.charAt(0).toUpperCase() + quiz.topic.slice(1);
}

/**
 * Quiz Attempt - Records a completed quiz attempt
 */
export interface QuizAttempt {
  id: string;                    // UUID v4
  quizId: string;
  homeworkId: string;
  score: number;                 // Number of correct answers
  totalQuestions: number;        // Always 10
  timeTakenSeconds?: number;     // Total time in seconds
  completedAt: Date;
}

export function calculatePercentage(attempt: QuizAttempt): number {
  if (attempt.totalQuestions === 0) return 0;
  return Math.round((attempt.score / attempt.totalQuestions) * 100);
}

export function hasPassed(attempt: QuizAttempt): boolean {
  return calculatePercentage(attempt) >= 70;
}

export function getGradeMessage(attempt: QuizAttempt): string {
  const percentage = calculatePercentage(attempt);

  if (percentage >= 90) return '🎉 Excellent!';
  if (percentage >= 70) return '👍 Great Job!';
  if (percentage >= 50) return '👌 Good Effort!';
  return '💪 Keep Practicing!';
}
