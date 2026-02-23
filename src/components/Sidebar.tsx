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
    <aside className={`${collapsed ? 'w-20' : 'w-64'} shrink-0 min-h-screen bg-white/80 backdrop-blur-2xl border-r border-neutral-200/40 flex flex-col transition-all duration-300 ease-out`}>
      {/* Header */}
      <div className={`${collapsed ? 'p-4' : 'p-6'} border-b border-neutral-200/40 transition-all duration-300`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-neutral-900 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            {!collapsed && (
              <div className="transition-opacity duration-200">
                <h1 className="text-lg font-semibold text-neutral-900 tracking-tight">Kairoo</h1>
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
      <nav className={`${collapsed ? 'p-3' : 'p-4'} flex-1 transition-all duration-300`}>
        <div className="space-y-1">
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
              className={`w-full flex ${collapsed ? 'items-center justify-center' : 'items-center'} gap-3 ${collapsed ? 'p-3' : 'px-3 py-2.5'} rounded-xl ${collapsed ? 'text-center' : 'text-left'} transition-all duration-200 group ${
                activeNav === item.name
                  ? 'bg-neutral-100/80 border border-neutral-200/50'
                  : 'hover:bg-neutral-50 border border-transparent'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                activeNav === item.name
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200 group-hover:text-neutral-600'
              }`}>
                <item.Icon className="w-4 h-4" />
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className={`font-medium text-[13px] transition-colors duration-200 ${
                    activeNav === item.name
                      ? 'text-neutral-900'
                      : 'text-neutral-600 group-hover:text-neutral-900'
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
      <div className={`${collapsed ? 'p-3' : 'p-4'} border-t border-neutral-200/40 transition-all duration-300`}>
        {!collapsed ? (
          <div className="rounded-xl p-4 bg-neutral-50 border border-neutral-200/40">
            <p className="text-[13px] text-neutral-500 mb-3 leading-relaxed">
              Build confidence through practice.
            </p>
            <Link 
              href="/app?view=practice"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 text-white font-medium text-[13px] rounded-lg hover:bg-neutral-800 active:scale-[0.98] transition-all duration-200"
            >
              New session
            </Link>
          </div>
        ) : (
          <Link 
            href="/app?view=practice"
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-neutral-900 text-white font-medium text-xs rounded-lg hover:bg-neutral-800 active:scale-[0.98] transition-all duration-200"
            title="New Practice Session"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8" />
              <path d="M8 12h8" />
            </svg>
          </Link>
        )}
      </div>
    </aside>
  );
};

export default Sidebar; 