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
        <h1 className="text-2xl md:text-3xl font-serif font-medium text-[#171717] dark:text-[#F4F0E6] tracking-tight">Usage & Analytics</h1>
        <p className="text-xs text-[#77736B]">Real-time token metrics, SLA latency breakdown, and provider telemetry</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3.5">
        {[
          { label: 'Total Requests', value: data.totalRequests, icon: Activity, color: 'text-[#F05A3C]' },
          { label: 'Messages', value: data.totalMessages, icon: BarChart2, color: 'text-[#2457D6]' },
          { label: 'Tokens Used', value: (data.tokensConsumed || 0).toLocaleString(), icon: Zap, color: 'text-[#171717] dark:text-[#F4F0E6]' },
          { label: 'Images Created', value: data.imagesGenerated, icon: Zap, color: 'text-[#F05A3C]' },
          { label: 'Documents Analyzed', value: data.documentsAnalyzed, icon: Cpu, color: 'text-[#D97706]' },
          { label: 'Success Rate', value: `${data.successRatePercentage}%`, icon: ShieldCheck, color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Avg Latency', value: `${data.averageLatencyMs}ms`, icon: Clock, color: 'text-[#2457D6]' },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="p-4 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] space-y-1 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-[#77736B]">
                <span>{card.label}</span>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
              <div className="text-base font-mono font-semibold text-[#171717] dark:text-[#F4F0E6]">{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* Task Distribution Breakdown */}
      {data.taskDistribution && data.taskDistribution.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-serif font-medium text-base text-[#171717] dark:text-[#F4F0E6]">Task Type Distribution</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {data.taskDistribution.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] space-y-2 shadow-2xs">
                <div className="flex justify-between text-xs text-[#77736B] font-medium">
                  <span>{item.task}</span>
                  <span className="font-mono font-semibold text-[#171717] dark:text-[#F4F0E6]">{item.percentage}%</span>
                </div>
                <div className="w-full bg-[#EAE5D9] dark:bg-[#252421] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#F05A3C] h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Provider Performance Breakdown */}
      <div className="space-y-3">
        <h3 className="font-serif font-medium text-base text-[#171717] dark:text-[#F4F0E6]">Foundation Provider Health</h3>
        <div className="bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] rounded-2xl overflow-hidden text-xs shadow-2xs">
          <table className="w-full text-left">
            <thead className="bg-[#EAE5D9] dark:bg-[#252421] border-b border-[#DCD6CA] dark:border-[#33312B] text-[#77736B] font-mono text-[10px] uppercase">
              <tr>
                <th className="p-3">Provider</th>
                <th className="p-3">Model</th>
                <th className="p-3">Requests</th>
                <th className="p-3">Avg Latency</th>
                <th className="p-3">Success SLA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCD6CA] dark:divide-[#33312B]">
              {data.providerStats.map((p, idx) => (
                <tr key={idx} className="hover:bg-[#EAE5D9]/40 dark:hover:bg-[#252421]/40">
                  <td className="p-3 font-semibold text-[#F05A3C]">{p.provider}</td>
                  <td className="p-3 font-medium text-[#171717] dark:text-[#F4F0E6]">{p.model}</td>
                  <td className="p-3 font-mono">{p.requests}</td>
                  <td className="p-3 font-mono">{p.latencyMs}ms</td>
                  <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">{p.successRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
