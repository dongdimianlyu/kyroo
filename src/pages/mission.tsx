import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, Heart, Users, Shield, Lock, Globe } from "lucide-react";

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
}: { 
  children: React.ReactNode, delay?: number, className?: string, y?: number
}) => {
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
              className={`text-[13px] font-medium transition-colors duration-200 ${
                link.href === "/mission" 
                  ? "text-neutral-900" 
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        
        <Link 
          href="/onboarding" 
          className="px-5 py-2.5 bg-neutral-900 text-white text-[13px] font-medium rounded-xl hover:bg-neutral-800 active:scale-[0.98] transition-all duration-200"
        >
          Get started
        </Link>
      </nav>
    </motion.header>
  );
};

const MissionHero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 via-white to-white" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)', backgroundSize: '32px 32px' }} />
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
            <p className="text-[13px] font-semibold text-purple-600 uppercase tracking-[0.15em]">Our mission</p>
          </LinearReveal>
          
          <LinearTextReveal 
            text="Everyone deserves a safe place to find their voice."
            className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-neutral-900 leading-[1.12] tracking-[-0.03em]"
            delay={0.15}
            staggerDelay={0.025}
          />

          <LinearReveal delay={0.5}>
            <p className="text-lg sm:text-xl text-neutral-500 max-w-2xl leading-relaxed">
              Kairoo is a free, open tool for practicing conversations. No subscriptions. No premium tiers. Just a quiet space to grow.
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
      icon: <Heart className="w-5 h-5" />,
      title: "Empathy first",
      description: "We don't fix people. We create space for them to practice being themselves, more clearly."
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Accessible to all",
      description: "No paywalls. No premium features. If you need it, you can use it. That's it."
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Private by default",
      description: "Your conversations stay yours. We don't sell data. We don't share sessions. Ever."
    }
  ];

  const quotes = [
    {
      text: "I used to rehearse everything in my head for hours before saying it out loud. Now I just... practice here first. It sounds small but it changed a lot for me.",
      author: "S.",
      context: "has social anxiety"
    },
    {
      text: "Nobody in my family really talks about feelings. I didn't know how to start hard conversations. This gave me a way to try without the stakes.",
      author: "R.",
      context: "college student"
    },
    {
      text: "I'm autistic and I've always struggled with small talk. Not because I don't care, but because the rules never made sense to me. Practicing here helped me figure out my own way of doing it.",
      author: "T.",
      context: "early user"
    },
    {
      text: "I got laid off and had to start interviewing again after 8 years. I was terrified. I practiced here every night for two weeks. Got an offer on my third interview.",
      author: "D.",
      context: "career changer"
    }
  ];

  return (
    <>
      {/* Why section */}
      <section className="py-24 sm:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-neutral-50/50 to-white" />
        <div className="relative max-w-3xl mx-auto px-6">
          <LinearReveal>
            <div className="space-y-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-[-0.02em]">
                Why this exists
              </h2>
              <div className="space-y-6 text-lg text-neutral-600 leading-relaxed">
                <p>
                  Communication shapes everything — relationships, careers, self-worth. But not everyone gets the same chance to practice it.
                </p>
                <p>
                  Some people grow up in homes where hard conversations just don't happen. Others deal with anxiety that makes every interaction feel like a test. Some are navigating a new culture, a new language, or a brain that processes social cues differently.
                </p>
                <p className="text-neutral-900 font-medium">
                  We built Kairoo because we've been there. And we think the solution is simple: give people a private, pressure-free space to practice the conversations that matter to them.
                </p>
              </div>
            </div>
          </LinearReveal>
        </div>
      </section>

      {/* Quotes section */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-neutral-950" />
        <div className="absolute inset-0 grain-texture" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-purple-500 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <LinearReveal>
            <p className="text-[13px] font-semibold text-purple-400 uppercase tracking-[0.15em] mb-4">From real people</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-[-0.02em] mb-16">
              In their own words
            </h2>
          </LinearReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quotes.map((quote, index) => (
              <LinearReveal key={index} delay={0.1 + index * 0.08}>
                <div className="group relative bg-white/[0.04] backdrop-blur-sm rounded-2xl p-8 border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/[0.1] transition-all duration-500">
                  <div className="absolute top-6 left-8 text-5xl font-serif text-white/10 leading-none select-none">&ldquo;</div>
                  <blockquote className="relative z-10 text-[15px] text-neutral-300 leading-relaxed mb-6 pt-4">
                    {quote.text}
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/[0.08] border border-white/[0.1] flex items-center justify-center">
                      <span className="text-xs font-semibold text-neutral-400">{quote.author}</span>
                    </div>
                    <span className="text-[13px] text-neutral-500">{quote.context}</span>
                  </div>
                </div>
              </LinearReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values section */}
      <section className="py-24 sm:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-neutral-50/30" />
        <div className="relative max-w-5xl mx-auto px-6">
          <LinearReveal>
            <div className="max-w-2xl mb-16">
              <p className="text-[13px] font-semibold text-purple-600 uppercase tracking-[0.15em] mb-4">What we believe</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-[-0.02em]">
                Built on principles, not profit
              </h2>
            </div>
          </LinearReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <LinearReveal key={value.title} delay={0.1 + index * 0.08}>
                <div className="group p-8 bg-white rounded-2xl border border-neutral-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-neutral-200 hover:-translate-y-0.5 transition-all duration-500">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-600 mb-6 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">{value.title}</h3>
                  <p className="text-[15px] text-neutral-500 leading-relaxed">{value.description}</p>
                </div>
              </LinearReveal>
            ))}
          </div>
        </div>
      </section>

      {/* What this means in practice */}
      <section className="py-24 sm:py-32 relative">
        <div className="absolute inset-0 bg-neutral-50/50" />
        <div className="relative max-w-3xl mx-auto px-6">
          <LinearReveal>
            <div className="space-y-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-[-0.02em]">
                What this means in practice
              </h2>
              <div className="space-y-6">
                {[
                  { icon: <Globe className="w-4 h-4" />, title: "Completely free", desc: "No trials, no credit cards, no \"upgrade to unlock\" prompts. Every feature is available to every person." },
                  { icon: <Lock className="w-4 h-4" />, title: "Your data stays yours", desc: "We don't sell your conversations. We don't train on your sessions. Your practice is private." },
                  { icon: <Heart className="w-4 h-4" />, title: "Gentle by design", desc: "Feedback focuses on what you did well first. Growth suggestions are framed as opportunities, not failures." },
                  { icon: <Users className="w-4 h-4" />, title: "Built by people who get it", desc: "We're not building this from the outside looking in. We understand what it's like to struggle with communication." }
                ].map((item, index) => (
                  <LinearReveal key={item.title} delay={0.05 + index * 0.06}>
                    <div className="flex gap-5 p-5 rounded-xl bg-white border border-neutral-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition-all duration-300">
                      <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-500 flex-shrink-0 mt-0.5">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-900 mb-1">{item.title}</h4>
                        <p className="text-[15px] text-neutral-500 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </LinearReveal>
                ))}
              </div>
            </div>
          </LinearReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-50/30 to-white" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <LinearReveal>
            <div className="space-y-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-[-0.02em]">
                Practice changes things.
              </h2>
              <p className="text-lg text-neutral-500 max-w-xl mx-auto leading-relaxed">
                You don't need to be ready. You just need to start. Kairoo is free, private, and here whenever you are.
              </p>
              <div className="pt-2">
                <Link 
                  href="/onboarding"
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
    </>
  );
};

export default function Mission() {
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