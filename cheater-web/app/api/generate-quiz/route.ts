/**
 * Next.js API Route - Generate Quiz
 * Server-side proxy to Anthropic API to avoid CORS issues
 */

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64, subject } = body;

    // Validate input
    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Check API key
    const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('❌ API key not configured');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    console.log('🚀 Calling Anthropic API...');
    console.log('✅ API Key configured:', apiKey.substring(0, 10) + '...');

    // Build prompt
    const prompt = buildPrompt(subject);

    // Call Anthropic API
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-sonnet-4-5-20250929',
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
                  data: imageBase64
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
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        timeout: 60000
      }
    );

    console.log('✅ Received response from Anthropic API');

    // Return the response
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('❌ API Route Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    // Return error response
    return NextResponse.json(
      {
        error: error.response?.data?.error?.message || error.message || 'Failed to generate quiz',
        status: error.response?.status || 500
      },
      { status: error.response?.status || 500 }
    );
  }
}

function buildPrompt(subject?: string): string {
  return `You are an expert educational AI that generates high-quality quiz questions from homework assignments.

Analyze this homework image and:
1. Generate a descriptive title for this assignment
2. Detect the subject/topic
3. Create exactly 10 quiz questions

Return ONLY a JSON object with this exact structure:
{
  "title": "Descriptive title (e.g., 'Fractions and Decimals', 'World War 2 History')",
  "subject": "Subject name (e.g., 'Mathematics', 'History', 'English', 'Science')",
  "topic": "maths" | "english" | "science" | "history" | "generic",
  "subtopic": "specific topic (e.g., algebra, grammar, fractions)",
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
- Generate a clear, concise title based on the homework content
- Detect the subject accurately
- Exactly 10 questions
- Mix of question types: ~60% MCQ, ~30% fill-blank, ~10% short-answer
- MCQ must have exactly 4 options
- All questions must have explanations
- Questions should test understanding, not just memorization`;
}
