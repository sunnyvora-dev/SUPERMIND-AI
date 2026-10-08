import React, { useState, useRef } from 'react';
import { Send, Paperclip, Mic, Sparkles, Command, X, FileText } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { documentService } from '../../services/documentService';


interface ChatComposerProps {
  onSend: (prompt: string, files?: File[]) => void;
  disabled?: boolean;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({ onSend, disabled = false }) => {
  const { isThinking } = useChat();
  const [prompt, setPrompt] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setAttachedFiles((prev) => [...prev, ...newFiles]);
    }
    // Reset file input value so the same file can be re-selected if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (indexToRemove: number) => {
    setAttachedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSend = async () => {
    if ((!prompt.trim() && attachedFiles.length === 0) || disabled || isThinking) return;

    let finalPrompt = prompt.trim();
    if (attachedFiles.length > 0) {
      const extractedTexts: string[] = [];

      for (const file of attachedFiles) {
        // Upload to Document RAG Studio store for vector index search
        try {
          await documentService.uploadDocument(file);
        } catch (e) {
          // Fallback read text
        }

        const isBinaryDoc = file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.pdf') || file.name.toLowerCase().endsWith('.doc');

        if (isBinaryDoc) {
          extractedTexts.push(`[Attached Document: ${file.name} (${Math.round(file.size / 1024)} KB)]`);
        } else {
          // Read text files (.txt, .json, .csv, .js, .py, .md) directly
          try {
            const text = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve((e.target?.result as string) || '');
              reader.onerror = () => resolve('');
              reader.readAsText(file);
            });

            if (text.trim() && !text.includes('PK\x03\x04')) {
              extractedTexts.push(`[Document Context: ${file.name}]\n${text.slice(0, 15000)}`);
            } else {
              extractedTexts.push(`[Attached Document: ${file.name} (${Math.round(file.size / 1024)} KB)]`);
            }
          } catch {
            extractedTexts.push(`[Attached Document: ${file.name}]`);
          }
        }
      }


      const fileContextStr = extractedTexts.join('\n\n');
      finalPrompt = finalPrompt ? `${finalPrompt}\n\n${fileContextStr}` : `Please analyze the attached document:\n\n${fileContextStr}`;
    }

    onSend(finalPrompt, attachedFiles);
    setPrompt('');
    setAttachedFiles([]);
  };


  const toggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition API is not supported in this browser environment.');
      return;
    }
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = 'en-US';
    rec.onstart = () => setIsRecording(true);
    rec.onresult = (e: any) => {
      const text = Array.from(e.results).map((r: any) => r[0].transcript).join('');
      setPrompt(text);
    };
    rec.onend = () => setIsRecording(false);
    rec.start();
  };

  return (
    <div className="w-full max-w-5xl xl:max-w-6xl mx-auto p-1.5 sm:p-2.5">
      {/* Native Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.json,.csv,.js,.ts,.tsx,.py"
        className="hidden"
      />

      <div className="relative group">
        {/* Glow backdrop on focus */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-2xl blur-md opacity-20 group-focus-within:opacity-70 transition duration-300 pointer-events-none" />

        <div className="relative bg-white dark:bg-slate-950/90 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-2xl p-2 sm:p-3 shadow-lg transition-all duration-200">
          
          {/* Active Attached File Chips */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 px-1 pb-2 border-b border-slate-100 dark:border-white/5 mb-2">
              {attachedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 text-xs text-indigo-700 dark:text-indigo-300 font-medium shadow-sm animate-fadeIn"
                >
                  <FileText className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span className="truncate max-w-[160px]">{file.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({Math.round(file.size / 1024)} KB)</span>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="p-0.5 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-500/30 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer ml-1"
                    title="Remove file"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message SuperMind... (Attach PDF, DOCX, TXT, code, or images)"
            rows={1}
            disabled={disabled || isThinking}
            className="w-full bg-transparent border-none outline-none resize-none text-xs md:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 px-2 py-1 leading-snug font-normal min-h-[32px] max-h-[120px]"
          />

          <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-slate-100 dark:border-white/5 px-1">
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 text-[11px] flex items-center gap-1 transition-all cursor-pointer"
                title="Attach Document or Image File"
              >
                <Paperclip className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="hidden sm:inline font-medium">Attach File</span>
              </button>

              <button
                type="button"
                onClick={toggleVoice}
                className={`p-1.5 rounded-lg text-[11px] flex items-center gap-1 transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-red-500/20 text-red-500 border border-red-500/30 animate-pulse'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10'
                }`}
                title="Voice Speech-to-Text"
              >
                <Mic className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                <span className="hidden sm:inline font-medium">{isRecording ? 'Listening...' : 'Voice'}</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:flex items-center gap-0.5 font-mono">
                <Command className="h-2.5 w-2.5" /> Enter to send
              </span>

              <button
                type="button"
                onClick={handleSend}
                disabled={(!prompt.trim() && attachedFiles.length === 0) || disabled || isThinking}
                className={`py-1.5 px-3.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-md transition-all duration-200 cursor-pointer ${
                  (prompt.trim() || attachedFiles.length > 0) && !isThinking
                    ? 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-white/5'
                }`}
              >
                <span>Dispatch</span>
                <Send className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
