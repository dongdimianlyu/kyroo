import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// Create a single, cached OpenAI client instance
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface HintsRequest {
  conversationHistory: Message[];
  scenario: string;
  difficulty: 'easy' | 'medium' | 'hard';
  feeling: 'confident' | 'okay' | 'anxious' | 'rough';
  timeSinceLastMessage: number;
  anonId: string;
}

interface HintResponse {
  hint?: {
    message: string;
    type: 'suggestion' | 'encouragement' | 'tip';
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HintResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      conversationHistory, 
      scenario, 
      difficulty, 
      feeling, 
      timeSinceLastMessage, 
      anonId 
    }: HintsRequest = req.body;

    // Validate input
    if (!anonId || typeof anonId !== 'string') {
      return res.status(400).json({ error: 'Anonymous ID is required' });
    }

    if (!conversationHistory || !Array.isArray(conversationHistory)) {
      return res.status(400).json({ error: 'Conversation history is required' });
    }

    if (!scenario || typeof scenario !== 'string') {
      return res.status(400).json({ error: 'Scenario is required' });
    }

    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured');
      return res.status(500).json({ error: 'Service authentication failed. Please check configuration.' });
    }

    // Don't generate hints too frequently or for very short conversations
    if (conversationHistory.length < 3 || timeSinceLastMessage < 20000) {
      return res.status(200).json({});
    }

    const openai = getOpenAIClient();

    // Build conversation context
    const conversationContext = conversationHistory.slice(-6).map(msg => 
      `${msg.role === 'user' ? 'User' : 'Other Person'}: ${msg.content}`
    ).join('\n');

    // Get the last few user messages to analyze patterns
    const userMessages = conversationHistory.filter(msg => msg.role === 'user').slice(-3);
    const avgUserMessageLength = userMessages.reduce((sum, msg) => sum + msg.content.length, 0) / userMessages.length;
    
    // Determine if conversation might need encouragement
    const longPause = timeSinceLastMessage > 45000; // More than 45 seconds
    const shortResponses = avgUserMessageLength < 20; // Very short responses
    const fewExchanges = conversationHistory.length < 6; // Still early in conversation

    const promptConfig = {
      easy: {
        maxHints: 'very sparingly - only if really needed',
        tone: 'extremely gentle and encouraging',
        focus: 'building confidence and celebrating small wins'
      },
      medium: {
        maxHints: 'occasionally when helpful',
        tone: 'supportive and constructive',
        focus: 'gentle guidance and skill building'
      },
      hard: {
        maxHints: 'more frequently to help navigate challenges',
        tone: 'direct but compassionate',
        focus: 'strategic advice and confidence building'
      }
    };

    const feelingConfig = {
      confident: {
        tone: 'encouraging their momentum',
        support: 'celebrate their confidence and suggest advanced techniques'
      },
      okay: {
        tone: 'warm and supportive',
        support: 'provide balanced encouragement and practical tips'
      },
      anxious: {
        tone: 'extra gentle and reassuring',
        support: 'focus on reducing anxiety and building comfort'
      },
      rough: {
        tone: 'very compassionate and patient',
        support: 'emphasize self-care and gentle progress'
      }
    };

    const hintsPrompt = `You are a gentle conversation coach analyzing the overall flow and patterns of a practice conversation. Provide holistic insights about the conversation as a whole, not specific sentence suggestions.

CONTEXT:
- Scenario: "${scenario}"
- Difficulty: ${difficulty} (${promptConfig[difficulty].maxHints})
- User's feeling today: ${feeling} (${feelingConfig[feeling].support})
- Time since last message: ${Math.round(timeSinceLastMessage / 1000)} seconds
- Full conversation so far:
${conversationContext}

CONVERSATION ANALYSIS:
- Long pause: ${longPause}
- Short responses pattern: ${shortResponses}
- Early in conversation: ${fewExchanges}
- Total exchanges: ${conversationHistory.length / 2}

HINT FOCUS - Analyze the OVERALL conversation patterns:
1. Conversation balance: Is the user engaging equally or holding back?
2. Energy level: How is the overall tone and engagement?
3. Social flow: Are they picking up on social cues and rhythms?
4. Connection building: Are they showing interest in the other person?
5. Confidence progression: How is their comfort level evolving?

TONE: Be ${promptConfig[difficulty].tone} and ${feelingConfig[feeling].tone}

HINT GUIDELINES:
- Focus on overall conversation patterns, not specific words
- Provide insights about their social interaction style
- Encourage growth in conversation skills
- Use language like "You're doing great with...", "Consider focusing on...", "The conversation shows..."
- Keep insights constructive and supportive
- For ${feeling} users: ${feelingConfig[feeling].support}

WHEN TO PROVIDE INSIGHTS:
- When there are clear patterns to highlight (positive or growth areas)
- After several exchanges to analyze overall flow
- When user shows progress worth celebrating
- When gentle guidance could help overall approach

WHEN NOT TO PROVIDE INSIGHTS:
- Too early in conversation (less than 3 exchanges)
- When conversation is flowing perfectly naturally
- Too soon after the last insight

Based on the overall conversation patterns, should you provide an insight? Focus on the big picture, not individual responses.

Respond with valid JSON only:
{
  "shouldProvideHint": true/false,
  "hint": {
    "message": "[Your insight about the overall conversation patterns and approach]",
    "type": "suggestion|encouragement|tip"
  }
}

If shouldProvideHint is false, respond with: {"shouldProvideHint": false}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a gentle, supportive conversation coach. Provide helpful, non-intrusive hints that encourage social skill development. Always respond with valid JSON. Be mindful of the user's emotional state and provide appropriate support."
        },
        {
          role: "user",
          content: hintsPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response content from OpenAI');
    }

    // Clean up the response
    const sanitizedResponse = responseContent.replace(/```json\n?|\n?```/g, '').trim();

    let hintResult: { shouldProvideHint: boolean; hint?: { message: string; type: string } };
    try {
      hintResult = JSON.parse(sanitizedResponse);
    } catch (parseError) {
      console.error('Failed to parse OpenAI hints response:', responseContent);
      return res.status(200).json({}); // Fail silently for hints
    }

    // Return hint if one should be provided
    if (hintResult.shouldProvideHint && hintResult.hint) {
      return res.status(200).json({
        hint: {
          message: hintResult.hint.message,
          type: hintResult.hint.type as 'suggestion' | 'encouragement' | 'tip'
        }
      });
    }

    return res.status(200).json({});

  } catch (error: unknown) {
    console.error('Real-time hints error:', error);
    
    // For hints, we fail silently to not disrupt the conversation
    return res.status(200).json({});
  }
} 