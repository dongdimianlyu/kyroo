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
  Clock
} from "lucide-react";

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
        
        <Link 
          href="/onboarding" 
          className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-semibold rounded-2xl hover:from-purple-700 hover:to-purple-800 hover:shadow-glow-purple-lg active:scale-95 transition-all duration-200"
        >
          Get Started
        </Link>
      </nav>
    </motion.header>
  );
};

// Hero section with redesigned content
const HeroSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 200]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-25 via-white to-neutral-50">
      {/* Background */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-25 via-white to-neutral-50" />
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-40" />
        </div>
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20 text-center">
        <LinearContainer className="space-y-10">
          <LinearItem>
            <div className="inline-flex items-center space-x-2 rounded-full bg-violet-50 border border-violet-200 p-1 pr-4 text-sm font-medium text-violet-700 mb-8">
              <span className="rounded-full bg-violet-600 px-3 py-1 text-white text-xs font-medium">Live Now</span>
              <span>Voice AI that understands social context</span>
            </div>
          </LinearItem>

          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.05] tracking-[-0.02em]">
              <div className="block">
                <LinearTextReveal 
                  text="Practice conversations" 
                  delay={0.05}
                  staggerDelay={0.02}
                />
              </div>
              <div className="block">
                <LinearTextReveal 
                  text="with AI that gets it" 
                  delay={0.15}
                  staggerDelay={0.02}
                />
              </div>
              <div className="block">
                <LinearTextReveal 
                  text="Build confidence, naturally" 
                  delay={0.25}
                  staggerDelay={0.03}
                  className="text-violet-700 font-extrabold"
                />
              </div>
            </h1>
          </div>

          <LinearReveal delay={0.35}>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Voice AI that understands context, picks up on social cues, and gives you feedback that actually helps. No judgment. Just practice.
            </p>
          </LinearReveal>

          {/* Strong CTAs */}
          <LinearReveal delay={0.45} className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <Link 
              href="/onboarding" 
              className="group px-12 py-5 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold text-lg rounded-2xl shadow-glow-purple hover:from-purple-700 hover:to-purple-800 hover:shadow-glow-purple-lg active:scale-95 transition-all duration-200 flex items-center gap-3"
            >
              Start Practicing
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            
            <Link 
              href="/how-it-works" 
              className="group px-10 py-4 text-neutral-700 font-medium rounded-2xl border border-neutral-200/80 bg-white/80 backdrop-blur-sm hover:border-neutral-300 hover:bg-white hover:shadow-md active:scale-95 transition-all duration-200 flex items-center gap-3"
            >
              See How It Works
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </LinearReveal>

          {/* Credibility bar */}
          <LinearReveal delay={0.55}>
            <div className="pt-8">
              <p className="text-sm text-gray-500 mb-6">Used across 15+ countries</p>
              <div className="flex items-center justify-center gap-8 opacity-60">
                <div className="text-sm font-medium text-gray-600">🇺🇸 USA</div>
                <div className="text-sm font-medium text-gray-600">🇬🇧 UK</div>
                <div className="text-sm font-medium text-gray-600">🇨🇦 Canada</div>
                <div className="text-sm font-medium text-gray-600">🇦🇺 Australia</div>
                <div className="text-sm font-medium text-gray-600">🇩🇪 Germany</div>
              </div>
            </div>
          </LinearReveal>
        </LinearContainer>

        {/* Hero visual and testimonial */}
        <LinearReveal delay={0.65}>
          <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* App mockup */}
            <div className="order-2 lg:order-1">
              <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                <img 
                  src="/simulation-coach-mockup.svg" 
                  alt="Kairoo app interface showing conversation practice and feedback"
                  className="w-full h-auto"
                />
              </div>
            </div>
            
            {/* Multiple testimonial cards */}
            <div className="order-1 lg:order-2 space-y-6">
              <div className="bg-gradient-to-br from-violet-50 to-purple-25 rounded-3xl p-6 border border-violet-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    A
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Anonymous User</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-violet-500 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <blockquote className="text-gray-700 leading-relaxed">
                  "This is amazing. I love how it gets the context of conversations — the emotion, the subtopics. Most of my friends struggle with context clues and empathy. ABSOLUTELY FABULOUS!"
                </blockquote>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-25 rounded-3xl p-6 border border-green-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    S
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Beta User</p>
                    <p className="text-sm text-gray-600">Software Engineer</p>
                  </div>
                </div>
                <blockquote className="text-gray-700 leading-relaxed">
                  "No judgment, just practice. My interview nerves are actually gone now."
                </blockquote>
              </div>
            </div>
          </div>
        </LinearReveal>
      </div>
    </section>
  );
};

