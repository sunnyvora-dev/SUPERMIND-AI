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
    <header className="h-16 px-4 md:px-6 bg-[#FAF8F3] dark:bg-[#171717] border-b border-[#DCD6CA] dark:border-[#2E2D29] flex items-center justify-between sticky top-0 z-30 transition-colors duration-200">
      {/* Mobile Drawer Trigger & Logo */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="md:hidden p-2 rounded-xl text-[#77736B] hover:text-[#171717] dark:hover:text-[#F4F0E6] hover:bg-[#EAE5D9] dark:hover:bg-[#23221F] transition-colors cursor-pointer"
          title="Open Navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <button onClick={() => navigate('/dashboard')} className="flex items-center space-x-2 md:hidden cursor-pointer">
          <div className="h-8 w-8 rounded-lg bg-[#F05A3C] text-white font-bold flex items-center justify-center text-xs shadow-sm font-serif">
            S
          </div>
          <span className="font-serif font-medium text-base text-[#171717] dark:text-[#F4F0E6] tracking-tight">SuperMind</span>
        </button>

        {/* Model Status Pill */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-[#EAE5D9] dark:bg-[#23221F] rounded-full border border-[#DCD6CA] dark:border-[#33312B] text-xs text-[#171717] dark:text-[#D2CFC7]">
          <Cpu className="h-3.5 w-3.5 text-[#2457D6]" />
          <span>Supervisor Routing: <strong className="text-[#171717] dark:text-[#F4F0E6] font-medium">Auto (Optimal LLM)</strong></span>
          <span className="h-2 w-2 rounded-full bg-[#C7D83D] animate-pulse ml-1" />
        </div>
      </div>

      {/* Command Search, Theme, Notifications & Profile */}
      <div className="flex items-center space-x-2 sm:space-x-2.5">
        {/* Mobile Search Icon */}
        <button
          onClick={() => setActiveModal('command')}
          className="sm:hidden p-2 rounded-xl text-[#77736B] hover:bg-[#EAE5D9] dark:hover:bg-[#23221F] hover:text-[#171717] dark:hover:text-[#F4F0E6] transition-colors cursor-pointer"
          title="Search"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Desktop Command Search */}
        <button
          onClick={() => setActiveModal('command')}
          className="hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-[#EAE5D9] dark:bg-[#23221F] border border-[#DCD6CA] dark:border-[#33312B] text-xs text-[#77736B] dark:text-[#A8A49C] hover:text-[#171717] dark:hover:text-[#F4F0E6] hover:border-[#F05A3C]/40 transition-all cursor-pointer"
        >
          <Search className="h-3.5 w-3.5 text-[#F05A3C]" />
          <span className="font-medium">Search</span>
          <span className="px-1.5 py-0.5 rounded bg-[#FAF8F3] dark:bg-[#171717] text-[10px] text-[#171717] dark:text-[#F4F0E6] font-mono flex items-center gap-0.5 border border-[#DCD6CA] dark:border-[#33312B]">
            <Command className="h-2.5 w-2.5" /> K
          </span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-xl text-[#77736B] hover:bg-[#EAE5D9] dark:hover:bg-[#23221F] hover:text-[#171717] dark:hover:text-[#F4F0E6] transition-colors cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 text-[#C7D83D]" /> : <Moon className="h-4 w-4 text-[#2457D6]" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-[#77736B] hover:bg-[#EAE5D9] dark:hover:bg-[#23221F] hover:text-[#171717] dark:hover:text-[#F4F0E6] transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#F05A3C]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] rounded-2xl shadow-xl p-3.5 z-50 text-xs space-y-2.5">
              <div className="font-serif font-medium text-[#171717] dark:text-[#F4F0E6] border-b border-[#DCD6CA] dark:border-[#33312B] pb-2 flex items-center justify-between">
                <span>Notifications</span>
                <span className="text-[10px] text-[#F05A3C] font-mono font-medium">2 unread</span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-[#EAE5D9] dark:bg-[#252421] space-y-1 hover:border-[#F05A3C] transition-colors">
                    <div className="font-medium text-[#171717] dark:text-[#F4F0E6]">{n.title}</div>
                    <div className="text-[10px] text-[#77736B] font-mono">{n.time}</div>
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
            className="h-8 w-8 rounded-lg bg-[#171717] dark:bg-[#F4F0E6] text-[#F4F0E6] dark:text-[#171717] font-semibold text-xs flex items-center justify-center shadow-sm ml-1 hover:opacity-90 transition-opacity cursor-pointer font-serif"
            title={user.name}
          >
            {user.name.slice(0, 2).toUpperCase()}
          </button>
        )}
      </div>
    </header>
  );
};
