import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 via-white to-lavender-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-neutral-200/30">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Kairoo</h1>
                <p className="text-xs text-neutral-500 -mt-1 font-medium">Growth Companion</p>
              </div>
            </Link>
            <Link
              href="/app"
              className="button-primary text-base font-semibold"
            >
              Try Kairoo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-16 lg:py-24 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-violet-300/20 to-purple-300/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-warm-300/20 to-lavender-300/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Content */}
            <div className="space-y-8 fade-in-up">
              <div className="space-y-6">
                <div className="inline-flex items-center px-5 py-3 rounded-full bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200/50 text-violet-700 text-sm font-semibold shadow-soft">
                  <span className="w-2 h-2 bg-violet-500 rounded-full mr-3 animate-pulse"></span>
                  Emotionally Safe • Dignity-Preserving • Private
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-neutral-900 tracking-tight leading-[1.1]">
                  Practice social situations with{" "}
                  <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">confidence</span>
                </h1>
                <p className="text-xl text-neutral-600 leading-relaxed max-w-2xl font-light">
                  A growth companion for those who feel misunderstood in social settings. Practice real conversations, 
                  receive gentle feedback, and build confidence through immersive simulations—no judgment, just understanding.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/app"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl hover:from-violet-700 hover:to-purple-700 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
                >
                  Start practicing conversations
                  <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-neutral-700 bg-white/80 backdrop-blur-sm border border-neutral-200/50 rounded-2xl hover:bg-white hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  How it works
                </Link>
              </div>

              <div className="flex items-center space-x-6 pt-4 text-sm text-neutral-500">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-success-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No judgment zone
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-success-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Dignity-preserving growth
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-success-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Real-life preparation
                </div>
              </div>
            </div>

            {/* Right side - Live Orb Demo */}
            <div className="relative fade-in-up-delay-1">
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft-lg border border-neutral-200/50 overflow-hidden floating-animation">
                <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-r from-neutral-100/80 to-neutral-50/80 backdrop-blur-sm flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-error-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-warning-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-success-400 rounded-full"></div>
                </div>
                <div className="pt-10 pb-8 px-8">
                  {/* Demo Orb Component */}
                  <div className="flex flex-col items-center justify-center min-h-[300px] space-y-6">
                    {/* Premium Floating Orb */}
                    <div className="relative">
                      {/* Main Orb Container */}
                      <div className="relative w-32 h-32 group">
                        {/* Outer Glow Layers */}
                        <div className="absolute inset-0 rounded-full opacity-60">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/40 via-purple-400/40 to-pink-400/40 blur-2xl scale-150 animate-pulse-slow"></div>
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-300/30 via-violet-400/30 to-rose-400/30 blur-3xl scale-125 animate-float-glow"></div>
                        </div>
                        
                        {/* Main Orb Sphere - Iridescent Bubble */}
                        <div className="absolute inset-3 rounded-full overflow-hidden bg-gradient-to-br from-white/90 via-cyan-50/80 to-purple-50/70 shadow-2xl border border-white/60 animate-float-gentle">
                          {/* Iridescent Surface Layers */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-200/60 via-transparent via-purple-200/60 via-transparent to-pink-200/60 opacity-70"></div>
                          <div className="absolute inset-0 rounded-full bg-gradient-to-bl from-transparent via-teal-100/40 via-transparent via-violet-100/40 to-transparent"></div>
                          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-100/30 via-transparent via-cyan-100/30 to-purple-100/30 opacity-80"></div>
                          
                          {/* Dynamic Flowing Colors */}
                          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan-200/50 via-purple-200/40 to-pink-200/50 animate-shimmer">
                            {/* Inner Iridescent Shine */}
                            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/60 via-cyan-50/30 via-transparent to-purple-50/20 opacity-80"></div>
                          </div>
                          
                          {/* Bubble-like Light Reflections */}
                          <div className="absolute top-2 left-4 w-8 h-8 rounded-full bg-gradient-to-br from-white/80 via-cyan-100/60 to-transparent blur-sm animate-breathe"></div>
                          <div className="absolute top-4 left-6 w-4 h-4 rounded-full bg-white/90 blur-xs opacity-70"></div>
                          <div className="absolute bottom-6 right-4 w-3 h-6 rounded-full bg-gradient-to-t from-purple-100/50 to-pink-100/30 blur-sm opacity-60"></div>
                        </div>
                        
                        {/* Status Indicator */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse-dot"></div>
                            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse-dot animation-delay-200"></div>
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse-dot animation-delay-400"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Demo Status Text */}
                    <div className="text-center">
                      <p className="text-cyan-600 font-semibold text-sm">Listening attentively...</p>
                      <p className="text-neutral-500 text-xs mt-1">Interactive voice interface</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-gradient-to-br from-violet-200/40 to-purple-200/40 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-warm-200/40 to-lavender-200/40 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="px-6 py-16 bg-gradient-to-br from-neutral-50/50 to-warm-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-4xl font-bold text-neutral-900 mb-6 tracking-tight">
              Practice and grow with confidence
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto font-light leading-relaxed">
              For those who feel misunderstood in social settings, experience loneliness despite wanting connection, 
              or need a safe space to prepare for upcoming conversations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Feature 1 - Conversation Simulations */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-neutral-200/50 card-hover fade-in-up-delay-1">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Conversation Simulations</h3>
              <p className="text-neutral-600 leading-relaxed">
                Describe upcoming or hypothetical social scenarios. Practice realistic dialogue simulations 
                with voice interaction that feels immersive, non-clinical, and calming.
              </p>
            </div>

            {/* Feature 2 - Real-Time Feedback */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-neutral-200/50 card-hover fade-in-up-delay-2">
              <div className="w-14 h-14 bg-gradient-to-br from-success-100 to-success-200 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Real-Time Coaching Insights</h3>
              <p className="text-neutral-600 leading-relaxed">
                XP bar tracks conversation flow smoothly. Gentle, non-overwhelming micro-feedback about 
                tone and social cues, with supportive summaries of what went well and areas to improve.
              </p>
            </div>

            {/* Feature 3 - Scenario-Based Practice */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-neutral-200/50 card-hover fade-in-up-delay-3">
              <div className="w-14 h-14 bg-gradient-to-br from-warm-100 to-warm-200 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-warm-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Real-Life Preparation</h3>
              <p className="text-neutral-600 leading-relaxed">
                Prepare for specific upcoming conversations or social events. Practice in a safe space 
                that helps you express yourself clearly and feel more confident in real interactions.
              </p>
            </div>

            {/* Feature 4 - Adaptive Context Understanding */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-neutral-200/50 card-hover fade-in-up-delay-1">
              <div className="w-14 h-14 bg-gradient-to-br from-lavender-100 to-lavender-200 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-lavender-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Context-Aware Support</h3>
              <p className="text-neutral-600 leading-relaxed">
                Not just general skills, but preparation adapted to your specific real-life situations. 
                Understanding tone, emotional warmth, and helping you navigate social complexity.
              </p>
            </div>

            {/* Feature 5 - Emotionally Safe Environment */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-neutral-200/50 card-hover fade-in-up-delay-2">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Emotional Safety</h3>
              <p className="text-neutral-600 leading-relaxed">
                No fear of judgment, shame, or misunderstanding. You don't feel "fixed"—you feel understood 
                and served. A companion for growth, not therapy.
              </p>
            </div>

            {/* Feature 6 - Voice Interaction */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-neutral-200/50 card-hover fade-in-up-delay-3">
              <div className="w-14 h-14 bg-gradient-to-br from-success-100 to-success-200 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Natural Voice Practice</h3>
              <p className="text-neutral-600 leading-relaxed">
                Practice conversations using your voice in real-time. The AI responds naturally, 
                creating an immersive experience that prepares you for real-world interactions.
              </p>
            </div>
          </div>

          {/* Feature Showcase Images */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* XP Progress System Showcase */}
            <div className="fade-in-up-delay-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-soft-lg border border-neutral-200/50">
                <h3 className="text-2xl font-semibold text-neutral-900 mb-4">Track Your Growth</h3>
                <p className="text-neutral-600 mb-6 leading-relaxed">
                  Watch your social confidence grow with our calming XP system. Every interaction, 
                  simulation, and practice session helps you level up.
                </p>
                <div className="rounded-2xl overflow-hidden shadow-soft bg-white p-6">
                  {/* Real XP Progress Component */}
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-neutral-900">XP Progress</h4>
                    <span className="text-sm text-primary-600">67%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2 mb-4">
                    <div className="bg-primary-600 h-2 rounded-full transition-smooth animate-pulse" style={{ width: '67%' }}></div>
                  </div>
                  <div className="text-sm text-neutral-500">Level 7 • Continue practicing to reach Level 8</div>
                </div>
              </div>
            </div>

            {/* Social Simulation Coach Showcase */}
            <div className="fade-in-up-delay-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-soft-lg border border-neutral-200/50">
                <h3 className="text-2xl font-semibold text-neutral-900 mb-4">Practice Real Scenarios</h3>
                <p className="text-neutral-600 mb-6 leading-relaxed">
                  Simulate upcoming social situations in a safe space. Get coaching insights 
                  and build confidence before the real interaction.
                </p>
                <div className="rounded-2xl overflow-hidden shadow-soft bg-white">
                  {/* Real Practice Scenarios Interface */}
                  <div className="p-6">
                    {/* Scene Description */}
                    <div className="bg-neutral-50 rounded-xl p-4 mb-6">
                      <h4 className="font-semibold text-neutral-900 mb-2 flex items-center">
                        <span className="w-5 h-5 bg-secondary-100 rounded-lg flex items-center justify-center mr-2 text-xs">📍</span>
                        Scene Setting
                      </h4>
                      <p className="text-neutral-600 text-sm italic">You're in the school library working on a group project. Sarah, your teammate, approaches you to discuss the assignment deadline.</p>
                    </div>
                    
                    {/* Orb Interface */}
                    <div className="flex flex-col items-center space-y-4">
                      {/* Premium Floating Orb - Smaller for showcase */}
                      <div className="relative">
                        <div className="relative w-20 h-20 group">
                          {/* Outer Glow */}
                          <div className="absolute inset-0 rounded-full opacity-60">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/40 via-pink-400/40 to-violet-400/40 blur-xl scale-150 animate-pulse-slow"></div>
                          </div>
                          
                          {/* Main Orb */}
                          <div className="absolute inset-2 rounded-full overflow-hidden bg-gradient-to-br from-white/90 via-purple-50/80 to-pink-50/70 shadow-xl border border-white/60 animate-float-gentle">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-200/60 via-transparent to-pink-200/60 opacity-70"></div>
                            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-purple-200/50 via-pink-200/40 to-violet-200/50 animate-shimmer">
                              <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/60 via-purple-50/30 to-transparent opacity-80"></div>
                            </div>
                            <div className="absolute top-1 left-2 w-4 h-4 rounded-full bg-gradient-to-br from-white/80 via-purple-100/60 to-transparent blur-sm animate-breathe"></div>
                          </div>
                          
                          {/* Speaking indicator */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse-dot"></div>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-purple-600 font-medium text-sm">Kairoo is speaking...</p>
                      
                      {/* Sample conversation bubble */}
                      <div className="bg-neutral-50 rounded-xl p-3 max-w-xs">
                        <p className="text-neutral-700 text-sm">"Hey! I wanted to check in about our project timeline. Do you think we're on track for the deadline?"</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Purpose Section */}
      <section className="px-6 py-16 bg-gradient-to-br from-white to-lavender-50/30">
        <div className="max-w-4xl mx-auto text-center fade-in-up">
          <div className="bg-gradient-to-br from-violet-50/80 to-purple-50/80 backdrop-blur-sm rounded-4xl p-12 border border-violet-200/30 shadow-soft-lg">
            <h2 className="text-4xl font-bold text-neutral-900 mb-8 tracking-tight">
              Our Mission & Purpose
            </h2>
            <div className="space-y-6 text-lg text-neutral-700 leading-relaxed font-light text-left">
              <p>
                <strong className="font-semibold">Kairoo exists to serve those who:</strong>
              </p>
              <ul className="space-y-3 list-disc list-inside ml-4">
                <li>Feel misunderstood or misaligned in social settings</li>
                <li>Experience deep loneliness, despite the desire for connection</li>
                <li>Don't know how to express themselves clearly</li>
                <li>Want to prepare for specific, upcoming conversations or social events but lack a safe place to practice</li>
                <li>Often pretend they don't need support—not because they don't want it, but because they value dignity</li>
              </ul>
                             <p className="text-center font-semibold pt-4">
                 Kairoo helps people grow into more confident, connected, and expressive individuals through immersive, emotionally intelligent AI simulations and guidance.
               </p>
              <p className="text-center italic">
                We don't "fix" people. We serve them by giving them the tools and safe spaces to grow into the version of themselves they've always wanted to be—someone who can express thoughts freely, connect meaningfully, and feel seen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Features Section */}
      <section className="px-6 py-16 bg-gradient-to-br from-neutral-50/50 to-warm-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-soft">
              <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-neutral-900 mb-6 tracking-tight">
              Coming Soon
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto font-light leading-relaxed">
              We're continuously evolving to better serve your social growth journey.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-soft-lg border border-neutral-200/50 fade-in-up">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-200 rounded-3xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-neutral-900 mb-4">Live Video Call Support</h3>
                  <p className="text-lg text-neutral-600 leading-relaxed">
                    Kairoo will soon include a live, optional overlay for video calls that helps users better interpret 
                    social cues, tone, and intent in real time—supporting more confident, meaningful connection without 
                    disrupting dignity or flow.
                  </p>
                  <div className="mt-6 inline-flex items-center text-violet-600 font-medium">
                    <span className="w-2 h-2 bg-violet-500 rounded-full mr-3 animate-pulse"></span>
                    In Development
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="px-6 py-16 bg-gradient-to-br from-neutral-50/50 to-warm-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <div className="w-16 h-16 bg-gradient-to-br from-success-100 to-success-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-soft">
              <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-neutral-900 mb-6 tracking-tight">
              Private by default
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto font-light leading-relaxed">
              Your privacy is sacred. No signup required—just a unique anonymous ID generated locally. 
              Nothing is tracked or stored externally.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-soft border border-neutral-200/50 fade-in-up-delay-1">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-success-100 to-success-200 rounded-2xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">No storage, no training</h3>
                  <p className="text-neutral-600">
                    Your conversations are analyzed and immediately discarded. We never store your content 
                    or use it to train AI models.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-soft border border-neutral-200/50 fade-in-up-delay-2">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-success-100 to-success-200 rounded-2xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Anonymous by design</h3>
                  <p className="text-neutral-600">
                    A unique anonymous ID is auto-generated in localStorage. We never know who you are 
                    or what you're practicing.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-soft border border-neutral-200/50 fade-in-up-delay-3">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-success-100 to-success-200 rounded-2xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Secure processing</h3>
                  <p className="text-neutral-600">
                    All practice sessions happen through encrypted connections. Your inputs are processed 
                    securely and temporarily.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-soft border border-neutral-200/50 fade-in-up-delay-1">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-success-100 to-success-200 rounded-2xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">No sign-up required</h3>
                  <p className="text-neutral-600">
                    Start using Kairoo immediately. No email, no password, no personal information needed. 
                    Just the growth support you're looking for.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-gradient-to-br from-violet-600 via-purple-600 to-violet-700 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative fade-in-up">
          <div className="bg-white/10 backdrop-blur-sm rounded-4xl p-12 border border-white/20 shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">
              You don't have to navigate this alone
            </h2>
            <p className="text-xl text-violet-100 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
              Whether you're preparing for an important conversation, feeling uncertain about social cues, 
              or wanting to practice expressing yourself clearly, Kairoo is here to support your growth.
            </p>
            <Link
              href="/app"
              className="inline-flex items-center px-10 py-4 text-lg font-semibold text-violet-600 bg-white rounded-2xl hover:bg-neutral-50 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
            >
              Start your growth journey
              <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-white border-t border-neutral-200/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-violet-600 tracking-tight">KAIROO</h3>
              <p className="text-xs text-neutral-500 -mt-1 font-medium">Growth Companion</p>
            </div>
          </div>
          <p className="text-neutral-600 font-light">
            A growth companion for anyone who finds social communication challenging. 
            Supporting your journey with dignity and understanding.
          </p>
        </div>
      </footer>
    </div>
  );
}
