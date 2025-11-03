import Link from 'next/link';
import React from 'react';

interface SidebarProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
  isTransitioning: boolean;
  setIsTransitioning: (isTransitioning: boolean) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const IconDashboard = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 13h8V3H3v10zM13 21h8v-8h-8v8zM13 3h8v6h-8V3zM3 21h8v-6H3v6z" />
  </svg>
);

const IconAnalysis = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" />
    <path d="M7 15l4-4 3 3 5-5" />
    <circle cx="7" cy="15" r="0" />
  </svg>
);

const IconPractice = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z" />
  </svg>
);

const IconSettings = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 3.3l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .66.39 1.26 1 1.51.24.1.5.16.77.16H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const navItems = [
  { 
    name: 'Dashboard', 
    Icon: IconDashboard,
    description: 'Confidence tracking & progress'
  },
  { 
    name: 'Analysis', 
    Icon: IconAnalysis,
    description: 'Message analysis & insights'
  },
  { 
    name: 'Practice Scenarios', 
    Icon: IconPractice,
    description: 'Voice conversation practice'
  },
  { 
    name: 'Settings', 
    Icon: IconSettings,
    description: 'Preferences & customization'
  },
];

const Sidebar: React.FC<SidebarProps> = ({ activeNav, setActiveNav, setIsTransitioning, collapsed = false, onToggleCollapse }) => {
  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} shrink-0 min-h-screen bg-white/60 backdrop-blur-xl border-r border-neutral-200/50 flex flex-col transition-all duration-300 ease-out`}>
      {/* Header */}
      <div className={`${collapsed ? 'p-4' : 'p-8'} border-b border-neutral-200/50 transition-all duration-300`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            {!collapsed && (
              <div className="transition-opacity duration-200">
                <h1 className="text-xl font-bold text-neutral-900">Kairoo</h1>
              </div>
            )}
          </div>
          <button
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand' : 'Collapse'}
            onClick={onToggleCollapse}
            className="btn-icon shrink-0"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {collapsed ? (
                <path d="M9 18l6-6-6-6" />
              ) : (
                <path d="M15 18l-6-6 6-6" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className={`${collapsed ? 'p-3' : 'p-6'} flex-1 transition-all duration-300`}>
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
              title={collapsed ? item.name : undefined}
              className={`w-full flex ${collapsed ? 'items-center justify-center' : 'items-start'} gap-4 ${collapsed ? 'p-3' : 'p-4'} rounded-2xl ${collapsed ? 'text-center' : 'text-left'} transition-all duration-200 group ${
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
                <item.Icon className="w-5 h-5" />
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className={`font-semibold text-sm transition-colors duration-200 ${
                    activeNav === item.name
                      ? 'text-purple-900'
                      : 'text-neutral-900 group-hover:text-neutral-900'
                  }`}>
                    {item.name}
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </nav>
      
      {/* Bottom CTA */}
      <div className={`${collapsed ? 'p-3' : 'p-6'} border-t border-neutral-200/50 transition-all duration-300`}>
        {!collapsed ? (
          <div className="bg-gradient-to-br from-purple-50 to-purple-75 rounded-2xl p-6 border border-purple-200/40">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l2.09 6.26L20 9.27l-5 3.64L16.18 20 12 16.9 7.82 20 9 12.91l-5-3.64 5.91-.99L12 2z" />
                </svg>
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
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M22 2l-7 7" />
                <path d="M14 10l-2 2" />
              </svg>
              New Practice Session
            </Link>
          </div>
        ) : (
          <Link 
            href="/app?view=practice"
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold text-xs rounded-xl shadow-sm hover:shadow-glow-purple-lg hover:from-purple-700 hover:to-purple-800 active:scale-95 transition-all duration-200"
            title="New Practice Session"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M22 2l-7 7" />
              <path d="M14 10l-2 2" />
            </svg>
          </Link>
        )}
      </div>
    </aside>
  );
};

export default Sidebar; 