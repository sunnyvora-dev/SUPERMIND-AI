import { Conversation, Message } from '../types';
import { API_CONFIG } from './apiConfig';
import { authService } from './authService';

export const chatService = {
  getStoredLocalConversations(): Conversation[] {
    try {
      const stored = localStorage.getItem('supermind_local_conversations');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveLocalConversations(list: Conversation[]) {
    try {
      localStorage.setItem('supermind_local_conversations', JSON.stringify(list));
    } catch {}
  },

  getStoredLocalMessages(convId: string): Message[] {
    try {
      const stored = localStorage.getItem(`supermind_local_messages_${convId}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveLocalMessages(convId: string, msgs: Message[]) {
    try {
      localStorage.setItem(`supermind_local_messages_${convId}`, JSON.stringify(msgs));
    } catch {}
  },

  async getConversations(): Promise<Conversation[]> {
    const token = authService.getToken();
    const localList = this.getStoredLocalConversations();

    if (!token) return localList;

    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const remoteList: Conversation[] = await res.json();
        this.saveLocalConversations(remoteList);
        return remoteList;
      }
    } catch (err) {}

    return localList;
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const token = authService.getToken();
    const localMsgs = this.getStoredLocalMessages(conversationId);

    if (!token) return localMsgs;

    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/messages/conversation/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const remoteMsgs: Message[] = await res.json();
        this.saveLocalMessages(conversationId, remoteMsgs);
        return remoteMsgs;
      }
    } catch (err) {}

    return localMsgs;
  },

  async sendPrompt(
    prompt: string,
    conversationId?: string,
    onProgress?: (step: number, label: string) => void
  ): Promise<{ conversation: Conversation; message: Message }> {
    const token = authService.getToken();
    if (!token) throw new Error('Unauthorized session. Please login again.');

    if (onProgress) {
      onProgress(1, 'Understanding request & classifying intent...');
      await new Promise((r) => setTimeout(r, 150));
      onProgress(2, 'Building task plan & capability requirements...');
      await new Promise((r) => setTimeout(r, 150));
      onProgress(3, 'Selecting optimal AI providers...');
      await new Promise((r) => setTimeout(r, 150));
      onProgress(4, 'Dispatching to NestJS Supervisor Engine...');
    }

    const res = await fetch(`${API_CONFIG.BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: prompt,
        conversationId,
      }),
    });

    if (onProgress) {
      onProgress(5, 'Quality audit & markdown synthesis complete.');
    }

    if (res.status === 401) {
      await authService.logout();
      window.location.reload();
      throw new Error('Your session has expired. Please log in again.');
    }

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Chat service failed to process request');
    }

    // Persist new response to local storage immediately
    if (data.conversation?.id) {
      const currentLocalConvs = this.getStoredLocalConversations();
      const updatedList = [data.conversation, ...currentLocalConvs.filter((c) => c.id !== data.conversation.id)];
      this.saveLocalConversations(updatedList);

      if (data.message) {
        const existingMsgs = this.getStoredLocalMessages(data.conversation.id);
        this.saveLocalMessages(data.conversation.id, [...existingMsgs, data.message]);
      }
    }

    return {
      conversation: data.conversation,
      message: data.message,
    };
  },


  async deleteConversation(id: string): Promise<void> {
    const token = authService.getToken();
    if (!token) return;

    await fetch(`${API_CONFIG.BASE_URL}/conversations/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async renameConversation(id: string, newTitle: string): Promise<void> {
    const token = authService.getToken();
    if (!token) return;

    await fetch(`${API_CONFIG.BASE_URL}/conversations/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTitle }),
    });
  },

  async toggleFavorite(id: string): Promise<boolean> {
    const token = authService.getToken();
    if (!token) return false;

    const conversations = await this.getConversations();
    const target = conversations.find((c) => c.id === id);
    const newFav = target ? !target.favorite : true;

    const res = await fetch(`${API_CONFIG.BASE_URL}/conversations/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ favorite: newFav }),
    });

    if (!res.ok) return false;
    const updated = await res.json();
    return updated.favorite;
  },
};

