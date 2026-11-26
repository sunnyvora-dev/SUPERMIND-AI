import React, { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  User,
  Shield,
  Search,
  Filter,
  RefreshCw,
  Terminal,
} from 'lucide-react';
import { adminService, AuditLogItem } from '../../services/adminService';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAuditLogs({
        limit: 50,
        action: actionFilter || undefined,
      });
      setLogs(res.logs || []);
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter]);

  const getActionColor = (action: string) => {
    if (action.includes('ROLE')) return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    if (action.includes('STATUS') || action.includes('SUSPEND')) return 'bg-red-500/10 text-red-500 border-red-500/20';
    if (action.includes('MODEL')) return 'bg-[#F05A3C]/10 text-[#F05A3C] border-[#F05A3C]/20';
    return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Administrative Audit Ledger
            <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
              IMMUTABLE
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Chronological log of administrative interventions, role modifications, model state overrides, and configuration changes.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1a1b1e] border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#F05A3C]' : ''}`} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#141518] border border-slate-200/80 dark:border-white/5 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#F05A3C]"
          >
            <option value="">All Administrative Actions</option>
            <option value="UPDATE_USER_ROLE">UPDATE_USER_ROLE</option>
            <option value="UPDATE_USER_TIER">UPDATE_USER_TIER</option>
            <option value="TOGGLE_USER_STATUS">TOGGLE_USER_STATUS</option>
            <option value="TOGGLE_MODEL_STATUS">TOGGLE_MODEL_STATUS</option>
            <option value="UPDATE_PLATFORM_SETTINGS">UPDATE_PLATFORM_SETTINGS</option>
          </select>
        </div>

        <div className="text-xs text-slate-400 font-mono">Showing {logs.length} events</div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl bg-white dark:bg-[#141518] border border-slate-200/80 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-black/30 border-b border-slate-200/80 dark:border-white/5 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target</th>
                <th className="py-3 px-4">Context & Details</th>
                <th className="py-3 px-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {loading && logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-mono">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#F05A3C]" />
                    Reading audit ledger...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-mono">
                    No audit records match the current filter.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {log.actorEmail}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block font-mono text-[10px] px-2 py-0.5 rounded-full border ${getActionColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                      {log.targetType}: {log.targetId || 'Global'}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500 max-w-xs truncate" title={JSON.stringify(log.details)}>
                      {typeof log.details === 'object' ? JSON.stringify(log.details) : String(log.details || '-')}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {log.ipAddress || '127.0.0.1'}
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
export default AdminAuditLogsPage;
