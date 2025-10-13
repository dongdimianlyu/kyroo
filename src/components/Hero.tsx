import React from "react";

// Centered hero with animated audio bars
// Uses CSS keyframes defined in globals.css for 60fps, GPU-friendly animation
export default function Hero() {
  const bars = [0, 1, 2, 3];

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center px-6">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-25 via-white to-neutral-50" />

      <div className="w-full max-w-4xl mx-auto text-center flex flex-col items-center justify-center gap-8 sm:gap-10">
        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-neutral-900 tracking-[-0.02em] leading-[1.05] mb-2">
          Meet Kairoo
        </h1>

        {/* Audio bars */}
        <div className="relative h-28 sm:h-30 md:h-30 flex items-end justify-center gap-5 sm:gap-6">
          <span className="audio-bar audio-bar-1 bg-sky-500" />
          <span className="audio-bar audio-bar-2 bg-amber-500" />
          <span className="audio-bar audio-bar-3 bg-pink-500" />
          <span className="audio-bar audio-bar-4 bg-green-500" />
        </div>

        {/* Subtext */}
        <p className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-2xl mt-2">
          Talk and practice with AI to express yourself and socialize better
        </p>
      </div>
    </section>
  );
}


