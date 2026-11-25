import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowLeft, Eye, Database, Server, Key, FileCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F4F0E6] dark:bg-[#121212] text-[#171717] dark:text-[#F4F0E6] p-4 md:p-8 flex justify-center animate-fadeIn transition-colors duration-200">
      <div className="max-w-4xl w-full space-y-8 text-left py-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCD6CA] dark:border-[#33312B] pb-6">
          <div className="space-y-1">
            <Link
              to="/"
              className="inline-flex items-center text-xs font-medium text-[#F05A3C] hover:underline mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to SuperMind AI
            </Link>
            <h1 className="text-3xl font-serif font-normal text-[#171717] dark:text-[#F4F0E6] tracking-tight flex items-center gap-2.5">
              <ShieldCheck className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
              Privacy Policy & Data Governance
            </h1>
            <p className="text-xs md:text-sm text-[#77736B] dark:text-[#A8A49C]">
              Last updated: August 10, 2026 • Enterprise-grade encryption & privacy rules
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Link to="/terms">
              <Button variant="outline" size="sm">
                Terms of Service
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" variant="primary">
                Create Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Content Container Card */}
        <div className="p-6 md:p-10 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] shadow-editorial space-y-8">
          
          {/* Section 1: Overview */}
          <section className="space-y-3">
            <div className="flex items-center space-x-2 text-[#F05A3C] font-serif text-lg">
              <Eye className="h-5 w-5" />
              <h2>1. Information We Collect</h2>
            </div>
            <p className="text-xs md:text-sm text-[#77736B] dark:text-[#A8A49C] leading-relaxed">
              SuperMind AI is engineered with privacy as a foundational principle. We collect minimal user information required to authenticate accounts and orchestrate multi-LLM workflows:
            </p>
            <ul className="space-y-2 text-xs text-[#77736B] dark:text-[#A8A49C] pl-4 list-disc">
              <li><strong>Account Credentials</strong>: Full Name, Email Address, and bcrypt-hashed Passwords.</li>
              <li><strong>Usage Analytics & Metrics</strong>: Token counts, request latency, and supervisor engine routing decisions.</li>
              <li><strong>User Workspace Data</strong>: Active chat threads, uploaded document vectors, and AI-generated image history.</li>
            </ul>
          </section>

          {/* Section 2: Data Encryption */}
          <section className="space-y-3 pt-4 border-t border-[#DCD6CA] dark:border-[#33312B]">
            <div className="flex items-center space-x-2 text-[#F05A3C] font-serif text-lg">
              <Lock className="h-5 w-5" />
              <h2>2. Data Encryption & Storage</h2>
            </div>
            <p className="text-xs md:text-sm text-[#77736B] dark:text-[#A8A49C] leading-relaxed">
              All communications between your browser and SuperMind microservices are encrypted via TLS 1.3 in transit. At rest, data is protected using AES-256 bit encryption. Secret tokens and provider credentials are kept exclusively on isolated backend enclaves.
            </p>
          </section>

          {/* Section 3: Third-Party LLM Dispatches */}
          <section className="space-y-3 pt-4 border-t border-[#DCD6CA] dark:border-[#33312B]">
            <div className="flex items-center space-x-2 text-[#F05A3C] font-serif text-lg">
              <Server className="h-5 w-5" />
              <h2>3. Third-Party LLM Dispatches</h2>
            </div>
            <p className="text-xs md:text-sm text-[#77736B] dark:text-[#A8A49C] leading-relaxed">
              When queries are processed, prompts are forwarded solely to the authorized provider (Anthropic, Google, OpenAI, DeepSeek, or Groq) necessary to service the request. Under zero-retention enterprise agreements, client queries are never used to train foundation models.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};