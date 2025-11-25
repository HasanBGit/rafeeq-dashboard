import React, { useEffect, useState } from 'react';
import { SCMAdapter } from '../services/scmAdapter';
import { DependencyGraphData } from '../types';
import { D3Graph } from '../components/D3Graph';
import { ZoomIn, ZoomOut, Filter } from 'lucide-react';

export const Dependencies: React.FC = () => {
  const [data, setData] = useState<DependencyGraphData | null>(null);

  useEffect(() => {
    const load = async () => {
      const graphData = await SCMAdapter.fetchDependencyGraph();
      setData(graphData);
    };
    load();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm z-10">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Dependency Map</h1>
          <p className="text-sm text-slate-500">Visualizing structural relationships and risk coupling.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium">
            <Filter size={16} />
            Filter Layer
          </button>
          <div className="h-8 w-px bg-slate-300 mx-2"></div>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
            <ZoomOut size={20} />
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
            <ZoomIn size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 bg-slate-50 p-4 relative overflow-hidden">
        {data ? (
          <D3Graph data={data} />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">Loading graph...</div>
        )}
      </div>
    </div>
  );
};