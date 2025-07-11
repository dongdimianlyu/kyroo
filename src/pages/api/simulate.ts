import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

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

interface SimulationRequest {
  action: 'start' | 'continue';
  scenario?: string;
  userMessage?: string;
  conversationHistory?: Message[];
  anonId: string;
}

interface SimulationResponse {
  aiResponse: string;
  coaching: CoachingInsight;
  sceneDescription?: string;
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
  res: NextApiResponse<SimulationResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, scenario, userMessage, conversationHistory, anonId }: SimulationRequest = req.body;

    // Validate input
    if (!anonId || typeof anonId !== 'string') {
      return res.status(400).json({ error: 'Anonymous ID is required' });
    }

    if (action !== 'start' && action !== 'continue') {
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
      if (!scenario || typeof scenario !== 'string' || scenario.trim().length === 0) {
        return res.status(400).json({ error: 'Scenario is required for starting simulation' });
      }

      const startPrompt = `You are a realistic conversation simulator helping teens practice social interactions. Create authentic scenarios that feel natural and genuine.

SCENARIO TO SIMULATE: "${scenario}"

Create a realistic social interaction with these guidelines:

PERSONALITY & TONE:
- The other person should feel like a real teenager - genuine, sometimes awkward, not overly polished
- Use natural speech patterns, mild hesitations, and realistic word choices
- Avoid being overly friendly OR hostile - most teens are neutral to mildly interested
- Include natural conversation quirks like "um," "like," or brief pauses in speech
- Make them feel authentic without trying too hard to be "trendy"

SAFETY BOUNDARIES:
- NEVER include bullying, harassment, mean comments, or negative behavior
- Avoid controversial topics, inappropriate content, or stress-inducing situations
- Keep interactions positive or neutral - this is a safe practice space
- The other person should be approachable and reasonably kind
- Focus on everyday social interactions teens actually encounter

REALISM:
- Conversations should feel natural, not scripted
- Include normal social rhythms - not every response needs to be perfectly engaging
- Show realistic reactions based on what the user might say
- Make the scenario feel like something that could actually happen

Respond with valid JSON only:
{
  "sceneDescription": "[Brief, realistic description of where this is happening]",
  "firstMessage": "[What the other person says naturally - include realistic speech patterns]"
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a realistic conversation simulator that creates authentic teenage social interactions. You must respond with valid JSON only. Make conversations feel natural and genuine while maintaining a safe, supportive environment. Use realistic speech patterns and natural reactions."
          },
          {
            role: "user",
            content: startPrompt
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

    } else {
      // Continuing an existing conversation
      if (!userMessage || typeof userMessage !== 'string' || userMessage.trim().length === 0) {
        return res.status(400).json({ error: 'User message is required for continuing conversation' });
      }

      if (!conversationHistory || !Array.isArray(conversationHistory)) {
        return res.status(400).json({ error: 'Conversation history is required for continuing conversation' });
      }

      // Build conversation context
      const conversationContext = conversationHistory.map(msg => 
        `${msg.role === 'user' ? 'Teen' : 'Other Person'}: ${msg.content}`
      ).join('\n');

      const continuePrompt = `Continue this realistic teenage conversation. The original scenario was: "${scenario}"

CONVERSATION HISTORY:
${conversationContext}
Teen: ${userMessage}

RESPOND AS THE OTHER PERSON:
- React naturally to what the teen just said
- Use realistic teenage speech patterns (occasional "um," "like," etc.)
- Show genuine reactions - surprise, interest, confusion, agreement, etc.
- Keep the conversation flowing naturally without being overly helpful or robotic
- Maintain a neutral to positive tone - never mean or dismissive
- Include normal conversational elements like asking follow-up questions or sharing brief reactions
- Avoid being artificially accommodating - respond like a real person would

PROVIDE COACHING:
- Focus on what the teen did well in their response
- If suggesting improvement, be gentle and specific
- Help them understand how their message likely came across
- Encourage natural conversation flow
- Build confidence while giving practical tips

Respond with valid JSON only:
{
  "response": "[Natural teenage response with realistic speech patterns]",
  "coaching": {
    "message": "[Supportive feedback highlighting strengths and gentle suggestions]",
    "type": "positive|suggestion|neutral"
  }
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a realistic teenage conversation partner and supportive coach. Respond naturally like a real teenager would, using authentic speech patterns and genuine reactions. Provide encouraging coaching that builds confidence. You must respond with valid JSON only."
          },
          {
            role: "user",
            content: continuePrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 500,
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error('No response content from OpenAI');
      }

      let continueResult: { response: string; coaching: CoachingInsight };
      try {
        // Log the raw response for debugging
        console.log('OpenAI continue response:', responseContent);
        
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
        
        continueResult = JSON.parse(cleanedResponse);
        
        // Validate required fields
        if (!continueResult.response || !continueResult.coaching) {
          throw new Error('Missing required fields in AI response');
        }
        
        // Clean up any formatting in the actual content
        continueResult.response = continueResult.response.trim();
        if (continueResult.coaching.message) {
          continueResult.coaching.message = continueResult.coaching.message.trim();
        }
        
      } catch (parseError) {
        console.error('Failed to parse OpenAI continue response:', responseContent);
        console.error('Parse error:', parseError);
        
        // Enhanced error handling - try to extract content manually
        try {
          // Try to extract values using regex as a last resort
          const responseMatch = responseContent.match(/"response":\s*"([^"]+)"/);
          const messageMatch = responseContent.match(/"message":\s*"([^"]+)"/);
          const typeMatch = responseContent.match(/"type":\s*"([^"]+)"/);
          
          if (responseMatch && messageMatch && typeMatch) {
            continueResult = {
              response: responseMatch[1],
              coaching: {
                message: messageMatch[1],
                type: typeMatch[1] as 'positive' | 'suggestion' | 'neutral'
              }
            };
            console.log('Successfully extracted content using regex fallback');
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
    
    const errorMessage = error instanceof Error ? error.message : 'Simulation failed. Please try again.';
    return res.status(500).json({ 
      error: errorMessage
    });
  }
} 