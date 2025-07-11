import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

interface RephraseRequest {
  message: string;
  tone: 'softer' | 'stronger' | 'different';
  anonId: string;
}

interface RephraseResponse {
  suggestions: string[];
}

// Initialize OpenAI client
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }
  return new OpenAI({
    apiKey: apiKey,
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RephraseResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, tone, anonId }: RephraseRequest = req.body;

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!tone || !['softer', 'stronger', 'different'].includes(tone)) {
      return res.status(400).json({ error: 'Valid tone is required' });
    }

    if (!anonId || typeof anonId !== 'string') {
      return res.status(400).json({ error: 'Anonymous ID is required' });
    }

    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured');
      return res.status(500).json({ error: 'Service authentication failed. Please check configuration.' });
    }

    const openai = getOpenAIClient();

    let prompt = '';
    if (tone === 'softer') {
      prompt = `Please provide 3 alternative ways to rephrase this message in a gentler, softer tone while keeping the same meaning:

"${message}"

Make the alternatives:
- More polite and considerate
- Less direct or assertive
- More empathetic and understanding

Respond with a JSON object in this exact format:
{
  "suggestions": ["[alternative 1]", "[alternative 2]", "[alternative 3]"]
}`;
    } else if (tone === 'stronger') {
      prompt = `Please provide 3 alternative ways to rephrase this message in a stronger, more assertive tone while keeping the same meaning:

"${message}"

Make the alternatives:
- More confident and direct
- Clearer about boundaries or expectations
- More assertive without being aggressive

Respond with a JSON object in this exact format:
{
  "suggestions": ["[alternative 1]", "[alternative 2]", "[alternative 3]"]
}`;
    } else { // different tone
      prompt = `Please provide 3 alternative ways to rephrase this message with different tones/approaches while keeping the same core meaning:

"${message}"

Make the alternatives diverse:
- Different levels of formality
- Different emotional approaches
- Different communication styles (while staying appropriate)

Respond with a JSON object in this exact format:
{
  "suggestions": ["[alternative 1]", "[alternative 2]", "[alternative 3]"]
}`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful communication assistant specializing in helping autistic teens express themselves clearly and appropriately in social situations. Always respond with valid JSON in the exact format requested."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 400,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response content from OpenAI');
    }

    let result: RephraseResponse;
    try {
      result = JSON.parse(responseContent);
    } catch {
      console.error('Failed to parse OpenAI rephrase response:', responseContent);
      throw new Error('Invalid response format from AI service');
    }

    // Validate response structure
    if (!result.suggestions || !Array.isArray(result.suggestions) || result.suggestions.length !== 3) {
      throw new Error('Invalid suggestions format');
    }

    return res.status(200).json(result);

  } catch (error: unknown) {
    console.error('Rephrase error:', error);
    
    // Handle specific OpenAI errors
    if (error && typeof error === 'object' && 'status' in error) {
      const errorWithStatus = error as { status?: number };
      if (errorWithStatus.status === 401) {
        return res.status(500).json({ error: 'Service authentication failed. Please check configuration.' });
      } else if (errorWithStatus.status === 429) {
        return res.status(429).json({ error: 'Service is busy. Please try again in a moment.' });
      } else if (errorWithStatus.status === 403) {
        return res.status(500).json({ error: 'Service quota exceeded. Please try again later.' });
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Rephrase failed. Please try again.';
    return res.status(500).json({ 
      error: errorMessage
    });
  }
} 