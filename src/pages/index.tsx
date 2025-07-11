import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-900">Kairoo</h1>
                <p className="text-xs text-neutral-500 -mt-1">Social Intelligence</p>
              </div>
            </Link>
            <Link
              href="/app"
              className="button-primary text-sm"
            >
              Try Kairoo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-medium">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                  Free • Private • No Sign-up Required
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-neutral-900 tracking-tight leading-tight">
                  Navigate social messages with{" "}
                  <span className="text-primary-600">confidence</span>
                </h1>
                <p className="text-xl text-neutral-600 leading-relaxed max-w-2xl">
                  When social messages feel confusing or overwhelming, Kairoo helps you understand tone, 
                  spot manipulation, and find the right words to respond thoughtfully.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/app"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-smooth shadow-lg hover:shadow-xl"
                >
                  Start analyzing messages
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-neutral-700 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-smooth"
                >
                  How it works
                </Link>
              </div>

              <div className="flex items-center space-x-6 pt-4 text-sm text-neutral-500">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-success-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No data stored
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-success-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Anonymous by design
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-success-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Always free
                </div>
              </div>
            </div>

            {/* Right side - Product Screenshot */}
            <div className="relative animate-slide-up">
              <div className="relative bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-8 bg-neutral-100 flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-error-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-warning-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-success-400 rounded-full"></div>
                </div>
                <div className="pt-8">
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
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary-100 rounded-full opacity-60"></div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-secondary-100 rounded-full opacity-40"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="px-6 py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-6">
              How Kairoo helps you communicate better
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Whether you're neurodivergent, dealing with social anxiety, or just want clearer communication, 
              Kairoo provides the insights you need to respond with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-smooth border border-neutral-200">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Understand the tone</h3>
              <p className="text-neutral-600 leading-relaxed">
                Get clear insights into emotional warmth, manipulation risk, and passive-aggressiveness. 
                Know if you're overthinking or if your concerns are valid.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-smooth border border-neutral-200">
              <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Find your voice</h3>
              <p className="text-neutral-600 leading-relaxed">
                Get personalized response suggestions in different tones—direct, diplomatic, or assertive—
                so you can choose what feels right for you.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-smooth border border-neutral-200">
              <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Build confidence</h3>
              <p className="text-neutral-600 leading-relaxed">
                Learn to recognize patterns and trust your instincts. Get practical guidance 
                that helps you navigate future conversations with greater confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-3xl p-12 border border-primary-100">
            <h2 className="text-4xl font-bold text-neutral-900 mb-8">
              Built with care, not commerce
            </h2>
            <div className="space-y-6 text-lg text-neutral-700 leading-relaxed">
              <p>
                <strong>We believe social intelligence tools should be accessible to everyone.</strong> 
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
      <section className="px-6 py-20 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-success-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-neutral-900 mb-6">
              Your privacy is sacred
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              We understand that the messages you analyze might be deeply personal. 
              Your trust and privacy are our highest priorities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">No storage, no training</h3>
                  <p className="text-neutral-600">
                    Your messages are analyzed and immediately discarded. We never store your content 
                    or use it to train AI models.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">No sign-up required</h3>
                  <p className="text-neutral-600">
                    Start using Kairoo immediately. No email, no password, no personal information needed. 
                    Just the help you're looking for.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Secure processing</h3>
                  <p className="text-neutral-600">
                    All analysis happens through encrypted connections. Your messages are processed 
                    securely and temporarily.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Anonymous by design</h3>
                  <p className="text-neutral-600">
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
      <section className="px-6 py-20 bg-gradient-to-br from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <h2 className="text-4xl font-bold text-white mb-6">
              You don't have to navigate this alone
            </h2>
            <p className="text-xl text-primary-100 mb-10 max-w-3xl mx-auto">
              Whether you're feeling overwhelmed by a message, unsure about someone's intentions, 
              or just want to respond thoughtfully, Kairoo is here to help.
            </p>
            <Link
              href="/app"
              className="inline-flex items-center px-10 py-4 text-lg font-semibold text-primary-600 bg-white rounded-xl hover:bg-neutral-50 transition-smooth shadow-lg hover:shadow-xl"
            >
              Get help understanding messages
              <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-neutral-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary-400">Kairoo</h3>
              <p className="text-xs text-neutral-400 -mt-1">Social Intelligence</p>
            </div>
          </div>
          <p className="text-neutral-400">
            Built with care for anyone who finds social communication challenging. 
            Free to use, private by design.
          </p>
        </div>
      </footer>
    </div>
  );
}
