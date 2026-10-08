import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Button } from '../components/ui/Button';
import { VerificationCodePanel } from '../components/auth/VerificationCodePanel';
import { Mail, CheckCircle2, Lock, KeyRound, Sparkles } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'code' | 'password' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [verifiedCode, setVerifiedCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoCodeHint, setDemoCodeHint] = useState<string | null>(null);

  // Step 1: Send Verification Code
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authService.sendVerificationCode(email, 'forgot_password');
      setDemoCodeHint(res.code);
      setStep('code');
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Code
  const handleVerifyCode = async (code: string): Promise<boolean> => {
    setLoading(true);
    try {
      const isValid = await authService.verifyCode(email, code);
      if (isValid) {
        setVerifiedCode(code);
        setTimeout(() => {
          setStep('password');
        }, 800);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authService.resetPasswordWithCode(email, verifiedCode, newPassword);
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const passStrength = newPassword.length > 8 ? 'Strong' : newPassword.length > 5 ? 'Medium' : 'Weak';

  return (
    <div className="min-h-screen bg-[#050814] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-md bg-[#0B0F1F]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl shadow-indigo-500/10 p-8 space-y-6 relative transition-all duration-300">
        
        {/* Step Indicators */}
        <div className="flex items-center justify-center space-x-2 pt-1 pb-2">
          {(['email', 'code', 'password', 'success'] as const).map((s, idx) => {
            const stepOrder = { email: 1, code: 2, password: 3, success: 4 };
            const currentIdx = stepOrder[step];
            const itemIdx = stepOrder[s];
            return (
              <React.Fragment key={s}>
                <div
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    itemIdx === currentIdx
                      ? 'w-7 bg-indigo-500 shadow-md shadow-indigo-500/50'
                      : itemIdx < currentIdx
                      ? 'w-2.5 bg-emerald-500'
                      : 'w-2.5 bg-white/10'
                  }`}
                />
              </React.Fragment>
            );
          })}
        </div>

        {/* STEP 1: Email Form */}
        {step === 'email' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
                <KeyRound className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">Forgot Password?</h2>
                <p className="text-xs text-slate-400 mt-1">Enter your email to receive a 6-digit verification code</p>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-indigo-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              <Button type="submit" isLoading={loading} className="w-full">
                Send Verification Code
              </Button>
            </form>
          </div>
        )}

        {/* STEP 2: 6-Digit Verification Code Slide */}
        {step === 'code' && (
          <div className="space-y-4">
            {demoCodeHint && (
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between text-xs text-indigo-300">
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="h-4 w-4 text-indigo-400 animate-spin" />
                  <span>Demo Verification Code:</span>
                </div>
                <span className="font-mono font-bold tracking-widest text-white px-2 py-0.5 bg-indigo-500/30 rounded border border-indigo-400/30">
                  {demoCodeHint}
                </span>
              </div>
            )}

            <VerificationCodePanel
              email={email}
              title="Enter Verification Code"
              subtitle="We sent a 6-digit code to"
              onVerify={handleVerifyCode}
              onResend={async () => {
                const res = await authService.sendVerificationCode(email, 'forgot_password');
                setDemoCodeHint(res.code);
              }}
              onBack={() => setStep('email')}
              isLoading={loading}
            />
          </div>
        )}

        {/* STEP 3: Set New Password Slide */}
        {step === 'password' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                <Lock className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Set New Password</h3>
              <p className="text-xs text-slate-400">Choose a strong password for {email}</p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <label className="font-semibold text-slate-300">New Password</label>
                  <span className="text-[10px] font-mono text-indigo-400 font-bold">Strength: {passStrength}</span>
                </div>
                <div className="relative">
                  <Lock className="h-4 w-4 text-indigo-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Confirm New Password</label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-indigo-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              <Button type="submit" isLoading={loading} className="w-full">
                Update Password
              </Button>
            </form>
          </div>
        )}

        {/* STEP 4: Success Panel */}
        {step === 'success' && (
          <div className="text-center space-y-4 animate-fadeIn py-2">
            <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="h-8 w-8 text-emerald-400 animate-bounce" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-extrabold text-white">Password Reset Complete!</h3>
              <p className="text-xs text-slate-300">
                Your password has been successfully updated. You can now log in with your new password.
              </p>
            </div>

            <Button onClick={() => navigate('/login')} className="w-full pt-2">
              Sign In to Your Account
            </Button>
          </div>
        )}

        {/* Bottom Link */}
        <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/10">
          Remembered your password?{' '}
          <Link to="/login" className="text-indigo-400 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
