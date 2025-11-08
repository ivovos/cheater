/**
 * Question types and interfaces
 * Based on docs/01-DATA-MODELS.md
 */

export enum QuestionType {
  MCQ = 'mcq',
  FillBlank = 'fillBlank',
  ShortAnswer = 'shortAnswer'
}

export interface Question {
  id: string;                    // UUID v4
  type: QuestionType;
  question: string;              // The question text

  // For MCQ only
  options?: string[];            // Exactly 4 options (A, B, C, D)
  correctIndex?: number;         // 0-3

  // For fillBlank and shortAnswer
  correctAnswer?: string;

  explanation: string;           // 1-2 sentence explanation
}

// Helper functions
export function getAnswer(question: Question): string {
  switch (question.type) {
    case QuestionType.MCQ:
      if (question.options &&
          question.correctIndex !== undefined &&
          question.correctIndex < question.options.length) {
        return question.options[question.correctIndex];
      }
      return '';

    case QuestionType.FillBlank:
    case QuestionType.ShortAnswer:
      return question.correctAnswer || '';
  }
}

export function getOptionLabel(index: number): string {
  return ['A', 'B', 'C', 'D'][index] || '';
}

export function isValidQuestion(question: Question): boolean {
  switch (question.type) {
    case QuestionType.MCQ:
      return !!(
        question.options &&
        question.options.length === 4 &&
        question.correctIndex !== undefined &&
        question.correctIndex >= 0 &&
        question.correctIndex < 4
      );

    case QuestionType.FillBlank:
    case QuestionType.ShortAnswer:
      return !!(question.correctAnswer && question.correctAnswer.trim().length > 0);
  }
}

// Validation
export function validateQuestion(q: Partial<Question>): string[] {
  const errors: string[] = [];

  if (!q.type) {
    errors.push('Question type is required');
  }

  if (!q.question || q.question.trim().length === 0) {
    errors.push('Question text is required');
  }

  if (!q.explanation || q.explanation.trim().length === 0) {
    errors.push('Explanation is required');
  }

  if (q.type === QuestionType.MCQ) {
    if (!q.options || q.options.length !== 4) {
      errors.push('MCQ must have exactly 4 options');
    }

    if (q.correctIndex === undefined || q.correctIndex < 0 || q.correctIndex > 3) {
      errors.push('MCQ must have valid correctIndex (0-3)');
    }

    if (q.options) {
      q.options.forEach((opt, i) => {
        if (!opt || opt.trim().length === 0) {
          errors.push(`Option ${i + 1} cannot be empty`);
        }
      });
    }
  }

  if (q.type === QuestionType.FillBlank || q.type === QuestionType.ShortAnswer) {
    if (!q.correctAnswer || q.correctAnswer.trim().length === 0) {
      errors.push(`${q.type} must have a correctAnswer`);
    }
  }

  return errors;
}

// Type guards
export function isQuestion(obj: any): obj is Question {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.type === 'string' &&
    typeof obj.question === 'string' &&
    typeof obj.explanation === 'string'
  );
}
