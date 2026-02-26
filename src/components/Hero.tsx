import React from "react";

// Centered hero with animated audio bars
// Uses CSS keyframes defined in globals.css for 60fps, GPU-friendly animation
export default function Hero() {
  return (
    <section className="relative min-h-[110vh] flex flex-col items-center justify-center pt-20 pb-40 rounded-xl" style={{ backgroundImage: 'url("/assets/gradient-BZl8jpii.png")', backgroundSize: 'cover', backgroundPosition: 'center top', backgroundRepeat: 'no-repeat' }}>
      <div className="flex flex-col items-center justify-center gap-y-4 max-w-[90rem] mx-auto w-full py-10 px-2">
        
        <h1 className="eight-title text-center font-medium tracking-tighter text-slate-100 mt-4">
          Meet <span className="landing-text-gradient">Kairoo</span>
        </h1>

        <p className="text-center one-title text-slate-100 max-w-xl mx-auto mt-2">
          Practice conversations with AI. Build confidence. Find your voice.
        </p>

        <div className="relative h-28 sm:h-30 md:h-30 flex items-end justify-center gap-5 sm:gap-6 mt-8">
          <span className="audio-bar audio-bar-1 bg-sky-500" />
          <span className="audio-bar audio-bar-2 bg-amber-500" />
          <span className="audio-bar audio-bar-3 bg-pink-500" />
          <span className="audio-bar audio-bar-4 bg-green-500" />
        </div>
      </div>
    </section>
  );
}


