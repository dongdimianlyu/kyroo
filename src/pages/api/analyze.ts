import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

interface AnalyzeRequest {
  message: string;
  context?: string;
  anonId: string;
}

interface AnalysisResult {
  analysis: {
    emotionalWarmth: number;
    manipulationRisk: number;
    passiveAggressive: number;
  };
  responses: Array<{
    tone: 'Direct' | 'Diplomatic' | 'Assertive';
    text: string;
  }>;
  advice: string;
}

// Create a single, cached OpenAI client instance.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnalysisResult | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, context, anonId }: AnalyzeRequest = req.body;

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!anonId || typeof anonId !== 'string') {
      return res.status(400).json({ error: 'Anonymous ID is required' });
    }

    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured - environment variable OPENAI_API_KEY is missing');
      return res.status(500).json({ error: 'Service authentication failed. Please check configuration.' });
    }

    const prompt = `You are a social intelligence assistant helping autistic and introverted individuals navigate social interactions safely. Your goal is to help them identify potential manipulation, passive-aggressiveness, and understand whether they might be overthinking normal social situations.

ANALYZE THIS MESSAGE/SCENARIO:
"${message}"

${context ? `ADDITIONAL CONTEXT: "${context}"` : ''}

Please provide analysis focusing on:

1. **MANIPULATION DETECTION**: Look for signs of emotional manipulation, guilt-tripping, gaslighting, pressure tactics, boundary violations, or attempts to exploit vulnerabilities. Consider if this person is trying to get something from the user through emotional coercion.

2. **PASSIVE-AGGRESSIVENESS**: Identify indirect hostility, sarcasm, backhanded compliments, silent treatment implications, or veiled criticism disguised as concern.

3. **EMOTIONAL WARMTH vs HOSTILITY**: Assess the genuine emotional tone - is this person being genuinely supportive/friendly, neutral, or showing signs of irritation/hostility?

4. **REALITY CHECK**: Importantly, help determine if the user might be overthinking a normal social interaction. Sometimes social awkwardness or brief responses are just that - not manipulation or hostility.

Respond with a JSON object in this exact format:
{
  "analysis": {
    "emotionalWarmth": [0-100 number, where 0=hostile/cold, 50=neutral, 100=genuinely warm/supportive],
    "manipulationRisk": [0-100 number, where 0=no manipulation detected, 50=some concerning patterns, 100=clear manipulation tactics],
    "passiveAggressive": [0-100 number, where 0=direct communication, 50=some indirect elements, 100=clearly passive-aggressive]
  },
  "responses": [
    { "tone": "Direct", "text": "[A straightforward, honest response that sets clear boundaries if needed]" },
    { "tone": "Diplomatic", "text": "[A polite but firm response that addresses concerns while maintaining relationship]" },
    { "tone": "Assertive", "text": "[A confident response that protects the user's interests without being aggressive]" }
  ],
  "advice": "[SURGICAL GUIDANCE: 1-2 sentences maximum. Start with VERDICT: 'Normal interaction' or 'Red flag detected' or 'Proceed with caution'. Then ONE specific action: what to do next. No fluff, just actionable guidance.]"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful social intelligence assistant specializing in helping neurodivergent individuals navigate social situations safely. Always respond with valid JSON in the exact format requested.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response content from OpenAI');
    }

    // Parse the JSON response
    let raw: any;
    try {
      raw = JSON.parse(responseContent);
    } catch {
      console.error('Failed to parse OpenAI response:', responseContent);
      throw new Error('Invalid response format from AI service');
    }

    const toNumber = (v: any, fallback: number) => {
      const n = typeof v === 'string' ? Number.parseFloat(v) : v;
      return Number.isFinite(n) ? n : fallback;
    };

    const emotionalWarmth = Math.min(100, Math.max(0, toNumber(raw?.analysis?.emotionalWarmth, 50)));
    const manipulationRisk = Math.min(100, Math.max(0, toNumber(raw?.analysis?.manipulationRisk, 0)));
    const passiveAggressive = Math.min(100, Math.max(0, toNumber(raw?.analysis?.passiveAggressive, 0)));

    // Normalize responses to exactly 3 with valid tones
    const validTones = ['Direct', 'Diplomatic', 'Assertive'] as const;
    const asArray = Array.isArray(raw?.responses) ? raw.responses : [];
    const normalized = asArray
      .filter((r: any) => r && typeof r.text === 'string' && r.text.trim().length > 0)
      .map((r: any) => ({
        tone: validTones.includes(r.tone) ? (r.tone as (typeof validTones)[number]) : ('Direct' as const),
        text: r.text.trim(),
      }));

    while (normalized.length < 3) {
      const i = normalized.length;
      const fallbackTone = validTones[i] || 'Direct';
      normalized.push({ tone: fallbackTone, text: 'Thanks for sharing. Here’s a clear, respectful way to respond.' });
    }
    if (normalized.length > 3) normalized.length = 3;

    const advice = typeof raw?.advice === 'string' && raw.advice.trim().length > 0
      ? raw.advice.trim()
      : 'Normal interaction. Respond naturally and don’t overthink it.';

    const result: AnalysisResult = {
      analysis: {
        emotionalWarmth,
        manipulationRisk,
        passiveAggressive,
      },
      responses: normalized as AnalysisResult['responses'],
      advice,
    };

    return res.status(200).json(result);
  } catch (error: unknown) {
    console.error('Analysis error:', error);

    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        return res.status(500).json({ error: 'Service authentication failed. Please check your API key.' });
      }
      if ((error as any).code === 'insufficient_quota') {
        return res.status(429).json({ error: 'You have exceeded your OpenAI quota. Please check your plan and billing details.' });
      }
      if (error.status === 429) {
        return res.status(429).json({ error: 'Service is busy. Please try again in a moment.' });
      }
    }

    const errorMessage = error instanceof Error ? error.message : 'Analysis failed. Please try again.';
    return res.status(500).json({ error: errorMessage });
  }
} 