import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../../context/ChatContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Search, 
  MessageSquare, 
  Sparkles, 
  FileText, 
  Image as ImageIcon, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  User, 
  ArrowRight, 
  Command, 
  X,
  Sun,
  Moon,
  PlusCircle
} from 'lucide-react';

interface CommandItem {
  id: string;
  type: 'page' | 'action' | 'chat';
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  action: () => void;
}

export const CommandPaletteModal: React.FC = () => {
  const navigate = useNavigate();
  const { activeModal, setActiveModal, conversations, createNewChat } = useChat();
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const isOpen = activeModal === 'command';

  // Listen for Cmd+K / Ctrl+K keyboard shortcut globally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setActiveModal(isOpen ? null : 'command');
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setActiveModal]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Build searchable commands & items list
  const navigationItems: CommandItem[] = [
    { id: 'nav-dashboard', type: 'page', title: 'Go to Dashboard', subtitle: 'Overview, quick actions, model status', icon: Sparkles, category: 'Navigation', action: () => navigate('/dashboard') },
    { id: 'nav-new-chat', type: 'action', title: 'Start New AI Session', subtitle: 'Open a fresh conversation thread', icon: PlusCircle, category: 'Actions', action: () => { createNewChat(); navigate('/chat/new'); } },
    { id: 'nav-history', type: 'page', title: 'Conversation History', subtitle: 'View past chat logs and sessions', icon: MessageSquare, category: 'Navigation', action: () => navigate('/history') },
    { id: 'nav-documents', type: 'page', title: 'Document Intelligence & RAG', subtitle: 'Upload and query PDF/DOCX files', icon: FileText, category: 'Navigation', action: () => navigate('/documents') },
    { id: 'nav-images', type: 'page', title: 'AI Image Studio', subtitle: 'Generate photorealistic images and art', icon: ImageIcon, category: 'Navigation', action: () => navigate('/images') },
    { id: 'nav-analytics', type: 'page', title: 'Analytics & Usage Metrics', subtitle: 'Token usage, latency, and provider stats', icon: BarChart3, category: 'Navigation', action: () => navigate('/analytics') },
    { id: 'nav-profile', type: 'page', title: 'Profile & Subscription', subtitle: 'Manage plan tier and user details', icon: User, category: 'Navigation', action: () => navigate('/profile') },
    { id: 'nav-settings', type: 'page', title: 'Settings & Model Preferences', subtitle: 'System prompt, temperature, API keys', icon: Settings, category: 'Navigation', action: () => navigate('/settings') },
    { id: 'nav-help', type: 'page', title: 'Help & Documentation', subtitle: 'FAQ, model docs, and platform support', icon: HelpCircle, category: 'Navigation', action: () => navigate('/help') },
    { id: 'nav-terms', type: 'page', title: 'Terms of Service & Conditions', subtitle: 'Platform usage terms and policies', icon: FileText, category: 'Legal', action: () => navigate('/terms') },
    { id: 'nav-privacy', type: 'page', title: 'Privacy Policy & Data Security', subtitle: 'Data encryption, 2FA, and model rules', icon: FileText, category: 'Legal', action: () => navigate('/privacy') },
    { id: 'nav-theme', type: 'action', title: `Toggle Theme (${theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'})`, subtitle: 'Change theme mode', icon: theme === 'dark' ? Sun : Moon, category: 'Preferences', action: () => setTheme(theme === 'dark' ? 'light' : 'dark') },
  ];

  // Conversation items from user history
  const conversationItems: CommandItem[] = conversations.map((c) => ({
    id: `chat-${c.id}`,
    type: 'chat',
    title: c.title,
    subtitle: c.lastMessage,
    icon: MessageSquare,
    category: 'Recent Chats',
    action: () => navigate(`/chat/${c.id}`),
  }));

  const allItems: CommandItem[] = [...navigationItems, ...conversationItems];

  // Filter based on search query
  const filtered = allItems.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase())) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item: CommandItem) => {
    setActiveModal(null);
    item.action();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* Backdrop overlay click handler */}
      <div className="absolute inset-0" onClick={() => setActiveModal(null)} />

      {/* Modal Card */}
      <div className="relative w-full max-w-xl bg-[#0B0F1F] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh] divide-y divide-white/10">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 relative">
          <Search className="h-5 w-5 text-indigo-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search sessions, features, pages..."
            className="w-full bg-transparent border-none outline-none text-sm text-white placeholder-slate-400 font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <span className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-slate-400 px-2 py-1 bg-white/5 rounded-lg border border-white/10 ml-2">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1 max-h-[420px] custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs space-y-1">
              <p className="font-semibold text-slate-300">No matching commands or sessions found</p>
              <p className="text-[11px] text-slate-500">Try searching for "chat", "dashboard", "images", or "settings"</p>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const IconComponent = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-2xl flex items-center justify-between transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className={`p-2 rounded-xl shrink-0 ${
                      isSelected ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400'
                    }`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate tracking-tight">{item.title}</div>
                      {item.subtitle && (
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">{item.subtitle}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 ml-3">
                    <span className="text-[10px] font-medium text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                      {item.category}
                    </span>
                    {isSelected && <ArrowRight className="h-3.5 w-3.5 text-indigo-400" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center space-x-3 font-mono">
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[9px]">↑↓</kbd> Navigate</span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[9px]">↵</kbd> Select</span>
          </div>
          <div className="flex items-center space-x-1 font-semibold text-indigo-400">
            <Command className="h-3 w-3" />
            <span>SuperMind Quick Search</span>
          </div>
        </div>
      </div>
    </div>
  );
};
