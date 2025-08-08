import Link from 'next/link';
import React from 'react';

interface SidebarProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
  isTransitioning: boolean;
  setIsTransitioning: (isTransitioning: boolean) => void;
}

const navItems = [
  { 
    name: 'Dashboard', 
    icon: '🎯',
    description: 'Confidence tracking & progress'
  },
  { 
    name: 'Analysis', 
    icon: '📊',
    description: 'Message analysis & insights'
  },
  { 
    name: 'Practice Scenarios', 
    icon: '💬',
    description: 'Voice conversation practice'
  },
  { 
    name: 'Settings', 
    icon: '⚙️',
    description: 'Preferences & customization'
  },
];

const Sidebar: React.FC<SidebarProps> = ({ activeNav, setActiveNav, setIsTransitioning }) => {
  return (
    <aside className="w-80 bg-white/60 backdrop-blur-xl border-r border-neutral-200/50 flex flex-col">
      {/* Header */}
      <div className="p-8 border-b border-neutral-200/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">K</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-900">Kairoo</h1>
            <p className="text-sm text-neutral-500 font-medium">Social Intelligence</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-6">
        <div className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                if (item.name !== activeNav) {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setActiveNav(item.name);
                    setIsTransitioning(false);
                  }, 150);
                }
              }}
              className={`w-full flex items-start gap-4 p-4 rounded-2xl text-left transition-all duration-200 group ${
                activeNav === item.name
                  ? 'bg-purple-50/80 border border-purple-200/60 shadow-sm'
                  : 'hover:bg-neutral-50/80 hover:shadow-sm border border-transparent'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                activeNav === item.name
                  ? 'bg-purple-100 text-purple-600'
                  : 'bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200 group-hover:text-neutral-700'
              }`}>
                <span className="text-lg">{item.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-semibold text-sm transition-colors duration-200 ${
                  activeNav === item.name
                    ? 'text-purple-900'
                    : 'text-neutral-900 group-hover:text-neutral-900'
                }`}>
                  {item.name}
                </div>
                <div className={`text-xs leading-relaxed mt-0.5 transition-colors duration-200 ${
                  activeNav === item.name
                    ? 'text-purple-600'
                    : 'text-neutral-500 group-hover:text-neutral-600'
                }`}>
                  {item.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </nav>
      
      {/* Bottom CTA */}
      <div className="p-6 border-t border-neutral-200/50">
        <div className="bg-gradient-to-br from-purple-50 to-purple-75 rounded-2xl p-6 border border-purple-200/40">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">✨</span>
            </div>
            <h4 className="font-bold text-neutral-900 text-sm">Ready to Practice?</h4>
          </div>
          <p className="text-sm text-neutral-600 mb-5 leading-relaxed">
            Start a conversation simulation to build your confidence in social situations.
          </p>
          <Link 
            href="/app?view=practice"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow-glow-purple-lg hover:from-purple-700 hover:to-purple-800 active:scale-95 transition-all duration-200"
          >
            <span>🎯</span>
            New Practice Session
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 