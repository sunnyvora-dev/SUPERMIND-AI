import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useChat } from '../../context/ChatContext';
import { 
  Menu, 
  Sun, 
  Moon, 
  Bell, 
  Search, 
  Cpu, 
  Sparkles,
  Command
} from 'lucide-react';

export const Topbar: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { setIsMobileDrawerOpen, setActiveModal } = useChat();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Supervisor Engine v1.0 Active', time: '2m ago' },
    { id: 2, title: 'DeepSeek R1 Model Status: Healthy', time: '1h ago' },
  ];

  return (
    <header className="h-16 px-4 md:px-6 bg-white/90 dark:bg-[#090d1a]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 flex items-center justify-between sticky top-0 z-30 transition-colors duration-200">
      {/* Mobile Drawer Trigger & Logo */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="md:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          title="Open Navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <button onClick={() => navigate('/dashboard')} className="flex items-center space-x-2 md:hidden cursor-pointer">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-bold flex items-center justify-center text-xs shadow-md shadow-indigo-500/20 font-display">
            S
          </div>
          <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight font-display">SuperMind</span>
        </button>

        {/* Model Status Pill */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-900/80 rounded-full border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 shadow-xs">
          <Cpu className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Supervisor Routing: <strong className="text-slate-900 dark:text-white font-semibold">Auto (Optimal LLM)</strong></span>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
        </div>      </div>



      {/* Command Search, Theme, Notifications & Profile */}
      <div className="flex items-center space-x-2.5">
        <button
          onClick={() => setActiveModal('command')}
          className="hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-indigo-500/40 transition-all cursor-pointer shadow-xs"
        >
          <Search className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="font-medium">Search</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[10px] text-slate-700 dark:text-slate-300 font-mono flex items-center gap-0.5">
            <Command className="h-2.5 w-2.5" /> K
          </span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-3.5 z-50 text-xs space-y-2.5 backdrop-blur-xl">
              <div className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-2 flex items-center justify-between">
                <span>Notifications</span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">2 unread</span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 space-y-1 hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{n.title}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        {user && (
          <button
            onClick={() => navigate('/profile')}
            className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-indigo-500/20 ml-1 hover:scale-105 transition-transform cursor-pointer font-display"
            title={user.name}
          >
            {user.name.slice(0, 2).toUpperCase()}
          </button>
        )}
      </div>
    </header>
  );
};
