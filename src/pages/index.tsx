import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { 
  MessageCircle, 
  TrendingUp, 
  Users, 
  Sparkles, 
  ArrowRight, 
  CheckCircle,
  Mic,
  Brain,
  Shield,
  Zap
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

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm" 
          : "bg-transparent"
      }`}
    >
      <nav className="flex items-center justify-between p-6 lg:px-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span className="text-xl font-semibold text-gray-900 tracking-tight">Kairoo</span>
        </Link>
        
        <Link 
          href="/onboarding" 
          className="px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors duration-300 shadow-lg"
        >
          Get Started
        </Link>
      </nav>
    </motion.header>
  );
};

// Hero section with Linear's precise animations
const HeroSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 200]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Background */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-200 rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-40" />
        </div>
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20 text-center">
        <LinearContainer className="space-y-10">
          <LinearItem>
            <div className="inline-flex items-center space-x-2 rounded-full bg-violet-50 border border-violet-200 p-1 pr-4 text-sm font-medium text-violet-700 mb-8">
              <span className="rounded-full bg-violet-600 px-3 py-1 text-white text-xs font-medium">New</span>
              <span>AI-powered conversation practice</span>
            </div>
          </LinearItem>

          <div className="space-y-2">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.05] tracking-[-0.02em]">
              <div className="block">
                <LinearTextReveal 
                  text="Practice social" 
                  delay={0.1}
                  staggerDelay={0.03}
                />
              </div>
              <div className="block">
                <LinearTextReveal 
                  text="conversations with" 
                  delay={0.3}
                  staggerDelay={0.03}
                />
              </div>
              <div className="block">
                <LinearTextReveal 
                  text="confidence" 
                  delay={0.5}
                  staggerDelay={0.05}
                  className="text-violet-700 font-extrabold"
                />
              </div>
            </h1>
          </div>

          <LinearReveal delay={0.8}>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A growth companion for those who feel misunderstood in social settings. 
              Practice real conversations, receive gentle feedback, and build confidence 
              through immersive simulations—no judgment, just understanding.
            </p>
          </LinearReveal>

          <LinearReveal delay={1.0} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/onboarding" 
              className="group px-8 py-4 bg-gray-900 text-white font-medium rounded-xl shadow-lg hover:bg-gray-800 transition-all duration-300 flex items-center gap-2"
            >
              Start practicing conversations
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            
            <Link 
              href="#features" 
              className="group px-8 py-4 text-gray-700 font-medium rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 flex items-center gap-2"
            >
              How it works
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </LinearReveal>
        </LinearContainer>

        {/* Hero image */}
        <LinearReveal delay={0.9} className="mt-16">
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
              <Image 
                src="/orb.png"
                alt="Kairoo Orb"
                width={1200}
                height={675}
                layout="responsive"
                priority
              />
            </div>
          </div>
        </LinearReveal>
      </div>
    </section>
  );
};

// Features section
const FeaturesSection = () => {
  const features = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Conversation Simulations",
      description: "Practice realistic dialogue simulations with voice interaction that feels immersive, non-clinical, and calming.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-Time Coaching",
      description: "Gentle micro-feedback about tone and social cues, with supportive summaries of what went well.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Real-Life Preparation",
      description: "Prepare for specific upcoming conversations or social events in a safe, supportive environment.",
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Personalized Learning",
      description: "AI adapts to your communication style and helps you practice scenarios that matter most to you.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Privacy First",
      description: "Your conversations are private and secure. Practice without judgment in a safe space.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Progress Tracking",
      description: "Track your confidence growth with insights and analytics that celebrate your progress.",
    },
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <LinearReveal className="text-center mb-16">
          <div className="space-y-6">
            <p className="text-sm font-semibold text-violet-600 uppercase tracking-wider">
              Practice with purpose
            </p>
            <div className="space-y-1">
              <LinearTextReveal 
                text="Everything you need to"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-[-0.02em]"
                staggerDelay={0.03}
              />
              <br />
              <LinearTextReveal 
                text="grow with confidence"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-[-0.02em]"
                delay={0.2}
                staggerDelay={0.03}
              />
            </div>
            <LinearReveal delay={0.4}>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Designed for those who feel misunderstood in social settings and want to practice 
                in a safe, supportive environment.
              </p>
            </LinearReveal>
          </div>
        </LinearReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <LinearReveal key={feature.title} delay={index * 0.05}>
              <div className="group p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="p-3 bg-violet-100 rounded-xl text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
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
                layout="responsive"
              />
            </div>
          </LinearReveal>
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => {
  return (
    <section className="py-24 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <LinearReveal>
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-1">
                <LinearTextReveal 
                  text="You don't have to"
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-[-0.02em]"
                  staggerDelay={0.03}
                />
                <br />
                <LinearTextReveal 
                  text="navigate this alone"
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-[-0.02em]"
                  delay={0.2}
                  staggerDelay={0.03}
                />
              </div>
              <LinearReveal delay={0.4}>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Whether you're preparing for an important conversation, feeling uncertain about 
                  social cues, or wanting to practice expressing yourself clearly, Kairoo is here 
                  to support your growth.
                </p>
              </LinearReveal>
            </div>
            
            <LinearReveal delay={0.6}>
              <Link 
                href="/onboarding" 
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl shadow-lg hover:bg-gray-50 transition-colors duration-300"
              >
                Start your growth journey
                <ArrowRight className="w-5 h-5" />
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
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <LinearReveal>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">Kairoo</span>
            </div>
            <p className="text-gray-500 text-sm">© 2024 Kairoo. All rights reserved.</p>
          </div>
        </LinearReveal>
      </div>
    </footer>
  );
};

// Main component
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
        <FeaturesSection />
        <ProductShowcase />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
