import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, MessageCircle, Zap, TrendingUp } from "lucide-react";

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
              Kairoo is a focused practice environment. Describe a scenario, hold a natural
              conversation with AI, then review clear, gentle feedback. Repeat to build real skill.
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
      title: "Start a conversation",
      description: "Describe the situation you want to practice. Speak or type—your partner adapts in real time.",
      step: "01"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Get fast, kind feedback",
      description: "After each exchange, see concise insights that highlight strengths and next steps.",
      step: "02"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Track meaningful progress",
      description: "See trends over time and focus on consistency. Small, repeated reps compound into confidence.",
      step: "03"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-white to-neutral-50">
      <div className="max-w-6xl mx-auto px-6">
        <LinearReveal delay={0.1}>
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.2] tracking-[-0.02em] mb-8">
              Simple steps to <span className="text-purple-700">steady growth</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Designed to be calm and efficient. Minimal controls, clear guidance, and just enough structure to keep you moving.
            </p>
          </div>
        </LinearReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <LinearReveal key={step.title} delay={0.3 + index * 0.1}>
              <div className="relative">
                {/* Step connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-purple-200 to-transparent z-0"></div>
                )}
                
                <div className="relative z-10 group p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-neutral-200/50 shadow-premium hover:shadow-premium-lg hover:-translate-y-2 hover:border-neutral-300/60 transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center text-white group-hover:shadow-glow-purple transition-all duration-300">
                        {step.icon}
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 text-sm font-bold">
                        {step.step}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4">{step.title}</h3>
                  <p className="text-neutral-600 leading-relaxed text-lg">{step.description}</p>
                </div>
              </div>
            </LinearReveal>
          ))}
        </div>

        <LinearReveal delay={0.8}>
          <div className="text-center mt-20">
            <div className="bg-gradient-to-br from-purple-50 to-purple-25 rounded-3xl p-8 lg:p-12 border border-purple-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to begin?
              </h3>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Join people who practice a few minutes a day and see compounding results.
              </p>
              <Link 
                href="/onboarding"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-2xl shadow-glow-purple hover:from-purple-700 hover:to-purple-800 hover:shadow-glow-purple-lg active:scale-95 transition-all duration-200"
              >
                Begin practicing conversations
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