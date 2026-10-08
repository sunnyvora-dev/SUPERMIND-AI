import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold tracking-tight transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer hover:scale-[1.02] active:scale-[0.97]';

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 border border-indigo-400/30',
    secondary:
      'bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-xl text-slate-100 border border-white/10 hover:border-indigo-500/30 shadow-sm',
    outline:
      'bg-white/5 backdrop-blur-xl border border-white/10 hover:border-indigo-500/40 hover:bg-white/10 text-slate-200 shadow-sm',
    ghost:
      'hover:bg-white/10 text-slate-300 hover:text-white',
    danger:
      'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-600/25 border border-red-500/30',
  };

  const sizeClasses = {
    sm: 'text-xs px-3.5 py-1.5 rounded-xl min-h-[36px] gap-1.5',
    md: 'text-sm px-4.5 py-2.5 rounded-xl min-h-[44px] gap-2',
    lg: 'text-base px-6 py-3 rounded-2xl min-h-[50px] gap-2.5',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Processing...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
