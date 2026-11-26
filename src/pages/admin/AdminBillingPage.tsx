import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Package,
  Check,
  RefreshCw,
  Users,
  PieChart,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminBillingPage: React.FC = () => {
  const [billingData, setBillingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchBilling = async () => {
    try {
      setLoading(true);
      const res = await adminService.getBilling();
      setBillingData(res);
    } catch (err) {
      console.error('Failed to fetch billing:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBilling();
  }, []);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Billing, Plans & Financials
            <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              MRR ACTIVE
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Subscription tier configuration, revenue analytics, provider compute margin, and token quota allocations.
          </p>
        </div>

        <button
          onClick={fetchBilling}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1a1b1e] border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#F05A3C]' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#141518] border border-slate-200/80 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Monthly Recurring Revenue (MRR)</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-display text-slate-900 dark:text-white mt-3">
            {formatCurrency(billingData?.financials?.monthlyRevenue || 0)}
          </div>
          <div className="text-[10px] text-emerald-500 font-mono mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Calculated from active paying users
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#141518] border border-slate-200/80 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Provider Compute Cost (30d)</span>
            <div className="p-2 rounded-xl bg-[#F05A3C]/10 text-[#F05A3C]">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-display text-slate-900 dark:text-white mt-3">
            {formatCurrency(billingData?.financials?.providerCost30d || 0)}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-2">
            Anthropic + Google + OpenAI API fees
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#141518] border border-slate-200/80 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Estimated Gross Margin</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-display text-emerald-500 mt-3">
            {formatCurrency(billingData?.financials?.estimatedGrossProfit || 0)}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-2">
            Revenue minus direct LLM token fees
          </div>
        </div>
      </div>

      {/* Subscription Plans Matrix */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Subscription Tiers & Allocations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(billingData?.plans || [
            { id: 'FREE_TRIAL', name: 'Free Trial', priceMonthly: 0, tokenAllowance: '100,000', subscribers: 0 },
            { id: 'STARTER', name: 'Starter', priceMonthly: 9, tokenAllowance: '2,000,000', subscribers: 0 },
            { id: 'PRO', name: 'Pro', priceMonthly: 29, tokenAllowance: '10,000,000', subscribers: 0 },
            { id: 'ENTERPRISE', name: 'Enterprise', priceMonthly: 99, tokenAllowance: 'Unlimited (Custom)', subscribers: 0 },
          ]).map((plan: any) => {
            return (
              <div
                key={plan.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#141518] border border-slate-200/80 dark:border-white/5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                      {plan.name}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-semibold">
                      {plan.subscribers} Users
                    </span>
                  </div>

                  <div className="my-3">
                    <span className="text-3xl font-bold font-display text-slate-900 dark:text-white">
                      ${plan.priceMonthly}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">/month</span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 mt-4">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{plan.tokenAllowance} tokens/mo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Smart Multi-Model Routing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Document RAG & Image Studio</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Monthly Revenue:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      ${plan.priceMonthly * plan.subscribers}/mo
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default AdminBillingPage;
