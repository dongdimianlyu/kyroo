import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { generatePersonalizedContext } from './save-profile';

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

interface SimulationRequest {
  action: 'start' | 'continue' | 'end';
  scenario?: string;
  userMessage?: string;
  conversationHistory?: Message[];
  difficulty?: 'easy' | 'medium' | 'hard';
  feeling?: 'confident' | 'okay' | 'anxious' | 'rough';
  anonId: string;
}

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface CoachingInsight {
  message: string;
  type: 'positive' | 'suggestion' | 'neutral';
}

interface SimulationResponse {
  aiResponse: string;
  coaching: CoachingInsight;
  sceneDescription?: string;
}

interface SimulationSummary {
  smoothnessScore: number;
  whatWentWell: string;
  improvementAreas: string[];
  encouragingMessage: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SimulationResponse | SimulationSummary | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, scenario, userMessage, conversationHistory, difficulty, feeling, anonId }: SimulationRequest = req.body;

    // Validate input
    if (!anonId || typeof anonId !== 'string') {
      return res.status(400).json({ error: 'Anonymous ID is required' });
    }

    if (action !== 'start' && action !== 'continue' && action !== 'end') {
      return res.status(400).json({ error: 'Invalid action' });
    }

    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured');
      return res.status(500).json({ error: 'Service authentication failed. Please check configuration.' });
    }

    const openai = getOpenAIClient();

    if (action === 'start') {
      // Starting a new simulation
      if (!scenario) {
        return res.status(400).json({ error: 'Scenario description is required to start' });
      }

      const systemPrompt = `You are an AI conversation partner. Your primary goal is to help a user practice a social scenario by playing the role of the other person. The user will always be playing as themselves.

Read the user's scenario description and determine who you should be.
- If the user says "I need to talk to my friend about X," you are the FRIEND.
- If the user says "I want to ask my boss for a raise," you are the BOSS.
- If the user says "My partner is upset with me and I need to apologize," you are the PARTNER.

Your role is to act as the other person in the user's scenario.

---

USER'S SCENARIO TO PRACTICE:
"${scenario}"

YOUR TASK:
1.  Identify your role based on the scenario. You are the *other person*.
2.  Start the conversation naturally from the perspective of your character. For example, if you are the friend who talks too much about their startup, you might start by excitedly talking about your startup.
3.  Keep your first message brief (1-2 sentences) to get the conversation going.
4.  Incorporate the selected difficulty and the user's current feeling into your response style.
5.  If helpful, provide a brief (one sentence) scene description to set the context.

---

DIFFICULTY LEVEL: ${difficulty || 'medium'}
- Easy: Be patient, understanding, and forgiving.
- Medium: Act like a typical person with normal social expectations.
- Hard: Be less patient and more direct or challenging.

USER'S CURRENT FEELING: ${feeling || 'okay'}
- Confident: They're ready for a standard interaction.
- Okay: A normal, balanced approach.
- Anxious: Be extra gentle and supportive.
- Rough: Be very patient and encouraging.

Begin the conversation now, playing your role.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a realistic conversation simulator that creates authentic teenage social interactions. You must respond with valid JSON only. Make conversations feel natural and genuine while maintaining a safe, supportive environment. Use realistic speech patterns and natural reactions."
          },
          {
            role: "user",
            content: systemPrompt
          }
        ],
        temperature: 0.9,
        max_tokens: 400,
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error('No response content from OpenAI');
      }

      let startResult: { sceneDescription: string; firstMessage: string };
      try {
        // Log the raw response for debugging
        console.log('OpenAI start response:', responseContent);
        
        // Clean up the response - remove any markdown formatting or extra text
        let cleanedResponse = responseContent.trim();
        
        // Extract JSON if it's wrapped in markdown code blocks
        const jsonMatch = cleanedResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          cleanedResponse = jsonMatch[1].trim();
        }
        
        // Look for JSON object if there's other text before/after
        const objMatch = cleanedResponse.match(/\{[\s\S]*\}/);
        if (objMatch && !cleanedResponse.startsWith('{')) {
          cleanedResponse = objMatch[0];
        }
        
        startResult = JSON.parse(cleanedResponse);
        
        // Validate required fields
        if (!startResult.sceneDescription || !startResult.firstMessage) {
          throw new Error('Missing required fields in AI response');
        }
        
        // Clean up any formatting in the actual content
        startResult.sceneDescription = startResult.sceneDescription.trim();
        startResult.firstMessage = startResult.firstMessage.trim();
        
      } catch (parseError) {
        console.error('Failed to parse OpenAI start response:', responseContent);
        console.error('Parse error:', parseError);
        
        // Enhanced error handling - try to extract content manually
        try {
          // Try to extract values using regex as a last resort
          const sceneMatch = responseContent.match(/"sceneDescription":\s*"([^"]+)"/);
          const messageMatch = responseContent.match(/"firstMessage":\s*"([^"]+)"/);
          
          if (sceneMatch && messageMatch) {
            startResult = {
              sceneDescription: sceneMatch[1],
              firstMessage: messageMatch[1]
            };
            console.log('Successfully extracted content using regex fallback');
          } else {
            throw new Error('Could not extract content from response');
          }
        } catch (extractError) {
          console.error('Regex extraction also failed:', extractError);
          return res.status(500).json({ 
            error: 'Failed to generate simulation content. Please try again.' 
          });
        }
      }

      return res.status(200).json({
        sceneDescription: startResult.sceneDescription,
        aiResponse: startResult.firstMessage,
        coaching: {
          message: "Great! You're starting a practice conversation. Take your time to think about how you want to respond.",
          type: 'neutral'
        }
      });

    } else if (action === 'end') {
      // Generate simulation summary
      if (!conversationHistory || !Array.isArray(conversationHistory)) {
        return res.status(400).json({ error: 'Conversation history is required for ending simulation' });
      }

      if (!scenario || typeof scenario !== 'string') {
        return res.status(400).json({ error: 'Scenario is required for ending simulation' });
      }

      // Build conversation context
      const conversationContext = conversationHistory.map(msg => 
        `${msg.role === 'user' ? 'Teen' : 'Other Person'}: ${msg.content}`
      ).join('\n');

      // Get the session parameters for personalized feedback
      const selectedDifficulty = difficulty || 'medium';
      const selectedFeeling = feeling || 'okay';

      const difficultyContext = {
        easy: "Remember, this was set to Easy mode, so focus on celebrating their courage to practice.",
        medium: "This was a Medium difficulty session, so acknowledge their willingness to engage in typical social situations.",
        hard: "This was a Hard difficulty session, so especially celebrate their bravery in tackling challenging social dynamics."
      };

      const feelingContext = {
        confident: "The user started feeling confident today, so build on that momentum.",
        okay: "The user was feeling okay today, so provide balanced encouragement.",
        anxious: "The user was feeling anxious today, so be extra gentle and focus on their courage.",
        rough: "The user was having a rough day, so emphasize their strength and resilience in practicing despite challenges."
      };

      const summaryPrompt = `You are evaluating a completed practice conversation for a teen learning social skills. Generate an encouraging summary that celebrates their growth while providing gentle, specific guidance.

ORIGINAL SCENARIO: "${scenario}"
DIFFICULTY LEVEL: ${selectedDifficulty} - ${difficultyContext[selectedDifficulty]}
USER'S FEELING: ${selectedFeeling} - ${feelingContext[selectedFeeling]}

FULL CONVERSATION:
${conversationContext}

EVALUATION CRITERIA:
- Conversation smoothness (0-100): How naturally did the conversation flow? Adjust expectations based on difficulty level.
- Communication clarity: Were responses clear and relevant?
- Engagement level: Did they participate meaningfully?
- Social awareness: Did they pick up on social cues?
- Confidence building: Did they seem to grow more comfortable?

TONE GUIDELINES:
- Be warm, empowering, and encouraging
- ${feelingContext[selectedFeeling]}
- ${difficultyContext[selectedDifficulty]}
- Focus on specific strengths they demonstrated
- For improvements, be gentle and actionable
- Remember this is about serving the user, not fixing them
- Celebrate effort and participation, not just perfection
- Make them feel capable and supported

Respond with valid JSON only:
{
  "smoothnessScore": [0-100 number representing overall conversation flow, adjusted for difficulty level],
  "whatWentWell": "[2-3 sentence celebration of specific things they did well, considering their starting feeling]",
  "improvementAreas": ["[specific, gentle suggestion 1]", "[specific, gentle suggestion 2 if needed]"],
  "encouragingMessage": "[Warm, empowering message about their growth and next steps, tailored to their difficulty level and feeling]"
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a warm, encouraging social skills coach. Your goal is to build confidence and celebrate growth while providing gentle, specific guidance. Focus on empowerment and capability. You must respond with valid JSON only."
          },
          {
            role: "user",
            content: summaryPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 600,
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error('No response content from OpenAI');
      }

      // Sanitize the response to handle potential markdown code blocks
      const sanitizedResponse = responseContent.replace(/```json\n?|\n?```/g, '').trim();

      let summaryResult: SimulationSummary;
      try {
        summaryResult = JSON.parse(sanitizedResponse);
      } catch (parseError) {
        console.error('Failed to parse OpenAI summary response:', responseContent);
        console.error('Parse error:', parseError);
        
        // Enhanced error handling - try to extract content manually
        try {
          const scoreMatch = responseContent.match(/"smoothnessScore":\s*(\d+)/);
          const wellMatch = responseContent.match(/"whatWentWell":\s*"([^"]+)"/);
          const areasMatch = responseContent.match(/"improvementAreas":\s*\[([^\]]+)\]/);
          const messageMatch = responseContent.match(/"encouragingMessage":\s*"([^"]+)"/);
          
          if (scoreMatch && wellMatch && messageMatch) {
            let improvementAreas: string[] = [];
            if (areasMatch) {
              try {
                improvementAreas = JSON.parse(`[${areasMatch[1]}]`);
              } catch {
                // If parsing fails, extract as single string
                improvementAreas = [areasMatch[1].replace(/"/g, '')];
              }
            }
            
            summaryResult = {
              smoothnessScore: parseInt(scoreMatch[1]),
              whatWentWell: wellMatch[1],
              improvementAreas,
              encouragingMessage: messageMatch[1]
            };
            console.log('Successfully extracted summary content using regex fallback');
          } else {
            throw new Error('Could not extract summary content from response');
          }
        } catch (extractError) {
          console.error('Regex extraction also failed:', extractError);
          return res.status(500).json({ 
            error: 'Failed to generate simulation summary. Please try again.' 
          });
        }
      }

      // Validate the response structure
      if (typeof summaryResult.smoothnessScore !== 'number' || 
          summaryResult.smoothnessScore < 0 || 
          summaryResult.smoothnessScore > 100) {
        summaryResult.smoothnessScore = Math.min(100, Math.max(0, summaryResult.smoothnessScore || 75));
      }

      if (!summaryResult.whatWentWell || typeof summaryResult.whatWentWell !== 'string') {
        summaryResult.whatWentWell = "You participated in the conversation and showed effort in communicating!";
      }

      if (!Array.isArray(summaryResult.improvementAreas)) {
        summaryResult.improvementAreas = [];
      }

      if (!summaryResult.encouragingMessage || typeof summaryResult.encouragingMessage !== 'string') {
        summaryResult.encouragingMessage = "Every conversation is practice, and you're building valuable social skills. Keep going!";
      }

      return res.status(200).json(summaryResult);

    } else {
      // Continuing an existing conversation
      if (!userMessage || typeof userMessage !== 'string' || userMessage.trim().length === 0) {
        return res.status(400).json({ error: 'User message is required for continuing conversation' });
      }

      if (!conversationHistory || !Array.isArray(conversationHistory)) {
        return res.status(400).json({ error: 'Conversation history is required to continue' });
      }

      const systemPrompt = `You are an AI conversation partner continuing a practice session. The user is playing as themselves. Your role is to continue playing the character of the other person in the scenario.

YOUR TASK:
1.  Remember the original scenario and your role in it.
2.  Read the conversation history to understand the context.
3.  Respond naturally and realistically as your character would.
4.  Keep your responses brief (1-2 sentences) to keep the conversation flowing.
5.  Maintain the established difficulty level in your tone and responses.

---

ORIGINAL SCENARIO:
"${scenario}"

CONVERSATION HISTORY:
${conversationHistory.map((msg: Message) => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`).join('\n')}

