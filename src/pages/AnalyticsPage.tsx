import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import { AnalyticsSummary } from '../types';
import { BarChart2, ShieldCheck, Cpu, Zap, Activity, Clock } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    analyticsService.getAnalytics().then(setData);
  }, []);

  if (!data) return <div className="p-8 text-center text-xs text-slate-400">Loading analytics telemetries...</div>;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Usage & Analytics</h1>
        <p className="text-xs text-slate-500">Real-time token metrics, SLA latency breakdown, and provider stats</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Requests', value: data.totalRequests, icon: Activity, color: 'text-indigo-600 dark:text-indigo-400' },
          { label: 'Messages', value: data.totalMessages, icon: BarChart2, color: 'text-purple-600 dark:text-purple-400' },
          { label: 'Images Created', value: data.imagesGenerated, icon: Zap, color: 'text-cyan-600 dark:text-cyan-400' },
          { label: 'Documents Analyzed', value: data.documentsAnalyzed, icon: Cpu, color: 'text-amber-600 dark:text-amber-400' },
          { label: 'Success Rate', value: `${data.successRatePercentage}%`, icon: ShieldCheck, color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Avg Latency', value: `${data.averageLatencyMs}ms`, icon: Clock, color: 'text-indigo-600 dark:text-indigo-400' },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{card.label}</span>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* Provider Performance Breakdown */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Foundation Provider Health</h3>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
              <tr>
                <th className="p-3">Provider</th>
                <th className="p-3">Model</th>
                <th className="p-3">Requests</th>
                <th className="p-3">Avg Latency</th>
                <th className="p-3">Success SLA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.providerStats.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">{p.provider}</td>
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{p.model}</td>
                  <td className="p-3 font-mono">{p.requests}</td>
                  <td className="p-3 font-mono">{p.latencyMs}ms</td>
                  <td className="p-3 text-emerald-500 font-semibold">{p.successRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
