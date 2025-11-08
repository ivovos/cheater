# Data Models

This document defines all data structures used in the Cheater application, with both Swift (iOS) and TypeScript (React Native) definitions.

## Table of Contents

1. [Homework Model](#homework-model)
2. [Quiz Model](#quiz-model)
3. [Question Model](#question-model)
4. [Quiz Attempt Model](#quiz-attempt-model)
5. [Progress Model](#progress-model)
6. [Claude API Response Model](#claude-api-response-model)

---

## Homework Model

Represents a homework assignment with metadata and progress tracking.

### Swift Definition

```swift
struct Homework: Identifiable, Codable {
    let id: UUID
    var title: String
    var subject: String?
    var imageURL: String
    var ocrText: String?
    let createdAt: Date

    // Progress info (denormalized for convenience)
    var bestScore: Int?
    var totalAttempts: Int
    var completionPercentage: Int
    var lastPlayedAt: Date?

    // Computed properties
    var progress: Double {
        Double(completionPercentage) / 100.0
    }
}
```

### TypeScript Definition

```typescript
export interface Homework {
  id: string;                    // UUID v4
  title: string;
  subject?: string;
  imageURL: string;              // Local file path or cloud URL
  ocrText?: string;              // May be null when using Vision API
  createdAt: Date;

  // Progress tracking (denormalized)
  bestScore?: number;            // Best score out of 10
  totalAttempts: number;         // Count of quiz attempts
  completionPercentage: number;  // 0-100
  lastPlayedAt?: Date;
}

// Helper functions
export function calculateProgress(homework: Homework): number {
  return homework.completionPercentage / 100;
}

export function generateHomeworkTitle(
  subject?: string,
  date: Date = new Date()
): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  if (subject) {
    return `${subject} - ${formatter.format(date)}`;
  }
  return `Homework - ${formatter.format(date)}`;
}
```

### Validation Rules

```typescript
export function validateHomework(hw: Partial<Homework>): string[] {
  const errors: string[] = [];

  if (!hw.title || hw.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (hw.title && hw.title.length > 100) {
    errors.push('Title must be 100 characters or less');
  }

  if (!hw.imageURL || hw.imageURL.trim().length === 0) {
    errors.push('Image URL is required');
  }

  if (hw.completionPercentage !== undefined) {
    if (hw.completionPercentage < 0 || hw.completionPercentage > 100) {
      errors.push('Completion percentage must be between 0 and 100');
    }
  }

  if (hw.totalAttempts !== undefined && hw.totalAttempts < 0) {
    errors.push('Total attempts cannot be negative');
  }

  if (hw.bestScore !== undefined) {
    if (hw.bestScore < 0 || hw.bestScore > 10) {
      errors.push('Best score must be between 0 and 10');
    }
  }

  return errors;
}
```

### Sample Data

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Maths - Algebra",
  "subject": "Mathematics",
  "imageURL": "file:///homework_images/550e8400.jpg",
  "ocrText": null,
  "createdAt": "2024-11-06T10:30:00Z",
  "bestScore": 8,
  "totalAttempts": 3,
  "completionPercentage": 80,
  "lastPlayedAt": "2024-11-06T15:45:00Z"
}
```

---

## Quiz Model

Represents a generated quiz with questions and classification metadata from Claude AI.

### Swift Definition

```swift
struct Quiz: Identifiable, Codable {
    let id: UUID
    let homeworkId: UUID
    let questions: [Question]
    let createdAt: Date

    // Classification metadata (from Claude Vision)
    let topic: String?
    let subtopic: String?
    let classificationConfidence: Double?

    // Computed properties
    var totalQuestions: Int {
        questions.count
    }

    var isValid: Bool {
        questions.count == 10 && questions.allSatisfy { $0.isValid }
    }

    var topicDisplay: String {
        guard let topic = topic else { return "General" }
        return topic.capitalized
    }
}
```

### TypeScript Definition

```typescript
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
```

### Validation Rules

```typescript
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
      const questionErrors = validateQuestion(q);
      questionErrors.forEach(err => {
        errors.push(`Question ${index + 1}: ${err}`);
      });
    });
  }

  if (quiz.classificationConfidence !== undefined) {
    if (quiz.classificationConfidence < 0 || quiz.classificationConfidence > 1) {
      errors.push('Classification confidence must be between 0 and 1');
    }
  }

  return errors;
}
```

### Sample Data

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "homeworkId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-11-06T10:30:15Z",
  "topic": "maths",
  "subtopic": "algebra",
  "classificationConfidence": 0.95,
  "questions": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "type": "mcq",
      "question": "Solve for x: 2x + 5 = 13",
      "options": ["x = 4", "x = 9", "x = 6.5", "x = 8"],
      "correctIndex": 0,
      "explanation": "Subtract 5 from both sides to get 2x = 8, then divide by 2 to get x = 4."
    }
  ]
}
```

---

## Question Model

Represents an individual quiz question supporting multiple types (MCQ, fill-blank, short-answer).

### Question Types

#### Swift Enum

```swift
enum QuestionType: String, Codable, Sendable {
    case mcq = "mcq"                    // Multiple choice (4 options)
    case fillBlank = "fillBlank"         // Fill in the blank (text input)
    case shortAnswer = "shortAnswer"     // Short answer essay (text area)
}
```

#### TypeScript Enum

```typescript
export enum QuestionType {
  MCQ = 'mcq',
  FillBlank = 'fillBlank',
  ShortAnswer = 'shortAnswer'
}
```

### Swift Definition

```swift
struct Question: Identifiable, Codable, Hashable, Sendable {
    let id: UUID
    let type: QuestionType
    let question: String

    // For MCQ only
    let options: [String]?              // Exactly 4 options
    let correctIndex: Int?              // 0-3 (A, B, C, D)

    // For fillBlank and shortAnswer
    let correctAnswer: String?

    let explanation: String             // Why the answer is correct

    // Computed properties
    var answer: String {
        switch type {
        case .mcq:
            guard let index = correctIndex,
                  let options = options,
                  index < options.count else {
                return ""
            }
            return options[index]
        case .fillBlank, .shortAnswer:
            return correctAnswer ?? ""
        }
    }

    var optionLabels: [String] {
        ["A", "B", "C", "D"]
    }

    var isValid: Bool {
        switch type {
        case .mcq:
            guard let options = options,
                  let correctIndex = correctIndex else {
                return false
            }
            return options.count == 4 &&
                   correctIndex >= 0 &&
                   correctIndex < 4
        case .fillBlank, .shortAnswer:
            guard let answer = correctAnswer else {
                return false
            }
            return !answer.isEmpty
        }
    }
}
```

### TypeScript Definition

```typescript
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
```

### Validation Rules

```typescript
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
```

### Sample Data

#### MCQ Question

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "type": "mcq",
  "question": "Solve for x: 2x + 5 = 13",
  "options": [
    "x = 4",
    "x = 9",
    "x = 6.5",
    "x = 8"
  ],
  "correctIndex": 0,
  "explanation": "Subtract 5 from both sides to get 2x = 8, then divide by 2 to get x = 4."
}
```

#### Fill-in-Blank Question

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440003",
  "type": "fillBlank",
  "question": "The capital of France is ___.",
  "correctAnswer": "Paris",
  "explanation": "Paris is the capital and largest city of France."
}
```

