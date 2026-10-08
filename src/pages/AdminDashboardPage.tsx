import React from 'react';
import { ShieldAlert, Users, Activity, AlertTriangle, Cpu, CheckCircle2, Clock } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Admin Platform Dashboard</h1>
          <p className="text-xs text-slate-500">System health monitoring, user metrics, and provider SLA status</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Total Users</div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white">12,480</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Active Sessions</div>
          <div className="text-xl font-extrabold text-emerald-500">1,840</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Requests (24h)</div>
          <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">142,900</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Error Rate</div>
          <div className="text-xl font-extrabold text-emerald-500">0.02%</div>
        </div>
      </div>

      {/* Provider Status Table */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Provider Gateway Matrix</h3>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
              <tr>
                <th className="p-3">Provider</th>
                <th className="p-3">Status</th>
                <th className="p-3">Requests (24h)</th>
                <th className="p-3">Success Rate</th>
                <th className="p-3">Latency SLA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { name: 'Anthropic (Claude 3.5 Sonnet)', status: 'Operational', requests: '48,200', success: '99.98%', latency: '610ms' },
                { name: 'DeepSeek (DeepSeek R1)', status: 'Operational', requests: '32,100', success: '99.92%', latency: '740ms' },
                { name: 'Groq (Llama 3.3 70B)', status: 'Operational', requests: '29,400', success: '100.00%', latency: '190ms' },
                { name: 'OpenAI (GPT-4o & DALL-E 3)', status: 'Operational', requests: '22,800', success: '99.95%', latency: '490ms' },
                { name: 'Google (Gemini 1.5 Pro)', status: 'Operational', requests: '10,400', success: '99.91%', latency: '580ms' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{row.name}</td>
                  <td className="p-3 text-emerald-500 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {row.status}
                  </td>
                  <td className="p-3 font-mono">{row.requests}</td>
                  <td className="p-3 font-mono text-emerald-500">{row.success}</td>
                  <td className="p-3 font-mono text-indigo-600 dark:text-indigo-400">{row.latency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
