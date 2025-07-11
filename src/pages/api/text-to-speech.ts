import { NextApiRequest, NextApiResponse } from 'next';

interface TextToSpeechRequest {
  text: string;
  anonId: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, anonId }: TextToSpeechRequest = req.body;

    // Validate input
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!anonId || typeof anonId !== 'string') {
      return res.status(400).json({ error: 'Anonymous ID is required' });
    }

    // Check for ElevenLabs API key
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      console.error('ElevenLabs API key not configured');
      return res.status(500).json({ error: 'Voice service not configured' });
    }

    // Use a natural, youthful voice - Rachel is a good default for teenage conversations
    const voiceId = 'AZnzlk1XvdvUeBnXmlld'; // Rachel voice - natural, young-sounding

    // Clean up text for better speech synthesis
    const cleanText = text
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Call ElevenLabs API
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: cleanText,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5, // Moderate stability for natural variation
          similarity_boost: 0.8, // High similarity to base voice
          style: 0.2, // Slight style variation for naturalness
          use_speaker_boost: true
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', response.status, errorText);
      return res.status(500).json({ error: 'Voice generation failed' });
    }

    // Get the audio data
    const audioBuffer = await response.arrayBuffer();
    
    // Set appropriate headers for audio response
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.byteLength.toString());
    res.setHeader('Cache-Control', 'no-cache');
    
    // Send the audio data
    res.send(Buffer.from(audioBuffer));

  } catch (error: unknown) {
    console.error('Text-to-speech error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Voice generation failed';
    return res.status(500).json({ error: errorMessage });
  }
} 