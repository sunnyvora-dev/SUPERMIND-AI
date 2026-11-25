import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, ArrowLeft, CheckCircle2, Lock, Cpu, Globe, Scale } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const TermsPage: React.FC = () => {
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
              <Scale className="h-7 w-7 text-[#F05A3C]" />
              Terms of Service & Conditions
            </h1>
            <p className="text-xs md:text-sm text-[#77736B] dark:text-[#A8A49C]">
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
              <FileText className="h-5 w-5" />
              <h2>1. Agreement to Terms</h2>
            </div>
            <p className="text-xs md:text-sm text-[#77736B] dark:text-[#A8A49C] leading-relaxed">
              By accessing, registering, or using the <strong>SuperMind AI Orchestration Platform</strong>, you agree to be bound by these Terms of Service. SuperMind provides multi-LLM routing, artificial intelligence generation, automated vector RAG search, and data processing capabilities. If you do not agree with any part of these terms, you must discontinue platform usage immediately.
            </p>
          </section>

          {/* Section 2: AI Model Usage & Tokens */}
          <section className="space-y-3 pt-4 border-t border-[#DCD6CA] dark:border-[#33312B]">
            <div className="flex items-center space-x-2 text-[#F05A3C] font-serif text-lg">
              <Cpu className="h-5 w-5" />
              <h2>2. Multi-LLM Routing & Token Allocations</h2>
            </div>
            <p className="text-xs md:text-sm text-[#77736B] dark:text-[#A8A49C] leading-relaxed">
              SuperMind AI dynamically routes prompts to candidate LLM providers (including OpenAI GPT-4o, Anthropic Claude 3.5, Google Gemini 2.5, DeepSeek R1, and Midjourney image renderers) based on complexity and supervisor classification.
            </p>
            <ul className="space-y-2 text-xs text-[#77736B] dark:text-[#A8A49C] pl-4 list-disc">
              <li>Each user plan tier (`Starter`, `Pro`, `Enterprise`) receives a monthly token allocation budget.</li>
              <li>Tokens reset on the 1st day of every billing cycle. Unused monthly tokens do not roll over.</li>
              <li>SuperMind AI reserves the right to rate-limit excessive automated API script abuse to protect infrastructure SLA.</li>
            </ul>
          </section>

          {/* Section 3: Data Security & OTP */}
          <section className="space-y-3 pt-4 border-t border-[#DCD6CA] dark:border-[#33312B]">
            <div className="flex items-center space-x-2 text-[#F05A3C] font-serif text-lg">
              <Lock className="h-5 w-5" />
              <h2>3. Account Security & 2-Factor Authentication</h2>
            </div>
            <p className="text-xs md:text-sm text-[#77736B] dark:text-[#A8A49C] leading-relaxed">
              To safeguard user workspace confidentiality, SuperMind AI utilizes 2-Factor Email OTP Verification backed by Redis caching. You are responsible for maintaining the security of your account login credentials and email inbox access.
            </p>
          </section>

          {/* Section 4: Acceptable Use */}
          <section className="space-y-3 pt-4 border-t border-[#DCD6CA] dark:border-[#33312B]">
            <div className="flex items-center space-x-2 text-[#F05A3C] font-serif text-lg">
              <Globe className="h-5 w-5" />
              <h2>4. Acceptable Platform Use</h2>
            </div>
            <p className="text-xs md:text-sm text-[#77736B] dark:text-[#A8A49C] leading-relaxed">
              You agree not to use the platform to generate unlawful content, reverse engineer underlying foundation models, or conduct unauthorized penetration testing against SuperMind gateway endpoints.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};