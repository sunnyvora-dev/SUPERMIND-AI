import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, MessageSquare, ShieldCheck, Mail } from 'lucide-react';

export const HelpPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    { q: 'How does SuperMind AI automatically select AI models?', a: 'The Supervisor AI Engine analyzes your prompt intent, complexity, and domain requirements (e.g. coding, image generation, web research, document parsing). It then routes to the optimal LLM provider automatically.' },
    { q: 'Can I force a specific model like Claude 3.5 Sonnet or GPT-4o?', a: 'Yes! In the topbar or chat composer options, you can choose a specific model routing preference or enable Multi-Model Consensus mode.' },
    { q: 'How are documents and PDFs processed for RAG?', a: 'Uploaded PDF, DOCX, and TXT files are validated, extracted, and chunked into embeddings. SuperMind queries only the relevant excerpts to keep token usage minimal.' },
    { q: 'Are my prompts and API secrets secure?', a: 'Yes. All provider API keys and JWT credentials remain strictly on backend microservices behind HTTPS and SOC 2 telemetry.' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Help & Documentation</h1>
        <p className="text-xs text-slate-500">Frequently asked questions and SuperMind AI platform guides</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full flex items-center justify-between text-left font-bold text-xs text-slate-900 dark:text-white"
            >
              <span>{faq.q}</span>
              {openIdx === idx ? <ChevronUp className="h-4 w-4 text-indigo-500" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
            </button>
            {openIdx === idx && (
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800">
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="p-6 rounded-3xl bg-indigo-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="font-bold text-sm">Need dedicated support?</div>
          <p className="text-xs text-indigo-100">Our engineering team is ready to help 24/7.</p>
        </div>
        <a href="mailto:support@supermind.ai" className="px-4 py-2 rounded-xl bg-white text-indigo-600 text-xs font-bold shadow-md">
          Contact Support
        </a>
      </div>
    </div>
  );
};
