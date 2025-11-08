/**
 * AIService - Claude Vision API Integration
 * Ported from Cheater-iOS/Services/AIService.swift
 * Based on docs/02-API-INTEGRATION.md
 */

import axios, { AxiosError } from 'axios';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { v4 as uuidv4 } from 'uuid';
import { PromptManager } from './promptManager';
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
  private proxyURL = 'http://localhost:3001/api/generate-quiz'; // Development proxy server
  private model = 'claude-sonnet-4-20250514';
  private maxTokens = 4096;
  private timeout = 60000; // 60 seconds
  private isWeb: boolean;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY || '';

    // Detect if running on web
    this.isWeb = typeof window !== 'undefined' && typeof document !== 'undefined';

    if (!this.apiKey && !this.isWeb) {
      console.warn('⚠️  Anthropic API key not found. AIService will not work.');
    }
  }

  /**
   * Generate quiz from image using Claude Vision API
   */
  async generateQuiz(
    imageUri: string,
    subject?: string
  ): Promise<Quiz> {
    console.log('🚀 Starting quiz generation...');

    // Only check API key on native (web uses proxy)
    if (!this.apiKey && !this.isWeb) {
      throw new AIServiceError(
        AIError.MissingAPIKey,
        'API key is missing. Please set EXPO_PUBLIC_ANTHROPIC_API_KEY.'
      );
    }

    try {
      // 1. Process image
      console.log('📸 Processing image...');
      const base64Image = await this.convertImageToBase64(imageUri);

      // 2. Build prompt
      console.log('📝 Building prompt...');
      const prompt = PromptManager.buildVisionPrompt(subject, 'generic');

      // 3. Make API request (use proxy on web, direct on native)
      console.log('📤 Sending request to Claude Vision API...');

      let response;
      if (this.isWeb) {
        // Web: Use serverless proxy to avoid CORS
        console.log('🌐 Using proxy endpoint for web...');
        response = await axios.post(
          this.proxyURL,
          {
            image: base64Image,
            prompt: prompt
          },
          {
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: this.timeout
          }
        );
      } else {
        // Native: Direct API call
        console.log('📱 Using direct API call for native...');
        response = await axios.post(
          this.apiURL,
          {
            model: this.model,
            max_tokens: this.maxTokens,
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'image',
                    source: {
                      type: 'base64',
                      media_type: 'image/jpeg',
                      data: base64Image
                    }
                  },
                  {
                    type: 'text',
                    text: prompt
                  }
                ]
              }
            ]
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': this.apiKey,
              'anthropic-version': '2023-06-01'
            },
            timeout: this.timeout
          }
        );
      }

      console.log('✅ Received response from API');
      console.log('📊 Token usage:', response.data.usage);

      // 4. Parse response
      const quiz = this.parseQuizResponse(response.data);
      console.log('✨ Quiz generated successfully');

      return quiz;
    } catch (error) {
      throw this.handleAPIError(error);
    }
  }

  /**
   * Convert image to base64 with resizing and compression
   * Max dimension: 1280px, Quality: 75%
   */
  private async convertImageToBase64(imageUri: string): Promise<string> {
    try {
      // Web platform: Use browser APIs
      if (imageUri.startsWith('blob:') || imageUri.startsWith('data:')) {
        return await this.convertImageToBase64Web(imageUri);
      }

      // Native platform: Use Expo APIs
      // 1. Resize image to max 1280px (maintains aspect ratio)
      const resized = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 1280 } }], // Height auto-calculated
        {
          compress: 0.75, // 75% quality
          format: ImageManipulator.SaveFormat.JPEG
        }
      );

      // 2. Read as base64
      const base64 = await FileSystem.readAsStringAsync(
        resized.uri,
        { encoding: FileSystem.EncodingType.Base64 }
      );

      // Log size for monitoring
      const sizeKB = Math.round((base64.length * 3) / 4 / 1024);
      console.log(`📸 Image size: ${sizeKB}KB`);

      return base64;
    } catch (error) {
      console.error('❌ Image processing failed:', error);
      throw new AIServiceError(
        AIError.InvalidRequest,
        'Failed to process image'
      );
    }
  }

  /**
   * Convert image to base64 on web using Canvas API
   */
  private async convertImageToBase64Web(imageUri: string): Promise<string> {
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
   * Parse quiz response from Claude API
   * Handles markdown code blocks and validates structure
   */
  private parseQuizResponse(apiResponse: any): Quiz {
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
        console.error('Response text:', cleanedText.substring(0, 500));
        throw new Error('No JSON object found in response');
      }

      const jsonString = cleanedText.substring(jsonStart, jsonEnd);

      // 4. Parse JSON
      const parsed: ClaudeResponse = JSON.parse(jsonString);

      // 5. Validate structure
      if (!parsed.questions || parsed.questions.length !== 10) {
        throw new Error(
          `Expected 10 questions, got ${parsed.questions?.length || 0}`
        );
      }

      // 6. Validate each question
      parsed.questions.forEach((q, index) => {
        const type = q.type || 'mcq';

        if (type === 'mcq') {
          if (!q.options || q.options.length !== 4) {
            throw new Error(
              `Question ${index + 1}: MCQ must have 4 options, got ${q.options?.length || 0}`
            );
          }
          if (q.correctIndex === undefined || q.correctIndex < 0 || q.correctIndex > 3) {
            throw new Error(
              `Question ${index + 1}: Invalid correctIndex ${q.correctIndex}`
            );
          }
        } else {
          if (!q.correctAnswer || q.correctAnswer.trim().length === 0) {
            throw new Error(
              `Question ${index + 1}: Missing correctAnswer for ${type}`
            );
          }
        }

        if (!q.explanation || q.explanation.trim().length === 0) {
          throw new Error(
            `Question ${index + 1}: Missing explanation`
          );
        }
      });

      // 7. Convert to Quiz model
      const quiz = convertClaudeResponseToQuiz(parsed, ''); // homeworkId set by caller

      console.log(`✅ Quiz validated: ${quiz.questions.length} questions`);
      console.log(`📚 Topic: ${quiz.topic || 'generic'}`);
      console.log(`🎯 Confidence: ${quiz.classificationConfidence || 'N/A'}`);

      return quiz;
    } catch (error) {
      console.error('❌ Parsing error:', error);
      throw new AIServiceError(
        AIError.ParsingError,
        error instanceof Error ? error.message : 'Failed to parse quiz response'
      );
    }
  }

  /**
   * Handle API errors and convert to user-friendly messages
   */
  private handleAPIError(error: any): AIServiceError {
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

      switch (status) {
        case 400:
          return new AIServiceError(
            AIError.InvalidRequest,
            'Invalid request format',
            400
          );

        case 401:
          return new AIServiceError(
            AIError.MissingAPIKey,
            'Invalid or missing API key',
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
            `Unexpected status code: ${status}`,
            status
          );
      }
    }

    // AIServiceError passthrough
    if (error instanceof AIServiceError) {
      return error;
    }

    // Unknown errors
    console.error('❌ Unknown error:', error);
    return new AIServiceError(
      AIError.NetworkError,
      error.message || 'Unknown error occurred'
    );
  }
}

/**
 * Retry logic wrapper
 */
export async function generateQuizWithRetry(
  aiService: AIService,
  imageUri: string,
  subject?: string,
  maxRetries: number = 3
): Promise<Quiz> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${maxRetries}`);
      return await aiService.generateQuiz(imageUri, subject);
    } catch (error) {
      lastError = error as Error;

      // Don't retry certain errors
      if (
        error instanceof AIServiceError &&
        (error.type === AIError.MissingAPIKey ||
         error.type === AIError.InvalidRequest ||
         error.type === AIError.ParsingError)
      ) {
        throw error;
      }

      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('All retry attempts failed');
}

// Export singleton instance
export const aiService = new AIService();
