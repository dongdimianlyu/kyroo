import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-indigo-600">Kairoo</h1>
            <p className="text-xs text-gray-500 mt-1">Social Intelligence</p>
          </div>
          <Link
            href="/app"
            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors"
          >
            Try the App →
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-indigo-600 tracking-tight">
                Kairoo
              </h1>
              <p className="text-2xl md:text-3xl text-gray-800 font-medium max-w-3xl mx-auto leading-relaxed">
                When social messages feel confusing or overwhelming, we&apos;re here to help you understand what&apos;s really being said.
              </p>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Get clarity on tone, spot manipulation, and find the right words to respond with confidence. 
                Built with care for anyone who finds social communication challenging.
              </p>
            </div>

            <div className="pt-6">
              <Link
                href="/app"
                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Start Understanding Messages
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Kairoo Helps You Navigate Social Messages
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                             Whether you&apos;re neurodivergent, anxious about social situations, or just want to communicate better, 
              Kairoo gives you the insights you need to respond with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Understand the Tone</h3>
              <p className="text-gray-600 leading-relaxed">
                Get clear insights into emotional warmth, manipulation risk, and passive-aggressiveness. 
                                 Know if you&apos;re overthinking or if your concerns are valid.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Find Your Voice</h3>
              <p className="text-gray-600 leading-relaxed">
                Get personalized response suggestions in different tones—direct, diplomatic, or assertive—
                so you can choose what feels right for you.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Build Confidence</h3>
              <p className="text-gray-600 leading-relaxed">
                Learn to recognize patterns and red flags for future conversations. 
                Get practical guidance that helps you trust your instincts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="px-4 py-16 bg-indigo-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Built with Care, Not Commerce
          </h2>
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
                             <strong>We believe social intelligence tools should be accessible to everyone.</strong> 
               That&apos;s why Kairoo is completely free to use. We&apos;re not here to monetize your struggles 
              or profit from difficult moments in your life.
            </p>
            <p>
                             Whether you&apos;re neurodivergent, dealing with anxiety, or just want to communicate more effectively, 
              you deserve tools that help you navigate social situations with dignity and confidence.
            </p>
            <p>
                             This isn&apos;t about productivity or optimization—it&apos;s about understanding, empathy, and giving you 
              the support you need to engage with the world on your own terms.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Section */}
      <div className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Privacy is Sacred
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              We understand that the messages you analyze might be deeply personal or emotionally difficult. 
              Your trust means everything to us.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">No Storage, No Training</h3>
                <p className="text-gray-600">
                  Your messages are analyzed and immediately discarded. We never store your content 
                  or use it to train AI models.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">No Sign-Up Required</h3>
                <p className="text-gray-600">
                  Start using Kairoo immediately. No email, no password, no personal information needed. 
                  Just the help you&apos;re looking for.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Secure Processing</h3>
                <p className="text-gray-600">
                  All analysis happens through encrypted connections. Your messages are processed 
                  securely and temporarily.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Anonymous by Design</h3>
                <p className="text-gray-600">
                  We generate anonymous IDs only for basic usage analytics. We never know who you are 
                  or what you&apos;re analyzing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-4 py-16 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            You Don&apos;t Have to Navigate This Alone
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                         Whether you&apos;re feeling overwhelmed by a message, unsure about someone&apos;s intentions, 
            or just want to respond thoughtfully, Kairoo is here to help.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center px-8 py-4 text-lg font-semibold text-indigo-600 bg-white rounded-full hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Get Help Understanding Messages
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-4 py-8 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-indigo-400">Kairoo</h3>
            <p className="text-sm text-gray-400">Social Intelligence</p>
          </div>
          <p className="text-gray-400 text-sm">
            Built with care for anyone who finds social communication challenging. 
            Free to use, private by design.
          </p>
        </div>
      </footer>
    </div>
  );
}