// Practice Feature Section - First part with orb
const PracticeFeatureSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Orb image */}
          <LinearReveal delay={0.2}>
            <div className="relative flex justify-center">
              <div className="relative w-80 h-80 flex items-center justify-center">
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-blue-50 to-pink-50 rounded-full blur-3xl opacity-60"></div>
                
                {/* Enhanced 3D Gradient Orb */}
                <div className="relative w-72 h-72 bg-white rounded-full flex items-center justify-center shadow-2xl border border-neutral-100">
                  <div className="relative w-64 h-64 rounded-[44%] overflow-hidden shadow-inner">
                    {/* Base gradient foundation */}
                    <div 
                      className="absolute inset-0 rounded-[44%]"
                      style={{
                        background: `
                          linear-gradient(145deg, 
                            rgba(255, 255, 255, 1) 0%,
                            rgba(173, 216, 255, 0.95) 12%,
                            rgba(147, 197, 253, 1) 28%,
                            rgba(129, 140, 248, 1) 45%,
                            rgba(139, 92, 246, 1) 62%,
                            rgba(147, 51, 234, 0.95) 78%,
                            rgba(219, 39, 119, 0.9) 90%,
                            rgba(236, 72, 153, 1) 100%
                          )
                        `,
                        filter: 'saturate(1.1) contrast(1.05)'
                      }}
                    />
                    
                    {/* Depth and dimension layer */}
                    <div 
                      className="absolute inset-0 rounded-[44%]"
                      style={{
                        background: `
                          radial-gradient(ellipse at 20% 20%, rgba(255, 255, 255, 0.9) 0%, transparent 35%),
                          radial-gradient(ellipse at 80% 30%, rgba(173, 216, 255, 0.6) 0%, transparent 40%),
                          radial-gradient(ellipse at 30% 80%, rgba(147, 51, 234, 0.4) 0%, transparent 45%),
                          radial-gradient(ellipse at 70% 85%, rgba(219, 39, 119, 0.3) 0%, transparent 35%)
                        `
                      }}
                    />
                    
                    {/* Primary highlight */}
                    <div 
                      className="absolute inset-0 rounded-[44%]"
                      style={{
                        background: `
                          radial-gradient(ellipse at 28% 25%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.3) 25%, transparent 45%)
                        `
                      }}
                    />
                    
                    {/* Secondary highlights */}
                    <div 
                      className="absolute inset-0 rounded-[44%]"
                      style={{
                        background: `
                          radial-gradient(circle at 65% 20%, rgba(255, 255, 255, 0.7) 0%, transparent 18%),
                          radial-gradient(circle at 75% 45%, rgba(255, 255, 255, 0.5) 0%, transparent 12%),
                          radial-gradient(circle at 20% 70%, rgba(255, 255, 255, 0.4) 0%, transparent 15%)
                        `
                      }}
                    />
                    
                    {/* Subtle edge enhancement */}
                    <div 
                      className="absolute inset-0 rounded-[44%] border-2 border-white/20"
                      style={{
                        boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </div>
                  
                  {/* Floating animation */}
                  <div className="absolute inset-0 animate-pulse-slow">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-200/20 to-pink-200/20 blur-xl"></div>
                  </div>
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
                 {/* Main feedback interface - Made wider and more spacious */}
                 <div className="bg-white rounded-3xl shadow-2xl border border-neutral-200 p-10 space-y-10">
                   {/* Header */}
                   <div className="text-center space-y-4">
                     <h3 className="text-3xl font-bold text-gray-900">Practice Complete!</h3>
                     <p className="text-gray-500 text-lg">Here's your performance summary.</p>
                   </div>
                   
                   {/* Circular Progress */}
                   <div className="flex justify-center">
                     <div className="relative w-40 h-40">
                       <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
                         {/* Background circle */}
                         <circle
                           cx="50"
                           cy="50"
                           r="40"
                           stroke="#e5e7eb"
                           strokeWidth="6"
                           fill="none"
                         />
                         {/* Progress circle */}
                         <circle
                           cx="50"
                           cy="50"
                           r="40"
                           stroke="url(#progressGradient)"
                           strokeWidth="6"
                           fill="none"
                           strokeLinecap="round"
                           strokeDasharray={`${75 * 2.51} ${100 * 2.51}`}
                         />
                         <defs>
                           <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                             <stop offset="0%" stopColor="#8b5cf6" />
                             <stop offset="100%" stopColor="#a855f7" />
                           </linearGradient>
                         </defs>
                       </svg>
                       <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-3xl font-bold text-purple-600">75%</span>
                       </div>
                     </div>
                   </div>
                   
                   <div className="text-center">
                     <h4 className="text-xl font-semibold text-gray-800">Conversation Smoothness</h4>
                   </div>
                   
                   {/* Feedback sections - Improved layout */}
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     {/* What Went Well */}
                     <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                       <div className="flex items-center mb-6">
                         <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                           <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                           </svg>
                         </div>
                         <h5 className="text-lg font-semibold text-gray-900">What Went Well</h5>
                       </div>
                       <p className="text-gray-700 leading-relaxed">
                         Great job initiating the conversation and suggesting a specific lunch place! Your playful "two sides" response added personality and made it engaging.
                       </p>
                     </div>
                     
                     {/* Focus Areas */}
                     <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                       <div className="flex items-center mb-6">
                         <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                           <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                           </svg>
                         </div>
                         <h5 className="text-lg font-semibold text-gray-900">Focus Areas for Next Time</h5>
                       </div>
                       <div className="space-y-4">
                         <div className="flex items-start">
                           <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                           <p className="text-gray-700">
                             Keep responses on topic for better flow
                           </p>
                         </div>
                         <div className="flex items-start">
                           <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                           <p className="text-gray-700">
                             Ask about their preferences too
                           </p>
                         </div>
                       </div>
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
  const scenarios = [
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "Interview prep that works",
      description: "Practice responses until they feel natural. Walk in confident."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Small talk that flows",
      description: "Learn to read social cues and keep conversations going."
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Speak up in meetings",
      description: "Practice expressing ideas clearly before it counts."
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Connect with new people",
      description: "Build conversation skills that transfer to any social setting."
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <LinearReveal className="text-center mb-16">
          <div className="space-y-6">
                          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-[1.1] tracking-[-0.02em]">
                Practice conversations for 
                <span className="text-violet-700"> any situation</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Pick a scenario. Practice until it feels natural. Use it in real life.
              </p>
          </div>
        </LinearReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {scenarios.map((scenario, index) => (
            <LinearReveal key={scenario.title} delay={index * 0.1}>
              <div className="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-neutral-200/50 shadow-premium hover:shadow-premium-lg hover:-translate-y-1 hover:border-neutral-300/60 transition-all duration-300 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-violet-100 rounded-2xl text-violet-600 group-hover:bg-violet-600 group-hover:text-white group-hover:shadow-glow-purple transition-all duration-300">
                    {scenario.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-3">{scenario.title}</h3>
                <p className="text-neutral-600 leading-relaxed text-sm">{scenario.description}</p>
              </div>
            </LinearReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// How It Works Preview Section
const HowItWorksPreview = () => {
  const steps = [
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: "Pick a scenario",
      description: "Choose from 50+ conversation types"
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      title: "Talk with AI",
      description: "Practice until it feels natural"
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Get better",
      description: "See confidence improve with each session"
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
    <section className="py-24 bg-gradient-to-br from-neutral-900 to-neutral-800 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-25" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <LinearReveal>
          <div className="space-y-10">
            <div className="space-y-8">
              <div className="space-y-2">
                <LinearTextReveal 
                  text="Start practicing"
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-[-0.02em]"
                  staggerDelay={0.03}
                />
                <br />
                <LinearTextReveal 
                  text="better conversations"
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-[-0.02em]"
                  delay={0.2}
                  staggerDelay={0.03}
                />
              </div>
              <LinearReveal delay={0.2}>
                <p className="text-xl text-neutral-300 max-w-3xl mx-auto leading-relaxed">
                  Free to use. No signup required. Start practicing in 30 seconds.
                </p>
              </LinearReveal>
              
              <LinearReveal delay={0.3}>
                <div className="flex items-center justify-center gap-8 text-sm text-neutral-400 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Always Free</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Private & Secure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Ready in 30s</span>
                  </div>
                </div>
              </LinearReveal>
            </div>
            
            <LinearReveal delay={0.4}>
              <Link 
                href="/onboarding" 
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
        <HeroSection />
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
