import { useState, useRef, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-error-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Something went wrong</h2>
            <p className="text-neutral-600 mb-6">
              We encountered an unexpected error. Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="button-primary"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

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

interface SimulationSummary {
  smoothnessScore: number;
  whatWentWell: string;
  improvementAreas: string[];
  encouragingMessage: string;
}

function App() {
  const [message, setMessage] = useState('');
  const [context, setContext] = useState('');
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [anonId, setAnonId] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  // Simulation state
  const [scenario, setScenario] = useState('');
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [sceneDescription, setSceneDescription] = useState('');
  const [lastCoaching, setLastCoaching] = useState<CoachingInsight | null>(null);
  const [progressEvaluation, setProgressEvaluation] = useState<ProgressEvaluation | null>(null);
  const [simulationSummary, setSimulationSummary] = useState<SimulationSummary | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [lastUserTranscript, setLastUserTranscript] = useState('');
  
  // Speech features
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout | null>(null);
  const [transcriptToSend, setTranscriptToSend] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Ref to hold the latest state for callbacks to prevent stale closures
  const stateRef = useRef({
    isSimulationActive, 
    isSpeaking, 
    loading, 
    currentTranscript, 
    silenceTimer,
    isListening
  });

  // Keep the ref updated with the latest state on every render
  useEffect(() => {
    stateRef.current = {
      isSimulationActive, 
      isSpeaking, 
      loading, 
      currentTranscript, 
      silenceTimer,
      isListening
    };
  });

  const getDisplayResults = () => {
    if (analysisResult) {
      return analysisResult;
    } else {
      // Non-misleading filler data
      return {
        analysis: {
          emotionalWarmth: 0,
          manipulationRisk: 0,
          passiveAggressive: 0,
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
            className={`h-2.5 rounded-full transition-all duration-300 ${
              hasResults ? 'bg-secondary-600' : 'bg-neutral-400'
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

  const startListening = () => {
    if (recognitionRef.current && !stateRef.current.isListening && !stateRef.current.isSpeaking && speechEnabled) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const evaluateProgress = useCallback(async () => {
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
        console.warn('Progress evaluation failed:', response.status, response.statusText);
        return;
      }

      const data: ProgressEvaluation = await response.json();
      setProgressEvaluation(data);
      
    } catch (err) {
      console.error('Progress evaluation error:', err);
    }
  }, [messages, scenario, anonId]);

  const speakText = useCallback(async (text: string) => {
    console.log('🔊 speakText called with text:', text);
    console.log('🔇 Audio muted?', isAudioMuted);
    
    if (isAudioMuted) {
      console.log('🔇 Audio is muted, skipping TTS');
      return;
    }

    try {
      console.log('🎵 Setting isSpeaking to true');
      setIsSpeaking(true);
      
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        console.log('⏹️ Stopped previous audio');
      }

      console.log('📞 Calling ElevenLabs API...');
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

      console.log('📡 ElevenLabs API response status:', response.status);

      if (!response.ok) {
        console.error('❌ ElevenLabs TTS failed, using browser fallback');
        throw new Error('Voice generation failed');
      }

      // Create audio from the response
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log('🎵 Created audio blob, size:', audioBlob.size);
      
      // Create and play audio element
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        console.log('✅ ElevenLabs audio finished playing, isSpeaking set to false');
      };
      
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        console.error('❌ Audio playback error');
      };
      
      await audio.play();
      console.log('▶️ ElevenLabs audio started playing');
      
    } catch (error) {
      console.error('❌ Text-to-speech error:', error);
      console.log('🌐 Falling back to browser TTS');
      
      // Fallback to browser TTS if ElevenLabs fails
      if (synthesisRef.current) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.85;
        utterance.pitch = 0.9;
        utterance.volume = 0.7;
        
        utterance.onstart = () => {
          setIsSpeaking(true);
          console.log('▶️ Browser TTS started playing, isSpeaking set to true');
        };
        utterance.onend = () => {
          setIsSpeaking(false);
          console.log('✅ Browser TTS finished playing, isSpeaking set to false');
        };
        utterance.onerror = () => {
          setIsSpeaking(false);
          console.error('❌ Browser TTS error, isSpeaking set to false');
        };
        
        synthesisRef.current.speak(utterance);
        console.log('🌐 Browser TTS utterance queued');
      } else {
        // If no TTS available, just mark as finished speaking
        setIsSpeaking(false);
        console.log('❌ No TTS available, marking as finished speaking');
      }
    }
  }, [isAudioMuted, anonId]);

  const sendVoiceMessage = useCallback(async (transcript: string) => {
    if (!transcript.trim() || stateRef.current.loading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: transcript.trim(),
      timestamp: new Date(),
    };
    
    // Create the updated history for the API call
    const updatedHistory = [...messages, userMessage];

    // Optimistically update the UI
    setMessages(updatedHistory);
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
          conversationHistory: updatedHistory, // Send the complete history
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
      
      await speakText(data.aiResponse);
      
      setTimeout(() => {
        evaluateProgress();
      }, 500);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get response');
    } finally {
      setLoading(false);
    }
  }, [messages, scenario, anonId, evaluateProgress, speakText]);

  // Generate anonymous ID and set up speech recognition
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
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        const fullTranscript = finalTranscript || interimTranscript;
        if (fullTranscript.trim()) {
          setCurrentTranscript(fullTranscript.trim());
          setLastUserTranscript(fullTranscript.trim());
          
          if (stateRef.current.silenceTimer) {
            clearTimeout(stateRef.current.silenceTimer);
          }
          
          const timer = setTimeout(() => {
            setTranscriptToSend(fullTranscript.trim());
          }, 1500); // Changed to 1.5 seconds
          
          setSilenceTimer(timer);
        }
      };
      
      recognitionRef.current.onend = () => {
        const { currentTranscript, isSimulationActive, isSpeaking, loading } = stateRef.current;
        setIsListening(false);
        
        // If recognition ends and we have a transcript that hasn't been sent by timer, send it now.
        if (currentTranscript.trim() && !loading) {
          setTranscriptToSend(currentTranscript.trim());
        } else {
          // Otherwise, restart listening if appropriate
          if (isSimulationActive && !isSpeaking && !loading) {
            setTimeout(() => {
              startListening();
            }, 500);
          }
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        // Restart listening on error if simulation is still active
        if (stateRef.current.isSimulationActive && !stateRef.current.isSpeaking && !stateRef.current.loading) {
          setTimeout(() => {
            startListening();
          }, 1000);
        }
      };
      
      setSpeechEnabled(true);
    }
  }, [sendVoiceMessage]);

  // Auto-start listening after AI finishes speaking
  useEffect(() => {
    if (!isSpeaking && isSimulationActive && !loading && !showSummary && !isListening) {
      // Small delay to allow for natural conversation flow
      const timer = setTimeout(() => {
        startListening();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isSpeaking, isSimulationActive, loading, showSummary, isListening]);

  // Cleanup silence timer on unmount
  useEffect(() => {
    return () => {
      if (silenceTimer) {
        clearTimeout(silenceTimer);
      }
    };
  }, [silenceTimer]);

  // This useEffect now safely triggers the sending logic
  useEffect(() => {
    if (transcriptToSend) {
      if (stateRef.current.silenceTimer) {
        clearTimeout(stateRef.current.silenceTimer);
        setSilenceTimer(null);
      }
      if (stateRef.current.isListening) {
        setIsListening(false);
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      }
      sendVoiceMessage(transcriptToSend);
      setCurrentTranscript('');
      setTranscriptToSend('');
    }
  }, [transcriptToSend, sendVoiceMessage]);

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
      await speakText(data.aiResponse);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start simulation');
    } finally {
      setLoading(false);
    }
  };

  const endSimulation = async () => {
    if (messages.length === 0) return;

    setLoading(true);
    setIsListening(false);
    
    // Clear silence timer
    if (silenceTimer) {
      clearTimeout(silenceTimer);
      setSilenceTimer(null);
    }
    
    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'end',
          conversationHistory: messages,
          scenario,
          anonId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const summary: SimulationSummary = await response.json();
      setSimulationSummary(summary);
      setShowSummary(true);
      
      // Stop any ongoing audio
      stopSpeaking();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  const resetSimulation = () => {
    setMessages([]);
    setIsSimulationActive(false);
    setShowSummary(false);
    setSimulationSummary(null);
    setProgressEvaluation(null);
    setLastUserTranscript('');
    setCurrentTranscript('');
    setScenario('');
    setIsListening(false);
    
    // Clear silence timer
    if (silenceTimer) {
      clearTimeout(silenceTimer);
      setSilenceTimer(null);
    }
    
    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    stopSpeaking();
  };

  // Enhanced Floating Orb Component with Iridescent Bubble Design
  const FloatingOrb = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
        {/* Premium Floating Orb */}
        <div className="relative">
          {/* Main Orb Container */}
          <div className="relative w-40 h-40 group">
            {/* Outer Glow Layers */}
            <div className="absolute inset-0 rounded-full opacity-60">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/40 via-purple-400/40 to-pink-400/40 blur-2xl scale-150 animate-pulse-slow"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-300/30 via-violet-400/30 to-rose-400/30 blur-3xl scale-125 animate-float-glow"></div>
            </div>
            
            {/* Main Orb Sphere - Iridescent Bubble */}
            <div className={`
              absolute inset-4 rounded-full overflow-hidden
              bg-gradient-to-br from-white/90 via-cyan-50/80 to-purple-50/70
              shadow-2xl border border-white/60
              transition-all duration-700 ease-out
              ${isSpeaking ? 'scale-110 shadow-purple-500/40' : ''}
              ${isListening ? 'scale-105 shadow-cyan-500/40 ring-2 ring-cyan-400/30' : ''}
              ${!isSpeaking && !isListening ? 'animate-float-gentle' : ''}
            `}>
              {/* Iridescent Surface Layers */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-200/60 via-transparent via-purple-200/60 via-transparent to-pink-200/60 opacity-70"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-bl from-transparent via-teal-100/40 via-transparent via-violet-100/40 to-transparent"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-100/30 via-transparent via-cyan-100/30 to-purple-100/30 opacity-80"></div>
              
              {/* Dynamic Flowing Colors */}
              <div className={`
                absolute inset-2 rounded-full
                bg-gradient-to-br from-cyan-200/50 via-purple-200/40 to-pink-200/50
                transition-all duration-500 ease-out
                ${isSpeaking ? 'animate-ripple-intense from-purple-300/70 via-pink-300/60 to-violet-300/70' : ''}
                ${isListening ? 'animate-ripple-gentle from-cyan-300/70 via-teal-300/50 to-blue-300/60' : ''}
                ${!isSpeaking && !isListening ? 'animate-shimmer' : ''}
              `}>
                {/* Inner Iridescent Shine */}
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/60 via-cyan-50/30 via-transparent to-purple-50/20 opacity-80"></div>
              </div>
              
              {/* Bubble-like Light Reflections */}
              <div className="absolute top-3 left-6 w-12 h-12 rounded-full bg-gradient-to-br from-white/80 via-cyan-100/60 to-transparent blur-sm animate-breathe"></div>
              <div className="absolute top-6 left-8 w-6 h-6 rounded-full bg-white/90 blur-xs opacity-70"></div>
              <div className="absolute bottom-8 right-6 w-4 h-8 rounded-full bg-gradient-to-t from-purple-100/50 to-pink-100/30 blur-sm opacity-60"></div>
              
              {/* Soap Bubble Edge Highlights */}
              <div className="absolute inset-0 rounded-full border-2 border-gradient-to-r from-cyan-200/40 via-purple-200/30 to-pink-200/40"></div>
            </div>
            
            {/* Status Indicator - Subtle and Elegant */}
            <div className="absolute inset-0 flex items-center justify-center">
              {isSpeaking && (
                <div className="text-purple-600/70 transition-all duration-300">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse-dot"></div>
                </div>
              )}
              {isListening && (
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse-dot"></div>
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse-dot animation-delay-200"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse-dot animation-delay-400"></div>
                </div>
              )}
              {loading && (
                <div className="w-3 h-3 border border-purple-400/40 border-t-pink-500 rounded-full animate-spin"></div>
              )}
            </div>
            
            {/* Interactive Ripple Effects */}
            {(isSpeaking || isListening) && (
              <>
                <div className={`
                  absolute inset-0 rounded-full border-2 border-white/30
                  ${isSpeaking ? 'animate-ripple-expand-violet' : 'animate-ripple-expand-blue'}
                `}></div>
                <div className={`
                  absolute inset-0 rounded-full border border-white/20
                  ${isSpeaking ? 'animate-ripple-expand-violet animation-delay-300' : 'animate-ripple-expand-blue animation-delay-300'}
                `}></div>
              </>
            )}
          </div>
        </div>

        {/* Live transcript with premium styling */}
        {(lastUserTranscript || currentTranscript) && (
          <div className="max-w-md text-center">
            <p className="text-sm text-slate-500/80 mb-3 font-medium">
              {isListening && currentTranscript ? "Listening..." : "You said"}
            </p>
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 transition-all duration-300 hover:shadow-2xl">
              <p className="text-slate-700 italic leading-relaxed">
                "{currentTranscript || lastUserTranscript}"
              </p>
            </div>
          </div>
        )}

        {/* Status text with premium typography */}
        <div className="text-center max-w-md">
          {isSpeaking && (
            <p className="text-slate-600 font-medium">Kairoo is speaking...</p>
          )}
          {isListening && (
            <p className="text-cyan-600 font-semibold">Listening attentively...</p>
          )}
          {!isSpeaking && !isListening && !loading && isSimulationActive && (
            <p className="text-slate-500">Ready when you are</p>
          )}
          {loading && (
            <p className="text-slate-600 font-medium">Processing thoughtfully...</p>
          )}
        </div>
      </div>
    );
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
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">Kairoo LIVE</h1>
                <p className="text-neutral-600">
                  Practice real-life conversations in a safe, supportive environment.
                </p>
              </div>
              {isSimulationActive && (
                <button
                  onClick={endSimulation}
                  disabled={loading}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-smooth disabled:opacity-50 self-center"
                >
                  End Simulation
                </button>
              )}
            </div>

            {!isSimulationActive && !showSummary ? (
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
            ) : showSummary && simulationSummary ? (
              /* Simulation Summary */
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-success-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-4">Great Practice Session!</h2>
                    <p className="text-neutral-600">
                      Here's how your conversation went and what to focus on next time.
                    </p>
                  </div>

            <div className="space-y-6">
                  {/* Smoothness Score */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-neutral-900">Conversation Smoothness</h3>
                      <span className="text-2xl font-bold text-purple-600">{simulationSummary.smoothnessScore}%</span>
                </div>
                    <div className="w-full bg-white/50 rounded-full h-3">
                  <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${simulationSummary.smoothnessScore}%` }}
                  />
                </div>
              </div>

                  {/* What Went Well */}
                  <div className="bg-success-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-success-900 mb-3 flex items-center">
                      <span className="w-6 h-6 bg-success-200 rounded-full flex items-center justify-center mr-3 text-sm">✨</span>
                      What Went Well
                  </h3>
                    <p className="text-success-800 leading-relaxed">{simulationSummary.whatWentWell}</p>
                </div>

                  {/* Areas to Improve */}
                  {simulationSummary.improvementAreas.length > 0 && (
                    <div className="bg-blue-50 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                        <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 text-sm">🎯</span>
                        Focus Areas for Next Time
                      </h3>
                      <ul className="space-y-2">
                        {simulationSummary.improvementAreas.map((area, index) => (
                          <li key={index} className="text-blue-800 flex items-start">
                            <span className="text-blue-400 mr-2 mt-1">•</span>
                            <span>{area}</span>
                          </li>
                        ))}
                      </ul>
                  </div>
                )}

                  {/* Encouraging Message */}
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 text-center">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-3">Keep Going! 🌟</h3>
                    <p className="text-neutral-700 leading-relaxed italic">{simulationSummary.encouragingMessage}</p>
                </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                        <button
                      onClick={resetSimulation}
                      className="flex-1 button-secondary py-3"
                        >
                      Practice Another Scenario
                        </button>
                    <button
                      onClick={() => setActiveNav('Dashboard')}
                      className="flex-1 button-primary py-3"
                    >
                      Back to Dashboard
                    </button>
                  </div>
                </div>
                    </div>
                  </div>
                ) : (
            /* Active Simulation with Floating Orb */
            <div className="space-y-6">
              {/* Top Controls */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {/* Audio Mute Toggle */}
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
                      
                    </div>

              {/* XP Progress Bar */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-neutral-900">XP Progress</h3>
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

              {/* Main Floating Orb Interface */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm">
                <FloatingOrb />
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
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Settings</h1>
              <p className="text-neutral-600">
                Customize your Kairoo experience and preferences.
              </p>
            </div>

            {/* Settings Content */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-4">Coming Soon</h2>
                    <p className="text-neutral-600 mb-8">
                      We're building this section with care to give you the best experience.
                    </p>
                  </div>

                  <div className="bg-primary-50 rounded-xl p-6 text-left">
                    <h3 className="font-semibold text-primary-900 mb-4">Planned Features</h3>
                    <ul className="space-y-3 text-primary-700">
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Customizable analysis preferences
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Response style personalization
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Accessibility options
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Privacy controls
                      </li>
                    </ul>
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
                    Context (Required)
                  </label>
                  <input
                    type="text"
                    id="context"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    className="input-field"
                    placeholder="Add context (required)"
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

// Export App wrapped with ErrorBoundary
export default function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
} 