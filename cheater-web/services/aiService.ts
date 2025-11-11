/**
 * AIService - Claude Vision API Integration (Web Version)
 * Simplified for Next.js web environment
 */

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import {
  Quiz,
  ClaudeResponse,
  convertClaudeResponseToQuiz,
  AIError,
  AIServiceError
} from '../types';

export class AIService {
  private apiKey: string;
  private apiURL = 'https://api.anthropic.com/v1/messages';
  private model = 'claude-sonnet-4-5-20250929';
  private maxTokens = 4096;
  private timeout = 60000; // 60 seconds

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '';

    // Debug logging
    if (this.apiKey) {
      console.log('✅ API Key loaded:', this.apiKey.substring(0, 10) + '...');
    } else {
      console.error('❌ API Key missing! Check .env.local file.');
    }
  }

  /**
   * Generate quiz from image using Claude Vision API (via Next.js API route)
   */
  async generateQuiz(
    imageUri: string
  ): Promise<{ quiz: Quiz; title: string; subject?: string }> {
    console.log('🚀 Starting quiz generation...');

    try {
      // 1. Process image to base64
      console.log('📸 Processing image...');
      const base64Image = await this.convertImageToBase64(imageUri);

      // 2. Call Next.js API route (server-side proxy to avoid CORS)
      console.log('📤 Sending request to API route...');
      const response = await axios.post(
        '/api/generate-quiz',
        {
          imageBase64: base64Image
        },
        {
          timeout: this.timeout
        }
      );

      console.log('✅ Received response from API');

      // 3. Parse response (includes quiz + title + subject)
      const result = this.parseQuizResponse(response.data);
      console.log('✨ Quiz generated successfully');
      console.log(`📝 Title: ${result.title}`);
      console.log(`📚 Subject: ${result.subject}`);

      return result;
    } catch (error) {
      throw this.handleAPIError(error);
    }
  }

  /**
   * Convert image to base64 using Canvas API
   */
  private async convertImageToBase64(imageUri: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          // Calculate new dimensions (max 1280px)
          let width = img.width;
          let height = img.height;
          const maxDim = 1280;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          // Create canvas and resize
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            throw new Error('Could not get canvas context');
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Convert to JPEG base64 (0.75 quality)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.75);

          // Extract base64 data (remove "data:image/jpeg;base64," prefix)
          const base64 = dataUrl.split(',')[1];

          // Log size for monitoring
          const sizeKB = Math.round((base64.length * 3) / 4 / 1024);
          console.log(`📸 Image size: ${sizeKB}KB (${width}x${height})`);

          resolve(base64);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = imageUri;
    });
  }

  /**
   * Build prompt for quiz generation
   */
  private buildPrompt(subject?: string): string {
    return `You are an expert educational AI that generates high-quality quiz questions from homework assignments.

Analyze this homework image and generate exactly 10 quiz questions.

${subject ? `The subject is: ${subject}` : 'Auto-detect the subject.'}

Return ONLY a JSON object with this exact structure:
{
  "topic": "maths" | "english" | "science" | "history" | "generic",
  "subtopic": "specific topic (e.g., algebra, grammar)",
  "confidence": 0.0-1.0,
  "questions": [
    {
      "type": "mcq" | "fillBlank" | "shortAnswer",
      "question": "Question text",
      "options": ["A", "B", "C", "D"],  // Only for MCQ
      "correctIndex": 0-3,  // Only for MCQ
      "correctAnswer": "answer",  // For fillBlank and shortAnswer
      "explanation": "Brief explanation"
    }
  ]
}

Requirements:
- Exactly 10 questions
- Mix of question types: ~60% MCQ, ~30% fill-blank, ~10% short-answer
- MCQ must have exactly 4 options
- All questions must have explanations
- Questions should test understanding, not just memorization`;
  }

  /**
   * Parse quiz response from Claude API
   */
  private parseQuizResponse(apiResponse: any): { quiz: Quiz; title: string; subject?: string } {
    try {
      // 1. Extract text from content array
      if (!apiResponse.content || !Array.isArray(apiResponse.content)) {
        throw new Error('Invalid API response structure');
      }

      const textContent = apiResponse.content.find((c: any) => c.type === 'text');
      if (!textContent || !textContent.text) {
        throw new Error('No text content in API response');
      }

      const text = textContent.text;

      // 2. Remove markdown code blocks if present
      const cleanedText = text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      // 3. Find JSON object boundaries
      const jsonStart = cleanedText.indexOf('{');
      const jsonEnd = cleanedText.lastIndexOf('}') + 1;

      if (jsonStart === -1 || jsonEnd === 0) {
        console.error('❌ No JSON object found in response');
        throw new Error('No JSON object found in response');
      }

      const jsonString = cleanedText.substring(jsonStart, jsonEnd);

      // 4. Parse JSON
      const parsed: any = JSON.parse(jsonString);

      // 5. Validate structure
      if (!parsed.questions || parsed.questions.length !== 10) {
        throw new Error(
          `Expected 10 questions, got ${parsed.questions?.length || 0}`
        );
      }

      // 6. Extract title and subject
      const title = parsed.title || 'Homework Assignment';
      const subject = parsed.subject;

      // 7. Convert to Quiz model
      const quiz = convertClaudeResponseToQuiz(parsed, ''); // homeworkId set by caller

      console.log(`✅ Quiz validated: ${quiz.questions.length} questions`);
      console.log(`📚 Topic: ${quiz.topic || 'generic'}`);

      return { quiz, title, subject };
    } catch (error) {
      console.error('❌ Parsing error:', error);
      throw new AIServiceError(
        AIError.ParsingError,
        error instanceof Error ? error.message : 'Failed to parse quiz response'
      );
    }
  }

  /**
   * Handle API errors
   */
  private handleAPIError(error: any): AIServiceError {
    // Log the full error for debugging
    console.error('❌ API Error Details:', {
      code: error.code,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    // Timeout
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return new AIServiceError(
        AIError.Timeout,
        'Request timed out after 60 seconds'
      );
    }

    // Network errors
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return new AIServiceError(
        AIError.NetworkError,
        'Could not connect to API. Check your internet connection.'
      );
    }

    // HTTP errors
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;

      switch (status) {
        case 401:
          return new AIServiceError(
            AIError.MissingAPIKey,
            `Invalid or missing API key. ${errorData?.error?.message || ''}`,
            401
          );
        case 429:
          return new AIServiceError(
            AIError.QuotaExceeded,
            'Rate limit exceeded. Please wait and try again.',
            429
          );
        case 500:
        case 502:
        case 503:
        case 504:
          return new AIServiceError(
            AIError.ServerError,
            `Server error (${status}). Please try again later.`,
            status
          );
        default:
          return new AIServiceError(
            AIError.InvalidResponse,
            `Unexpected status code: ${status}. ${errorData?.error?.message || ''}`,
            status
          );
      }
    }

    // AIServiceError passthrough
    if (error instanceof AIServiceError) {
      return error;
    }

    // Unknown errors
    return new AIServiceError(
      AIError.NetworkError,
      error.message || 'Unknown error occurred'
    );
  }
}

// Export singleton instance
export const aiService = new AIService();
