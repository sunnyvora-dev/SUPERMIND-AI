import { DocumentItem } from '../types';
import { API_CONFIG } from './apiConfig';
import { authService } from './authService';

export const documentService = {
  async getDocuments(): Promise<DocumentItem[]> {
    const token = authService.getToken();
    if (!token) return [];

    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/documents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.map((d: any) => ({
        id: d.id,
        name: d.filename,
        type: d.filename.split('.').pop()?.toUpperCase() || 'TXT',
        sizeBytes: d.fileSize,
        uploadedAt: d.createdAt,
        status: 'Ready',
        summary: `Parsed file ${d.filename}. Ready for SuperMind RAG context.`,
      }));
    } catch (err) {
      return [];
    }
  },

  async uploadDocument(file: File): Promise<DocumentItem> {
    const token = authService.getToken();
    if (!token) throw new Error('Unauthorized');

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_CONFIG.BASE_URL}/files/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'File upload failed');
    }

    return {
      id: data.documentId,
      name: data.filename,
      type: data.filename.split('.').pop()?.toUpperCase() || 'TXT',
      sizeBytes: data.fileSize,
      uploadedAt: data.createdAt,
      status: 'Ready',
      summary: `Uploaded ${data.filename} (${Math.ceil(data.fileSize / 1024)} KB) successfully.`,
      text: data.text || '',
    };
  },

  async searchDocuments(query: string, topK = 4): Promise<Array<{ chunkId: string; documentId: string; filename: string; pageNumber: number; content: string; score: number }>> {
    const token = authService.getToken();
    if (!token) return [];

    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/documents/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query, topK }),
      });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  async deleteDocument(id: string): Promise<void> {
    const token = authService.getToken();
    if (token) {
      try {
        await fetch(`${API_CONFIG.BASE_URL}/documents/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.warn('Failed to delete document on server:', err);
      }
    }

    const stored = localStorage.getItem('supermind_documents');
    if (stored) {
      const filtered = JSON.parse(stored).filter((d: any) => d.id !== id);
      localStorage.setItem('supermind_documents', JSON.stringify(filtered));
    }
  },
};
