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
        <h1 className="text-2xl md:text-3xl font-serif font-medium text-[#171717] dark:text-[#F4F0E6] tracking-tight">Document RAG Studio</h1>
        <p className="text-xs text-[#77736B] mt-1">Upload PDF, DOCX, or TXT documents for SuperMind AI context extraction & hybrid vector retrieval</p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-[#F05A3C]/10 border border-[#F05A3C]/30 text-xs text-[#F05A3C] font-medium">
          {errorMsg}
        </div>
      )}

      {/* Upload Drag & Drop Area */}
      <div className="p-8 rounded-2xl border-2 border-dashed border-[#DCD6CA] dark:border-[#33312B] bg-[#FAF8F3] dark:bg-[#1E1E1C] text-center space-y-4 hover:border-[#F05A3C] transition-all shadow-2xs">
        <div className="h-12 w-12 rounded-xl bg-[#EAE5D9] dark:bg-[#252421] text-[#F05A3C] flex items-center justify-center mx-auto border border-[#DCD6CA] dark:border-[#33312B] shadow-2xs">
          <Upload className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-base font-serif font-medium text-[#171717] dark:text-[#F4F0E6]">Drop your documents here or browse</h3>
          <p className="text-xs text-[#77736B] mt-1">Supports PDF, DOCX, TXT up to 50MB per file</p>
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
        <div className="p-5 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] space-y-3 shadow-2xs">
          <div className="flex items-center space-x-2 text-xs font-mono font-medium text-[#F05A3C] uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            <span>Semantic Vector & Hybrid Keyword Search</span>
          </div>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#77736B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask or query your uploaded knowledge base (e.g. 'project codename', 'key terms')..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#EAE5D9] dark:bg-[#252421] border border-[#DCD6CA] dark:border-[#33312B] text-xs text-[#171717] dark:text-[#F4F0E6] placeholder-[#77736B] focus:outline-none focus:border-[#F05A3C]"
              />
            </div>
            <Button type="submit" size="sm" isLoading={isSearching}>
              <span>Search Chunks</span>
            </Button>
          </form>

          {searchResults.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#DCD6CA] dark:border-[#33312B]">
              <div className="text-[11px] font-semibold text-[#77736B]">
                Found {searchResults.length} matching vector {searchResults.length === 1 ? 'chunk' : 'chunks'}:
              </div>
              <div className="space-y-2">
                {searchResults.map((res) => (
                  <div key={res.chunkId} className="p-3 rounded-xl bg-[#EAE5D9]/60 dark:bg-[#252421] border border-[#DCD6CA] dark:border-[#33312B] space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-[#77736B]">
                      <span className="font-semibold text-[#2457D6] dark:text-[#4D7DFA] flex items-center gap-1.5 font-mono">
                        <BookOpen className="h-3.5 w-3.5" />
                        {res.filename} (Page {res.pageNumber})
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px]">
                        Relevance: {Math.round(res.score * 100)}%
                      </span>
                    </div>
                    <p className="text-[#171717] dark:text-[#D2CFC7] font-mono text-[11px] leading-relaxed whitespace-pre-wrap bg-[#FAF8F3] dark:bg-[#1E1E1C] p-2 rounded-lg border border-[#DCD6CA] dark:border-[#33312B]">
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
        <h3 className="font-serif font-medium text-base text-[#171717] dark:text-[#F4F0E6]">Uploaded Knowledge Base ({documents.length})</h3>

        {documents.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] text-center space-y-2 shadow-2xs">
            <FileText className="h-8 w-8 text-[#77736B] mx-auto" />
            <div className="text-sm font-serif font-medium text-[#171717] dark:text-[#F4F0E6]">No documents uploaded yet</div>
            <p className="text-xs text-[#77736B]">Upload files to enable contextual search and RAG Q&A.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] hover:border-[#F05A3C] flex items-center justify-between transition-all shadow-2xs"
              >
                <div className="flex items-center space-x-3 min-w-0 pr-4">
                  <div className="h-10 w-10 rounded-xl bg-[#EAE5D9] dark:bg-[#252421] text-[#F05A3C] flex items-center justify-center font-mono text-xs font-bold shrink-0 border border-[#DCD6CA] dark:border-[#33312B]">
                    {doc.type}
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="text-xs font-semibold text-[#171717] dark:text-[#F4F0E6] truncate">{doc.name}</div>
                    <div className="text-[11px] text-[#77736B] truncate">{doc.summary || `${Math.ceil(doc.sizeBytes / 1024)} KB`}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
                    ● Ready
                  </span>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-1.5 text-[#77736B] hover:text-[#F05A3C] rounded-lg hover:bg-[#EAE5D9] dark:hover:bg-[#252421] cursor-pointer"
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
