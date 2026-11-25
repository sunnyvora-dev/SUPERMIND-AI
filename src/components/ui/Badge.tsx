import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className = '' }) => {
  const variantStyles = {
    default: 'bg-[#F05A3C]/10 text-[#F05A3C] border-[#F05A3C]/25',
    success: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
    warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25',
    error: 'bg-[#F05A3C]/10 text-[#F05A3C] border-[#F05A3C]/25',
    info: 'bg-[#2457D6]/10 text-[#2457D6] dark:text-[#4D7DFA] border-[#2457D6]/25',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
