import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Button } from '../components/ui/Button';
import { VerificationCodePanel } from '../components/auth/VerificationCodePanel';
import { User as UserIcon, Mail, Lock, CheckCircle2, Phone } from 'lucide-react';

import { googleAuthService } from '../services/googleAuth';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, loginWithSocial, loginWithPhone } = useAuth();
  
  const [step, setStep] = useState<'form' | 'verify' | 'verified'>('form');
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle Social Registration (Google OAuth, Facebook, Apple)
  const handleSocialRegister = async (provider: 'google' | 'facebook' | 'apple') => {
    if (provider === 'apple' || provider === 'facebook') {
      const name = provider === 'apple' ? 'Apple' : 'Facebook';
      setError(`${name} sign-up is currently not available. Please sign up with Google or Email.`);
      return;
    }

    setLoading(true);
    setError('');
    try {
      if (provider === 'google') {
        await googleAuthService.triggerGoogleOAuthLogin();
      } else {
        await loginWithSocial(provider);
      }
      setStep('verified');
      setTimeout(() => {
        navigate('/dashboard');
      }, 900);
    } catch (err: any) {
      setError(err.message || `${provider} signup failed`);
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Form Submit -> Request 6-Digit OTP Verification Code (Email or Phone)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMethod === 'email' && password !== confirmPass) {
      setError('Passwords do not match');
      return;
    }
    if (!terms) {
      setError('Please accept terms of service');
      return;
    }
    setError('');

    const targetIdentifier = authMethod === 'phone' ? phone : email;

    // Check if User Already Exists
    if (authService.checkUserExists(targetIdentifier)) {
      setError(`An account with this ${authMethod === 'phone' ? 'phone number' : 'email'} already exists.`);
      return;
    }

    setLoading(true);

    try {
      await authService.sendVerificationCode(targetIdentifier, 'register');
      setStep('verify');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP verification code');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: 6-Digit OTP Verification -> Create Account
  const handleVerifyCode = async (code: string): Promise<boolean> => {
    setLoading(true);
    try {
      const targetIdentifier = authMethod === 'phone' ? phone : email;
      const isValid = await authService.verifyCode(targetIdentifier, code);
      if (!isValid) {
        return false;
      }
      
      authService.registerUserInRegistry(targetIdentifier);
      if (authMethod === 'phone') {
        await loginWithPhone(phone);
      } else {
        await register(name || 'SuperMind User', email, password);
      }
      setStep('verified');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
      return true;
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw new Error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passStrength = password.length > 8 ? 'Strong' : password.length > 5 ? 'Medium' : 'Weak';

  return (
    <div className="min-h-screen bg-[#F4F0E6] dark:bg-[#121212] flex items-center justify-center p-4 relative select-none">
      <div className="w-full max-w-md bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] rounded-2xl shadow-editorial p-7 md:p-8 space-y-6 relative transition-all">
        
        {/* Step Indicator dots */}
        <div className="flex items-center justify-center space-x-2 pt-1">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step === 'form' ? 'w-6 bg-[#F05A3C]' : 'w-2 bg-emerald-600'
            }`}
          />
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step === 'verify'
                ? 'w-6 bg-[#F05A3C]'
                : step === 'verified'
                ? 'w-2 bg-emerald-600'
                : 'w-2 bg-[#DCD6CA] dark:bg-[#33312B]'
            }`}
          />
        </div>

        {/* STEP 1: Registration Form */}
        {step === 'form' && (
          <div className="space-y-5 animate-fadeIn text-left">
            <div className="text-center space-y-2">
              <div
                className="h-11 w-11 rounded-xl bg-[#171717] dark:bg-[#F4F0E6] text-[#F4F0E6] dark:text-[#171717] font-serif text-lg flex items-center justify-center mx-auto cursor-pointer border border-[#DCD6CA] dark:border-[#33312B] shadow-subtle"
                onClick={() => navigate('/')}
              >
                S
              </div>
              <div>
                <h2 className="text-2xl font-serif font-normal text-[#171717] dark:text-[#F4F0E6] tracking-tight">
                  Create Workspace
                </h2>
                <p className="text-xs text-[#77736B] dark:text-[#A8A49C] mt-0.5">
                  Join the SuperMind AI orchestration platform
                </p>
              </div>
            </div>

            {/* Social & Phone Registration Options */}
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleSocialRegister('google')}
                  className="p-2.5 rounded-xl bg-[#EAE5D9]/50 dark:bg-[#171717]/60 hover:bg-[#EAE5D9] dark:hover:bg-[#171717] border border-[#DCD6CA] dark:border-[#33312B] flex items-center justify-center transition-all cursor-pointer"
                  title="Sign up with Google"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z" />
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.3s.7 2.6 1.9 5l3.7-2.5z" />
                    <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16.5C3.7 20.4 7.5 23.5 12 23.5z" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialRegister('facebook')}
                  className="p-2.5 rounded-xl bg-[#EAE5D9]/50 dark:bg-[#171717]/60 hover:bg-[#EAE5D9] dark:hover:bg-[#171717] border border-[#DCD6CA] dark:border-[#33312B] flex items-center justify-center transition-all cursor-pointer"
                  title="Sign up with Facebook"
                >
                  <svg className="h-4 w-4 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialRegister('apple')}
                  className="p-2.5 rounded-xl bg-[#EAE5D9]/50 dark:bg-[#171717]/60 hover:bg-[#EAE5D9] dark:hover:bg-[#171717] border border-[#DCD6CA] dark:border-[#33312B] flex items-center justify-center transition-all cursor-pointer text-[#171717] dark:text-[#F4F0E6]"
                  title="Sign up with Apple"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.66-.82 1.11-1.96.99-3.1-.96.04-2.13.64-2.82 1.45-.62.72-1.16 1.88-1.01 3 .08.01.21.02.32.02.87 0 1.92-.55 2.52-1.37z" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMethod(authMethod === 'phone' ? 'email' : 'phone')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    authMethod === 'phone'
                      ? 'bg-[#F05A3C] text-white border-[#F05A3C]'
                      : 'bg-[#EAE5D9]/50 dark:bg-[#171717]/60 text-[#77736B] dark:text-[#A8A49C] border-[#DCD6CA] dark:border-[#33312B]'
                  }`}
                  title="Sign up with Phone SMS OTP"
                >
                  <Phone className="h-4 w-4" />
                </button>
              </div>

              <div className="relative flex items-center justify-center py-1">
                <div className="border-t border-[#DCD6CA] dark:border-[#33312B] w-full" />
                <span className="bg-[#FAF8F3] dark:bg-[#1E1E1C] px-2 text-[10px] uppercase font-mono text-[#77736B] dark:text-[#A8A49C] absolute">
                  or
                </span>
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-[#F05A3C]/10 border border-[#F05A3C]/30 text-[#F05A3C] text-xs text-center font-medium space-y-2">
                <div>{error}</div>
                {error.includes('already exists') && (
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="py-1.5 px-3 rounded-lg bg-[#F05A3C] text-white text-[11px] font-medium transition-all cursor-pointer"
                  >
                    Sign In to Existing Account →
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#171717] dark:text-[#F4F0E6]">Full Name</label>
                <div className="relative">
                  <UserIcon className="h-3.5 w-3.5 text-[#77736B] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Developer"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F4F0E6] dark:bg-[#171717] border border-[#DCD6CA] dark:border-[#33312B] rounded-xl text-xs text-[#171717] dark:text-[#F4F0E6] placeholder-[#77736B] outline-none focus:border-[#F05A3C] transition-all"
                  />
                </div>
              </div>

              {authMethod === 'email' ? (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#171717] dark:text-[#F4F0E6]">Email Address</label>
                    <div className="relative">
                      <Mail className="h-3.5 w-3.5 text-[#77736B] absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@company.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#F4F0E6] dark:bg-[#171717] border border-[#DCD6CA] dark:border-[#33312B] rounded-xl text-xs text-[#171717] dark:text-[#F4F0E6] placeholder-[#77736B] outline-none focus:border-[#F05A3C] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <label className="font-medium text-[#171717] dark:text-[#F4F0E6]">Password</label>
                      <span className="text-[10px] font-mono text-[#F05A3C] font-semibold">Strength: {passStrength}</span>
                    </div>
                    <div className="relative">
                      <Lock className="h-3.5 w-3.5 text-[#77736B] absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#F4F0E6] dark:bg-[#171717] border border-[#DCD6CA] dark:border-[#33312B] rounded-xl text-xs text-[#171717] dark:text-[#F4F0E6] placeholder-[#77736B] outline-none focus:border-[#F05A3C] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#171717] dark:text-[#F4F0E6]">Confirm Password</label>
                    <div className="relative">
                      <Lock className="h-3.5 w-3.5 text-[#77736B] absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#F4F0E6] dark:bg-[#171717] border border-[#DCD6CA] dark:border-[#33312B] rounded-xl text-xs text-[#171717] dark:text-[#F4F0E6] placeholder-[#77736B] outline-none focus:border-[#F05A3C] transition-all"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#171717] dark:text-[#F4F0E6]">Mobile Phone Number</label>
                  <div className="relative">
                    <Phone className="h-3.5 w-3.5 text-[#77736B] absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 234-5678"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F4F0E6] dark:bg-[#171717] border border-[#DCD6CA] dark:border-[#33312B] rounded-xl text-xs text-[#171717] dark:text-[#F4F0E6] placeholder-[#77736B] outline-none focus:border-[#F05A3C] transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  className="rounded border-[#DCD6CA] dark:border-[#33312B] accent-[#F05A3C] h-4 w-4 cursor-pointer"
                />
                <label htmlFor="terms" className="text-xs text-[#77736B] dark:text-[#A8A49C]">
                  I agree to the{' '}
                  <Link to="/terms" target="_blank" className="text-[#F05A3C] font-medium hover:underline">
                    Terms of Service
                  </Link>{' '}
                  &{' '}
                  <Link to="/privacy" target="_blank" className="text-[#F05A3C] font-medium hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button type="submit" isLoading={loading} variant="primary" className="w-full pt-1">
                {authMethod === 'phone' ? 'Send Phone SMS OTP Code' : 'Continue to Verification'}
              </Button>
            </form>
          </div>
        )}

        {/* STEP 2: 6-Digit OTP Verification */}
        {step === 'verify' && (
          <div className="space-y-4">
            <VerificationCodePanel
              email={authMethod === 'phone' ? phone : email}
              title={authMethod === 'phone' ? 'Verify Mobile Phone' : 'Verify Email Address'}
              subtitle={authMethod === 'phone' ? 'Enter the 6-digit SMS OTP sent to' : 'Enter the 6-digit OTP code sent to'}
              onVerify={handleVerifyCode}
              onResend={async () => {
                const targetIdentifier = authMethod === 'phone' ? phone : email;
                await authService.sendVerificationCode(targetIdentifier, 'register');
              }}
              onBack={() => setStep('form')}
              isLoading={loading}
            />
          </div>
        )}

        {/* STEP 3: Verification Success */}
        {step === 'verified' && (
          <div className="text-center space-y-4 animate-fadeIn py-4">
            <div className="h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-subtle">
              <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400 animate-bounce" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-serif font-normal text-[#171717] dark:text-[#F4F0E6]">Account Created</h3>
              <p className="text-xs text-[#77736B] dark:text-[#A8A49C]">Welcome to SuperMind AI. Redirecting to workspace...</p>
            </div>
          </div>
        )}

        {/* Footer Link */}
        <div className="text-center text-xs text-[#77736B] dark:text-[#A8A49C] pt-3 border-t border-[#DCD6CA] dark:border-[#33312B]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#F05A3C] font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};