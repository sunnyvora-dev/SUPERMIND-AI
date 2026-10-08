import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowLeft, Eye, Database, Server, Key, FileCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050814] text-slate-900 dark:text-slate-100 p-4 md:p-8 flex justify-center animate-fadeIn transition-colors duration-200">
      <div className="max-w-4xl w-full space-y-8 text-left py-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
          <div className="space-y-1">
            <Link
              to="/"
              className="inline-flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to SuperMind AI
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5 font-display">
              <ShieldCheck className="h-7 w-7 text-emerald-500" />
              Privacy Policy & Data Governance
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
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
              <Button size="sm">
                Create Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Content Container Card */}
        <div className="p-6 md:p-10 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 shadow-sm space-y-8 backdrop-blur-xl">
          
          {/* Section 1: Overview */}
          <section className="space-y-3">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-base">
              <Eye className="h-5 w-5" />
              <h2>1. Information We Collect</h2>
            </div>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              SuperMind AI is engineered with privacy as a foundational principle. We collect minimal user information required to authenticate accounts and orchestrate multi-LLM workflows:
            </p>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pl-4 list-disc">
              <li><strong>Account Credentials</strong>: Full Name, Email Address, and bcrypt-hashed Passwords.</li>
              <li><strong>Usage Analytics & Metrics</strong>: Token counts, request latency, and supervisor engine routing decisions.</li>
              <li><strong>User Workspace Data</strong>: Active chat threads, uploaded document vectors, and AI-generated image history.</li>
            </ul>
          </section>

          {/* Section 2: Data Encryption & Storage */}
          <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-base">
              <Database className="h-5 w-5" />
              <h2>2. How We Protect & Store Your Data</h2>
            </div>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              All data transmitted to SuperMind AI is encrypted in transit via TLS 1.3 and encrypted at rest using AES-256 standards. Redis OTP codes are automatically purged after 5 minutes (`EX 300` TTL) and never stored permanently.
            </p>
          </section>

          {/* Section 3: Third-Party LLM Providers */}
          <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-base">
              <Server className="h-5 w-5" />
              <h2>3. Third-Party AI Model Provider Agreements</h2>
            </div>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              When prompts are dispatched to model providers (such as OpenAI, Anthropic, Google Gemini, or DeepSeek), data is transmitted exclusively via enterprise zero-retention API endpoints. <strong>Your private prompts are never used to train public foundation models.</strong>
            </p>
          </section>

          {/* Contact Section */}
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs space-y-1">
            <div className="font-bold text-emerald-700 dark:text-emerald-300">Privacy or Data Deletion Requests?</div>
            <p className="text-slate-600 dark:text-slate-400">
              Submit data requests to our Data Protection Officer at <strong className="text-emerald-600 dark:text-emerald-300">privacy@supermind.ai</strong>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
          <span>&copy; {new Date().getFullYear()} SuperMind AI Inc. All rights reserved.</span>
          <div className="flex space-x-4">
            <Link to="/terms" className="hover:underline text-indigo-600 dark:text-indigo-400">Terms of Service</Link>
            <Link to="/help" className="hover:underline text-indigo-600 dark:text-indigo-400">Help & FAQ</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
