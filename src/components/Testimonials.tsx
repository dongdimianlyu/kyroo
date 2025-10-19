import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

type Testimonial = {
  name: string;
  role: string;
  quote: string;
  avatar?: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Ava",
    role: "Recent grad",
    quote:
      "Kairoo helped me find my voice. I’m less anxious and more myself in conversations.",
    avatar: "/phil.png",
  },
  {
    name: "Jaden",
    role: "Product manager",
    quote:
      "The feedback is gentle and specific. My 1:1s and standups feel smoother already.",
  },
  {
    name: "Maya",
    role: "Designer",
    quote:
      "I practiced tough talks before having them. It changed how I approach conflict.",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, filter: "blur(6px)", y: 20 },
  visible: { opacity: 1, filter: "blur(0px)", y: 0 },
};

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <section className="py-28 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, filter: "blur(6px)", y: 12 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-bold text-neutral-900 tracking-[-0.02em]"
          >
            Loved by people building confidence
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-neutral-600 max-w-2xl mx-auto"
          >
            Real stories about feeling clearer, kinder, and more connected.
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={item}
              transition={{ duration: 0.45 }}
              className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-neutral-200/60 shadow-premium"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center overflow-hidden">
                  {t.avatar ? (
                    <Image src={t.avatar} alt={t.name} width={40} height={40} />
                  ) : (
                    <span className="text-sm font-bold">{t.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{t.name}</p>
                  <p className="text-sm text-neutral-500">{t.role}</p>
                </div>
              </div>
              <blockquote className="text-neutral-700 leading-relaxed">“{t.quote}”</blockquote>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


