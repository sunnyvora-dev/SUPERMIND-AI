import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Shield,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  XCircle,
  MoreVertical,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Edit2,
  AlertTriangle,
} from 'lucide-react';
import { adminService, AdminUserItem } from '../../services/adminService';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modal / Confirm state
  const [selectedUser, setSelectedUser] = useState<AdminUserItem | null>(null);
  const [editRoleModal, setEditRoleModal] = useState(false);
  const [newRole, setNewRole] = useState('USER');
  const [suspendConfirmModal, setSuspendConfirmModal] = useState(false);
  const [userToSuspend, setUserToSuspend] = useState<AdminUserItem | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getUsers({
        page,
        limit: 10,
        search: search.trim() || undefined,
        role: roleFilter || undefined,
        tier: tierFilter || undefined,
      });
      setUsers(res.users);
      setTotalPages(res.pagination.pages);
      setTotalCount(res.pagination.total);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter, tierFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    try {
      setActionLoading(selectedUser.id);
      await adminService.updateUserRole(selectedUser.id, newRole);
      setEditRoleModal(false);
      setSelectedUser(null);
      await fetchUsers();
    } catch (err: any) {
      alert(`Failed to update role: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async () => {
    if (!userToSuspend) return;
    try {
      setActionLoading(userToSuspend.id);
      await adminService.toggleUserStatus(userToSuspend.id, !userToSuspend.isSuspended);
      setSuspendConfirmModal(false);
      setUserToSuspend(null);
      await fetchUsers();
    } catch (err: any) {
      alert(`Failed to change status: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleTierChange = async (userId: string, tier: string) => {
    try {
      setActionLoading(userId);
      await adminService.updateUserTier(userId, tier);
      await fetchUsers();
    } catch (err: any) {
      alert(`Failed to update tier: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            User Directory & Access Control
            <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {totalCount} Total
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Audit user accounts, assign role permissions, adjust tier allocations, or manage account suspension.
          </p>
        </div>

        <button
          onClick={() => fetchUsers()}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl liquid-glass text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/10 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-sky-500' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl liquid-glass flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs liquid-glass-input rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-xs liquid-glass-input rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="">All Roles</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            <option value="ADMIN">ADMIN</option>
            <option value="SUPPORT">SUPPORT</option>
            <option value="FINANCE">FINANCE</option>
            <option value="VIEWER">VIEWER</option>
            <option value="USER">USER</option>
          </select>

          {/* Tier Filter */}
          <select
            value={tierFilter}
            onChange={(e) => {
              setTierFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-xs liquid-glass-input rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="">All Tiers</option>
            <option value="FREE_TRIAL">Free Trial</option>
            <option value="STARTER">Starter</option>
            <option value="PRO">Pro</option>
            <option value="ENTERPRISE">Enterprise</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl liquid-glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-500/5 dark:bg-white/5 border-b border-slate-200/50 dark:border-white/10 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Tier</th>
                <th className="py-3 px-4">Activity & Tokens</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-mono">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-sky-500" />
                    Fetching user records...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-mono">
                    No matching users found in the system.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  return (
                    <tr key={u.id} className="hover:bg-slate-500/5 dark:hover:bg-white/5 transition-colors">
                      {/* User Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center font-bold text-xs uppercase text-slate-700 dark:text-slate-300">
                            {u.name?.[0] || u.email[0]}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                              {u.name || 'Unnamed User'}
                              {u.emailVerified && (
                                <span title="Verified">
                                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role Pill */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-full border ${
                            u.role === 'SUPER_ADMIN'
                              ? 'bg-red-500/10 text-red-500 border-red-500/20 font-semibold'
                              : u.role === 'ADMIN'
                              ? 'bg-sky-500/10 text-sky-400 border-sky-500/20 font-medium'
                              : u.role === 'FINANCE'
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                              : u.role === 'SUPPORT'
                              ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                              : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                          }`}
                        >
                          <Shield className="w-2.5 h-2.5" />
                          {u.role}
                        </span>
                      </td>

                      {/* Tier Selector */}
                      <td className="py-3.5 px-4">
                        <select
                          value={u.tier || u.plan || 'FREE_TRIAL'}
                          onChange={(e) => handleTierChange(u.id, e.target.value)}
                          disabled={actionLoading === u.id}
                          className="bg-transparent border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-200 font-medium focus:ring-1 focus:ring-sky-500"
                        >
                          <option value="FREE_TRIAL">Free Trial</option>
                          <option value="STARTER">Starter</option>
                          <option value="PRO">Pro</option>
                          <option value="ENTERPRISE">Enterprise</option>
                        </select>
                      </td>

                      {/* Activity & Tokens */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-slate-700 dark:text-slate-300 font-medium">
                          {new Intl.NumberFormat('en-US').format(u.tokensUsed || u.totalTokensUsed || 0)} tokens
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {u.conversationsCount || 0} chats &bull; {u.usageCount || 0} API records
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {u.isSuspended ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                            <XCircle className="w-3 h-3" /> Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle className="w-3 h-3" /> Active
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {/* Role Edit Button */}
                          <button
                            onClick={() => {
                              setSelectedUser(u);
                              setNewRole(u.role);
                              setEditRoleModal(true);
                            }}
                            title="Modify Role"
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Suspend / Reactivate */}
                          <button
                            onClick={() => {
                              setUserToSuspend(u);
                              setSuspendConfirmModal(true);
                            }}
                            title={u.isSuspended ? 'Reactivate Account' : 'Suspend Account'}
                            className={`p-1.5 rounded-lg transition-colors ${
                              u.isSuspended
                                ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                                : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                            }`}
                          >
                            {u.isSuspended ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-200/80 dark:border-white/5 flex items-center justify-between text-xs text-slate-500">
          <div>
            Page <span className="font-semibold text-slate-800 dark:text-slate-200">{page}</span> of{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200">{totalPages || 1}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Role Modal */}
      {editRoleModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="liquid-glass-card rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Modify User Role</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select administrative privileges for <span className="font-mono font-semibold">{selectedUser.email}</span>.
            </p>

            <div className="mt-4 space-y-2">
              {[
                { role: 'SUPER_ADMIN', desc: 'Full platform authority, security settings, role assignments.' },
                { role: 'ADMIN', desc: 'Operational administration, models, providers, users.' },
                { role: 'SUPPORT', desc: 'Help desk access, view user details, reset limits.' },
                { role: 'FINANCE', desc: 'Financial audit, pricing overview, revenue intelligence.' },
                { role: 'VIEWER', desc: 'Read-only telemetry and health monitoring.' },
                { role: 'USER', desc: 'Standard platform subscriber.' },
              ].map((r) => (
                <label
                  key={r.role}
                  className={`flex items-start space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    newRole === r.role
                      ? 'border-sky-500 bg-sky-500/10'
                      : 'border-slate-200/50 dark:border-white/10 hover:bg-white/40 dark:hover:bg-white/5'
                  }`}
                >
                  <input
                    type="radio"
                    name="roleOption"
                    value={r.role}
                    checked={newRole === r.role}
                    onChange={() => setNewRole(r.role)}
                    className="mt-0.5 text-sky-500 focus:ring-sky-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{r.role}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">{r.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setEditRoleModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRole}
                disabled={actionLoading !== null}
                className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-semibold hover:bg-sky-500 transition-colors"
              >
                {actionLoading ? 'Saving...' : 'Confirm Role Change'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend / Reactivate Confirmation Modal */}
      {suspendConfirmModal && userToSuspend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="liquid-glass-card rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <div className="flex items-center space-x-3 text-red-500 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {userToSuspend.isSuspended ? 'Reactivate User Account?' : 'Suspend User Account?'}
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {userToSuspend.isSuspended
                ? `This will restore platform and API access for ${userToSuspend.email}.`
                : `This will immediately block API calls, chat sessions, and authentication for ${userToSuspend.email}.`}
            </p>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setSuspendConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleStatus}
                disabled={actionLoading !== null}
                className={`px-4 py-2 rounded-xl text-white text-xs font-semibold ${
                  userToSuspend.isSuspended ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionLoading ? 'Processing...' : userToSuspend.isSuspended ? 'Reactivate' : 'Suspend Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminUsersPage;
