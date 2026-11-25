import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171717]/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#DCD6CA] dark:border-[#33312B] pb-3">
          {title && <h3 className="text-lg font-medium font-serif text-[#171717] dark:text-[#F4F0E6] tracking-tight">{title}</h3>}
          <button
            onClick={onClose}
            className="p-1.5 text-[#77736B] hover:text-[#171717] dark:hover:text-[#F4F0E6] rounded-lg hover:bg-[#EAE5D9] dark:hover:bg-[#2A2925] transition-colors ml-auto cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="text-[#171717] dark:text-[#F4F0E6]">{children}</div>
      </div>
    </div>
  );
};
