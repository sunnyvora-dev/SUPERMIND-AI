import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { 
  Search, 
  MessageSquare, 
  Star, 
  Edit2, 
  Trash2, 
  Check, 
  Filter, 
  Sparkles 
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { conversations, selectConversation, deleteConv, renameConv, toggleFav, createNewChat } = useChat();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const filtered = conversations.filter((c) => {
    const title = (c.title || '').toLowerCase();
    const lastMsg = (c.lastMessage || '').toLowerCase();
    const q = search.toLowerCase();
    const matchesSearch = title.includes(q) || lastMsg.includes(q);
    const matchesCategory = filterCategory === 'All' || c.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const groupConversations = (list: typeof filtered) => {
    const now = new Date();
    const today: typeof filtered = [];
    const yesterday: typeof filtered = [];
    const last7Days: typeof filtered = [];
    const older: typeof filtered = [];

    list.forEach((conv) => {
      const d = conv.updatedAt ? new Date(conv.updatedAt) : new Date(conv.createdAt || Date.now());
      const diffMs = now.getTime() - d.getTime();
      const diffDays = isNaN(diffMs) ? 0 : Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) today.push(conv);
      else if (diffDays === 1) yesterday.push(conv);
      else if (diffDays <= 7) last7Days.push(conv);
      else older.push(conv);
    });

    return { today, yesterday, last7Days, older };
  };

  const groups = groupConversations(filtered);

  const startRename = (c: typeof filtered[0]) => {
    setEditingId(c.id);
    setEditingTitle(c.title);
  };

  const saveRename = (id: string) => {
    if (editingTitle.trim()) renameConv(id, editingTitle);
    setEditingId(null);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Chat History</h1>
          <p className="text-xs text-slate-500">Manage and search past SuperMind prompt sessions</p>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          {['All', 'Chat', 'Coding', 'Research', 'Images', 'Documents'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                filterCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or message content..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
        />
      </div>

      {/* Grouped History Lists */}
      <div className="space-y-6">
        {filtered.length === 0 && (
          <div className="p-12 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10 text-center space-y-4 bg-white/40 dark:bg-white/5">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center mx-auto shadow-inner">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {search ? `No conversations matching "${search}"` : 'No chat history found'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                {search ? 'Try clearing your search query or selecting another category.' : 'Start a new prompt session in Chat Studio to orchestrate multi-LLM workflows.'}
              </p>
            </div>
            {!search && (
              <button
                onClick={() => {
                  createNewChat();
                  navigate('/chat');
                }}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
              >
                Start New Chat Session
              </button>
            )}
          </div>
        )}

        {[
          { title: 'Today', list: groups.today },
          { title: 'Yesterday', list: groups.yesterday },
          { title: 'Previous 7 Days', list: groups.last7Days },
          { title: 'Older Conversations', list: groups.older },
        ].map((group) => {
          if (group.list.length === 0) return null;
          return (
            <div key={group.title} className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
                {group.title} ({group.list.length})
              </div>

              <div className="space-y-2">
                {group.list.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      selectConversation(c.id);
                      navigate(`/chat/${c.id}`);
                    }}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 flex items-center justify-between transition-all cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3 min-w-0 pr-4">
                      <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center shrink-0">
                        <MessageSquare className="h-4 w-4 text-indigo-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        {editingId === c.id ? (
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-indigo-500 rounded text-xs"
                              autoFocus
                            />
                            <button onClick={() => saveRename(c.id)} className="p-1 text-emerald-500">
                              <Check className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {c.title}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate mt-0.5">{c.lastMessage}</div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hidden sm:inline">
                        {c.modelUsed}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFav(c.id);
                        }}
                        className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ${
                          c.favorite ? 'text-amber-500 fill-amber-500' : 'text-slate-400'
                        }`}
                        title="Favorite"
                      >
                        <Star className="h-4 w-4 fill-current" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startRename(c);
                        }}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Rename"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConv(c.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
