import { useState, useRef, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import NewOrb from '../components/NewOrb';
import { useRouter } from 'next/router';
import Sidebar from '../components/Sidebar';
import Dashboard from './dashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

// Moved FloatingOrb outside of App to prevent re-creation on re-renders
const FloatingOrb = React.memo(({ isSpeaking, isListening, loading, lastUserTranscript, currentTranscript }: {
  isSpeaking: boolean;
  isListening: boolean;
  loading: boolean;
  lastUserTranscript: string;
  currentTranscript: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      {/* Advanced Futuristic Orb */}
      <div className="w-64 h-64">
        <NewOrb />
      </div>

      {/* Live transcript with premium styling */}
      {(lastUserTranscript || currentTranscript) && (
        <div className="max-w-md text-center">
          <p className="text-sm text-slate-500/80 mb-3 font-medium">
            {isListening && currentTranscript ? "Listening..." : ""}
          </p>
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 transition-all duration-300 hover:shadow-2xl">
            <p className="text-slate-700 italic leading-relaxed">
              &ldquo;{currentTranscript || lastUserTranscript}&rdquo;
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
        {!isSpeaking && !isListening && !loading && (
          <p className="text-slate-500">Ready when you are</p>
        )}
        {loading && (
          <p className="text-slate-600 font-medium">Processing thoughtfully...</p>
        )}
      </div>
    </div>
  );
});
FloatingOrb.displayName = 'FloatingOrb';

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

// Add new interfaces for enhanced features
interface DifficultyLevel {
  id: 'easy' | 'medium' | 'hard';
  label: string;
  description: string;
  icon: string;
}

interface FeelingState {
  id: 'confident' | 'okay' | 'anxious' | 'rough';
  label: string;
  description: string;
  icon: string;
}

interface RealTimeHint {
  id: string;
  message: string;
  type: 'suggestion' | 'encouragement' | 'tip';
  timestamp: Date;
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
  const toggleSidebar = () => setSidebarCollapsed((c) => !c);

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
  const [simulationStartAt, setSimulationStartAt] = useState<Date | null>(null);
  
  // Enhanced pre-conversation setup state
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel['id']>('medium');
  const [selectedFeeling, setSelectedFeeling] = useState<FeelingState['id']>('okay');
  const [whoStartsFirst, setWhoStartsFirst] = useState<'ai' | 'user'>('ai');
  
  // Multi-step setup for Practice Scenarios
  const [practiceStep, setPracticeStep] = useState(0);
  const practiceSteps = ['scenario', 'difficulty', 'feeling', 'starter', 'hints'];
  
  // Real-time hints state
  const [hintsEnabled, setHintsEnabled] = useState(true);
  const [currentHint, setCurrentHint] = useState<RealTimeHint | null>(null);
  const [recentHints, setRecentHints] = useState<RealTimeHint[]>([]);
  const [lastHintCheck, setLastHintCheck] = useState<Date | null>(null);
  const [showHintPopup, setShowHintPopup] = useState(false);
  const [isGeneratingHint, setIsGeneratingHint] = useState(false);
  
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
  const recognitionRunningRef = useRef<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (router.query.view === 'practice') {
      setActiveNav('Practice Scenarios');
    }
  }, [router.query]);

  // Check if user needs onboarding
  useEffect(() => {
    const checkOnboarding = () => {
      const hasCompletedOnboarding = localStorage.getItem('onboardingCompleted');
      const userProfile = localStorage.getItem('userProfile');
      
      // Redirect to onboarding if not completed, unless they're already there
      if (!hasCompletedOnboarding && !router.pathname.includes('onboarding')) {
        router.push('/onboarding');
      }
    };

    // Only check on client side and after router is ready
    if (typeof window !== 'undefined' && router.isReady) {
      checkOnboarding();
    }
  }, [router.isReady, router.pathname]);

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

  // Define difficulty levels and feeling states
  const difficultyLevels: DifficultyLevel[] = [
    {
      id: 'easy',
      label: 'Easy',
      description: 'Patient, understanding conversation partner',
      icon: '😌'
    },
    {
      id: 'medium',
      label: 'Medium',
      description: 'Normal social interaction with typical responses',
      icon: '😊'
    },
    {
      id: 'hard',
      label: 'Hard',
      description: 'Less patient person, more challenging social dynamics',
      icon: '😅'
    }
  ];

  const feelingStates: FeelingState[] = [
    {
      id: 'confident',
      label: 'Confident and energized',
      description: 'Feeling great and ready to tackle conversations',
      icon: '💪'
    },
    {
      id: 'okay',
      label: 'Feeling okay, normal energy',
      description: 'In a typical mood, ready for practice',
      icon: '🙂'
    },
    {
      id: 'anxious',
      label: 'A bit anxious or tired',
      description: 'Could use some gentle encouragement',
      icon: '😰'
    },
    {
      id: 'rough',
      label: 'Having a rough day, need extra support',
      description: 'Need extra patience and understanding',
      icon: '😔'
    }
  ];

  // Function to check for real-time hints
  const getHint = useCallback(async () => {
    if (!isSimulationActive || messages.length < 1) return;

    setIsGeneratingHint(true);
    setCurrentHint(null);

    try {
      const response = await fetch('/api/real-time-hints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationHistory: messages,
          scenario,
          difficulty: selectedDifficulty,
          feeling: selectedFeeling,
          timeSinceLastMessage: new Date().getTime() - (messages[messages.length - 1]?.timestamp.getTime() || 0),
          anonId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.hint) {
          const newHint: RealTimeHint = {
            id: crypto.randomUUID(),
            message: data.hint.message,
            type: data.hint.type,
            timestamp: new Date(),
          };
          setCurrentHint(newHint);
          setShowHintPopup(true);
        } else {
          // If no hint is returned, show a generic message
          setCurrentHint({
            id: crypto.randomUUID(),
            message: "Keep up the great work! You&apos;re doing just fine.",
            type: 'encouragement',
            timestamp: new Date(),
          });
          setShowHintPopup(true);
        }
      }
    } catch (error) {
      console.error('Error checking for hints:', error);
    } finally {
      setIsGeneratingHint(false);
    }
  }, [isSimulationActive, messages, scenario, selectedDifficulty, selectedFeeling, anonId]);

  // This effect is no longer needed as hints are on-demand
  // useEffect(() => {
  // ...
  // }, [isSimulationActive, hintsEnabled, isSpeaking, loading, checkForHints]);

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
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-neutral-800">{label}</h4>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-neutral-600">
          <div className="flex items-center gap-2">
            <span className="text-base">{leftEmoji}</span>
            <span className="font-medium">{leftLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{rightLabel}</span>
            <span className="text-base">{rightEmoji}</span>
          </div>
        </div>
        <div className="relative">
          <div className="w-full bg-neutral-200 rounded-full h-3 shadow-inner">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ease-out ${
                hasResults 
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 shadow-glow-purple' 
                  : 'bg-neutral-400'
              }`}
              style={{ width: `${value}%` }}
            ></div>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-sm font-bold ${
            hasResults ? 'text-purple-700' : 'text-neutral-500'
          }`}>
            {value}%
          </span>
        </div>
      </div>
    </div>
  );

  const startListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition || !speechEnabled) return;

    // Only start if not already running and not currently speaking/loading
    if (!recognitionRunningRef.current && !stateRef.current.isSpeaking && !stateRef.current.loading) {
      try {
        recognition.start();
        recognitionRunningRef.current = true;
        setIsListening(true);
      } catch (err) {
        // Ignore InvalidStateError which means recognition is already started
        if (err instanceof DOMException && err.name === 'InvalidStateError') {
          console.warn('SpeechRecognition already running, skip start()');
        } else {
          console.error('SpeechRecognition start error:', err);
        }
      }
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
        // Fallback to browser TTS immediately without throwing an error
        if (synthesisRef.current) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.85;
          utterance.pitch = 0.9;
          utterance.volume = 0.7;

          utterance.onstart = () => {
            setIsSpeaking(true);
          };
          utterance.onend = () => {
            setIsSpeaking(false);
          };
          synthesisRef.current.speak(utterance);
        }
        return;
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
          difficulty: selectedDifficulty,
          feeling: selectedFeeling,
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
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      if (recognitionRef.current) {
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

          // Clear any existing silence timer
          if (stateRef.current.silenceTimer) {
            clearTimeout(stateRef.current.silenceTimer);
          }

          // Always wait 2 seconds after last speech input before sending
          const timer = setTimeout(() => {
            setTranscriptToSend(fullTranscript.trim());
          }, 2000); // Always 2 seconds

          setSilenceTimer(timer);
        }
      };
      
      recognitionRef.current.onstart = () => {
        recognitionRunningRef.current = true;
        setIsListening(true);
      };
      
      recognitionRef.current.onend = () => {
        recognitionRunningRef.current = false;
        setIsListening(false);
        
        // Restart listening if appropriate (don't send immediately on recognition end)
        if (isSimulationActive && !isSpeaking && !loading) {
          setTimeout(() => {
            startListening();
          }, 500);
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        recognitionRunningRef.current = false;
        setIsListening(false);
        // Restart listening on error if simulation is still active
        if (stateRef.current.isSimulationActive && !stateRef.current.isSpeaking && !stateRef.current.loading) {
          setTimeout(() => {
            startListening();
          }, 1000);
        }
      };
      }
      
      setSpeechEnabled(true);
    }
  }, [sendVoiceMessage]);

  // Auto-start listening after AI finishes speaking
  useEffect(() => {
    if (!isSpeaking && isSimulationActive && !loading && !showSummary && !isListening) {
      // Faster restart for more responsive conversation
      const timer = setTimeout(() => {
        startListening();
      }, 300);
      
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
          difficulty: selectedDifficulty,
          feeling: selectedFeeling,
          whoStartsFirst,
          anonId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start simulation');
      }

      const data: SimulationResponse = await response.json();
      
      setSceneDescription(data.sceneDescription || '');
      setIsSimulationActive(true);
      setSimulationStartAt(new Date());
      setCurrentHint(null); // Clear any existing hints
      setRecentHints([]);
      setLastHintCheck(null);
      
      if (whoStartsFirst === 'ai') {
        // AI starts first - add AI message and speak it
        setMessages([{
          id: crypto.randomUUID(),
          role: 'ai',
          content: data.aiResponse,
          timestamp: new Date(),
        }]);
        
        // Speak the first AI message
        await speakText(data.aiResponse);
      } else {
        // User starts first - just initialize empty messages and start listening
        setMessages([]);
        
        // Start listening immediately for the user's first message
        if (speechEnabled) {
          setTimeout(() => {
            startListening();
          }, 500);
        }
      }
      
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
          difficulty: selectedDifficulty,
          feeling: selectedFeeling,
          anonId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const summary: SimulationSummary = await response.json();
      setSimulationSummary(summary);
      setShowSummary(true);

      // Persist session for dashboard
      try {
        const startedAtISO = simulationStartAt ? simulationStartAt.toISOString() : undefined;
        await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            anonId,
            scenario,
            smoothnessScore: summary.smoothnessScore,
            whatWentWell: summary.whatWentWell,
            improvementAreas: summary.improvementAreas,
            durationMinutes: undefined, // let API derive from timestamps if present
            startedAt: startedAtISO,
            endedAt: new Date().toISOString(),
            difficulty: selectedDifficulty,
            feeling: selectedFeeling,
          }),
        });
      } catch (persistErr) {
        console.warn('Failed to persist session:', persistErr);
      }

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
    setSimulationStartAt(null);
    setIsListening(false);
    
    // Reset enhanced setup
    setSelectedDifficulty('medium');
    setSelectedFeeling('okay');
    setPracticeStep(0);
    
    // Reset hints
    setCurrentHint(null);
    setRecentHints([]);
    setLastHintCheck(null);
    setShowHintPopup(false);
    
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

  // Check if this is their first time after onboarding
  const isFirstTime = router.query.first_time === 'true';
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(isFirstTime);

  // Get user profile for personalized welcome
  const [userProfile, setUserProfile] = useState<any>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('userProfile');
      if (stored) {
        setUserProfile(JSON.parse(stored));
      }
    }
  }, []);

  // Render Practice Scenarios page
  if (activeNav === 'Practice Scenarios') {
    return (
      <div className="min-h-screen bg-neutral-50 flex overflow-hidden">
        <Sidebar 
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          isTransitioning={isTransitioning}
          setIsTransitioning={setIsTransitioning}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Welcome Banner for First-Time Users */}
          {showWelcomeBanner && userProfile && (
            <div className="bg-gradient-to-r from-purple-600 to-violet-600 text-white p-6 border-b border-purple-500">
              <div className="max-w-4xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2l2.09 6.26L20 9.27l-5 3.64L16.18 20 12 16.9 7.82 20 9 12.91l-5-3.64 5.91-.99L12 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Welcome to Kairoo, {userProfile.name}!</h2>
                    <p className="text-purple-100">
                      Your personalized practice space is ready. Let&apos;s start building your confidence!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowWelcomeBanner(false)}
                  className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-8">
            <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              {/* Header */}
              <div className="mb-8 flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-neutral-900 mb-2">Practice Scenarios</h1>
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
                /* Multi-Screen Practice Setup */
                <div className="min-h-[80vh] flex items-center justify-center p-8">
                  <div className="w-full max-w-4xl">
                    {/* Progress Indicator */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-semibold text-purple-600">
                          Step {practiceStep + 1} of {practiceSteps.length}
                        </span>
                        <span className="text-sm text-neutral-500">
                          {Math.round(((practiceStep + 1) / practiceSteps.length) * 100)}% complete
                        </span>
                      </div>
                      <div className="w-full bg-purple-100 rounded-full h-2">
                        <motion.div 
                          className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 h-2 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: `${((practiceStep + 1) / practiceSteps.length) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>

                    {/* Screen Container */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={practiceStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="relative overflow-hidden"
                      >
                        {/* Background with purple texture gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-900 opacity-10 rounded-3xl" 
                             style={{
                               backgroundImage: `radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
                                                radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
                                                radial-gradient(circle at 40% 80%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)`
                             }}
                        ></div>
                        
                        <div className="relative bg-gradient-to-br from-purple-50 via-purple-100 to-indigo-50 rounded-3xl border-2 border-purple-200 shadow-2xl p-12 min-h-[500px] flex flex-col">
                          {/* Scenario Screen */}
                          {practiceStep === 0 && (
                            <div className="flex-1 flex flex-col items-center justify-center">
                              <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl flex items-center justify-center mb-8 shadow-lg">
                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                              </div>
                              <h2 className="text-4xl font-bold text-purple-900 mb-4 text-center">What situation would you like to practice?</h2>
                              <p className="text-purple-700 text-lg mb-8 text-center max-w-2xl">Describe a conversation scenario you want to practice</p>
                              <textarea
                                value={scenario}
                                onChange={(e) => setScenario(e.target.value)}
                                placeholder="e.g., Having lunch with a new classmate, Texting a friend who might be upset, Asking for help with homework..."
                                className="w-full max-w-2xl h-40 bg-white/80 backdrop-blur-sm border-2 border-purple-300 rounded-2xl p-6 text-lg focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200 resize-none"
                                disabled={loading}
                                autoFocus
                              />
                            </div>
                          )}

                          {/* Difficulty Screen */}
                          {practiceStep === 1 && (
                            <div className="flex-1 flex flex-col items-center justify-center">
                              <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl flex items-center justify-center mb-8 shadow-lg">
                                <span className="text-5xl">😌</span>
                              </div>
                              <h2 className="text-4xl font-bold text-purple-900 mb-4 text-center">Choose difficulty level</h2>
                              <p className="text-purple-700 text-lg mb-12 text-center">Pick the level that matches what you're ready for</p>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
                                {difficultyLevels.map((level) => (
                                  <button
                                    key={level.id}
                                    onClick={() => setSelectedDifficulty(level.id)}
                                    className={`p-6 rounded-2xl border-3 transition-all text-center transform hover:scale-105 ${
                                      selectedDifficulty === level.id
                                        ? 'border-purple-600 bg-white shadow-xl ring-4 ring-purple-200'
                                        : 'border-purple-200 bg-white/80 backdrop-blur-sm hover:border-purple-400 hover:shadow-lg'
                                    }`}
                                    disabled={loading}
                                  >
                                    <div className="text-5xl mb-3">{level.icon}</div>
                                    <div className="font-bold text-xl text-purple-900 mb-2">{level.label}</div>
                                    <p className="text-sm text-purple-700">{level.description}</p>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Feeling Screen */}
                          {practiceStep === 2 && (
                            <div className="flex-1 flex flex-col items-center justify-center">
                              <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl flex items-center justify-center mb-8 shadow-lg">
                                <span className="text-5xl">❤️</span>
                              </div>
                              <h2 className="text-4xl font-bold text-purple-900 mb-4 text-center">How are you feeling today?</h2>
                              <p className="text-purple-700 text-lg mb-12 text-center">This helps us tailor the conversation to your needs</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                                {feelingStates.map((feeling) => (
                                  <button
                                    key={feeling.id}
                                    onClick={() => setSelectedFeeling(feeling.id)}
                                    className={`p-6 rounded-2xl border-3 transition-all text-left transform hover:scale-105 ${
                                      selectedFeeling === feeling.id
                                        ? 'border-purple-600 bg-white shadow-xl ring-4 ring-purple-200'
                                        : 'border-purple-200 bg-white/80 backdrop-blur-sm hover:border-purple-400 hover:shadow-lg'
                                    }`}
                                    disabled={loading}
                                  >
                                    <div className="flex items-start space-x-4">
                                      <span className="text-5xl flex-shrink-0">{feeling.icon}</span>
                                      <div className="flex-1">
                                        <div className="font-bold text-xl text-purple-900 mb-2">{feeling.label}</div>
                                        <p className="text-sm text-purple-700">{feeling.description}</p>
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Who Starts Screen */}
                          {practiceStep === 3 && (
                            <div className="flex-1 flex flex-col items-center justify-center">
                              <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl flex items-center justify-center mb-8 shadow-lg">
                                <span className="text-5xl">🎬</span>
                              </div>
                              <h2 className="text-4xl font-bold text-purple-900 mb-4 text-center">Who should start the conversation?</h2>
                              <p className="text-purple-700 text-lg mb-12 text-center">Choose who begins the dialogue</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
                                <button
                                  onClick={() => setWhoStartsFirst('ai')}
                                  className={`p-8 rounded-2xl border-3 transition-all text-center transform hover:scale-105 ${
                                    whoStartsFirst === 'ai'
                                      ? 'border-purple-600 bg-white shadow-xl ring-4 ring-purple-200'
                                      : 'border-purple-200 bg-white/80 backdrop-blur-sm hover:border-purple-400 hover:shadow-lg'
                                  }`}
                                  disabled={loading}
                                >
                                  <div className="mb-4">
                                    <svg className="w-12 h-12 text-purple-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <rect x="3" y="4" width="18" height="12" rx="2" />
                                      <path d="M7 20h10" />
                                      <path d="M12 16v4" />
                                      <circle cx="9" cy="10" r="1" />
                                      <circle cx="15" cy="10" r="1" />
                                    </svg>
                                  </div>
                                  <div className="font-bold text-xl text-purple-900 mb-3">AI starts first</div>
                                  <p className="text-sm text-purple-700">The other person will begin the conversation</p>
                                </button>
                                <button
                                  onClick={() => setWhoStartsFirst('user')}
                                  className={`p-8 rounded-2xl border-3 transition-all text-center transform hover:scale-105 ${
                                    whoStartsFirst === 'user'
                                      ? 'border-purple-600 bg-white shadow-xl ring-4 ring-purple-200'
                                      : 'border-purple-200 bg-white/80 backdrop-blur-sm hover:border-purple-400 hover:shadow-lg'
                                  }`}
                                  disabled={loading}
                                >
                                  <div className="mb-4">
                                    <svg className="w-12 h-12 text-purple-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M20 21a8 8 0 1 0-16 0" />
                                      <circle cx="12" cy="7" r="4" />
                                    </svg>
                                  </div>
                                  <div className="font-bold text-xl text-purple-900 mb-3">I&apos;ll start first</div>
                                  <p className="text-sm text-purple-700">You will begin the conversation</p>
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Hints Screen */}
                          {practiceStep === 4 && (
                            <div className="flex-1 flex flex-col items-center justify-center">
                              <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl flex items-center justify-center mb-8 shadow-lg">
                                <span className="text-5xl">💡</span>
                              </div>
                              <h2 className="text-4xl font-bold text-purple-900 mb-4 text-center">Real-time Coaching Hints</h2>
                              <p className="text-purple-700 text-lg mb-12 text-center">Get gentle suggestions during your conversation</p>
                              <div className="w-full max-w-md">
                                <div className="bg-white rounded-3xl p-12 border-3 border-purple-200 shadow-xl">
                                  <div className="flex flex-col items-center">
                                    <div className="mb-6">
                                      {hintsEnabled ? (
                                        <svg className="w-12 h-12 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="M9 18h6" />
                                          <path d="M10 22h4" />
                                          <path d="M2 12a10 10 0 0 1 20 0c0 3.5-2 4.5-4 6H6c-2-1.5-4-2.5-4-6z" />
                                        </svg>
                                      ) : (
                                        <svg className="w-12 h-12 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="M9 18h6" />
                                          <path d="M10 22h4" />
                                          <path d="M2 12a10 10 0 0 1 20 0c0 3.5-2 4.5-4 6H6c-2-1.5-4-2.5-4-6z" />
                                          <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                      )}
                                    </div>
                                    <button
                                      onClick={() => setHintsEnabled(!hintsEnabled)}
                                      className={`relative inline-flex h-16 w-32 items-center rounded-full transition-colors ${
                                        hintsEnabled ? 'bg-gradient-to-r from-purple-600 to-purple-700' : 'bg-neutral-300'
                                      } shadow-inner`}
                                      disabled={loading}
                                    >
                                      <motion.span
                                        className="inline-block h-12 w-12 transform rounded-full bg-white shadow-lg"
                                        animate={{ x: hintsEnabled ? 80 : 8 }}
                                        transition={{ duration: 0.3 }}
                                      />
                                    </button>
                                    <p className="mt-6 text-lg font-semibold text-purple-900">
                                      {hintsEnabled ? 'Enabled' : 'Disabled'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                      <button
                        onClick={() => setPracticeStep(Math.max(0, practiceStep - 1))}
                        disabled={practiceStep === 0 || loading}
                        className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-purple-300 text-purple-700 font-semibold rounded-xl hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all disabled:hover:bg-white transform hover:scale-105"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        Back
                      </button>
                      
                      {practiceStep < practiceSteps.length - 1 ? (
                        <button
                          onClick={() => setPracticeStep(Math.min(practiceSteps.length - 1, practiceStep + 1))}
                          disabled={loading || (practiceStep === 0 && !scenario.trim())}
                          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          Next
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      ) : (
                        <button
                          onClick={startSimulation}
                          disabled={loading || !scenario.trim()}
                          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          {loading ? 'Starting...' : 'Begin Practice'}
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    {error && (
                      <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-xl p-4">
                        <p className="text-red-600 text-sm text-center">{error}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : showSummary && simulationSummary ? (
                /* Simulation Summary */
                <div className="max-w-3xl mx-auto py-8">
                  <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-neutral-900 mb-3">Practice Complete!</h2>
                    <p className="text-lg text-neutral-600">Here&apos;s your performance summary.</p>
                  </div>

                  {/* Stats Card */}
                  <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 mb-8">
                    <h3 className="text-lg font-semibold text-neutral-900 text-center mb-4">Conversation Smoothness</h3>
                    <div className="relative w-48 h-48 mx-auto">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path className="text-neutral-200"
                          d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3" />
                        <path className="text-primary-600"
                          strokeDasharray={`${simulationSummary.smoothnessScore}, 100`}
                          d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold text-primary-600">{simulationSummary.smoothnessScore}</span>
                        <span className="text-xl text-primary-500">%</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* What Went Well */}
                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                          <span className="text-xl">✅</span>
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-900">What Went Well</h3>
                      </div>
                      <p className="text-neutral-700 leading-relaxed">{simulationSummary.whatWentWell}</p>
                    </div>

                    {/* Areas to Improve */}
                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                          <span className="text-xl">🎯</span>
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-900">Focus Areas for Next Time</h3>
                      </div>
                      {simulationSummary.improvementAreas.length > 0 ? (
                        <ul className="space-y-3">
                          {simulationSummary.improvementAreas.map((area, index) => (
                            <li key={index} className="flex items-start text-neutral-700">
                              <span className="text-blue-500 mr-3 mt-1">&#8226;</span>
                              <span>{area}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-neutral-600 italic">No specific areas for improvement noted. Great job!</p>
                      )}
                    </div>
                  </div>

                  {/* Encouraging Message */}
                  <div className="bg-gradient-to-tr from-purple-50 to-blue-50 border border-purple-100 rounded-2xl p-8 text-center">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow">
                      <span className="text-2xl">🌟</span>
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-3">Keep Going!</h3>
                    <p className="text-neutral-700 leading-relaxed max-w-2xl mx-auto">{simulationSummary.encouragingMessage}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center gap-4 mt-12">
                    <button
                      onClick={resetSimulation}
                      className="button-secondary py-3 px-6"
                    >
                      Practice Another Scenario
                    </button>
                    <button
                      onClick={() => setActiveNav('Dashboard')}
                      className="button-primary py-3 px-6"
                    >
                      Back to Dashboard
                    </button>
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
                    {isAudioMuted ? (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 9v6h4l5 5V4l-5 5H9z" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 9v6h4l5 5V4l-5 5H9z" />
                      </svg>
                    )}
                  </button>

                  {/* Hints Toggle */}
                  <button
                    onClick={() => setHintsEnabled(!hintsEnabled)}
                    className={`p-2 rounded-lg transition-smooth ${
                      hintsEnabled 
                        ? 'text-primary-600 bg-primary-50 hover:bg-primary-100' 
                        : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                    title={hintsEnabled ? "Disable coaching hints" : "Enable coaching hints"}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18h6" />
                      <path d="M10 22h4" />
                      <path d="M2 12a10 10 0 0 1 20 0c0 3.5-2 4.5-4 6H6c-2-1.5-4-2.5-4-6z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Scene Description */}
              {sceneDescription && (
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                  <h3 className="font-semibold text-neutral-900 mb-3 flex items-center">
                    <span className="w-6 h-6 bg-secondary-100 rounded-lg flex items-center justify-center mr-2 text-sm">
                      <svg className="w-3.5 h-3.5 text-secondary-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 6-9 12-9 12S3 16 3 10a9 9 0 1 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </span>
                    Scene Setting
                  </h3>
                  <p className="text-neutral-600 italic">{sceneDescription}</p>
                  </div>
                )}

              {/* Main Floating Orb Interface */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm">
                <FloatingOrb
                  isSpeaking={isSpeaking}
                  isListening={isListening}
                  loading={loading}
                  lastUserTranscript={lastUserTranscript}
                  currentTranscript={currentTranscript}
                />
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

        {/* Floating Hint Button - Bottom of page */}
        {isSimulationActive && !showSummary && (
          <div className="p-4 bg-white border-t border-neutral-200 flex justify-center">
            <button
              onClick={getHint}
              disabled={isGeneratingHint}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isGeneratingHint ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span className="text-xl">💡</span>
                  <span>Get a Hint</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Hint Popup */}
        {showHintPopup && currentHint && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowHintPopup(false)}
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl text-purple-600">
                    {currentHint.type === 'suggestion' ? '💡' : 
                      currentHint.type === 'encouragement' ? '🌟' : '💭'}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-neutral-900 mb-2">Conversation Insight</h3>
                  <p className="text-neutral-700 leading-relaxed">{currentHint.message}</p>
                </div>
                <button
                  onClick={() => setShowHintPopup(false)}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                  title="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    );
  }

  // Render Settings page
  if (activeNav === 'Settings') {
    return (
      <div className="min-h-screen bg-neutral-50 flex">
        <Sidebar 
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          isTransitioning={isTransitioning}
          setIsTransitioning={setIsTransitioning}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
        <div className="flex-1">
        
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
                      We&apos;re building this section with care to give you the best experience.
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
      </div>
    );
  }

  // Render Dashboard page
  if (activeNav === 'Dashboard') {
    return (
      <div className="min-h-screen bg-neutral-50 flex">
        <Sidebar 
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          isTransitioning={isTransitioning}
          setIsTransitioning={setIsTransitioning}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
        <div className="flex-1">
          <div className="w-full overflow-hidden">
            <div
              style={{
                transform: 'scale(0.92)',
                transformOrigin: 'top left',
                width: '100%'
              }}
              className="transition-transform duration-300 ease-out"
            >
              <Dashboard />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Analysis page (renamed from Dashboard)
  if (activeNav === 'Analysis') {
    return (
      <div className="min-h-screen flex" style={{
        background: 'linear-gradient(135deg, #f6f6ff 0%, #eef0ff 40%, #e9e6ff 100%)'
      }}>
        <Sidebar 
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          isTransitioning={isTransitioning}
          setIsTransitioning={setIsTransitioning}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
        <div className="flex-1">
        
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            {/* Playful Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 text-center"
            >
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-12"
                       style={{ background: 'linear-gradient(135deg, #7b61ff 0%, #5b3bff 100%)' }}>
                    <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.3-4.3" />
                    </svg>
                  </div>
                </div>
              </div>
              <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(90deg, #7b61ff 0%, #5b3bff 50%, #3e2ee6 100%)' }}>
                Message Analysis
              </h1>
              <p className="text-xl max-w-2xl mx-auto" style={{ color: '#5b3bff' }}>
                Understand tone, spot manipulation, and get personalized response suggestions
              </p>
            </motion.div>

        {/* Enhanced Input Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="relative overflow-hidden rounded-3xl border-2 border-purple-200 shadow-2xl" style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(250,245,255,0.9) 100%)',
            backdropFilter: 'blur(10px)'
          }}>
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 opacity-10"
                 style={{
                   background: 'radial-gradient(circle at 30% 30%, rgba(168, 85, 247, 0.5) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(236, 72, 153, 0.5) 0%, transparent 50%)'
                 }}
            ></div>
            
            <div className="relative p-8">
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Message Input */}
                  <div className="space-y-4">
                    <label htmlFor="message" className="flex items-center gap-2 text-lg font-bold" style={{ color: '#522fff' }}>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z" />
                      </svg>
                      What happened?
                    </label>
                    <input
                      type="text"
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 bg-white/80 border-2 rounded-2xl focus:outline-none transition-all"
                      style={{ borderColor: '#d8ccff', boxShadow: '0 0 0 0 rgba(0,0,0,0)' }}
                      placeholder="Paste the message you received or describe what happened…"
                      disabled={loading}
                    />
                  </div>

                  {/* Context Input */}
                  <div className="space-y-4">
                    <label htmlFor="context" className="flex items-center gap-2 text-lg font-bold" style={{ color: '#522fff' }}>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                      </svg>
                      Context
                    </label>
                    <textarea
                      id="context"
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      className="w-full px-4 py-3 bg-white/80 border-2 rounded-2xl focus:outline-none resize-none transition-all h-40"
                      style={{ borderColor: '#d8ccff' }}
                      placeholder="Add context (optional)"
                      disabled={loading}
                    />
                    
                    {/* Enhanced Analyze Button */}
                    <button
                      onClick={handleAnalyze}
                      disabled={!message.trim() || loading}
                      className="w-full py-4 px-6 text-white font-bold text-lg rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 hover:shadow-2xl disabled:hover:scale-100 relative overflow-hidden group"
                      style={{ backgroundImage: 'linear-gradient(90deg, #7b61ff 0%, #6c48ff 50%, #5b3bff 100%)' }}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9 19c-2 2-6 2-6 2s0-4 2-6l8-8a5.657 5.657 0 018 8l-8 8z" />
                              <path d="M14 7l3 3" />
                            </svg>
                            Analyze Message
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundImage: 'linear-gradient(90deg, #8a75ff 0%, #745cff 50%, #624dff 100%)' }}></div>
                    </button>
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl"
                  >
                    <p className="text-red-600 text-sm flex items-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12" y2="17" />
                      </svg>
                      {error}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Results Section */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold" style={{ color: '#3e2ee6' }}>
                {hasResults ? 'Analysis Results' : 'Analysis Preview'}
              </h2>
            </div>
            {!hasResults && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: '#efeaff', color: '#5b3bff' }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4" />
                  <path d="M12 18v4" />
                  <path d="M4.93 4.93l2.83 2.83" />
                  <path d="M16.24 16.24l2.83 2.83" />
                  <path d="M2 12h4" />
                  <path d="M18 12h4" />
                  <path d="M4.93 19.07l2.83-2.83" />
                  <path d="M16.24 7.76l2.83-2.83" />
                </svg>
                Preview
              </div>
            )}
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tone Analysis Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative overflow-hidden rounded-3xl border-2 border-purple-200 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(245,243,255,0.95) 100%)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-200 to-transparent opacity-50 rounded-full blur-2xl"></div>
              <div className="relative p-6">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mr-3 shadow-lg" style={{ background: 'linear-gradient(135deg, #7b61ff 0%, #6c48ff 100%)' }}>
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 3v18h18" />
                      <path d="M7 15l4-4 3 3 5-5" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: '#3e2ee6' }}>Tone Analysis</h3>
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
            </motion.div>

            {/* Suggested Replies Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="relative overflow-hidden rounded-3xl border-2 border-purple-200 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(250,245,255,0.95) 100%)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-200 to-transparent opacity-50 rounded-full blur-2xl"></div>
              <div className="relative p-6">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mr-3 shadow-lg" style={{ background: 'linear-gradient(135deg, #7b61ff 0%, #6c48ff 100%)' }}>
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: '#3e2ee6' }}>Suggested Replies</h3>
                </div>
              
                <div className="space-y-4">
                  {displayResults.responses.map((reply, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className={`rounded-2xl p-5 border-2 transition-all ${
                        hasResults 
                          ? 'border-purple-200 bg-white/60 backdrop-blur-sm hover:border-purple-300 hover:shadow-lg' 
                          : 'border-purple-100 bg-purple-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-sm font-bold px-4 py-2 rounded-full ${
                          hasResults 
                            ? 'text-white bg-gradient-to-r from-purple-600 to-pink-600' 
                            : 'text-neutral-500 bg-neutral-100'
                        }`}>
                          {reply.tone}
                        </span>
                        <button
                          onClick={() => copyToClipboard(reply.text)}
                          className={`transition-all p-2 rounded-xl ${
                            hasResults 
                              ? 'text-purple-600 hover:text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600' 
                              : 'text-neutral-300 cursor-not-allowed'
                          }`}
                          title={hasResults ? "Copy to clipboard" : "Analyze message first"}
                          disabled={!hasResults}
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        </button>
                      </div>
                      <p className={`text-sm leading-relaxed ${
                        hasResults ? 'text-neutral-700' : 'text-neutral-500 italic'
                      }`}>
                        {reply.text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Guidance Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="relative overflow-hidden rounded-3xl border-2 border-purple-200 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(245,243,255,0.95) 100%)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-200 to-transparent opacity-50 rounded-full blur-2xl"></div>
              <div className="relative p-6">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mr-3 shadow-lg" style={{ background: 'linear-gradient(135deg, #7b61ff 0%, #6c48ff 100%)' }}>
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18h6" />
                      <path d="M10 22h4" />
                      <path d="M2 12a10 10 0 0 1 20 0c0 3.5-2 4.5-4 6H6c-2-1.5-4-2.5-4-6z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: '#3e2ee6' }}>Guidance</h3>
                </div>
              
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-100">
                  <p className={`text-sm leading-relaxed ${
                    hasResults ? 'text-neutral-700' : 'text-neutral-500 italic'
                  }`}>
                    {displayResults.advice}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
          </div>
          </div>
        </main>
        </div>
      </div>
    );
  }

  // Default fallback - redirect to Dashboard
  return <Dashboard />;
}

// Export App wrapped with ErrorBoundary
export default function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
} 