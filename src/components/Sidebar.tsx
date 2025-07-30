import Link from 'next/link';
import React from 'react';

interface SidebarProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
  isTransitioning: boolean;
  setIsTransitioning: (isTransitioning: boolean) => void;
}

const navItems = [
  { name: 'Dashboard', icon: '📊' },
  { name: 'Practice Scenarios', icon: '💬' },
  { name: 'Settings', icon: '⚙️' },
];

const Sidebar: React.FC<SidebarProps> = ({ activeNav, setActiveNav, setIsTransitioning }) => {
  return (
    <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col p-4">
      <div className="flex items-center space-x-3 p-4 mb-6">
        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">K</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Kairoo</h1>
          <p className="text-xs text-neutral-500 -mt-1">Social Intelligence</p>
        </div>
      </div>
      
      <nav className="flex flex-col space-y-2">
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
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeNav === item.name
                ? 'bg-primary-50 text-primary-700 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-base">{item.name}</span>
          </button>
        ))}
      </nav>
      
      <div className="mt-auto p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl">
        <h4 className="font-bold text-neutral-800 mb-2">Grow with Kairoo</h4>
        <p className="text-sm text-neutral-600 mb-4">
          Unlock your social potential with guided practice.
        </p>
        <Link 
          href="/app?view=practice"
          className="w-full text-center bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-700 transition-all text-sm shadow"
        >
          New Scenario
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar; 