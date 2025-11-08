/**
 * Expo API Route - Proxy for Anthropic Claude API
 * This handles CORS issues when calling from the browser
 * File naming: +api.ts suffix creates an API route in Expo Router
 */

export async function POST(request: Request) {
  try {
    // Get API key from environment
    const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { image, prompt } = body;

    if (!image || !prompt) {
      return Response.json(
        { error: 'Missing image or prompt' },
        { status: 400 }
      );
    }

    console.log('🔄 Proxying request to Anthropic API...');

    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
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
                  data: image
                }
              },
              {
                type: 'text',
                text: prompt
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Anthropic API error:', errorText);
      return Response.json(
        { error: `API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Successfully proxied request');

    return Response.json(data);

  } catch (error: any) {
    console.error('❌ Proxy error:', error);
    return Response.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
