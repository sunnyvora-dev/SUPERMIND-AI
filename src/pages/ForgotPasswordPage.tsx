import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Button } from '../components/ui/Button';
import { VerificationCodePanel } from '../components/auth/VerificationCodePanel';
import { Mail, CheckCircle2, Lock, KeyRound, ArrowLeft } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'code' | 'password' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [verifiedCode, setVerifiedCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Send Verification Code
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.sendVerificationCode(email, 'forgot_password');
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
    <div className="min-h-screen bg-[#F4F0E6] dark:bg-[#121212] flex items-center justify-center p-4 relative select-none">
      <div className="w-full max-w-md bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] rounded-2xl shadow-editorial p-7 md:p-8 space-y-6 relative transition-all">
        
        {/* Step Indicators */}
        <div className="flex items-center justify-center space-x-2 pt-1 pb-1">
          {(['email', 'code', 'password', 'success'] as const).map((s) => {
            const stepOrder = { email: 1, code: 2, password: 3, success: 4 };
            const currentIdx = stepOrder[step];
            const itemIdx = stepOrder[s];
            return (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  itemIdx === currentIdx
                    ? 'w-6 bg-[#F05A3C]'
                    : itemIdx < currentIdx
                    ? 'w-2 bg-emerald-600'
                    : 'w-2 bg-[#DCD6CA] dark:bg-[#33312B]'
                }`}
              />
            );
          })}
        </div>

        {/* STEP 1: Enter Email */}
        {step === 'email' && (
          <div className="space-y-5 animate-fadeIn text-left">
            <div className="text-center space-y-2">
              <div className="h-11 w-11 rounded-xl bg-[#F05A3C]/10 border border-[#F05A3C]/20 text-[#F05A3C] flex items-center justify-center mx-auto">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-normal text-[#171717] dark:text-[#F4F0E6] tracking-tight">
                  Reset Password
                </h2>
                <p className="text-xs text-[#77736B] dark:text-[#A8A49C] mt-0.5">
                  Enter your registered email to receive a recovery code
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-[#F05A3C]/10 border border-[#F05A3C]/30 text-[#F05A3C] text-xs text-center font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#171717] dark:text-[#F4F0E6]">Account Email Address</label>
                <div className="relative">
                  <Mail className="h-3.5 w-3.5 text-[#77736B] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F4F0E6] dark:bg-[#171717] border border-[#DCD6CA] dark:border-[#33312B] rounded-xl text-xs text-[#171717] dark:text-[#F4F0E6] placeholder-[#77736B] outline-none focus:border-[#F05A3C] transition-all"
                  />
                </div>
              </div>

              <Button type="submit" isLoading={loading} variant="primary" className="w-full">
                Send Verification Code
              </Button>
            </form>

            <div className="text-center pt-2">
              <Link to="/login" className="inline-flex items-center text-xs font-medium text-[#77736B] hover:text-[#171717] dark:hover:text-[#F4F0E6] transition-colors">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Sign In
              </Link>
            </div>
          </div>
        )}

        {/* STEP 2: Verify Code */}
        {step === 'code' && (
          <div className="space-y-4">
            <VerificationCodePanel
              email={email}
              title="Reset Code Verification"
              subtitle="Enter the 6-digit recovery code sent to"
              onVerify={handleVerifyCode}
              onResend={async () => {
                await authService.sendVerificationCode(email, 'forgot_password');
              }}
              onBack={() => setStep('email')}
              isLoading={loading}
            />
          </div>
        )}

        {/* STEP 3: Create New Password */}
        {step === 'password' && (
          <div className="space-y-5 animate-fadeIn text-left">
            <div className="text-center space-y-2">
              <div className="h-11 w-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 flex items-center justify-center mx-auto">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-normal text-[#171717] dark:text-[#F4F0E6] tracking-tight">
                  Set New Password
                </h2>
                <p className="text-xs text-[#77736B] dark:text-[#A8A49C] mt-0.5">
                  Choose a secure password for your SuperMind account
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-[#F05A3C]/10 border border-[#F05A3C]/30 text-[#F05A3C] text-xs text-center font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <label className="font-medium text-[#171717] dark:text-[#F4F0E6]">New Password</label>
                  <span className="text-[10px] font-mono text-[#F05A3C] font-semibold">Strength: {passStrength}</span>
                </div>
                <div className="relative">
                  <Lock className="h-3.5 w-3.5 text-[#77736B] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F4F0E6] dark:bg-[#171717] border border-[#DCD6CA] dark:border-[#33312B] rounded-xl text-xs text-[#171717] dark:text-[#F4F0E6] placeholder-[#77736B] outline-none focus:border-[#F05A3C] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#171717] dark:text-[#F4F0E6]">Confirm Password</label>
                <div className="relative">
                  <Lock className="h-3.5 w-3.5 text-[#77736B] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F4F0E6] dark:bg-[#171717] border border-[#DCD6CA] dark:border-[#33312B] rounded-xl text-xs text-[#171717] dark:text-[#F4F0E6] placeholder-[#77736B] outline-none focus:border-[#F05A3C] transition-all"
                  />
                </div>
              </div>

              <Button type="submit" isLoading={loading} variant="primary" className="w-full">
                Reset Password & Log In
              </Button>
            </form>
          </div>
        )}

        {/* STEP 4: Success */}
        {step === 'success' && (
          <div className="text-center space-y-4 animate-fadeIn py-4">
            <div className="h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-subtle">
              <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400 animate-bounce" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-serif font-normal text-[#171717] dark:text-[#F4F0E6]">Password Updated</h3>
              <p className="text-xs text-[#77736B] dark:text-[#A8A49C]">Your credentials have been updated securely.</p>
            </div>
            <Button onClick={() => navigate('/login')} variant="primary" className="w-full mt-4">
              Return to Sign In
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};