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
    <aside className="w-64 bg-slate-50 dark:bg-[#0B0F1F] border-r border-slate-200 dark:border-white/10 flex flex-col h-full select-none shrink-0 transition-colors duration-200">
      {/* Brand Logo Header */}
      <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-3 text-left focus:outline-none group cursor-pointer"
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-indigo-500/25">
            S
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white leading-none group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              SuperMind
            </div>
            <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-1">
              AI Orchestrator
            </div>
          </div>
        </button>
      </div>

      {/* New Prompt Session CTA */}
      <div className="p-3 border-b border-slate-200 dark:border-white/10">
        <button
          onClick={() => {
            createNewChat();
            navigate('/chat');
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.97] transition-all cursor-pointer"
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
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all relative cursor-pointer ${
                  isActive
                    ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold border-l-2 border-indigo-600 dark:border-indigo-500 pl-2.5 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Favorites */}
        {favorites.length > 0 && (
          <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-1">
            <div className="px-3 py-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> Favorites
            </div>
            {favorites.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  selectConversation(c.id);
                  navigate(`/chat/${c.id}`);
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/5 truncate block cursor-pointer"
              >
                {c.title}
              </button>
            ))}
          </div>
        )}

        {/* Secondary Navigation */}
        <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-1">
          <button
            onClick={() => navigate('/settings')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              location.pathname === '/settings' ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Settings className="h-4 w-4 text-slate-400" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => navigate('/help')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              location.pathname === '/help' ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <HelpCircle className="h-4 w-4 text-slate-400" />
            <span>Help & FAQ</span>
          </button>

          {user?.role === 'ADMIN' && (
            <button
              onClick={() => navigate('/admin')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                location.pathname === '/admin' ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <ShieldAlert className="h-4 w-4 text-amber-500" />
              <span>Admin Dashboard</span>
            </button>
          )}
        </div>
      </div>

      {/* User Profile Footer */}
      {user && (
        <div className="p-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-100/80 dark:bg-black/20">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center space-x-2.5 min-w-0 flex-1 text-left cursor-pointer"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-semibold text-xs flex items-center justify-center shrink-0 shadow-xs">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-200 truncate">{user.name}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.email}</div>
            </div>
          </button>

          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-200/60 dark:hover:bg-white/10 rounded-lg transition-colors ml-1 cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      )}
    </aside>
  );
};