---

Based on the history and your character, provide the next response.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: "system",
            content: "You are a realistic teenage conversation partner. Respond naturally like a real teenager would, using authentic speech patterns and genuine reactions. Keep coaching minimal to maintain immersion. You must respond with valid JSON only."
          },
          {
            role: "user",
            content: systemPrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 400,
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error('No response content from OpenAI');
      }

      // Sanitize the response to handle potential markdown code blocks
      const sanitizedResponse = responseContent.replace(/```json\n?|\n?```/g, '').trim();

      let continueResult: { response: string; coaching: CoachingInsight };
      try {
        continueResult = JSON.parse(sanitizedResponse);
      } catch (parseError) {
        console.error('Failed to parse OpenAI continue response:', responseContent);
        console.error('Parse error:', parseError);
        
        // Enhanced error handling - try to extract content manually
        try {
          const responseMatch = responseContent.match(/"response":\s*"([^"]+)"/);
          
          if (responseMatch) {
            continueResult = {
              response: responseMatch[1],
              coaching: {
                message: "Great job keeping the conversation going!",
                type: 'neutral'
              }
            };
            console.log('Successfully extracted continue content using regex fallback');
          } else {
            throw new Error('Could not extract content from response');
          }
        } catch (extractError) {
          console.error('Regex extraction also failed:', extractError);
          return res.status(500).json({ 
            error: 'Failed to generate conversation response. Please try again.' 
          });
        }
      }

      return res.status(200).json({
        aiResponse: continueResult.response,
        coaching: continueResult.coaching
      });
    }

  } catch (error: unknown) {
    console.error('Simulation error:', error);
    
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
    
    const errorMessage = error instanceof Error ? error.message : 'Simulation failed. Please try again.';
    return res.status(500).json({ 
      error: errorMessage
    });
  }
} 