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
    if (!apiKey || apiKey.trim() === '') {
      console.error('ElevenLabs API key not configured or is empty');
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
    console.log('Attempting to call ElevenLabs API...');
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: cleanText,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5, // Moderate stability for natural variation
          similarity_boost: 0.8, // High similarity to base voice
          style: 0.45, // Increased style variation for more expressive speech
          use_speaker_boost: true
        }
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const errorDetail = errorBody?.detail?.message || 'No specific error message provided.';

      console.error(`ElevenLabs API Error: ${response.status} - ${errorDetail}`, {
        status: response.status,
        statusText: response.statusText,
        errorBody: errorBody,
      });
      
      // Provide more specific error feedback
      if (response.status === 401) {
        console.error('ElevenLabs API error: Unauthorized. Check your API key.');
        return res.status(401).json({ error: 'Invalid ElevenLabs API key. Please check your configuration.' });
      }
      
      if (response.status === 400) {
        return res.status(400).json({ error: `Voice generation failed due to a bad request: ${errorDetail}` });
      }

      const errorText = await response.text();
      console.error('ElevenLabs API error:', response.status, errorText);
      return res.status(500).json({ error: 'Voice generation failed due to an API error.' });
    }

    // Get the audio data
    const audioBuffer = await response.arrayBuffer();
    
    console.log('Successfully received audio from ElevenLabs.');

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