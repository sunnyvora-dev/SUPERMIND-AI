import React from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: { type: 'success' | 'error' | 'info'; text: string } | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  const icons = {
    success: <CheckCircle className="h-4 w-4 text-emerald-500" />,
    error: <AlertCircle className="h-4 w-4 text-red-500" />,
    info: <Info className="h-4 w-4 text-cyan-500" />,
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-2.5 px-4 py-3 bg-slate-900 text-white border border-slate-800 rounded-xl shadow-xl text-xs font-medium animate-bounce">
      {icons[message.type]}
      <span>{message.text}</span>
    </div>
  );
};
