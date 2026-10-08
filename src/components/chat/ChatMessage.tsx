import React, { useState } from 'react';
import { Message } from '../../types';
import { 
  Bot, 
  Copy, 
  Check, 
  ThumbsUp, 
  ThumbsDown, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Clock, 
  Cpu, 
  Activity,
  ExternalLink,
  FileDown
} from 'lucide-react';
import { exportToPdf } from '../../utils/pdfExport';

interface ChatMessageProps {
  message: Message;
  onToggleTaskDetails?: () => void;
}



export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onToggleTaskDetails }) => {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isAssistant = message.role === 'assistant';

  const handleReadAloud = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const cleanText = text.replace(/[*#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  const parseInlineStyles = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-slate-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-indigo-600 dark:text-indigo-300 font-mono text-[12px] border border-slate-200 dark:border-white/10">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBlockLang = '';
    let codeBlockLines: string[] = [];

    const flushList = (key: string) => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={key} className="space-y-1.5 my-2.5 pl-1">
            {currentList}
          </ul>
        );
        currentList = [];
      }
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('```')) {
        if (inCodeBlock) {
          flushList(`list_${idx}`);
          const codeString = codeBlockLines.join('\n');
          elements.push(
            <div key={`code_${idx}`} className="my-3.5 rounded-xl bg-slate-900 text-slate-100 p-3.5 text-xs font-mono border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2 mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">{codeBlockLang || 'code'}</span>
                <button
                  onClick={() => handleCopy(codeString)}
                  className="hover:text-white flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded transition-colors"
                >
                  <Copy className="h-3 w-3" /> Copy Code
                </button>
              </div>
              <pre className="overflow-x-auto text-slate-200 leading-relaxed">
                <code>{codeString}</code>
              </pre>
            </div>
          );
          inCodeBlock = false;
          codeBlockLines = [];
          codeBlockLang = '';
        } else {
          flushList(`list_${idx}`);
          inCodeBlock = true;
          codeBlockLang = trimmed.slice(3).trim();
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockLines.push(line);
        return;
      }

      if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
        flushList(`list_${idx}`);
        elements.push(<hr key={`hr_${idx}`} className="my-4 border-slate-200 dark:border-slate-800" />);
        return;
      }

      if (trimmed.startsWith('# ')) {
        flushList(`list_${idx}`);
        elements.push(
          <h1 key={`h1_${idx}`} className="text-sm md:text-base font-bold text-slate-900 dark:text-white mt-3 mb-1.5 font-display tracking-tight flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
            <span>{parseInlineStyles(trimmed.slice(2))}</span>
          </h1>
        );
        return;
      }

      if (trimmed.startsWith('## ')) {
        flushList(`list_${idx}`);
        elements.push(
          <h2 key={`h2_${idx}`} className="text-xs md:text-sm font-bold text-slate-900 dark:text-white mt-2.5 mb-1.5 font-display tracking-tight flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
            <span>{parseInlineStyles(trimmed.slice(3))}</span>
          </h2>
        );
        return;
      }

      if (trimmed.startsWith('### ')) {
        flushList(`list_${idx}`);
        elements.push(
          <h3 key={`h3_${idx}`} className="text-[12px] md:text-xs font-semibold text-slate-800 dark:text-slate-200 mt-2 mb-1 font-display">
            {parseInlineStyles(trimmed.slice(4))}
          </h3>
        );
        return;
      }

      if (trimmed.startsWith('#### ')) {
        flushList(`list_${idx}`);
        elements.push(
          <h4 key={`h4_${idx}`} className="text-[12px] md:text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-2 mb-1 font-display tracking-tight flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
            <span>{parseInlineStyles(trimmed.slice(5))}</span>
          </h4>
        );
        return;
      }

      if (/^[\*\-\+]\s+/.test(trimmed)) {
        const itemText = trimmed.replace(/^[\*\-\+]\s+/, '');
        currentList.push(
          <li key={`item_${idx}`} className="flex items-start gap-2 text-[13px] text-slate-700 dark:text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
            <span className="flex-1">{parseInlineStyles(itemText)}</span>
          </li>
        );
        return;
      }

      if (/^\d+\.\s+/.test(trimmed)) {
        const num = trimmed.match(/^\d+/)?.[0];
        const itemText = trimmed.replace(/^\d+\.\s+/, '');
        currentList.push(
          <li key={`num_item_${idx}`} className="flex items-start gap-2 text-[13px] text-slate-700 dark:text-slate-300">
            <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-bold shrink-0 mt-0.5 border border-indigo-200 dark:border-indigo-800/40">
              {num}
            </span>
            <span className="flex-1">{parseInlineStyles(itemText)}</span>
          </li>
        );
        return;
      }

      if (trimmed.length > 0) {
        flushList(`list_${idx}`);
        elements.push(
          <p key={`p_${idx}`} className="my-1.5 text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">
            {parseInlineStyles(line)}
          </p>
        );
      } else {
        flushList(`list_${idx}`);
      }

    });

    flushList(`list_end`);
    return elements;
  };


  const getDisplayContent = (content: string) => {
    if (isAssistant || !content.includes('[Document Context:')) return { text: content, attachedFile: null };
    
    const match = content.match(/\[Document Context:\s*([^\]\n]+)\]/);
    const fileName = match ? match[1] : 'Attached Document';

    const userPromptText = content.replace(/\[Document Context:[\s\S]*$/, '').replace(/Please analyze the attached document:?/, '').trim();
    return {
      text: userPromptText || `Analyze attached document`,
      attachedFile: fileName,
    };
  };

  const displayData = getDisplayContent(message.content);

  return (
    <div className={`flex space-x-3 md:space-x-4 max-w-6xl xl:max-w-7xl mx-auto w-full px-2 sm:px-4 ${!isAssistant ? 'justify-end' : 'justify-start'}`}>
      {isAssistant && (
        <div className="h-8 w-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-1">
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div
        className={`flex-1 rounded-2xl p-4 md:p-6 ${
          !isAssistant
            ? 'bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800/60 text-slate-900 dark:text-slate-100 max-w-3xl sm:max-w-4xl ml-auto shadow-xs'
            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-xs'
        }`}
      >

        {/* User Attached Document Badge */}
        {!isAssistant && displayData.attachedFile && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-xs text-indigo-300 font-semibold mb-2 shadow-xs">
            <span className="text-base">📄</span>
            <span>Attached Document: {displayData.attachedFile}</span>
          </div>
        )}

        {/* Assistant Header & Actions */}
        {isAssistant && (
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <Cpu className="h-3.5 w-3.5" /> {message.model || 'SuperMind AI'}
              </span>
              <span>•</span>
              <span className="text-[11px] flex items-center gap-1">
                <Clock className="h-3 w-3" /> {message.latencyMs || 490}ms
              </span>
              {message.qualityScore && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-medium text-[10px] border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> {Math.round(message.qualityScore * 100)}% Verified
                </span>
              )}
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleReadAloud(message.content)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded"
                title="Read Aloud Speech"
              >
                {isSpeaking ? <VolumeX className="h-3.5 w-3.5 text-indigo-600" /> : <Volume2 className="h-3.5 w-3.5" />}
              </button>

              <button
                onClick={() => handleCopy(message.content)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded"
                title="Copy Markdown"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>

              <button
                onClick={() => setFeedback('like')}
                className={`p-1 rounded ${feedback === 'like' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-700'}`}
                title="Like"
              >
                <ThumbsUp className="h-3.5 w-3.5" />
              </button>



              <button
                onClick={() => setFeedback('dislike')}
                className={`p-1 rounded ${feedback === 'dislike' ? 'text-red-500' : 'text-slate-400 hover:text-slate-700'}`}
                title="Dislike"
              >
                <ThumbsDown className="h-3.5 w-3.5" />
              </button>

              {onToggleTaskDetails && (
                <button
                  onClick={onToggleTaskDetails}
                  className="p-1 text-slate-400 hover:text-indigo-600 rounded flex items-center gap-1 text-[11px] font-medium"
                  title="View Supervisor Task Details"
                >
                  <Activity className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Trace</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Message Body with Styled Markdown Rendering */}
        <div className="text-[13px] leading-relaxed space-y-1">
          {renderFormattedContent(displayData.text)}
        </div>




        {/* Code Snippet Box */}
        {message.codeSnippet && (
          <div className="mt-3 rounded-xl bg-slate-900 text-slate-100 p-3 overflow-x-auto text-xs font-mono border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1.5">
              <span>{message.codeSnippet.language}</span>
              <button
                onClick={() => handleCopy(message.codeSnippet!.code)}
                className="hover:text-white flex items-center gap-1"
              >
                <Copy className="h-3 w-3" /> Copy Code
              </button>
            </div>
            <pre className="text-slate-200">
              <code>{message.codeSnippet.code}</code>
            </pre>
          </div>
        )}

        {/* Web Search Sources */}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs">
            <div className="font-semibold text-slate-500 dark:text-slate-400 text-[11px]">Verified Web Sources:</div>
            <div className="flex flex-wrap gap-2">
              {message.sources.map((s, idx) => (
                <a
                  key={idx}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-[11px] hover:underline"
                >
                  <span>{s.title}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* PDF Document Download Card */}

        {isAssistant && (
          <div className="mt-3.5 p-3 rounded-xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-900/60 border border-indigo-500/30 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-2.5 min-w-0 flex-1 pr-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-[11px] font-mono shrink-0">
                PDF
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-100 truncate">SuperMind Document Ready</div>
                <div className="text-[10px] text-slate-400 truncate">Download clean formatted PDF document</div>
              </div>
            </div>

            <button
              onClick={() => exportToPdf('SuperMind AI Document Export', message.content, message.model || 'Google Gemini')}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all cursor-pointer shrink-0"
            >
              <FileDown className="h-3.5 w-3.5 text-indigo-200" />
              <span>Download PDF</span>
            </button>
          </div>
        )}
      </div>


      {!isAssistant && (
        <div className="h-8 w-8 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-1 font-semibold text-xs">
          U
        </div>
      )}
    </div>
  );
};
