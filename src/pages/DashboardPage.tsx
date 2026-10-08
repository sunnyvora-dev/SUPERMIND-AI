import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { ChatComposer } from '../components/chat/ChatComposer';
import { 
  MessageSquare, 
  Image as ImageIcon, 
  Search, 
  FileText, 
  Code, 
  ArrowRight,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Zap,
  Clock,
  Activity
} from 'lucide-react';


export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { conversations, sendPrompt, selectConversation, isThinking, thinkingProgress, activeConvId } = useChat();

  const activeRunningConv = conversations.find((c) => c.id === activeConvId) || conversations[0];


  const quickPrompts = [
    'Explain Kubernetes architecture simply',
    'Create a Spring Boot 3 JWT Security REST API',
    'Research latest multi-LLM consensus models',
    'Generate a futuristic neon cyberpunk skyline image',
  ];

  const actionCards = [
    { 
      title: 'Chat Studio', 
      desc: 'Unified multi-LLM conversational AI workspace', 
      tag: 'GPT-4o / Claude 3.5',
      icon: MessageSquare, 
      path: '/chat', 
      gradient: 'from-indigo-500 via-indigo-400 to-violet-500',
      iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 group-hover:bg-indigo-500/20 group-hover:shadow-indigo-500/25',
      badgeColor: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/20'
    },
    { 
      title: 'Generate Image', 
      desc: 'DALL-E 3 studio rendering & prompt tuning', 
      tag: 'DALL-E 3 / Midjourney',
      icon: ImageIcon, 
      path: '/images', 
      gradient: 'from-purple-500 via-fuchsia-400 to-pink-500',
      iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 group-hover:bg-purple-500/20 group-hover:shadow-purple-500/25',
      badgeColor: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/20'
    },
    { 
      title: 'Deep Research', 
      desc: 'Real-time web search with citations & synthesis', 
      tag: 'Live Web RAG',
      icon: Search, 
      path: '/chat', 
      gradient: 'from-cyan-500 via-sky-400 to-blue-500',
      iconBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 group-hover:bg-cyan-500/20 group-hover:shadow-cyan-500/25',
      badgeColor: 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/20'
    },
    { 
      title: 'Analyze Document', 
      desc: 'PDF, DOCX & structured text RAG extraction', 
      tag: 'Doc Parsing',
      icon: FileText, 
      path: '/documents', 
      gradient: 'from-amber-500 via-orange-400 to-yellow-500',
      iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 group-hover:bg-amber-500/20 group-hover:shadow-amber-500/25',
      badgeColor: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/20'
    },
    { 
      title: 'Write Code', 
      desc: 'Refactoring, debugging & architecture suggestions', 
      tag: 'Multi-Language',
      icon: Code, 
      path: '/chat', 
      gradient: 'from-emerald-500 via-teal-400 to-cyan-500',
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 group-hover:bg-emerald-500/20 group-hover:shadow-emerald-500/25',
      badgeColor: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20'
    },
  ];

  const handleComposeSend = async (promptText: string) => {
    navigate('/chat');
    await sendPrompt(promptText);
  };






  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8 relative">
      {/* Ambient background light spotlight */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="space-y-1 text-left">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
              Good morning, <span className="gradient-text-indigo">{user?.name.split(' ')[0] || 'User'}</span> 👋
            </h1>
            <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-gradient-to-r dark:from-indigo-500/20 dark:to-purple-500/20 text-indigo-600 dark:text-indigo-300 font-semibold text-xs border border-indigo-200 dark:border-indigo-500/30 flex items-center gap-1.5 shadow-xs">
              <Zap className="h-3 w-3 text-indigo-500 dark:text-indigo-400 animate-pulse" />
              {user?.planTier || 'Pro'} Tier
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-normal">
            Orchestrate multi-LLM workflows, generate assets, or analyze code with SuperMind AI.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs flex items-center gap-2 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
            <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">Supervisor Engine Online</span>
          </span>
        </div>
      </div>

      {/* Active Running Chat Indicator Banner */}
      {isThinking && (
        <div className="w-full p-4.5 rounded-2xl bg-gradient-to-r from-indigo-900/60 via-purple-900/50 to-slate-900/90 border border-indigo-500/50 backdrop-blur-xl shadow-lg shadow-indigo-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 animate-fade-in text-left">
          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center space-x-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30 flex items-center gap-1.5 text-[11px] animate-pulse">
                <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
                ACTIVE CHAT GENERATING
              </span>
              {thinkingProgress && (
                <span className="text-slate-400 text-[11px] font-mono">
                  Step {thinkingProgress.step}/3: {thinkingProgress.label}
                </span>
              )}
            </div>
            <div className="text-sm font-bold text-white truncate">
              {activeRunningConv?.title || 'Processing AI Request...'}
            </div>
            <div className="text-xs text-slate-300 truncate font-normal">
              {activeRunningConv?.lastMessage || 'SuperMind AI Orchestrator is executing your prompt...'}
            </div>
          </div>

          <button
            onClick={() => {
              if (activeRunningConv) selectConversation(activeRunningConv.id);
              navigate('/chat');
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center space-x-2 shrink-0 shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
          >

            <Activity className="h-4 w-4 animate-spin text-indigo-200" />
            <span>View Active Chat</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main AI Composer */}
      <div className="space-y-3 w-full relative z-10">
        <ChatComposer onSend={handleComposeSend} />

        {/* Quick Sample Suggestions */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto text-xs pt-1">
          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-indigo-500 dark:text-indigo-400" /> Suggestions:
          </span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleComposeSend(qp)}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-indigo-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/90 hover:text-indigo-600 dark:hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all text-[11px] shadow-xs cursor-pointer"
            >
              {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Action Cards Grid */}
      <div className="space-y-4 w-full text-left relative z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Quick Actions</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-[10px] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 font-normal">
              5 Workspaces
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4.5 items-stretch">
          {actionCards.map((act, idx) => {
            const Icon = act.icon;
            return (
              <button
                key={idx}
                onClick={() => navigate(act.path)}
                className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 hover:border-indigo-500/40 hover:bg-slate-50 dark:hover:bg-slate-900/90 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1.5 text-left transition-all duration-300 cursor-pointer overflow-hidden space-y-4 shadow-xs"
              >
                {/* Top subtle hover accent gradient bar */}
                <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${act.gradient} opacity-40 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${act.iconBg} transition-all duration-300 shadow-xs`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors tracking-tight">
                      {act.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                      {act.desc}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-medium border ${act.badgeColor} transition-colors`}>
                    {act.tag}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Conversations & Token Accounting */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t border-slate-200 dark:border-white/10 w-full items-start text-left relative z-10">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Recent Sessions</span>
            </h3>
            <button
              onClick={() => navigate('/history')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {conversations.slice(0, 3).map((conv) => {
              const isSessionRunning = isThinking && conv.id === activeConvId;
              return (
                <button
                  key={conv.id}
                  onClick={() => {
                    selectConversation(conv.id);
                    navigate('/history');
                  }}
                  className={`w-full p-4 rounded-2xl bg-white dark:bg-slate-900/60 backdrop-blur-xl border ${
                    isSessionRunning ? 'border-indigo-500/60 shadow-md shadow-indigo-500/10' : 'border-slate-200 dark:border-white/10'
                  } hover:border-indigo-500/40 hover:bg-slate-50 dark:hover:bg-slate-900/80 hover:-translate-y-0.5 text-left transition-all duration-200 flex items-center justify-between shadow-xs group cursor-pointer`}
                >
                  <div className="space-y-1 min-w-0 pr-4">
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 truncate transition-colors flex items-center gap-2">
                      <span>{conv.title}</span>
                      {isSessionRunning && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-semibold text-[10px] border border-indigo-500/30 flex items-center gap-1 animate-pulse shrink-0">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping" />
                          GENERATING
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-normal">
                      {conv.lastMessage}
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </button>
              );
            })}
          </div>
        </div>


        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Token Accounting</span>
          </h3>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 space-y-4 shadow-xs">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Monthly Usage</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {((user?.tokensUsed || 0) / 1000).toFixed(0)}k / {((user?.tokenBudget || 5000000) / 1000000).toFixed(0)}M
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-white/10 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-transparent">
              <div
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 h-full rounded-full transition-all duration-500 shadow-xs"
                style={{ width: `${Math.min(100, ((user?.tokensUsed || 0) / (user?.tokenBudget || 5000000)) * 100)}%` }}
              />
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" /> SLA: 99.8%
              </span>
              <button
                onClick={() => navigate('/analytics')}
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline cursor-pointer"
              >
                Analytics Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
