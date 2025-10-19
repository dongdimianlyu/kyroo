import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mic2, MessageCircle, Sparkles } from "lucide-react";

const stepContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const stepItem = {
  hidden: { opacity: 0, filter: "blur(6px)", y: 20 },
  visible: { opacity: 1, filter: "blur(0px)", y: 0 },
};

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-120px" });

  const steps = [
    { icon: <Mic2 className="w-5 h-5" />, title: "Speak to Kairoo", desc: "Talk naturally by voice or text" },
    { icon: <MessageCircle className="w-5 h-5" />, title: "Get feedback instantly", desc: "Clarity, tone, empathy notes" },
    { icon: <Sparkles className="w-5 h-5" />, title: "Build confidence over time", desc: "Track progress session by session" },
  ];

  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, filter: "blur(6px)", y: 12 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-bold text-neutral-900 tracking-[-0.02em]"
          >
            How it works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-neutral-600 max-w-2xl mx-auto"
          >
            Simple, guided practice designed to help you grow.
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          variants={stepContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
        >
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              variants={stepItem}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="text-center"
            >
              <div className="flex justify-center mb-5">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center text-white shadow-glow-purple">
                    {s.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 text-sm font-bold">
                    {i + 1}
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-neutral-900">{s.title}</h3>
              <p className="text-neutral-600 mt-2">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


