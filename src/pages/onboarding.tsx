import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Target, 
  Sparkles,
  CheckCircle,
  Brain,
  Heart,
  MessageCircle
} from 'lucide-react';

interface UserProfile {
  // Basic info
  name: string;
  
  // Goals
  primaryGoal: 'build_confidence' | 'improve_relationships' | 'work_communication' | 'social_situations' | 'other';
  practiceAreas: string[];
  
  // Communication preference
  feedbackStyle: 'gentle' | 'direct' | 'encouraging';
}

type OnboardingStep = 'welcome' | 'basic_info' | 'goals' | 'complete';

const steps: OnboardingStep[] = ['welcome', 'basic_info', 'goals', 'complete'];

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

export default function Onboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    practiceAreas: []
  });

  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const nextStep = async () => {
    setIsTransitioning(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
    
    setIsTransitioning(false);
  };

  const prevStep = async () => {
    setIsTransitioning(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
    
    setIsTransitioning(false);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const skipOnboarding = () => {
    // Set minimal defaults and go to app
    localStorage.setItem('onboardingCompleted', 'true');
    router.push('/app?view=practice');
  };

  const completeOnboarding = async () => {
    try {
      // Save profile to localStorage and API
      const anonId = localStorage.getItem('anonId') || crypto.randomUUID();
      localStorage.setItem('anonId', anonId);
      localStorage.setItem('userProfile', JSON.stringify(profile));
      localStorage.setItem('onboardingCompleted', 'true');

      // Save to API (optional, fail silently)
      try {
        await fetch('/api/save-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            anonId,
            profile,
            timestamp: new Date().toISOString()
          }),
        });
      } catch (error) {
        console.log('Profile save failed, continuing anyway');
      }

      // Navigate to app
      router.push('/app?view=practice&first_time=true');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      router.push('/app?view=practice&first_time=true');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeStep onNext={nextStep} onSkip={skipOnboarding} />;
      case 'basic_info':
        return (
          <BasicInfoStep 
            profile={profile}
            updateProfile={updateProfile}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 'goals':
        return (
          <GoalsStep 
            profile={profile}
            updateProfile={updateProfile}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 'complete':
        return <CompleteStep onComplete={completeOnboarding} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>Welcome to Kairoo - Let's Get Started</title>
        <meta name="description" content="Welcome to Kairoo - Let's personalize your experience" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-purple-50">
        {/* Progress Bar */}
        {currentStep !== 'welcome' && currentStep !== 'complete' && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-neutral-200">
            <div className="max-w-4xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-600">
                  Step {currentStepIndex} of {steps.length - 2}
                </span>
                <span className="text-sm font-medium text-neutral-600">
                  {Math.round(progress)}% complete
                </span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-purple-600 to-violet-600 h-2 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={`flex items-center justify-center min-h-screen ${
          currentStep !== 'welcome' && currentStep !== 'complete' ? 'pt-24' : ''
        }`}>
          <div className="w-full max-w-4xl mx-auto px-6 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`${isTransitioning ? 'pointer-events-none' : ''}`}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Skip Onboarding Button - Fixed at bottom */}
        {currentStep !== 'complete' && (
          <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-neutral-200 p-6">
            <div className="max-w-4xl mx-auto flex justify-center">
              <button
                onClick={skipOnboarding}
                className="group bg-gradient-to-r from-neutral-600 to-neutral-700 hover:from-neutral-700 hover:to-neutral-800 text-white font-medium px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
              >
                <span>Skip onboarding</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Welcome Step Component
const WelcomeStep = ({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) => (
  <motion.div variants={itemVariants} className="text-center space-y-8">
    <div className="space-y-6">
      <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-violet-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
        <Sparkles className="w-10 h-10 text-white" />
      </div>
      
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight">
          Welcome to Kairoo
        </h1>
        <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          Let's quickly personalize your experience so we can provide the most helpful support for your communication goals.
        </p>
      </div>
    </div>

    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
          <Brain className="w-8 h-8 text-purple-600 mb-4 mx-auto" />
          <h3 className="font-semibold text-neutral-900 mb-2">Personalized</h3>
          <p className="text-sm text-neutral-600">Tailored to your goals and style</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
          <Heart className="w-8 h-8 text-purple-600 mb-4 mx-auto" />
          <h3 className="font-semibold text-neutral-900 mb-2">Supportive</h3>
          <p className="text-sm text-neutral-600">A safe, judgment-free space</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
          <Target className="w-8 h-8 text-purple-600 mb-4 mx-auto" />
          <h3 className="font-semibold text-neutral-900 mb-2">Effective</h3>
          <p className="text-sm text-neutral-600">Real practice for real conversations</p>
        </div>
      </div>
      
      <div className="pt-4">
        <button
          onClick={onNext}
          className="group bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto"
        >
          Let's get started
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
      
      <p className="text-sm text-neutral-500">
        This will take about 2 minutes. You can skip anytime.
      </p>
    </div>
  </motion.div>
);

// Basic Info Step Component  
const BasicInfoStep = ({ 
  profile, 
  updateProfile, 
  onNext, 
  onPrev 
}: { 
  profile: Partial<UserProfile>; 
  updateProfile: (updates: Partial<UserProfile>) => void;
  onNext: () => void;
  onPrev: () => void;
}) => {
  const canContinue = profile.name?.trim();

  return (
    <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <User className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-neutral-900 mb-4">What should we call you?</h2>
        <p className="text-neutral-600">
          Just your first name or what you'd like to be called during practice.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
        <input
          type="text"
          value={profile.name || ''}
          onChange={(e) => updateProfile({ name: e.target.value })}
          className="w-full px-4 py-4 text-lg border border-neutral-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-center"
          placeholder="Your name"
          autoFocus
        />
      </div>

      <div className="flex justify-between pt-8">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 px-6 py-3 text-neutral-600 hover:text-neutral-800 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// Goals Step Component
const GoalsStep = ({ 
  profile, 
  updateProfile, 
  onNext, 
  onPrev 
}: { 
  profile: Partial<UserProfile>; 
  updateProfile: (updates: Partial<UserProfile>) => void;
  onNext: () => void;
  onPrev: () => void;
}) => {
  const primaryGoals = [
    { id: 'build_confidence', label: 'Build confidence in conversations', icon: '💪' },
    { id: 'improve_relationships', label: 'Improve relationships', icon: '❤️' },
    { id: 'work_communication', label: 'Better workplace communication', icon: '💼' },
    { id: 'social_situations', label: 'Navigate social situations', icon: '👥' },
    { id: 'other', label: 'Something else', icon: '✨' }
  ];

  const practiceOptions = [
    'Starting conversations',
    'Small talk',
    'Expressing opinions',
    'Asking for help',
    'Workplace discussions',
    'Social events',
    'Giving feedback',
    'Difficult conversations'
  ];

  const feedbackOptions = [
    { id: 'gentle', label: 'Gentle & encouraging', icon: '🌱' },
    { id: 'direct', label: 'Direct & specific', icon: '🎯' },
    { id: 'encouraging', label: 'Motivational & positive', icon: '⭐' }
  ];

  const togglePracticeArea = (area: string) => {
    const current = profile.practiceAreas || [];
    const updated = current.includes(area)
      ? current.filter(a => a !== area)
      : [...current, area];
    updateProfile({ practiceAreas: updated });
  };

  const canContinue = profile.primaryGoal && profile.feedbackStyle;

  return (
    <motion.div variants={itemVariants} className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Target className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-neutral-900 mb-4">What's your main goal?</h2>
        <p className="text-neutral-600">
          This helps us create the best practice sessions for you.
        </p>
      </div>

      <div className="space-y-8">
        {/* Primary Goal */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">Main goal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {primaryGoals.map((goal) => (
              <button
                key={goal.id}
                onClick={() => updateProfile({ primaryGoal: goal.id as any })}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  profile.primaryGoal === goal.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-neutral-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{goal.icon}</span>
                  <span className="font-semibold text-neutral-900">{goal.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Practice Areas */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">
            What would you like to practice? (Optional)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {practiceOptions.map((area) => (
              <button
                key={area}
                onClick={() => togglePracticeArea(area)}
                className={`p-3 rounded-xl border-2 transition-all text-sm ${
                  profile.practiceAreas?.includes(area)
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-neutral-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Style */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">How would you like feedback?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {feedbackOptions.map((style) => (
              <button
                key={style.id}
                onClick={() => updateProfile({ feedbackStyle: style.id as any })}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  profile.feedbackStyle === style.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-neutral-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <span className="text-2xl block mb-2">{style.icon}</span>
                <span className="font-semibold text-neutral-900">{style.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-8">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 px-6 py-3 text-neutral-600 hover:text-neutral-800 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          Complete Setup
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// Complete Step Component
const CompleteStep = ({ onComplete }: { onComplete: () => void }) => (
  <motion.div variants={itemVariants} className="text-center space-y-8">
    <div className="space-y-6">
      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
        <CheckCircle className="w-10 h-10 text-white" />
      </div>
      
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight">
          You're all set!
        </h1>
        <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          Your personalized practice space is ready. Let's start building your confidence!
        </p>
      </div>
    </div>

    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 max-w-2xl mx-auto">
      <div className="flex items-center space-x-4 mb-4">
        <MessageCircle className="w-8 h-8 text-purple-600" />
        <h3 className="text-lg font-semibold text-neutral-900">What's next?</h3>
      </div>
      <p className="text-neutral-600 text-left">
        We'll create practice scenarios based on your goals and provide feedback in your preferred style. 
        Everything is tailored to help you grow at your own pace.
      </p>
    </div>

    <div className="pt-4">
      <button
        onClick={onComplete}
        className="group bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto"
      >
        Start practicing
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
      </button>
    </div>
  </motion.div>
); 