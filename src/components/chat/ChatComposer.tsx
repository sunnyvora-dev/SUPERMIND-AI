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
        // Upload to Document RAG Studio store for parsing and vector index search
        let parsedText = '';
        try {
          const uploaded = await documentService.uploadDocument(file);
          if (uploaded && uploaded.text && uploaded.text.trim()) {
            parsedText = uploaded.text.trim();
          }
        } catch (e) {
          // Fallback read client-side if upload error
        }

        if (parsedText) {
          // Injected extracted readable content directly into the model context
          extractedTexts.push(`[Document Content: ${file.name}]\n${parsedText.slice(0, 20000)}`);
        } else {
          const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp|gif|svg)$/i.test(file.name);
          const isBinaryDoc = file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.pdf') || file.name.toLowerCase().endsWith('.doc');

          if (isImage) {
            // Read visual chart / diagram / image as Base64 Data URL for Vision models
            try {
              const dataUrl = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve((e.target?.result as string) || '');
                reader.onerror = () => resolve('');
                reader.readAsDataURL(file);
              });
              extractedTexts.push(`[Attached Chart/Image: ${file.name}]\n${dataUrl}`);
            } catch {
              extractedTexts.push(`[Attached Chart/Image: ${file.name} (${Math.round(file.size / 1024)} KB)]`);
            }
          } else if (isBinaryDoc) {
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
                extractedTexts.push(`[Document Content: ${file.name}]\n${text.slice(0, 15000)}`);
              } else {
                extractedTexts.push(`[Attached Document: ${file.name} (${Math.round(file.size / 1024)} KB)]`);
              }
            } catch {
              extractedTexts.push(`[Attached Document: ${file.name}]`);
            }
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
        <div className="relative bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] focus-within:border-[#F05A3C]/70 focus-within:shadow-md rounded-2xl p-2 sm:p-3 shadow-sm transition-all duration-200">
          
          {/* Active Attached File Chips */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 px-1 pb-2 border-b border-[#DCD6CA] dark:border-[#33312B] mb-2">
              {attachedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EAE5D9] dark:bg-[#252421] border border-[#DCD6CA] dark:border-[#33312B] text-xs text-[#171717] dark:text-[#F4F0E6] font-medium shadow-2xs animate-fadeIn"
                >
                  <FileText className="h-3.5 w-3.5 text-[#F05A3C] shrink-0" />
                  <span className="truncate max-w-[160px]">{file.name}</span>
                  <span className="text-[10px] text-[#77736B] font-mono">({Math.round(file.size / 1024)} KB)</span>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="p-0.5 rounded-md hover:bg-[#DCD6CA] dark:hover:bg-[#33312B] text-[#77736B] hover:text-[#171717] dark:hover:text-[#F4F0E6] transition-colors cursor-pointer ml-1"
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
            className="w-full bg-transparent border-none outline-none resize-none text-xs md:text-sm text-[#171717] dark:text-[#F4F0E6] placeholder-[#77736B] px-2 py-1 leading-snug font-normal min-h-[32px] max-h-[120px]"
          />

          <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-[#DCD6CA] dark:border-[#33312B] px-1">
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 rounded-lg text-[#77736B] hover:text-[#171717] dark:hover:text-[#F4F0E6] hover:bg-[#EAE5D9] dark:hover:bg-[#252421] text-[11px] flex items-center gap-1 transition-all cursor-pointer"
                title="Attach Document or Image File"
              >
                <Paperclip className="h-3.5 w-3.5 text-[#F05A3C]" />
                <span className="hidden sm:inline font-medium">Attach File</span>
              </button>

              <button
                type="button"
                onClick={toggleVoice}
                className={`p-1.5 rounded-lg text-[11px] flex items-center gap-1 transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-[#F05A3C]/15 text-[#F05A3C] border border-[#F05A3C]/30 animate-pulse'
                    : 'text-[#77736B] hover:text-[#171717] dark:hover:text-[#F4F0E6] hover:bg-[#EAE5D9] dark:hover:bg-[#252421]'
                }`}
                title="Voice Speech-to-Text"
              >
                <Mic className="h-3.5 w-3.5 text-[#2457D6]" />
                <span className="hidden sm:inline font-medium">{isRecording ? 'Listening...' : 'Voice'}</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-[#77736B] hidden sm:flex items-center gap-0.5 font-mono">
                <Command className="h-2.5 w-2.5" /> Enter to send
              </span>

              <button
                type="button"
                onClick={handleSend}
                disabled={(!prompt.trim() && attachedFiles.length === 0) || disabled || isThinking}
                className={`py-1.5 px-3.5 rounded-xl text-xs font-medium flex items-center space-x-1.5 shadow-sm transition-all duration-200 cursor-pointer ${
                  (prompt.trim() || attachedFiles.length > 0) && !isThinking
                    ? 'bg-[#F05A3C] hover:bg-[#D94528] text-white border border-[#F05A3C] hover:scale-[1.01] active:scale-[0.98]'
                    : 'bg-[#EAE5D9] dark:bg-[#252421] text-[#77736B] cursor-not-allowed border border-[#DCD6CA] dark:border-[#33312B]'
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
