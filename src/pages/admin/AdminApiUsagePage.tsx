import React, { useState, useEffect } from 'react';
import {
  Activity,
  Cpu,
  Clock,
  DollarSign,
  Search,
  Filter,
  RefreshCw,
  Zap,
  Layers,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminApiUsagePage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [provider, setProvider] = useState('');
  const [model, setModel] = useState('');

  const fetchUsage = async () => {
    try {
      setLoading(true);
      const res = await adminService.getApiUsage({
        days,
        provider: provider || undefined,
        model: model || undefined,
      });
      setData(res);
    } catch (err) {
      console.error('Failed to fetch API usage:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, [days, provider, model]);

  const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num || 0);
  const formatCost = (num: number) => `$${(num || 0).toFixed(4)}`;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            API & Token Telemetry
            <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              REAL-TIME
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Deep inspection into orchestration calls, prompt/completion token consumption, latency benchmarks, and cost efficiency.
          </p>
        </div>

        <button
          onClick={fetchUsage}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1a1b1e] border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#F05A3C]' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Header */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#141518] border border-slate-200/80 dark:border-white/5 shadow-sm flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center space-x-2">
          {[
            { label: 'Today', val: 1 },
            { label: 'Past 7 Days', val: 7 },
            { label: 'Past 30 Days', val: 30 },
            { label: 'Past 90 Days', val: 90 },
          ].map((item) => (
            <button
              key={item.val}
              onClick={() => setDays(item.val)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                days === item.val
                  ? 'bg-[#171717] dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#F05A3C]"
          >
            <option value="">All Providers</option>
            <option value="anthropic">Anthropic</option>
            <option value="google">Google</option>
            <option value="openai">OpenAI</option>
            <option value="deepseek">DeepSeek</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#141518] border border-slate-200/80 dark:border-white/5 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Total API Invocations</span>
          <div className="text-2xl font-bold font-display text-slate-900 dark:text-white mt-2">
            {formatNumber(data?.summary?.totalRequests || 0)}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-2">In selected period ({days}d)</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#141518] border border-slate-200/80 dark:border-white/5 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Total Tokens Consumed</span>
          <div className="text-2xl font-bold font-display text-slate-900 dark:text-white mt-2">
            {formatNumber(data?.summary?.totalTokens || 0)}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-2">
            In: {formatNumber(data?.summary?.promptTokens || 0)} &bull; Out: {formatNumber(data?.summary?.completionTokens || 0)}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#141518] border border-slate-200/80 dark:border-white/5 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Average Roundtrip Latency</span>
          <div className="text-2xl font-bold font-display text-emerald-500 mt-2">
            ~{Math.round(data?.summary?.avgLatencyMs || 250)}ms
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-2">Global streaming & inference</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#141518] border border-slate-200/80 dark:border-white/5 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Total Provider Cost</span>
          <div className="text-2xl font-bold font-display text-[#F05A3C] mt-2">
            {formatCost(data?.summary?.costUsd || 0)}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-2">Upstream API compute fees</div>
        </div>
      </div>

      {/* Live Request Stream / Record History */}
      <div className="rounded-2xl bg-white dark:bg-[#141518] border border-slate-200/80 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 dark:border-white/5 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recent Usage Invocations</h2>
          <span className="text-xs text-slate-400 font-mono">Real PostgreSQL Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-black/30 border-b border-slate-200/80 dark:border-white/5 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Model & Provider</th>
                <th className="py-3 px-4">Tokens (In / Out)</th>
                <th className="py-3 px-4">Latency</th>
                <th className="py-3 px-4">Cost</th>
                <th className="py-3 px-4">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {loading && !data ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-mono">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#F05A3C]" />
                    Loading API records...
                  </td>
                </tr>
              ) : !data?.records?.length ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-mono">
                    No usage records found for this filter.
                  </td>
                </tr>
              ) : (
                data.records.map((r: any) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{r.model}</div>
                      <div className="text-[10px] text-slate-400 font-mono uppercase">{r.provider}</div>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className="font-semibold text-slate-900 dark:text-white">{formatNumber(r.totalTokens)}</span>{' '}
                      <span className="text-[10px] text-slate-400">
                        ({formatNumber(r.promptTokens || 0)} / {formatNumber(r.completionTokens || 0)})
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-500 font-medium">
                      {r.latencyMs || 220}ms
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {formatCost(r.costUsd)}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {r.user?.email || r.userId ? r.user?.email || r.userId.substring(0, 8) + '...' : 'System'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default AdminApiUsagePage;
