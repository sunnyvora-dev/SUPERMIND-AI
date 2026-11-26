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
  Sparkles,
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
    <div className="min-h-screen bg-[#07090D] text-slate-200 flex flex-col justify-between p-4 sm:p-6 antialiased selection:bg-sky-500/30 relative overflow-hidden font-sans">
      {/* Precision Theme Base Ambient Lighting */}
      <div className="liquid-orb-1 w-[500px] h-[500px] -top-28 -left-28" />
      <div className="liquid-orb-2 w-[600px] h-[600px] -bottom-36 -right-36" />

      {/* Subtle Geometric Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

      {/* Top Glass Header */}
      <header className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between text-xs font-mono py-2.5 px-4 rounded-2xl liquid-glass border border-white/10 shadow-lg">
        <div className="flex items-center space-x-2 text-sky-400">
          <Radio className="w-3.5 h-3.5 animate-pulse text-sky-400" />
          <span className="font-bold tracking-wider">SUPERMIND ADMIN GATEWAY</span>
        </div>
        <div className="hidden sm:flex items-center space-x-4 text-slate-400 text-[11px]">
          <span>GATEWAY: ISOLATED-V2</span>
          <span className="text-white/20">&bull;</span>
          <span>PROTOCOL: TLS 1.3 / AES-256</span>
          <span className="text-white/20">&bull;</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            ZERO TRUST ACTIVE
          </span>
        </div>
        <div>
          <Link
            to="/login"
            className="text-slate-300 hover:text-white transition-colors text-[11px] underline underline-offset-4"
          >
            Public User Login &rarr;
          </Link>
        </div>
      </header>

      {/* Center Auth Card with Liquid Glass effect */}
      <main className="relative z-10 w-full max-w-md mx-auto my-auto py-8">
        <div className="liquid-glass-card rounded-3xl p-7 sm:p-9 shadow-2xl relative overflow-hidden border border-white/15 space-y-6">
          {/* Specular Refraction Top Highlight */}
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

          {/* Header & Icon */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl p-0.5 mx-auto shadow-xl shadow-sky-500/20 flex items-center justify-center relative group">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-slate-900 via-sky-500 to-cyan-400 opacity-60 blur-xs" />
              <div className="relative w-full h-full bg-[#0D1117] backdrop-blur-md rounded-[14px] flex items-center justify-center border border-white/10">
                <ShieldAlert className="w-7 h-7 text-sky-400" />
              </div>
            </div>

            <div>
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center justify-center gap-1.5">
                Admin Gateway
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30">
                  RESTRICTED
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Authorized Personnel Only &bull; All Access Attempts Logged
              </p>
            </div>
          </div>

          {/* Glass Security Parameter Badges */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono p-2.5 rounded-2xl liquid-glass border border-white/10 text-slate-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Brute-Force Guard</span>
            </div>
            <div className="flex items-center gap-1.5 justify-end text-slate-200">
              <span>{attemptsRemaining} Attempts Left</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span>Audit Logging</span>
            </div>
            <div className="flex items-center gap-1.5 justify-end text-emerald-400 font-semibold">
              <span>ACTIVE</span>
            </div>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <div className="leading-relaxed font-medium">{error}</div>
            </div>
          )}

          {/* Success Notice */}
          {authSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center gap-2 animate-fadeIn font-semibold">
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
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@supermind.ai"
                  className="w-full pl-10 pr-4 py-2.5 liquid-glass-input rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#F05A3C] transition-all font-mono"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Master Password</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 liquid-glass-input rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-white transition-colors cursor-pointer"
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
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  maxLength={6}
                  value={securityPin}
                  onChange={(e) => setSecurityPin(e.target.value)}
                  placeholder="e.g. 992211"
                  className="w-full pl-10 pr-4 py-2.5 liquid-glass-input rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all font-mono tracking-widest"
                />
              </div>
            </div>

            {/* Glass Submit Button with Refraction */}
            <button
              type="submit"
              disabled={loading || authSuccess}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-400 hover:to-cyan-500 text-white text-xs font-bold transition-all shadow-xl shadow-sky-500/25 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer border border-white/20 active:scale-[0.99]"
            >
              <span>{loading ? 'Authenticating Security Clearance...' : 'Authenticate & Enter Console'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Fill / Dev Helper */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>Development credentials:</span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-sky-400 hover:text-sky-300 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
            >
              Auto-fill admin@supermind.ai
            </button>
          </div>
        </div>
      </main>

      {/* Footer Security Notice */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto text-center text-[10px] font-mono text-slate-500 py-2 border-t border-white/5">
        UNAUTHORIZED ACCESS PROHIBITED BY LAW &bull; ALL ACTIONS MONITOR &bull; SUPERMIND AI CLUSTER
      </footer>
    </div>
  );
};
export default AdminLoginPage;
