import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Heart, 
  Target, 
  MessageCircle, 
  Calendar,
  Sparkles,
  CheckCircle,
  Brain,
  Users,
  Coffee,
  Briefcase,
  GraduationCap,
  Home
} from 'lucide-react';

interface UserProfile {
  // Basic info
  name: string;
  age: number;
  pronouns: string;
  
  // Goals and motivations
  primaryGoal: 'build_confidence' | 'improve_relationships' | 'work_communication' | 'social_anxiety' | 'dating' | 'other';
  specificGoals: string[];
  motivations: string[];
  
  // Current situation
  socialComfortLevel: number; // 1-10
  challengingScenarios: string[];
  successfulScenarios: string[];
  
  // Communication style
  communicationStyle: 'direct' | 'diplomatic' | 'analytical' | 'supportive' | 'mixed';
  preferredFeedbackStyle: 'gentle' | 'direct' | 'detailed' | 'encouraging';
  
  // Interests and context
  interests: string[];
  lifestyle: 'student' | 'working_professional' | 'freelancer' | 'retired' | 'between_jobs' | 'other';
  relationshipStatus: 'single' | 'dating' | 'relationship' | 'married' | 'prefer_not_to_say';
  
  // Practice preferences
  sessionFrequency: 'daily' | 'few_times_week' | 'weekly' | 'as_needed';
  sessionLength: 'short' | 'medium' | 'long'; // 5-10min, 10-20min, 20+ min
  practiceAreas: string[];
  
  // Accessibility and comfort
  voicePracticeComfort: number; // 1-10
  feedbackSensitivity: number; // 1-10
  triggerTopics: string[];
  
  // Optional context
  aboutYourself: string;
  previousExperience: string;
}

type OnboardingStep = 
  | 'welcome' 
  | 'basic_info' 
  | 'goals' 
  | 'current_situation' 
  | 'communication_style' 
  | 'interests' 
  | 'preferences' 
  | 'accessibility' 
  | 'final_setup' 
  | 'complete';

const steps: OnboardingStep[] = [
  'welcome',
  'basic_info',
  'goals',
  'current_situation',
  'communication_style',
  'interests',
  'preferences',
  'accessibility',
  'final_setup',
  'complete'
];

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
    socialComfortLevel: 5,
    voicePracticeComfort: 7,
    feedbackSensitivity: 5,
    specificGoals: [],
    motivations: [],
    challengingScenarios: [],
    successfulScenarios: [],
    interests: [],
    practiceAreas: [],
    triggerTopics: []
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

  const completeOnboarding = async () => {
    try {
      // Save profile to localStorage and API
      const anonId = localStorage.getItem('anonId') || crypto.randomUUID();
      localStorage.setItem('anonId', anonId);
      localStorage.setItem('userProfile', JSON.stringify(profile));
      localStorage.setItem('onboardingCompleted', 'true');

      // Save to API
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

      // Navigate to app
      router.push('/app?view=practice&first_time=true');
    } catch (error) {
      console.error('Error saving profile:', error);
      // Still proceed to app even if API fails
      router.push('/app?view=practice&first_time=true');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <WelcomeStep onNext={nextStep} />
        );

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

      case 'current_situation':
        return (
          <CurrentSituationStep 
            profile={profile}
            updateProfile={updateProfile}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );

      case 'communication_style':
        return (
          <CommunicationStyleStep 
            profile={profile}
            updateProfile={updateProfile}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );

      case 'interests':
        return (
          <InterestsStep 
            profile={profile}
            updateProfile={updateProfile}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );

      case 'preferences':
        return (
          <PreferencesStep 
            profile={profile}
            updateProfile={updateProfile}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );

      case 'accessibility':
        return (
          <AccessibilityStep 
            profile={profile}
            updateProfile={updateProfile}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );

      case 'final_setup':
        return (
          <FinalSetupStep 
            profile={profile}
            updateProfile={updateProfile}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );

      case 'complete':
        return (
          <CompleteStep onComplete={completeOnboarding} />
        );

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
      </div>
    </>
  );
}

