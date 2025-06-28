import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-gray-900 tracking-tight">
              Kairoo
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Understand the unspoken. Get clarity on social messages with AI-powered analysis 
              that helps you navigate conversations with confidence.
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <Link
              href="/app"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Start Analyzing Messages
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Privacy Note */}
          <div className="pt-8">
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              🔒 Privacy-first design. No sign-up required. Your messages are analyzed securely and never stored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
