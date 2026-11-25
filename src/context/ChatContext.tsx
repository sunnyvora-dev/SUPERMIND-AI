import React, { createContext, useContext, useState, useEffect } from 'react';
import { Conversation, Message } from '../types';
import { chatService } from '../services/chatService';

interface ChatContextType {
  conversations: Conversation[];
  activeConvId: string | null;
  messages: Message[];
  isThinking: boolean;
  thinkingProgress: { step: number; label: string } | null;
  selectConversation: (id: string) => Promise<void>;
  sendPrompt: (prompt: string, overrideConvId?: string | null) => Promise<void>;
  createNewChat: () => void;
  deleteConv: (id: string) => Promise<void>;
  renameConv: (id: string, title: string) => Promise<void>;
  toggleFav: (id: string) => Promise<void>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isMobileDrawerOpen: boolean;
  setIsMobileDrawerOpen: (open: boolean) => void;
  activeModal: string | null;
  setActiveModal: (m: string | null) => void;
  toastMessage: { type: 'success' | 'error' | 'info'; text: string } | null;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Instant Fast-Start: Initialize conversations list from local cache
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    return chatService.getStoredLocalConversations();
  });
  // Default to a fresh new chat session (null activeConvId, empty messages)
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingProgress, setThinkingProgress] = useState<{ step: number; label: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const reloadConversations = async () => {
    const list = await chatService.getConversations();
    setConversations(list);
  };

  useEffect(() => {
    reloadConversations();
  }, []);

  // Fast Select: Display cached messages instantly (0ms), then revalidate in background
  const selectConversation = async (id: string) => {
    setActiveConvId(id);
    const cachedMsgs = chatService.getStoredLocalMessages(id);
    if (cachedMsgs.length > 0) {
      setMessages(cachedMsgs);
    }
    setIsMobileDrawerOpen(false);

    try {
      const freshMsgs = await chatService.getMessages(id);
      setMessages(freshMsgs);
    } catch {}
  };

  const sendPrompt = async (prompt: string, overrideConvId?: string | null) => {
    if (!prompt.trim() || isThinking) return;
    setIsThinking(true);
    try {
      // If overrideConvId === null, explicitly start a brand new conversation
      const targetConvId = overrideConvId === null ? undefined : (overrideConvId || activeConvId || undefined);
      const { conversation, message } = await chatService.sendPrompt(
        prompt,
        targetConvId,
        (step, label) => setThinkingProgress({ step, label })
      );

      const list = await chatService.getConversations();
      setConversations(list);
      setActiveConvId(conversation.id);
      const msgs = await chatService.getMessages(conversation.id);
      setMessages(msgs);
    } catch (e: any) {
      showToast(e.message || 'Error processing request', 'error');
    } finally {
      setIsThinking(false);
      setThinkingProgress(null);
    }
  };

  const createNewChat = () => {
    setActiveConvId(null);
    setMessages([]);
    setIsMobileDrawerOpen(false);
  };

  // Optimistic Delete: Immediate UI removal (0ms) + background sync
  const deleteConv = async (id: string) => {
    const updated = conversations.filter((c) => c.id !== id);
    setConversations(updated);
    chatService.saveLocalConversations(updated);
    if (activeConvId === id) {
      if (updated.length > 0) {
        selectConversation(updated[0].id);
      } else {
        createNewChat();
      }
    }
    showToast('Conversation deleted', 'info');
    await chatService.deleteConversation(id);
  };

  // Optimistic Rename: Immediate UI title change (0ms) + background sync
  const renameConv = async (id: string, title: string) => {
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    const updated = conversations.map((c) => (c.id === id ? { ...c, title: cleanTitle } : c));
    setConversations(updated);
    chatService.saveLocalConversations(updated);
    showToast('Conversation renamed', 'success');
    await chatService.renameConversation(id, cleanTitle);
  };

  // Optimistic Toggle Favorite: Immediate star update (0ms) + background sync
  const toggleFav = async (id: string) => {
    const updated = conversations.map((c) => (c.id === id ? { ...c, favorite: !c.favorite } : c));
    setConversations(updated);
    chatService.saveLocalConversations(updated);
    await chatService.toggleFavorite(id);
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConvId,
        messages,
        isThinking,
        thinkingProgress,
        selectConversation,
        sendPrompt,
        createNewChat,
        deleteConv,
        renameConv,
        toggleFav,
        searchQuery,
        setSearchQuery,
        isMobileDrawerOpen,
        setIsMobileDrawerOpen,
        activeModal,
        setActiveModal,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};
