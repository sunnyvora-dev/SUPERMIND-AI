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
  title = "Verify Your Identity",
  subtitle = `Enter the 6-digit verification code sent to`,
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
    <div className="space-y-6 animate-fadeIn text-left">
      {onBack && (
        <button
          onClick={onBack}
          type="button"
          className="inline-flex items-center text-xs font-medium text-[#77736B] hover:text-[#171717] dark:hover:text-[#F4F0E6] transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back to form
        </button>
      )}

      <div className="text-center space-y-2">
        <div className="h-12 w-12 rounded-xl bg-[#F05A3C]/10 border border-[#F05A3C]/20 text-[#F05A3C] flex items-center justify-center mx-auto">
          <ShieldCheck className="h-6 w-6 text-[#F05A3C]" />
        </div>
        <h3 className="text-xl font-serif font-normal text-[#171717] dark:text-[#F4F0E6] tracking-tight">{title}</h3>
        <p className="text-xs text-[#77736B] dark:text-[#A8A49C]">
          {subtitle} <span className="font-mono text-[#F05A3C] font-semibold">{email}</span>
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-[#F05A3C]/10 border border-[#F05A3C]/30 text-[#F05A3C] text-xs flex items-center justify-center space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {verifiedSuccess ? (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
          <ShieldCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
          <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Code Verified Successfully</div>
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
                className={`w-11 h-13 text-center text-xl font-mono font-medium rounded-xl border outline-none transition-all shadow-subtle ${
                  digit
                    ? 'border-[#F05A3C] bg-[#F4F0E6] dark:bg-[#171717] text-[#171717] dark:text-[#F4F0E6] ring-2 ring-[#F05A3C]/20'
                    : 'border-[#DCD6CA] dark:border-[#33312B] bg-[#EAE5D9]/40 dark:bg-[#171717] text-[#171717] dark:text-[#F4F0E6] focus:border-[#F05A3C] focus:ring-2 focus:ring-[#F05A3C]/20'
                }`}
              />
            ))}
          </div>

          <Button type="submit" isLoading={isLoading} variant="primary" className="w-full">
            Verify Code & Proceed
          </Button>
        </form>
      )}

      <div className="text-center space-y-1 text-xs">
        <p className="text-[#77736B] dark:text-[#A8A49C]">Didn't receive the verification code?</p>
        <button
          onClick={handleResendClick}
          disabled={!canResend || resending}
          type="button"
          className={`inline-flex items-center font-medium transition-all ${
            canResend && !resending
              ? 'text-[#F05A3C] hover:underline cursor-pointer'
              : 'text-[#77736B] cursor-not-allowed opacity-60'
          }`}
        >
          {resending ? (
            <>
              <RefreshCw className="h-3 w-3 mr-1 animate-spin" /> Sending...
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