import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Dependencies } from './pages/Dependencies';
import { PRImpact } from './pages/PRImpact';
import { UserRole } from './types';
import { User } from 'lucide-react';

const App: React.FC = () => {
  // Simulate Role-Based Access Control state
  const [role, setRole] = useState<UserRole>(UserRole.MANAGER);

  return (
    <Router>
      <div className="flex h-screen bg-slate-50 text-slate-900">
        <Sidebar />
        
        <main className="flex-1 ml-64 overflow-auto relative">
          {/* Top Bar helper for Role Switching (For demo purposes) */}
          <div className="absolute top-4 right-8 z-50">
            <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-sm px-3 py-1.5 gap-2">
              <User size={14} className="text-slate-400" />
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="text-xs font-medium text-slate-600 bg-transparent border-none outline-none cursor-pointer"
              >
                <option value={UserRole.DEVELOPER}>View as Developer</option>
                <option value={UserRole.QA}>View as QA Engineer</option>
                <option value={UserRole.MANAGER}>View as Manager</option>
              </select>
            </div>
          </div>

          <Routes>
            <Route path="/" element={<Dashboard role={role} />} />
            <Route path="/dependencies" element={<Dependencies />} />
            <Route path="/prs" element={<PRImpact />} />
            <Route path="/settings" element={<div className="p-8 text-slate-500">Settings Page Placeholder</div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;