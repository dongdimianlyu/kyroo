import { useState } from 'react';
import Link from 'next/link';

export default function App() {
  const [message, setMessage] = useState('');
  const [context, setContext] = useState('');
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [hasResults, setHasResults] = useState(false);

  // Analysis results - shows fillers when no analysis, real results when analyzed
  const getAnalysisResults = () => {
    if (hasResults) {
      return {
        emotionalWarmth: 75, // 0-100 scale
        manipulationRisk: 25,
        passiveAggressive: 40,
        suggestedReplies: [
          { tone: 'Direct', text: "I understand your point. Let me think about this and get back to you." },
          { tone: 'Diplomatic', text: "Thank you for sharing this with me. I'd like to discuss this further when we both have time." },
          { tone: 'Assertive', text: "I appreciate you reaching out. I need some time to process this before responding." }
        ],
        outcomeAdvice: {
          action: 'Clarify',
          explanation: 'This message contains some ambiguous elements that could benefit from clarification. Consider asking specific questions to better understand the sender\'s intentions and expectations.'
        }
      };
    } else {
      // Neutral filler data
      return {
        emotionalWarmth: 50, // Neutral middle values
        manipulationRisk: 50,
        passiveAggressive: 50,
        suggestedReplies: [
          { tone: 'Direct', text: "Your response options will appear here after analysis." },
          { tone: 'Diplomatic', text: "Multiple response styles will be suggested based on your message." },
          { tone: 'Assertive', text: "Choose the tone that feels most comfortable for your situation." }
        ],
        outcomeAdvice: {
          action: 'Analyze',
          explanation: 'After analyzing your message, personalized guidance and next steps will appear here to help you navigate the conversation effectively.'
        }
      };
    }
  };

  const analysisResults = getAnalysisResults();

  const handleAnalyze = () => {
    if (message.trim()) {
      setHasResults(true);
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Fixed Left Sidebar - Made wider and more aesthetic */}
      <aside className="fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-sm" style={{ width: '200px' }}>
        <div className="p-6">
          {/* Logo */}
          <Link href="/" className="block mb-8">
            <h1 className="text-xl font-bold text-indigo-600">Kairoo</h1>
            <p className="text-xs text-gray-500 mt-1">Social Intelligence</p>
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
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center space-x-3 ${
                  activeNav === item.name
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1" style={{ marginLeft: '200px' }}>
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
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-sm"
                    placeholder="Paste your message or explain your scenario here…"
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
                    placeholder="Add context (optional)"
                  />
                </div>

                {/* Analyze Button */}
                <button
                  onClick={handleAnalyze}
                  disabled={!message.trim()}
                  className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base"
                >
                  Analyze Message
                </button>
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
                    value={analysisResults.emotionalWarmth}
                    leftEmoji="🧊"
                    rightEmoji="🌞"
                  />
                  
                  <ToneBar
                    label="Manipulation Risk"
                    leftLabel="Supportive"
                    rightLabel="Manipulative"
                    value={analysisResults.manipulationRisk}
                    leftEmoji="✅"
                    rightEmoji="🚩"
                  />
                  
                  <ToneBar
                    label="Passive-Aggressiveness"
                    leftLabel="Direct"
                    rightLabel="Passive-Aggressive"
                    value={analysisResults.passiveAggressive}
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
                  {analysisResults.suggestedReplies.map((reply, index) => (
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
                  <div className="text-center">
                    <button className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      hasResults 
                        ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                        : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!hasResults}
                    >
                      {analysisResults.outcomeAdvice.action}
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className={`text-sm leading-relaxed ${
                      hasResults ? 'text-gray-700' : 'text-gray-500 italic'
                    }`}>
                      {analysisResults.outcomeAdvice.explanation}
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