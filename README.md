# Kairoo

A minimal, privacy-first web app to help introverted or autistic teens understand social messages. Kairoo uses AI to detect manipulation, analyze tone, and suggest emotionally intelligent replies.

## Features

- **Privacy-First**: No sign-up required, no personal data stored
- **Anonymous Usage**: Generates random UUID for analytics only
- **Message Analysis**: Detects tone, sentiment, red flags, and manipulation tactics
- **Smart Responses**: Suggests appropriate replies based on message analysis
- **Outcome Advice**: Provides guidance on best approaches for different situations

## Tech Stack

- **Next.js** with TypeScript
- **Tailwind CSS** for styling
- **Pages Router** (not App Router)
- **Vercel**-compatible deployment

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── pages/
│   ├── index.tsx          # Landing page
│   ├── app.tsx            # Main application
│   ├── _app.tsx           # App wrapper
│   ├── _document.tsx      # Document structure
│   └── api/
│       ├── analyze.ts     # Message analysis endpoint
│       └── logEvent.ts    # Privacy-safe logging
└── styles/
    └── globals.css        # Global styles with Tailwind
```

## API Endpoints

### POST `/api/analyze`
Analyzes a message and returns insights.

**Request:**
```json
{
  "message": "The message to analyze",
  "context": "Optional context",
  "anonId": "anonymous-user-id"
}
```

**Response:**
```json
{
  "analysis": {
    "tone": "Urgent/Demanding",
    "redFlags": ["Creates artificial urgency"],
    "sentiment": "Neutral",
    "manipulation": []
  },
  "responses": ["Suggested response 1", "Suggested response 2"],
  "advice": "Guidance on how to handle this situation"
}
```

### POST `/api/logEvent`
Logs anonymous usage events for analytics.

**Request:**
```json
{
  "anonId": "anonymous-user-id",
  "eventType": "analyze_message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Privacy & Security

- **No Personal Data**: Messages are analyzed but never stored
- **Anonymous IDs**: Only random UUIDs are used for analytics
- **No Tracking**: No IP addresses, emails, or personal information collected
- **Secure Communication**: All API calls use HTTPS in production

## Next Steps

1. **Integrate AI**: Replace placeholder analysis with OpenAI GPT-4o or Claude API
2. **Enhanced Analytics**: Add privacy-focused analytics service (PostHog, Plausible)
3. **Improved UI**: Add more interactive features and better mobile experience
4. **Testing**: Add comprehensive test suite

## Development

- **Build**: `npm run build`
- **Start**: `npm start`
- **Lint**: `npm run lint`

## Deployment

This project is optimized for Vercel deployment. Simply connect your repository to Vercel for automatic deployments.

## License

MIT License - see LICENSE file for details.
