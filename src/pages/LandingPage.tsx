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
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [canvasReady, setCanvasReady] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(0);
  const animFrameIdRef = useRef<number | null>(null);
  const lastAdvanceTimeRef = useRef<number>(0);
  const stopTimerRef = useRef<any>(null);

  const TOTAL_FRAMES = 39;

  // 1. Preload Globe Frames for Instant Canvas Scrubbing & Playback
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const numStr = i.toString().padStart(2, '0');
      img.src = `/hero_frames/frame_${numStr}.jpg`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === 1) {
          drawFrame(0);
        }
        if (loadedCount >= Math.min(5, TOTAL_FRAMES)) {
          setCanvasReady(true);
          drawFrame(frameIndexRef.current);
        }
      };
      images.push(img);
    }
    framesRef.current = images;

    return () => {
      images.length = 0;
    };
  }, []);

  // 2. Render Frame to Canvas with Full-Bleed Cover Math
  const drawFrame = (frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (canvas.width === 0 || canvas.height === 0) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    const frameImg = framesRef.current[frameIdx];
    if (!frameImg || !frameImg.complete || frameImg.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = frameImg.naturalWidth;
    const ih = frameImg.naturalHeight;

    // Object-fit: cover math
    const hRatio = cw / iw;
    const vRatio = ch / ih;
    const ratio = Math.max(hRatio, vRatio);
    const nw = iw * ratio;
    const nh = ih * ratio;
    const nx = (cw - nw) / 2;
    const ny = (ch - nh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(frameImg, nx, ny, nw, nh);
  };

  // Resize canvas to match display size
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(frameIndexRef.current);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [canvasReady]);

  // 3. Mouse & Touch Movement Autoplay & Stop Automatically
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x: normX, y: normY });
      setIsMouseMoving(true);

      // Reset inactivity stop timer
      if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
      stopTimerRef.current = setTimeout(() => {
        setIsMouseMoving(false);
      }, 180);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const normX = (touch.clientX / window.innerWidth) * 2 - 1;
        const normY = (touch.clientY / window.innerHeight) * 2 - 1;
        setMousePos({ x: normX, y: normY });
      }
      setIsMouseMoving(true);
      if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
      stopTimerRef.current = setTimeout(() => {
        setIsMouseMoving(false);
      }, 220);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
    };
  }, []);

  // 4. Kinetic Autoplay Loop: Runs ONLY while mouse or touch is actively moving
  useEffect(() => {
    if (!isMouseMoving || !canvasReady) {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      return;
    }

    const fpsInterval = 1000 / 25; // 25 FPS smooth playback
    lastAdvanceTimeRef.current = performance.now();

    const loop = (timestamp: number) => {
      if (timestamp - lastAdvanceTimeRef.current >= fpsInterval) {
        frameIndexRef.current = (frameIndexRef.current + 1) % TOTAL_FRAMES;
        setCurrentFrameIndex(frameIndexRef.current);
        drawFrame(frameIndexRef.current);
        lastAdvanceTimeRef.current = timestamp;
      }
      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
    };
  }, [isMouseMoving, canvasReady]);

  // 5. Scroll-Driven Scrubbing: When user scrolls, scrub frames
  useEffect(() => {
    const handleScroll = () => {
      const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScrollable <= 0) return;
      const progress = Math.min(Math.max(window.scrollY / totalScrollable, 0), 1);
      const targetFrame = Math.floor(progress * (TOTAL_FRAMES - 1));

      frameIndexRef.current = targetFrame;
      setCurrentFrameIndex(targetFrame);
      drawFrame(targetFrame);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [canvasReady]);

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
      badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
      description: 'Primary high-speed intelligence engine configured for low latency, full-stack code synthesis, and instant reasoning.',
    },
    claude: {
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic AI',
      latency: '240ms',
      quality: '99.5%',
      cost: '$0.00',
      badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
      description: 'Advanced reasoning engine for long-context document synthesis, architectural analysis, and complex structured extraction.',
    },
    gpt4: {
      name: 'GPT-4o Omnimodal',
      provider: 'OpenAI Engine',
      latency: '210ms',
      quality: '99.4%',
      cost: '$0.00',
      badgeColor: 'border-indigo-500/40 text-indigo-300 bg-indigo-500/10',
      description: 'Multimodal vision and creative prompt generator with high-resolution image rendering and editorial drafting.',
    },
    deepseek: {
      name: 'DeepSeek R1 Consensus',
      provider: 'DeepSeek Architecture',
      latency: '290ms',
      quality: '99.9%',
      cost: '$0.00',
      badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
      description: 'Mathematical reasoning, multi-LLM consensus verification, and automated algorithmic code analysis.',
    },
    grok: {
      name: 'xAI Grok 2',
      provider: 'xAI Architecture',
      latency: '220ms',
      quality: '99.2%',
      cost: '$0.00',
      badgeColor: 'border-cyan-400/40 text-cyan-300 bg-cyan-400/10',
      description: 'Real-time contextual awareness, unfiltered logic synthesis, and accelerated reasoning capabilities.',
    },
    kimi: {
      name: 'Moonshot Kimi k1.5',
      provider: 'Moonshot AI',
      latency: '250ms',
      quality: '99.6%',
      cost: '$0.00',
      badgeColor: 'border-teal-500/40 text-teal-300 bg-teal-500/10',
      description: 'Long-context processing specialist with 2M token context handling and precision retrieval.',
    },
  };

  const corePillars = [
    {
      title: 'Multi-Model AI',
      subtitle: 'Universal Provider Gateway',
      desc: 'Access premier foundation models including OpenAI, Claude, Gemini, Grok, DeepSeek, and Kimi with unified routing.',
      icon: Cpu,
      color: '#00E5FF',
    },
    {
      title: 'AI Chat Workspace',
      subtitle: 'Single Collaborative Canvas',
      desc: 'Interact with different models seamlessly through one synchronized interface with file uploads, search, and synthesis.',
      icon: Layers,
      color: '#3B82F6',
    },
    {
      title: 'Intelligent AI Agents',
      subtitle: 'Autonomous Workflows',
      desc: 'Deploy specialized task agents for deep web research, code refactoring, complex mathematical proofs, and data analysis.',
      icon: Brain,
      color: '#10B981',
    },
    {
      title: 'Model Orchestration',
      subtitle: 'Dynamic Capability Matching',
      desc: 'Supervisor AI inspects query intent, token complexity, and speed requirements to dispatch to the optimal LLM automatically.',
      icon: Workflow,
      color: '#06B6D4',
    },
    {
      title: 'API Services',
      subtitle: 'Unified Developer Endpoint',
      desc: 'High-availability unified API gateway with drop-in compatibility, automatic model failover, and telemetry instrumentation.',
      icon: Terminal,
      color: '#6366F1',
    },
    {
      title: 'Subscriptions & Credits',
      subtitle: 'Transparent Metering',
      desc: 'Flexible paid plans, prepaid token packs, and usage-based billing with zero hidden seat surcharges.',
      icon: CreditCard,
      color: '#38BDF8',
    },
    {
      title: 'Admin Governance',
      subtitle: 'Platform Operations',
      desc: 'Manage users, monitor foundation provider SLA status, enforce rate limits, and analyze real-time request volume.',
      icon: ShieldCheck,
      color: '#14B8A6',
    },
  ];

  return (
    <div className="min-h-screen text-white bg-transparent flex flex-col font-sans select-none overflow-x-hidden relative">

      {/* ========================================================================= */}
      {/* 1. FIXED BACKGROUND: MOTION-DRIVEN GLOBE ORCHESTRATION WITH OVERLAY      */}
      {/* Plays when mouse moves, stops/pauses automatically when mouse stops idle  */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-[#04060A]">
        {/* Poster / Fallback Image until canvas initializes */}
        <img
          src="/hero_frames/frame_00.jpg"
          alt="SuperMind AI Globe Orchestration Poster"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 will-change-transform ${
            canvasReady ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            transform: `scale(${isMouseMoving ? 1.02 : 1}) translate3d(${mousePos.x * 6}px, ${mousePos.y * 4}px, 0)`,
            transition: 'transform 0.25s ease-out',
          }}
        />

        {/* Interactive Hardware-Accelerated Canvas Scrubbing / Playing */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
          style={{
            transform: `scale(${isMouseMoving ? 1.02 : 1}) translate3d(${mousePos.x * 6}px, ${mousePos.y * 4}px, 0)`,
            transition: 'transform 0.25s ease-out',
          }}
        />

        {/* Sleek Cinematic Dark Glassmorphic Background Overlay across all content */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/80 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.7)_100%)] pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* STICKY GLASSMORPHIC HEADER OVER FIXED BACKGROUND                          */}
      {/* ========================================================================= */}
      <header className="h-16 px-4 sm:px-8 max-w-7xl mx-auto w-full flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="h-8 w-8 rounded-lg bg-cyan-400 text-black font-bold flex items-center justify-center text-sm shadow-sm">
            S
          </div>
          <div className="flex items-center gap-2">
            <span className="font-serif font-normal text-lg tracking-tight text-white">SuperMind</span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded border border-white/15 bg-white/5 text-slate-400 text-[10px] font-mono tracking-wider uppercase">
              AI Orchestrator
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-300">
          <a href="#vision" className="hover:text-cyan-400 transition-colors">Vision</a>
          <a href="#capabilities" className="hover:text-cyan-400 transition-colors">Capabilities</a>
          <a href="#models" className="hover:text-cyan-400 transition-colors">AI Models</a>
          <a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="py-2 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
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
                className="py-2 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                Start Free Trial
              </button>
            </>
          )}
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION: ALL TEXT HOVERS DIRECTLY OVER FIXED GIF BACKGROUND       */}
      {/* ========================================================================= */}
      <section id="vision" className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-16 px-6 text-center relative z-20">

        {/* Status Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 pb-6">
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/15 backdrop-blur-xl font-mono text-[11px] text-slate-300 shadow-sm hover:border-cyan-400 transition-all">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-white font-medium">SUPERMIND GLOBAL ORCHESTRATOR</span>
            <span className="text-white/30">•</span>
            <span className="text-cyan-400 font-bold">LIVE ONLINE</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/15 backdrop-blur-xl font-mono text-[11px] text-slate-300 shadow-sm">
            <span className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${isMouseMoving ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee] scale-110' : 'bg-slate-500 scale-90'}`} />
            <span className="text-slate-400">CORE ANIMATION:</span>
            <span className={isMouseMoving ? 'text-cyan-400 font-bold' : 'text-slate-300 font-medium'}>
              {isMouseMoving ? 'PLAYING (MOUSE MOVING)' : 'PAUSED (MOVE MOUSE TO PLAY)'}
            </span>
          </div>
        </div>

        {/* Main Floating Glass Hero Box */}
        <div className="w-full max-w-4xl p-8 sm:p-14 rounded-3xl bg-black/40 border border-white/15 backdrop-blur-xl shadow-2xl space-y-6 hover:border-white/30 transition-all">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-xs font-mono text-cyan-400">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>All-In-One Unified AI Ecosystem</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal tracking-tight text-white leading-[1.08]">
            One Unified Workspace.{' '}
            <span className="italic text-cyan-400 drop-shadow-md">Every Leading AI Model.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed font-normal">
            SuperMind AI brings multiple AI models, providers, and intelligent agents together into one unified workspace—letting you access, compare, orchestrate, and cross-synthesize artificial intelligence seamlessly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="py-3.5 px-8 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 cursor-pointer"
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
            { name: 'OpenAI GPT-4o', latency: '210ms', tag: 'Omnimodal', color: '#38BDF8' },
            { name: 'Claude 3.5 Sonnet', latency: '240ms', tag: 'Reasoning', color: '#60A5FA' },
            { name: 'Google Gemini 2.5', latency: '180ms', tag: 'High-Speed', color: '#00E5FF' },
            { name: 'xAI Grok 2', latency: '220ms', tag: 'Realtime', color: '#22D3EE' },
            { name: 'DeepSeek R1', latency: '290ms', tag: 'Consensus', color: '#818CF8' },
            { name: 'Moonshot Kimi', latency: '250ms', tag: '2M Context', color: '#34D399' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-black/45 border border-white/10 backdrop-blur-xl text-left space-y-1 shadow-sm hover:border-cyan-400 hover:scale-105 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-xs font-medium text-white truncate">{item.name}</span>
                <span className="font-mono text-[9px] text-cyan-400 font-bold">{item.latency}</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400">{item.tag}</div>
            </div>
          ))}
        </div>

        <div className="pt-8 text-xs font-mono text-slate-300 flex items-center gap-1.5 animate-bounce">
          <ChevronDown className="h-4 w-4 text-cyan-400" />
          <span>SCROLL DOWN TO EXPLORE THE PLATFORM ECOSYSTEM</span>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WHAT SUPERMIND AI DOES — FULL ECOSYSTEM CAPABILITIES OVERLAP           */}
      {/* ========================================================================= */}
      <section id="capabilities" className="py-24 px-6 max-w-7xl mx-auto w-full space-y-14 text-left relative z-20">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-[10px] font-mono tracking-wider uppercase text-slate-300">
            Core Platform Architecture
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-white">
            What SuperMind AI Does
          </h2>
          <p className="text-sm text-slate-200 leading-relaxed">
            SuperMind AI is engineered as an all-in-one AI ecosystem where individuals, developers, and enterprise teams can access, compare, orchestrate, and monetize artificial intelligence capabilities under one roof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {corePillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl space-y-4 shadow-sm hover:border-cyan-400 hover:scale-[1.02] transition-all group"
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
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    {pillar.subtitle}
                  </div>
                  <h3 className="text-lg font-serif font-normal text-white">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-[10px] font-mono tracking-wider uppercase text-slate-300">
            Model Intelligence Matrix
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-white">
            Compare Candidate Models in Real-Time
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
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
                className={`py-2 px-4 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${isSelected
                  ? 'bg-cyan-400 text-black font-semibold shadow-md scale-105'
                  : 'bg-black/40 hover:bg-white/10 text-slate-300 border border-white/10 backdrop-blur-md'
                  }`}
              >
                {spec.name}
              </button>
            );
          })}
        </div>

        {/* Selected Model Spec Card */}
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-black/50 border border-white/15 backdrop-blur-2xl shadow-xl space-y-6 text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="text-xl font-serif font-normal text-white">
                {modelSpecs[activeModel].name}
              </div>
              <div className="text-xs text-slate-300 mt-1 leading-relaxed">
                {modelSpecs[activeModel].description}
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border ${modelSpecs[activeModel].badgeColor}`}>
              {modelSpecs[activeModel].provider}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Response Latency</div>
              <div className="text-lg sm:text-xl font-serif text-cyan-400 mt-1">{modelSpecs[activeModel].latency}</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Quality Score</div>
              <div className="text-lg sm:text-xl font-serif text-emerald-400 mt-1">{modelSpecs[activeModel].quality}</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Token Cost</div>
              <div className="text-lg sm:text-xl font-serif text-blue-400 mt-1">{modelSpecs[activeModel].cost}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. OUR VISION MANIFESTO OVERLAPPING FIXED BACKGROUND                      */}
      {/* ========================================================================= */}
      <section className="py-20 px-6 max-w-5xl mx-auto w-full text-center relative z-20">
        <div className="p-8 sm:p-14 rounded-3xl bg-black/50 text-white border border-white/15 backdrop-blur-2xl shadow-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white font-mono text-[10px] uppercase tracking-wider">
            Our Mission & Vision
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal tracking-tight max-w-3xl mx-auto leading-tight text-white">
            Build SuperMind AI into a premium, reliable, scalable platform that makes advanced artificial intelligence accessible through one beautifully designed application.
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Eliminating silos between AI providers. Whether you need Claude's deep reasoning, Gemini's speed, or OpenAI's multimodal vision, SuperMind delivers unified mastery.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/register')}
              className="py-3 px-6 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-semibold shadow-sm transition-all hover:scale-105 cursor-pointer"
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-[10px] font-mono tracking-wider uppercase text-slate-300">
            Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-white">
            Choose Your Intelligence Capacity
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Every new user starts with a 100k Free Trial. Upgrade whenever you need higher quotas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch text-left">
          {/* Starter Plan */}
          <div className="p-6 sm:p-8 rounded-2xl bg-black/45 border border-white/15 backdrop-blur-2xl space-y-6 flex flex-col justify-between shadow-sm hover:border-white/30 transition-all">
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400">Starter</div>
              <div className="text-3xl font-serif text-white">$9 <span className="text-xs text-slate-400 font-normal">/ mo</span></div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> 500k Monthly Tokens</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> Gemini & DeepSeek Routing</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> Document RAG Analysis</li>
              </ul>
            </div>
            <button
              onClick={() => navigate('/register')}
              className="w-full py-2.5 px-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-all"
            >
              Choose Starter
            </button>
          </div>

          {/* Pro Intelligence Plan */}
          <div className="p-6 sm:p-8 rounded-2xl bg-black/60 border-2 border-cyan-400 backdrop-blur-2xl shadow-xl shadow-cyan-500/10 space-y-6 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">Pro Intelligence</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-400 text-black text-[9px] font-mono font-bold uppercase">Popular</span>
              </div>
              <div className="text-3xl font-serif text-white">$29 <span className="text-xs text-slate-400 font-normal">/ mo</span></div>
              <ul className="space-y-2.5 text-xs text-white">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> 5M Monthly Tokens</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> Multi-Model Consensus Engine</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> 4K Image Studio & Vector PDF</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> Autonomous Task Agents</li>
              </ul>
            </div>
            <button
              onClick={() => navigate('/register')}
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-bold transition-all shadow-md shadow-cyan-500/20"
            >
              Start With Free Trial
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="p-6 sm:p-8 rounded-2xl bg-black/45 border border-white/15 backdrop-blur-2xl space-y-6 flex flex-col justify-between shadow-sm hover:border-white/30 transition-all">
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400">Enterprise</div>
              <div className="text-3xl font-serif text-white">$99 <span className="text-xs text-slate-400 font-normal">/ mo</span></div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> 50M Monthly Tokens</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> Dedicated Supervisor SLA</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> Custom Model Fine-Tuning & Admin</li>
              </ul>
            </div>
            <button
              onClick={() => navigate('/register')}
              className="w-full py-2.5 px-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-all"
            >
              Contact Enterprise
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. MULTI-COLUMN FOOTER OVERLAPPING FIXED BACKGROUND                       */}
      {/* ========================================================================= */}
      <footer className="border-t border-white/10 bg-black/70 backdrop-blur-2xl pt-16 pb-12 px-6 relative z-20 text-left">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="h-8 w-8 rounded-lg bg-cyan-400 text-black font-bold flex items-center justify-center text-sm shadow-sm">
                  S
                </div>
                <span className="font-serif font-normal text-lg tracking-tight text-white">SuperMind AI</span>
              </div>

              <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
                SuperMind AI is an all-in-one ecosystem uniting multiple AI models, providers, and intelligent agents into one unified application.
              </p>

              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs w-fit font-mono font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>System Status: 100% Operational</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-wider text-white">Ecosystem</div>
              <ul className="space-y-2 text-xs text-slate-300 font-medium">
                <li><a onClick={() => navigate('/chat')} className="hover:text-cyan-400 transition-colors cursor-pointer">Multi-Model Chat</a></li>
                <li><a onClick={() => navigate('/images')} className="hover:text-cyan-400 transition-colors cursor-pointer">4K Image Studio</a></li>
                <li><a onClick={() => navigate('/documents')} className="hover:text-cyan-400 transition-colors cursor-pointer">Document Vector RAG</a></li>
                <li><a onClick={() => navigate('/analytics')} className="hover:text-cyan-400 transition-colors cursor-pointer">Telemetry & Usage</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-wider text-white">Supported Providers</div>
              <ul className="space-y-2 text-xs text-slate-300 font-medium">
                <li><a href="#models" className="hover:text-cyan-400 transition-colors">OpenAI GPT-4o</a></li>
                <li><a href="#models" className="hover:text-cyan-400 transition-colors">Anthropic Claude 3.5</a></li>
                <li><a href="#models" className="hover:text-cyan-400 transition-colors">Google Gemini 2.5</a></li>
                <li><a href="#models" className="hover:text-cyan-400 transition-colors">xAI Grok 2</a></li>
                <li><a href="#models" className="hover:text-cyan-400 transition-colors">DeepSeek R1</a></li>
                <li><a href="#models" className="hover:text-cyan-400 transition-colors">Moonshot Kimi</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-wider text-white">Governance</div>
              <ul className="space-y-2 text-xs text-slate-300 font-medium">
                <li><a onClick={() => navigate('/terms')} className="hover:text-cyan-400 transition-colors cursor-pointer">Terms of Service</a></li>
                <li><a onClick={() => navigate('/privacy')} className="hover:text-cyan-400 transition-colors cursor-pointer">Privacy Policy</a></li>
                <li><a onClick={() => navigate('/help')} className="hover:text-cyan-400 transition-colors cursor-pointer">Help & Documentation</a></li>
                <li><a onClick={() => navigate('/admin')} className="hover:text-cyan-400 transition-colors cursor-pointer">Admin Governance</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
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
