import Link from "next/link";

export default function Settings() {
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
            Back to App →
          </Link>
        </div>
      </nav>

      {/* Settings Content */}
      <div className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-16 shadow-lg border border-white/50">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            
            <h1 className="text-4xl font-bold text-slate-800 mb-6">
              Settings
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              We're still working on customization options to make Kairoo even more helpful for you.
            </p>
            
            <p className="text-lg text-slate-500 mb-12">
              Settings and preferences will be available soon. In the meantime, Kairoo works great with its current setup!
            </p>
            
            <Link
              href="/app"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Back to Message Analysis
              <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-12 bg-slate-900 mt-20">
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