import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileDrawer } from './MobileDrawer';
import { Toast } from '../ui/Toast';
import { CommandPaletteModal } from '../modals/CommandPaletteModal';
import { useChat } from '../../context/ChatContext';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toastMessage } = useChat();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F4F0E6] dark:bg-[#121212] text-[#171717] dark:text-[#F4F0E6] transition-colors duration-200 select-none relative font-sans">
      {/* Subtle architectural atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-20">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#EAE5D9] dark:bg-[#201F1C] rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#EAE5D9] dark:bg-[#201F1C] rounded-full blur-3xl" />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full shrink-0 relative z-20">
        <Sidebar />
      </div>

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#FAF8F3] dark:bg-[#171717] border-l border-[#DCD6CA] dark:border-[#2E2D29] relative z-10 transition-colors duration-200">
        <Topbar />
        <main className="flex-1 overflow-y-auto relative w-full flex flex-col items-center">
          {children}
        </main>
      </div>

      {/* Mobile Navigation Drawer */}
      <MobileDrawer />

      {/* Global Quick Search / Command Palette Modal */}
      <CommandPaletteModal />

      {/* Global Toast Notifications */}
      <Toast message={toastMessage} />
    </div>
  );
};
