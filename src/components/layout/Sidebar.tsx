import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  Home, 
  MessageSquare,
  History, 
  FileText, 
  Image as ImageIcon, 
  BarChart2, 
  Star, 
  Settings, 
  HelpCircle, 
  ShieldAlert, 
  LogOut 
} from 'lucide-react';


export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { conversations, selectConversation, createNewChat } = useChat();
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: Home },
    { label: 'Chat Studio', path: '/chat', icon: MessageSquare },
    { label: 'History', path: '/history', icon: History },
    { label: 'Documents', path: '/documents', icon: FileText },
    { label: 'Images', path: '/images', icon: ImageIcon },
    { label: 'Analytics', path: '/analytics', icon: BarChart2 },
  ];

  const favorites = conversations.filter((c) => c.favorite);

  return (
    <aside className="w-64 bg-[#EAE5D9] dark:bg-[#141413] border-r border-[#DCD6CA] dark:border-[#2E2D29] flex flex-col h-full select-none shrink-0 transition-colors duration-200">
      {/* Brand Logo Header */}
      <div className="p-4 border-b border-[#DCD6CA] dark:border-[#2E2D29] flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-3 text-left focus:outline-none group cursor-pointer"
        >
          <div className="h-9 w-9 rounded-lg bg-[#F05A3C] text-white font-bold flex items-center justify-center text-sm shadow-sm font-serif">
            S
          </div>
          <div>
            <div className="font-serif font-medium text-lg tracking-tight text-[#171717] dark:text-[#F4F0E6] leading-none group-hover:text-[#F05A3C] transition-colors">
              SuperMind
            </div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#77736B] dark:text-[#8E8A81] mt-1">
              AI Orchestrator
            </div>
          </div>
        </button>
      </div>

      {/* New Prompt Session CTA */}
      <div className="p-3 border-b border-[#DCD6CA] dark:border-[#2E2D29]">
        <button
          onClick={() => {
            createNewChat();
            navigate('/chat');
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-[#F05A3C] hover:bg-[#D94528] text-white font-medium text-xs flex items-center justify-center space-x-2 shadow-sm border border-[#F05A3C] hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Prompt Session</span>
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => {
                  if (item.path === '/chat') {
                    createNewChat();
                  }
                  navigate(item.path);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all relative cursor-pointer ${
                  isActive
                    ? 'bg-[#FAF8F3] dark:bg-[#1E1E1C] text-[#171717] dark:text-[#F4F0E6] font-medium border-l-2 border-[#F05A3C] pl-2.5 shadow-sm'
                    : 'text-[#77736B] hover:text-[#171717] dark:hover:text-[#F4F0E6] hover:bg-[#FAF8F3]/60 dark:hover:bg-[#1E1E1C]/60'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-[#F05A3C]' : 'text-[#77736B]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Favorites */}
        {favorites.length > 0 && (
          <div className="pt-2 border-t border-[#DCD6CA] dark:border-[#2E2D29] space-y-1">
            <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#77736B] flex items-center gap-1 font-semibold">
              <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> Favorites
            </div>
            {favorites.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  selectConversation(c.id);
                  navigate(`/chat/${c.id}`);
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-[#171717] dark:text-[#D2CFC7] hover:bg-[#FAF8F3] dark:hover:bg-[#1E1E1C] truncate block cursor-pointer transition-colors"
              >
                {c.title}
              </button>
            ))}
          </div>
        )}

        {/* Secondary Navigation */}
        <div className="pt-2 border-t border-[#DCD6CA] dark:border-[#2E2D29] space-y-1">
          <button
            onClick={() => navigate('/settings')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              location.pathname === '/settings' ? 'bg-[#FAF8F3] dark:bg-[#1E1E1C] text-[#171717] dark:text-[#F4F0E6] font-medium border-l-2 border-[#F05A3C] pl-2.5' : 'text-[#77736B] hover:text-[#171717] dark:hover:text-[#F4F0E6] hover:bg-[#FAF8F3]/60 dark:hover:bg-[#1E1E1C]/60'
            }`}
          >
            <Settings className="h-4 w-4 text-[#77736B]" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => navigate('/help')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              location.pathname === '/help' ? 'bg-[#FAF8F3] dark:bg-[#1E1E1C] text-[#171717] dark:text-[#F4F0E6] font-medium border-l-2 border-[#F05A3C] pl-2.5' : 'text-[#77736B] hover:text-[#171717] dark:hover:text-[#F4F0E6] hover:bg-[#FAF8F3]/60 dark:hover:bg-[#1E1E1C]/60'
            }`}
          >
            <HelpCircle className="h-4 w-4 text-[#77736B]" />
            <span>Help & FAQ</span>
          </button>

          {user?.role === 'ADMIN' && (
            <button
              onClick={() => navigate('/admin')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                location.pathname === '/admin' ? 'bg-[#FAF8F3] dark:bg-[#1E1E1C] text-[#171717] dark:text-[#F4F0E6] font-medium border-l-2 border-[#F05A3C] pl-2.5' : 'text-[#77736B] hover:text-[#171717] dark:hover:text-[#F4F0E6] hover:bg-[#FAF8F3]/60 dark:hover:bg-[#1E1E1C]/60'
              }`}
            >
              <ShieldAlert className="h-4 w-4 text-[#F05A3C]" />
              <span>Admin Dashboard</span>
            </button>
          )}
        </div>
      </div>

      {/* User Profile Footer */}
      {user && (
        <div className="p-3 border-t border-[#DCD6CA] dark:border-[#2E2D29] flex items-center justify-between bg-[#FAF8F3] dark:bg-[#1E1E1C]">
          <button
            onClick={() => navigate('/profile')}
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
            onClick={logout}
            className="p-1.5 text-[#77736B] hover:text-[#F05A3C] hover:bg-[#EAE5D9] dark:hover:bg-[#2A2925] rounded-lg transition-colors ml-1 cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      )}
    </aside>
  );
};