// Welcome Step Component
const WelcomeStep = ({ onNext }: { onNext: () => void }) => (
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
          Let's personalize your experience so we can provide the most helpful support for your communication goals.
        </p>
      </div>
    </div>

    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
          <Brain className="w-8 h-8 text-purple-600 mb-4 mx-auto" />
          <h3 className="font-semibold text-neutral-900 mb-2">Personalized</h3>
          <p className="text-sm text-neutral-600">Tailored to your specific goals and communication style</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
          <Heart className="w-8 h-8 text-purple-600 mb-4 mx-auto" />
          <h3 className="font-semibold text-neutral-900 mb-2">Supportive</h3>
          <p className="text-sm text-neutral-600">A safe, judgment-free space to practice and grow</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
          <Target className="w-8 h-8 text-purple-600 mb-4 mx-auto" />
          <h3 className="font-semibold text-neutral-900 mb-2">Effective</h3>
          <p className="text-sm text-neutral-600">Real practice for real-life conversations</p>
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
        This will take about 5 minutes. We'll never share your personal information.
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!profile.name?.trim()) {
      newErrors.name = 'Please enter your name';
    }
    
    if (!profile.age || profile.age < 13 || profile.age > 120) {
      newErrors.age = 'Please enter a valid age';
    }
    
    if (!profile.pronouns?.trim()) {
      newErrors.pronouns = 'Please select your pronouns';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <User className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-neutral-900 mb-4">Tell us about yourself</h2>
        <p className="text-neutral-600">
          Help us personalize your Kairoo experience with some basic information.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-3">
            What should we call you? *
          </label>
          <input
            type="text"
            value={profile.name || ''}
            onChange={(e) => updateProfile({ name: e.target.value })}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
              errors.name ? 'border-red-300' : 'border-neutral-200'
            }`}
            placeholder="Your first name or preferred name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-3">
            Age *
          </label>
          <input
            type="number"
            value={profile.age || ''}
            onChange={(e) => updateProfile({ age: parseInt(e.target.value) || 0 })}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
              errors.age ? 'border-red-300' : 'border-neutral-200'
            }`}
            placeholder="Your age"
            min="13"
            max="120"
          />
          {errors.age && <p className="text-red-500 text-sm mt-2">{errors.age}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-3">
            Pronouns *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['they/them', 'she/her', 'he/him', 'other'].map((pronoun) => (
              <button
                key={pronoun}
                onClick={() => updateProfile({ pronouns: pronoun })}
                className={`py-3 px-4 rounded-xl border-2 transition-all font-medium ${
                  profile.pronouns === pronoun
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-neutral-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                {pronoun}
              </button>
            ))}
          </div>
          {profile.pronouns === 'other' && (
            <input
              type="text"
              onChange={(e) => updateProfile({ pronouns: e.target.value })}
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors mt-3"
              placeholder="Please specify your pronouns"
            />
          )}
          {errors.pronouns && <p className="text-red-500 text-sm mt-2">{errors.pronouns}</p>}
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
          onClick={handleNext}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2"
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
    { id: 'build_confidence', label: 'Build communication confidence', icon: '💪', description: 'Feel more confident in social situations' },
    { id: 'improve_relationships', label: 'Improve relationships', icon: '❤️', description: 'Strengthen existing relationships' },
    { id: 'work_communication', label: 'Professional communication', icon: '💼', description: 'Better workplace conversations' },
    { id: 'social_anxiety', label: 'Social anxiety support', icon: '🌱', description: 'Practice in a safe environment' },
    { id: 'dating', label: 'Dating conversations', icon: '💕', description: 'Navigate romantic connections' },
    { id: 'other', label: 'Something else', icon: '✨', description: 'I have different goals' }
  ];

  const specificGoalOptions = [
    'Starting conversations with new people',
    'Expressing disagreement respectfully',
    'Setting healthy boundaries',
    'Asking for help or support',
    'Giving and receiving feedback',
    'Small talk and casual conversations',
    'Difficult conversations with family',
    'Workplace meetings and presentations',
    'Dating conversations and flirting',
    'Dealing with conflict',
    'Making plans with friends',
    'Networking and professional relationships'
  ];

  const toggleSpecificGoal = (goal: string) => {
    const current = profile.specificGoals || [];
    const updated = current.includes(goal)
      ? current.filter(g => g !== goal)
      : [...current, goal];
    updateProfile({ specificGoals: updated });
  };

  const canContinue = profile.primaryGoal && (profile.specificGoals?.length || 0) >= 1;

  return (
    <motion.div variants={itemVariants} className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Target className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-neutral-900 mb-4">What brings you to Kairoo?</h2>
        <p className="text-neutral-600">
          Understanding your goals helps us create the best practice sessions for you.
        </p>
      </div>

      <div className="space-y-8">
        {/* Primary Goal */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">Main goal *</h3>
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
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{goal.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-neutral-900 mb-1">{goal.label}</div>
                    <div className="text-sm text-neutral-600">{goal.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Specific Goals */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">
            Specific areas you'd like to practice *
            <span className="text-sm font-normal text-neutral-500 ml-2">(Select at least 1)</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {specificGoalOptions.map((goal) => (
              <button
                key={goal}
                onClick={() => toggleSpecificGoal(goal)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  profile.specificGoals?.includes(goal)
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-neutral-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded border-2 transition-colors ${
                    profile.specificGoals?.includes(goal)
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-neutral-300'
                  }`}>
                    {profile.specificGoals?.includes(goal) && (
                      <CheckCircle className="w-3 h-3 text-white m-0.5" />
                    )}
                  </div>
                  <span className="font-medium">{goal}</span>
                </div>
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
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// Current Situation Step Component
const CurrentSituationStep = ({ 
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
  const challengingScenarios = [
    'Group conversations',
    'Meeting new people', 
    'Workplace interactions',
    'Family gatherings',
    'Phone calls',
    'Dating situations',
    'Expressing disagreement',
    'Asking for help',
    'Social events/parties',
    'Online/text conversations'
  ];

  const successfulScenarios = [
    'One-on-one conversations',
    'Talking about shared interests',
    'Helping others',
    'Familiar social settings',
    'Written communication',
    'Professional contexts',
    'Conversations with close friends',
    'Structured activities',
    'Small group discussions',
    'Online interactions'
  ];

  const toggleScenario = (scenario: string, type: 'challenging' | 'successful') => {
    const key = type === 'challenging' ? 'challengingScenarios' : 'successfulScenarios';
    const current = profile[key] || [];
    const updated = current.includes(scenario)
      ? current.filter(s => s !== scenario)
      : [...current, scenario];
    updateProfile({ [key]: updated });
  };

  return (
    <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <MessageCircle className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-neutral-900 mb-4">How comfortable are you socially?</h2>
        <p className="text-neutral-600">
          Help us understand your current comfort level and experiences.
        </p>
      </div>

      <div className="space-y-8">
        {/* Comfort Level Slider */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">
            Overall social comfort level
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-neutral-600">
              <span>Not comfortable</span>
              <span>Very comfortable</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={profile.socialComfortLevel || 5}
              onChange={(e) => updateProfile({ socialComfortLevel: parseInt(e.target.value) })}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="text-center">
              <span className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                {profile.socialComfortLevel || 5}/10
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Challenging Scenarios */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
            <h3 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                😅
              </span>
              What feels challenging?
            </h3>
            <div className="space-y-3">
              {challengingScenarios.map((scenario) => (
                <button
                  key={scenario}
                  onClick={() => toggleScenario(scenario, 'challenging')}
                  className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                    profile.challengingScenarios?.includes(scenario)
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-neutral-200 hover:border-orange-300 hover:bg-orange-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded border-2 transition-colors ${
                      profile.challengingScenarios?.includes(scenario)
                        ? 'border-orange-500 bg-orange-500'
                        : 'border-neutral-300'
                    }`}>
                      {profile.challengingScenarios?.includes(scenario) && (
                        <CheckCircle className="w-2 h-2 text-white m-0.5" />
                      )}
                    </div>
                    <span className="font-medium">{scenario}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Successful Scenarios */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
            <h3 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                😊
              </span>
              What feels natural?
            </h3>
            <div className="space-y-3">
              {successfulScenarios.map((scenario) => (
                <button
                  key={scenario}
                  onClick={() => toggleScenario(scenario, 'successful')}
                  className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                    profile.successfulScenarios?.includes(scenario)
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-neutral-200 hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded border-2 transition-colors ${
                      profile.successfulScenarios?.includes(scenario)
                        ? 'border-green-500 bg-green-500'
                        : 'border-neutral-300'
                    }`}>
                      {profile.successfulScenarios?.includes(scenario) && (
                        <CheckCircle className="w-2 h-2 text-white m-0.5" />
                      )}
                    </div>
                    <span className="font-medium">{scenario}</span>
                  </div>
                </button>
              ))}
            </div>
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
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// Communication Style Step Component
const CommunicationStyleStep = ({ 
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
  const communicationStyles = [
    { 
      id: 'direct', 
      label: 'Direct & Straightforward', 
      icon: '🎯', 
      description: 'I prefer clear, honest communication without beating around the bush' 
    },
    { 
      id: 'diplomatic', 
      label: 'Diplomatic & Tactful', 
      icon: '🤝', 
      description: 'I like to consider others\' feelings and find the gentlest way to communicate' 
    },
    { 
      id: 'analytical', 
      label: 'Analytical & Thoughtful', 
      icon: '🧠', 
      description: 'I prefer to think things through and communicate with logic and reasoning' 
    },
    { 
      id: 'supportive', 
      label: 'Supportive & Encouraging', 
      icon: '❤️', 
      description: 'I focus on being warm, understanding, and building others up' 
    },
    { 
      id: 'mixed', 
      label: 'It depends on the situation', 
      icon: '🎭', 
      description: 'I adapt my communication style based on the context and person' 
    }
  ];

  const feedbackStyles = [
    { 
      id: 'gentle', 
      label: 'Gentle & Encouraging', 
      icon: '🌱', 
      description: 'Focus on what I did well, with soft suggestions for improvement' 
    },
    { 
      id: 'direct', 
      label: 'Direct & Specific', 
      icon: '🎯', 
      description: 'Give me clear, actionable feedback without sugar-coating' 
    },
    { 
      id: 'detailed', 
      label: 'Detailed & Comprehensive', 
      icon: '📋', 
      description: 'I want thorough analysis and in-depth explanations' 
    },
    { 
      id: 'encouraging', 
      label: 'Motivational & Positive', 
      icon: '⭐', 
      description: 'Focus on building my confidence and celebrating progress' 
    }
  ];

  return (
    <motion.div variants={itemVariants} className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Users className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-neutral-900 mb-4">How do you like to communicate?</h2>
        <p className="text-neutral-600">
          Understanding your style helps us provide the most relevant practice scenarios.
        </p>
      </div>

      <div className="space-y-8">
        {/* Communication Style */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">Your communication style *</h3>
          <div className="space-y-4">
            {communicationStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => updateProfile({ communicationStyle: style.id as any })}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  profile.communicationStyle === style.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-neutral-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <span className="text-2xl">{style.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-neutral-900 mb-1">{style.label}</div>
                    <div className="text-sm text-neutral-600">{style.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Preference */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">How would you like to receive feedback? *</h3>
          <div className="space-y-4">
            {feedbackStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => updateProfile({ preferredFeedbackStyle: style.id as any })}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  profile.preferredFeedbackStyle === style.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-neutral-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <span className="text-2xl">{style.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-neutral-900 mb-1">{style.label}</div>
                    <div className="text-sm text-neutral-600">{style.description}</div>
                  </div>
                </div>
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
          disabled={!profile.communicationStyle || !profile.preferredFeedbackStyle}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// Interests Step Component
const InterestsStep = ({ 
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
  const interestCategories = [
    { category: 'Creative', interests: ['Art & Design', 'Music', 'Writing', 'Photography', 'Crafts', 'Theater'] },
    { category: 'Active', interests: ['Sports', 'Fitness', 'Hiking', 'Dancing', 'Yoga', 'Outdoor Adventures'] },
    { category: 'Intellectual', interests: ['Reading', 'Science', 'History', 'Philosophy', 'Learning Languages', 'Documentaries'] },
    { category: 'Social', interests: ['Volunteering', 'Community Events', 'Networking', 'Board Games', 'Parties', 'Cultural Events'] },
    { category: 'Tech', interests: ['Gaming', 'Programming', 'Gadgets', 'AI/ML', 'Web Development', 'Tech News'] },
    { category: 'Lifestyle', interests: ['Cooking', 'Travel', 'Fashion', 'Home Improvement', 'Gardening', 'Pets'] }
  ];

  const lifestyles = [
    { id: 'student', label: 'Student', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'working_professional', label: 'Working Professional', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'freelancer', label: 'Freelancer', icon: <Coffee className="w-5 h-5" /> },
    { id: 'retired', label: 'Retired', icon: <Home className="w-5 h-5" /> },
    { id: 'between_jobs', label: 'Between Jobs', icon: <Users className="w-5 h-5" /> },
    { id: 'other', label: 'Other', icon: <Sparkles className="w-5 h-5" /> }
  ];

  const relationshipStatuses = [
    'single', 'dating', 'relationship', 'married', 'prefer_not_to_say'
  ];

  const toggleInterest = (interest: string) => {
    const current = profile.interests || [];
    const updated = current.includes(interest)
      ? current.filter(i => i !== interest)
      : [...current, interest];
    updateProfile({ interests: updated });
  };

  return (
    <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Heart className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-neutral-900 mb-4">Tell us about your interests</h2>
        <p className="text-neutral-600">
          This helps us create more relevant conversation scenarios and topics.
        </p>
      </div>

      <div className="space-y-8">
        {/* Interests */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">What are you interested in?</h3>
          <div className="space-y-6">
            {interestCategories.map((category) => (
              <div key={category.category}>
                <h4 className="text-sm font-medium text-neutral-700 mb-3">{category.category}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {category.interests.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`p-3 rounded-xl border-2 transition-all text-left text-sm ${
                        profile.interests?.includes(interest)
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-neutral-200 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lifestyle */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
            <h3 className="text-lg font-semibold text-neutral-900 mb-6">Current lifestyle</h3>
            <div className="space-y-3">
              {lifestyles.map((lifestyle) => (
                <button
                  key={lifestyle.id}
                  onClick={() => updateProfile({ lifestyle: lifestyle.id as any })}
                  className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                    profile.lifestyle === lifestyle.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-neutral-200 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {lifestyle.icon}
                    <span className="font-medium">{lifestyle.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Relationship Status */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
            <h3 className="text-lg font-semibold text-neutral-900 mb-6">Relationship status</h3>
            <div className="space-y-3">
              {relationshipStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => updateProfile({ relationshipStatus: status as any })}
                  className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                    profile.relationshipStatus === status
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-neutral-200 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  <span className="font-medium capitalize">{status.replace('_', ' ')}</span>
                </button>
              ))}
            </div>
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
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// Preferences Step Component
const PreferencesStep = ({ 
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
  const sessionFrequencies = [
    { id: 'daily', label: 'Daily', description: 'Quick daily practice sessions' },
    { id: 'few_times_week', label: 'Few times a week', description: 'Regular practice 2-3 times per week' },
    { id: 'weekly', label: 'Weekly', description: 'Once a week focused sessions' },
    { id: 'as_needed', label: 'As needed', description: 'When I need to prepare for something specific' }
  ];

  const sessionLengths = [
    { id: 'short', label: '5-10 minutes', description: 'Quick practice sessions' },
    { id: 'medium', label: '10-20 minutes', description: 'Standard practice sessions' },
    { id: 'long', label: '20+ minutes', description: 'Deep dive practice sessions' }
  ];

  const practiceAreaOptions = [
    'Small talk and casual conversations',
    'Workplace communication',
    'Family and relationship conversations',
    'Dating and romantic interactions',
    'Difficult or sensitive topics',
    'Group discussions and meetings',
    'Public speaking and presentations',
    'Conflict resolution',
    'Networking and professional relationships',
    'Creative and collaborative discussions'
  ];

  const togglePracticeArea = (area: string) => {
    const current = profile.practiceAreas || [];
    const updated = current.includes(area)
      ? current.filter(a => a !== area)
      : [...current, area];
    updateProfile({ practiceAreas: updated });
  };

  return (
    <motion.div variants={itemVariants} className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Calendar className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-neutral-900 mb-4">Practice preferences</h2>
        <p className="text-neutral-600">
          Help us customize your practice schedule and session types.
        </p>
      </div>

      <div className="space-y-8">
        {/* Session Frequency */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">How often would you like to practice?</h3>
          <div className="space-y-3">
            {sessionFrequencies.map((freq) => (
              <button
                key={freq.id}
                onClick={() => updateProfile({ sessionFrequency: freq.id as any })}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  profile.sessionFrequency === freq.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-neutral-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <div className="font-semibold text-neutral-900 mb-1">{freq.label}</div>
                <div className="text-sm text-neutral-600">{freq.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Session Length */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">Preferred session length</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sessionLengths.map((length) => (
              <button
                key={length.id}
                onClick={() => updateProfile({ sessionLength: length.id as any })}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  profile.sessionLength === length.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-neutral-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <div className="font-semibold text-neutral-900 mb-1">{length.label}</div>
                <div className="text-sm text-neutral-600">{length.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Practice Areas */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">What types of conversations would you like to practice?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {practiceAreaOptions.map((area) => (
              <button
                key={area}
                onClick={() => togglePracticeArea(area)}
                className={`p-3 rounded-xl border-2 transition-all text-left ${
                  profile.practiceAreas?.includes(area)
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-neutral-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded border-2 transition-colors ${
                    profile.practiceAreas?.includes(area)
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-neutral-300'
                  }`}>
                    {profile.practiceAreas?.includes(area) && (
                      <CheckCircle className="w-2 h-2 text-white m-0.5" />
                    )}
                  </div>
                  <span className="font-medium">{area}</span>
                </div>
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
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// Accessibility Step Component
const AccessibilityStep = ({ 
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
  const commonTriggers = [
    'Criticism or negative feedback',
    'Conflict or confrontation',
    'Authority figures',
    'Large groups',
    'Public speaking',
    'Personal questions',
    'Rejection or dismissal',
    'Time pressure',
    'Interruptions',
    'Emotional topics'
  ];

  const toggleTrigger = (trigger: string) => {
    const current = profile.triggerTopics || [];
    const updated = current.includes(trigger)
      ? current.filter(t => t !== trigger)
      : [...current, trigger];
    updateProfile({ triggerTopics: updated });
  };

  return (
    <motion.div variants={itemVariants} className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Heart className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-neutral-900 mb-4">Comfort and accessibility</h2>
        <p className="text-neutral-600">
          Help us create a safe and comfortable practice environment for you.
        </p>
      </div>

      <div className="space-y-8">
        {/* Voice Practice Comfort */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">
            How comfortable are you with voice practice?
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-neutral-600">
              <span>Not comfortable</span>
              <span>Very comfortable</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={profile.voicePracticeComfort || 7}
              onChange={(e) => updateProfile({ voicePracticeComfort: parseInt(e.target.value) })}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="text-center">
              <span className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                {profile.voicePracticeComfort || 7}/10
              </span>
            </div>
          </div>
        </div>

        {/* Feedback Sensitivity */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">
            How sensitive are you to feedback?
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-neutral-600">
              <span>Very sensitive</span>
              <span>Not sensitive</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={profile.feedbackSensitivity || 5}
              onChange={(e) => updateProfile({ feedbackSensitivity: parseInt(e.target.value) })}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="text-center">
              <span className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                {profile.feedbackSensitivity || 5}/10
              </span>
            </div>
            <p className="text-sm text-neutral-500 text-center">
              This helps us adjust our feedback style to be more supportive or direct based on your preference
            </p>
          </div>
        </div>

        {/* Trigger Topics */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">
            Topics or situations that make you uncomfortable
            <span className="text-sm font-normal text-neutral-500 ml-2">(Optional - helps us avoid these in practice)</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {commonTriggers.map((trigger) => (
              <button
                key={trigger}
                onClick={() => toggleTrigger(trigger)}
                className={`p-3 rounded-xl border-2 transition-all text-left ${
                  profile.triggerTopics?.includes(trigger)
                    ? 'border-red-300 bg-red-50 text-red-700'
                    : 'border-neutral-200 hover:border-red-200 hover:bg-red-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded border-2 transition-colors ${
                    profile.triggerTopics?.includes(trigger)
                      ? 'border-red-400 bg-red-400'
                      : 'border-neutral-300'
                  }`}>
                    {profile.triggerTopics?.includes(trigger) && (
                      <CheckCircle className="w-2 h-2 text-white m-0.5" />
                    )}
                  </div>
                  <span className="font-medium">{trigger}</span>
                </div>
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
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// Final Setup Step Component
const FinalSetupStep = ({ 
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
  return (
    <motion.div variants={itemVariants} className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-neutral-900 mb-4">Final touches</h2>
        <p className="text-neutral-600">
          Share anything else that would help us personalize your experience.
        </p>
      </div>

      <div className="space-y-8">
        {/* About Yourself */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">
            Tell us a bit about yourself
            <span className="text-sm font-normal text-neutral-500 ml-2">(Optional)</span>
          </h3>
          <textarea
            value={profile.aboutYourself || ''}
            onChange={(e) => updateProfile({ aboutYourself: e.target.value })}
            className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none h-32"
            placeholder="Anything you'd like us to know about your personality, background, or what makes you unique..."
          />
        </div>

        {/* Previous Experience */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">
            Previous experience with communication practice
            <span className="text-sm font-normal text-neutral-500 ml-2">(Optional)</span>
          </h3>
          <textarea
            value={profile.previousExperience || ''}
            onChange={(e) => updateProfile({ previousExperience: e.target.value })}
            className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none h-32"
            placeholder="Have you tried therapy, coaching, communication workshops, or other practice tools? What worked or didn't work for you?"
          />
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
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2"
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
          Thank you for taking the time to personalize your Kairoo experience. 
          We're excited to support your communication journey.
        </p>
      </div>
    </div>

    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">What happens next?</h3>
      <div className="space-y-4 text-left">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-1">
            <span className="text-sm font-bold text-purple-600">1</span>
          </div>
          <div>
            <p className="font-medium text-neutral-900">Personalized scenarios</p>
            <p className="text-sm text-neutral-600">We'll create practice scenarios based on your goals and interests</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-1">
            <span className="text-sm font-bold text-purple-600">2</span>
          </div>
          <div>
            <p className="font-medium text-neutral-900">Tailored feedback</p>
            <p className="text-sm text-neutral-600">Receive feedback in the style that works best for you</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-1">
            <span className="text-sm font-bold text-purple-600">3</span>
          </div>
          <div>
            <p className="font-medium text-neutral-900">Safe practice space</p>
            <p className="text-sm text-neutral-600">Practice without judgment in scenarios that respect your comfort level</p>
          </div>
        </div>
      </div>
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