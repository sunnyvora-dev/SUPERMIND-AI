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
    'inline-flex items-center justify-center font-medium tracking-tight transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F05A3C]/40 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

  const variantClasses = {
    primary:
      'bg-[#F05A3C] hover:bg-[#D94528] text-white shadow-sm border border-[#F05A3C] hover:shadow-[#F05A3C]/20',
    secondary:
      'bg-[#2457D6] hover:bg-[#1B44B0] text-white shadow-sm border border-[#2457D6]',
    outline:
      'bg-transparent hover:bg-[#EAE5D9] dark:hover:bg-[#23221F] border border-[#DCD6CA] dark:border-[#33312B] text-[#171717] dark:text-[#F4F0E6]',
    ghost:
      'hover:bg-[#EAE5D9] dark:hover:bg-[#23221F] text-[#77736B] hover:text-[#171717] dark:hover:text-[#F4F0E6]',
    danger:
      'bg-[#F05A3C] hover:bg-[#D94528] text-white shadow-sm border border-[#F05A3C]',
  };

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 rounded-lg min-h-[34px] gap-1.5',
    md: 'text-xs md:text-sm px-4 py-2 rounded-xl min-h-[40px] gap-2',
    lg: 'text-sm md:text-base px-5 py-2.5 rounded-xl min-h-[46px] gap-2.5',
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
