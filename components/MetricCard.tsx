import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Metric } from '../types';

interface MetricCardProps {
  metric: Metric;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const getTrendIcon = () => {
    if (metric.trend === 'up') return <ArrowUp size={16} className="text-red-500" />;
    if (metric.trend === 'down') return <ArrowDown size={16} className="text-green-500" />;
    return <Minus size={16} className="text-slate-400" />;
  };

  // Specialized logic: For "Test Coverage", UP is good. For "Churn", UP is bad.
  const isPositiveTrend = (metric.name === 'Test Coverage' && metric.trend === 'up') ||
                          (metric.name === 'Open Issues' && metric.trend === 'down');
  
  const trendColor = isPositiveTrend ? 'text-green-600 bg-green-50' : (metric.trend === 'stable' ? 'text-slate-600 bg-slate-50' : 'text-red-600 bg-red-50');

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{metric.name}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            {metric.value}
            <span className="text-sm font-normal text-slate-400 ml-1">{metric.unit}</span>
          </h3>
        </div>
        <div className={`p-2 rounded-lg ${trendColor}`}>
          {metric.name === 'Test Coverage' && metric.trend === 'up' ? <ArrowUp size={18} /> : 
           metric.name === 'Test Coverage' && metric.trend === 'down' ? <ArrowDown size={18} /> :
           getTrendIcon()}
        </div>
      </div>
      <p className="text-xs text-slate-400">{metric.description}</p>
    </div>
  );
};