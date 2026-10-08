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
  sendPrompt: (prompt: string) => Promise<void>;


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
  const [conversations, setConversations] = useState<Conversation[]>([]);
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
    if (!activeConvId && list.length > 0) {
      setActiveConvId(list[0].id);
      const msgs = await chatService.getMessages(list[0].id);
      setMessages(msgs);
    }
  };

  useEffect(() => {
    reloadConversations();
  }, []);

  const selectConversation = async (id: string) => {
    setActiveConvId(id);
    const msgs = await chatService.getMessages(id);
    setMessages(msgs);
    setIsMobileDrawerOpen(false);
  };

  const sendPrompt = async (prompt: string) => {
    if (!prompt.trim() || isThinking) return;
    setIsThinking(true);
    try {
      const { conversation, message } = await chatService.sendPrompt(
        prompt,
        activeConvId || undefined,
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

  const deleteConv = async (id: string) => {
    await chatService.deleteConversation(id);
    const list = await chatService.getConversations();
    setConversations(list);
    if (activeConvId === id) {
      if (list.length > 0) selectConversation(list[0].id);
      else createNewChat();
    }
    showToast('Conversation deleted', 'info');
  };

  const renameConv = async (id: string, title: string) => {
    await chatService.renameConversation(id, title);
    reloadConversations();
    showToast('Conversation renamed', 'success');
  };

  const toggleFav = async (id: string) => {
    await chatService.toggleFavorite(id);
    reloadConversations();
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
