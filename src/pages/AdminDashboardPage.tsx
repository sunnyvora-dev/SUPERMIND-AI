import React from 'react';
import { ShieldAlert, Users, Activity, AlertTriangle, Cpu, CheckCircle2, Clock } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 text-left">
      <div className="flex items-center space-x-3.5">
        <div className="h-10 w-10 rounded-xl bg-[#F05A3C]/10 text-[#F05A3C] border border-[#F05A3C]/20 flex items-center justify-center shrink-0">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded border border-[#DCD6CA] dark:border-[#33312B] bg-[#EAE5D9]/60 dark:bg-[#1E1E1C] text-[#77736B] dark:text-[#A8A49C]">
              Infrastructure SLA
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-normal tracking-tight text-[#171717] dark:text-[#F4F0E6]">
            Admin Platform Dashboard
          </h1>
          <p className="text-xs text-[#77736B] dark:text-[#A8A49C] mt-0.5">
            Real-time provider gateway telemetry, user concurrency, and SLA health indicators.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] space-y-1 shadow-subtle">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#77736B] dark:text-[#A8A49C]">Total Users</div>
          <div className="text-2xl font-serif text-[#171717] dark:text-[#F4F0E6]">12,480</div>
          <div className="text-[10px] text-[#77736B] dark:text-[#A8A49C]">Across all tiers</div>
        </div>
        <div className="p-5 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] space-y-1 shadow-subtle">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#77736B] dark:text-[#A8A49C]">Active Sessions</div>
          <div className="text-2xl font-serif text-emerald-600 dark:text-emerald-400">1,840</div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Live SSE connections</div>
        </div>
        <div className="p-5 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] space-y-1 shadow-subtle">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#77736B] dark:text-[#A8A49C]">Requests (24h)</div>
          <div className="text-2xl font-serif text-[#2457D6] dark:text-[#88A9FF]">142,900</div>
          <div className="text-[10px] text-[#77736B] dark:text-[#A8A49C]">Multi-LLM dispatches</div>
        </div>
        <div className="p-5 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] space-y-1 shadow-subtle">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#77736B] dark:text-[#A8A49C]">Gateway Error Rate</div>
          <div className="text-2xl font-serif text-emerald-600 dark:text-emerald-400">0.02%</div>
          <div className="text-[10px] text-[#77736B] dark:text-[#A8A49C]">Within 99.9% SLA</div>
        </div>
      </div>

      {/* Provider Status Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-serif font-normal text-[#171717] dark:text-[#F4F0E6]">
            Foundation Provider Matrix
          </h3>
          <span className="font-mono text-[10px] text-[#77736B] dark:text-[#A8A49C]">
            Live Polling: 30s interval
          </span>
        </div>
        <div className="bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] rounded-2xl overflow-hidden text-xs shadow-subtle">
          <table className="w-full text-left">
            <thead className="bg-[#EAE5D9]/50 dark:bg-[#171717]/80 border-b border-[#DCD6CA] dark:border-[#33312B] text-[#77736B] dark:text-[#A8A49C] font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Provider Gateway</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Requests (24h)</th>
                <th className="p-3.5">Success Rate</th>
                <th className="p-3.5">Latency SLA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCD6CA] dark:divide-[#33312B]">
              {[
                { name: 'Anthropic (Claude 3.5 Sonnet)', status: 'Operational', requests: '48,200', success: '99.98%', latency: '610ms' },
                { name: 'DeepSeek (DeepSeek R1)', status: 'Operational', requests: '32,100', success: '99.92%', latency: '740ms' },
                { name: 'Groq (Llama 3.3 70B)', status: 'Operational', requests: '29,400', success: '100.00%', latency: '190ms' },
                { name: 'OpenAI (GPT-4o & DALL-E 3)', status: 'Operational', requests: '22,800', success: '99.95%', latency: '490ms' },
                { name: 'Google (Gemini 2.5 Flash)', status: 'Operational', requests: '10,400', success: '99.91%', latency: '580ms' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-[#EAE5D9]/30 dark:hover:bg-[#171717]/50 transition-colors">
                  <td className="p-3.5 font-medium text-[#171717] dark:text-[#F4F0E6]">{row.name}</td>
                  <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {row.status}
                  </td>
                  <td className="p-3.5 font-mono text-[#77736B] dark:text-[#A8A49C]">{row.requests}</td>
                  <td className="p-3.5 font-mono text-emerald-600 dark:text-emerald-400">{row.success}</td>
                  <td className="p-3.5 font-mono text-[#2457D6] dark:text-[#88A9FF]">{row.latency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};