#### Short Answer Question

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440004",
  "type": "shortAnswer",
  "question": "Explain why we can't divide by zero.",
  "correctAnswer": "Division by zero is undefined because there is no number that, when multiplied by zero, gives a non-zero result.",
  "explanation": "Division is the inverse operation of multiplication, and zero times any number equals zero, making division by zero impossible to define consistently."
}
```

---

## Quiz Attempt Model

Records a completed quiz attempt with all answers and scoring information.

### Swift Definition

```swift
struct QuizAttempt: Identifiable, Codable {
    let id: UUID
    let quizId: UUID
    let homeworkId: UUID
    let score: Int
    let totalQuestions: Int
    let timeTakenSeconds: Int?
    let answers: [QuestionAnswer]
    let completedAt: Date

    // Computed properties
    var percentage: Int {
        guard totalQuestions > 0 else { return 0 }
        return Int((Double(score) / Double(totalQuestions)) * 100)
    }

    var passed: Bool {
        percentage >= 70
    }

    var gradeMessage: String {
        switch percentage {
        case 90...100:
            return "🎉 Excellent!"
        case 70..<90:
            return "👍 Great Job!"
        case 50..<70:
            return "👌 Good Effort!"
        default:
            return "💪 Keep Practicing!"
        }
    }
}

