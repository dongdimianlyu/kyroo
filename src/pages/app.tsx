import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AnalysisResult {
  analysis: {
    emotionalWarmth: number;
    manipulationRisk: number;
    passiveAggressive: number;
  };
  responses: Array<{
    tone: 'Direct' | 'Diplomatic' | 'Assertive';
    text: string;
  }>;
  advice: string;
}

export default function App() {
  const [message, setMessage] = useState('');
  const [context, setContext] = useState('');
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [anonId, setAnonId] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Initially collapsed

  // Generate anonymous ID on first visit
  useEffect(() => {
    let id = localStorage.getItem('anonId');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('anonId', id);
    }
    setAnonId(id);
  }, []);

  // Get analysis results - shows fillers when no analysis, real results when analyzed
  const getDisplayResults = () => {
    if (analysisResult) {
      return analysisResult;
    } else {
      // Non-misleading filler data
      return {
        analysis: {
          emotionalWarmth: 50, // Neutral middle values
          manipulationRisk: 50,
          passiveAggressive: 50,
        },
        responses: [
          { tone: 'Direct' as const, text: "Your response options will appear here after analysis." },
          { tone: 'Diplomatic' as const, text: "Multiple response styles will be suggested based on the context." },
          { tone: 'Assertive' as const, text: "Choose the tone that feels most comfortable for your situation." }
        ],
        advice: 'After analyzing the scenario, personalized guidance and next steps will appear here to help you navigate the conversation effectively.'
      };
    }
  };

  const displayResults = getDisplayResults();
  const hasResults = analysisResult !== null;

  const handleAnalyze = async () => {
    if (!message.trim()) {
      setError('Please enter a message to analyze');
      return;
    }

    setLoading(true);
    setError('');

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

      // Analyze the message with OpenAI
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          context: context.trim() || undefined,
          anonId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed. Please try again.');
      }

      const data: AnalysisResult = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    if (hasResults) {
      navigator.clipboard.writeText(text);
    }
  };

  const ToneBar = ({ 
    label, 
    leftLabel, 
    rightLabel, 
    value, 
    leftEmoji, 
    rightEmoji 
  }: {
    label: string;
    leftLabel: string;
    rightLabel: string;
    value: number;
    leftEmoji: string;
    rightEmoji: string;
  }) => (
    <div className="flex-1 space-y-3">
      <h4 className="text-sm font-medium text-gray-700 text-center">{label}</h4>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <span>{leftEmoji}</span>
            <span>{leftLabel}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>{rightLabel}</span>
            <span>{rightEmoji}</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              hasResults ? 'bg-indigo-600' : 'bg-gray-400'
            }`}
            style={{ width: `${value}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  // Render Settings page
  if (activeNav === 'Settings') {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Fixed Left Sidebar */}
        <aside className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-48'
        }`}>
          <div className="p-4">
            {/* Collapse Toggle */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center justify-center p-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors mb-6"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg className={`w-5 h-5 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-0' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Logo */}
            <Link href="/" className={`block mb-8 ${sidebarCollapsed ? 'text-center' : ''}`}>
              {sidebarCollapsed ? (
                <div className="text-xl font-bold text-indigo-600">K</div>
              ) : (
                <>
                  <h1 className="text-xl font-bold text-indigo-600">Kairoo</h1>
                  <p className="text-xs text-gray-500 mt-1">Social Intelligence</p>
                </>
              )}
            </Link>

            {/* Navigation */}
            <nav className="space-y-3">
              {[
                { name: 'Dashboard', icon: '📊' },
                { name: 'Settings', icon: '⚙️' }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveNav(item.name)}
                  className={`w-full text-left px-3 py-3 rounded-lg text-sm font-medium transition-colors flex items-center ${
                    sidebarCollapsed ? 'justify-center' : 'space-x-3'
                  } ${
                    activeNav === item.name
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Settings Content */}
        <main className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-48'
        }`}>
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">Settings</h1>
                                     <p className="text-lg text-gray-600 mb-8">
                     We&apos;re still building this section with care.
                   </p>
                </div>

                <div className="bg-indigo-50 rounded-lg p-6 text-left">
                  <h3 className="font-semibold text-indigo-900 mb-3">Coming Soon</h3>
                  <ul className="space-y-2 text-indigo-700">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Customizable analysis preferences
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Response style personalization
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Accessibility options
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Privacy controls
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => setActiveNav('Dashboard')}
                    className="inline-flex items-center px-6 py-3 text-base font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Fixed Left Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-48'
      }`}>
        <div className="p-4">
          {/* Collapse Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center p-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors mb-6"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg className={`w-5 h-5 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-0' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className={`block mb-8 ${sidebarCollapsed ? 'text-center' : ''}`}>
            {sidebarCollapsed ? (
              <div className="text-xl font-bold text-indigo-600">K</div>
            ) : (
              <>
                <h1 className="text-xl font-bold text-indigo-600">Kairoo</h1>
                <p className="text-xs text-gray-500 mt-1">Social Intelligence</p>
              </>
            )}
          </Link>

          {/* Navigation */}
          <nav className="space-y-3">
            {[
              { name: 'Dashboard', icon: '📊' },
              { name: 'Settings', icon: '⚙️' }
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveNav(item.name)}
                className={`w-full text-left px-3 py-3 rounded-lg text-sm font-medium transition-colors flex items-center ${
                  sidebarCollapsed ? 'justify-center' : 'space-x-3'
                } ${
                  activeNav === item.name
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <span className="text-lg">{item.icon}</span>
                {!sidebarCollapsed && <span>{item.name}</span>}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-48'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Upper Half - Input Section */}
          <div className="mb-8">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
                Message Analysis
              </h2>
              
              <div className="space-y-6">
                {/* Main Message Input */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-3">
                    What happened?
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-sm"
                    placeholder="Paste the message you received or describe what happened…"
                    disabled={loading}
                  />
                </div>

                {/* Context Input */}
                <div>
                  <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-3">
                    Context (Optional)
                  </label>
                  <input
                    type="text"
                    id="context"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="Add context (optional but helpful)"
                    disabled={loading}
                  />
                </div>

                {/* Analyze Button */}
                <button
                  onClick={handleAnalyze}
                  disabled={!message.trim() || loading}
                  className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base"
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

                {/* Error Display */}
                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lower Half - Results Section - Always Visible */}
          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-gray-900 text-center">
              {hasResults ? 'Analysis Results' : 'Analysis Preview'}
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Tone Analysis Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Tone Analysis
                </h3>
                
                <div className="flex flex-col space-y-8 h-full">
                  <ToneBar
                    label="Emotional Warmth"
                    leftLabel="Hostile"
                    rightLabel="Friendly"
                    value={displayResults.analysis.emotionalWarmth}
                    leftEmoji="🧊"
                    rightEmoji="🌞"
                  />
                  
                  <ToneBar
                    label="Manipulation Risk"
                    leftLabel="Supportive"
                    rightLabel="Manipulative"
                    value={displayResults.analysis.manipulationRisk}
                    leftEmoji="✅"
                    rightEmoji="🚩"
                  />
                  
                  <ToneBar
                    label="Passive-Aggressiveness"
                    leftLabel="Direct"
                    rightLabel="Passive-Aggressive"
                    value={displayResults.analysis.passiveAggressive}
                    leftEmoji="😊"
                    rightEmoji="😤"
                  />
                </div>
              </div>

              {/* Suggested Replies Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Suggested Replies
                </h3>
                
                <div className="space-y-4">
                  {displayResults.responses.map((reply, index) => (
                    <div key={index} className={`border border-gray-200 rounded-lg p-4 transition-colors ${
                      hasResults ? 'hover:bg-gray-50' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                          hasResults 
                            ? 'text-indigo-600 bg-indigo-50' 
                            : 'text-gray-500 bg-gray-100'
                        }`}>
                          {reply.tone}
                        </span>
                        <button
                          onClick={() => copyToClipboard(reply.text)}
                          className={`transition-colors p-1 rounded ${
                            hasResults 
                              ? 'text-gray-400 hover:text-gray-600' 
                              : 'text-gray-300 cursor-not-allowed'
                          }`}
                          title={hasResults ? "Copy to clipboard" : "Analyze message first"}
                          disabled={!hasResults}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                      <p className={`text-sm leading-relaxed ${
                        hasResults ? 'text-gray-700' : 'text-gray-500 italic'
                      }`}>
                        {reply.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* In the future... Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  In the future...
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className={`text-sm leading-relaxed ${
                      hasResults ? 'text-gray-700' : 'text-gray-500 italic'
                    }`}>
                      {displayResults.advice}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 