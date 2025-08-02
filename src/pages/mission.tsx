import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Heart, Users, Shield, Sparkles } from "lucide-react";

// Reusing the same animation components from index page
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
                link.href === "/mission" 
                  ? "text-purple-700" 
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {link.label}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-600 to-purple-700 transition-all duration-300 ${
                link.href === "/mission" ? "w-full" : "w-0 group-hover:w-full"
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

// Mission content sections
const MissionHero = () => {
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
        {/* Back button */}
        <LinearReveal className="mb-12">
          <Link 
            href="/" 
            className="inline-flex items-center gap-3 text-neutral-600 hover:text-neutral-900 transition-colors duration-200 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-sm font-medium">Back to home</span>
          </Link>
        </LinearReveal>

        {/* Main heading */}
        <div className="text-center space-y-8">
          <LinearTextReveal 
            text="Our Mission"
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.05] tracking-[-0.02em]"
            delay={0.1}
            staggerDelay={0.05}
          />
          
          <LinearReveal delay={0.6}>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full mx-auto"></div>
          </LinearReveal>
        </div>
      </div>
    </section>
  );
};

const MissionContent = () => {
  const values = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Empathy, not ego",
      description: "We serve from below, not above. Real empowerment comes from solidarity, not charity."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Amplify, don't fix",
      description: "You're not broken. We're here to amplify who you are, not change you."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Dignity for all",
      description: "Kairoo is and always will be free. Dignity shouldn't come with a price tag."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-white to-neutral-50">
      <div className="max-w-4xl mx-auto px-6">
        {/* Core mission statement */}
        <div className="text-center mb-20">
          <LinearReveal delay={0.1}>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-[1.2] tracking-[-0.02em] mb-8">
              We don't help. <span className="text-purple-700">We serve.</span>
            </h2>
          </LinearReveal>
          
          <LinearReveal delay={0.3} className="space-y-8">
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Kairoo exists for those who've been told they're awkward, too quiet, too intense, 
              too much — or not enough.
            </p>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              We're not here to "fix" anyone. <strong className="text-gray-900">Because you're not broken.</strong>
            </p>
          </LinearReveal>
        </div>

        {/* Main narrative */}
        <div className="prose prose-lg max-w-none mb-20">
          <LinearReveal delay={0.5}>
            <div className="bg-gradient-to-br from-purple-50 to-purple-25 rounded-3xl p-8 lg:p-12 border border-purple-100">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                <strong className="text-purple-700">Kairoo serves you</strong>, not by changing who you are, 
                but by amplifying who you are.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                We started Kairoo out of something deeply personal. As a founder, I used to think 
                the way to help others was to build efficient systems — optimize, fix, solve. 
                But over time, I realized that <strong className="text-gray-900">love and dignity can't be engineered</strong>. 
                They have to be felt. They have to be offered.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Kairoo was born from that shift. <strong className="text-purple-700">From empathy, not ego.</strong>
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                We don't see you as a user. We see you as someone we serve — from below, not above. 
                Because real empowerment isn't charity. <strong className="text-gray-900">It's solidarity.</strong>
              </p>
            </div>
          </LinearReveal>
        </div>

        {/* Vision section */}
        <div className="text-center mb-20">
          <LinearReveal delay={0.7}>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
              We're building Kairoo so you can walk into any room, interview, date, meeting, 
              or hard conversation — and feel <strong className="text-purple-700">prepared, grounded, and truly yourself.</strong>
            </p>
          </LinearReveal>
          
          <LinearReveal delay={0.9}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-lg text-gray-700 font-medium">Not to impress.</p>
              </div>
              <div>
                <p className="text-lg text-gray-700 font-medium">Not to fake confidence.</p>
              </div>
              <div>
                <p className="text-lg text-purple-700 font-semibold">But to connect. To belong. On your own terms.</p>
              </div>
            </div>
          </LinearReveal>
        </div>

        {/* Values cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {values.map((value, index) => (
            <LinearReveal key={value.title} delay={1.1 + index * 0.1}>
              <div className="group p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-neutral-200/50 shadow-premium hover:shadow-premium-lg hover:-translate-y-1 hover:border-neutral-300/60 transition-all duration-300">
                <div className="flex items-start mb-6">
                  <div className="p-3 bg-purple-100 rounded-2xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white group-hover:shadow-glow-purple transition-all duration-300">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">{value.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{value.description}</p>
              </div>
            </LinearReveal>
          ))}
        </div>

        {/* Final statement */}
        <LinearReveal delay={1.5}>
          <div className="text-center">
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden">
              <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-30" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-25" />
              </div>
              <div className="relative z-10">
                <p className="text-xl font-semibold mb-4">
                  Kairoo is and always will be free.
                </p>
                <p className="text-lg text-neutral-300">
                  Because dignity shouldn't come with a price tag.
                </p>
              </div>
            </div>
          </div>
        </LinearReveal>
      </div>
    </section>
  );
};

// Main mission page component
export default function Mission() {
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
        <MissionHero />
        <MissionContent />
      </main>
    </>
  );
} 