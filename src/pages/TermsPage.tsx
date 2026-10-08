import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, ArrowLeft, CheckCircle2, Lock, Cpu, Globe, Scale } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const TermsPage: React.FC = () => {
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
              <Scale className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
              Terms of Service & Conditions
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Last updated: August 10, 2026 • Effective for all SuperMind AI accounts
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Link to="/privacy">
              <Button variant="outline" size="sm">
                Privacy Policy
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
              <FileText className="h-5 w-5" />
              <h2>1. Agreement to Terms</h2>
            </div>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              By accessing, registering, or using the <strong>SuperMind AI Orchestration Platform</strong>, you agree to be bound by these Terms of Service. SuperMind provides multi-LLM routing, artificial intelligence generation, automated vector RAG search, and data processing capabilities. If you do not agree with any part of these terms, you must discontinue platform usage immediately.
            </p>
          </section>

          {/* Section 2: AI Model Usage & Tokens */}
          <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-base">
              <Cpu className="h-5 w-5" />
              <h2>2. Multi-LLM Routing & Token Allocations</h2>
            </div>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              SuperMind AI dynamically routes prompts to candidate LLM providers (including OpenAI GPT-4o, Anthropic Claude 3.5, Google Gemini 2.5, DeepSeek R1, and Midjourney image renderers) based on complexity and supervisor classification.
            </p>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pl-4 list-disc">
              <li>Each user plan tier (`Starter`, `Pro`, `Enterprise`) receives a monthly token allocation budget.</li>
              <li>Tokens reset on the 1st day of every billing cycle. Unused monthly tokens do not roll over.</li>
              <li>SuperMind AI reserves the right to rate-limit excessive automated API script abuse to protect infrastructure SLA.</li>
            </ul>
          </section>

          {/* Section 3: Data Security & OTP */}
          <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-base">
              <Lock className="h-5 w-5" />
              <h2>3. Account Security & 2-Factor Authentication</h2>
            </div>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              To safeguard user workspace confidentiality, SuperMind AI utilizes 2-Factor Email OTP Verification backed by Redis caching. You are responsible for maintaining the security of your account login credentials and email inbox access.
            </p>
          </section>

          {/* Section 4: Acceptable Use Policy */}
          <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-base">
              <Shield className="h-5 w-5" />
              <h2>4. Acceptable Use & Prohibited Activities</h2>
            </div>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              You agree not to use SuperMind AI for any unlawful or malicious activities, including but not limited to:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 flex items-center space-x-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Malware or exploits generation</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 flex items-center space-x-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Bypassing platform rate limits</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 flex items-center space-x-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Phishing or credential harvesting</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 flex items-center space-x-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>IP scraping or infrastructure attacks</span>
              </div>
            </div>
          </section>

          {/* Section 5: Intellectual Property */}
          <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-base">
              <Globe className="h-5 w-5" />
              <h2>5. Content Ownership & Rights</h2>
            </div>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              As between you and SuperMind AI, you retain ownership of all original prompt inputs and output content generated through your user account. SuperMind AI does not claim copyright ownership over your generated code snippets, documents, or synthetic images.
            </p>
          </section>

          {/* Contact Section */}
          <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-xs space-y-1">
            <div className="font-bold text-indigo-700 dark:text-indigo-300">Questions about our Terms of Service?</div>
            <p className="text-slate-600 dark:text-slate-400">
              Contact our legal and compliance team at <strong className="text-indigo-600 dark:text-indigo-300">legal@supermind.ai</strong>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
          <span>&copy; {new Date().getFullYear()} SuperMind AI Inc. All rights reserved.</span>
          <div className="flex space-x-4">
            <Link to="/privacy" className="hover:underline text-indigo-600 dark:text-indigo-400">Privacy Policy</Link>
            <Link to="/help" className="hover:underline text-indigo-600 dark:text-indigo-400">Help & FAQ</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
