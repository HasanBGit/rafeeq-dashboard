import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Network, GitPullRequest, Settings } from 'lucide-react';

// Custom Rafeeq Logo Component
// Updated colors: Changed the dark/black parts (#1e293b) to White (#ffffff) for visibility on dark sidebar
const RafeeqLogo = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="40" y="10" width="60" height="25" fill="#3b82f6" />
    <rect x="0" y="37.5" width="60" height="25" fill="#ffffff" />
    <rect x="40" y="65" width="60" height="25" fill="#3b82f6" />
    <path d="M0 65H20V90H0V65Z" fill="#ffffff"/>
  </svg>
);

export const Sidebar: React.FC = () => {
  const navClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <div className="w-64 bg-slate-900 h-screen flex flex-col fixed left-0 top-0 border-r border-slate-800 z-50">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3 text-white">
          <RafeeqLogo />
          <span className="text-2xl font-bold tracking-tight">Rafeeq</span>
        </div>
        <p className="text-xs text-slate-500 mt-2 pl-1">Repository Companion</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink to="/" className={navClass}>
          <LayoutDashboard size={20} />
          <span className="font-medium">Dashboard</span>
        </NavLink>
        <NavLink to="/dependencies" className={navClass}>
          <Network size={20} />
          <span className="font-medium">Dependency Map</span>
        </NavLink>
        <NavLink to="/prs" className={navClass}>
          <GitPullRequest size={20} />
          <span className="font-medium">PR Impact</span>
        </NavLink>
        <div className="pt-4 mt-4 border-t border-slate-800">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">System</p>
          <NavLink to="/settings" className={navClass}>
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </NavLink>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-xs text-slate-400">Connected to:</p>
          <p className="text-sm font-semibold text-white flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            GitHub API
          </p>
        </div>
      </div>
    </div>
  );
};