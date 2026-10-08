import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { ChatMessage } from '../components/chat/ChatMessage';
import { ChatComposer } from '../components/chat/ChatComposer';
import { TaskDetailsPanel } from '../components/chat/TaskDetailsPanel';
import { TaskDetails } from '../types';
import { Bot, Sparkles, Activity } from 'lucide-react';

export const ChatPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    messages, 
    isThinking, 
    thinkingProgress, 
    sendPrompt, 
    selectConversation,
    conversations 
  } = useChat();

  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) selectConversation(id);
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking, thinkingProgress]);

  const activeConv = conversations.find((c) => c.id === id);
  const latestMessageWithTrace = messages.find((m) => m.supervisorTrace);
  const currentTaskDetails: TaskDetails | null = latestMessageWithTrace?.supervisorTrace || null;

  return (
    <div className="flex h-full w-full overflow-hidden relative justify-center">
      {/* Main Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
        {/* Chat Header */}
        <div className="px-4 md:px-6 py-3 bg-[#0B0F1F]/90 border-b border-white/10 flex items-center justify-between shadow-xs shrink-0">
          <div>
            <h2 className="text-sm font-bold text-white truncate">
              {activeConv?.title || 'New Prompt Session'}
            </h2>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Supervisor Engine • {activeConv?.modelUsed || 'Auto (Supervisor AI)'}</span>
            </div>
          </div>

          <button
            onClick={() => setShowTaskDetails(!showTaskDetails)}
            className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              showTaskDetails
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Task Trace</span>
          </button>
        </div>



        {/* Message Stream Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 w-full">
          {messages.length === 0 && !isThinking && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto py-16">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-600 text-white font-bold flex items-center justify-center text-xl shadow-lg shadow-indigo-500/30">
                <Bot className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-white">Ask SuperMind anything</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your request automatically routes to candidate models without manual switching.
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onToggleTaskDetails={() => setShowTaskDetails(true)}
            />
          ))}

          {/* Supervisor Thinking Progress */}
          {isThinking && (
            <div className="flex space-x-3.5 max-w-6xl xl:max-w-7xl mx-auto justify-start animate-fade-in w-full px-2 sm:px-4">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-md">

                <Bot className="h-4 w-4 animate-pulse" />
              </div>
              <div className="flex-1 bg-[#0B0F1F]/90 border border-indigo-500/30 p-4 rounded-2xl text-slate-200 shadow-lg space-y-2">
                <div className="flex items-center space-x-2 text-xs text-indigo-400 font-semibold">
                  <Sparkles className="h-4 w-4 animate-spin" />
                  <span>SuperMind is thinking...</span>
                </div>
                {thinkingProgress && (
                  <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-[10px]">
                      STAGE {thinkingProgress.step}/5
                    </span>
                    <span>{thinkingProgress.label}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Fixed Bottom Input Composer */}
        <div className="border-t border-white/10 bg-[#0B0F1F]/80 backdrop-blur-xl w-full flex justify-center">
          <ChatComposer onSend={(prompt) => sendPrompt(prompt)} disabled={isThinking} />
        </div>
      </div>

      {/* Task Details Drawer */}
      {showTaskDetails && (
        <TaskDetailsPanel
          taskDetails={currentTaskDetails}
          onClose={() => setShowTaskDetails(false)}
        />
      )}
    </div>
  );
};
