import React from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: { type: 'success' | 'error' | 'info'; text: string } | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  const icons = {
    success: <CheckCircle className="h-4 w-4 text-emerald-500" />,
    error: <AlertCircle className="h-4 w-4 text-[#F05A3C]" />,
    info: <Info className="h-4 w-4 text-[#2457D6]" />,
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-2.5 px-4 py-3 bg-[#171717] dark:bg-[#FAF8F3] text-[#F4F0E6] dark:text-[#171717] border border-[#33312B] dark:border-[#DCD6CA] rounded-xl shadow-2xl text-xs font-medium animate-fadeIn">
      {icons[message.type]}
      <span>{message.text}</span>
    </div>
  );
};
