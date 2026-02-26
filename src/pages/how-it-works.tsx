import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, MessageCircle, Mic, BarChart3, Sparkles } from "lucide-react";

const LinearTextReveal = ({ 
  text, className = "", delay = 0, staggerDelay = 0.05 
}: { text: string, className?: string, delay?: number, staggerDelay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const words = text.split(" ");

  return (
    <div ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: "blur(8px)", transform: "translateY(20%)" }}
          animate={isInView ? { opacity: 1, filter: "blur(0px)", transform: "translateY(0%)" } : { opacity: 0, filter: "blur(8px)", transform: "translateY(20%)" }}
          transition={{ duration: 0.5, delay: delay + (i * staggerDelay), ease: [0.25, 0.1, 0.25, 1] }}
          style={{ display: "inline-block", marginRight: i === words.length - 1 ? "0" : "0.25em" }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

const LinearReveal = ({ 
  children, delay = 0, className = "", y = 20 
}: { children: React.ReactNode, delay?: number, className?: string, y?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, filter: "blur(6px)", transform: `translateY(${y}px)` }}
      animate={isInView ? { opacity: 1, filter: "blur(0px)", transform: "translateY(0px)" } : { opacity: 0, filter: "blur(6px)", transform: `translateY(${y}px)` }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

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
          ? "bg-zinc-950/80 backdrop-blur-xl border-b border-white/5" 
          : "bg-transparent"
      }`}
    >
      <nav className="flex items-center justify-between p-6 lg:px-8 max-w-[90rem] mx-auto w-full">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span className="text-lg font-semibold text-white tracking-tight">Kairoo</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-200 ${
                link.href === "/how-it-works" 
                  ? "text-white" 
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        
        <Link 
          href="/onboarding" 
          className="px-5 py-2.5 bg-white text-zinc-900 text-[13px] font-semibold rounded-xl hover:bg-zinc-100 active:scale-[0.98] transition-all duration-200"
        >
          Get started
        </Link>
      </nav>
    </motion.header>
  );
};

const HowItWorksHero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <div className="absolute inset-0 bg-zinc-950" />
        <div className="absolute top-0 right-0 w-full h-[800px] opacity-20 pointer-events-none" style={{ backgroundImage: 'url("/assets/gradient-BZl8jpii.png")', backgroundSize: '100% 100%', backgroundPosition: 'center', transform: 'rotate(180deg)' }} />
      </motion.div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24">
        <LinearReveal className="mb-16">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-600 transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300" />
            <span className="text-[13px] font-medium">Home</span>
          </Link>
        </LinearReveal>

        <div className="space-y-8">
          <LinearReveal delay={0.1}>
            <p className="text-[13px] font-semibold text-purple-600 uppercase tracking-[0.15em]">How it works</p>
          </LinearReveal>
          
          <LinearTextReveal 
            text="Three steps. No complexity. Just practice."
            className="eight-title font-medium tracking-tighter text-slate-100"
            delay={0.15}
            staggerDelay={0.025}
          />

          <LinearReveal delay={0.5}>
            <p className="one-title text-slate-100 max-w-2xl">
              Describe a situation. Talk it through with AI. See what you did well and where to grow. That&apos;s it.
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
      number: "01",
      icon: <MessageCircle className="w-5 h-5" />,
      title: "Describe your scenario",
      description: "Tell Kairoo what you want to practice. A job interview, a tough conversation with a friend, small talk at a party — anything.",
      details: [
        "Type or describe any real-life situation",
        "Choose your difficulty level and mood",
        "Pick who starts the conversation",
      ]
    },
    {
      number: "02",
      icon: <Mic className="w-5 h-5" />,
      title: "Talk it through",
      description: "Have a real voice conversation with AI that responds naturally. It adapts to your tone, your pace, and the social context of your scenario.",
      details: [
        "Voice-based, natural conversation",
        "AI adjusts to how you're feeling",
        "Practice as many times as you want",
      ]
    },
    {
      number: "03",
      icon: <BarChart3 className="w-5 h-5" />,
      title: "See your progress",
      description: "After each session, get a clear summary of what went well and what to try next time. Track your confidence over time.",
      details: [
        "Strengths highlighted first",
        "Gentle, specific suggestions",
        "Confidence score that grows with practice",
      ]
    }
  ];

  return (
    <>
      {/* Steps section */}
      <section className="py-24 sm:py-32 relative" style={{ backgroundImage: 'url("/assets/gradient-BZl8jpii.png")', backgroundSize: 'cover', backgroundPosition: 'center top', backgroundAttachment: 'fixed', backgroundRepeat: 'no-repeat' }}>
        <div className="absolute inset-0 bg-zinc-950/40" />
        <div className="relative max-w-4xl mx-auto px-6">
          <div className="space-y-20">
            {steps.map((step, index) => (
              <LinearReveal key={step.number} delay={0.05 + index * 0.08}>
                <div className="grid grid-cols-1 lg:grid-cols-[120px_1fr] gap-8 lg:gap-12 items-start">
                  {/* Step number */}
                  <div className="flex lg:flex-col items-center lg:items-start gap-4">
                    <div className="text-6xl lg:text-7xl font-bold text-neutral-100 leading-none select-none tracking-tighter">
                      {step.number}
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center text-white">
                      {step.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-6">
                    <h3 className="text-2xl sm:text-3xl font-bold landing-text-gradient tracking-[-0.02em]">
                      {step.title}
                    </h3>
                    <p className="text-lg text-zinc-400 leading-relaxed max-w-xl">
                      {step.description}
                    </p>
                    <div className="space-y-3 pt-2">
                      {step.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                          <span className="text-[15px] text-zinc-300">{detail}</span>
                        </div>
                      ))}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="pt-8 hidden lg:block">
                        <div className="w-px h-16 bg-gradient-to-b from-zinc-800 to-transparent ml-5" />
                      </div>
                    )}
                  </div>
                </div>
              </LinearReveal>
            ))}
          </div>
        </div>
      </section>

      {/* What makes it different */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <LinearReveal>
            <div className="max-w-2xl mb-16">
              <p className="text-[13px] font-semibold text-purple-400 uppercase tracking-[0.15em] mb-4">Why this works</p>
              <h2 className="text-3xl sm:text-4xl font-bold landing-text-gradient tracking-[-0.02em]">
                Practice is the only thing that actually builds confidence
              </h2>
            </div>
          </LinearReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Sparkles className="w-4 h-4" />, title: "No scripts", desc: "Every conversation is unique. The AI responds to what you actually say, not a pre-written path." },
              { icon: <Mic className="w-4 h-4" />, title: "Voice-first", desc: "Real conversations happen out loud. Typing practice doesn't translate. Speaking practice does." },
              { icon: <BarChart3 className="w-4 h-4" />, title: "Visible progress", desc: "See your confidence score grow over time. Small wins compound into real change." },
            ].map((item, index) => (
              <LinearReveal key={item.title} delay={0.1 + index * 0.08}>
                <div className="p-7 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/[0.1] transition-all duration-500">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.08] flex items-center justify-center text-neutral-400 mb-5">
                    {item.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                  <p className="text-[15px] text-neutral-400 leading-relaxed">{item.desc}</p>
                </div>
              </LinearReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Quick facts */}
      <section className="py-24 sm:py-32 relative">
        <div className="relative max-w-4xl mx-auto px-6">
          <LinearReveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
              {[
                { stat: "5–15 min", label: "Average session" },
                { stat: "100%", label: "Free, always" },
                { stat: "Private", label: "By default" },
              ].map((item, index) => (
                <div key={item.label} className="text-center sm:text-left">
                  <div className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-2">{item.stat}</div>
                  <div className="text-[15px] text-zinc-400">{item.label}</div>
                </div>
              ))}
            </div>
          </LinearReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <LinearReveal>
            <div className="space-y-8">
              <h2 className="text-3xl sm:text-4xl font-bold landing-text-gradient tracking-[-0.02em]">
                Ready to try it?
              </h2>
              <p className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
                Pick a scenario. Start talking. See how it feels. No account needed to begin.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link 
                  href="/onboarding"
                  className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-zinc-900 font-semibold text-[15px] rounded-xl hover:bg-zinc-100 active:scale-[0.98] transition-all duration-200 shadow-lg"
                >
                  Start practicing
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                </Link>
                <Link 
                  href="/mission"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 text-zinc-300 font-medium text-[15px] rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 active:scale-[0.98] transition-all duration-200 shadow-sm"
                >
                  Read our mission
                </Link>
              </div>
            </div>
          </LinearReveal>
        </div>
      </section>
    </>
  );
};

export default function HowItWorks() {
  return (
    <>
      <Navigation />
      <main className="bg-zinc-950 min-h-screen text-white overflow-x-hidden relative" style={{ backgroundImage: 'url("/assets/gradient-BZl8jpii.png")', backgroundSize: 'cover', backgroundPosition: 'center top', backgroundAttachment: 'fixed', backgroundRepeat: 'no-repeat' }}>
        <div className="absolute inset-0 bg-zinc-950/40 pointer-events-none" />
        <div className="relative z-10">
          <HowItWorksHero />
          <HowItWorksContent />
        </div>
      </main>
    </>
  );
} 