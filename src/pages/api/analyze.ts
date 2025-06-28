import type { NextApiRequest, NextApiResponse } from 'next';

interface AnalyzeRequest {
  message: string;
  context?: string;
  anonId: string;
}

interface AnalysisResult {
  analysis: {
    tone: string;
    redFlags: string[];
    sentiment: string;
    manipulation: string[];
  };
  responses: string[];
  advice: string;
}

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

    // TODO: Replace this with actual OpenAI GPT-4o API call
    // For now, return placeholder analysis based on message content
    const analysisResult: AnalysisResult = generatePlaceholderAnalysis(message, context);

    res.status(200).json(analysisResult);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Placeholder analysis function - replace with actual AI analysis
function generatePlaceholderAnalysis(message: string, context?: string): AnalysisResult {
  const lowerMessage = message.toLowerCase();
  
  // Simple tone detection
  let tone = 'Neutral';
  if (lowerMessage.includes('!') || lowerMessage.includes('urgent') || lowerMessage.includes('asap')) {
    tone = 'Urgent/Demanding';
  } else if (lowerMessage.includes('please') || lowerMessage.includes('thank')) {
    tone = 'Polite';
  } else if (lowerMessage.includes('angry') || lowerMessage.includes('mad') || lowerMessage.includes('hate')) {
    tone = 'Aggressive';
  } else if (lowerMessage.includes('sorry') || lowerMessage.includes('apologize')) {
    tone = 'Apologetic';
  }

  // Simple sentiment analysis
  let sentiment = 'Neutral';
  if (lowerMessage.includes('love') || lowerMessage.includes('great') || lowerMessage.includes('amazing')) {
    sentiment = 'Positive';
  } else if (lowerMessage.includes('hate') || lowerMessage.includes('terrible') || lowerMessage.includes('awful')) {
    sentiment = 'Negative';
  }

  // Check for potential red flags
  const redFlags: string[] = [];
  if (lowerMessage.includes('secret') || lowerMessage.includes('don\'t tell')) {
    redFlags.push('Requests secrecy or confidentiality');
  }
  if (lowerMessage.includes('right now') || lowerMessage.includes('immediately')) {
    redFlags.push('Creates artificial urgency');
  }
  if (lowerMessage.includes('you always') || lowerMessage.includes('you never')) {
    redFlags.push('Uses absolute language that may be unfair');
  }

  // Check for manipulation tactics
  const manipulation: string[] = [];
  if (lowerMessage.includes('guilt') || lowerMessage.includes('disappointed')) {
    manipulation.push('Guilt-tripping');
  }
  if (lowerMessage.includes('everyone else') || lowerMessage.includes('nobody else')) {
    manipulation.push('Social pressure/comparison');
  }
  if (lowerMessage.includes('if you really') || lowerMessage.includes('prove')) {
    manipulation.push('Conditional affection');
  }

  // Generate responses based on analysis
  const responses: string[] = [];
  if (tone === 'Urgent/Demanding') {
    responses.push("I understand this seems important to you. Can we discuss the timeline?");
    responses.push("I'd like to help. Let me check my schedule and get back to you.");
  } else if (tone === 'Aggressive') {
    responses.push("I can see you're upset. Can we talk about what's bothering you?");
    responses.push("I want to understand your perspective. Can we discuss this calmly?");
  } else {
    responses.push("Thank you for sharing this with me. I appreciate you reaching out.");
    responses.push("I hear what you're saying. Let me think about this and respond thoughtfully.");
    responses.push("I understand. Can we talk more about this when we both have time?");
  }

  // Generate advice
  let advice = "This message appears to be straightforward communication. ";
  if (redFlags.length > 0 || manipulation.length > 0) {
    advice = "Be cautious with this message. Consider setting boundaries and taking time to respond thoughtfully. ";
  }
  advice += "Remember that you have the right to take time to process and respond at your own pace.";

  return {
    analysis: {
      tone,
      redFlags,
      sentiment,
      manipulation
    },
    responses,
    advice
  };
} 