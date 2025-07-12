import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ConversationMessage {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ProgressEvaluation {
  progressScore: number; // 0-100
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProgressEvaluation | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { conversationHistory, scenario, anonId } = req.body;

    // Validate required fields
    if (!conversationHistory || !Array.isArray(conversationHistory)) {
      return res.status(400).json({ error: 'Conversation history is required' });
    }

    if (!scenario || typeof scenario !== 'string') {
      return res.status(400).json({ error: 'Scenario is required' });
    }

    // Log the request for analytics
    if (anonId) {
      await fetch('/api/logEvent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'evaluate_progress',
          anonId,
          metadata: {
            messageCount: conversationHistory.length,
            scenario: scenario.substring(0, 100) // First 100 chars for privacy
          }
        })
      }).catch(console.error);
    }

    // Build conversation context
    const conversationContext = conversationHistory.map((msg: ConversationMessage) => 
      `${msg.role === 'user' ? 'Teen' : 'Other Person'}: ${msg.content}`
    ).join('\n');

    const evaluationPrompt = `You are evaluating how well a teen is doing in a conversation practice session. This is for autistic teens building social confidence, so be encouraging and focus on growth.

ORIGINAL SCENARIO: "${scenario}"

CONVERSATION SO FAR:
${conversationContext}

Evaluate this conversation with these criteria:

PROGRESS FACTORS (Rate 0-100):
- Social engagement: Are they participating meaningfully?
- Communication clarity: Are their responses clear and relevant?
- Emotional awareness: Do they seem to understand social cues?
- Confidence building: Are they becoming more comfortable?
- Natural flow: Does the conversation feel natural?

EVALUATION GUIDELINES:
- Start with a baseline of 60 points for any participation
- Add points for: clear communication, asking questions, showing interest, appropriate responses
- Consider: This is practice, not perfection - growth mindset is key
- Be encouraging: Focus on what they're doing well
- For improvements: Be specific but gentle, focusing on next steps

Respond with valid JSON only:
{
  "progressScore": [0-100 number],
  "feedback": "[Encouraging 1-2 sentence summary of how they're doing]",
  "strengths": ["[specific thing they did well]", "[another strength]"],
  "improvements": ["[gentle suggestion for next time]", "[another improvement if needed]"]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an encouraging conversation coach for autistic teens. Focus on building confidence and recognizing growth. Always be supportive and specific in your feedback. You must respond with valid JSON only."
        },
        {
          role: "user",
          content: evaluationPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 400,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response content from OpenAI');
    }

    // Sanitize the response to handle potential markdown code blocks
    const sanitizedResponse = responseContent.replace(/```json\n?|\n?```/g, '').trim();

    // Parse the JSON response
    let evaluationResult: ProgressEvaluation;
    try {
      evaluationResult = JSON.parse(sanitizedResponse);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', responseContent);
      throw new Error('Invalid response format from AI service');
    }

    // Validate the response structure
    if (typeof evaluationResult.progressScore !== 'number' || 
        evaluationResult.progressScore < 0 || 
        evaluationResult.progressScore > 100) {
      throw new Error('Invalid progress score from AI service');
    }

    if (!evaluationResult.feedback || typeof evaluationResult.feedback !== 'string') {
      throw new Error('Invalid feedback from AI service');
    }

    if (!Array.isArray(evaluationResult.strengths) || !Array.isArray(evaluationResult.improvements)) {
      throw new Error('Invalid strengths or improvements from AI service');
    }

    return res.status(200).json(evaluationResult);

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error evaluating conversation progress:', error);
    return res.status(500).json({ 
      error: errorMessage 
    });
  }
} 