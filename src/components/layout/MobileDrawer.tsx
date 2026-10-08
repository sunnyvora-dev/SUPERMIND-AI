import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../../context/ChatContext';
import { X, Plus, Home, MessageSquare, History, FileText, Image as ImageIcon, BarChart2, Settings, HelpCircle, ShieldAlert } from 'lucide-react';

export const MobileDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { isMobileDrawerOpen, setIsMobileDrawerOpen, createNewChat } = useChat();

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
    { label: 'Admin Dashboard', path: '/admin', icon: ShieldAlert },
  ];


  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        onClick={() => setIsMobileDrawerOpen(false)}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative w-72 bg-white dark:bg-slate-900 h-full flex flex-col z-10 border-r border-slate-200 dark:border-slate-800 p-4 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">S</div>
            <span className="font-extrabold text-slate-900 dark:text-white">SuperMind</span>
          </div>
          <button
            onClick={() => setIsMobileDrawerOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <button
          onClick={() => {
            createNewChat();
            navigate('/dashboard');
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 text-white font-medium text-xs flex items-center justify-center space-x-2 shadow-sm"
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
                  navigate(it.path);
                  setIsMobileDrawerOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Icon className="h-4 w-4 text-indigo-500" />
                <span>{it.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
