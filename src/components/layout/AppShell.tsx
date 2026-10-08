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
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-[#030712] text-slate-900 dark:text-slate-100 transition-colors duration-200 select-none relative font-sans">
      {/* Background ambient lighting mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 dark:bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 dark:bg-purple-600/10 rounded-full blur-[160px]" />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full shrink-0 relative z-20">
        <Sidebar />
      </div>

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white/80 dark:bg-[#090d1a]/70 backdrop-blur-3xl relative z-10 transition-colors duration-200">
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
