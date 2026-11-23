import React, { useState, useEffect } from 'react';
import { documentService } from '../services/documentService';
import { DocumentItem } from '../types';
import { FileText, Upload, Trash2, Search, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ chunkId: string; documentId: string; filename: string; pageNumber: number; content: string; score: number }>>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    documentService.getDocuments().then(setDocuments);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setErrorMsg(null);

    // Max 50 MB limit
    if (file.size > 50 * 1024 * 1024) {
      setErrorMsg(`File "${file.name}" is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 50 MB.`);
      return;
    }

    setIsUploading(true);
    try {
      await documentService.uploadDocument(file);
      const list = await documentService.getDocuments();
      setDocuments(list);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await documentService.deleteDocument(id);
    const list = await documentService.getDocuments();
    setDocuments(list);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await documentService.searchDocuments(searchQuery);
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Document RAG Studio</h1>
        <p className="text-xs text-slate-400 mt-1">Upload PDF, DOCX, or TXT documents for SuperMind AI context extraction & hybrid vector retrieval</p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium">
          {errorMsg}
        </div>
      )}

      {/* Upload Drag & Drop Area */}
      <div className="p-8 rounded-3xl border-2 border-dashed border-indigo-500/30 bg-[#0B0F1F]/80 backdrop-blur-2xl text-center space-y-4 hover:border-indigo-500/60 transition-all shadow-xl shadow-indigo-500/5">
        <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20 shadow-md">
          <Upload className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Drop your documents here or browse</h3>
          <p className="text-xs text-slate-400 mt-1">Supports PDF, DOCX, TXT up to 50MB per file</p>
        </div>

        <div>
          <Button onClick={() => fileInputRef.current?.click()} isLoading={isUploading} size="sm">
            <span>Select Document</span>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            accept=".pdf,.docx,.txt"
            className="hidden"
          />
        </div>
      </div>

      {/* Interactive RAG Vector Search Bar */}
      {documents.length > 0 && (
        <div className="p-5 rounded-2xl bg-[#0B0F1F]/80 backdrop-blur-2xl border border-white/10 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            <span>Semantic Vector & Hybrid Keyword Search</span>
          </div>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask or query your uploaded knowledge base (e.g. 'project codename', 'key terms')..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <Button type="submit" size="sm" isLoading={isSearching}>
              <span>Search Chunks</span>
            </Button>
          </form>

          {searchResults.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="text-[11px] font-semibold text-slate-400">
                Found {searchResults.length} matching vector {searchResults.length === 1 ? 'chunk' : 'chunks'}:
              </div>
              <div className="space-y-2">
                {searchResults.map((res) => (
                  <div key={res.chunkId} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-bold text-indigo-400 flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5" />
                        {res.filename} (Page {res.pageNumber})
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">
                        Relevance: {Math.round(res.score * 100)}%
                      </span>
                    </div>
                    <p className="text-slate-300 font-mono text-[11px] leading-relaxed whitespace-pre-wrap bg-black/20 p-2 rounded-lg">
                      {res.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Documents List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white">Uploaded Knowledge Base ({documents.length})</h3>

        {documents.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#0B0F1F]/80 backdrop-blur-2xl border border-white/10 text-center space-y-2">
            <FileText className="h-8 w-8 text-slate-500 mx-auto" />
            <div className="text-sm font-semibold text-slate-300">No documents uploaded yet</div>
            <p className="text-xs text-slate-400">Upload files to enable contextual search and RAG Q&A.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-2xl bg-[#0B0F1F]/80 backdrop-blur-2xl border border-white/10 hover:border-indigo-500/40 flex items-center justify-between transition-all shadow-sm"
              >
                <div className="flex items-center space-x-3 min-w-0 pr-4">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center font-mono text-xs font-bold shrink-0 border border-indigo-500/20">
                    {doc.type}
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="text-xs font-bold text-white truncate">{doc.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{doc.summary || `${Math.ceil(doc.sizeBytes / 1024)} KB`}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-medium">
                    ● Ready
                  </span>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-white/10"
                    title="Delete Document"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