struct QuestionAnswer: Codable {
    let questionId: UUID
    let questionIndex: Int              // 0-9
    let selectedIndex: Int?             // For MCQ (0-3), null if skipped
    let correctIndex: Int
    let timeSpentSeconds: Int?

    var isCorrect: Bool {
        guard let selected = selectedIndex else { return false }
        return selected == correctIndex
    }
}
```

### TypeScript Definition

```typescript
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

// Helper functions
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
```

### Sample Data

```json
{
  "id": "880e8400-e29b-41d4-a716-446655440005",
  "quizId": "660e8400-e29b-41d4-a716-446655440001",
  "homeworkId": "550e8400-e29b-41d4-a716-446655440000",
  "score": 8,
  "totalQuestions": 10,
  "timeTakenSeconds": 154,
  "completedAt": "2024-11-06T15:45:00Z",
  "answers": [
    {
      "questionId": "770e8400-e29b-41d4-a716-446655440002",
      "questionIndex": 0,
      "selectedIndex": 0,
      "correctIndex": 0,
      "isCorrect": true,
      "timeSpentSeconds": 12
    },
    {
      "questionId": "770e8400-e29b-41d4-a716-446655440003",
      "questionIndex": 1,
      "selectedIndex": 2,
      "correctIndex": 1,
      "isCorrect": false,
      "timeSpentSeconds": 18
    }
  ]
}
```

---

## Progress Model

Tracks aggregate progress for a homework assignment (denormalized for performance).

### TypeScript Definition

```typescript
export interface Progress {
  id: string;                    // UUID v4
  homeworkId: string;            // Foreign key
  completionPercentage: number;  // 0-100 (highest achieved)
  bestScore: number;             // Best score out of 10
  totalAttempts: number;         // Count of completed quizzes
  lastPlayedAt?: Date;
}

// Helper functions
export function updateProgressFromAttempt(
  progress: Progress,
  attempt: QuizAttempt
): Progress {
  const percentage = calculatePercentage(attempt);

  return {
    ...progress,
    completionPercentage: Math.max(progress.completionPercentage, percentage),
    bestScore: Math.max(progress.bestScore, attempt.score),
    totalAttempts: progress.totalAttempts + 1,
    lastPlayedAt: new Date()
  };
}
```

---

## Claude API Response Model

The structure returned by Claude Vision API.

### TypeScript Definition

```typescript
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

// Conversion function
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
```

---

## Type Guards

Helpful TypeScript type guards for runtime type checking.

```typescript
export function isHomework(obj: any): obj is Homework {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.imageURL === 'string' &&
    obj.createdAt instanceof Date
  );
}

export function isQuiz(obj: any): obj is Quiz {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.homeworkId === 'string' &&
    Array.isArray(obj.questions) &&
    obj.createdAt instanceof Date
  );
}

export function isQuestion(obj: any): obj is Question {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.type === 'string' &&
    typeof obj.question === 'string' &&
    typeof obj.explanation === 'string'
  );
}
```

---

## Summary

All models follow consistent patterns:
- UUIDs for IDs
- ISO 8601 dates
- Optional fields marked with `?`
- Validation functions for each model
- Helper/computed properties
- Type safety (TypeScript/Swift)

Next: [API Integration](./02-API-INTEGRATION.md)
