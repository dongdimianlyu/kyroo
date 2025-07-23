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

    // Enhanced prompt for better manipulation detection and overthinking assessment
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
    {
      "tone": "Direct",
      "text": "[A straightforward, honest response that sets clear boundaries if needed]"
    },
    {
      "tone": "Diplomatic", 
      "text": "[A polite but firm response that addresses concerns while maintaining relationship]"
    },
    {
      "tone": "Assertive",
      "text": "[A confident response that protects the user's interests without being aggressive]"
    }
  ],
  "advice": "[Specific guidance about whether this situation requires concern or if the user might be overthinking. Include red flags to watch for OR reassurance that this seems like normal social interaction. Give practical next steps for handling similar situations.]"
}

IMPORTANT GUIDELINES:
- If you detect manipulation (score 70+), prioritize user safety in responses
- If scores are low (under 30), reassure user they may be overthinking 
- For passive-aggression, teach user to recognize the patterns
- Responses should be practical and actually usable by someone who struggles with social cues
- Be specific about what makes something manipulative vs just awkward
- Help build confidence in normal social situations while staying alert to real red flags`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system", 
          content: "You are a helpful social intelligence assistant specializing in helping neurodivergent individuals navigate social situations safely. Always respond with valid JSON in the exact format requested."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response content from OpenAI');
    }

    // Parse the JSON response
    let analysisResult: AnalysisResult;
    try {
      analysisResult = JSON.parse(responseContent);
    } catch {
      console.error('Failed to parse OpenAI response:', responseContent);
      throw new Error('Invalid response format from AI service');
    }

    // Validate the response structure
    if (!analysisResult.analysis || !analysisResult.responses || !analysisResult.advice) {
      console.error('Invalid response structure:', analysisResult);
      throw new Error('Incomplete analysis result');
    }

    // Validate analysis scores are numbers between 0-100
    const { emotionalWarmth, manipulationRisk, passiveAggressive } = analysisResult.analysis;
    if (typeof emotionalWarmth !== 'number' || emotionalWarmth < 0 || emotionalWarmth > 100 ||
        typeof manipulationRisk !== 'number' || manipulationRisk < 0 || manipulationRisk > 100 ||
        typeof passiveAggressive !== 'number' || passiveAggressive < 0 || passiveAggressive > 100) {
      throw new Error('Invalid analysis scores');
    }

    // Validate responses array
    if (!Array.isArray(analysisResult.responses) || analysisResult.responses.length !== 3) {
      throw new Error('Invalid responses format');
    }

    const validTones = ['Direct', 'Diplomatic', 'Assertive'];
    for (const response of analysisResult.responses) {
      if (!validTones.includes(response.tone) || typeof response.text !== 'string') {
        throw new Error('Invalid response format');
      }
    }

    return res.status(200).json(analysisResult);

  } catch (error: unknown) {
    console.error('Analysis error:', error);
    
    // Handle specific OpenAI errors
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        return res.status(500).json({ error: 'Service authentication failed. Please check your API key.' });
      }
      if (error.code === 'insufficient_quota') {
        return res.status(429).json({ error: 'You have exceeded your OpenAI quota. Please check your plan and billing details.' });
      }
      if (error.status === 429) {
        return res.status(429).json({ error: 'Service is busy. Please try again in a moment.' });
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Analysis failed. Please try again.';
    return res.status(500).json({ 
      error: errorMessage
    });
  }
} 