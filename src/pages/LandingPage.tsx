import React, { useState, useEffect, useRef } from 'react';
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
  Image as ImageIcon,
  FileDown,
  Globe,
  ShieldCheck,
  Zap,
  Activity,
  Terminal,
  CheckCircle2,
  Sliders,
  CreditCard,
  Gauge,
  Workflow,
  ChevronDown,
  MousePointer2,
  Compass,
  Radio,
  Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [activeModel, setActiveModel] = useState<'gemini' | 'claude' | 'gpt4' | 'deepseek' | 'grok' | 'kimi'>('gemini');
  const [tokenCounter, setTokenCounter] = useState(3429810);
  const [demoIndex, setDemoIndex] = useState(0);

  // Mouse Movement Autoplay & Stop State
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stopTimerRef = useRef<any>(null);
  const animRef = useRef<number>(0);
  const rotationAngleRef = useRef<number>(0);
  const speedRef = useRef<number>(0.2); // Idle ambient speed
  const targetSpeedRef = useRef<number>(0.2);

  // Mouse Move Event Listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x: normX, y: normY });

      setIsMouseMoving(true);
      targetSpeedRef.current = 1.4; // Accelerate playback on mouse movement

      if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
      stopTimerRef.current = setTimeout(() => {
        setIsMouseMoving(false);
        targetSpeedRef.current = 0.2; // Return to gentle ambient idle
      }, 200);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
    };
  }, []);

  // Live Animated Cyber Canvas (Turns image into a continuously playing futuristic animated loop)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particles along orbital paths
    const particles = Array.from({ length: 42 }).map(() => ({
      orbitRadius: 180 + Math.random() * 260,
      angle: Math.random() * Math.PI * 2,
      speed: 0.004 + Math.random() * 0.008,
      size: 1.5 + Math.random() * 2.5,
      color: Math.random() > 0.5 ? '#2457D6' : Math.random() > 0.5 ? '#00f0ff' : '#F05A3C',
    }));

    const render = () => {
      // Smoothly interpolate animation speed based on mouse motion
      speedRef.current += (targetSpeedRef.current - speedRef.current) * 0.08;
      rotationAngleRef.current += speedRef.current * 0.015;
      const rot = rotationAngleRef.current;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Orbital Telemetry Rings
      ctx.save();
      ctx.translate(centerX, centerY);

      // Ring 1: Outer Cyan Arc with dashes
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(width, height) * 0.36, rot, rot + Math.PI * 1.4);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 14]);
      ctx.stroke();

      // Ring 2: Counter-rotating Cobalt Arc
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(width, height) * 0.42, -rot * 0.8, -rot * 0.8 + Math.PI * 0.9);
      ctx.strokeStyle = 'rgba(36, 87, 214, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([16, 20]);
      ctx.stroke();

      // Ring 3: Inner Vermilion Target Reticle
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(width, height) * 0.28, rot * 1.5, rot * 1.5 + Math.PI * 0.5);
      ctx.strokeStyle = 'rgba(240, 90, 60, 0.45)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 8]);
      ctx.stroke();

      // Sweeping Radar Line
      ctx.beginPath();
      ctx.moveTo(0, 0);
      const sweepLen = Math.min(width, height) * 0.44;
      ctx.lineTo(Math.cos(rot * 2) * sweepLen, Math.sin(rot * 2) * sweepLen);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.22)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();

      // 2. Data Packet Orbiting Nodes
      particles.forEach((p) => {
        p.angle += p.speed * (speedRef.current * 1.8);
        const px = centerX + Math.cos(p.angle) * p.orbitRadius;
        const py = centerY + Math.sin(p.angle) * (p.orbitRadius * 0.45); // Elliptical perspective

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

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
      badgeColor: 'border-[#C7D83D]/40 text-[#C7D83D] bg-[#C7D83D]/10',
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
      badgeColor: 'border-[#2457D6]/40 text-[#88A9FF] bg-[#2457D6]/10',
      description: 'Multimodal vision and creative prompt generator with high-resolution image rendering and editorial drafting.',
    },
    deepseek: {
      name: 'DeepSeek R1 Consensus',
      provider: 'DeepSeek Architecture',
      latency: '290ms',
      quality: '99.9%',
      cost: '$0.00',
      badgeColor: 'border-[#77736B]/40 text-[#F4F0E6] bg-white/5',
      description: 'Mathematical reasoning, multi-LLM consensus verification, and automated algorithmic code analysis.',
    },
    grok: {
      name: 'xAI Grok 2',
      provider: 'xAI Architecture',
      latency: '220ms',
      quality: '99.2%',
      cost: '$0.00',
      badgeColor: 'border-[#F05A3C]/40 text-[#F05A3C] bg-[#F05A3C]/10',
      description: 'Real-time contextual awareness, unfiltered logic synthesis, and accelerated reasoning capabilities.',
    },
    kimi: {
      name: 'Moonshot Kimi k1.5',
      provider: 'Moonshot AI',
      latency: '250ms',
      quality: '99.6%',
      cost: '$0.00',
      badgeColor: 'border-[#2457D6]/40 text-[#88A9FF] bg-[#2457D6]/10',
      description: 'Long-context processing specialist with 2M token context handling and precision retrieval.',
    },
  };

  const corePillars = [
    {
      title: 'Multi-Model AI',
      subtitle: 'Universal Provider Gateway',
      desc: 'Access premier foundation models including OpenAI, Claude, Gemini, Grok, DeepSeek, and Kimi with unified routing.',
      icon: Cpu,
      color: '#F05A3C',
    },
    {
      title: 'AI Chat Workspace',
      subtitle: 'Single Collaborative Canvas',
      desc: 'Interact with different models seamlessly through one synchronized interface with file uploads, search, and synthesis.',
      icon: Layers,
      color: '#2457D6',
    },
    {
      title: 'Intelligent AI Agents',
      subtitle: 'Autonomous Workflows',
      desc: 'Deploy specialized task agents for deep web research, code refactoring, complex mathematical proofs, and data analysis.',
      icon: Brain,
      color: '#C7D83D',
    },
    {
      title: 'Model Orchestration',
      subtitle: 'Dynamic Capability Matching',
      desc: 'Supervisor AI inspects query intent, token complexity, and speed requirements to dispatch to the optimal LLM automatically.',
      icon: Workflow,
      color: '#D97706',
    },
    {
      title: 'API Services',
      subtitle: 'Unified Developer Endpoint',
      desc: 'High-availability unified API gateway with drop-in compatibility, automatic model failover, and telemetry instrumentation.',
      icon: Terminal,
      color: '#2457D6',
    },
    {
      title: 'Subscriptions & Credits',
      subtitle: 'Transparent Metering',
      desc: 'Flexible paid plans, prepaid token packs, and usage-based billing with zero hidden seat surcharges.',
      icon: CreditCard,
      color: '#F05A3C',
    },
    {
      title: 'Admin Governance',
      subtitle: 'Platform Operations',
      desc: 'Manage users, monitor foundation provider SLA status, enforce rate limits, and analyze real-time request volume.',
      icon: ShieldCheck,
      color: '#10B981',
    },
  ];

  return (
    <div className="min-h-screen text-[#F4F0E6] bg-transparent flex flex-col font-sans select-none overflow-x-hidden relative">
      
      {/* ========================================================================= */}
      {/* 1. FIXED BACKGROUND: STRETCHED CYBER GLOBE GIF + ANIMATED CANVAS ENGINE  */}
      {/* This background stays FIXED in place; all text & sections scroll OVER it  */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-[#05070e]">
        {/* Full-bleed stretched visual image */}
        <img
          src="/hero_orchestration_globe.jpg"
          alt="SuperMind AI Global Orchestration Core"
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
          style={{
            transform: `scale(${isMouseMoving ? 1.04 : 1.01}) translate3d(${mousePos.x * 12}px, ${mousePos.y * 8}px, 0)`,
            transition: 'transform 0.4s ease-out, filter 0.4s ease-out',
            filter: isMouseMoving ? 'brightness(1.15) saturate(1.2)' : 'brightness(0.95) saturate(1.05)',
          }}
        />

        {/* Live Canvas: Spinning orbital rings & glowing data nodes (turns it into a playing GIF) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-75"
        />

        {/* Cyber scanline overlay */}
        <div className="absolute inset-0 w-full h-full cyber-scanline pointer-events-none opacity-30 mix-blend-screen z-20" />

        {/* Radial dark vignette ensuring all scrolling text has pristine contrast */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#05070e]/50 to-[#05070e]/95 pointer-events-none z-20" />
      </div>

      {/* ========================================================================= */}
      {/* STICKY GLASSMORPHIC HEADER OVER FIXED BACKGROUND                          */}
      {/* ========================================================================= */}
      <header className="h-16 px-4 sm:px-8 max-w-7xl mx-auto w-full flex items-center justify-between border-b border-white/10 bg-[#070b16]/75 backdrop-blur-xl sticky top-0 z-50 shadow-editorial">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="h-8 w-8 rounded-lg bg-[#F05A3C] text-white font-serif font-bold flex items-center justify-center text-sm shadow-subtle border border-[#F05A3C]/40">
            S
          </div>
          <div className="flex items-center gap-2">
            <span className="font-serif font-normal text-lg tracking-tight text-white">SuperMind</span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded border border-white/15 bg-white/5 text-[#A8A49C] text-[10px] font-mono tracking-wider uppercase">
              AI Orchestrator
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#DCD6CA]">
          <a href="#vision" className="hover:text-[#F05A3C] transition-colors">Vision</a>
          <a href="#capabilities" className="hover:text-[#F05A3C] transition-colors">Capabilities</a>
          <a href="#models" className="hover:text-[#F05A3C] transition-colors">AI Models</a>
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
                className="py-2 px-3.5 rounded-xl border border-white/20 bg-white/5 text-white text-xs font-medium hover:bg-white/10 transition-all cursor-pointer backdrop-blur-md"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="py-2 px-4 rounded-xl bg-[#F05A3C] hover:bg-[#d9482b] text-white text-xs font-medium shadow-subtle transition-all cursor-pointer"
              >
                Start Free Trial
              </button>
            </>
          )}
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION: ALL TEXT HOVERS DIRECTLY IN FRONT OF FIXED BACKGROUND    */}
      {/* ========================================================================= */}
      <section id="vision" className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-16 px-6 text-center relative z-20">
        
        {/* Status Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 pb-6">
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0a0e1a]/85 border border-white/20 backdrop-blur-xl font-mono text-[11px] text-[#A8A49C] shadow-editorial hover:border-[#F05A3C] transition-all">
            <span className="h-2 w-2 rounded-full bg-[#C7D83D] animate-ping" />
            <span className="text-white font-medium">SUPERMIND GLOBAL ORCHESTRATOR</span>
            <span className="text-white/30">•</span>
            <span className="text-[#C7D83D] font-bold">LIVE ONLINE</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0a0e1a]/85 border border-white/20 backdrop-blur-xl font-mono text-[11px] text-[#DCD6CA] shadow-editorial">
            <MousePointer2 className={`h-3.5 w-3.5 transition-colors ${isMouseMoving ? 'text-[#C7D83D] animate-spin' : 'text-[#77736B]'}`} />
            <span className="text-[#A8A49C]">KINETIC AUTOPLAY:</span>
            <span className={isMouseMoving ? 'text-[#C7D83D] font-bold' : 'text-[#77736B] font-semibold'}>
              {isMouseMoving ? 'ACTIVE (ACCELERATED)' : 'PLAYING AMBIENT (MOVE MOUSE)'}
            </span>
          </div>
        </div>

        {/* Main Floating Glass Hero Box */}
        <div className="w-full max-w-4xl p-8 sm:p-14 rounded-3xl bg-[#070b16]/80 border border-white/20 backdrop-blur-2xl shadow-editorial space-y-6 hover:border-white/30 transition-all">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-xs font-mono text-[#F05A3C]">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>All-In-One Unified AI Ecosystem</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal tracking-tight text-white leading-[1.08]">
            One Unified Workspace.{' '}
            <span className="italic text-[#F05A3C] drop-shadow-md">Every Leading AI Model.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#DCD6CA] max-w-2xl mx-auto leading-relaxed font-normal">
            SuperMind AI brings multiple AI models, providers, and intelligent agents together into one unified workspace—letting you access, compare, orchestrate, and cross-synthesize artificial intelligence seamlessly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="py-3.5 px-8 rounded-xl bg-[#F05A3C] hover:bg-[#d9482b] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-editorial transition-all hover:scale-105 cursor-pointer"
            >
              <span>Launch Unified Chat Studio</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate('/register')}
              className="py-3.5 px-8 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs font-medium backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
            >
              Start Free Trial (100k Tokens)
            </button>
          </div>
        </div>

        {/* Live Provider Latency Chips Floating Over Fixed Background */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 w-full max-w-5xl pt-10">
          {[
            { name: 'OpenAI GPT-4o', latency: '210ms', tag: 'Omnimodal', color: '#2457D6' },
            { name: 'Claude 3.5 Sonnet', latency: '240ms', tag: 'Reasoning', color: '#F05A3C' },
            { name: 'Google Gemini 2.5', latency: '180ms', tag: 'High-Speed', color: '#C7D83D' },
            { name: 'xAI Grok 2', latency: '220ms', tag: 'Realtime', color: '#F05A3C' },
            { name: 'DeepSeek R1', latency: '290ms', tag: 'Consensus', color: '#88A9FF' },
            { name: 'Moonshot Kimi', latency: '250ms', tag: '2M Context', color: '#10B981' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-[#070b16]/80 border border-white/15 backdrop-blur-xl text-left space-y-1 shadow-editorial hover:border-[#F05A3C] hover:scale-105 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-xs font-medium text-white truncate">{item.name}</span>
                <span className="font-mono text-[9px] text-[#C7D83D] font-bold">{item.latency}</span>
              </div>
              <div className="text-[10px] font-mono text-[#A8A49C]">{item.tag}</div>
            </div>
          ))}
        </div>

        <div className="pt-8 text-xs font-mono text-[#DCD6CA] flex items-center gap-1.5 animate-bounce">
          <ChevronDown className="h-4 w-4 text-[#F05A3C]" />
          <span>SCROLL DOWN TO EXPLORE THE PLATFORM ECOSYSTEM</span>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WHAT SUPERMIND AI DOES — FULL ECOSYSTEM CAPABILITIES OVERLAP           */}
      {/* ========================================================================= */}
      <section id="capabilities" className="py-24 px-6 max-w-7xl mx-auto w-full space-y-14 text-left relative z-20">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-[#070b16]/80 backdrop-blur-md text-[10px] font-mono tracking-wider uppercase text-[#DCD6CA]">
            Core Platform Architecture
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-white">
            What SuperMind AI Does
          </h2>
          <p className="text-sm text-[#DCD6CA] leading-relaxed">
            SuperMind AI is engineered as an all-in-one AI ecosystem where individuals, developers, and enterprise teams can access, compare, orchestrate, and monetize artificial intelligence capabilities under one roof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {corePillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-2xl bg-[#070b16]/80 border border-white/15 backdrop-blur-2xl space-y-4 shadow-editorial hover:border-[#F05A3C] hover:scale-[1.02] transition-all group"
              >
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center border transition-colors shadow-2xs"
                  style={{
                    backgroundColor: `${pillar.color}20`,
                    borderColor: `${pillar.color}40`,
                    color: pillar.color,
                  }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#A8A49C]">
                    {pillar.subtitle}
                  </div>
                  <h3 className="text-lg font-serif font-normal text-white">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-xs text-[#DCD6CA] leading-relaxed font-normal">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE MODEL MATRIX SECTION OVERLAPPING FIXED BACKGROUND          */}
      {/* ========================================================================= */}
      <section id="models" className="py-20 px-6 max-w-7xl mx-auto w-full space-y-10 text-center relative z-20">
        <div className="space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-[#070b16]/80 backdrop-blur-md text-[10px] font-mono tracking-wider uppercase text-[#DCD6CA]">
            Model Intelligence Matrix
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-white">
            Compare Candidate Models in Real-Time
          </h2>
          <p className="text-xs sm:text-sm text-[#DCD6CA]">
            Inspect live performance metrics, quality benchmarks, and specialties across our connected provider matrix.
          </p>
        </div>

        {/* Model Tabs */}
        <div className="flex justify-center flex-wrap gap-2">
          {(['gemini', 'claude', 'gpt4', 'deepseek', 'grok', 'kimi'] as const).map((key) => {
            const spec = modelSpecs[key];
            const isSelected = activeModel === key;
            return (
              <button
                key={key}
                onClick={() => setActiveModel(key)}
                className={`py-2 px-4 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#F05A3C] text-white shadow-editorial font-semibold scale-105'
                    : 'bg-[#070b16]/80 hover:bg-white/10 text-[#DCD6CA] border border-white/15 backdrop-blur-md'
                }`}
              >
                {spec.name}
              </button>
            );
          })}
        </div>

        {/* Selected Model Spec Card */}
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-[#070b16]/85 border border-white/20 backdrop-blur-2xl shadow-editorial space-y-6 text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="text-xl font-serif font-normal text-white">
                {modelSpecs[activeModel].name}
              </div>
              <div className="text-xs text-[#DCD6CA] mt-1 leading-relaxed">
                {modelSpecs[activeModel].description}
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border ${modelSpecs[activeModel].badgeColor}`}>
              {modelSpecs[activeModel].provider}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#A8A49C]">Response Latency</div>
              <div className="text-lg sm:text-xl font-serif text-[#F05A3C] mt-1">{modelSpecs[activeModel].latency}</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#A8A49C]">Quality Score</div>
              <div className="text-lg sm:text-xl font-serif text-emerald-400 mt-1">{modelSpecs[activeModel].quality}</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#A8A49C]">Token Cost</div>
              <div className="text-lg sm:text-xl font-serif text-[#88A9FF] mt-1">{modelSpecs[activeModel].cost}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. OUR VISION MANIFESTO OVERLAPPING FIXED BACKGROUND                      */}
      {/* ========================================================================= */}
      <section className="py-20 px-6 max-w-5xl mx-auto w-full text-center relative z-20">
        <div className="p-8 sm:p-14 rounded-3xl bg-[#070b16]/85 text-[#F4F0E6] border border-white/20 backdrop-blur-2xl shadow-editorial space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white font-mono text-[10px] uppercase tracking-wider">
            Our Mission & Vision
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal tracking-tight max-w-3xl mx-auto leading-tight text-white">
            Build SuperMind AI into a premium, reliable, scalable platform that makes advanced artificial intelligence accessible through one beautifully designed application.
          </h2>

          <p className="text-xs sm:text-sm text-[#DCD6CA] max-w-xl mx-auto leading-relaxed">
            Eliminating silos between AI providers. Whether you need Claude's deep reasoning, Gemini's speed, or OpenAI's multimodal vision, SuperMind delivers unified mastery.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/register')}
              className="py-3 px-6 rounded-xl bg-[#F05A3C] hover:bg-[#d9482b] text-white text-xs font-semibold shadow-subtle transition-all hover:scale-105 cursor-pointer"
            >
              Start Free Trial (100k Tokens)
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="py-3 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium border border-white/20 transition-all hover:scale-105 cursor-pointer backdrop-blur-md"
            >
              Explore Chat Studio
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SAAS PRICING & SUBSCRIPTION TIERS OVERLAPPING FIXED BACKGROUND         */}
      {/* ========================================================================= */}
      <section id="pricing" className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12 text-center relative z-20">
        <div className="space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-[#070b16]/80 backdrop-blur-md text-[10px] font-mono tracking-wider uppercase text-[#DCD6CA]">
            Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-white">
            Choose Your Intelligence Capacity
          </h2>
          <p className="text-xs sm:text-sm text-[#DCD6CA]">
            Every new user starts with a 100k Free Trial. Upgrade whenever you need higher quotas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch text-left">
          {/* Starter Plan */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#070b16]/85 border border-white/15 backdrop-blur-2xl space-y-6 flex flex-col justify-between shadow-editorial hover:border-white/30 transition-all">
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-[#A8A49C]">Starter</div>
              <div className="text-3xl font-serif text-white">$9 <span className="text-xs text-[#A8A49C] font-normal">/ mo</span></div>
              <ul className="space-y-2.5 text-xs text-[#DCD6CA]">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#F05A3C]" /> 500k Monthly Tokens</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#F05A3C]" /> Gemini & DeepSeek Routing</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#F05A3C]" /> Document RAG Analysis</li>
              </ul>
            </div>
            <Button variant="outline" onClick={() => navigate('/register')} className="w-full">
              Choose Starter
            </Button>
          </div>

          {/* Pro Intelligence Plan */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#070b16]/90 border-2 border-[#F05A3C] backdrop-blur-2xl shadow-editorial space-y-6 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#F05A3C] font-semibold">Pro Intelligence</span>
                <span className="px-2 py-0.5 rounded-full bg-[#F05A3C] text-white text-[9px] font-mono font-bold uppercase">Popular</span>
              </div>
              <div className="text-3xl font-serif text-white">$29 <span className="text-xs text-[#A8A49C] font-normal">/ mo</span></div>
              <ul className="space-y-2.5 text-xs text-white">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#F05A3C]" /> 5M Monthly Tokens</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#F05A3C]" /> Multi-Model Consensus Engine</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#F05A3C]" /> 4K Image Studio & Vector PDF</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#F05A3C]" /> Autonomous Task Agents</li>
              </ul>
            </div>
            <Button variant="primary" onClick={() => navigate('/register')} className="w-full">
              Start With Free Trial
            </Button>
          </div>

          {/* Enterprise Plan */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#070b16]/85 border border-white/15 backdrop-blur-2xl space-y-6 flex flex-col justify-between shadow-editorial hover:border-white/30 transition-all">
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-[#A8A49C]">Enterprise</div>
              <div className="text-3xl font-serif text-white">$99 <span className="text-xs text-[#A8A49C] font-normal">/ mo</span></div>
              <ul className="space-y-2.5 text-xs text-[#DCD6CA]">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#F05A3C]" /> 50M Monthly Tokens</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#F05A3C]" /> Dedicated Supervisor SLA</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#F05A3C]" /> Custom Model Fine-Tuning & Admin</li>
              </ul>
            </div>
            <Button variant="outline" onClick={() => navigate('/register')} className="w-full">
              Contact Enterprise
            </Button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. MULTI-COLUMN FOOTER OVERLAPPING FIXED BACKGROUND                       */}
      {/* ========================================================================= */}
      <footer className="border-t border-white/10 bg-[#05070e]/95 backdrop-blur-2xl pt-16 pb-12 px-6 relative z-20 text-left">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="h-8 w-8 rounded-lg bg-[#F05A3C] text-white font-serif font-bold flex items-center justify-center text-sm shadow-subtle">
                  S
                </div>
                <span className="font-serif font-normal text-lg tracking-tight text-white">SuperMind AI</span>
              </div>

              <p className="text-xs text-[#DCD6CA] max-w-sm leading-relaxed">
                SuperMind AI is an all-in-one ecosystem uniting multiple AI models, providers, and intelligent agents into one unified application.
              </p>

              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs w-fit font-mono font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>System Status: 100% Operational</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-wider text-white">Ecosystem</div>
              <ul className="space-y-2 text-xs text-[#DCD6CA] font-medium">
                <li><a onClick={() => navigate('/chat')} className="hover:text-[#F05A3C] transition-colors cursor-pointer">Multi-Model Chat</a></li>
                <li><a onClick={() => navigate('/images')} className="hover:text-[#F05A3C] transition-colors cursor-pointer">4K Image Studio</a></li>
                <li><a onClick={() => navigate('/documents')} className="hover:text-[#F05A3C] transition-colors cursor-pointer">Document Vector RAG</a></li>
                <li><a onClick={() => navigate('/analytics')} className="hover:text-[#F05A3C] transition-colors cursor-pointer">Telemetry & Usage</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-wider text-white">Supported Providers</div>
              <ul className="space-y-2 text-xs text-[#DCD6CA] font-medium">
                <li><a href="#models" className="hover:text-[#F05A3C] transition-colors">OpenAI GPT-4o</a></li>
                <li><a href="#models" className="hover:text-[#F05A3C] transition-colors">Anthropic Claude 3.5</a></li>
                <li><a href="#models" className="hover:text-[#F05A3C] transition-colors">Google Gemini 2.5</a></li>
                <li><a href="#models" className="hover:text-[#F05A3C] transition-colors">xAI Grok 2</a></li>
                <li><a href="#models" className="hover:text-[#F05A3C] transition-colors">DeepSeek R1</a></li>
                <li><a href="#models" className="hover:text-[#F05A3C] transition-colors">Moonshot Kimi</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-wider text-white">Governance</div>
              <ul className="space-y-2 text-xs text-[#DCD6CA] font-medium">
                <li><a onClick={() => navigate('/terms')} className="hover:text-[#F05A3C] transition-colors cursor-pointer">Terms of Service</a></li>
                <li><a onClick={() => navigate('/privacy')} className="hover:text-[#F05A3C] transition-colors cursor-pointer">Privacy Policy</a></li>
                <li><a onClick={() => navigate('/help')} className="hover:text-[#F05A3C] transition-colors cursor-pointer">Help & Documentation</a></li>
                <li><a onClick={() => navigate('/admin')} className="hover:text-[#F05A3C] transition-colors cursor-pointer">Admin Governance</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A8A49C]">
            <div>
              © 2026 SuperMind AI Inc. All rights reserved. • One Unified Workspace. Every World-Class AI Model.
            </div>
            <div className="flex items-center gap-6">
              <a onClick={() => navigate('/privacy')} className="hover:text-white transition-colors cursor-pointer">Privacy</a>
              <a onClick={() => navigate('/terms')} className="hover:text-white transition-colors cursor-pointer">Terms</a>
              <a onClick={() => navigate('/help')} className="hover:text-white transition-colors cursor-pointer">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
