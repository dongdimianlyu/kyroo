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
                <p className="text-xs text-neutral-500 -mt-1 font-medium">Social Intelligence</p>
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
      <section className="relative px-6 py-24 lg:py-40 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-violet-300/20 to-purple-300/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-warm-300/20 to-lavender-300/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left side - Content */}
            <div className="space-y-10 fade-in-up">
              <div className="space-y-8">
                <div className="inline-flex items-center px-5 py-3 rounded-full bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200/50 text-violet-700 text-sm font-semibold shadow-soft">
                  <span className="w-2 h-2 bg-violet-500 rounded-full mr-3 animate-pulse"></span>
                  Free • Private • No Sign-up Required
                </div>
                <h1 className="text-6xl lg:text-7xl font-bold text-neutral-900 tracking-tight leading-[1.1]">
                  Navigate social situations with{" "}
                  <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">confidence</span>
                </h1>
                <p className="text-2xl text-neutral-600 leading-relaxed max-w-2xl font-light">
                  When social situations feel confusing or overwhelming, Kairoo helps you understand tone, 
                  spot manipulation, and find the right words to respond thoughtfully.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 pt-6">
                <Link
                  href="/app"
                  className="inline-flex items-center justify-center px-10 py-5 text-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl hover:from-violet-700 hover:to-purple-700 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg"
                >
                  Start analyzing situations that confuses you
                  <svg className="ml-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center justify-center px-10 py-5 text-xl font-semibold text-neutral-700 bg-white/80 backdrop-blur-sm border border-neutral-200/50 rounded-2xl hover:bg-white hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  How it works
                </Link>
              </div>

              <div className="flex items-center space-x-8 pt-6 text-base text-neutral-500">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-success-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No data stored
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-success-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Anonymous by design
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-success-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Always free
                </div>
              </div>
            </div>

            {/* Right side - Product Screenshot */}
            <div className="relative fade-in-up-delay-1">
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft-lg border border-neutral-200/50 overflow-hidden floating-animation">
                <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-r from-neutral-100/80 to-neutral-50/80 backdrop-blur-sm flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-error-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-warning-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-success-400 rounded-full"></div>
                </div>
                <div className="pt-10">
                  <Image
                    src="/Screenshot 2025-07-01 at 9.41.31 PM.png"
                    alt="Kairoo app interface showing message analysis with tone insights and suggested replies"
                    width={600}
                    height={400}
                    className="w-full h-auto"
                    priority
                  />
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
      <section id="how-it-works" className="px-6 py-24 bg-gradient-to-br from-neutral-50/50 to-warm-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 fade-in-up">
            <h2 className="text-5xl font-bold text-neutral-900 mb-8 tracking-tight">
              How Kairoo helps you communicate better
            </h2>
            <p className="text-2xl text-neutral-600 max-w-4xl mx-auto font-light leading-relaxed">
              Whether you're neurodivergent, dealing with social anxiety, or just want clearer communication, 
              Kairoo provides the insights you need to respond with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-neutral-200/50 card-hover fade-in-up-delay-1">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center mb-8">
                <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-neutral-900 mb-6">Understand the tone</h3>
              <p className="text-neutral-600 leading-relaxed text-lg">
                Get clear insights into emotional warmth, manipulation risk, and passive-aggressiveness. 
                Know if you're overthinking or if your concerns are valid.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-neutral-200/50 card-hover fade-in-up-delay-2">
              <div className="w-16 h-16 bg-gradient-to-br from-success-100 to-success-200 rounded-2xl flex items-center justify-center mb-8">
                <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-neutral-900 mb-6">Find your voice</h3>
              <p className="text-neutral-600 leading-relaxed text-lg">
                Get personalized response suggestions in different tones—direct, diplomatic, or assertive—
                so you can choose what feels right for you.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-neutral-200/50 card-hover fade-in-up-delay-3">
              <div className="w-16 h-16 bg-gradient-to-br from-warm-100 to-warm-200 rounded-2xl flex items-center justify-center mb-8">
                <svg className="w-8 h-8 text-warm-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-neutral-900 mb-6">Build confidence</h3>
              <p className="text-neutral-600 leading-relaxed text-lg">
                Learn to recognize patterns and trust your instincts. Get practical guidance 
                that helps you navigate future conversations with greater confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-6 py-24 bg-gradient-to-br from-white to-lavender-50/30">
        <div className="max-w-5xl mx-auto text-center fade-in-up">
          <div className="bg-gradient-to-br from-violet-50/80 to-purple-50/80 backdrop-blur-sm rounded-4xl p-16 border border-violet-200/30 shadow-soft-lg">
            <h2 className="text-5xl font-bold text-neutral-900 mb-10 tracking-tight">
              Built with care, not commerce
            </h2>
            <div className="space-y-8 text-xl text-neutral-700 leading-relaxed font-light">
              <p>
                <strong className="font-semibold">We believe social intelligence tools should be accessible to everyone.</strong> 
                That's why Kairoo is completely free to use. We're not here to monetize your struggles 
                or profit from difficult moments.
              </p>
              <p>
                Whether you're neurodivergent, dealing with anxiety, or just want to communicate more effectively, 
                you deserve tools that help you navigate social situations with dignity and confidence.
              </p>
              <p>
                This isn't about productivity or optimization—it's about understanding, empathy, and giving you 
                the support you need to engage with the world on your own terms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="px-6 py-24 bg-gradient-to-br from-neutral-50/50 to-warm-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 fade-in-up">
            <div className="w-20 h-20 bg-gradient-to-br from-success-100 to-success-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-soft">
              <svg className="w-10 h-10 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-5xl font-bold text-neutral-900 mb-8 tracking-tight">
              Your privacy is sacred
            </h2>
            <p className="text-2xl text-neutral-600 max-w-4xl mx-auto font-light leading-relaxed">
              We understand that the situations you analyze might be deeply personal. 
              Your trust and privacy are our highest priorities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-soft border border-neutral-200/50 fade-in-up-delay-1">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-success-100 to-success-200 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">No storage, no training</h3>
                  <p className="text-neutral-600 text-lg leading-relaxed">
                    Your situations are analyzed and immediately discarded. We never store your content 
                    or use it to train AI models.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-soft border border-neutral-200/50 fade-in-up-delay-2">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-success-100 to-success-200 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">No sign-up required</h3>
                  <p className="text-neutral-600 text-lg leading-relaxed">
                    Start using Kairoo immediately. No email, no password, no personal information needed. 
                    Just the help you're looking for.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-soft border border-neutral-200/50 fade-in-up-delay-3">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-success-100 to-success-200 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">Secure processing</h3>
                  <p className="text-neutral-600 text-lg leading-relaxed">
                    All analysis happens through encrypted connections. Your imputs are processed 
                    securely and temporarily.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-soft border border-neutral-200/50 fade-in-up-delay-1">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-success-100 to-success-200 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">Anonymous by design</h3>
                  <p className="text-neutral-600 text-lg leading-relaxed">
                    We generate anonymous IDs only for basic usage analytics. We never know who you are 
                    or what you're analyzing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 bg-gradient-to-br from-violet-600 via-purple-600 to-violet-700 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative fade-in-up">
          <div className="bg-white/10 backdrop-blur-sm rounded-4xl p-16 border border-white/20 shadow-2xl">
            <h2 className="text-5xl font-bold text-white mb-8 tracking-tight">
              You don't have to navigate this alone
            </h2>
            <p className="text-2xl text-violet-100 mb-12 max-w-4xl mx-auto font-light leading-relaxed">
              Whether you're feeling overwhelmed by a message, unsure about someone's intentions, 
              or just want to respond thoughtfully, Kairoo is here to help.
            </p>
            <Link
              href="/app"
              className="inline-flex items-center px-12 py-6 text-xl font-semibold text-violet-600 bg-white rounded-2xl hover:bg-neutral-50 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg"
            >
              Get help understanding situations
              <svg className="ml-4 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-16 bg-neutral-900">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-violet-400 tracking-tight">Kairoo</h3>
              <p className="text-sm text-neutral-400 -mt-1 font-medium">Social Intelligence</p>
            </div>
          </div>
          <p className="text-neutral-400 text-lg font-light">
            Built with care for anyone who finds social communication challenging. 
            Free to use, private by design.
          </p>
        </div>
      </footer>
    </div>
  );
}
