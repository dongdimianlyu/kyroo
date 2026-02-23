import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Sparkles, 
  ArrowRight, 
  CheckCircle,
  Mic2,
  Lightbulb,
  ShieldCheck,
  Zap,
  Bot,
  Target,
  HeadphonesIcon,
  Star,
  MessageCircle,
  UserCheck,
  Clock,
  Compass,
  Megaphone,
  BadgeCheck
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import Hero from '@/components/Hero';

// Linear's exact text reveal implementation
const LinearTextReveal = ({ 
  text, 
  className = "", 
  delay = 0,
  staggerDelay = 0.05 
}: { 
  text: string, 
  className?: string, 
  delay?: number,
  staggerDelay?: number
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const words = text.split(" ");

  return (
    <div ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ 
            opacity: 1,
            filter: "blur(8px)",
            transform: "translateY(20%)"
          }}
          animate={isInView ? {
            opacity: 1,
            filter: "blur(0px)",
            transform: "translateY(0%)"
          } : {
            opacity: 1,
            filter: "blur(8px)",
            transform: "translateY(20%)"
          }}
          transition={{
            duration: 0.4,
            delay: delay + (i * staggerDelay),
            ease: [0.25, 0.1, 0.25, 1]
          }}
          style={{
            display: "inline-block",
            marginRight: i === words.length - 1 ? "0" : "0.25em"
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

// Linear's smooth reveal with blur
const LinearReveal = ({ 
  children, 
  delay = 0, 
  className = "",
  y = 20 
}: { 
  children: React.ReactNode, 
  delay?: number, 
  className?: string,
  y?: number
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ 
        opacity: 0, 
        filter: "blur(6px)",
        transform: `translateY(${y}px)`
      }}
      animate={isInView ? { 
        opacity: 1, 
        filter: "blur(0px)",
        transform: "translateY(0px)"
      } : { 
        opacity: 0, 
        filter: "blur(6px)",
        transform: `translateY(${y}px)`
      }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Linear's staggered container
const LinearContainer = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.05,
            delayChildren: 0.05
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const LinearItem = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <motion.div
      variants={{
        hidden: { 
          opacity: 0, 
          filter: "blur(6px)",
          transform: "translateY(20px)"
        },
        visible: { 
          opacity: 1, 
          filter: "blur(0px)",
          transform: "translateY(0px)"
        }
      }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Clean navigation
const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, userProfile } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/mission", label: "Our mission" },
    { href: "/how-it-works", label: "How it works" },
    { href: "/contact", label: "Contact us" }
  ];

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-white/90 backdrop-blur-2xl border-b border-neutral-200/40 shadow-[0_1px_3px_rgba(0,0,0,0.04)]" 
          : "bg-transparent"
      }`}
    >
      <nav className="flex items-center justify-between p-6 lg:px-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-neutral-900 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span className="text-lg font-semibold text-neutral-900 tracking-tight">Kairoo</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>
        
        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              <Link 
                href="/app" 
                className="px-4 py-2 text-neutral-600 text-[13px] font-medium rounded-lg hover:bg-neutral-50 transition-all duration-200"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white font-semibold text-xs">
                  {userProfile?.displayName?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="px-4 py-2 text-neutral-500 text-[13px] font-medium rounded-lg hover:text-neutral-900 transition-all duration-200"
              >
                Sign in
              </Link>
              <Link 
                href="/signup" 
                className="px-5 py-2.5 bg-neutral-900 text-white text-[13px] font-medium rounded-xl hover:bg-neutral-800 active:scale-[0.98] transition-all duration-200"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  );
};

// HeroSection replaced by compact Hero component

// Practice Feature Section
const PracticeFeatureSection = () => {
  return (
    <section className="py-24 sm:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-neutral-50/30" />
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <LinearReveal delay={0.1}>
            <div className="relative flex justify-center">
              <div className="audio-bars-card">
                <div className="audio-bars-bg"></div>
                <div className="audio-bars-variant">
                  <span className="audio-bar-v2 b1 purple" />
                  <span className="audio-bar-v2 b2 sky" />
                  <span className="audio-bar-v2 b3 fuchsia" />
                  <span className="audio-bar-v2 b4 rose" />
                </div>
              </div>
            </div>
          </LinearReveal>

          <LinearReveal delay={0.2}>
            <div className="space-y-8">
              <div className="space-y-5">
                <p className="text-[13px] font-semibold text-purple-600 uppercase tracking-[0.15em]">Voice practice</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 leading-[1.15] tracking-[-0.02em]">
                  Have a real conversation with AI that listens
                </h2>
              </div>
              
              <p className="text-lg text-neutral-500 leading-relaxed">
                Practice real conversations in a safe space. From casual small talk to important meetings — at your own pace, with no pressure.
              </p>
              
              <div className="space-y-3">
                {[
                  "Voice-based, natural dialogue",
                  "Adapts to your communication style", 
                  "No judgment, ever",
                ].map((feature, index) => (
                  <LinearReveal key={feature} delay={0.3 + index * 0.05}>
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0" />
                      <span className="text-[15px] text-neutral-600">{feature}</span>
                    </div>
                  </LinearReveal>
                ))}
              </div>
            </div>
          </LinearReveal>
        </div>
      </div>
    </section>
  );
};

// Feedback Feature Section
const FeedbackFeatureSection = () => {
  return (
    <section className="py-24 sm:py-32 relative">
      <div className="absolute inset-0 bg-neutral-50/50" />
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <LinearReveal delay={0.1}>
            <div className="space-y-8">
              <div className="space-y-5">
                <p className="text-[13px] font-semibold text-emerald-600 uppercase tracking-[0.15em]">Gentle feedback</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 leading-[1.15] tracking-[-0.02em]">
                  See what you did well. Learn what to try next.
                </h2>
              </div>
              
              <p className="text-lg text-neutral-500 leading-relaxed">
                After each session, get a clear summary — strengths first, then gentle suggestions. No harsh criticism. Just honest, supportive guidance.
              </p>
              
              <div className="space-y-3">
                {[
                  "Strengths highlighted first",
                  "Specific, actionable suggestions", 
                  "Confidence score that grows over time",
                ].map((feature, index) => (
                  <LinearReveal key={feature} delay={0.2 + index * 0.05}>
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0" />
                      <span className="text-[15px] text-neutral-600">{feature}</span>
                    </div>
                  </LinearReveal>
                ))}
              </div>
            </div>
          </LinearReveal>

          <LinearReveal delay={0.2}>
            <div className="relative">
              <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900">Session complete</h3>
                    <p className="text-sm text-neutral-500 mt-0.5">Great work on this one.</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-neutral-900 leading-none">89</div>
                    <div className="text-xs text-neutral-400 mt-1">confidence</div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {[
                    { label: 'Clarity', score: 90 },
                    { label: 'Engagement', score: 83 },
                    { label: 'Tone', score: 95 },
                  ].map((kpi) => (
                    <div key={kpi.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-neutral-700">{kpi.label}</span>
                        <span className="text-sm font-semibold text-neutral-900">{kpi.score}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                        <div className="h-full bg-neutral-900 rounded-full" style={{ width: `${kpi.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    <span className="font-medium text-neutral-900">What went well:</span> You maintained a warm, open tone throughout. Your questions showed genuine curiosity.
                  </p>
                </div>
              </div>
            </div>
          </LinearReveal>
        </div>
      </div>
    </section>
  );
};

// Features section
const FeaturesSection = () => {
  const features = [
    {
      icon: <Bot className="w-5 h-5" />,
      title: "AI conversation partner",
      description: "Practice with AI that creates realistic, context-aware dialogue.",
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      title: "Honest feedback",
      description: "Strengths-first insights that help you grow without harsh criticism.",
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Any scenario",
      description: "Interviews, difficult conversations, small talk — practice what matters to you.",
    },
    {
      icon: <HeadphonesIcon className="w-5 h-5" />,
      title: "Voice-first",
      description: "Speak naturally. The AI adapts to your pace and communication style.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "Private & safe",
      description: "Your conversations stay yours. No data selling. No sharing.",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Visible progress",
      description: "Track confidence over time. Small wins compound into real change.",
    },
  ];

  return (
    <section id="features" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-neutral-950" />
      <div className="absolute inset-0 grain-texture" />
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-600 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-500 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <LinearReveal className="mb-16">
          <div className="max-w-2xl">
            <p className="text-[13px] font-semibold text-purple-400 uppercase tracking-[0.15em] mb-4">Built for growth</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-[-0.02em]">
              Everything you need to practice better conversations
            </h2>
          </div>
        </LinearReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <LinearReveal key={feature.title} delay={index * 0.05}>
              <div className="group p-7 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/[0.1] transition-all duration-500">
                <div className="w-10 h-10 rounded-xl bg-white/[0.08] flex items-center justify-center text-neutral-400 mb-5 group-hover:text-white transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-[15px] text-neutral-400 leading-relaxed">{feature.description}</p>
              </div>
            </LinearReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// Product showcase
const ProductShowcase = () => {
  return (
    <section className="py-24 sm:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-neutral-50/30" />
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <LinearReveal delay={0.1}>
            <div className="space-y-8">
              <div className="space-y-5">
                <p className="text-[13px] font-semibold text-purple-600 uppercase tracking-[0.15em]">See it in action</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 leading-[1.15] tracking-[-0.02em]">
                  Track your growth. Celebrate progress.
                </h2>
              </div>
              <p className="text-lg text-neutral-500 leading-relaxed">
                An intuitive dashboard shows your progress without overwhelming you. Small wins build real confidence.
              </p>
              
              <div className="space-y-3">
                {[
                  "Voice-based conversation practice",
                  "Real-time confidence tracking", 
                  "Personalized feedback",
                ].map((feature, index) => (
                  <LinearReveal key={feature} delay={0.2 + index * 0.05}>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                      <span className="text-[15px] text-neutral-600">{feature}</span>
                    </div>
                  </LinearReveal>
                ))}
              </div>
            </div>
          </LinearReveal>

          <LinearReveal delay={0.2}>
            <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              <Image 
                src="/phil.png"
                alt="Dashboard preview"
                width={1200}
                height={675}
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          </LinearReveal>
        </div>
      </div>
    </section>
  );
};

// Mini Scenarios Section
const ScenariosSection = () => {
  const rowOne = [
    { title: "Telling Stories", tag: "Beginner", emoji: "📚" },
    { title: "Flirting & Compliments", tag: "Social", emoji: "😊" },
    { title: "Job Interview", tag: "Work", emoji: "💻" },
    { title: "Public Transport", tag: "Travel", emoji: "🚆" },
    { title: "Introductions", tag: "Beginner", emoji: "👋" },
  ];
  const rowTwo = [
    { title: "Ordering Food", tag: "Food", emoji: "🌭" },
    { title: "Phone Calls", tag: "Social", emoji: "📞" },
    { title: "Work Routine", tag: "Work", emoji: "☕" },
    { title: "First Date", tag: "Romance", emoji: "🌹" },
    { title: "Presidential Debate", tag: "Debate", emoji: "🎤" },
    { title: "Buying a Gift", tag: "Shopping", emoji: "🛍️" },
  ];

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 to-white" />
      <div className="relative max-w-7xl mx-auto px-6">
        <LinearReveal className="text-center mb-16">
          <div className="space-y-5">
            <p className="text-[13px] font-semibold text-purple-600 uppercase tracking-[0.15em]">Scenarios</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 leading-[1.15] tracking-[-0.02em]">
              Practice for any situation
            </h2>
            <p className="text-lg text-neutral-500 max-w-xl mx-auto">
              Pick a scenario. Practice until it feels natural. Use it in real life.
            </p>
          </div>
        </LinearReveal>

        <div className="space-y-4">
          <div className="marquee-container">
            <div className="marquee-track">
              <div className="marquee-duplicate">
                {[...rowOne, ...rowOne].map((item, i) => (
                  <div
                    key={`r1-${i}-${item.title}`}
                    className="shrink-0 px-5 py-4 bg-white rounded-2xl border border-neutral-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center gap-3"
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <div className="leading-tight text-left">
                      <div className="text-neutral-900 font-semibold text-[15px]">{item.title}</div>
                      <div className="text-neutral-400 text-xs">{item.tag}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="marquee-container">
            <div className="marquee-track reverse">
              <div className="marquee-duplicate">
                {[...rowTwo, ...rowTwo].map((item, i) => (
                  <div
                    key={`r2-${i}-${item.title}`}
                    className="shrink-0 px-5 py-4 bg-white rounded-2xl border border-neutral-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center gap-3"
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <div className="leading-tight text-left">
                      <div className="text-neutral-900 font-semibold text-[15px]">{item.title}</div>
                      <div className="text-neutral-400 text-xs">{item.tag}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// How It Works Preview Section
const HowItWorksPreview = () => {
  const steps = [
    {
      icon: <Compass className="w-5 h-5" />,
      number: "01",
      title: "Pick a scenario",
      description: "Choose any conversation you want to practice"
    },
    {
      icon: <Megaphone className="w-5 h-5" />,
      number: "02",
      title: "Talk with AI",
      description: "Have a natural voice conversation"
    },
    {
      icon: <BadgeCheck className="w-5 h-5" />,
      number: "03",
      title: "See your progress",
      description: "Get feedback and track confidence over time"
    }
  ];

  return (
    <section className="py-24 sm:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-neutral-50/30" />
      <div className="relative max-w-5xl mx-auto px-6">
        <LinearReveal className="text-center mb-16">
          <div className="space-y-5">
            <p className="text-[13px] font-semibold text-purple-600 uppercase tracking-[0.15em]">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-[-0.02em]">
              Three steps. That&apos;s it.
            </h2>
          </div>
        </LinearReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <LinearReveal key={step.title} delay={index * 0.08}>
              <div className="text-center space-y-4">
                <div className="text-5xl font-bold text-neutral-100 select-none tracking-tighter">{step.number}</div>
                <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center text-white mx-auto">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">{step.title}</h3>
                <p className="text-[15px] text-neutral-500 leading-relaxed">{step.description}</p>
              </div>
            </LinearReveal>
          ))}
        </div>

        <LinearReveal delay={0.3}>
          <div className="text-center">
            <Link 
              href="/how-it-works"
              className="inline-flex items-center gap-2.5 px-6 py-3 text-neutral-600 font-medium text-[15px] rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 active:scale-[0.98] transition-all duration-200"
            >
              Learn more
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </LinearReveal>
      </div>
    </section>
  );
};

// Mission Excerpt Section
const MissionExcerpt = () => {
  return (
    <section className="py-24 sm:py-32 relative">
      <div className="absolute inset-0 bg-neutral-50/50" />
      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <LinearReveal>
          <div className="space-y-8">
            <p className="text-[13px] font-semibold text-purple-600 uppercase tracking-[0.15em]">Our mission</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-[-0.02em]">
              Everyone deserves a safe place to find their voice
            </h2>
            <p className="text-lg text-neutral-500 max-w-xl mx-auto leading-relaxed">
              Kairoo is free because practice should be accessible to everyone. No subscriptions. No premium tiers.
            </p>
            <Link 
              href="/mission"
              className="inline-flex items-center gap-2.5 px-6 py-3 text-neutral-600 font-medium text-[15px] rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 active:scale-[0.98] transition-all duration-200"
            >
              Read our mission
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </LinearReveal>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-50/30 to-white" />
      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <LinearReveal>
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-[-0.02em]">
              Start practicing better conversations
            </h2>
            <p className="text-lg text-neutral-500 max-w-xl mx-auto leading-relaxed">
              Free to use. No signup required. Start practicing in 30 seconds.
            </p>
            <div className="flex items-center justify-center gap-6 text-[13px] text-neutral-400">
              <span>Always free</span>
              <span className="w-1 h-1 rounded-full bg-neutral-300" />
              <span>Private</span>
              <span className="w-1 h-1 rounded-full bg-neutral-300" />
              <span>Ready in 30s</span>
            </div>
            <div className="pt-2">
              <Link 
                href="/signup" 
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-neutral-900 text-white font-medium text-[15px] rounded-xl hover:bg-neutral-800 active:scale-[0.98] transition-all duration-200"
              >
                Start practicing
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </LinearReveal>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="border-t border-neutral-200/40">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-neutral-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">K</span>
            </div>
            <span className="text-sm font-semibold text-neutral-900">Kairoo</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/mission" className="text-[13px] text-neutral-400 hover:text-neutral-600 transition-colors">Mission</Link>
            <Link href="/how-it-works" className="text-[13px] text-neutral-400 hover:text-neutral-600 transition-colors">How it works</Link>
            <Link href="/contact" className="text-[13px] text-neutral-400 hover:text-neutral-600 transition-colors">Contact</Link>
          </div>
          <p className="text-[13px] text-neutral-400">© 2024 Kairoo</p>
        </div>
      </div>
    </footer>
  );
};

// Main component with updated sections
export default function Home() {
  useEffect(() => {
    // Smooth scroll behavior
    const handleScroll = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.hash) {
        e.preventDefault();
        const element = document.querySelector(target.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    
    document.addEventListener('click', handleScroll);
    return () => document.removeEventListener('click', handleScroll);
  }, []);

  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <ScenariosSection />
        <HowItWorksPreview />
        <PracticeFeatureSection />
        <FeedbackFeatureSection />
        <FeaturesSection />
        <MissionExcerpt />
        <ProductShowcase />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
