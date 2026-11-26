import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { X, Plus, Home, MessageSquare, History, FileText, Image as ImageIcon, BarChart2, Settings, HelpCircle, ShieldAlert, LogOut } from 'lucide-react';

export const MobileDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { isMobileDrawerOpen, setIsMobileDrawerOpen, createNewChat } = useChat();
  const { user, logout } = useAuth();

  if (!isMobileDrawerOpen) return null;

  const items = [
    { label: 'Dashboard', path: '/dashboard', icon: Home },
    { label: 'Chat Studio', path: '/chat', icon: MessageSquare },
    { label: 'History', path: '/history', icon: History },
    { label: 'Documents', path: '/documents', icon: FileText },
    { label: 'Images', path: '/images', icon: ImageIcon },
    { label: 'Analytics', path: '/analytics', icon: BarChart2 },
    { label: 'Settings', path: '/settings', icon: Settings },
    { label: 'Help', path: '/help', icon: HelpCircle },
    ...(user?.role && ['SUPER_ADMIN', 'ADMIN', 'SUPPORT', 'FINANCE', 'VIEWER'].includes(user.role)
      ? [{ label: 'Admin Console', path: '/admin', icon: ShieldAlert }]
      : []),
  ];


  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        onClick={() => setIsMobileDrawerOpen(false)}
        className="fixed inset-0 bg-[#171717]/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative w-72 bg-[#FAF8F3] dark:bg-[#141413] h-full flex flex-col z-10 border-r border-[#DCD6CA] dark:border-[#2E2D29] p-4 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#DCD6CA] dark:border-[#2E2D29] pb-3">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-[#F05A3C] text-white font-bold flex items-center justify-center text-xs font-serif shadow-sm">S</div>
            <span className="font-serif font-medium text-base text-[#171717] dark:text-[#F4F0E6] tracking-tight">SuperMind</span>
          </div>
          <button
            onClick={() => setIsMobileDrawerOpen(false)}
            className="p-1 text-[#77736B] hover:text-[#171717] dark:hover:text-[#F4F0E6] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <button
          onClick={() => {
            createNewChat();
            navigate('/chat');
            setIsMobileDrawerOpen(false);
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-[#F05A3C] hover:bg-[#D94528] text-white font-medium text-xs flex items-center justify-center space-x-2 shadow-sm border border-[#F05A3C] cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Prompt Session</span>
        </button>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <button
                key={it.path}
                onClick={() => {
                  if (it.path === '/chat') {
                    createNewChat();
                  }
                  navigate(it.path);
                  setIsMobileDrawerOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium text-[#171717] dark:text-[#D2CFC7] hover:bg-[#EAE5D9] dark:hover:bg-[#23221F] cursor-pointer transition-colors"
              >
                <Icon className="h-4 w-4 text-[#F05A3C]" />
                <span>{it.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile Footer on Mobile */}
        {user && (
          <div className="pt-3 border-t border-[#DCD6CA] dark:border-[#2E2D29] flex items-center justify-between">
            <button
              onClick={() => {
                navigate('/profile');
                setIsMobileDrawerOpen(false);
              }}
              className="flex items-center space-x-2.5 min-w-0 flex-1 text-left cursor-pointer"
            >
              <div className="h-8 w-8 rounded-lg bg-[#171717] dark:bg-[#F4F0E6] text-[#F4F0E6] dark:text-[#171717] font-serif font-semibold text-xs flex items-center justify-center shrink-0 shadow-xs">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-[#171717] dark:text-[#F4F0E6] truncate">{user.name}</div>
                <div className="text-[10px] text-[#77736B] truncate">{user.email}</div>
              </div>
            </button>

            <button
              onClick={async () => {
                setIsMobileDrawerOpen(false);
                await logout();
              }}
              className="p-1.5 text-[#77736B] hover:text-[#F05A3C] hover:bg-[#EAE5D9] dark:hover:bg-[#23221F] rounded-lg transition-colors ml-1 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
