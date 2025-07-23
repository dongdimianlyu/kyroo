import Link from "next/link";

export default function Settings() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200">
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
            
            {/* Navigation Tabs */}
            <div className="flex items-center space-x-1 bg-neutral-100 rounded-xl p-1">
              {[
                { name: 'Dashboard', icon: '📊', href: '/app' },
                { name: 'Practice Scenarios', icon: '💬', href: '/app' },
                { name: 'Settings', icon: '⚙️', active: true }
              ].map((item) => (
                item.href ? (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ) : (
                  <div
                    key={item.name}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium ${
                      item.active
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-neutral-600'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Settings</h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            We're working on customization options to make Kairoo even more helpful for you.
          </p>
        </div>

        {/* Settings Preview Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Coming Soon Card 1 */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">Response Preferences</h3>
                <p className="text-sm text-neutral-500">Coming soon</p>
              </div>
            </div>
            <p className="text-neutral-600">
              Customize the tone and style of suggested responses to match your communication preferences.
            </p>
          </div>

          {/* Coming Soon Card 2 */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-warning-100 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 17h5l-5 5v-5zM12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">Analysis Sensitivity</h3>
                <p className="text-sm text-neutral-500">Coming soon</p>
              </div>
            </div>
            <p className="text-neutral-600">
              Adjust how sensitive the analysis is to different communication patterns and contexts.
            </p>
          </div>

          {/* Coming Soon Card 3 */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">Quick Actions</h3>
                <p className="text-sm text-neutral-500">Coming soon</p>
              </div>
            </div>
            <p className="text-neutral-600">
              Save frequently used responses and create shortcuts for common scenarios.
            </p>
          </div>

          {/* Coming Soon Card 4 */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">Interface Preferences</h3>
                <p className="text-sm text-neutral-500">Coming soon</p>
              </div>
            </div>
            <p className="text-neutral-600">
              Customize the interface layout, themes, and accessibility options to suit your needs.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 border border-primary-100 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            Ready to start analyzing messages?
          </h2>
          <p className="text-neutral-600 mb-6">
            While we work on these customization features, Kairoo is ready to help you understand and respond to messages with confidence.
          </p>
          <Link
            href="/app"
            className="button-primary"
          >
            Go to Message Analysis
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-12 bg-neutral-900 mt-20">
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