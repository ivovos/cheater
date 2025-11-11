/**
 * Homework and Progress types
 * Based on docs/01-DATA-MODELS.md
 */

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

// Validation
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

// Type guard
export function isHomework(obj: any): obj is Homework {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.imageURL === 'string' &&
    obj.createdAt instanceof Date
  );
}
