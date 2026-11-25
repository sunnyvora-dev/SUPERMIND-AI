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
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 text-left">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded border border-[#DCD6CA] dark:border-[#33312B] bg-[#EAE5D9]/60 dark:bg-[#1E1E1C] text-[#77736B] dark:text-[#A8A49C]">
            Knowledge & Reference
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-normal tracking-tight text-[#171717] dark:text-[#F4F0E6]">
          Help & Documentation
        </h1>
        <p className="text-xs text-[#77736B] dark:text-[#A8A49C] mt-1">
          Frequently asked questions, multi-model routing documentation, and support channels.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] space-y-2 shadow-subtle transition-all"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left font-serif text-sm font-normal text-[#171717] dark:text-[#F4F0E6] cursor-pointer"
              >
                <span>{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-[#F05A3C] shrink-0 ml-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-[#77736B] shrink-0 ml-2" />
                )}
              </button>
              {isOpen && (
                <p className="text-xs text-[#77736B] dark:text-[#A8A49C] leading-relaxed pt-3 border-t border-[#DCD6CA] dark:border-[#33312B]">
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-6 md:p-8 rounded-2xl bg-[#171717] dark:bg-[#FAF8F3] text-[#F4F0E6] dark:text-[#171717] border border-[#33312B] dark:border-[#DCD6CA] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-editorial">
        <div className="space-y-1 text-center sm:text-left">
          <div className="font-serif text-base font-normal">Need dedicated architecture assistance?</div>
          <p className="text-xs text-[#A8A49C] dark:text-[#77736B]">Our engineering team is on standby to assist with API integration and enterprise deployments.</p>
        </div>
        <a
          href="mailto:support@supermind.ai"
          className="px-5 py-2.5 rounded-xl bg-[#F05A3C] text-white text-xs font-medium hover:bg-[#d9482b] transition-all shadow-subtle shrink-0 cursor-pointer"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
};