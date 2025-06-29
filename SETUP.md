# Kairoo Setup Instructions

## OpenAI API Configuration

To enable the real-time message analysis, you need to configure your OpenAI API key:

### 1. Get Your OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in to your account or create a new one
3. Create a new API key
4. Copy the API key (it starts with `sk-`)

### 2. Configure Environment Variables
1. Create a file named `.env.local` in the root directory of your project
2. Add your OpenAI API key:

```bash
OPENAI_API_KEY=sk-your-actual-api-key-here
```

**Important:** 
- Replace `sk-your-actual-api-key-here` with your actual OpenAI API key
- Never commit your `.env.local` file to version control
- The `.env.local` file is already in `.gitignore` to prevent accidental commits

### 3. Start the Application
```bash
npm run dev
```

### 4. Test the Integration
1. Navigate to `http://localhost:3000/app`
2. Enter a message in the textarea
3. Click "Analyze Message"
4. You should see real AI-powered analysis results

## API Usage & Costs

- The app uses GPT-4 for analysis
- Each analysis costs approximately $0.01-0.03 depending on message length
- Monitor your usage at [OpenAI Usage Dashboard](https://platform.openai.com/usage)

## Troubleshooting

### Common Issues:

**"OpenAI API key not configured"**
- Ensure `.env.local` exists in the root directory
- Check that `OPENAI_API_KEY` is correctly set
- Restart the development server after adding the key

**"API quota exceeded"**
- Check your OpenAI billing and usage limits
- Add payment method if using free tier

**"Rate limit exceeded"**
- Wait a moment and try again
- Consider implementing request queuing for high usage

## Security Notes

- API keys are processed server-side only
- User messages are sent to OpenAI for analysis but not stored by Kairoo
- Anonymous IDs are used for logging, no personal data is collected 