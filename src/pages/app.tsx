import { useState, useEffect, useRef } from 'react';
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

interface SimulationResponse {
  aiResponse: string;
  coaching: CoachingInsight;
  sceneDescription?: string;
}

interface ProgressEvaluation {
  progressScore: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export default function App() {
  const [message, setMessage] = useState('');
  const [context, setContext] = useState('');
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [anonId, setAnonId] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Initially collapsed

  // Simulation state
  const [scenario, setScenario] = useState('');
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [sceneDescription, setSceneDescription] = useState('');
  const [lastCoaching, setLastCoaching] = useState<CoachingInsight | null>(null);
  const [progressEvaluation, setProgressEvaluation] = useState<ProgressEvaluation | null>(null);
  
  // Speech features
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isConversationalMode, setIsConversationalMode] = useState(false);
  const [isWaitingForSpeech, setIsWaitingForSpeech] = useState(false);
  const [shouldAutoSend, setShouldAutoSend] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Generate anonymous ID on first visit
  useEffect(() => {
    let id = localStorage.getItem('anonId');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('anonId', id);
    }
    setAnonId(id);

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
    }

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setCurrentInput(transcript);
        setIsListening(false);
        
        // Trigger auto-send for voice input in simulation mode
        setShouldAutoSend(true);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      setSpeechEnabled(true);
    }
  }, []);

  // Auto-send message when voice input is received
  useEffect(() => {
    if (shouldAutoSend && currentInput.trim() && isSimulationActive) {
      setShouldAutoSend(false);
      // Create a synthetic send action
      const sendVoiceMessage = async () => {
        if (!currentInput.trim() || loading) return;

        const userMessage: Message = {
          id: crypto.randomUUID(),
          role: 'user',
          content: currentInput.trim(),
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setCurrentInput('');
        setLoading(true);
        setError('');

        try {
          const response = await fetch('/api/simulate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'continue',
              userMessage: userMessage.content,
              conversationHistory: messages,
              scenario,
              anonId,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to get response');
          }

          const data: SimulationResponse = await response.json();
          
          const aiMessage: Message = {
            id: crypto.randomUUID(),
            role: 'ai',
            content: data.aiResponse,
            timestamp: new Date(),
          };

          setMessages(prev => [...prev, aiMessage]);
          setLastCoaching(data.coaching);
          
          // Speak the AI response
          speakText(data.aiResponse);
          
          // Evaluate progress after each exchange
          setTimeout(() => {
            evaluateProgress();
          }, 500);
          
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to get response');
        } finally {
          setLoading(false);
        }
      };
      
      sendVoiceMessage();
    }
  }, [shouldAutoSend, currentInput, isSimulationActive, loading, messages, scenario, anonId]);

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
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-neutral-700">{label}</h4>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center space-x-1">
            <span>{leftEmoji}</span>
            <span>{leftLabel}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>{rightLabel}</span>
            <span>{rightEmoji}</span>
          </div>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full transition-smooth ${
              hasResults ? 'bg-primary-600' : 'bg-neutral-400'
            }`}
            style={{ width: `${value}%` }}
          ></div>
        </div>
        <div className="text-right">
          <span className={`text-xs font-medium ${
            hasResults ? 'text-neutral-700' : 'text-neutral-500'
          }`}>
            {value}%
          </span>
        </div>
      </div>
    </div>
  );

  // Simulation functions
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const startListeningConversational = () => {
    if (recognitionRef.current && !isListening && !isSpeaking) {
      setIsWaitingForSpeech(true);
      setIsListening(true);
      
      // Set up one-time listeners for conversational mode
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setCurrentInput(transcript);
        setIsListening(false);
        setIsWaitingForSpeech(false);
        
        // Automatically send the message in conversational mode
        setTimeout(() => {
          sendMessage();
        }, 100);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
        setIsWaitingForSpeech(false);
      };
      
      recognitionRef.current.start();
    }
  };

    const speakText = async (text: string) => {
    if (isAudioMuted) return;

    try {
      setIsSpeaking(true);
      
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // Call ElevenLabs API for text-to-speech
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          anonId: anonId
        }),
      });

      if (!response.ok) {
        throw new Error('Voice generation failed');
      }

      // Create audio from the response
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Create and play audio element
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        
        // In conversational mode, start listening after speech ends
        if (isConversationalMode && isSimulationActive) {
          setTimeout(() => {
            startListeningConversational();
          }, 500); // Small delay before listening
        }
      };
      
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        console.error('Audio playback error');
      };
      
      await audio.play();
      
    } catch (error) {
      console.error('Text-to-speech error:', error);
      setIsSpeaking(false);
      
      // Fallback to browser TTS if ElevenLabs fails
      if (synthesisRef.current) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.85;
        utterance.pitch = 0.9;
        utterance.volume = 0.7;
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setIsSpeaking(false);
          if (isConversationalMode && isSimulationActive) {
            setTimeout(() => {
              startListeningConversational();
            }, 500);
          }
        };
        utterance.onerror = () => setIsSpeaking(false);
        
        synthesisRef.current.speak(utterance);
      }
    }
  };

  const stopSpeaking = () => {
    // Stop ElevenLabs audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    // Stop browser TTS as fallback
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
    }
    
    setIsSpeaking(false);
  };

  const startSimulation = async () => {
    if (!scenario.trim()) {
      setError('Please describe the situation you want to practice.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'start',
          scenario: scenario.trim(),
          anonId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start simulation');
      }

      const data: SimulationResponse = await response.json();
      
      setSceneDescription(data.sceneDescription || '');
      setMessages([{
        id: crypto.randomUUID(),
        role: 'ai',
        content: data.aiResponse,
        timestamp: new Date(),
      }]);
      setIsSimulationActive(true);
      
      // Speak the first AI message
      speakText(data.aiResponse);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start simulation');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!currentInput.trim() || loading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: currentInput.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'continue',
          userMessage: userMessage.content,
          conversationHistory: messages,
          scenario,
          anonId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data: SimulationResponse = await response.json();
      
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: 'ai',
        content: data.aiResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setLastCoaching(data.coaching);
      
      // Speak the AI response
      speakText(data.aiResponse);
      
      // Evaluate progress after each exchange
      setTimeout(() => {
        evaluateProgress();
      }, 500);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  const handleRephrase = async (tone: 'softer' | 'stronger' | 'different' | 'curious') => {
    if (!currentInput.trim()) {
      setError('Please enter a message to rephrase.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/rephrase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput.trim(),
          tone,
          anonId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get rephrase suggestions');
      }

      const data = await response.json();
      
      // Show the suggestions in an alert for now (could be improved with a modal)
      const suggestionText = data.suggestions.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n\n');
      alert(`Here are some ${tone} alternatives:\n\n${suggestionText}`);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get rephrase suggestions');
    } finally {
      setLoading(false);
    }
  };

  const evaluateProgress = async () => {
    if (messages.length === 0) return;

    try {
      const response = await fetch('/api/evaluate-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationHistory: messages,
          scenario,
          anonId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to evaluate progress');
      }

      const data: ProgressEvaluation = await response.json();
      setProgressEvaluation(data);
      
    } catch (err) {
      console.error('Progress evaluation error:', err);
      // Don't show error to user, just log it
    }
  };

  const resetSimulation = () => {
    setIsSimulationActive(false);
    setMessages([]);
    setScenario('');
    setSceneDescription('');
    setLastCoaching(null);
    setProgressEvaluation(null);
    setCurrentInput('');
    setError('');
    setIsConversationalMode(false);
    setIsWaitingForSpeech(false);
    stopSpeaking();
    
    // Stop any ongoing speech recognition
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  // Render Kairoo LIVE page
  if (activeNav === 'Kairoo LIVE') {
    return (
      <div className="min-h-screen bg-neutral-50">
        {/* Top Navigation */}
        <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">K</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-neutral-900">Kairoo</h1>
                  <p className="text-xs text-neutral-500 -mt-1">Social Intelligence</p>
                </div>
              </Link>
              
              {/* Navigation Tabs */}
              <div className="flex items-center space-x-1 bg-neutral-100 rounded-xl p-1">
                {[
                  { name: 'Dashboard', icon: '📊' },
                  { name: 'Kairoo LIVE', icon: '💬' },
                  { name: 'Settings', icon: '⚙️' }
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      if (item.name !== activeNav) {
                        setIsTransitioning(true);
                        setTimeout(() => {
                          setActiveNav(item.name);
                          setIsTransitioning(false);
                        }, 150);
                      }
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                      activeNav === item.name
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-8">
          <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Kairoo LIVE</h1>
              <p className="text-neutral-600">
                Practice real-life conversations in a safe, supportive environment.
              </p>
            </div>

          {/* Audio Controls */}
          {isSimulationActive && (
            <div className="flex justify-end items-center gap-3 mb-6">
              {speechEnabled && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-600">Mode:</span>
                  <button
                    onClick={() => {
                      setIsConversationalMode(!isConversationalMode);
                      if (isConversationalMode) {
                        setIsWaitingForSpeech(false);
                        if (recognitionRef.current) {
                          recognitionRef.current.stop();
                        }
                      }
                    }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-smooth ${
                      isConversationalMode
                        ? 'bg-success-100 text-success-700 border border-success-200'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                    title={isConversationalMode ? "Switch to typing mode" : "Switch to conversational mode - speak directly to AI"}
                  >
                    {isConversationalMode ? '🗣️ Voice' : '⌨️ Type'}
                  </button>
                </div>
              )}
              
              <button
                onClick={() => {
                  setIsAudioMuted(!isAudioMuted);
                  if (!isAudioMuted) stopSpeaking();
                }}
                className="p-2 text-neutral-600 hover:text-secondary-600 hover:bg-secondary-50 rounded-lg transition-smooth"
                title={isAudioMuted ? "Enable audio" : "Mute audio"}
              >
                {isAudioMuted ? '🔇' : '🔈'}
              </button>
            </div>
          )}

          {!isSimulationActive ? (
            /* Scenario Setup */
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-4">Start a Practice Session</h2>
                  <p className="text-neutral-600">
                    Practice conversations in a safe space with AI coaching and feedback.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-3">
                      What situation would you like to practice?
                    </label>
                    <textarea
                      value={scenario}
                      onChange={(e) => setScenario(e.target.value)}
                      placeholder="e.g., Having lunch with a new classmate, Texting a friend who might be upset, Asking for help with homework..."
                      className="input-field h-32 resize-none"
                      disabled={loading}
                    />
                  </div>

                  {error && (
                    <div className="bg-error-50 border border-error-200 rounded-xl p-4">
                      <p className="text-error-600 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      onClick={startSimulation}
                      disabled={loading || !scenario.trim()}
                      className="w-full button-primary py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Starting practice session...' : 'Begin Practice'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Active Simulation */
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-neutral-900">Conversation Progress</h3>
                  <span className="text-sm text-primary-600">
                    {progressEvaluation ? `${progressEvaluation.progressScore}%` : 'Starting...'}
                  </span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-smooth"
                    style={{ width: `${progressEvaluation?.progressScore || 0}%` }}
                  />
                </div>
                {progressEvaluation && (
                  <p className="text-sm text-neutral-600 mt-2">
                    {progressEvaluation.feedback}
                  </p>
                )}
              </div>

              {/* Scene Description */}
              {sceneDescription && (
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                  <h3 className="font-semibold text-neutral-900 mb-3 flex items-center">
                    <span className="w-6 h-6 bg-secondary-100 rounded-lg flex items-center justify-center mr-2 text-sm">📍</span>
                    Scene Setting
                  </h3>
                  <p className="text-neutral-600 italic">{sceneDescription}</p>
                </div>
              )}

              {/* Conversation Cards */}
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user' 
                          ? 'bg-primary-100 text-primary-600' 
                          : 'bg-secondary-100 text-secondary-600'
                      }`}>
                        {message.role === 'user' ? '👤' : '🤖'}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-neutral-900 mb-2">
                          {message.role === 'user' ? 'You' : 'AI Partner'}
                        </h4>
                        <p className="text-neutral-700">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-secondary-100 text-secondary-600">
                        🤖
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-neutral-900 mb-2">AI Partner is thinking...</h4>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Coaching Insights */}
              {lastCoaching && (
                <div className="bg-success-50 rounded-2xl border border-success-200 p-6">
                  <h3 className="font-semibold text-success-800 mb-3 flex items-center">
                    <span className="w-6 h-6 bg-success-100 rounded-lg flex items-center justify-center mr-2 text-sm">💡</span>
                    Coaching Insight
                  </h3>
                  <p className={`${
                    lastCoaching.type === 'positive' ? 'text-success-700' :
                    lastCoaching.type === 'suggestion' ? 'text-warning-700' :
                    'text-neutral-700'
                  }`}>
                    {lastCoaching.message}
                  </p>
                </div>
              )}

              {/* Input Area */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                <h3 className="font-semibold text-neutral-900 mb-4">Your Response</h3>
                
                {isConversationalMode ? (
                  <div className="text-center space-y-4">
                    <div className="bg-success-50 rounded-xl p-6 border border-success-200">
                      <h4 className="font-semibold text-neutral-900 mb-2">🗣️ Voice Mode Active</h4>
                      <p className="text-sm text-neutral-600 mb-4">
                        Speak naturally and the AI will respond with voice.
                      </p>
                      
                      {isWaitingForSpeech ? (
                        <div className="flex items-center justify-center space-x-2 text-success-600">
                          <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium">Listening...</span>
                        </div>
                      ) : isSpeaking ? (
                        <div className="flex items-center justify-center space-x-2 text-primary-600">
                          <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium">AI is speaking...</span>
                        </div>
                      ) : (
                        <button
                          onClick={startListeningConversational}
                          disabled={loading || isListening || isSpeaking}
                          className="button-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Start Speaking
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <textarea
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      placeholder="Type your response..."
                      className="input-field h-24 resize-none"
                      disabled={loading}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {speechEnabled && (
                          <button
                            onClick={startListening}
                            disabled={loading || isListening}
                            className={`p-2 rounded-lg transition-smooth ${
                              isListening
                                ? 'bg-error-500 text-white'
                                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                            }`}
                            title="Voice input"
                          >
                            🎤
                          </button>
                        )}
                        <span className="text-sm text-neutral-500">
                          {isListening ? 'Listening...' : 'Press Enter to send'}
                        </span>
                      </div>
                      
                      <button
                        onClick={sendMessage}
                        disabled={loading || !currentInput.trim()}
                        className="button-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Send Response
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                <h3 className="font-semibold text-neutral-900 mb-4">Need help with your response?</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleRephrase('different')}
                    className="px-4 py-2 bg-primary-100 text-primary-700 font-medium rounded-lg hover:bg-primary-200 transition-smooth"
                    disabled={loading || !currentInput.trim()}
                  >
                    📝 Rephrase
                  </button>
                  <button
                    onClick={() => handleRephrase('softer')}
                    className="px-4 py-2 bg-success-100 text-success-700 font-medium rounded-lg hover:bg-success-200 transition-smooth"
                    disabled={loading || !currentInput.trim()}
                  >
                    🌸 Softer Tone
                  </button>
                  <button
                    onClick={() => handleRephrase('stronger')}
                    className="px-4 py-2 bg-warning-100 text-warning-700 font-medium rounded-lg hover:bg-warning-200 transition-smooth"
                    disabled={loading || !currentInput.trim()}
                  >
                    💪 Stronger Tone
                  </button>
                  <button
                    onClick={() => handleRephrase('curious')}
                    className="px-4 py-2 bg-secondary-100 text-secondary-700 font-medium rounded-lg hover:bg-secondary-200 transition-smooth"
                    disabled={loading || !currentInput.trim()}
                  >
                    🤔 Curious Tone
                  </button>
                  <button
                    onClick={resetSimulation}
                    className="px-4 py-2 bg-neutral-100 text-neutral-700 font-medium rounded-lg hover:bg-neutral-200 transition-smooth"
                  >
                    🔄 New Scenario
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-error-50 border border-error-200 rounded-xl p-4">
                  <p className="text-error-600 text-sm">{error}</p>
                </div>
              )}
            </div>
          )}
          </div>
        </main>
      </div>
    );
  }

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
                { name: 'Kairoo LIVE', icon: '💬', href: '/simulate' },
                { name: 'Settings', icon: '⚙️' }
              ].map((item) =>
                item.href ? (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`w-full text-left px-3 py-3 rounded-lg text-sm font-medium transition-colors flex items-center ${
                      sidebarCollapsed ? 'justify-center' : 'space-x-3'
                    } text-gray-600 hover:text-gray-900 hover:bg-gray-50`}
                    title={sidebarCollapsed ? item.name : undefined}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {!sidebarCollapsed && <span>{item.name}</span>}
                  </Link>
                ) : (
                  <button
                  key={item.name}
                  onClick={() => {
                    if (item.name !== activeNav) {
                      setIsTransitioning(true);
                      setTimeout(() => {
                        setActiveNav(item.name);
                        setIsTransitioning(false);
                      }, 150);
                    }
                  }}
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
            <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
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
                    onClick={() => {
                      setIsTransitioning(true);
                      setTimeout(() => {
                        setActiveNav('Dashboard');
                        setIsTransitioning(false);
                      }, 150);
                    }}
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
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-900">Kairoo</h1>
                <p className="text-xs text-neutral-500 -mt-1">Social Intelligence</p>
              </div>
            </Link>
            
            {/* Navigation Tabs */}
            <div className="flex items-center space-x-1 bg-neutral-100 rounded-xl p-1">
              {[
                { name: 'Dashboard', icon: '📊' },
                { name: 'Kairoo LIVE', icon: '💬' },
                { name: 'Settings', icon: '⚙️' }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    if (item.name !== activeNav) {
                      setIsTransitioning(true);
                      setTimeout(() => {
                        setActiveNav(item.name);
                        setIsTransitioning(false);
                      }, 150);
                    }
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                    activeNav === item.name
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Message Analysis</h1>
            <p className="text-neutral-600">
              Understand tone, spot manipulation, and get personalized response suggestions.
            </p>
          </div>

        {/* Input Section */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Message Input */}
                <div className="space-y-4">
                  <label htmlFor="message" className="block text-sm font-medium text-neutral-700">
                    What happened?
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="input-field h-40 resize-none"
                    placeholder="Paste the message you received or describe what happened…"
                    disabled={loading}
                  />
                </div>

                {/* Context Input */}
                <div className="space-y-4">
                  <label htmlFor="context" className="block text-sm font-medium text-neutral-700">
                    Context (Optional)
                  </label>
                  <input
                    type="text"
                    id="context"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    className="input-field"
                    placeholder="Add context (optional but helpful)"
                    disabled={loading}
                  />
                  
                  {/* Analyze Button */}
                  <button
                    onClick={handleAnalyze}
                    disabled={!message.trim() || loading}
                    className="w-full button-primary py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
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
              </div>

              {/* Error Display */}
              {error && (
                <div className="mt-6 p-4 bg-error-50 border border-error-200 rounded-xl">
                  <p className="text-error-600 text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-neutral-900">
              {hasResults ? 'Analysis Results' : 'Analysis Preview'}
            </h2>
            {!hasResults && (
              <div className="flex items-center text-sm text-neutral-500">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Preview of what you'll see after analysis
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tone Analysis Card */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 hover:shadow-md transition-smooth">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">Tone Analysis</h3>
              </div>
              
              <div className="space-y-6">
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
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 hover:shadow-md transition-smooth">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">Suggested Replies</h3>
              </div>
              
              <div className="space-y-4">
                {displayResults.responses.map((reply, index) => (
                  <div key={index} className={`border border-neutral-200 rounded-xl p-4 transition-smooth ${
                    hasResults ? 'hover:bg-neutral-50' : 'bg-neutral-50'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                        hasResults 
                          ? 'text-primary-600 bg-primary-50' 
                          : 'text-neutral-500 bg-neutral-100'
                      }`}>
                        {reply.tone}
                      </span>
                      <button
                        onClick={() => copyToClipboard(reply.text)}
                        className={`transition-smooth p-2 rounded-lg ${
                          hasResults 
                            ? 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100' 
                            : 'text-neutral-300 cursor-not-allowed'
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
                      hasResults ? 'text-neutral-700' : 'text-neutral-500 italic'
                    }`}>
                      {reply.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Guidance Card */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 hover:shadow-md transition-smooth">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">Guidance</h3>
              </div>
              
              <div className="bg-neutral-50 rounded-xl p-4">
                <p className={`text-sm leading-relaxed ${
                  hasResults ? 'text-neutral-700' : 'text-neutral-500 italic'
                }`}>
                  {displayResults.advice}
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
} 