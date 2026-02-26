import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Mail, MessageCircle, Heart } from "lucide-react";

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
                link.href === "/contact" 
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

// Contact content
const ContactHero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 200]);
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
            <p className="text-[13px] font-semibold text-purple-600 uppercase tracking-[0.15em]">Contact us</p>
          </LinearReveal>
          
          <LinearTextReveal 
            text="We read every message."
            className="eight-title font-medium tracking-tighter text-slate-100"
            delay={0.15}
            staggerDelay={0.025}
          />

          <LinearReveal delay={0.5}>
            <p className="one-title text-slate-100 max-w-2xl">
              Questions, feedback, or just want to share your story. We&apos;re here and we respond quickly.
            </p>
          </LinearReveal>
        </div>
      </div>
    </section>
  );
};

const ContactContent = () => {
  return (
    <section className="py-24 sm:py-32 relative">
      <div className="relative max-w-3xl mx-auto px-6">
        <LinearReveal delay={0.1}>
          <div className="max-w-xl mx-auto text-center mb-16">
            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 mx-auto mb-6">
              <Mail className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Get in touch</h2>
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              For questions, feedback, or just to share your story.
            </p>
          </div>
        </LinearReveal>

        <LinearReveal delay={0.2}>
          <div className="max-w-md mx-auto mb-16">
            <div className="p-8 bg-zinc-900 rounded-2xl border border-white/10 shadow-2xl text-center">
              <p className="text-lg font-semibold text-white mb-4">jiarenlyu@gmail.com</p>
              <a 
                href="mailto:jiarenlyu@gmail.com"
                className="group inline-flex items-center gap-2.5 px-6 py-3 bg-white text-zinc-900 font-semibold text-[15px] rounded-xl hover:bg-zinc-100 active:scale-[0.98] transition-all duration-200"
              >
                Send us an email
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </LinearReveal>

        <LinearReveal delay={0.3}>
          <div className="text-center">
            <div className="p-8 rounded-2xl bg-zinc-900/50 border border-white/10 backdrop-blur-sm">
              <p className="text-[15px] text-zinc-400 leading-relaxed mb-4">
                We&apos;re building Kairoo with care. Your thoughts help us make it simpler, faster, and more supportive.
              </p>
              <p className="text-sm font-medium text-white">
                — The Kairoo Team
              </p>
            </div>
          </div>
        </LinearReveal>
      </div>
    </section>
  );
};

export default function Contact() {
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
      <main className="bg-zinc-950 min-h-screen text-white overflow-x-hidden relative" style={{ backgroundImage: 'url("/assets/gradient-BZl8jpii.png")', backgroundSize: 'cover', backgroundPosition: 'center top', backgroundAttachment: 'fixed', backgroundRepeat: 'no-repeat' }}>
        <div className="absolute inset-0 bg-zinc-950/40 pointer-events-none" />
        <div className="relative z-10">
          <ContactHero />
          <ContactContent />
        </div>
      </main>
    </>
  );
} 