import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Bot, 
  Cpu, 
  Layers, 
  Search, 
  FileText, 
  Code, 
  Mic, 
  Brain, 
  Check, 
  ArrowDown, 
  Image as ImageIcon,
  FileDown,
  Globe,
  ShieldCheck,
  Zap,
  Activity,
  Terminal,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [activeModel, setActiveModel] = useState<'gemini' | 'claude' | 'gpt4' | 'deepseek'>('gemini');
  const [tokenCounter, setTokenCounter] = useState(3429810);
  const [demoIndex, setDemoIndex] = useState(0);

  // Live Token & Scenario Cycling Animations
  useEffect(() => {
    const tokenInterval = setInterval(() => {
      setTokenCounter((prev) => prev + Math.floor(Math.random() * 24) + 1);
    }, 600);

    const scenarioInterval = setInterval(() => {
      setDemoIndex((prev) => (prev + 1) % 3);
    }, 3600);

    return () => {
      clearInterval(tokenInterval);
      clearInterval(scenarioInterval);
    };
  }, []);

  const modelSpecs = {
    gemini: {
      name: 'Google Gemini 2.5 Flash',
      provider: 'Google AI Engine',
      latency: '180ms',
      quality: '99.8%',
      cost: '$0.00',
      badgeColor: 'border-[#C7D83D]/40 text-[#556306] dark:text-[#C7D83D] bg-[#C7D83D]/10',
      description: 'Primary high-speed intelligence engine configured for low latency, full-stack code synthesis, and instant reasoning.',
    },
    claude: {
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic AI',
      latency: '240ms',
      quality: '99.5%',
      cost: '$0.00',
      badgeColor: 'border-[#F05A3C]/40 text-[#F05A3C] bg-[#F05A3C]/10',
      description: 'Advanced reasoning engine for long-context document synthesis, architectural analysis, and complex structured extraction.',
    },
    gpt4: {
      name: 'GPT-4o Omnimodal',
      provider: 'OpenAI Engine',
      latency: '210ms',
      quality: '99.4%',
      cost: '$0.00',
      badgeColor: 'border-[#2457D6]/40 text-[#2457D6] dark:text-[#88A9FF] bg-[#2457D6]/10',
      description: 'Multimodal vision and creative prompt generator with high-resolution image rendering and editorial drafting.',
    },
    deepseek: {
      name: 'DeepSeek R1 Consensus',
      provider: 'DeepSeek Architecture',
      latency: '290ms',
      quality: '99.9%',
      cost: '$0.00',
      badgeColor: 'border-[#77736B]/40 text-[#171717] dark:text-[#F4F0E6] bg-[#EAE5D9]/50 dark:bg-[#1E1E1C]',
      description: 'Mathematical reasoning, multi-LLM consensus verification, and automated algorithmic code analysis.',
    },
  };

  const demoScenarios = [
    {
      prompt: "Build a Spring Boot 3 REST Authentication API with JWT Security & Unit Tests",
      model: "Google Gemini 2.5 Flash Engine",
      status: "Synthesizing 100% complete Java code without placeholders",
      latency: "185ms",
    },
    {
      prompt: "Analyze financial agreement contract and generate a vector PDF document",
      model: "SuperMind Vector PDF Document Generator",
      status: "Parsing PDF vector styling and clean A4 pagination",
      latency: "140ms",
    },
    {
      prompt: "Generate a 4K photorealistic architectural render of a futuristic glass studio",
      model: "DALL-E 3 Studio Rendering Engine",
      status: "Rendering 16:9 ultra-definition lighting and reflections",
      latency: "320ms",
    },
  ];

  const capabilities = [
    { title: 'Smart AI Routing', subtitle: 'Dynamic Capability Match', desc: 'Evaluates request complexity, code dependencies, and intent to route prompts to optimal candidate models.', icon: Cpu },
    { title: 'Multi-Model Consensus', subtitle: 'Synthesis Engine', desc: 'Combines outputs from Google Gemini, Claude 3.5 Sonnet, and GPT-4o into a single unified answer.', icon: Layers },
    { title: 'Image Studio', subtitle: '4K Visual Rendering', desc: 'Generates high-definition visuals, mockups, and diagrams directly from natural language prompts.', icon: ImageIcon },
    { title: 'Deep Web Research', subtitle: 'Real-time & Citations', desc: 'Performs live web searches, aggregates sources, and attaches explicit verified reference links.', icon: Search },
    { title: 'Document Analysis', subtitle: 'PDF & DOCX Parsing', desc: 'Parses complex multi-page documents, extracts key clauses, and generates instant summaries.', icon: FileText },
    { title: 'Vector PDF Generator', subtitle: '1-Click PDF Downloads', desc: 'Converts answers into formatted A4 PDF document files directly downloaded to your device.', icon: FileDown },
    { title: 'Coding Assistance', subtitle: 'Refactoring & Debugging', desc: 'Generates production-ready code with syntax highlighting, unit test suggestions, and automated diffs.', icon: Code },
    { title: 'Voice Interaction', subtitle: 'Speech-to-Text Studio', desc: 'Hands-free voice prompting with instant acoustic transcription and text-to-speech playback.', icon: Mic },
  ];

  return (
    <div className="min-h-screen bg-[#F4F0E6] dark:bg-[#121212] text-[#171717] dark:text-[#F4F0E6] flex flex-col font-sans select-none overflow-x-hidden relative transition-colors duration-200">
      
      {/* Editorial Retro-Futuristic Header */}
      <header className="h-16 px-4 sm:px-8 max-w-7xl mx-auto w-full flex items-center justify-between border-b border-[#DCD6CA] dark:border-[#33312B] bg-[#FAF8F3]/90 dark:bg-[#121212]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="h-8 w-8 rounded-lg bg-[#171717] dark:bg-[#F4F0E6] text-[#F4F0E6] dark:text-[#171717] font-serif font-bold flex items-center justify-center text-sm shadow-subtle border border-[#DCD6CA] dark:border-[#33312B]">
            S
          </div>
          <div className="flex items-center gap-2">
            <span className="font-serif font-normal text-lg tracking-tight text-[#171717] dark:text-[#F4F0E6]">SuperMind</span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded border border-[#DCD6CA] dark:border-[#33312B] bg-[#EAE5D9]/60 dark:bg-[#1E1E1C] text-[#77736B] dark:text-[#A8A49C] text-[10px] font-mono tracking-wider uppercase">
              AI Orchestrator
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#77736B] dark:text-[#A8A49C]">
          <a href="#showcase" className="hover:text-[#F05A3C] transition-colors">Studio Preview</a>
          <a href="#features" className="hover:text-[#F05A3C] transition-colors">Capabilities</a>
          <a href="#models" className="hover:text-[#F05A3C] transition-colors">Candidate Models</a>
          <a href="#architecture" className="hover:text-[#F05A3C] transition-colors">Architecture</a>
          <a href="#pricing" className="hover:text-[#F05A3C] transition-colors">Pricing</a>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="py-2 px-4 rounded-xl bg-[#F05A3C] hover:bg-[#d9482b] text-white text-xs font-medium flex items-center gap-1.5 shadow-subtle transition-all cursor-pointer"
            >
              <span>Workspace</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="py-2 px-3.5 rounded-xl border border-[#DCD6CA] dark:border-[#33312B] bg-[#FAF8F3] dark:bg-[#1E1E1C] text-[#171717] dark:text-[#F4F0E6] text-xs font-medium hover:bg-[#EAE5D9] transition-all cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="py-2 px-4 rounded-xl bg-[#F05A3C] hover:bg-[#d9482b] text-white text-xs font-medium shadow-subtle transition-all cursor-pointer"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 max-w-7xl mx-auto w-full text-center space-y-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DCD6CA] dark:border-[#33312B] bg-[#FAF8F3] dark:bg-[#1E1E1C] text-[#77736B] dark:text-[#A8A49C] text-xs shadow-subtle">
          <span className="h-2 w-2 rounded-full bg-[#F05A3C]" />
          <span className="font-mono text-[11px]">Multi-Model Intelligence Engine • {tokenCounter.toLocaleString()} Tokens Synthesized</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal tracking-tight leading-[1.12] max-w-5xl mx-auto text-[#171717] dark:text-[#F4F0E6]">
          One Prompt.{' '}
          <span className="italic text-[#F05A3C]">
            Multiple AI Models.
          </span>{' '}
          One Intelligent Answer.
        </h1>

        <p className="text-base sm:text-lg text-[#77736B] dark:text-[#A8A49C] max-w-2xl mx-auto leading-relaxed">
          SuperMind evaluates request intent, complex code queries, and document tasks to automatically route to candidate models in real time.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto py-3.5 px-7 rounded-xl bg-[#F05A3C] hover:bg-[#d9482b] text-white font-medium text-xs flex items-center justify-center gap-2 shadow-editorial transition-all cursor-pointer"
          >
            <span>Launch Chat Studio</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto py-3.5 px-7 rounded-xl bg-[#FAF8F3] dark:bg-[#1E1E1C] hover:bg-[#EAE5D9] text-[#171717] dark:text-[#F4F0E6] border border-[#DCD6CA] dark:border-[#33312B] font-medium text-xs transition-all cursor-pointer shadow-subtle"
          >
            Explore AI Provider Matrix
          </button>
        </div>

        {/* Studio Preview Window */}
        <div id="showcase" className="pt-10 max-w-5xl mx-auto">
          <div className="relative rounded-2xl p-2 bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] shadow-editorial group">
            {/* Live Badge Overlay */}
            <div className="absolute top-5 left-5 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-[#171717]/90 text-[#F4F0E6] border border-[#33312B] text-[11px] font-mono shadow-subtle">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C7D83D]" />
              <span>SuperMind AI Orchestration Workspace</span>
            </div>

            {/* AI Studio Graphic */}
            <div className="overflow-hidden rounded-xl border border-[#DCD6CA] dark:border-[#33312B] relative">
              <img
                src="/ai_studio_preview.png"
                alt="SuperMind AI Studio Dashboard Interface"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        {/* Live Router Telemetry Box */}
        <div className="pt-6 max-w-3xl mx-auto">
          <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] shadow-subtle space-y-4 text-left transition-all">
            <div className="flex items-center justify-between border-b border-[#DCD6CA] dark:border-[#33312B] pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#F05A3C]" />
                <span className="text-xs font-mono text-[#77736B] dark:text-[#A8A49C]">Live Supervisor Router Telemetry</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:text-emerald-400" />
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold uppercase">Active</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-mono text-[#77736B] dark:text-[#A8A49C] flex items-start gap-2">
                <span className="text-[#F05A3C] font-bold">USER &gt;</span>
                <span className="text-[#171717] dark:text-[#F4F0E6] font-medium">{demoScenarios[demoIndex].prompt}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#EAE5D9]/50 dark:bg-[#171717] border border-[#DCD6CA] dark:border-[#33312B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 animate-fadeIn">
                <div className="flex items-center gap-2.5">
                  <Cpu className="h-4 w-4 text-[#F05A3C]" />
                  <div>
                    <div className="text-xs font-mono text-[#171717] dark:text-[#F4F0E6] font-semibold">
                      Routed to: {demoScenarios[demoIndex].model}
                    </div>
                    <div className="text-[11px] text-[#77736B] dark:text-[#A8A49C]">{demoScenarios[demoIndex].status}</div>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold shrink-0">
                  Latency: {demoScenarios[demoIndex].latency}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Model Showcase Section */}
      <section id="models" className="py-16 px-6 max-w-7xl mx-auto w-full space-y-10 border-t border-[#DCD6CA] dark:border-[#33312B] relative z-10">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded border border-[#DCD6CA] dark:border-[#33312B] bg-[#EAE5D9]/60 dark:bg-[#1E1E1C] text-[#77736B] dark:text-[#A8A49C]">
              Candidate Providers
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-normal tracking-tight text-[#171717] dark:text-[#F4F0E6]">
            Multi-LLM Candidate Model Matrix
          </h2>
          <p className="text-xs sm:text-sm text-[#77736B] dark:text-[#A8A49C] max-w-xl mx-auto">
            SuperMind integrates premier foundation models for automated failover, consensus, and specialized execution.
          </p>
        </div>

        {/* Interactive Model Selector Tabs */}
        <div className="flex justify-center flex-wrap gap-2">
          {(['gemini', 'claude', 'gpt4', 'deepseek'] as const).map((key) => {
            const spec = modelSpecs[key];
            const isSelected = activeModel === key;
            return (
              <button
                key={key}
                onClick={() => setActiveModel(key)}
                className={`py-2 px-4 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#171717] dark:bg-[#F4F0E6] text-[#F4F0E6] dark:text-[#171717] shadow-subtle font-semibold'
                    : 'bg-[#FAF8F3] dark:bg-[#1E1E1C] hover:bg-[#EAE5D9] text-[#77736B] dark:text-[#A8A49C] border border-[#DCD6CA] dark:border-[#33312B]'
                }`}
              >
                {spec.name}
              </button>
            );
          })}
        </div>

        {/* Model Specs Detail Card */}
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] shadow-editorial space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#DCD6CA] dark:border-[#33312B] pb-4">
            <div>
              <div className="text-xl font-serif font-normal text-[#171717] dark:text-[#F4F0E6]">{modelSpecs[activeModel].name}</div>
              <div className="text-xs text-[#77736B] dark:text-[#A8A49C] mt-1 leading-relaxed">{modelSpecs[activeModel].description}</div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border ${modelSpecs[activeModel].badgeColor}`}>
              {modelSpecs[activeModel].provider}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-[#EAE5D9]/40 dark:bg-[#171717] border border-[#DCD6CA] dark:border-[#33312B]">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#77736B] dark:text-[#A8A49C]">Response Latency</div>
              <div className="text-lg sm:text-xl font-serif text-[#F05A3C] mt-1">{modelSpecs[activeModel].latency}</div>
            </div>
            <div className="p-4 rounded-xl bg-[#EAE5D9]/40 dark:bg-[#171717] border border-[#DCD6CA] dark:border-[#33312B]">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#77736B] dark:text-[#A8A49C]">Quality Score</div>
              <div className="text-lg sm:text-xl font-serif text-emerald-600 dark:text-emerald-400 mt-1">{modelSpecs[activeModel].quality}</div>
            </div>
            <div className="p-4 rounded-xl bg-[#EAE5D9]/40 dark:bg-[#171717] border border-[#DCD6CA] dark:border-[#33312B]">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#77736B] dark:text-[#A8A49C]">Token Cost</div>
              <div className="text-lg sm:text-xl font-serif text-[#2457D6] dark:text-[#88A9FF] mt-1">{modelSpecs[activeModel].cost}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Matrix Section */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12 border-t border-[#DCD6CA] dark:border-[#33312B] relative z-10">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded border border-[#DCD6CA] dark:border-[#33312B] bg-[#EAE5D9]/60 dark:bg-[#1E1E1C] text-[#77736B] dark:text-[#A8A49C]">
              Full Capability Suite
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-normal tracking-tight text-[#171717] dark:text-[#F4F0E6]">SuperMind Capabilities Matrix</h2>
          <p className="text-xs sm:text-sm text-[#77736B] dark:text-[#A8A49C] max-w-xl mx-auto">
            Everything you need in one unified, multi-model AI orchestration workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {capabilities.map((c, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] space-y-3 shadow-subtle hover:border-[#F05A3C] transition-all group text-left"
            >
              <div className="h-9 w-9 rounded-xl bg-[#EAE5D9] dark:bg-[#171717] text-[#171717] dark:text-[#F4F0E6] flex items-center justify-center border border-[#DCD6CA] dark:border-[#33312B] group-hover:bg-[#F05A3C] group-hover:text-white transition-colors">
                <c.icon className="h-4 w-4" />
              </div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#F05A3C]">{c.subtitle}</div>
              <h3 className="text-base font-serif font-normal text-[#171717] dark:text-[#F4F0E6]">{c.title}</h3>
              <p className="text-xs text-[#77736B] dark:text-[#A8A49C] leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture Pipeline Visualizer */}
      <section id="architecture" className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12 border-t border-[#DCD6CA] dark:border-[#33312B] relative z-10">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded border border-[#DCD6CA] dark:border-[#33312B] bg-[#EAE5D9]/60 dark:bg-[#1E1E1C] text-[#77736B] dark:text-[#A8A49C]">
              Execution Pipeline
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-normal tracking-tight text-[#171717] dark:text-[#F4F0E6]">Orchestration Architecture</h2>
          <p className="text-xs sm:text-sm text-[#77736B] dark:text-[#A8A49C] max-w-xl mx-auto">
            How prompts flow through intent classification, model dispatch, and synthesis.
          </p>
        </div>

        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] shadow-editorial space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-1/4 p-4 rounded-xl bg-[#EAE5D9]/40 dark:bg-[#171717] text-center space-y-1 border border-[#DCD6CA] dark:border-[#33312B]">
              <div className="text-[11px] font-mono text-[#77736B] dark:text-[#A8A49C] font-semibold uppercase">1. User Prompt</div>
              <div className="text-xs font-serif text-[#171717] dark:text-[#F4F0E6]">Natural Query</div>
            </div>

            <div className="hidden md:block text-[#F05A3C] font-serif text-lg">→</div>

            <div className="w-full md:w-1/4 p-4 rounded-xl bg-[#171717] dark:bg-[#F4F0E6] text-[#F4F0E6] dark:text-[#171717] text-center space-y-1 shadow-subtle border border-[#33312B] dark:border-[#DCD6CA]">
              <div className="text-[11px] font-mono text-[#F05A3C] font-bold flex items-center justify-center gap-1 uppercase">
                <Bot className="h-3.5 w-3.5" /> 2. Supervisor
              </div>
              <div className="text-xs font-serif">Intent & Routing</div>
            </div>

            <div className="hidden md:block text-[#F05A3C] font-serif text-lg">→</div>

            <div className="w-full md:w-1/4 p-4 rounded-xl bg-[#EAE5D9]/40 dark:bg-[#171717] text-center space-y-1 border border-[#DCD6CA] dark:border-[#33312B]">
              <div className="text-[11px] font-mono text-[#2457D6] dark:text-[#88A9FF] font-semibold uppercase">3. Candidates</div>
              <div className="text-xs font-serif text-[#171717] dark:text-[#F4F0E6]">Gemini • Claude • GPT-4o</div>
            </div>

            <div className="hidden md:block text-[#F05A3C] font-serif text-lg">→</div>

            <div className="w-full md:w-1/4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1">
              <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold uppercase">4. Synthesis</div>
              <div className="text-xs font-serif text-emerald-800 dark:text-emerald-300">Verified Answer</div>
            </div>
          </div>
        </div>
      </section>

      {/* SaaS Pricing Section */}
      <section id="pricing" className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12 border-t border-[#DCD6CA] dark:border-[#33312B] relative z-10">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded border border-[#DCD6CA] dark:border-[#33312B] bg-[#EAE5D9]/60 dark:bg-[#1E1E1C] text-[#77736B] dark:text-[#A8A49C]">
              Transparent Plans
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-normal tracking-tight text-[#171717] dark:text-[#F4F0E6]">Flexible SaaS Pricing</h2>
          <p className="text-xs sm:text-sm text-[#77736B] dark:text-[#A8A49C]">Choose the tier configured for your prompt capacity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch text-left">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] space-y-6 flex flex-col justify-between shadow-subtle">
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-[#77736B] dark:text-[#A8A49C]">Starter</div>
              <div className="text-3xl font-serif text-[#171717] dark:text-[#F4F0E6]">$0 <span className="text-xs text-[#77736B] dark:text-[#A8A49C] font-normal">/ mo</span></div>
              <ul className="space-y-2.5 text-xs text-[#77736B] dark:text-[#A8A49C]">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#F05A3C]" /> 100k Monthly Tokens</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#F05A3C]" /> Google Gemini Routing</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#F05A3C]" /> Vector PDF Document Exporter</li>
              </ul>
            </div>
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="w-full">
              Get Started Free
            </Button>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border-2 border-[#F05A3C] shadow-editorial space-y-6 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#F05A3C] font-semibold">Pro Intelligence</span>
                <span className="px-2 py-0.5 rounded-full bg-[#F05A3C] text-white text-[9px] font-mono font-bold uppercase">Popular</span>
              </div>
              <div className="text-3xl font-serif text-[#171717] dark:text-[#F4F0E6]">$29 <span className="text-xs text-[#77736B] dark:text-[#A8A49C] font-normal">/ mo</span></div>
              <ul className="space-y-2.5 text-xs text-[#171717] dark:text-[#F4F0E6]">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#F05A3C]" /> 5M Monthly Tokens</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#F05A3C]" /> Multi-Model Consensus Engine</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#F05A3C]" /> 4K Image Studio & Document RAG</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#F05A3C]" /> Unlimited Vector PDF Exports</li>
              </ul>
            </div>
            <Button variant="primary" onClick={() => navigate('/dashboard')} className="w-full">
              Upgrade to Pro
            </Button>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] space-y-6 flex flex-col justify-between shadow-subtle">
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-[#77736B] dark:text-[#A8A49C]">Enterprise</div>
              <div className="text-3xl font-serif text-[#171717] dark:text-[#F4F0E6]">$99 <span className="text-xs text-[#77736B] dark:text-[#A8A49C] font-normal">/ mo</span></div>
              <ul className="space-y-2.5 text-xs text-[#77736B] dark:text-[#A8A49C]">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#F05A3C]" /> Unlimited Tokens</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#F05A3C]" /> Dedicated Supervisor SLA</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#F05A3C]" /> Custom Model Fine-Tuning</li>
              </ul>
            </div>
            <Button variant="outline" onClick={() => navigate('/register')} className="w-full">
              Contact Enterprise
            </Button>
          </div>
        </div>
      </section>

      {/* Multi-Column Footer */}
      <footer className="bg-[#FAF8F3] dark:bg-[#101010] border-t border-[#DCD6CA] dark:border-[#33312B] pt-16 pb-12 px-6 relative z-10 text-left">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Column 1: Brand & Details */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="h-8 w-8 rounded-lg bg-[#171717] dark:bg-[#F4F0E6] text-[#F4F0E6] dark:text-[#171717] font-serif font-bold flex items-center justify-center text-sm shadow-subtle">
                  S
                </div>
                <span className="font-serif font-normal text-lg tracking-tight text-[#171717] dark:text-[#F4F0E6]">SuperMind AI</span>
              </div>

              <p className="text-xs text-[#77736B] dark:text-[#A8A49C] max-w-sm leading-relaxed">
                SuperMind is an enterprise-grade multi-LLM orchestrator that evaluates request intent, complex code queries, and document tasks to synthesize optimal answers.
              </p>

              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs w-fit font-mono font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                <span>System Status: 100% Operational</span>
              </div>
            </div>

            {/* Column 2: Products & Features */}
            <div className="space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#171717] dark:text-[#F4F0E6]">Capabilities</div>
              <ul className="space-y-2 text-xs text-[#77736B] dark:text-[#A8A49C] font-medium">
                <li><a onClick={() => navigate('/chat')} className="hover:text-[#F05A3C] transition-colors cursor-pointer">Chat Studio</a></li>
                <li><a onClick={() => navigate('/images')} className="hover:text-[#F05A3C] transition-colors cursor-pointer">4K Image Studio</a></li>
                <li><a onClick={() => navigate('/dashboard')} className="hover:text-[#F05A3C] transition-colors cursor-pointer">Deep Web Research</a></li>
                <li><a onClick={() => navigate('/documents')} className="hover:text-[#F05A3C] transition-colors cursor-pointer">Document RAG Analysis</a></li>
                <li><a onClick={() => navigate('/chat')} className="hover:text-[#F05A3C] transition-colors cursor-pointer">Vector PDF Exporter</a></li>
                <li><a onClick={() => navigate('/analytics')} className="hover:text-[#F05A3C] transition-colors cursor-pointer">Telemetry & Analytics</a></li>
              </ul>
            </div>

            {/* Column 3: Candidate AI Models */}
            <div className="space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#171717] dark:text-[#F4F0E6]">AI Providers</div>
              <ul className="space-y-2 text-xs text-[#77736B] dark:text-[#A8A49C] font-medium">
                <li><a href="#models" className="hover:text-[#F05A3C] transition-colors">Google Gemini 2.5 Flash</a></li>
                <li><a href="#models" className="hover:text-[#F05A3C] transition-colors">Anthropic Claude 3.5 Sonnet</a></li>
                <li><a href="#models" className="hover:text-[#F05A3C] transition-colors">OpenAI GPT-4o Omnimodal</a></li>
                <li><a href="#models" className="hover:text-[#F05A3C] transition-colors">DeepSeek R1 Consensus</a></li>
                <li><a href="#architecture" className="hover:text-[#F05A3C] transition-colors">Automated Failover</a></li>
              </ul>
            </div>

            {/* Column 4: Pages & Resources */}
            <div className="space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#171717] dark:text-[#F4F0E6]">Governance</div>
              <ul className="space-y-2 text-xs text-[#77736B] dark:text-[#A8A49C] font-medium">
                <li><a onClick={() => navigate('/help')} className="hover:text-[#F05A3C] transition-colors cursor-pointer">Help & Documentation</a></li>
                <li><a onClick={() => navigate('/terms')} className="hover:text-[#F05A3C] transition-colors cursor-pointer">Terms of Service</a></li>
                <li><a onClick={() => navigate('/privacy')} className="hover:text-[#F05A3C] transition-colors cursor-pointer">Privacy Policy</a></li>
                <li><a onClick={() => navigate('/help')} className="hover:text-[#F05A3C] transition-colors cursor-pointer">Security Telemetry</a></li>
                <li><a onClick={() => navigate('/admin')} className="hover:text-[#F05A3C] transition-colors cursor-pointer">Admin Matrix</a></li>
              </ul>
            </div>
          </div>

          {/* Sub-Footer Copyright Bar */}
          <div className="pt-8 border-t border-[#DCD6CA] dark:border-[#33312B] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#77736B] dark:text-[#A8A49C]">
            <div>
              © 2026 SuperMind AI Inc. • One Prompt. Multiple AI Models. One Intelligent Answer.
            </div>
            <div className="flex items-center gap-6">
              <a onClick={() => navigate('/privacy')} className="hover:text-[#171717] dark:hover:text-[#F4F0E6] transition-colors cursor-pointer">Privacy</a>
              <a onClick={() => navigate('/terms')} className="hover:text-[#171717] dark:hover:text-[#F4F0E6] transition-colors cursor-pointer">Terms</a>
              <a onClick={() => navigate('/help')} className="hover:text-[#171717] dark:hover:text-[#F4F0E6] transition-colors cursor-pointer">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};