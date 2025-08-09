import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, MessageCircle, Zap, TrendingUp, ArrowRight } from "lucide-react";

// Reusing the same animation components
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

// Navigation component
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
        
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, index) => (
            <Link 
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-200 relative group ${
                link.href === "/how-it-works" 
                  ? "text-purple-700" 
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {link.label}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-600 to-purple-700 transition-all duration-300 ${
                link.href === "/how-it-works" ? "w-full" : "w-0 group-hover:w-full"
              }`}></span>
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

// How it works content
const HowItWorksHero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 200]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-25 via-white to-neutral-50">
      {/* Background decoration */}
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

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20">
        <LinearReveal className="mb-12">
          <Link 
            href="/" 
            className="inline-flex items-center gap-3 text-neutral-600 hover:text-neutral-900 transition-colors duration-200 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-sm font-medium">Back to home</span>
          </Link>
        </LinearReveal>

        <div className="text-center space-y-8">
          <LinearTextReveal 
            text="How It Works"
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.05] tracking-[-0.02em]"
            delay={0.1}
            staggerDelay={0.05}
          />
          
          <LinearReveal delay={0.6}>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full mx-auto"></div>
          </LinearReveal>
          
          <LinearReveal delay={0.8}>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Practice makes progress. Choose real scenarios you care about, have natural conversations 
              with your AI coach, and get supportive feedback that builds confidence over time.
            </p>
          </LinearReveal>
        </div>
      </div>
    </section>
  );
};

const HowItWorksContent = () => {
  const steps = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Choose Your Scenario & Start Talking",
      description: "Pick from real-world situations or describe your own. Then have a natural conversation with your AI practice partner.",
      step: "01",
      examples: [
        "Practice asking for a raise in your next review",
        "Rehearse introducing yourself at networking events", 
        "Work on difficult conversations with family members"
      ],
      imagePlaceholder: "/conversation-mockup.svg"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Get Instant, Gentle Feedback",
      description: "After each exchange, see personalized insights that highlight what you did well and suggest improvements.",
      step: "02", 
      examples: [
        "\"Great job staying calm and asking clarifying questions\"",
        "\"Try pausing before responding to show you're listening\"",
        "\"Your enthusiasm came through clearly in your tone\""
      ],
      imagePlaceholder: "/dashboard-mockup.svg"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Track Your Progress Over Time",
      description: "See your confidence grow through visual progress tracking. Build habits with streaks and celebrate meaningful milestones.",
      step: "03",
      examples: [
        "Weekly confidence score improvements",
        "Conversation length and quality trends",
        "Mastery levels for different scenario types"
      ],
      imagePlaceholder: "/xp-progress-mockup.svg"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-white to-neutral-50">
      <div className="max-w-6xl mx-auto px-6">
        <LinearReveal delay={0.1}>
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.2] tracking-[-0.02em] mb-8">
              Three Simple Steps to <span className="text-purple-700">Better Conversations</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Designed to feel natural and supportive. No complex setups—just choose a scenario and start practicing.
            </p>
          </div>
        </LinearReveal>

        <div className="space-y-24">
          {steps.map((step, index) => (
            <LinearReveal key={step.title} delay={0.3 + index * 0.2}>
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                
                {/* Content Side */}
                <div className={`space-y-8 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center text-white shadow-glow-purple">
                        {step.icon}
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 text-sm font-bold">
                        {step.step}
                      </div>
                    </div>
                    <div className="w-24 h-0.5 bg-gradient-to-r from-purple-300 to-purple-100 hidden lg:block"></div>
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-3xl font-bold text-neutral-900">{step.title}</h3>
                    <p className="text-xl text-neutral-600 leading-relaxed">{step.description}</p>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-purple-25 rounded-2xl p-6 border border-purple-100">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Examples:</h4>
                      <ul className="space-y-3">
                        {step.examples.map((example, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                            <span className="text-gray-700 leading-relaxed">{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Visual Side */}
                <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                    <img 
                      src={step.imagePlaceholder}
                      alt={`Step ${step.step}: ${step.title}`}
                      className="w-full h-auto"
                    />
                  </div>
                </div>

              </div>
            </LinearReveal>
          ))}
        </div>

        {/* Call to Action */}
        <LinearReveal delay={1.2}>
          <div className="text-center mt-24">
            <div className="bg-gradient-to-br from-purple-50 to-purple-25 rounded-3xl p-8 lg:p-12 border border-purple-100">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Ready to Build Your Confidence?
              </h3>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands who practice a few minutes a day and see real improvements in their conversations.
              </p>
              
              {/* Benefits grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-lg">✓</span>
                  </div>
                  <p className="text-gray-700 font-medium">100% Free</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-lg">✓</span>
                  </div>
                  <p className="text-gray-700 font-medium">Private & Safe</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-lg">✓</span>
                  </div>
                  <p className="text-gray-700 font-medium">Start Immediately</p>
                </div>
              </div>
              
              <Link 
                href="/onboarding"
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold text-lg rounded-2xl shadow-glow-purple hover:from-purple-700 hover:to-purple-800 hover:shadow-glow-purple-lg active:scale-95 transition-all duration-200"
              >
                Start Free Practice Now
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </LinearReveal>
      </div>
    </section>
  );
};

export default function HowItWorks() {
  useEffect(() => {
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
        <HowItWorksHero />
        <HowItWorksContent />
      </main>
    </>
  );
} 