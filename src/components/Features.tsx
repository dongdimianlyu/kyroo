import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, MessageCircle, Briefcase, Heart, HandshakeIcon, Presentation } from "lucide-react";

type Category = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const categories: Category[] = [
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "Small talk",
    description: "Warm intros, keeping the flow, ending gracefully",
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "Interviews",
    description: "Tell your story clearly and confidently",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Networking",
    description: "Build rapport and follow up the right way",
  },
  {
    icon: <Presentation className="w-6 h-6" />,
    title: "Presentations",
    description: "Explain ideas with structure and clarity",
  },
  {
    icon: <HandshakeIcon className="w-6 h-6" />,
    title: "Difficult talks",
    description: "Set boundaries and resolve conflicts with care",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Dating",
    description: "Be yourself, ask better questions, connect",
  },
];

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, filter: "blur(6px)", y: 20 },
  visible: { opacity: 1, filter: "blur(0px)", y: 0 },
};

export default function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-28 bg-gradient-to-br from-neutral-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-sm font-semibold text-violet-600 uppercase tracking-wider"
          >
            Practice library
          </motion.p>
          <div className="space-y-2">
            <motion.h2
              initial={{ opacity: 0, filter: "blur(6px)", y: 12 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 tracking-[-0.02em] leading-[1.1]"
            >
              Practice with 200+ real-life social situations
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-neutral-600 max-w-3xl mx-auto"
            >
              From small talk to serious conversations — build confidence one session at a time.
            </motion.p>
          </div>
        </div>

        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {categories.map((c, idx) => (
            <motion.div
              key={c.title}
              variants={item}
              transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1], delay: idx * 0.03 }}
              className="group p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-neutral-200/60 shadow-premium hover:shadow-premium-lg hover:-translate-y-1 hover:border-neutral-300/70 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-2xl bg-violet-100 text-violet-600 group-hover:bg-violet-600 group-hover:text-white group-hover:shadow-glow-purple transition-all duration-300">
                  {c.icon}
                </div>
                <h3 className="text-xl font-bold text-neutral-900">{c.title}</h3>
              </div>
              <p className="text-neutral-600 leading-relaxed">{c.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


