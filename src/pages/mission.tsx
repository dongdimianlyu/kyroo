import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Heart, Users, Shield, Sparkles, Star, Quote } from "lucide-react";

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
            delay={0.05}
            staggerDelay={0.03}
          />
          
          <LinearReveal delay={0.3}>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full mx-auto"></div>
          </LinearReveal>

          <LinearReveal delay={0.4}>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              <strong>We believe everyone deserves to be heard</strong> — and we're building tools to make that reality.
            </p>
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
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Why We Exist */}
        <div className="mb-24">
          <LinearReveal delay={0.05}>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-[1.2] tracking-[-0.02em] mb-12 text-center">
              Why We Exist
            </h2>
          </LinearReveal>
          
          <LinearReveal delay={0.15}>
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-purple-50 to-purple-25 rounded-3xl p-8 lg:p-12 border border-purple-100">
                <p className="text-xl text-gray-700 leading-relaxed mb-6">
                  <strong className="text-purple-700">Communication shapes opportunity.</strong> Yet many brilliant minds never get a fair space to practice. Whether it's social anxiety, cultural differences, neurodivergence, or simply lacking confident role models growing up—countless people stay quiet when they could be contributing.
                </p>
                
                <blockquote className="border-l-4 border-purple-600 pl-6 py-2 my-8">
                  <p className="text-2xl text-gray-800 leading-relaxed font-medium italic">
                    "We've all felt that knot in our stomach before an important conversation."
                  </p>
                </blockquote>
                
                <p className="text-xl text-gray-700 leading-relaxed mb-6">
                  The rehearsing in your head, the worry about saying the wrong thing, the weight of knowing that one interaction could change everything. <strong>You shouldn't have to navigate this alone.</strong>
                </p>
                
                <p className="text-xl text-gray-700 leading-relaxed">
                  Kairoo makes practice accessible—<em>private by default, gentle by design, and structured so progress is visible.</em> Because everyone deserves to feel heard and understood.
                </p>
              </div>

              {/* User quote */}
              <LinearReveal delay={0.25}>
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-premium">
                  <div className="flex items-start space-x-4">
                    <Quote className="w-8 h-8 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                                              <blockquote className="text-lg text-gray-700 leading-relaxed mb-4">
                          "I've struggled with social anxiety my whole life. Traditional therapy helped, but I needed somewhere to actually <em>practice</em> without the pressure of real consequences. Kairoo gave me that safe space."
                        </blockquote>
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                            M
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Maya Chen</p>
                            <p className="text-sm text-gray-600">Beta User, Software Developer</p>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-purple-500 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </LinearReveal>
            </div>
          </LinearReveal>
        </div>

        {/* Our Values */}
                <div className="mb-24">
          <LinearReveal delay={0.35}>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-[1.2] tracking-[-0.02em] mb-12 text-center">
              Our Values
            </h2>
          </LinearReveal>
          
          <LinearReveal delay={0.45}>
            <p className="text-xl text-gray-600 leading-relaxed mb-12 text-center max-w-3xl mx-auto">
              These principles guide every decision we make—from product design to business model.
            </p>
          </LinearReveal>

          {/* Values cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {values.map((value, index) => (
              <LinearReveal key={value.title} delay={0.55 + index * 0.05}>
                <div className="group p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-neutral-200/50 shadow-premium hover:shadow-premium-lg hover:-translate-y-1 hover:border-neutral-300/60 transition-all duration-300 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-purple-100 rounded-2xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white group-hover:shadow-glow-purple transition-all duration-300">
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-4">{value.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{value.description}</p>
                </div>
              </LinearReveal>
            ))}
          </div>

          {/* Values in practice */}
          <LinearReveal delay={0.75}>
            <div className="bg-gradient-to-br from-neutral-50 to-white rounded-3xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                What This Means in Practice
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">💜</span>
                  </div>
                  <p className="text-gray-700 font-medium mb-2">Always Free</p>
                  <p className="text-sm text-gray-600">No paywalls, no premium features. Full access for everyone.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">🔒</span>
                  </div>
                  <p className="text-gray-700 font-medium mb-2">Privacy First</p>
                  <p className="text-sm text-gray-600">Your conversations are private. No sharing, no selling data.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">🤝</span>
                  </div>
                  <p className="text-gray-700 font-medium mb-2">Community Driven</p>
                  <p className="text-sm text-gray-600">Built with and for people who understand the struggle.</p>
                </div>
              </div>
            </div>
          </LinearReveal>
        </div>

        {/* How Kairoo Lives This Mission */}
        <div className="mb-20">
          <LinearReveal delay={0.85}>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-[1.2] tracking-[-0.02em] mb-12 text-center">
              How Kairoo Lives This Mission
            </h2>
          </LinearReveal>
          
          <LinearReveal delay={0.95}>
            <div className="space-y-8">
              <p className="text-xl text-gray-600 leading-relaxed text-center max-w-4xl mx-auto">
                <strong>Kairoo is a focused system for practicing real conversations.</strong> We combine thoughtful AI, clear feedback, and a calm interface so you can grow skills that translate to everyday life.
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left side - features */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Progress Through Practice
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    We believe progress comes from <strong>repetition, reflection, and respect.</strong> No gimmicks. No judgment. Just a professional tool that helps you get better, one conversation at a time.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-purple-600 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                      <div>
                        <p className="font-semibold text-gray-900">Natural Conversations</p>
                        <p className="text-gray-600">Practice conversations that feel natural and respond to your unique communication style</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-purple-600 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                      <div>
                        <p className="font-semibold text-gray-900">Strength-Based Feedback</p>
                        <p className="text-gray-600">Get feedback that highlights what you do well and suggests gentle improvements</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-purple-600 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                      <div>
                        <p className="font-semibold text-gray-900">Confidence Building</p>
                        <p className="text-gray-600">Track progress in a way that builds confidence rather than creating pressure</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-purple-600 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                      <div>
                        <p className="font-semibold text-gray-900">Adaptive Growth</p>
                        <p className="text-gray-600">Access a tool that meets you where you are and grows with you</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - user quote */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-25 rounded-3xl p-8 border border-green-100">
                    <div className="flex items-start space-x-4">
                      <Quote className="w-8 h-8 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <blockquote className="text-lg text-gray-700 leading-relaxed mb-4">
                          "What I love most is that it doesn't try to change who I am. It helps me express myself more clearly, but I still sound like <em>me</em>. That's so important for someone who's been told their whole life to 'just be more outgoing.'"
                        </blockquote>
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                            J
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Jordan Martinez</p>
                            <p className="text-sm text-gray-600">Beta User, Graphic Designer</p>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-green-500 fill-current" />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-25 rounded-3xl p-8 border border-blue-100">
                    <div className="flex items-start space-x-4">
                      <Quote className="w-8 h-8 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <blockquote className="text-lg text-gray-700 leading-relaxed mb-4">
                          "I practiced for weeks before my job interview. When the day came, I felt prepared instead of panicked. I got the job! The interviewer even commented on how well I communicated."
                        </blockquote>
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                            A
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Alex Thompson</p>
                            <p className="text-sm text-gray-600">Beta User, Marketing Manager</p>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-blue-500 fill-current" />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </LinearReveal>
        </div>

        {/* Final statement */}
        <LinearReveal delay={1.05}>
          <div className="text-center">
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden">
              <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-30" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-25" />
              </div>
              <div className="relative z-10 space-y-6">
                <h3 className="text-3xl font-bold mb-4">
                  Join Our Mission
                </h3>
                <p className="text-xl text-neutral-300 mb-6">
                  Kairoo is free to use because practice should be accessible to everyone.
                </p>
                <Link 
                  href="/onboarding"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-neutral-900 font-semibold rounded-2xl shadow-glow-purple-lg hover:bg-neutral-50 hover:shadow-2xl active:scale-95 transition-all duration-200"
                >
                  Start practicing today
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </Link>
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