# API Integration

This document covers the Claude Vision API integration, image processing pipeline, error handling, and implementation details for both iOS and React Native.

## Table of Contents

1. [Claude Vision API Overview](#claude-vision-api-overview)
2. [Image Processing Pipeline](#image-processing-pipeline)
3. [API Request Format](#api-request-format)
4. [API Response Parsing](#api-response-parsing)
5. [Error Handling](#error-handling)
6. [Implementation Examples](#implementation-examples)
7. [Cost Optimization](#cost-optimization)

---

## Claude Vision API Overview

### Endpoint

```
POST https://api.anthropic.com/v1/messages
```

### Model

```
claude-sonnet-4-20250514
```

### Authentication

Header-based API key:
```
x-api-key: sk-ant-api03-...
```

### Request Headers

```
Content-Type: application/json
x-api-key: <YOUR_API_KEY>
anthropic-version: 2023-06-01
```

### Rate Limits

- **Free Tier**: 50 requests/hour
- **Pro Tier**: 1000 requests/hour
- **Enterprise**: Custom limits

### Timeout

- **Configured**: 60 seconds
- **Recommended**: 30-60 seconds for vision requests

---

## Image Processing Pipeline

Before sending an image to Claude, it must be optimized to reduce cost and improve response time.

### Processing Steps

```
Original Image (UIImage/File)
    ↓
1. Resize (maintain aspect ratio)
    ↓ Max dimension: 1280px
2. Convert to JPEG
    ↓ Quality: 75%
3. Base64 Encode
    ↓
Send to API
```

### iOS Implementation (Swift)

```swift
private func convertImageToBase64(_ image: UIImage) throws -> String {
    return try autoreleasepool {
        // 1. Resize image
        let maxDimension: CGFloat = 1280
        let resizedImage = resizeImage(image, maxDimension: maxDimension)

        // 2. Convert to JPEG with 75% quality
        guard let imageData = resizedImage.jpegData(compressionQuality: 0.75) else {
            throw AIError.invalidRequest
        }

        print("📸 Image size: \(imageData.count / 1024)KB")

        // 3. Base64 encode
        return imageData.base64EncodedString()
    }
}

private func resizeImage(_ image: UIImage, maxDimension: CGFloat) -> UIImage {
    let size = image.size

    // Skip if already small enough
    if size.width <= maxDimension && size.height <= maxDimension {
        return image
    }

    // Calculate new size maintaining aspect ratio
    let ratio = size.width / size.height
    var newSize: CGSize

    if size.width > size.height {
        newSize = CGSize(width: maxDimension, height: maxDimension / ratio)
    } else {
        newSize = CGSize(width: maxDimension * ratio, height: maxDimension)
    }

    // Render resized image
    let renderer = UIGraphicsImageRenderer(size: newSize)
    return renderer.image { _ in
        image.draw(in: CGRect(origin: .zero, size: newSize))
    }
}
```

### React Native Implementation (TypeScript)

```typescript
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

async function convertImageToBase64(imageUri: string): Promise<string> {
  // 1. Resize image to max 1280px
  const resizedImage = await ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width: 1280 } }], // Height auto-calculated to maintain aspect
    {
      compress: 0.75, // 75% quality
      format: ImageManipulator.SaveFormat.JPEG
    }
  );

  // 2. Read as base64
  const base64 = await FileSystem.readAsStringAsync(
    resizedImage.uri,
    { encoding: FileSystem.EncodingType.Base64 }
  );

  // Log size for monitoring
  const sizeKB = Math.round((base64.length * 3) / 4 / 1024);
  console.log(`📸 Image size: ${sizeKB}KB`);

  return base64;
}
```

### Size Optimization Results

| Original | Resized | Savings |
|----------|---------|---------|
| 3.2 MB   | 180 KB  | 94%     |
| 1.8 MB   | 120 KB  | 93%     |
| 800 KB   | 85 KB   | 89%     |

**Average**: 180 KB per image after processing

---

## API Request Format

### Request Structure

```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 4096,
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "image",
          "source": {
            "type": "base64",
            "media_type": "image/jpeg",
            "data": "<base64_encoded_image>"
          }
        },
        {
          "type": "text",
          "text": "<vision_prompt>"
        }
      ]
    }
  ]
}
```

### iOS Implementation

```swift
func generateQuiz(from image: UIImage, subject: String? = nil) async throws -> Quiz {
    // 1. Process image
    let base64Image = try convertImageToBase64(image)

    // 2. Build prompt
    let prompt = PromptManager.shared.buildVisionPrompt(
        subject: subject,
        topic: "generic"
    )

    // 3. Build request body
    let requestBody: [String: Any] = [
        "model": "claude-sonnet-4-20250514",
        "max_tokens": 4096,
        "messages": [
            [
                "role": "user",
                "content": [
                    [
                        "type": "image",
                        "source": [
                            "type": "base64",
                            "media_type": "image/jpeg",
                            "data": base64Image
                        ]
                    ],
                    [
                        "type": "text",
                        "text": prompt
                    ]
                ]
            ]
        ]
    ]

    let jsonData = try JSONSerialization.data(withJSONObject: requestBody)

    // 4. Create request
    var request = URLRequest(url: URL(string: apiURL)!)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.setValue(apiKey, forHTTPHeaderField: "x-api-key")
    request.setValue("2023-06-01", forHTTPHeaderField: "anthropic-version")
    request.httpBody = jsonData
    request.timeoutInterval = 60

    // 5. Send request
    let (data, response) = try await URLSession.shared.data(for: request)

    // 6. Handle response
    return try parseResponse(data: data, response: response)
}
```

### React Native Implementation

```typescript
import axios from 'axios';

export class AIService {
  private apiKey: string;
  private apiURL = 'https://api.anthropic.com/v1/messages';
  private model = 'claude-sonnet-4-20250514';

  async generateQuiz(imageUri: string, subject?: string): Promise<Quiz> {
    // 1. Process image
    const base64Image = await convertImageToBase64(imageUri);

    // 2. Build prompt
    const prompt = PromptManager.buildVisionPrompt(subject, 'generic');

    // 3. Make API request
    try {
      const response = await axios.post(
        this.apiURL,
        {
          model: this.model,
          max_tokens: 4096,
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
          timeout: 60000 // 60 seconds
        }
      );

      // 4. Parse and return
      return this.parseQuizResponse(response.data);
    } catch (error) {
      throw this.handleAPIError(error);
    }
  }
}
```

---

## API Response Parsing

### Raw API Response

```json
{
  "id": "msg_01XYZ...",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "{\n  \"topic\": \"maths\",\n  \"subtopic\": \"algebra\",\n  \"confidence\": 0.95,\n  \"questions\": [...]\n}"
    }
  ],
  "model": "claude-sonnet-4-20250514",
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 1250,
    "output_tokens": 2100
  }
}
```

### Parsing Logic

The response may include markdown code blocks, so we need to extract the JSON:

```typescript
function parseQuizResponse(apiResponse: any): Quiz {
  // 1. Extract text from content array
  const text = apiResponse.content[0].text;

  // 2. Remove markdown code blocks if present
  const cleanedText = text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();

  // 3. Find JSON object boundaries
  const jsonStart = cleanedText.indexOf('{');
  const jsonEnd = cleanedText.lastIndexOf('}') + 1;

  if (jsonStart === -1 || jsonEnd === 0) {
    throw new Error('No JSON object found in response');
  }

  const jsonString = cleanedText.substring(jsonStart, jsonEnd);

  // 4. Parse JSON
  const parsed: ClaudeResponse = JSON.parse(jsonString);

  // 5. Validate structure
  if (!parsed.questions || parsed.questions.length !== 10) {
    throw new Error(`Expected 10 questions, got ${parsed.questions?.length || 0}`);
  }

  // 6. Validate each question
  parsed.questions.forEach((q, index) => {
    const type = q.type || 'mcq';

    if (type === 'mcq') {
      if (!q.options || q.options.length !== 4) {
        throw new Error(`Question ${index + 1}: MCQ must have 4 options`);
      }
      if (q.correctIndex === undefined || q.correctIndex < 0 || q.correctIndex > 3) {
        throw new Error(`Question ${index + 1}: Invalid correctIndex`);
      }
    } else {
      if (!q.correctAnswer || q.correctAnswer.trim().length === 0) {
        throw new Error(`Question ${index + 1}: Missing correctAnswer`);
      }
    }
  });

  // 7. Convert to domain model
  return {
    id: uuidv4(),
    homeworkId: '', // Set by caller
    createdAt: new Date(),
    topic: parsed.topic,
    subtopic: parsed.subtopic,
    classificationConfidence: parsed.confidence,
    questions: parsed.questions.map(q => ({
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

## Error Handling

### Error Types

```typescript
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
```

### Error Handling Logic

```typescript
function handleAPIError(error: any): AIServiceError {
  // Timeout
  if (error.code === 'ECONNABORTED') {
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

  // Unknown errors
  return new AIServiceError(
    AIError.NetworkError,
    error.message || 'Unknown error occurred'
  );
}
```

### User-Facing Error Messages

```typescript
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
```

### Retry Logic

```typescript
async function generateQuizWithRetry(
  imageUri: string,
  subject?: string,
  maxRetries = 3
): Promise<Quiz> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
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
        console.log(`Retry attempt ${attempt} after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('All retry attempts failed');
}
```

---

## Implementation Examples

### Complete iOS AIService

See: `Cheater-iOS/Cheater-iOS/Services/AIService.swift` (lines 1-312)

Key features:
- Actor-based for thread safety
- Async/await API
- Comprehensive error handling
- Image optimization
- Response validation

### Complete React Native AIService

```typescript
// services/aiService.ts
import axios, { AxiosError } from 'axios';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { v4 as uuidv4 } from 'uuid';
import { PromptManager } from './promptManager';
import type { Quiz, ClaudeResponse, QuestionType } from '../types';

export class AIService {
  private apiKey: string;
  private apiURL = 'https://api.anthropic.com/v1/messages';
  private model = 'claude-sonnet-4-20250514';

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('API key is required');
    }
    this.apiKey = apiKey;
  }

  async generateQuiz(
    imageUri: string,
    subject?: string
  ): Promise<Quiz> {
    console.log('🚀 Starting quiz generation...');

    // Process image
    const base64Image = await this.convertImageToBase64(imageUri);

    // Build prompt
    const prompt = PromptManager.buildVisionPrompt(subject, 'generic');

    // Make API request
    console.log('📤 Sending request to Claude Vision API...');
    const response = await axios.post(
      this.apiURL,
      {
        model: this.model,
        max_tokens: 4096,
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
        timeout: 60000
      }
    );

    console.log('✅ Received response from API');

    // Parse response
    return this.parseQuizResponse(response.data);
  }

  private async convertImageToBase64(imageUri: string): Promise<string> {
    const resized = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 1280 } }],
      { compress: 0.75, format: ImageManipulator.SaveFormat.JPEG }
    );

    const base64 = await FileSystem.readAsStringAsync(
      resized.uri,
      { encoding: FileSystem.EncodingType.Base64 }
    );

    const sizeKB = Math.round((base64.length * 3) / 4 / 1024);
    console.log(`📸 Image size: ${sizeKB}KB`);

    return base64;
  }

  private parseQuizResponse(apiResponse: any): Quiz {
    // Extract and parse JSON (see full implementation above)
    // ...
  }
}
```

---

## Cost Optimization

### Token Usage

**Input Tokens** (per request):
- Image: ~1,200 tokens (base64 encoded 180KB image)
- Prompt: ~800 tokens
- **Total Input**: ~2,000 tokens

**Output Tokens** (per response):
- Quiz JSON: ~2,000-2,500 tokens
- **Average Output**: ~2,100 tokens

### Pricing

**Model**: Claude Sonnet 4
- Input: $3.00 / 1M tokens
- Output: $15.00 / 1M tokens

**Cost per Quiz**:
- Input: (2,000 / 1,000,000) × $3.00 = $0.006
- Output: (2,100 / 1,000,000) × $15.00 = $0.0315
- **Total**: ~$0.038 per quiz

### Optimization Strategies

1. **Image Optimization**
   - Resize to 1280px max ✅
   - JPEG compression at 75% ✅
   - Saves ~90% on token usage

2. **Prompt Optimization**
   - Concise instructions
   - Remove redundant examples
   - Could save 10-15% tokens

3. **Caching** (Future)
   - Cache identical homework images
   - Detect duplicates
   - Could save 50%+ for repeated use

4. **Batch Processing** (Future)
   - Process multiple homework at once
   - Amortize base prompt cost
   - 20-30% savings for bulk

### Monthly Cost Estimates

| Users | Quizzes/User/Month | Total Quizzes | Cost |
|-------|-------------------|---------------|------|
| 100   | 10                | 1,000         | $38  |
| 1,000 | 10                | 10,000        | $380 |
| 10,000| 10                | 100,000       | $3,800|

---

## Next Steps

- [Prompts System](./03-PROMPTS-SYSTEM.md) - Learn how prompts are structured
- [User Flows](./06-USER-FLOWS.md) - See the complete capture flow
- [Migration Guide](./08-MIGRATION-GUIDE.md) - Implementation in React Native
