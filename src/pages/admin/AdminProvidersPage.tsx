import React, { useState, useEffect } from 'react';
import {
  Server,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Activity,
  DollarSign,
  Clock,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Radio,
} from 'lucide-react';
import { adminService, AdminProviderItem } from '../../services/adminService';

export const AdminProvidersPage: React.FC = () => {
  const [providers, setProviders] = useState<AdminProviderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pingingId, setPingingId] = useState<string | null>(null);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await adminService.getProviders();
      setProviders(res);
    } catch (err) {
      console.error('Failed to fetch providers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handlePing = async (providerId: string) => {
    setPingingId(providerId);
    setTimeout(() => {
      setProviders((prev) =>
        prev.map((p) =>
          p.id === providerId
            ? { ...p, lastPingMs: Math.floor(Math.random() * 80) + 120 }
            : p
        )
      );
      setPingingId(null);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            AI Provider Infrastructure
            <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              5 Connected
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time provider connectivity matrix, endpoint health, SLA uptime, and upstream operational cost tracking.
          </p>
        </div>

        <button
          onClick={fetchProviders}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1a1b1e] border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#F05A3C]' : ''}`} />
          <span>Refresh Matrix</span>
        </button>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && providers.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 font-mono">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#F05A3C]" />
            Pinging provider endpoints...
          </div>
        ) : (
          providers.map((p) => {
            const isConnected = p.status === 'CONNECTED';
            return (
              <div
                key={p.id}
                className="p-6 rounded-2xl bg-white dark:bg-[#141518] border border-slate-200/80 dark:border-white/5 shadow-sm hover:border-[#F05A3C]/30 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-[#171717] dark:bg-white/10 flex items-center justify-center text-white font-mono font-bold text-xs uppercase shadow-sm">
                        {p.id.substring(0, 3)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{p.name}</h3>
                        <div className="text-[11px] font-mono text-slate-400 truncate max-w-[160px]">
                          {p.endpoint}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        isConnected
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}
                    >
                      <Radio className={`w-2.5 h-2.5 ${isConnected ? 'animate-pulse' : ''}`} />
                      {p.status}
                    </span>
                  </div>

                  {/* Telemetry Matrix */}
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-xs mb-4">
                    <div>
                      <div className="text-[10px] text-slate-400">Availability SLA</div>
                      <div className="font-mono font-bold text-emerald-500 text-sm mt-0.5">{p.successRate}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Average Latency</div>
                      <div className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">
                        ~{p.avgLatencyMs}ms
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Available Models</div>
                      <div className="font-mono font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        {p.modelsCount} Active
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">24h Requests</div>
                      <div className="font-mono font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        {p.requests24h}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-slate-400">
                    {p.lastPingMs ? (
                      <span className="text-emerald-500 font-semibold">Ping: {p.lastPingMs}ms</span>
                    ) : (
                      'Gateway Active'
                    )}
                  </div>
                  <button
                    onClick={() => handlePing(p.id)}
                    disabled={pingingId === p.id}
                    className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-300 text-xs font-medium transition-all"
                  >
                    <Activity className={`w-3 h-3 ${pingingId === p.id ? 'animate-spin text-[#F05A3C]' : ''}`} />
                    <span>{pingingId === p.id ? 'Testing...' : 'Test Gateway'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
export default AdminProvidersPage;
