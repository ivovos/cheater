/**
 * Claude API Response types
 * Based on docs/01-DATA-MODELS.md and docs/02-API-INTEGRATION.md
 */

import { v4 as uuidv4 } from 'uuid';
import { Quiz } from './quiz';
import { QuestionType } from './question';

/**
 * Claude Vision API Response Structure
 */
export interface ClaudeResponse {
  topic?: string;                // "maths", "english", etc.
  subtopic?: string;             // "algebra", "grammar", etc.
  confidence?: number;           // 0.0 - 1.0
  questions: ClaudeQuestion[];   // Exactly 10
}

export interface ClaudeQuestion {
  type?: string;                 // "mcq", "fillBlank", "shortAnswer"
  question: string;

  // For MCQ
  options?: string[];            // 4 options
  correctIndex?: number;         // 0-3

  // For fill-blank and short-answer
  correctAnswer?: string;

  explanation: string;
}

/**
 * Conversion function from Claude response to Quiz model
 */
export function convertClaudeResponseToQuiz(
  response: ClaudeResponse,
  homeworkId: string
): Quiz {
  return {
    id: uuidv4(),
    homeworkId,
    createdAt: new Date(),
    topic: response.topic,
    subtopic: response.subtopic,
    classificationConfidence: response.confidence,
    questions: response.questions.map(q => ({
      id: uuidv4(),
      type: (q.type as QuestionType) || QuestionType.MCQ,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation
    }))
  };
}

/**
 * AI Service Error Types
 */
export enum AIError {
  MissingAPIKey = 'MISSING_API_KEY',
  InvalidRequest = 'INVALID_REQUEST',
  NetworkError = 'NETWORK_ERROR',
  InvalidResponse = 'INVALID_RESPONSE',
  ParsingError = 'PARSING_ERROR',
  QuotaExceeded = 'QUOTA_EXCEEDED',
  ServerError = 'SERVER_ERROR',
  Timeout = 'TIMEOUT'
}

export class AIServiceError extends Error {
  constructor(
    public type: AIError,
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AIServiceError';
  }
}

/**
 * User-facing error messages
 */
export function getUserErrorMessage(error: AIServiceError): {
  title: string;
  message: string;
  suggestion: string;
} {
  switch (error.type) {
    case AIError.MissingAPIKey:
      return {
        title: 'Configuration Error',
        message: 'API key is missing or invalid',
        suggestion: 'Please contact support or check your settings'
      };

    case AIError.QuotaExceeded:
      return {
        title: 'Rate Limit Reached',
        message: "You've reached your API usage limit",
        suggestion: 'Please wait a few minutes and try again'
      };

    case AIError.NetworkError:
      return {
        title: 'Connection Failed',
        message: 'Could not connect to AI service',
        suggestion: 'Check your internet connection and try again'
      };

    case AIError.Timeout:
      return {
        title: 'Request Timeout',
        message: 'The request took too long to complete',
        suggestion: 'Try again with a clearer photo'
      };

    case AIError.ParsingError:
      return {
        title: 'Quiz Generation Failed',
        message: 'Could not generate quiz from this image',
        suggestion: 'Try taking a clearer photo or different homework'
      };

    default:
      return {
        title: 'Unexpected Error',
        message: 'Something went wrong',
        suggestion: 'Please try again or contact support'
      };
  }
}
