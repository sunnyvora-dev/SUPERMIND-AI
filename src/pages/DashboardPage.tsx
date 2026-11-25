import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { ChatComposer } from '../components/chat/ChatComposer';
import { Zap, Activity, ArrowRight } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { conversations, sendPrompt, selectConversation, createNewChat, isThinking, thinkingProgress, activeConvId } = useChat();

  const activeRunningConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const handleComposeSend = async (promptText: string) => {
    createNewChat();
    navigate('/chat');
    await sendPrompt(promptText, null);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center p-4 md:p-8 max-w-4xl mx-auto w-full text-center space-y-8 animate-fadeIn relative">
      {/* Centered Greeting & Engine Status Header */}
      <div className="space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] text-xs shadow-2xs font-mono text-[11px]">
          <span className="h-2 w-2 rounded-full bg-[#C7D83D] animate-pulse" />
          <span className="text-[#171717] dark:text-[#D2CFC7]">Supervisor Engine Online</span>
          <span className="text-[#DCD6CA] dark:text-[#33312B]">•</span>
          <span className="text-[#F05A3C] font-semibold flex items-center gap-1">
            <Zap className="h-3 w-3" />
            {user?.planTier || 'Pro'} Tier
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-[#171717] dark:text-[#F4F0E6] tracking-tight leading-[1.15]">
          Good morning, <span className="italic text-[#F05A3C]">{user?.name.split(' ')[0] || 'User'}</span>
        </h1>

        <p className="text-xs md:text-sm text-[#77736B] dark:text-[#A8A49C] font-normal leading-relaxed max-w-lg mx-auto">
          One prompt dispatches seamlessly across candidate foundation models with automatic synthesis and verification.
        </p>
      </div>

      {/* Active Running Chat Indicator Banner (if generating) */}
      {isThinking && (
        <div className="w-full max-w-2xl p-4.5 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#F05A3C] shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left animate-fadeIn">
          <div className="space-y-1 min-w-0 flex-1">
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
          </div>

          <button
            onClick={() => {
              if (activeRunningConv) selectConversation(activeRunningConv.id);
              navigate('/chat');
            }}
            className="px-4 py-2 rounded-xl bg-[#F05A3C] hover:bg-[#D94528] text-white font-medium text-xs flex items-center justify-center space-x-2 shrink-0 shadow-sm transition-all cursor-pointer border border-[#F05A3C]"
          >
            <Activity className="h-3.5 w-3.5 animate-spin text-white" />
            <span>View Active Chat</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Centered Main AI Composer */}
      <div className="w-full max-w-3xl mx-auto text-left">
        <ChatComposer onSend={handleComposeSend} />
      </div>
    </div>
  );
};