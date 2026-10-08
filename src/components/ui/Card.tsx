import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, hoverable = false, className = '', ...props }) => {
  return (
    <div
      className={`p-5 md:p-6 rounded-2xl bg-[#0B0F1F]/80 backdrop-blur-2xl border border-white/10 shadow-xl shadow-indigo-500/5 ${
        hoverable
          ? 'hover:border-indigo-500/50 hover:shadow-indigo-500/15 hover:-translate-y-1 transition-all duration-200 cursor-pointer'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
