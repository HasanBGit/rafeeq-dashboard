import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { SCMAdapter } from '../services/scmAdapter';
import { Repository, UserRole } from '../types';
import { MetricCard } from '../components/MetricCard';
import { AlertTriangle, CheckCircle, RefreshCcw } from 'lucide-react';

interface DashboardProps {
  role: UserRole;
}

export const Dashboard: React.FC<DashboardProps> = ({ role }) => {
  const [repo, setRepo] = useState<Repository | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await SCMAdapter.fetchRepositoryData();
      const hist = SCMAdapter.getHistoricalHealth();
      setRepo(data);
      setHistory(hist);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading || !repo) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Define metric color based on score
  const scoreColor = repo.healthScore >= 80 ? 'text-green-600' : repo.healthScore >= 60 ? 'text-yellow-600' : 'text-red-600';
  const scoreBg = repo.healthScore >= 80 ? 'bg-green-100' : repo.healthScore >= 60 ? 'bg-yellow-100' : 'bg-red-100';

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Repository Health Dashboard</h1>
          <p className="text-slate-500">Overview for <span className="font-mono text-slate-700 font-semibold">{repo.name}</span></p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => window.location.reload()} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
            <RefreshCcw size={20} />
          </button>
          <div className="px-4 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
            Viewing as: {role}
          </div>
        </div>
      </div>

      {/* Main Health Banner */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center gap-8">
        <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 border-white shadow-lg ${scoreBg}`}>
          <div className="text-center">
            <span className={`text-4xl font-bold ${scoreColor}`}>{repo.healthScore}</span>
            <p className="text-xs text-slate-600 font-medium uppercase mt-1">Health Score</p>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">System Analysis Report</h3>
          <p className="text-slate-600 max-w-2xl">
            The repository is currently in <span className="font-bold">{repo.healthScore > 80 ? 'Healthy' : 'Warning'}</span> state. 
            Code churn has increased by 12% this week, primarily in the <code className="bg-slate-100 px-1 rounded">auth</code> module. 
            {role === UserRole.QA && " Recommend focusing regression testing on the new PRs."}
            {role === UserRole.MANAGER && " Velocity is high, but technical debt is accumulating in legacy modules."}
          </p>
        </div>
        <div className="h-16 w-px bg-slate-200"></div>
        <div className="px-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={16} className="text-green-500" />
            <span className="text-sm text-slate-600">Build Passing</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-yellow-500" />
            <span className="text-sm text-slate-600">3 Security Alerts</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard metric={repo.metrics.codeChurn} />
        <MetricCard metric={repo.metrics.complexity} />
        <MetricCard metric={repo.metrics.openIssues} />
        <MetricCard metric={repo.metrics.testCoverage} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Historical Trend */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Health Score Trend (7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} domain={[60, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="score" stroke="#3b82f6" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Churn vs Complexity - Scatter Proxy using Bar for simplicity */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Risk Hotspots (Module Complexity)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                  {name: 'Auth', complexity: 85},
                  {name: 'UI', complexity: 45},
                  {name: 'API', complexity: 60},
                  {name: 'Utils', complexity: 20},
                  {name: 'Core', complexity: 90},
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff' }}
                />
                <Bar dataKey="complexity" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};