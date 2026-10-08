import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';

interface VerificationCodePanelProps {
  email: string;
  title?: string;
  subtitle?: string;
  onVerify: (code: string) => Promise<boolean>;
  onResend?: () => Promise<void>;
  onBack?: () => void;
  isLoading?: boolean;
}

export const VerificationCodePanel: React.FC<VerificationCodePanelProps> = ({
  email,
  title = "Verify Your Email",
  subtitle = `We sent a 6-digit verification code to`,
  onVerify,
  onResend,
  onBack,
  isLoading = false,
}) => {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    let interval: any = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    if (!cleanValue && value !== '') return;

    const newCode = [...code];
    newCode[index] = cleanValue.slice(-1);
    setCode(newCode);
    setError('');

    if (cleanValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((digit) => digit !== '')) {
      handleAutoVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pastedData) return;

    const newCode = Array(6).fill('');
    pastedData.split('').forEach((char, idx) => {
      if (idx < 6) newCode[idx] = char;
    });

    setCode(newCode);
    setError('');

    const lastFilledIdx = Math.min(pastedData.length, 5);
    inputRefs.current[lastFilledIdx]?.focus();

    if (pastedData.length === 6) {
      handleAutoVerify(pastedData);
    }
  };

  const handleAutoVerify = async (fullCode: string) => {
    try {
      const isValid = await onVerify(fullCode);
      if (isValid) {
        setVerifiedSuccess(true);
      } else {
        setError('Invalid verification code. Please check and try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }
    await handleAutoVerify(fullCode);
  };

  const handleResendClick = async () => {
    if (!canResend || resending) return;
    setResending(true);
    setError('');
    try {
      if (onResend) {
        await onResend();
      }
      setTimer(60);
      setCanResend(false);
    } catch (err: any) {
      setError(err.message || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {onBack && (
        <button
          onClick={onBack}
          type="button"
          className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
        </button>
      )}

      <div className="text-center space-y-2">
        <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
          <ShieldCheck className="h-6 w-6 text-indigo-400 animate-pulse" />
        </div>
        <h3 className="text-xl font-extrabold text-white tracking-tight">{title}</h3>
        <p className="text-xs text-slate-400">
          {subtitle} <span className="font-semibold text-indigo-300">{email}</span>
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center justify-center space-x-2 animate-shake">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {verifiedSuccess ? (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
          <ShieldCheck className="h-8 w-8 text-emerald-400 mx-auto animate-bounce" />
          <div className="text-sm font-bold text-emerald-400">Code Verified Successfully!</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {code.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`w-11 h-13 text-center text-xl font-bold bg-white/5 border rounded-xl text-white outline-none transition-all shadow-sm ${
                  digit
                    ? 'border-indigo-500 ring-2 ring-indigo-500/30 bg-indigo-500/10'
                    : 'border-white/10 hover:border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                }`}
              />
            ))}
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full">
            Verify Code
          </Button>
        </form>
      )}

      <div className="text-center space-y-1 text-xs">
        <p className="text-slate-400">Didn't receive the code?</p>
        <button
          onClick={handleResendClick}
          disabled={!canResend || resending}
          type="button"
          className={`inline-flex items-center font-semibold transition-all ${
            canResend && !resending
              ? 'text-indigo-400 hover:text-indigo-300 underline cursor-pointer'
              : 'text-slate-600 cursor-not-allowed'
          }`}
        >
          {resending ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" /> Resending...
            </>
          ) : canResend ? (
            'Resend Code'
          ) : (
            `Resend code in ${timer}s`
          )}
        </button>
      </div>
    </div>
  );
};
