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

      <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-white">
        {/* Progress Bar */}
        {currentStep !== 'welcome' && currentStep !== 'complete' && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-neutral-200/40">
            <div className="content-width mx-auto container-padding py-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] font-medium text-neutral-500">
                  Step {currentStepIndex} of {steps.length - 2}
                </span>
                <span className="text-[13px] font-medium text-neutral-500">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-1.5">
                <motion.div 
                  className="bg-neutral-900 h-1.5 rounded-full"
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
          currentStep !== 'welcome' && currentStep !== 'complete' ? 'pt-32' : ''
        }`}>
          <div className="w-full content-width mx-auto container-padding py-12">
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

            {currentStep !== 'welcome' && currentStep !== 'complete' && (
              <div className="mt-16 text-center">
                <button
                  onClick={skipOnboarding}
                  className="text-[13px] text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  Skip for now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Welcome Step Component
const WelcomeStep = ({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) => (
  <motion.div variants={itemVariants} className="text-center space-y-12 max-w-3xl mx-auto">
    <div className="space-y-8">
      <div className="w-14 h-14 bg-neutral-900 rounded-2xl flex items-center justify-center mx-auto">
        <Sparkles className="w-6 h-6 text-white" />
      </div>
      
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-[-0.02em]">
          Welcome to Kairoo
        </h1>
        <p className="text-lg text-neutral-500 max-w-xl mx-auto leading-relaxed">
          Let&apos;s personalize your experience so we can help you practice the conversations that matter most.
        </p>
      </div>
    </div>

    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        <div className="p-6 rounded-xl bg-white border border-neutral-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-center">
          <Brain className="w-5 h-5 text-neutral-500 mb-4 mx-auto" />
          <h3 className="text-[15px] font-semibold text-neutral-900 mb-1">Personalized</h3>
          <p className="text-[13px] text-neutral-500">Tailored to your goals</p>
        </div>
        
        <div className="p-6 rounded-xl bg-white border border-neutral-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-center">
          <Heart className="w-5 h-5 text-neutral-500 mb-4 mx-auto" />
          <h3 className="text-[15px] font-semibold text-neutral-900 mb-1">Supportive</h3>
          <p className="text-[13px] text-neutral-500">Safe, judgment-free</p>
        </div>
        
        <div className="p-6 rounded-xl bg-white border border-neutral-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-center">
          <Target className="w-5 h-5 text-neutral-500 mb-4 mx-auto" />
          <h3 className="text-[15px] font-semibold text-neutral-900 mb-1">Effective</h3>
          <p className="text-[13px] text-neutral-500">Real practice, real results</p>
        </div>
      </div>
      
      <div className="pt-4">
        <button
          onClick={onNext}
          className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-neutral-900 text-white font-medium text-[15px] rounded-xl hover:bg-neutral-800 active:scale-[0.98] transition-all duration-200 mx-auto"
        >
          Get started
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
        </button>
      </div>
      
      <p className="text-[13px] text-neutral-400">
        Takes about 2 minutes. Skip anytime.
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
    <motion.div variants={itemVariants} className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-glow-purple-lg">
          <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="heading-2 mb-6">What should we call you?</h2>
        <p className="body-large">
          Just your first name or what you'd like to be called during practice.
        </p>
      </div>

      <div className="card p-10 mb-10">
        <input
          type="text"
          value={profile.name || ''}
          onChange={(e) => updateProfile({ name: e.target.value })}
          className="input-field text-xl text-center py-6"
          placeholder="Your name"
          autoFocus
        />
        <p className="caption text-center mt-4">
          This helps us create a more personal and comfortable experience.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={onPrev}
          className="btn-ghost flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="btn-primary px-10 py-4 flex items-center gap-2"
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
    <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-glow-purple-lg">
          <Target className="w-10 h-10 text-white" />
        </div>
        <h2 className="heading-2 mb-6">What's your main goal?</h2>
        <p className="body-large">
          This helps us create the best practice sessions for you.
        </p>
      </div>

      <div className="space-y-12">
        {/* Primary Goal */}
        <div className="card p-10">
          <h3 className="text-xl font-bold text-neutral-900 mb-8">Main goal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {primaryGoals.map((goal) => (
              <button
                key={goal.id}
                onClick={() => updateProfile({ primaryGoal: goal.id as any })}
                className={`p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                  profile.primaryGoal === goal.id
                    ? 'border-purple-400 bg-purple-50 shadow-glow-purple'
                    : 'border-neutral-200 hover:border-purple-300 hover:bg-purple-25 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{goal.icon}</span>
                  <span className="font-bold text-neutral-900">{goal.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Practice Areas */}
        <div className="card p-10">
          <h3 className="text-xl font-bold text-neutral-900 mb-8">
            What would you like to practice? <span className="text-neutral-400 font-normal text-lg">(Optional)</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {practiceOptions.map((area) => (
              <button
                key={area}
                onClick={() => togglePracticeArea(area)}
                className={`p-4 rounded-2xl border-2 transition-all duration-200 text-sm font-medium ${
                  profile.practiceAreas?.includes(area)
                    ? 'border-purple-400 bg-purple-50 text-purple-700 shadow-glow-purple'
                    : 'border-neutral-200 hover:border-purple-300 hover:bg-purple-25 hover:shadow-sm'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
          <p className="caption mt-6">
            Select any areas you'd specifically like to work on. You can always practice other scenarios too.
          </p>
        </div>

        {/* Feedback Style */}
        <div className="card p-10">
          <h3 className="text-xl font-bold text-neutral-900 mb-8">How would you like feedback?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {feedbackOptions.map((style) => (
              <button
                key={style.id}
                onClick={() => updateProfile({ feedbackStyle: style.id as any })}
                className={`p-6 rounded-2xl border-2 transition-all duration-200 text-center ${
                  profile.feedbackStyle === style.id
                    ? 'border-purple-400 bg-purple-50 shadow-glow-purple'
                    : 'border-neutral-200 hover:border-purple-300 hover:bg-purple-25 hover:shadow-sm'
                }`}
              >
                <span className="text-3xl block mb-4">{style.icon}</span>
                <span className="font-bold text-neutral-900 text-base">{style.label}</span>
              </button>
            ))}
          </div>
          <p className="caption mt-6">
            This helps us adjust the tone and style of coaching to what feels most helpful for you.
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-12">
        <button
          onClick={onPrev}
          className="btn-ghost flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="btn-primary px-10 py-4 flex items-center gap-2"
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
  <motion.div variants={itemVariants} className="text-center space-y-12 max-w-4xl mx-auto">
    <div className="space-y-8">
      <div className="w-24 h-24 bg-gradient-to-br from-success-500 to-success-600 rounded-3xl flex items-center justify-center mx-auto shadow-glow-purple-lg">
        <CheckCircle className="w-12 h-12 text-white" />
      </div>
      
      <div className="space-y-6">
        <h1 className="heading-1">
          You're all set!
        </h1>
        <p className="body-large max-w-3xl mx-auto">
          Your personalized practice space is ready. Let's start building your confidence!
        </p>
      </div>
    </div>

    <div className="card p-10 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-purple-600" />
        </div>
        <h3 className="text-xl font-bold text-neutral-900">What's next?</h3>
      </div>
      <p className="text-neutral-600 text-left leading-relaxed">
        We'll create practice scenarios based on your goals and provide feedback in your preferred style. 
        Everything is tailored to help you grow at your own pace.
      </p>
    </div>

    <div className="pt-6">
      <button
        onClick={onComplete}
        className="group btn-primary py-5 px-12 text-lg font-semibold flex items-center gap-3 mx-auto min-h-[64px]"
      >
        Start practicing
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
      </button>
    </div>
  </motion.div>
); 