import { useState, useEffect } from 'react';
import Link from 'next/link';

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

export default function App() {
  const [message, setMessage] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [anonId, setAnonId] = useState('');

  // Generate anonymous ID on first visit
  useEffect(() => {
    let id = localStorage.getItem('anonId');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('anonId', id);
    }
    setAnonId(id);
  }, []);

  const handleAnalyze = async () => {
    if (!message.trim()) {
      setError('Please enter a message to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Log the analyze event
      await fetch('/api/logEvent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anonId,
          eventType: 'analyze_message',
          timestamp: new Date().toISOString()
        })
      });

      // Analyze the message
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          context,
          anonId
        })
      });

      if (!response.ok) {
        throw new Error('Analysis failed. Please try again.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            Kairoo
          </Link>
          <p className="text-sm text-gray-500">Privacy-first message analysis</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Analyze a Message
          </h2>
          
          <div className="space-y-4">
            {/* Message Input */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message to analyze *
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                placeholder="Paste the message you'd like to understand better..."
              />
            </div>

            {/* Context Input */}
            <div>
              <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-2">
                Add context (optional)
              </label>
              <textarea
                id="context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                placeholder="Any background info that might help with analysis..."
              />
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={loading || !message.trim()}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </span>
              ) : (
                'Analyze Message'
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            {/* Message Analysis Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Message Analysis
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Tone:</span>
                  <span className="ml-2 text-gray-600">{result.analysis.tone}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Sentiment:</span>
                  <span className="ml-2 text-gray-600">{result.analysis.sentiment}</span>
                </div>
                {result.analysis.redFlags.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">Red Flags:</span>
                    <ul className="ml-2 mt-1 space-y-1">
                      {result.analysis.redFlags.map((flag, index) => (
                        <li key={index} className="text-red-600 text-sm flex items-start">
                          <span className="text-red-500 mr-1">⚠️</span>
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.analysis.manipulation.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">Manipulation Tactics:</span>
                    <ul className="ml-2 mt-1 space-y-1">
                      {result.analysis.manipulation.map((tactic, index) => (
                        <li key={index} className="text-orange-600 text-sm flex items-start">
                          <span className="text-orange-500 mr-1">🚨</span>
                          {tactic}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Suggested Responses Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Suggested Responses
              </h3>
              <div className="space-y-3">
                {result.responses.map((response, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-md">
                    <p className="text-gray-700 text-sm">{response}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Outcome Advice Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Outcome Advice
              </h3>
              <div className="p-3 bg-blue-50 rounded-md">
                <p className="text-gray-700 text-sm">{result.advice}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 