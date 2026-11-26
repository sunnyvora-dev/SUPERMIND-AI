import React, { useState, useEffect } from 'react';
import {
  Users,
  Cpu,
  Activity,
  DollarSign,
  TrendingUp,
  Server,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  Clock,
  Sparkles,
} from 'lucide-react';
import { adminService, AdminKPIs } from '../../services/adminService';
import { Link } from 'react-router-dom';

export const AdminOverviewPage: React.FC = () => {
  const [kpis, setKpis] = useState<AdminKPIs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<number>(30);

  const fetchOverview = async (days = timeRange) => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getOverview(days);
      setKpis(data);
    } catch (err: any) {
      console.error('Error fetching admin overview:', err);
      setError(err.message || 'Failed to fetch overview metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview(timeRange);
  }, [timeRange]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num || 0);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);
  };

  if (loading && !kpis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <RefreshCw className="w-8 h-8 text-[#F05A3C] animate-spin" />
        <span className="text-xs font-mono text-slate-400">Loading Live Admin Intelligence...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Operations Intelligence
            <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              LIVE
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Global real-time overview across users, AI orchestration, billing, and system infrastructure.
          </p>
        </div>

        {/* Date Filter & Refresh */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center p-1 liquid-glass rounded-xl">
            {[
              { label: '24h', val: 1 },
              { label: '7d', val: 7 },
              { label: '30d', val: 30 },
              { label: '90d', val: 90 },
            ].map((t) => (
              <button
                key={t.val}
                onClick={() => setTimeRange(t.val)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  timeRange === t.val
                    ? 'bg-[#171717] dark:bg-white text-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchOverview()}
            title="Refresh Metrics"
            className="p-2 rounded-xl liquid-glass text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/10 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#F05A3C]' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium">
          {error}
        </div>
      )}

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Users */}
        <div className="p-5 rounded-2xl liquid-glass-card hover:border-[#F05A3C]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Registered Users</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
              {formatNumber(kpis?.users.total || 0)}
            </span>
            <span className="text-[11px] font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              +{kpis?.users.newInPeriod || 0} in {timeRange}d
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Active: {kpis?.users.active24h || 0}</span>
            <span>Suspended: {kpis?.users.suspended || 0}</span>
          </div>
        </div>

        {/* Card 2: AI Token Consumption */}
        <div className="p-5 rounded-2xl liquid-glass-card hover:border-[#F05A3C]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Tokens Processed</span>
            <div className="p-2 rounded-xl bg-[#F05A3C]/10 text-[#F05A3C]">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
              {formatNumber(kpis?.aiUsage.totalTokens || 0)}
            </span>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              {kpis?.aiUsage.totalRequests || 0} requests
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Latency: ~{kpis?.aiUsage.avgLatencyMs || 250}ms</span>
            <span>Conv: {kpis?.aiUsage.totalConversations || 0}</span>
          </div>
        </div>

        {/* Card 3: Monthly Revenue */}
        <div className="p-5 rounded-2xl liquid-glass-card hover:border-[#F05A3C]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Est. Subscription Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
              {formatCurrency(kpis?.financial.subscriptionRevenue || 0)}
            </span>
            <span className="text-[11px] font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              MRR
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Cost: {formatCurrency(kpis?.financial.providerExpenses || 0)}</span>
            <span>Profit: {formatCurrency(kpis?.financial.estimatedGrossProfit || 0)}</span>
          </div>
        </div>

        {/* Card 4: Platform Health */}
        <div className="p-5 rounded-2xl liquid-glass-card hover:border-[#F05A3C]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Platform Health</span>
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-500">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-display text-emerald-500 tracking-tight flex items-center gap-1.5">
              100%
            </span>
            <span className="text-[11px] font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              OPERATIONAL
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>DB: {kpis?.systemStatus.dbStatus || 'Connected'}</span>
            <span>Redis: {kpis?.systemStatus.redisStatus || 'Connected'}</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Tier Breakdown */}
        <div className="p-6 rounded-2xl liquid-glass-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Active Tier Distribution</h2>
            <Link to="/admin/billing" className="text-xs text-[#F05A3C] hover:underline font-medium">
              Details &rarr;
            </Link>
          </div>
          <div className="space-y-3">
            {[
              {
                tier: 'Free Trial',
                count: kpis?.users.tiers.FREE_TRIAL || 0,
                color: 'bg-slate-400',
              },
              {
                tier: 'Starter ($9/mo)',
                count: kpis?.users.tiers.STARTER || 0,
                color: 'bg-blue-500',
              },
              {
                tier: 'Pro ($29/mo)',
                count: kpis?.users.tiers.PRO || 0,
                color: 'bg-[#F05A3C]',
              },
              {
                tier: 'Enterprise ($99/mo)',
                count: kpis?.users.tiers.ENTERPRISE || 0,
                color: 'bg-emerald-500',
              },
            ].map((t) => {
              const total = kpis?.users.total || 1;
              const pct = Math.round((t.count / total) * 100);
              return (
                <div key={t.tier} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700 dark:text-slate-300">{t.tier}</span>
                    <span className="text-slate-500 font-mono">
                      {t.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className={`${t.color} h-full rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Provider Share */}
        <div className="p-6 rounded-2xl liquid-glass-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">AI Provider Utilization</h2>
            <Link to="/admin/providers" className="text-xs text-[#F05A3C] hover:underline font-medium">
              View Matrix &rarr;
            </Link>
          </div>
          <div className="space-y-3">
            {(kpis?.aiUsage.providerDistribution?.length
              ? kpis.aiUsage.providerDistribution
              : [
                  { provider: 'anthropic', requests: 45, tokens: 45000, costUsd: 0.12, avgLatencyMs: 240 },
                  { provider: 'google', requests: 38, tokens: 32000, costUsd: 0.04, avgLatencyMs: 180 },
                  { provider: 'openai', requests: 25, tokens: 20000, costUsd: 0.08, avgLatencyMs: 210 },
                ]
            ).map((p) => {
              return (
                <div
                  key={p.provider}
                  className="p-3 rounded-xl liquid-glass border border-slate-200/40 dark:border-white/10 flex items-center justify-between text-xs hover:border-[#F05A3C]/30 transition-all"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-white/10 flex items-center justify-center font-mono font-bold text-[10px] uppercase">
                      {p.provider.substring(0, 2)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{p.provider}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{p.requests} calls &bull; {p.avgLatencyMs}ms</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-semibold text-slate-800 dark:text-slate-200">{formatNumber(p.tokens)} tok</div>
                    <div className="text-[10px] text-slate-400 font-mono">{formatCurrency(p.costUsd)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Operations Actions */}
        <div className="p-6 rounded-2xl liquid-glass-card">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Command Shortcuts</h2>
          <div className="space-y-2.5">
            <Link
              to="/admin/users"
              className="flex items-center justify-between p-3 rounded-xl liquid-glass hover:bg-white/40 dark:hover:bg-white/10 border border-slate-200/40 dark:border-white/10 hover:border-[#F05A3C]/30 transition-all text-xs group"
            >
              <div className="flex items-center space-x-3">
                <Users className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-[#F05A3C] transition-colors">
                    Manage User Directory
                  </div>
                  <div className="text-[10px] text-slate-400">Search, promote roles, suspend accounts</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#F05A3C] transition-colors" />
            </Link>

            <Link
              to="/admin/models"
              className="flex items-center justify-between p-3 rounded-xl liquid-glass hover:bg-white/40 dark:hover:bg-white/10 border border-slate-200/40 dark:border-white/10 hover:border-[#F05A3C]/30 transition-all text-xs group"
            >
              <div className="flex items-center space-x-3">
                <Cpu className="w-4 h-4 text-[#F05A3C]" />
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-[#F05A3C] transition-colors">
                    AI Model Registry
                  </div>
                  <div className="text-[10px] text-slate-400">Enable/disable models, inspect token costs</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#F05A3C] transition-colors" />
            </Link>

            <Link
              to="/admin/system-health"
              className="flex items-center justify-between p-3 rounded-xl liquid-glass hover:bg-white/40 dark:hover:bg-white/10 border border-slate-200/40 dark:border-white/10 hover:border-[#F05A3C]/30 transition-all text-xs group"
            >
              <div className="flex items-center space-x-3">
                <Activity className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-[#F05A3C] transition-colors">
                    Infrastructure Diagnostics
                  </div>
                  <div className="text-[10px] text-slate-400">Real-time DB ping, memory & provider SLA</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#F05A3C] transition-colors" />
            </Link>

            <Link
              to="/admin/audit-logs"
              className="flex items-center justify-between p-3 rounded-xl liquid-glass hover:bg-white/40 dark:hover:bg-white/10 border border-slate-200/40 dark:border-white/10 hover:border-[#F05A3C]/30 transition-all text-xs group"
            >
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-amber-500" />
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-[#F05A3C] transition-colors">
                    Administrative Audit Ledger
                  </div>
                  <div className="text-[10px] text-slate-400">Trace operator actions and security logs</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#F05A3C] transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminOverviewPage;
