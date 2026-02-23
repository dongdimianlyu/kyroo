import React from "react";

// Centered hero with animated audio bars
// Uses CSS keyframes defined in globals.css for 60fps, GPU-friendly animation
export default function Hero() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center px-6">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-neutral-50 via-white to-white" />
      <div className="absolute inset-0 -z-10 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      <div className="w-full max-w-4xl mx-auto text-center flex flex-col items-center justify-center gap-8 sm:gap-10">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-neutral-900 tracking-[-0.03em] leading-[1.08]">
          Meet Kairoo
        </h1>

        <div className="relative h-28 sm:h-30 md:h-30 flex items-end justify-center gap-5 sm:gap-6">
          <span className="audio-bar audio-bar-1 bg-sky-500" />
          <span className="audio-bar audio-bar-2 bg-amber-500" />
          <span className="audio-bar audio-bar-3 bg-pink-500" />
          <span className="audio-bar audio-bar-4 bg-green-500" />
        </div>

        <p className="text-lg sm:text-xl text-neutral-500 max-w-xl leading-relaxed">
          Practice conversations with AI. Build confidence. Find your voice.
        </p>
      </div>
    </section>
  );
}


