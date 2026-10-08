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
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      description: 'Primary high-speed intelligence engine configured for zero latency, full stack code generation, and instant prompt synthesis.',
    },
    claude: {
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic AI',
      latency: '240ms',
      quality: '99.5%',
      cost: '$0.00',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      description: 'Advanced reasoning engine for long-context document analysis, complex architectural decisions, and intricate logic execution.',
    },
    gpt4: {
      name: 'GPT-4o Omnimodal',
      provider: 'OpenAI Engine',
      latency: '210ms',
      quality: '99.4%',
      cost: '$0.00',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      description: 'Multimodal vision and creative prompt generator with high-resolution image rendering and creative writing capabilities.',
    },
    deepseek: {
      name: 'DeepSeek R1 Consensus',
      provider: 'DeepSeek Architecture',
      latency: '290ms',
      quality: '99.9%',
      cost: '$0.00',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      description: 'Deep mathematical logic, multi-LLM consensus verification, and automated code review engine.',
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
    <div className="min-h-screen bg-[#02040a] text-slate-100 flex flex-col font-sans select-none overflow-x-hidden relative">
      {/* Futuristic Classic Ambient Light Mesh Background */}
      <div className="fixed top-0 left-1/3 w-[750px] h-[750px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-cyan-500/15 rounded-full blur-[170px] pointer-events-none animate-pulseGlow z-0" />
      <div className="fixed bottom-0 right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-violet-600/15 via-indigo-600/10 to-fuchsia-500/10 rounded-full blur-[190px] pointer-events-none animate-float z-0" />

      {/* Futuristic Classic Navbar */}
      <header className="h-16 px-6 max-w-7xl mx-auto w-full flex items-center justify-between border-b border-white/10 backdrop-blur-2xl bg-[#02040a]/85 sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-600 text-white font-bold flex items-center justify-center text-sm shadow-lg shadow-indigo-500/30 animate-float font-display">
            S
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight text-white font-display">SuperMind</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-mono font-bold">
              AI ORCHESTRATOR
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
          <a href="#showcase" className="hover:text-indigo-400 transition-colors">Studio Preview</a>
          <a href="#features" className="hover:text-indigo-400 transition-colors">Capabilities</a>
          <a href="#models" className="hover:text-indigo-400 transition-colors">AI Models</a>
          <a href="#architecture" className="hover:text-indigo-400 transition-colors">Architecture</a>
          <a href="#pricing" className="hover:text-indigo-400 transition-colors">SaaS Pricing</a>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 cursor-pointer"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </header>

      {/* Futuristic Classic Hero Section */}
      <section className="pt-16 pb-16 px-6 max-w-7xl mx-auto w-full text-center space-y-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-md animate-pulse">
          <Sparkles className="h-4 w-4 text-indigo-400" />
          <span>Futuristic Multi-Model AI Engine • {tokenCounter.toLocaleString()} Tokens Synthesized</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.12] max-w-5xl mx-auto text-white font-display">
          One Prompt.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-300 animate-gradientText">
            Multiple AI Models.
          </span>{' '}
          One Intelligent Answer.
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          SuperMind evaluates request intent, complex code queries, and document tasks to automatically route to candidate models in real time.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-2xl shadow-indigo-500/40 hover:scale-105 transition-all cursor-pointer"
          >
            <span>Launch Chat Studio</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-sm transition-all cursor-pointer"
          >
            Explore AI Provider Matrix
          </button>
        </div>

        {/* Live HD Studio Preview Window */}
        <div id="showcase" className="pt-10 max-w-5xl mx-auto">
          <div className="relative rounded-3xl p-2.5 bg-gradient-to-b from-indigo-500/30 via-purple-500/20 to-transparent border border-white/15 shadow-2xl shadow-indigo-500/10 group">
            {/* Live Badge Overlay */}
            <div className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#030712]/90 border border-white/20 text-xs font-mono font-bold text-indigo-300 backdrop-blur-md shadow-lg">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>SuperMind AI Studio Dashboard • 4K HD Visual Preview</span>
            </div>

            {/* Generated High-Definition AI Studio Graphic */}
            <div className="overflow-hidden rounded-2xl border border-white/10 relative">
              <img
                src="/ai_studio_preview.png"
                alt="SuperMind AI Studio Dashboard Interface"
                className="w-full h-auto object-cover transform group-hover:scale-[1.01] transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Live Router Telemetry Box */}
        <div className="pt-6 max-w-3xl mx-auto">
          <div className="p-5 sm:p-6 rounded-3xl bg-[#070b19]/90 backdrop-blur-2xl border border-indigo-500/30 shadow-2xl shadow-indigo-500/15 space-y-4 text-left transition-all duration-500">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-xs font-mono text-slate-400 ml-2">Live Supervisor Router Telemetry</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-mono text-emerald-300 font-bold">ACTIVE</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-mono text-slate-400 flex items-start gap-2">
                <span className="text-indigo-400 font-bold">USER &gt;</span>
                <span className="text-slate-100 font-medium">{demoScenarios[demoIndex].prompt}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-950/70 border border-indigo-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-indigo-400 animate-pulse" />
                  <div>
                    <div className="text-xs font-mono text-indigo-200 font-bold">
                      Routed to: {demoScenarios[demoIndex].model}
                    </div>
                    <div className="text-[10px] text-slate-400">{demoScenarios[demoIndex].status}</div>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 font-bold shrink-0">
                  Latency: {demoScenarios[demoIndex].latency}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Model Showcase Section */}
      <section id="models" className="py-16 px-6 max-w-7xl mx-auto w-full space-y-10 border-t border-white/10 relative z-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
            Multi-LLM Candidate Model Matrix
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            SuperMind integrates candidate models for instant failover and synthesis.
          </p>
        </div>

        {/* Interactive Model Selector Tabs */}
        <div className="flex justify-center flex-wrap gap-2 sm:gap-3">
          {(['gemini', 'claude', 'gpt4', 'deepseek'] as const).map((key) => {
            const spec = modelSpecs[key];
            const isSelected = activeModel === key;
            return (
              <button
                key={key}
                onClick={() => setActiveModel(key)}
                className={`py-2.5 px-5 rounded-2xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30 scale-105 border border-indigo-400/40'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                {spec.name}
              </button>
            );
          })}
        </div>

        {/* Model Specs Detail Card */}
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#070b19]/90 backdrop-blur-2xl border border-indigo-500/30 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="text-xl font-bold text-white font-display">{modelSpecs[activeModel].name}</div>
              <div className="text-xs text-slate-400 mt-1 leading-relaxed">{modelSpecs[activeModel].description}</div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${modelSpecs[activeModel].badgeColor}`}>
              {modelSpecs[activeModel].provider}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-xs font-mono text-slate-400">Response Latency</div>
              <div className="text-lg sm:text-xl font-extrabold text-indigo-400 mt-1">{modelSpecs[activeModel].latency}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-xs font-mono text-slate-400">Quality Score</div>
              <div className="text-lg sm:text-xl font-extrabold text-emerald-400 mt-1">{modelSpecs[activeModel].quality}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-xs font-mono text-slate-400">Token Cost</div>
              <div className="text-lg sm:text-xl font-extrabold text-cyan-400 mt-1">{modelSpecs[activeModel].cost}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Futuristic Capabilities Matrix Section */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12 border-t border-white/10 relative z-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-display">SuperMind Capabilities Matrix</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Everything you need in one intelligent multi-model workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((c, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#070b19]/80 backdrop-blur-2xl border border-white/10 space-y-3 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1.5 transition-all duration-200 group"
            >
              <div className="h-10 w-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/20 group-hover:bg-gradient-to-tr group-hover:from-indigo-500 group-hover:to-violet-600 group-hover:text-white transition-all duration-200">
                <c.icon className="h-5 w-5" />
              </div>
              <div className="text-xs font-semibold text-indigo-400">{c.subtitle}</div>
              <h3 className="text-base font-bold text-white">{c.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture Pipeline Visualizer */}
      <section id="architecture" className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12 border-t border-white/10 relative z-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-display">Stitch Architecture Pipeline</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            How prompts flow through intent classification, capability matching, and final response synthesis.
          </p>
        </div>

        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#070b19]/90 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-1/4 p-4 rounded-2xl bg-white/5 text-center space-y-1 border border-white/10 hover:border-indigo-500/40 transition-colors">
              <div className="text-xs font-mono text-indigo-400 font-bold">1. USER PROMPT</div>
              <div className="text-xs font-semibold text-slate-200">Natural Language</div>
            </div>

            <div className="hidden md:block text-indigo-400 font-bold animate-pulse">→</div>

            <div className="w-full md:w-1/4 p-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 text-white text-center space-y-1 shadow-lg shadow-indigo-500/25 border border-indigo-400/30 animate-pulseGlow">
              <div className="text-xs font-mono text-indigo-100 font-bold flex items-center justify-center gap-1">
                <Bot className="h-3.5 w-3.5" /> 2. SUPERVISOR
              </div>
              <div className="text-xs font-bold">Intent & Routing</div>
            </div>

            <div className="hidden md:block text-indigo-400 font-bold animate-pulse">→</div>

            <div className="w-full md:w-1/4 p-4 rounded-2xl bg-white/5 text-center space-y-1 border border-white/10 hover:border-cyan-500/40 transition-colors">
              <div className="text-xs font-mono text-cyan-400 font-bold">3. CANDIDATES</div>
              <div className="text-xs font-semibold text-slate-200">Gemini • Claude • GPT-4o</div>
            </div>

            <div className="hidden md:block text-indigo-400 font-bold animate-pulse">→</div>

            <div className="w-full md:w-1/4 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-center space-y-1">
              <div className="text-xs font-mono text-emerald-400 font-bold">4. SYNTHESIS</div>
              <div className="text-xs font-semibold text-emerald-300">Verified Answer</div>
            </div>
          </div>
        </div>
      </section>

      {/* SaaS Pricing Section */}
      <section id="pricing" className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12 border-t border-white/10 relative z-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-display">Flexible SaaS Pricing</h2>
          <p className="text-xs sm:text-sm text-slate-400">Choose the plan that fits your prompt workflow.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#070b19]/80 backdrop-blur-2xl border border-white/10 space-y-6 flex flex-col justify-between hover:border-indigo-500/30 transition-all">
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Starter</div>
              <div className="text-3xl font-extrabold text-white">$0 <span className="text-xs text-slate-400 font-normal">/ mo</span></div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> 100k Monthly Tokens</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Google Gemini Routing</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Vector PDF Document Exporter</li>
              </ul>
            </div>
            <Button variant="secondary" onClick={() => navigate('/dashboard')}>
              Get Started Free
            </Button>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#111936] to-[#0a1026] text-white border-2 border-indigo-500/80 shadow-2xl shadow-indigo-500/20 space-y-6 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-300">Pro Intelligence</div>
              <div className="text-3xl font-extrabold">$29 <span className="text-xs text-indigo-200 font-normal">/ mo</span></div>
              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> 5M Monthly Tokens</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> Multi-Model Consensus Engine</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> 4K Image Studio & Document RAG</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> Unlimited PDF Exports</li>
              </ul>
            </div>
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              Upgrade to Pro
            </Button>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-[#070b19]/80 backdrop-blur-2xl border border-white/10 space-y-6 flex flex-col justify-between hover:border-indigo-500/30 transition-all">
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Enterprise</div>
              <div className="text-3xl font-extrabold text-white">$99 <span className="text-xs text-slate-400 font-normal">/ mo</span></div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Unlimited Tokens</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Dedicated Supervisor SLA</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Custom Model Fine-Tuning</li>
              </ul>
            </div>
            <Button variant="secondary" onClick={() => navigate('/register')}>
              Contact Enterprise
            </Button>
          </div>
        </div>
      </section>

      {/* Comprehensive Multi-Column SaaS Footer */}
      <footer className="bg-[#010308] border-t border-white/10 pt-16 pb-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Column 1: Brand & Details */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-indigo-500/25 font-display">
                  S
                </div>
                <span className="font-extrabold text-lg tracking-tight text-white font-display">SuperMind AI</span>
              </div>

              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                SuperMind is an enterprise-grade multi-LLM orchestrator that evaluates request intent, complex code queries, and document tasks to synthesize optimal answers.
              </p>

              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs w-fit font-mono font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>System Status: 100% Operational</span>
              </div>
            </div>

            {/* Column 2: Products & Features */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-200">Products & Features</div>
              <ul className="space-y-2 text-xs text-slate-400 font-medium">
                <li><a onClick={() => navigate('/chat')} className="hover:text-indigo-400 transition-colors cursor-pointer">Chat Studio</a></li>
                <li><a onClick={() => navigate('/images')} className="hover:text-indigo-400 transition-colors cursor-pointer">4K Image Studio</a></li>
                <li><a onClick={() => navigate('/dashboard')} className="hover:text-indigo-400 transition-colors cursor-pointer">Deep Web Research</a></li>
                <li><a onClick={() => navigate('/documents')} className="hover:text-indigo-400 transition-colors cursor-pointer">Document RAG Analysis</a></li>
                <li><a onClick={() => navigate('/chat')} className="hover:text-indigo-400 transition-colors cursor-pointer">Vector PDF Exporter</a></li>
                <li><a onClick={() => navigate('/analytics')} className="hover:text-indigo-400 transition-colors cursor-pointer">Telemetry & Analytics</a></li>
              </ul>
            </div>

            {/* Column 3: Candidate AI Models */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-200">AI Models</div>
              <ul className="space-y-2 text-xs text-slate-400 font-medium">
                <li><a href="#models" className="hover:text-indigo-400 transition-colors">Google Gemini 2.5 Flash</a></li>
                <li><a href="#models" className="hover:text-indigo-400 transition-colors">Anthropic Claude 3.5 Sonnet</a></li>
                <li><a href="#models" className="hover:text-indigo-400 transition-colors">OpenAI GPT-4o Omnimodal</a></li>
                <li><a href="#models" className="hover:text-indigo-400 transition-colors">DeepSeek R1 Consensus</a></li>
                <li><a href="#architecture" className="hover:text-indigo-400 transition-colors">Automated Model Failover</a></li>
              </ul>
            </div>

            {/* Column 4: Pages & Resources */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-200">Pages & Legal</div>
              <ul className="space-y-2 text-xs text-slate-400 font-medium">
                <li><a onClick={() => navigate('/help')} className="hover:text-indigo-400 transition-colors cursor-pointer">Help & Documentation</a></li>
                <li><a onClick={() => navigate('/terms')} className="hover:text-indigo-400 transition-colors cursor-pointer">Terms of Service</a></li>
                <li><a onClick={() => navigate('/privacy')} className="hover:text-indigo-400 transition-colors cursor-pointer">Privacy Policy</a></li>
                <li><a onClick={() => navigate('/help')} className="hover:text-indigo-400 transition-colors cursor-pointer">Security Audit & Telemetry</a></li>
                <li><a onClick={() => navigate('/admin')} className="hover:text-indigo-400 transition-colors cursor-pointer">Admin Governance</a></li>
              </ul>
            </div>
          </div>

          {/* Sub-Footer Copyright Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              © 2026 SuperMind AI Inc. All rights reserved. • One Prompt. Multiple AI Models. One Intelligent Answer.
            </div>
            <div className="flex items-center gap-6">
              <a onClick={() => navigate('/privacy')} className="hover:text-slate-300 transition-colors cursor-pointer">Privacy</a>
              <a onClick={() => navigate('/terms')} className="hover:text-slate-300 transition-colors cursor-pointer">Terms</a>
              <a onClick={() => navigate('/help')} className="hover:text-slate-300 transition-colors cursor-pointer">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
