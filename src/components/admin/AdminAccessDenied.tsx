import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, KeyRound, Sparkles, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminAccessDenied: React.FC = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuickSwitchToAdmin = async () => {
    try {
      setSwitching(true);
      setError(null);
      await login('admin@supermind.ai', 'password123');
      // Force page reload or navigation to /admin
      window.location.href = '/admin';
    } catch (err: any) {
      console.error('Failed to switch to admin:', err);
      setError(err.message || 'Failed to authenticate as administrator');
      setSwitching(false);
    }
  };

  const handleSignOutAndLogin = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F4F0E6] dark:bg-[#0C0D0E] flex items-center justify-center p-4 antialiased selection:bg-[#F05A3C]/20">
      <div className="max-w-md w-full bg-white dark:bg-[#141518] rounded-3xl p-7 md:p-8 border border-slate-200/80 dark:border-white/10 shadow-2xl space-y-6 text-center">
        {/* Shield Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto border border-red-500/20 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <h1 className="text-xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
            Administrator Access Required
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            This console is strictly protected by Zero Trust role-based access control.
          </p>
        </div>

        {/* Current User Pill */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 text-xs text-left space-y-1">
          <div className="text-[10px] uppercase font-mono text-slate-400 font-semibold tracking-wider">
            Current Authenticated Session
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-slate-800 dark:text-slate-200 font-medium truncate max-w-[220px]">
              {user?.email || 'Not Signed In'}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-bold uppercase">
              Role: {user?.role || 'NONE'}
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          {/* 1-Click Dev Admin Switcher */}
          <button
            onClick={handleQuickSwitchToAdmin}
            disabled={switching}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-[#F05A3C] hover:bg-[#d9492e] text-white text-xs font-bold shadow-lg shadow-[#F05A3C]/20 transition-all cursor-pointer disabled:opacity-60"
          >
            <KeyRound className="w-4 h-4" />
            <span>
              {switching ? 'Authenticating Admin Credentials...' : 'Sign In as Administrator (admin@supermind.ai)'}
            </span>
          </button>

          {/* Return to Dashboard */}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-medium transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to User Dashboard</span>
          </button>

          {/* Switch Account */}
          <button
            onClick={handleSignOutAndLogin}
            className="w-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-[11px] pt-1 transition-colors"
          >
            Sign out and use another account
          </button>
        </div>
      </div>
    </div>
  );
};
export default AdminAccessDenied;
