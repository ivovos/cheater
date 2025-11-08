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

// Validation
export function validateQuiz(quiz: Partial<Quiz>): string[] {
  const errors: string[] = [];

  if (!quiz.homeworkId) {
    errors.push('Homework ID is required');
  }

  if (!quiz.questions || quiz.questions.length !== 10) {
    errors.push('Quiz must have exactly 10 questions');
  }

  if (quiz.questions) {
    quiz.questions.forEach((q, index) => {
      const questionErrors = isValidQuestion(q);
      if (!questionErrors) {
        errors.push(`Question ${index + 1}: Invalid question structure`);
      }
    });
  }

  if (quiz.classificationConfidence !== undefined) {
    if (quiz.classificationConfidence < 0 || quiz.classificationConfidence > 1) {
      errors.push('Classification confidence must be between 0 and 1');
    }
  }

  return errors;
}

// Type guard
export function isQuiz(obj: any): obj is Quiz {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.homeworkId === 'string' &&
    Array.isArray(obj.questions) &&
    obj.createdAt instanceof Date
  );
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
  answers: QuestionAnswer[];
  completedAt: Date;
}

export interface QuestionAnswer {
  questionId: string;
  questionIndex: number;         // 0-9
  selectedIndex?: number;        // For MCQ (0-3), undefined if skipped
  correctIndex: number;          // The correct answer index
  isCorrect: boolean;
  timeSpentSeconds?: number;
}

// Helper functions for QuizAttempt
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

export function formatTime(seconds?: number): string {
  if (!seconds) return '--:--';

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
