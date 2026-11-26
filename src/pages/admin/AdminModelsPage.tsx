import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Eye,
  Code,
  Brain,
  Globe,
  Headphones,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { adminService, AdminModelItem } from '../../services/adminService';

export const AdminModelsPage: React.FC = () => {
  const [models, setModels] = useState<AdminModelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [providerFilter, setProviderFilter] = useState('');
  const [togglingModelId, setTogglingModelId] = useState<string | null>(null);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const res = await adminService.getModels();
      setModels(res);
    } catch (err) {
      console.error('Failed to fetch models:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleToggle = async (model: AdminModelItem) => {
    try {
      setTogglingModelId(model.id);
      const nextState = !model.isEnabled;
      await adminService.toggleModel(model.id, nextState);
      setModels((prev) =>
        prev.map((m) => (m.id === model.id ? { ...m, isEnabled: nextState } : m))
      );
    } catch (err: any) {
      alert(`Failed to toggle model: ${err.message}`);
    } finally {
      setTogglingModelId(null);
    }
  };

  const filteredModels = models.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase()) ||
      m.provider.toLowerCase().includes(search.toLowerCase());
    const matchesProvider = !providerFilter || m.provider === providerFilter;
    return matchesSearch && matchesProvider;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            AI Model Registry & Routing Matrix
            <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {models.length} Models
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure global availability, context windows, token pricing, and capability profiles for orchestration routing.
          </p>
        </div>

        <button
          onClick={fetchModels}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl liquid-glass text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/10 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-sky-500' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl liquid-glass flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search model or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs liquid-glass-input rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className="px-3 py-2 text-xs liquid-glass-input rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500 w-full sm:w-auto"
          >
            <option value="">All Providers</option>
            <option value="anthropic">Anthropic</option>
            <option value="google">Google</option>
            <option value="openai">OpenAI</option>
            <option value="deepseek">DeepSeek</option>
            <option value="moonshot">Moonshot</option>
          </select>
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && models.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 font-mono">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-sky-500" />
            Inspecting model catalog...
          </div>
        ) : filteredModels.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 font-mono">
            No models match the current filter.
          </div>
        ) : (
          filteredModels.map((m) => {
            const isModelActive = m.isEnabled ?? (m as any).enabled ?? true;
            return (
              <div
                key={m.id}
                className={`p-5 rounded-2xl liquid-glass-card transition-all flex flex-col justify-between ${
                  isModelActive
                    ? 'hover:border-sky-500/40'
                    : 'border-dashed opacity-50'
                }`}
              >
                <div>
                  {/* Top Bar: Provider Tag + Enable Toggle */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                      {m.provider}
                    </span>
                    <button
                      onClick={() => handleToggle(m)}
                      disabled={togglingModelId === m.id}
                      className="flex items-center space-x-1.5 text-xs transition-opacity hover:opacity-80"
                    >
                      {isModelActive ? (
                        <span className="flex items-center space-x-1 text-emerald-500 font-semibold text-[11px] font-mono">
                          <ToggleRight className="w-6 h-6 text-emerald-500" />
                          <span>ACTIVE</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1 text-slate-400 font-medium text-[11px] font-mono">
                          <ToggleLeft className="w-6 h-6 text-slate-400" />
                          <span>OFFLINE</span>
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Model Name & ID */}
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {m.name}
                  </h3>
                  <div className="text-[11px] font-mono text-slate-400 truncate mt-0.5" title={m.id}>
                    {m.id}
                  </div>

                  {/* Capabilities badges */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {Array.isArray(m.capabilities) ? (
                      m.capabilities.map((cap: any) => (
                        <span key={cap} className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500">
                          <Brain className="w-2.5 h-2.5" /> {cap}
                        </span>
                      ))
                    ) : (
                      <>
                        {m.capabilities?.vision && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500">
                            <Eye className="w-2.5 h-2.5" /> Vision
                          </span>
                        )}
                        {m.capabilities?.reasoning && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-500">
                            <Brain className="w-2.5 h-2.5" /> Reasoning
                          </span>
                        )}
                        {m.capabilities?.coding && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                            <Code className="w-2.5 h-2.5" /> Code
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Specs and Pricing Matrix */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Context Window</span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {typeof (m as any).contextWindow === 'number'
                        ? `${((m as any).contextWindow / 1000).toFixed(0)}k tokens`
                        : (m as any).contextWindow || '128k tokens'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Prompt / Output Pricing</span>
                    <span className="font-mono text-slate-600 dark:text-slate-400">
                      {(m as any).inputPricePer1M && (m as any).outputPricePer1M
                        ? `${(m as any).inputPricePer1M} / ${(m as any).outputPricePer1M} per 1M`
                        : `$${(m.costPer1kPrompt || 0.002) * 1000} / $${(m.costPer1kCompletion || 0.008) * 1000} per 1M`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Recorded Usage</span>
                    <span className="font-mono text-emerald-500 font-medium">
                      {(m as any).latencyAvg || `~${m.stats?.avgLatencyMs || 240}ms`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
export default AdminModelsPage;
