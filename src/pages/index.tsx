import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-indigo-700">Kairoo</h1>
            <p className="text-sm text-slate-500 mt-1">Social Intelligence</p>
          </div>
          <Link
            href="/app"
            className="px-6 py-2 text-indigo-700 hover:text-indigo-800 font-medium text-sm transition-all duration-200 rounded-full hover:bg-white/60 backdrop-blur-sm"
          >
            Try the App →
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="px-6 py-20 lg:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-slate-800 tracking-tight">
                  Kairoo
                </h1>
                <p className="text-2xl lg:text-3xl text-slate-700 font-medium leading-relaxed">
                  When social messages feel confusing or overwhelming, we're here to help you understand what's really being said.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Get clarity on tone, spot manipulation, and find the right words to respond with confidence. 
                  Built with care for anyone who finds social communication challenging.
                </p>
              </div>

              <div className="pt-4">
                <Link
                  href="/app"
                  className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Start Understanding Messages
                  <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right side - Screenshot */}
            <div className="relative">
              <div className="relative bg-white rounded-3xl shadow-2xl p-4 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="rounded-2xl overflow-hidden border border-slate-200">
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
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-60 blur-xl"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-40 blur-xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 py-20 bg-white/70 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-6">
              How Kairoo Helps You Navigate Social Messages
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Whether you're neurodivergent, anxious about social situations, or just want to communicate better, 
              Kairoo gives you the insights you need to respond with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-100">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4 text-center">Understand the Tone</h3>
              <p className="text-slate-600 leading-relaxed text-center">
                Get clear insights into emotional warmth, manipulation risk, and passive-aggressiveness. 
                Know if you're overthinking or if your concerns are valid.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-100">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4 text-center">Find Your Voice</h3>
              <p className="text-slate-600 leading-relaxed text-center">
                Get personalized response suggestions in different tones—direct, diplomatic, or assertive—
                so you can choose what feels right for you.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-100">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4 text-center">Build Confidence</h3>
              <p className="text-slate-600 leading-relaxed text-center">
                Learn to recognize patterns and red flags for future conversations. 
                Get practical guidance that helps you trust your instincts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="px-6 py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-white/50">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-8">
              Built with Care, Not Commerce
            </h2>
            <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
              <p>
                <strong>We believe social intelligence tools should be accessible to everyone.</strong> 
                That's why Kairoo is completely free to use. We're not here to monetize your struggles 
                or profit from difficult moments in your life.
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
      </div>

      {/* Privacy Section */}
      <div className="px-6 py-20 bg-white/70 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-6">
              Your Privacy is Sacred
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              We understand that the messages you analyze might be deeply personal or emotionally difficult. 
              Your trust means everything to us.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-3 text-lg">No Storage, No Training</h3>
                <p className="text-slate-600 leading-relaxed">
                  Your messages are analyzed and immediately discarded. We never store your content 
                  or use it to train AI models.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-3 text-lg">No Sign-Up Required</h3>
                <p className="text-slate-600 leading-relaxed">
                  Start using Kairoo immediately. No email, no password, no personal information needed. 
                  Just the help you're looking for.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-3 text-lg">Secure Processing</h3>
                <p className="text-slate-600 leading-relaxed">
                  All analysis happens through encrypted connections. Your messages are processed 
                  securely and temporarily.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-3 text-lg">Anonymous by Design</h3>
                <p className="text-slate-600 leading-relaxed">
                  We generate anonymous IDs only for basic usage analytics. We never know who you are 
                  or what you're analyzing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-600">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              You Don't Have to Navigate This Alone
            </h2>
            <p className="text-xl text-indigo-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Whether you're feeling overwhelmed by a message, unsure about someone's intentions, 
              or just want to respond thoughtfully, Kairoo is here to help.
            </p>
            <Link
              href="/app"
              className="inline-flex items-center px-10 py-4 text-lg font-semibold text-indigo-600 bg-white rounded-2xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get Help Understanding Messages
              <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-12 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-indigo-400">Kairoo</h3>
            <p className="text-sm text-slate-400 mt-1">Social Intelligence</p>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Built with care for anyone who finds social communication challenging. 
            Free to use, private by design.
          </p>
        </div>
      </footer>
    </div>
  );
}
