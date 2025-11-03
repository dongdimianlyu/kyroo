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
          ? "bg-white/95 backdrop-blur-xl border-b border-neutral-200/50 shadow-premium" 
          : "bg-transparent"
      }`}
    >
      <nav className="flex items-center justify-between p-6 lg:px-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-glow-purple">
            <span className="text-white font-bold text-lg">K</span>
          </div>
          <span className="text-xl font-bold text-neutral-900 tracking-tight">Kairoo</span>
        </Link>
        
        {/* Navigation Links - Using golden ratio proportions for spacing */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, index) => (
            <Link 
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors duration-200 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-purple-700 group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </div>
        
        {/* Authentication buttons */}
        <div className="flex items-center gap-4">
          {currentUser ? (
            <>
              <Link 
                href="/app" 
                className="px-6 py-2.5 text-purple-600 text-sm font-medium rounded-xl hover:bg-purple-50 transition-all duration-200"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {userProfile?.displayName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-neutral-700 hidden sm:block">
                  {userProfile?.displayName || 'User'}
                </span>
              </div>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="px-6 py-2.5 text-neutral-600 text-sm font-medium rounded-xl hover:bg-neutral-50 transition-all duration-200"
              >
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-semibold rounded-2xl hover:from-purple-700 hover:to-purple-800 hover:shadow-glow-purple-lg active:scale-95 transition-all duration-200"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  );
};

// HeroSection replaced by compact Hero component

// Practice Feature Section - First part with orb
const PracticeFeatureSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Animated audio bars card (matches hero aesthetic) */}
          <LinearReveal delay={0.2}>
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

          {/* Right side - Explanation */}
          <LinearReveal delay={0.4}>
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 rounded-full bg-purple-50 border border-purple-200 p-1 pr-4 text-sm font-medium text-purple-700">
                  <span className="rounded-full bg-purple-600 px-3 py-1 text-white text-xs font-medium">Step 1</span>
                  <span>Practice with AI</span>
                </div>
                
                <LinearTextReveal 
                  text="Start a conversation"
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.2] tracking-[-0.02em]"
                  staggerDelay={0.02}
                />
                
                <LinearTextReveal 
                  text="with your AI practice partner"
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-700 leading-[1.2] tracking-[-0.02em]"
                  delay={0.3}
                  staggerDelay={0.02}
                />
              </div>
              
              <div className="space-y-6">
                <p className="text-xl text-gray-600 leading-relaxed">
                  Meet your understanding AI companion. Practice real conversations in a 
                  safe space where you can explore different scenarios, from casual small talk 
                  to important meetings.
                </p>
                
                <div className="space-y-4">
                  {[
                    "Voice-based natural conversations",
                    "Scenarios tailored to your needs", 
                    "No pressure, no judgment",
                    "Practice at your own pace"
                  ].map((feature, index) => (
                    <LinearReveal key={feature} delay={0.6 + index * 0.05}>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700 text-lg">{feature}</span>
                      </div>
                    </LinearReveal>
                  ))}
                </div>
              </div>
            </div>
          </LinearReveal>
        </div>
      </div>
    </section>
  );
};

// Feedback Feature Section - Second part with feedback explanation
const FeedbackFeatureSection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-neutral-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Explanation */}
          <LinearReveal delay={0.2}>
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 rounded-full bg-green-50 border border-green-200 p-1 pr-4 text-sm font-medium text-green-700">
                  <span className="rounded-full bg-green-600 px-3 py-1 text-white text-xs font-medium">Step 2</span>
                  <span>Gentle feedback</span>
                </div>
                
                <LinearTextReveal 
                  text="Receive supportive insights"
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.2] tracking-[-0.02em]"
                  staggerDelay={0.02}
                />
                
                <LinearTextReveal 
                  text="and celebrate your progress"
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-700 leading-[1.2] tracking-[-0.02em]"
                  delay={0.3}
                  staggerDelay={0.02}
                />
              </div>
              
              <div className="space-y-6">
                <p className="text-xl text-gray-600 leading-relaxed">
                  After each practice session, Kairoo provides gentle, constructive insights 
                  focused on your strengths and opportunities for growth. No harsh criticism—just 
                  supportive guidance to help you improve.
                </p>
                
                <div className="space-y-4">
                  {[
                    "Highlights what you did well",
                    "Gentle suggestions for improvement", 
                    "Confidence tracking over time",
                    "Personalized growth insights"
                  ].map((feature, index) => (
                    <LinearReveal key={feature} delay={0.4 + index * 0.05}>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700 text-lg">{feature}</span>
                      </div>
                    </LinearReveal>
                  ))}
                </div>
              </div>
            </div>
          </LinearReveal>

                     {/* Right side - Improved feedback interface */}
          <LinearReveal delay={0.4}>
            <div className="relative flex justify-center">
              <div className="relative w-full max-w-2xl">
                {/* Redesigned KPI-style summary */}
                <div className="bg-white rounded-3xl shadow-2xl border border-neutral-200 p-10">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <h3 className="text-3xl font-bold text-neutral-900">Practice Complete!</h3>
                      <p className="text-neutral-500 mt-1">Here's your performance summary.</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-extrabold text-purple-600 leading-none">89</div>
                      <div className="text-sm text-neutral-500">Overall</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { label: 'Grammar', score: 90, color: 'from-blue-400 to-blue-500' },
                      { label: 'Vocabulary', score: 86, color: 'from-fuchsia-400 to-fuchsia-500' },
                      { label: 'Engagement', score: 83, color: 'from-amber-400 to-amber-500' },
                      { label: 'Relevancy', score: 95, color: 'from-rose-400 to-rose-500' },
                    ].map((kpi) => (
                      <div key={kpi.label} className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-neutral-800">{kpi.label}</span>
                          <span className="font-bold text-neutral-900">{kpi.score}</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-neutral-200 overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${kpi.color}`}
                            style={{ width: `${kpi.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Floating tip bubble */}
                  <div className="mt-8 relative">
                    <div className="absolute -left-2 -top-2 w-4 h-4 bg-white rotate-45 border-l border-t border-neutral-200"></div>
                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-md p-4">
                      <div className="font-semibold text-neutral-900 mb-1">Fluency</div>
                      <p className="text-neutral-600 text-sm">
                        Your pace was great, but review <em>te quiero</em> vs. <em>te amo</em> to make your response sound more natural.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Background decoration */}
                <div className="absolute -inset-6 bg-gradient-to-br from-purple-100 via-blue-50 to-pink-50 rounded-3xl blur-3xl opacity-40 -z-10"></div>
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
      icon: <Bot className="w-6 h-6" />,
      title: "AI Conversation Partner",
      description: "Practice with an empathetic AI companion that creates realistic, immersive dialogue experiences.",
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Smart Insights",
      description: "Receive gentle, personalized feedback that highlights your strengths and growth opportunities.",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Scenario Practice",
      description: "Prepare for real-world situations with tailored conversation scenarios and social contexts.",
    },
    {
      icon: <HeadphonesIcon className="w-6 h-6" />,
      title: "Voice-First Experience",
      description: "Natural speech interaction that adapts to your communication style and builds confidence.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Safe Space",
      description: "Practice without judgment in a completely private, secure environment designed for growth.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Growth Analytics",
      description: "Track your communication progress with insights that celebrate every step of your journey.",
    },
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-br from-neutral-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <LinearReveal className="text-center mb-16">
          <div className="space-y-6">
            <p className="text-sm font-semibold text-violet-600 uppercase tracking-wider">
              Practice with purpose
            </p>
            <div className="space-y-1">
              <LinearTextReveal 
                text="Conversation AI that"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-[-0.02em]"
                staggerDelay={0.03}
              />
              <br />
              <LinearTextReveal 
                text="understands social context"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-[-0.02em]"
                delay={0.2}
                staggerDelay={0.03}
              />
            </div>
            <LinearReveal delay={0.2}>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                AI that picks up on emotion, tone, and social cues. Practice conversations that feel real.
              </p>
            </LinearReveal>
          </div>
        </LinearReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <LinearReveal key={feature.title} delay={index * 0.05}>
              <div className="group p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-neutral-200/50 shadow-premium hover:shadow-premium-lg hover:-translate-y-1 hover:border-neutral-300/60 transition-all duration-300">
                <div className="flex items-start mb-6">
                  <div className="p-3 bg-purple-100 rounded-2xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white group-hover:shadow-glow-purple transition-all duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">{feature.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
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
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <LinearReveal className="text-center mb-16">
          <div className="space-y-6">
            <p className="text-sm font-semibold text-violet-600 uppercase tracking-wider">
              See it in action
            </p>
            <div className="space-y-1">
              <LinearTextReveal 
                text="Track your growth,"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-[-0.02em]"
                staggerDelay={0.03}
              />
              <br />
              <LinearTextReveal 
                text="celebrate progress"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-[-0.02em]"
                delay={0.2}
                staggerDelay={0.03}
              />
            </div>
          </div>
        </LinearReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <LinearReveal delay={0.2}>
            <div className="space-y-8">
              <div className="space-y-6">
                <LinearTextReveal 
                  text="An experience designed for growth"
                  className="text-3xl sm:text-4xl font-bold text-gray-900 leading-[1.2] tracking-[-0.02em]"
                  staggerDelay={0.02}
                />
                <LinearReveal delay={0.3}>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Track your conversation skills with an intuitive dashboard that shows 
                    your progress without overwhelming you. Celebrate small wins and build 
                    confidence through consistent practice.
                  </p>
                </LinearReveal>
              </div>
              
              <div className="space-y-4">
                {[
                  "Voice-based conversation practice",
                  "Real-time confidence tracking", 
                  "Personalized feedback and insights",
                  "Safe, judgment-free environment"
                ].map((feature, index) => (
                  <LinearReveal key={feature} delay={0.4 + index * 0.05}>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  </LinearReveal>
                ))}
              </div>
            </div>
          </LinearReveal>

          <LinearReveal delay={0.4}>
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
              <Image 
                src="/phil.png"
                alt="User testimonial"
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
    <section className="py-24 bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500">
      <div className="max-w-7xl mx-auto px-6">
        <LinearReveal className="text-center mb-16">
          <div className="space-y-6">
            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-[1.1] tracking-[-0.02em]">
              Practice conversations for <span className="text-white/90">any situation</span>
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Pick a scenario. Practice until it feels natural. Use it in real life.
            </p>
          </div>
        </LinearReveal>

        {/* Two-row infinite marquee */}
        <div className="space-y-8">
          {/* Row 1 - left to right */}
          <div className="marquee-container">
            <div className="marquee-track">
              {/* duplicate content twice for seamless loop */}
              <div className="marquee-duplicate">
                {[...rowOne, ...rowOne].map((item, i) => (
                  <div
                    key={`r1-${i}-${item.title}`}
                    className="shrink-0 px-6 py-5 bg-white rounded-[28px] shadow-md flex items-center gap-4"
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="leading-tight text-left">
                      <div className="text-neutral-900 font-semibold text-lg">{item.title}</div>
                      <div className="text-neutral-500 text-sm">{item.tag}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2 - right to left */}
          <div className="marquee-container">
            <div className="marquee-track reverse">
              <div className="marquee-duplicate">
                {[...rowTwo, ...rowTwo].map((item, i) => (
                  <div
                    key={`r2-${i}-${item.title}`}
                    className="shrink-0 px-6 py-5 bg-white rounded-[28px] shadow-md flex items-center gap-4"
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="leading-tight text-left">
                      <div className="text-neutral-900 font-semibold text-lg">{item.title}</div>
                      <div className="text-neutral-500 text-sm">{item.tag}</div>
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
      title: "Pick a scenario",
      description: "Choose from 50+ conversation types"
    },
    {
      icon: <Megaphone className="w-5 h-5" />,
      title: "Talk with AI",
      description: "Practice until it feels natural"
    },
    {
      icon: <BadgeCheck className="w-5 h-5" />,
      title: "Get better",
      description: "Become more articulate and connect better in real conversations"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-neutral-50 to-white">
      <div className="max-w-6xl mx-auto px-6">
        <LinearReveal className="text-center mb-16">
          <div className="space-y-6">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-[1.1] tracking-[-0.02em]">
              How it works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose. Practice. Improve. Repeat.
            </p>
          </div>
        </LinearReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <LinearReveal key={step.title} delay={index * 0.1}>
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center text-white shadow-glow-purple">
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-neutral-900">{step.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{step.description}</p>
              </div>
            </LinearReveal>
          ))}
        </div>

        <LinearReveal delay={0.4}>
          <div className="text-center">
            <Link 
              href="/how-it-works"
              className="inline-flex items-center gap-3 px-8 py-4 text-violet-700 font-semibold rounded-2xl border border-violet-200 bg-violet-50 hover:bg-violet-100 hover:border-violet-300 active:scale-95 transition-all duration-200"
            >
              Learn more about our process
              <ArrowRight className="w-5 h-5" />
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
    <section className="py-24 bg-gradient-to-br from-purple-900 to-purple-800 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-25" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <LinearReveal>
          <div className="space-y-8">
            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-[1.1] tracking-[-0.02em]">
              Everyone deserves to be heard
            </h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
              Practice conversations in a space that gets it. No judgment. Just better conversations.
            </p>
            <Link 
              href="/mission"
              className="inline-flex items-center gap-3 px-8 py-4 text-purple-100 font-semibold rounded-2xl border border-purple-300/30 bg-purple-800/50 backdrop-blur-sm hover:bg-purple-700/50 hover:border-purple-200/50 active:scale-95 transition-all duration-200"
            >
              Read our full mission
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </LinearReveal>
      </div>
    </section>
  );
};

// Updated Footer CTA
const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-purple-50 via-white to-neutral-50 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-300 rounded-full blur-3xl opacity-35" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <LinearReveal>
          <div className="space-y-10">
            <div className="space-y-8">
              <div className="space-y-2">
                <LinearTextReveal 
                  text="Start practicing"
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 leading-[1.1] tracking-[-0.02em]"
                  staggerDelay={0.03}
                />
                <br />
                <LinearTextReveal 
                  text="better conversations"
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-purple-700 leading-[1.1] tracking-[-0.02em]"
                  delay={0.2}
                  staggerDelay={0.03}
                />
              </div>
              <LinearReveal delay={0.2}>
                <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                  Free to use. No signup required. Start practicing in 30 seconds.
                </p>
              </LinearReveal>
              
              <LinearReveal delay={0.3}>
                <div className="flex items-center justify-center gap-8 text-sm text-neutral-600 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Always Free</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Private & Secure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Ready in 30s</span>
                  </div>
                </div>
              </LinearReveal>
            </div>
            
            <LinearReveal delay={0.4}>
              <Link 
                href="/signup" 
                className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold text-lg rounded-2xl shadow-glow-purple-lg hover:from-purple-700 hover:to-purple-800 hover:shadow-2xl active:scale-95 transition-all duration-200"
              >
                Start Practicing
                <ArrowRight className="w-6 h-6" />
              </Link>
            </LinearReveal>
          </div>
        </LinearReveal>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-neutral-50 to-white border-t border-neutral-200/50">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <LinearReveal>
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-glow-purple">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-2xl font-bold text-neutral-900">Kairoo</span>
            </div>
            <p className="text-neutral-500 text-base font-medium">© 2024 Kairoo. All rights reserved.</p>
          </div>
        </LinearReveal>
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
