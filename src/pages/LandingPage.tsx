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
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [activeModel, setActiveModel] = useState<'gemini' | 'claude' | 'gpt4' | 'deepseek' | 'grok' | 'kimi'>('gemini');
  const [tokenCounter, setTokenCounter] = useState(3429810);
  const [demoIndex, setDemoIndex] = useState(0);

  // 1:1 Scroll-Driven Scrubbed Animation Progress (0.0 to 1.0)
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Mouse Movement Autoplay & Auto-Stop State
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const [kineticAngle, setKineticAngle] = useState(0);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const [mouseVelocity, setMouseVelocity] = useState(0);
  const stopTimerRef = useRef<any>(null);
  const prevMousePos = useRef({ x: 0, y: 0 });

  // Scroll Progress Tracking
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!heroSectionRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = heroSectionRef.current!.getBoundingClientRect();
          const totalScrollable = heroSectionRef.current!.offsetHeight - window.innerHeight;
          if (totalScrollable > 0) {
            const rawProgress = -rect.top / totalScrollable;
            const clamped = Math.min(1, Math.max(0, rawProgress));
            setScrollProgress(clamped);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse Movement Autoplay & Auto-Stop Engine
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1; // -1 to 1
      const normY = (e.clientY / window.innerHeight) * 2 - 1; // -1 to 1

      const dist = Math.hypot(e.clientX - prevMousePos.current.x, e.clientY - prevMousePos.current.y);
      prevMousePos.current = { x: e.clientX, y: e.clientY };

      setMouseCoords({ x: normX, y: normY });
      setMouseVelocity(Math.min(dist * 0.1, 5));
      setIsMouseMoving(true);

      // Increment rotation and kinetic progress while moving
      setKineticAngle((prev) => (prev + Math.max(0.6, dist * 0.15)) % 360);

      // Auto-Stop Timer: When user stops moving the mouse for 160ms, autoplay stops
      if (stopTimerRef.current) {
        clearTimeout(stopTimerRef.current);
      }
      stopTimerRef.current = setTimeout(() => {
        setIsMouseMoving(false);
        setMouseVelocity(0);
      }, 180);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
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
      badgeColor: 'border-[#2457D6]/40 text-[#2457D6] dark:text-[#88A9FF] bg-[#2457D6]/10',
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

  // Scrubbed Animation Calculations:
  const p = scrollProgress;

  // Chapter 1: The Vision (p: 0 -> 0.28)
  const c1Opacity = p < 0.28 ? 1 - p * 2.8 : 0;
  const c1Scale = 1 + p * 0.4;
  const c1TranslateY = -p * 80;

  // Chapter 2: Multi-Model Constellation (p: 0.22 -> 0.60)
  const c2Opacity = p >= 0.20 && p <= 0.62 
    ? p < 0.35 
      ? (p - 0.20) / 0.15 
      : p > 0.48 
        ? 1 - (p - 0.48) / 0.14 
        : 1 
    : 0;
  const c2Scale = 0.9 + p * 0.25;

  // Chapter 3: Unified Workspace & Studio (p: 0.52 -> 0.84)
  const c3Opacity = p >= 0.52 && p <= 0.86
    ? p < 0.64 
      ? (p - 0.52) / 0.12 
      : p > 0.76 
        ? 1 - (p - 0.76) / 0.10 
        : 1 
    : 0;
  const c3Scale = 0.92 + (p - 0.52) * 0.2;

  // Chapter 4: Enterprise Scale & Governance (p: 0.78 -> 1.0)
  const c4Opacity = p >= 0.76 ? Math.min(1, (p - 0.76) / 0.16) : 0;
  const c4Scale = 0.95 + (p - 0.76) * 0.1;

  // Full-stretch background image transforms driven by both mouse kinetic angle and scroll
  const effectiveAngle = (kineticAngle + p * 60) % 360;
  const globeScale = 1.05 + p * 0.25 + (isMouseMoving ? 0.03 : 0);
  const globeTranslateX = mouseCoords.x * 18;
  const globeTranslateY = mouseCoords.y * 14;

  // 3D Parallax Tilt for floating text layers inside the image
  const tiltX = -mouseCoords.y * 10;
  const tiltY = mouseCoords.x * 12;

  return (
    <div className="min-h-screen bg-[#F4F0E6] dark:bg-[#121212] text-[#171717] dark:text-[#F4F0E6] flex flex-col font-sans select-none overflow-x-hidden relative transition-colors duration-200">
      
      {/* Sticky Editorial Header */}
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
          <a href="#story" className="hover:text-[#F05A3C] transition-colors">Platform Vision</a>
          <a href="#features" className="hover:text-[#F05A3C] transition-colors">Ecosystem Capabilities</a>
          <a href="#models" className="hover:text-[#F05A3C] transition-colors">AI Providers</a>
          <a href="#pricing" className="hover:text-[#F05A3C] transition-colors">Pricing & Plans</a>
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
                Start Free Trial
              </button>
            </>
          )}
        </div>
      </header>

      {/* ========================================================================= */}
      {/* FULL-STRETCHED SCROLL + MOUSE-AUTOPLAY HERO SECTION                       */}
      {/* ========================================================================= */}
      <section
        id="story"
        ref={heroSectionRef}
        className="relative h-[340vh] w-full bg-[#05070e] text-[#F4F0E6]"
      >
        {/* Sticky 100vh Viewport Window */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between p-4 sm:p-8 select-none">
          
          {/* 1. FULL STRETCHED BACKGROUND VISUAL & ANIMATED CYBER GIF OVERLAY */}
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
            {/* The Background Image stretched edge-to-edge covering 100% of the screen */}
            <img
              src="/hero_orchestration_globe.jpg"
              alt="SuperMind AI Global Orchestration Core"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 ease-out will-change-transform"
              style={{
                transform: `scale(${globeScale}) translate3d(${globeTranslateX}px, ${globeTranslateY}px, 0)`,
                filter: isMouseMoving 
                  ? 'brightness(1.1) saturate(1.25) contrast(1.05)' 
                  : 'brightness(0.95) saturate(1.05)',
              }}
            />

            {/* Futuristic Animated Cyber Scanline & Shimmer Layer (GIF Aesthetic) */}
            <div className="absolute inset-0 w-full h-full cyber-scanline pointer-events-none opacity-40 mix-blend-screen" />
            
            {/* Dynamic Radial Vignette to keep text readable while preserving edge visibility */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#05070e]/40 to-[#05070e]/90 pointer-events-none" />

            {/* Kinetic Optical Light Beam driven by mouse movement */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none transition-opacity duration-300"
              style={{
                background: 'radial-gradient(circle, rgba(36, 87, 214, 0.28) 0%, rgba(240, 90, 60, 0.12) 40%, transparent 70%)',
                transform: `translate3d(${globeTranslateX * 1.5}px, ${globeTranslateY * 1.5}px, 0) scale(${isMouseMoving ? 1.25 : 1})`,
                opacity: isMouseMoving ? 0.95 : 0.45,
              }}
            />
          </div>

          {/* TOP HUD STATUS BAR (Hovering in image) */}
          <div className="relative z-20 flex items-center justify-between w-full max-w-7xl mx-auto pt-2">
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0a0e1a]/80 border border-white/20 backdrop-blur-xl font-mono text-[11px] text-[#A8A49C] shadow-editorial hover:border-[#F05A3C] transition-all">
              <span className="h-2 w-2 rounded-full bg-[#C7D83D] animate-ping" />
              <span className="text-white font-medium">SUPERMIND ORCHESTRATOR</span>
              <span className="text-white/30">•</span>
              <span className="text-[#C7D83D] font-bold">ONLINE</span>
            </div>

            {/* Mouse Autoplay & Stop Live Status Indicator */}
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0a0e1a]/80 border border-white/20 backdrop-blur-xl font-mono text-[11px] shadow-editorial">
              <MousePointer2 className={`h-3.5 w-3.5 transition-colors ${isMouseMoving ? 'text-[#C7D83D] animate-spin' : 'text-[#77736B]'}`} />
              <span className="text-[#A8A49C] hidden sm:inline">KINETIC AUTOPLAY:</span>
              <span className={isMouseMoving ? 'text-[#C7D83D] font-bold' : 'text-[#77736B] font-semibold'}>
                {isMouseMoving ? `ACTIVE (${kineticAngle.toFixed(0)}°)` : 'IDLE (MOVE MOUSE TO ENGAGE)'}
              </span>
            </div>
          </div>

          {/* CENTER 3D PARALLAX STAGE: ALL TEXT HOVERING DIRECTLY IN FRONT OF IMAGE */}
          <div 
            className="relative z-20 flex-1 flex items-center justify-center w-full max-w-5xl mx-auto text-center px-4"
            style={{ perspective: '1200px' }}
          >
            {/* 3D Floating Tilt Canvas */}
            <div
              className="w-full relative transition-transform duration-200 ease-out will-change-transform"
              style={{
                transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px)`,
              }}
            >
              
              {/* CHAPTER 1: The Vision — All-in-One Multi-Model Ecosystem (Scroll: 0.00 -> 0.28) */}
              <div
                className="flex flex-col items-center justify-center space-y-6 transition-all will-change-transform"
                style={{
                  opacity: c1Opacity,
                  transform: `translate3d(0, ${c1TranslateY}px, 0) scale(${c1Scale})`,
                  display: c1Opacity > 0.02 ? 'flex' : 'none',
                }}
              >
                {/* Floating HUD Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/25 bg-[#0a0e1a]/85 backdrop-blur-xl text-xs font-mono text-[#F05A3C] shadow-editorial hover:scale-105 transition-transform cursor-default">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                  <span>Next-Generation Multi-Model AI Orchestrator</span>
                </div>

                {/* Floating Glassmorphic Heading Box */}
                <div className="p-6 sm:p-10 rounded-3xl bg-[#070b16]/75 border border-white/20 backdrop-blur-2xl shadow-editorial space-y-4 max-w-4xl hover:border-white/35 transition-all">
                  <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal tracking-tight text-white leading-[1.08]">
                    One Unified Workspace.{' '}
                    <span className="italic text-[#F05A3C] drop-shadow-md">Every World-Class AI Model.</span>
                  </h1>

                  <p className="text-sm sm:text-base text-[#DCD6CA] max-w-2xl mx-auto leading-relaxed font-normal">
                    SuperMind AI brings OpenAI, Claude, Gemini, Grok, DeepSeek, and Kimi together into a single platform—letting you access, compare, orchestrate, and cross-synthesize artificial intelligence seamlessly.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="py-3.5 px-7 rounded-xl bg-[#F05A3C] hover:bg-[#d9482b] text-white text-xs font-semibold flex items-center gap-2 shadow-editorial transition-all hover:scale-105 cursor-pointer"
                    >
                      <span>Launch Unified Studio</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => navigate('/register')}
                      className="py-3.5 px-7 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs font-medium backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
                    >
                      Start 100k Free Trial
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono text-[#DCD6CA] pt-2 animate-bounce">
                  <ChevronDown className="h-4 w-4 text-[#F05A3C]" />
                  <span>SCROLL DOWN • MOVE MOUSE FOR KINETIC AUTOPLAY</span>
                </div>
              </div>

              {/* CHAPTER 2: Multi-Model AI Constellation & Router (Scroll: 0.25 -> 0.60) */}
              <div
                className="flex flex-col items-center justify-center space-y-6 transition-all will-change-transform"
                style={{
                  opacity: c2Opacity,
                  transform: `scale(${c2Scale})`,
                  display: c2Opacity > 0.02 ? 'flex' : 'none',
                }}
              >
                <div className="p-6 sm:p-8 rounded-3xl bg-[#070b16]/80 border border-white/20 backdrop-blur-2xl shadow-editorial space-y-3 max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2457D6]/20 border border-[#2457D6]/40 text-[#88A9FF] text-xs font-mono uppercase tracking-wider">
                    <Cpu className="h-3.5 w-3.5" /> Stage 02 • Multi-Model Matrix
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-serif font-normal text-white tracking-tight">
                    Connect & Compare Leading Foundation Models
                  </h2>
                  <p className="text-xs sm:text-sm text-[#DCD6CA] max-w-xl mx-auto">
                    Supervisor AI evaluates query intent, code dependencies, and latency SLAs to dispatch prompts to candidate models in real time.
                  </p>
                </div>

                {/* Orbiting Provider Telemetry Chips Floating Over Image */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-3xl">
                  {[
                    { name: 'OpenAI GPT-4o', latency: '210ms', tag: 'Omnimodal Vision', color: '#2457D6' },
                    { name: 'Claude 3.5 Sonnet', latency: '240ms', tag: 'Complex Reasoning', color: '#F05A3C' },
                    { name: 'Google Gemini 2.5', latency: '180ms', tag: 'Fast Synthesis', color: '#C7D83D' },
                    { name: 'xAI Grok 2', latency: '220ms', tag: 'Realtime Context', color: '#F05A3C' },
                    { name: 'DeepSeek R1', latency: '290ms', tag: 'Consensus Proofs', color: '#88A9FF' },
                    { name: 'Moonshot Kimi', latency: '250ms', tag: '2M Long Context', color: '#10B981' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#090d19]/85 border border-white/20 backdrop-blur-2xl text-left space-y-1.5 shadow-editorial hover:border-[#F05A3C] hover:scale-105 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-xs font-medium text-white">{item.name}</span>
                        <span className="font-mono text-[9px] text-[#C7D83D] font-bold">{item.latency}</span>
                      </div>
                      <div className="text-[10px] font-mono text-[#A8A49C]">{item.tag}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CHAPTER 3: AI Chat Workspace & Intelligent Agents (Scroll: 0.55 -> 0.85) */}
              <div
                className="flex flex-col items-center justify-center space-y-5 transition-all will-change-transform"
                style={{
                  opacity: c3Opacity,
                  transform: `scale(${c3Scale})`,
                  display: c3Opacity > 0.02 ? 'flex' : 'none',
                }}
              >
                <div className="p-6 sm:p-8 rounded-3xl bg-[#070b16]/80 border border-white/20 backdrop-blur-2xl shadow-editorial space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F05A3C]/20 border border-[#F05A3C]/40 text-[#F05A3C] text-xs font-mono uppercase tracking-wider">
                    <Workflow className="h-3.5 w-3.5" /> Stage 03 • Workspace & Autonomous Agents
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-serif font-normal text-white tracking-tight">
                    One Unified Chat Canvas & Agent Orchestration
                  </h2>
                  <p className="text-xs sm:text-sm text-[#DCD6CA] max-w-xl mx-auto">
                    Dispatch autonomous agents for live web research, document vector extraction, and code execution without context fragmentation.
                  </p>
                </div>

                {/* Studio Graphic Inset Floating Over Background */}
                <div className="w-full max-w-2xl rounded-2xl p-2.5 bg-[#070b16]/85 border border-white/25 backdrop-blur-2xl shadow-editorial hover:scale-[1.01] transition-transform">
                  <img
                    src="/ai_studio_preview.png"
                    alt="SuperMind AI Workspace Canvas"
                    className="w-full h-auto object-cover rounded-xl border border-white/10"
                  />
                </div>
              </div>

              {/* CHAPTER 4: API Services, Subscriptions & Admin Governance (Scroll: 0.82 -> 1.0) */}
              <div
                className="flex flex-col items-center justify-center space-y-6 transition-all will-change-transform"
                style={{
                  opacity: c4Opacity,
                  transform: `scale(${c4Scale})`,
                  display: c4Opacity > 0.02 ? 'flex' : 'none',
                }}
              >
                <div className="p-6 sm:p-8 rounded-3xl bg-[#070b16]/80 border border-white/20 backdrop-blur-2xl shadow-editorial space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono uppercase tracking-wider">
                    <ShieldCheck className="h-3.5 w-3.5" /> Stage 04 • Scale, Billing & Governance
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-serif font-normal text-white tracking-tight">
                    Enterprise-Grade API, Subscriptions & Admin Control
                  </h2>
                  <p className="text-xs sm:text-sm text-[#DCD6CA] max-w-xl mx-auto">
                    Monetize and monitor through transparent prepaid credits, multi-tiered plans, and full administrative oversight over users, providers, and SLA performance.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl">
                  <div className="p-4 rounded-xl bg-[#090d19]/85 border border-white/20 backdrop-blur-xl text-left space-y-1 hover:border-white/40 transition-all">
                    <div className="font-mono text-[10px] text-[#A8A49C] uppercase">API Gateway SLA</div>
                    <div className="text-xl font-serif text-white">99.98%</div>
                    <div className="text-[10px] text-[#C7D83D]">Automated Provider Failover</div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#090d19]/85 border border-[#F05A3C]/40 backdrop-blur-xl text-left space-y-1 hover:border-[#F05A3C] transition-all">
                    <div className="font-mono text-[10px] text-[#A8A49C] uppercase">Prepaid & Subscriptions</div>
                    <div className="text-xl font-serif text-[#F05A3C]">Free Trial Active</div>
                    <div className="text-[10px] text-white/80">100k Free Tokens Included</div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#090d19]/85 border border-white/20 backdrop-blur-xl text-left space-y-1 hover:border-white/40 transition-all">
                    <div className="font-mono text-[10px] text-[#A8A49C] uppercase">Admin Platform Panel</div>
                    <div className="text-xl font-serif text-[#88A9FF]">Centralized</div>
                    <div className="text-[10px] text-[#A8A49C]">User & Revenue Governance</div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => navigate('/register')}
                    className="py-3 px-8 rounded-xl bg-[#F05A3C] hover:bg-[#d9482b] text-white text-xs font-semibold shadow-editorial transition-all hover:scale-105 cursor-pointer"
                  >
                    Get Started With Free Trial
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* BOTTOM SCRUBBED PROGRESS BAR & CHAPTER INDICATORS */}
          <div className="relative z-20 w-full max-w-4xl mx-auto pb-2 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#DCD6CA]">
              <span className={p < 0.28 ? 'text-[#F05A3C] font-bold' : ''}>01 THE VISION</span>
              <span className={p >= 0.28 && p < 0.58 ? 'text-[#F05A3C] font-bold' : ''}>02 MULTI-MODEL MATRIX</span>
              <span className={p >= 0.58 && p < 0.82 ? 'text-[#F05A3C] font-bold' : ''}>03 WORKSPACE & AGENTS</span>
              <span className={p >= 0.82 ? 'text-[#F05A3C] font-bold' : ''}>04 SCALE & ADMIN</span>
            </div>

            {/* Direct Scroll Progress Bar */}
            <div className="w-full bg-white/15 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#F05A3C] h-full rounded-full transition-all duration-75"
                style={{ width: `${Math.round(p * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* WHAT SUPERMIND AI DOES — FULL ECOSYSTEM CAPABILITIES                      */}
      {/* ========================================================================= */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto w-full space-y-16 border-t border-[#DCD6CA] dark:border-[#33312B] text-left">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#DCD6CA] dark:border-[#33312B] bg-[#EAE5D9]/60 dark:bg-[#1E1E1C] text-[10px] font-mono tracking-wider uppercase text-[#77736B] dark:text-[#A8A49C]">
            Core Platform Architecture
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-[#171717] dark:text-[#F4F0E6]">
            What SuperMind AI Does
          </h2>
          <p className="text-sm text-[#77736B] dark:text-[#A8A49C] leading-relaxed">
            SuperMind AI is engineered as an all-in-one AI ecosystem where individuals, developers, and enterprise teams can access, compare, orchestrate, and monetize artificial intelligence capabilities under one roof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {corePillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] space-y-4 shadow-subtle hover:border-[#F05A3C] transition-all group"
              >
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center border transition-colors shadow-2xs"
                  style={{
                    backgroundColor: `${pillar.color}15`,
                    borderColor: `${pillar.color}30`,
                    color: pillar.color,
                  }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#77736B] dark:text-[#A8A49C]">
                    {pillar.subtitle}
                  </div>
                  <h3 className="text-lg font-serif font-normal text-[#171717] dark:text-[#F4F0E6]">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-xs text-[#77736B] dark:text-[#A8A49C] leading-relaxed font-normal">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* INTERACTIVE MODEL MATRIX SECTION                                          */}
      {/* ========================================================================= */}
      <section id="models" className="py-20 px-6 max-w-7xl mx-auto w-full space-y-10 border-t border-[#DCD6CA] dark:border-[#33312B] text-center">
        <div className="space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#DCD6CA] dark:border-[#33312B] bg-[#EAE5D9]/60 dark:bg-[#1E1E1C] text-[10px] font-mono tracking-wider uppercase text-[#77736B] dark:text-[#A8A49C]">
            Model Intelligence Matrix
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-[#171717] dark:text-[#F4F0E6]">
            Compare Candidate Models in Real-Time
          </h2>
          <p className="text-xs sm:text-sm text-[#77736B] dark:text-[#A8A49C]">
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
                    ? 'bg-[#171717] dark:bg-[#F4F0E6] text-[#F4F0E6] dark:text-[#171717] shadow-subtle font-semibold'
                    : 'bg-[#FAF8F3] dark:bg-[#1E1E1C] hover:bg-[#EAE5D9] text-[#77736B] dark:text-[#A8A49C] border border-[#DCD6CA] dark:border-[#33312B]'
                }`}
              >
                {spec.name}
              </button>
            );
          })}
        </div>

        {/* Selected Model Spec Card */}
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] shadow-editorial space-y-6 text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#DCD6CA] dark:border-[#33312B] pb-4">
            <div>
              <div className="text-xl font-serif font-normal text-[#171717] dark:text-[#F4F0E6]">
                {modelSpecs[activeModel].name}
              </div>
              <div className="text-xs text-[#77736B] dark:text-[#A8A49C] mt-1 leading-relaxed">
                {modelSpecs[activeModel].description}
              </div>
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

      {/* ========================================================================= */}
      {/* OUR VISION MANIFESTO                                                      */}
      {/* ========================================================================= */}
      <section className="py-20 px-6 max-w-5xl mx-auto w-full text-center">
        <div className="p-8 sm:p-14 rounded-3xl bg-[#171717] dark:bg-[#1A1A18] text-[#F4F0E6] border border-[#33312B] dark:border-[#DCD6CA]/20 shadow-editorial space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white font-mono text-[10px] uppercase tracking-wider">
            Our Mission & Vision
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal tracking-tight max-w-3xl mx-auto leading-tight">
            Build SuperMind AI into a premium, reliable, scalable platform that makes advanced artificial intelligence accessible through one beautifully designed application.
          </h2>

          <p className="text-xs sm:text-sm text-[#A8A49C] max-w-xl mx-auto leading-relaxed">
            Eliminating silos between AI providers. Whether you need Claude's deep reasoning, Gemini's speed, or OpenAI's multimodal vision, SuperMind delivers unified mastery.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/register')}
              className="py-3 px-6 rounded-xl bg-[#F05A3C] hover:bg-[#d9482b] text-white text-xs font-semibold shadow-subtle transition-all cursor-pointer"
            >
              Start Free Trial (100k Tokens)
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="py-3 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium border border-white/20 transition-all cursor-pointer"
            >
              Explore Chat Studio
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SAAS PRICING & SUBSCRIPTION TIERS                                         */}
      {/* ========================================================================= */}
      <section id="pricing" className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12 border-t border-[#DCD6CA] dark:border-[#33312B] text-center">
        <div className="space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#DCD6CA] dark:border-[#33312B] bg-[#EAE5D9]/60 dark:bg-[#1E1E1C] text-[10px] font-mono tracking-wider uppercase text-[#77736B] dark:text-[#A8A49C]">
            Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-[#171717] dark:text-[#F4F0E6]">
            Choose Your Intelligence Capacity
          </h2>
          <p className="text-xs sm:text-sm text-[#77736B] dark:text-[#A8A49C]">
            Every new user starts with a 100k Free Trial. Upgrade whenever you need higher quotas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch text-left">
          {/* Starter Plan */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] space-y-6 flex flex-col justify-between shadow-subtle">
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-[#77736B] dark:text-[#A8A49C]">Starter</div>
              <div className="text-3xl font-serif text-[#171717] dark:text-[#F4F0E6]">$9 <span className="text-xs text-[#77736B] dark:text-[#A8A49C] font-normal">/ mo</span></div>
              <ul className="space-y-2.5 text-xs text-[#77736B] dark:text-[#A8A49C]">
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
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#F05A3C]" /> 4K Image Studio & Vector PDF</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#F05A3C]" /> Autonomous Task Agents</li>
              </ul>
            </div>
            <Button variant="primary" onClick={() => navigate('/register')} className="w-full">
              Start With Free Trial
            </Button>
          </div>

          {/* Enterprise Plan */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF8F3] dark:bg-[#1E1E1C] border border-[#DCD6CA] dark:border-[#33312B] space-y-6 flex flex-col justify-between shadow-subtle">
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-[#77736B] dark:text-[#A8A49C]">Enterprise</div>
              <div className="text-3xl font-serif text-[#171717] dark:text-[#F4F0E6]">$99 <span className="text-xs text-[#77736B] dark:text-[#A8A49C] font-normal">/ mo</span></div>
              <ul className="space-y-2.5 text-xs text-[#77736B] dark:text-[#A8A49C]">
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
      {/* MULTI-COLUMN FOOTER                                                       */}
      {/* ========================================================================= */}
      <footer className="bg-[#FAF8F3] dark:bg-[#101010] border-t border-[#DCD6CA] dark:border-[#33312B] pt-16 pb-12 px-6 relative z-10 text-left">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="h-8 w-8 rounded-lg bg-[#171717] dark:bg-[#F4F0E6] text-[#F4F0E6] dark:text-[#171717] font-serif font-bold flex items-center justify-center text-sm shadow-subtle">
                  S
                </div>
                <span className="font-serif font-normal text-lg tracking-tight text-[#171717] dark:text-[#F4F0E6]">SuperMind AI</span>
              </div>

              <p className="text-xs text-[#77736B] dark:text-[#A8A49C] max-w-sm leading-relaxed">
                SuperMind AI is an all-in-one ecosystem uniting multiple AI models, providers, and intelligent agents into one unified application.
              </p>

              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs w-fit font-mono font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                <span>System Status: 100% Operational</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#171717] dark:text-[#F4F0E6]">Ecosystem</div>
              <ul className="space-y-2 text-xs text-[#77736B] dark:text-[#A8A49C] font-medium">
                <li><a onClick={() => navigate('/chat')} className="hover:text-[#F05A3C] transition-colors cursor-pointer">Multi-Model Chat</a></li>
                <li><a onClick={() => navigate('/images')} className="hover:text-[#F05A3C] transition-colors cursor-pointer">4K Image Studio</a></li>
                <li><a onClick={() => navigate('/documents')} className="hover:text-[#F05A3C] transition-colors cursor-pointer">Document Vector RAG</a></li>
                <li><a onClick={() => navigate('/analytics')} className="hover:text-[#F05A3C] transition-colors cursor-pointer">Telemetry & Usage</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#171717] dark:text-[#F4F0E6]">Supported Providers</div>
              <ul className="space-y-2 text-xs text-[#77736B] dark:text-[#A8A49C] font-medium">
                <li><a href="#models" className="hover:text-[#F05A3C] transition-colors">OpenAI GPT-4o</a></li>
                <li><a href="#models" className="hover:text-[#F05A3C] transition-colors">Anthropic Claude 3.5</a></li>
                <li><a href="#models" className="hover:text-[#F05A3C] transition-colors">Google Gemini 2.5</a></li>
                <li><a href="#models" className="hover:text-[#F05A3C] transition-colors">xAI Grok 2</a></li>
                <li><a href="#models" className="hover:text-[#F05A3C] transition-colors">DeepSeek R1</a></li>
                <li><a href="#models" className="hover:text-[#F05A3C] transition-colors">Moonshot Kimi</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#171717] dark:text-[#F4F0E6]">Governance</div>
              <ul className="space-y-2 text-xs text-[#77736B] dark:text-[#A8A49C] font-medium">
                <li><a onClick={() => navigate('/terms')} className="hover:text-[#F05A3C] transition-colors cursor-pointer">Terms of Service</a></li>
                <li><a onClick={() => navigate('/privacy')} className="hover:text-[#F05A3C] transition-colors cursor-pointer">Privacy Policy</a></li>
                <li><a onClick={() => navigate('/help')} className="hover:text-[#F05A3C] transition-colors cursor-pointer">Help & Documentation</a></li>
                <li><a onClick={() => navigate('/admin')} className="hover:text-[#F05A3C] transition-colors cursor-pointer">Admin Governance</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#DCD6CA] dark:border-[#33312B] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#77736B] dark:text-[#A8A49C]">
            <div>
              © 2026 SuperMind AI Inc. All rights reserved. • One Unified Workspace. Every World-Class AI Model.
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
