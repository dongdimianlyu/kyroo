import type { NextApiRequest, NextApiResponse } from 'next';

interface LogEventRequest {
  anonId: string;
  eventType: string;
  timestamp: string;
}

interface LogEventResponse {
  success: boolean;
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LogEventResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { anonId, eventType, timestamp }: LogEventRequest = req.body;

    // Validate input
    if (!anonId || typeof anonId !== 'string') {
      return res.status(400).json({ success: false, message: 'Anonymous ID is required' });
    }

    if (!eventType || typeof eventType !== 'string') {
      return res.status(400).json({ success: false, message: 'Event type is required' });
    }

    if (!timestamp || typeof timestamp !== 'string') {
      return res.status(400).json({ success: false, message: 'Timestamp is required' });
    }

    // Privacy-first logging - only log anonymous usage patterns
    // No message content, no personal data, no IP addresses
    const logEntry = {
      anonId: anonId.substring(0, 8) + '***', // Partially mask even the anonymous ID
      eventType,
      timestamp,
      userAgent: req.headers['user-agent'] ? 'present' : 'absent', // Just presence, not actual value
    };

    // TODO: In production, send this to your analytics service
    // For now, just log to console (in production, you might use services like:
    // - PostHog (privacy-focused)
    // - Plausible Analytics
    // - Simple database logging
    // - File-based logging
    console.log('Privacy-safe event logged:', logEntry);

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 100));

    res.status(200).json({ 
      success: true, 
      message: 'Event logged successfully' 
    });

  } catch (error) {
    console.error('Logging error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}

// Example of what you might log in production:
// - Daily/weekly usage patterns
// - Feature usage (which analysis types are most common)
// - Performance metrics (response times)
// - Error rates
// - User retention (based on anonymous IDs returning)
//
// What you should NEVER log:
// - Actual message content
// - IP addresses
// - Personal information
// - Full user agents (just presence/absence)
// - Location data 