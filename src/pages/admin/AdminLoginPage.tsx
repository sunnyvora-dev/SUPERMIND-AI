import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldAlert,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  Radio,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  ShieldCheck,
  Server,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityPin, setSecurityPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number>(4);
  const [authSuccess, setAuthSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await adminService.loginAdmin(email, password, securityPin);
      setAuthSuccess(true);
      setTimeout(() => {
        // Direct redirect into admin panel
        window.location.href = '/admin/overview';
      }, 700);
    } catch (err: any) {
      console.error('Admin authentication failure:', err);
      const msg = err.message || 'Administrative authentication failed';
      setError(msg);
      setAttemptsRemaining((prev) => Math.max(prev - 1, 0));
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@supermind.ai');
    setPassword('password123');
    setSecurityPin('992211');
  };

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-slate-200 flex flex-col justify-between p-4 sm:p-6 antialiased selection:bg-[#F05A3C]/30 relative overflow-hidden">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Top Security Header */}
      <header className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between text-xs font-mono py-2 border-b border-white/5">
        <div className="flex items-center space-x-2 text-[#F05A3C]">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span className="font-bold tracking-wider">SUPERMIND SECURE CONTROL PLANE</span>
        </div>
        <div className="hidden sm:flex items-center space-x-4 text-slate-500 text-[11px]">
          <span>GATEWAY: ISOLATED-V2</span>
          <span>&bull;</span>
          <span>PROTOCOL: TLS 1.3 / AES-256</span>
          <span>&bull;</span>
          <span className="text-emerald-400 font-semibold">ZERO TRUST ACTIVE</span>
        </div>
        <div>
          <Link
            to="/login"
            className="text-slate-400 hover:text-white transition-colors text-[11px] underline underline-offset-4"
          >
            Public User Login &rarr;
          </Link>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="relative z-10 w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-[#121417] border border-white/10 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-black/80 space-y-6">
          {/* Header & Icon */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#171717] to-[#F05A3C] p-0.5 mx-auto shadow-lg shadow-[#F05A3C]/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#121417] rounded-[14px] flex items-center justify-center">
                <ShieldAlert className="w-7 h-7 text-[#F05A3C]" />
              </div>
            </div>

            <div>
              <h1 className="text-xl font-bold font-display text-white tracking-tight flex items-center justify-center gap-1.5">
                Admin Gateway
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                  RESTRICTED
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Authorized Personnel Only &bull; All Access Attempts Logged
              </p>
            </div>
          </div>

          {/* Security Parameter Badges */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono p-2.5 rounded-xl bg-black/40 border border-white/5 text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Brute-Force Guard</span>
            </div>
            <div className="flex items-center gap-1.5 justify-end text-slate-300">
              <span>{attemptsRemaining} Attempts Left</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-blue-400" />
              <span>Audit Logging</span>
            </div>
            <div className="flex items-center gap-1.5 justify-end text-emerald-400 font-semibold">
              <span>ACTIVE</span>
            </div>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <div className="leading-relaxed font-medium">{error}</div>
            </div>
          )}

          {/* Success Notice */}
          {authSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-center gap-2 animate-fadeIn font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Session verified. Launching Admin Control Plane...</span>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Administrator Email</span>
                <span className="text-[10px] font-mono text-slate-500">RBAC Verified</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@supermind.ai"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#F05A3C] transition-all font-mono"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Master Password</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#F05A3C] transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 2FA / Security PIN */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Security PIN / 2FA Key</span>
                <span className="text-[10px] font-mono text-slate-500">Optional 6-Digit</span>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  maxLength={6}
                  value={securityPin}
                  onChange={(e) => setSecurityPin(e.target.value)}
                  placeholder="e.g. 992211"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#F05A3C] transition-all font-mono tracking-widest"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || authSuccess}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#F05A3C] hover:bg-[#d9492e] text-white text-xs font-bold transition-all shadow-lg shadow-[#F05A3C]/20 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Authenticating Security Clearance...' : 'Authenticate & Enter Console'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Fill / Dev Helper */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
            <span>Development credentials:</span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[#F05A3C] hover:underline font-mono"
            >
              Auto-fill admin@supermind.ai
            </button>
          </div>
        </div>
      </main>

      {/* Footer Security Notice */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto text-center text-[10px] font-mono text-slate-600 py-2 border-t border-white/5">
        UNAUTHORIZED ACCESS PROHIBITED BY LAW &bull; ALL ACTIONS MONITOR &bull; SUPERMIND AI CLUSTER
      </footer>
    </div>
  );
};
export default AdminLoginPage;
