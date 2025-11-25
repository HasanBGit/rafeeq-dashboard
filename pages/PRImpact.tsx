import React, { useEffect, useState } from 'react';
import { SCMAdapter } from '../services/scmAdapter';
import { PullRequest } from '../types';
import { GitPullRequest, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export const PRImpact: React.FC = () => {
  const [prs, setPrs] = useState<PullRequest[]>([]);

  useEffect(() => {
    SCMAdapter.fetchPullRequests().then(setPrs);
  }, []);

  const getRiskBadge = (score: number) => {
    if (score >= 70) return <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold border border-red-200">High Risk ({score})</span>;
    if (score >= 40) return <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-bold border border-yellow-200">Medium ({score})</span>;
    return <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold border border-green-200">Low ({score})</span>;
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <GitPullRequest className="text-blue-600" />
          Predictive PR Impact Analysis
        </h1>
        <p className="text-slate-500 mt-2">
          AI-driven analysis of open Pull Requests based on historical bug data and dependency coupling.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">PR Details</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Author</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Impact Score</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">AI Prediction</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {prs.map((pr) => (
              <tr key={pr.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900">{pr.title}</span>
                    <span className="text-xs text-slate-400 font-mono mt-1">#{pr.id} • {pr.impactedFiles} files changed</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                      {pr.author.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-slate-600">{pr.author}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getRiskBadge(pr.riskScore)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-start gap-2 max-w-xs">
                    <AlertCircle size={16} className={`mt-0.5 ${pr.riskScore > 50 ? 'text-orange-500' : 'text-blue-500'}`} />
                    <p className="text-sm text-slate-600">{pr.prediction}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {pr.status === 'Merged' ? <CheckCircle2 size={16} className="text-purple-500" /> : <Clock size={16} className="text-green-500" />}
                    <span className={`text-sm font-medium ${pr.status === 'Merged' ? 'text-purple-700' : 'text-green-700'}`}>
                      {pr.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};