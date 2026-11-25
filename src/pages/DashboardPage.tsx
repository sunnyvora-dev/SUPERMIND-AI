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
  const { conversations, sendPrompt, selectConversation, createNewChat, isThinking, thinkingProgress, activeConvId } = useChat();

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
      accentColor: '#F05A3C',
      accentBg: 'bg-[#F05A3C]/10 text-[#F05A3C] border-[#F05A3C]/20',
      badgeColor: 'bg-[#F05A3C]/10 text-[#F05A3C] border-[#F05A3C]/25'
    },
    { 
      title: 'Generate Image', 
      desc: 'DALL-E 3 studio rendering & prompt tuning', 
      tag: 'DALL-E 3 / Midjourney',
      icon: ImageIcon, 
      path: '/images', 
      accentColor: '#2457D6',
      accentBg: 'bg-[#2457D6]/10 text-[#2457D6] border-[#2457D6]/20',
      badgeColor: 'bg-[#2457D6]/10 text-[#2457D6] dark:text-[#4D7DFA] border-[#2457D6]/25'
    },
    { 
      title: 'Deep Research', 
      desc: 'Real-time web search with citations & synthesis', 
      tag: 'Live Web RAG',
      icon: Search, 
      path: '/chat', 
      accentColor: '#C7D83D',
      accentBg: 'bg-[#C7D83D]/15 text-[#171717] dark:text-[#C7D83D] border-[#C7D83D]/30',
      badgeColor: 'bg-[#C7D83D]/15 text-[#171717] dark:text-[#C7D83D] border-[#C7D83D]/30'
    },
    { 
      title: 'Analyze Document', 
      desc: 'PDF, DOCX & structured text RAG extraction', 
      tag: 'Doc Parsing',
      icon: FileText, 
      path: '/documents', 
      accentColor: '#D97706',
      accentBg: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
      badgeColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25'
    },
    { 
      title: 'Write Code', 
      desc: 'Refactoring, debugging & architecture suggestions', 
      tag: 'Multi-Language',
      icon: Code, 
      path: '/chat', 
      accentColor: '#171717',
      accentBg: 'bg-[#171717]/10 dark:bg-[#FAF8F3]/10 text-[#171717] dark:text-[#F4F0E6] border-[#DCD6CA] dark:border-[#33312B]',
      badgeColor: 'bg-[#FAF8F3] dark:bg-[#252421] text-[#171717] dark:text-[#F4F0E6] border-[#DCD6CA] dark:border-[#33312B]'
    },
  ];

  const handleComposeSend = async (promptText: string) => {
    createNewChat();
    navigate('/chat');
    await sendPrompt(promptText, null);
  };

  const handleActionClick = (path: string) => {
    if (path === '/chat') {
      createNewChat();
    }
    navigate(path);
  };






  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8 relative">
      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="space-y-1 text-left">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl md:text-4xl font-serif font-medium text-[#171717] dark:text-[#F4F0E6] tracking-tight">
              Good morning, <span className="italic text-[#F05A3C]">{user?.name.split(' ')[0] || 'User'}</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-md bg-[#EAE5D9] dark:bg-[#252421] text-[#171717] dark:text-[#F4F0E6] font-mono text-[11px] font-medium border border-[#DCD6CA] dark:border-[#33312B] flex items-center gap-1.5 shadow-2xs">
              <Zap className="h-3 w-3 text-[#F05A3C]" />
              {user?.planTier || 'Pro'} Tier
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#77736B] font-normal">
            Orchestrate multi-LLM workflows, generate visual assets, or analyze code with SuperMind AI.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1.5 rounded-full bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] text-[#171717] dark:text-[#D2CFC7] text-xs flex items-center gap-2 shadow-2xs font-mono text-[11px]">
            <span className="h-2 w-2 rounded-full bg-[#C7D83D] animate-pulse" />
            <span>Supervisor Engine Online</span>
          </span>
        </div>
      </div>

      {/* Active Running Chat Indicator Banner */}
      {isThinking && (
        <div className="w-full p-4.5 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#F05A3C] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 animate-fadeIn text-left">
          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center space-x-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-md bg-[#F05A3C]/10 text-[#F05A3C] font-mono font-medium border border-[#F05A3C]/30 flex items-center gap-1.5 text-[11px]">
                <span className="h-2 w-2 rounded-full bg-[#F05A3C] animate-ping" />
                ACTIVE CHAT GENERATING
              </span>
              {thinkingProgress && (
                <span className="text-[#77736B] text-[11px] font-mono">
                  Step {thinkingProgress.step}/3: {thinkingProgress.label}
                </span>
              )}
            </div>
            <div className="text-sm font-serif font-medium text-[#171717] dark:text-[#F4F0E6] truncate">
              {activeRunningConv?.title || 'Processing AI Request...'}
            </div>
            <div className="text-xs text-[#77736B] truncate font-normal">
              {activeRunningConv?.lastMessage || 'SuperMind AI Orchestrator is executing your prompt...'}
            </div>
          </div>

          <button
            onClick={() => {
              if (activeRunningConv) selectConversation(activeRunningConv.id);
              navigate('/chat');
            }}
            className="px-4 py-2 rounded-xl bg-[#F05A3C] hover:bg-[#D94528] text-white font-medium text-xs flex items-center justify-center space-x-2 shrink-0 shadow-sm transition-all cursor-pointer border border-[#F05A3C]"
          >
            <Activity className="h-4 w-4 animate-spin text-white" />
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
          <span className="text-[#77736B] text-[11px] font-medium flex items-center gap-1 font-mono uppercase tracking-wider">
            <Sparkles className="h-3 w-3 text-[#F05A3C]" /> Suggestions:
          </span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleComposeSend(qp)}
              className="px-3 py-1.5 rounded-full bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] text-[#171717] dark:text-[#D2CFC7] hover:border-[#F05A3C] hover:text-[#F05A3C] transition-all text-[11px] shadow-2xs cursor-pointer font-medium"
            >
              {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Action Cards Grid */}
      <div className="space-y-4 w-full text-left relative z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-serif font-medium text-[#171717] dark:text-[#F4F0E6] tracking-tight flex items-center gap-2">
            <span>Quick Workspaces</span>
            <span className="px-2 py-0.5 rounded-md bg-[#EAE5D9] dark:bg-[#252421] text-[10px] text-[#77736B] border border-[#DCD6CA] dark:border-[#33312B] font-mono">
              5 Engines
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4.5 items-stretch">
          {actionCards.map((act, idx) => {
            const Icon = act.icon;
            return (
              <button
                key={idx}
                onClick={() => handleActionClick(act.path)}
                className="group relative flex flex-col justify-between p-5 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] hover:border-[#F05A3C] hover:shadow-md text-left transition-all duration-200 cursor-pointer overflow-hidden space-y-4 shadow-2xs"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${act.accentBg} transition-all duration-200 shadow-2xs`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[#77736B] group-hover:text-[#F05A3C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-150" />
                  </div>

                  <div className="space-y-1">
                    <div className="font-serif font-medium text-base text-[#171717] dark:text-[#F4F0E6] group-hover:text-[#F05A3C] transition-colors tracking-tight">
                      {act.title}
                    </div>
                    <div className="text-xs text-[#77736B] leading-relaxed font-normal">
                      {act.desc}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-mono font-medium border ${act.badgeColor} transition-colors`}>
                    {act.tag}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Conversations & Token Accounting */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t border-[#DCD6CA] dark:border-[#2E2D29] w-full items-start text-left relative z-10">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif font-medium text-[#171717] dark:text-[#F4F0E6] tracking-tight flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#F05A3C]" />
              <span>Recent Sessions</span>
            </h3>
            <button
              onClick={() => navigate('/history')}
              className="text-xs font-medium text-[#F05A3C] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
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
                  className={`w-full p-4 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border ${
                    isSessionRunning ? 'border-[#F05A3C] shadow-sm' : 'border-[#DCD6CA] dark:border-[#33312B]'
                  } hover:border-[#F05A3C] hover:shadow-xs text-left transition-all duration-150 flex items-center justify-between shadow-2xs group cursor-pointer`}
                >
                  <div className="space-y-1 min-w-0 pr-4">
                    <div className="text-xs font-semibold text-[#171717] dark:text-[#F4F0E6] group-hover:text-[#F05A3C] truncate transition-colors flex items-center gap-2">
                      <span>{conv.title}</span>
                      {isSessionRunning && (
                        <span className="px-2 py-0.5 rounded-md bg-[#F05A3C]/10 text-[#F05A3C] font-mono font-medium text-[10px] border border-[#F05A3C]/30 flex items-center gap-1 shrink-0">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#F05A3C] animate-ping" />
                          GENERATING
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#77736B] truncate font-normal">
                      {conv.lastMessage}
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-[#77736B] shrink-0 px-2.5 py-1 rounded-md bg-[#EAE5D9] dark:bg-[#252421] border border-[#DCD6CA] dark:border-[#33312B]">
                    {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-serif font-medium text-[#171717] dark:text-[#F4F0E6] tracking-tight flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Token Accounting</span>
          </h3>
          <div className="p-5 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] space-y-4 shadow-2xs">
            <div className="flex justify-between text-xs">
              <span className="text-[#77736B] font-medium">Monthly Usage</span>
              <span className="font-mono font-semibold text-[#F05A3C]">
                {((user?.tokensUsed || 0) / 1000).toFixed(0)}k / {((user?.tokenBudget || 5000000) / 1000000).toFixed(0)}M
              </span>
            </div>
            <div className="w-full bg-[#EAE5D9] dark:bg-[#252421] h-2 rounded-full overflow-hidden p-0.5 border border-[#DCD6CA] dark:border-[#33312B]">
              <div
                className="bg-[#F05A3C] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, ((user?.tokensUsed || 0) / (user?.tokenBudget || 5000000)) * 100)}%` }}
              />
            </div>

            <div className="pt-3 border-t border-[#DCD6CA] dark:border-[#33312B] flex items-center justify-between text-xs text-[#77736B]">
              <span className="flex items-center gap-1.5 font-medium font-mono text-[11px]">
                <span className="h-2 w-2 rounded-full bg-[#C7D83D] animate-pulse" /> SLA: 99.8%
              </span>
              <button
                onClick={() => navigate('/analytics')}
                className="text-[#2457D6] dark:text-[#4D7DFA] font-medium hover:underline cursor-pointer"
              >
                Telemetry Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
