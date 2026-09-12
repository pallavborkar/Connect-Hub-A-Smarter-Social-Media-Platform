import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  BarChart3, 
  CheckCircle2, 
  Flame, 
  Zap, 
  Share2, 
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Layers,
  Users,
  Compass,
  FileCheck
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveView, setAuthModalOpen, setAuthMode, setIsOnboarding } = useApp();
  const [sampleTopic, setSampleTopic] = useState('Campus Hackathon Teaser');
  const [sampleOutput, setSampleOutput] = useState<string>(
    '⚡ HOOK (0-3s): "Stop scrolling if you think engineering is just theoretical exams..."\n\n🎬 SHOT 1: Kinetic crash zoom on autonomous formula EV chassis.\n🎬 SHOT 2: High-speed montage of team debugging at 3:00 AM.\n🎬 SHOT 3: 4K trophy lift with electric pyro explosion.\n\n💬 CAPTION: "HackSprint 2026 registrations are officially live. 48 hours. 500 innovators. ₹5,00,000 prize pool. Link in bio."\n🏷️ #HackSprint2026 #EngineeringLife #TechInnovation'
  );

  const testPrompts = [
    'Campus Hackathon Teaser',
    'Placement Milestone (42 LPA)',
    'National Science Day Reel',
    'Behind-the-Scenes Product Launch',
  ];

  return (
    <div id="landing-page" className="min-h-screen bg-[#080808] text-[#F5F5F0] selection:bg-[#C8FF00] selection:text-[#080808] font-sans">
      {/* Top Editorial Nav */}
      <nav className="sticky top-0 z-40 bg-[#080808]/90 backdrop-blur-md border-b border-white/10 px-6 sm:px-10 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveView('dashboard')}>
          <div className="w-8 h-8 rounded-lg bg-[#C8FF00] flex items-center justify-center text-[#080808] font-black text-sm shadow-sm">
            <Flame className="w-5 h-5 fill-[#080808]" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="font-display font-black text-xl tracking-tight text-white uppercase">
              Socially
            </span>
            <span className="font-mono-tag text-[9px] text-[#C8FF00] bg-[#C8FF00]/10 px-1.5 py-0.5 rounded border border-[#C8FF00]/25">
              OS/26
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-8 text-xs font-mono-tag text-[#9A9A9A]">
          <a href="#features" className="hover:text-[#C8FF00] transition-colors">FEATURES</a>
          <a href="#ai-assistant" className="hover:text-[#C8FF00] transition-colors">AI ASSISTANT</a>
          <a href="#workflow" className="hover:text-[#C8FF00] transition-colors">WORKFLOW</a>
          <a href="#pricing" className="hover:text-[#C8FF00] transition-colors">PRICING</a>
        </div>

        <div className="flex items-center space-x-3">
          <button
            id="landing-login-btn"
            onClick={() => {
              setAuthMode('login');
              setAuthModalOpen(true);
            }}
            className="px-4 py-2 text-xs font-mono-tag text-[#9A9A9A] hover:text-white transition-colors cursor-pointer"
          >
            SIGN IN
          </button>
          <button
            id="landing-cta-top"
            onClick={() => setActiveView('dashboard')}
            className="px-4 py-2 bg-[#C8FF00] hover:bg-[#D4FF35] text-[#080808] text-xs font-bold font-mono-tag rounded-lg shadow-sm transition-all hover:translate-x-0.5 active:scale-98 flex items-center space-x-1.5 cursor-pointer"
          >
            <span>WORKSPACE</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-20 px-6 sm:px-10 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-white/10 bg-[#111111] text-[#9A9A9A] text-[11px] font-mono-tag">
              <span className="w-2 h-2 rounded-full bg-[#C8FF00] animate-pulse" />
              <span>SOCIAL MEDIA OPERATIONS / 2026</span>
            </div>

            <h1 className="font-display font-extrabold text-5xl sm:text-7xl xl:text-8xl tracking-tight text-white uppercase leading-[0.95]">
              MANAGE <br />
              <span className="text-[#C8FF00]">THE WORK.</span> <br />
              NOT THE <br />
              CHAOS.
            </h1>

            <p className="text-sm sm:text-base text-[#9A9A9A] max-w-xl font-normal leading-relaxed">
              Orchestrate multi-channel campaigns, streamline approval pipelines, coordinate creative squads, and deploy Gemini AI hooks from a singular high-velocity command center.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                id="hero-start-workspace"
                onClick={() => {
                  setAuthMode('signup');
                  setIsOnboarding(true);
                }}
                className="px-6 py-3.5 bg-[#C8FF00] hover:bg-[#D4FF35] text-[#080808] font-extrabold text-xs font-mono-tag rounded-lg shadow-md transition-all hover:translate-x-1 active:scale-98 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>START YOUR WORKSPACE</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
              
              <button
                id="hero-explore-features"
                onClick={() => setActiveView('dashboard')}
                className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/15 hover:border-white/30 font-bold text-xs font-mono-tag rounded-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>EXPLORE FEATURES</span>
              </button>
            </div>
          </div>

          {/* Right Hero Editorial Dashboard Visual */}
          <div className="lg:col-span-5 relative">
            <div className="card-brivon rounded-2xl p-4 bg-[#111111] relative overflow-hidden group">
              {/* Top Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C8FF00]" />
                  <span className="font-mono-tag text-[10px] text-[#9A9A9A]">LIVE COMMAND FEED</span>
                </div>
                <span className="font-mono-tag text-[10px] text-[#C8FF00] bg-[#C8FF00]/10 px-2 py-0.5 rounded">
                  SYS / ACTIVE
                </span>
              </div>

              {/* Main Content Teaser */}
              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden aspect-video border border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
                    alt="Creative editorial background"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 flex flex-col justify-end">
                    <span className="font-mono-tag text-[9px] text-[#C8FF00]">REEL CAMPAIGN #04</span>
                    <h3 className="font-display text-base font-bold text-white uppercase">Formula EV Speed Lab Teaser</h3>
                  </div>
                </div>

                {/* Floating Metadata Pills */}
                <div className="grid grid-cols-4 gap-2 pt-1 font-mono-tag text-center text-[10px]">
                  <div className="bg-[#151515] p-2 rounded border border-white/10">
                    <div className="text-[#9A9A9A]">CAMPAIGNS</div>
                    <div className="font-bold text-white mt-0.5">24</div>
                  </div>
                  <div className="bg-[#151515] p-2 rounded border border-white/10">
                    <div className="text-[#9A9A9A]">CONTENT</div>
                    <div className="font-bold text-[#C8FF00] mt-0.5">120+</div>
                  </div>
                  <div className="bg-[#151515] p-2 rounded border border-white/10">
                    <div className="text-[#9A9A9A]">ANALYTICS</div>
                    <div className="font-bold text-white mt-0.5">+38%</div>
                  </div>
                  <div className="bg-[#151515] p-2 rounded border border-white/10">
                    <div className="text-[#9A9A9A]">TEAM</div>
                    <div className="font-bold text-white mt-0.5">08</div>
                  </div>
                </div>

                {/* AI Notification Pill */}
                <div className="p-2.5 rounded-lg bg-[#151515] border border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#C8FF00]" />
                    <span className="text-[#F5F5F0] text-[11px]">AI: Optimal posting window in 45 mins</span>
                  </div>
                  <span className="font-mono-tag text-[9px] text-[#C8FF00]">READY</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Hero Stats Strip */}
        <div className="mt-16 sm:mt-24 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="border-l border-white/15 pl-4">
            <div className="font-display font-black text-3xl sm:text-4xl text-white">120+</div>
            <div className="font-mono-tag text-[10px] text-[#9A9A9A] mt-1">POSTS PLANNED</div>
          </div>
          <div className="border-l border-white/15 pl-4">
            <div className="font-display font-black text-3xl sm:text-4xl text-[#C8FF00]">24</div>
            <div className="font-mono-tag text-[10px] text-[#9A9A9A] mt-1">ACTIVE CAMPAIGNS</div>
          </div>
          <div className="border-l border-white/15 pl-4">
            <div className="font-display font-black text-3xl sm:text-4xl text-white">08</div>
            <div className="font-mono-tag text-[10px] text-[#9A9A9A] mt-1">TEAM MEMBERS</div>
          </div>
          <div className="border-l border-white/15 pl-4">
            <div className="font-display font-black text-3xl sm:text-4xl text-[#C8FF00]">4.8X</div>
            <div className="font-mono-tag text-[10px] text-[#9A9A9A] mt-1">AVG. ENGAGEMENT</div>
          </div>
        </div>
      </section>

      {/* Client / Partner Brand Ticker */}
      <section className="py-8 border-y border-white/10 bg-[#0B0B0B]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-mono-tag text-[10px] text-[#707070] shrink-0">
            TRUSTED BY VELOCITY TEAMS & AGENCIES
          </span>
          <div className="flex flex-wrap items-center gap-8 sm:gap-12 opacity-60 hover:opacity-100 transition-opacity">
            {['JSPM CAMPUS', 'APEX MARKETING', 'VELOCITY CREATIVE', 'TECHNOVA MEDIA', 'ACME STUDIO'].map((brand, i) => (
              <span key={i} className="font-display font-bold text-sm tracking-wider text-white uppercase">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section id="features" className="py-24 px-6 sm:px-10 max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="font-mono-tag text-[10px] text-[#C8FF00] bg-[#C8FF00]/10 px-2.5 py-1 rounded border border-[#C8FF00]/25">
            01 / ARCHITECTURE
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white uppercase mt-4">
            EVERYTHING IN <span className="text-[#C8FF00]">ONE PLACE.</span>
          </h2>
          <p className="text-sm text-[#9A9A9A] max-w-xl mt-2">
            No fragmented tools. Unified publishing, AI synthesis, approvals, and performance telemetry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              tag: 'PUBLISHING',
              title: 'MULTI-PLATFORM BROADCAST',
              desc: 'Simultaneous scheduled delivery to Instagram, LinkedIn, YouTube, X, and Facebook with native media formatting.',
              icon: Share2,
              view: 'accounts'
            },
            {
              tag: 'CREATIVE AI',
              title: 'GEMINI AI STUDIO LAB',
              desc: 'High-converting hooks, viral reels frameworks, hashtag taxonomy, and algorithmic tone optimization.',
              icon: Sparkles,
              view: 'ai_assistant'
            },
            {
              tag: 'EDITORIAL',
              title: 'CONTENT PIPELINE CALENDAR',
              desc: 'Visual drag-and-drop grid with Indian festival radars, brand campaign filters, and instant locking.',
              icon: Calendar,
              view: 'calendar'
            },
            {
              tag: 'GOVERNANCE',
              title: 'APPROVALS & CLIENT PORTAL',
              desc: 'Multi-tiered role authorization, client presentation views, and real-time revision audit trails.',
              icon: FileCheck,
              view: 'approvals'
            },
            {
              tag: 'PROJECTS',
              title: 'CAMPAIGN MATRIX',
              desc: 'Budget allocation, content milestones, cross-functional tasks, and asset repositories.',
              icon: Layers,
              view: 'campaigns'
            },
            {
              tag: 'TELEMETRY',
              title: 'ACTIONABLE ANALYTICS',
              desc: 'Clean monochromatic performance charts, benchmark comparisons, and AI audience insights.',
              icon: BarChart3,
              view: 'analytics'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={() => setActiveView(item.view as any)}
                className="card-brivon rounded-2xl p-6 flex flex-col justify-between group cursor-pointer hover:border-[#C8FF00]/50"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono-tag text-[10px] text-[#9A9A9A] group-hover:text-[#C8FF00] transition-colors">
                      {item.tag}
                    </span>
                    <div className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:text-[#C8FF00] group-hover:border-[#C8FF00]/40 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-display font-extrabold text-xl text-white uppercase group-hover:text-[#C8FF00] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#9A9A9A] mt-3 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between font-mono-tag text-[10px] text-[#9A9A9A] group-hover:text-white">
                  <span>LAUNCH COMPONENT</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform group-hover:text-[#C8FF00]" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive AI Laboratory Section */}
      <section id="ai-assistant" className="py-24 px-6 sm:px-10 bg-[#0B0B0B] border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <span className="font-mono-tag text-[10px] text-[#C8FF00] bg-[#C8FF00]/10 px-2.5 py-1 rounded border border-[#C8FF00]/25">
              02 / AI CREATIVE ASSISTANT
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-white uppercase mt-4">
              "WHAT ARE WE <span className="text-[#C8FF00]">CREATING TODAY?"</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#9A9A9A] mt-2">
              Generate viral hooks, captions, full reel outlines, and hashtags tuned for modern social algorithms.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Prompt Selector */}
            <div className="lg:col-span-5 space-y-3">
              <span className="font-mono-tag text-[10px] text-[#707070]">SELECT TEST ANGLE</span>
              <div className="space-y-2">
                {testPrompts.map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSampleTopic(topic);
                      setSampleOutput(`⚡ VIRAL HOOK (0-3s): "What nobody tells you about ${topic.toLowerCase()}..."\n\n🎬 SCENE 1: Kinetic macro tracking shot on the primary subject.\n🎬 SCENE 2: Fast-paced cut with dynamic on-screen text overlays.\n🎬 SCENE 3: High energy punchline with brand CTA.\n\n💬 CAPTION: "Everything changed when we launched this. Double tap if you agree! 🔥"\n🏷️ #SocialMedia2026 #CreativeOps #ViralMarketing`);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs font-mono-tag transition-all flex items-center justify-between cursor-pointer ${
                      sampleTopic === topic
                        ? 'bg-[#C8FF00] text-[#080808] border-[#C8FF00] font-bold shadow-md'
                        : 'bg-[#111111] text-[#F5F5F0] border-white/10 hover:border-white/25'
                    }`}
                  >
                    <span>{topic}</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>

              <div className="pt-3">
                <button
                  onClick={() => setActiveView('ai_assistant')}
                  className="w-full py-3.5 bg-[#C8FF00] hover:bg-[#D4FF35] text-[#080808] font-bold text-xs font-mono-tag rounded-lg shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 stroke-[2.5]" />
                  <span>OPEN FULL AI STUDIO</span>
                </button>
              </div>
            </div>

            {/* Right Output Console */}
            <div className="lg:col-span-7 card-brivon rounded-2xl p-6 bg-[#111111] flex flex-col justify-between font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-[#9A9A9A]">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#C8FF00] animate-pulse" />
                  <span className="font-mono-tag text-[10px] text-[#C8FF00]">GEMINI 2.5 FLASH PROMPT ENGINE</span>
                </div>
                <span className="text-[10px] text-[#707070]">OUTPUT / 2026</span>
              </div>

              <div className="my-4 p-4 rounded-xl bg-[#0D0D0D] border border-white/10 text-[#F5F5F0] whitespace-pre-line leading-relaxed font-mono text-xs">
                {sampleOutput}
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#9A9A9A]">
                <span>TOPIC: {sampleTopic}</span>
                <button
                  onClick={() => setActiveView('studio')}
                  className="text-[#C8FF00] font-mono-tag font-bold hover:underline"
                >
                  INSERT TO STUDIO →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 sm:px-10 max-w-7xl mx-auto">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <span className="font-mono-tag text-[10px] text-[#C8FF00] bg-[#C8FF00]/10 px-2.5 py-1 rounded border border-[#C8FF00]/25">
            03 / PRICING MATRIX
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white uppercase mt-4">
            TRANSPARENT <span className="text-[#C8FF00]">TIERS.</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#9A9A9A] mt-2">
            Engineered for solo creators, growing agencies, and multi-campus universities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter Tier */}
          <div className="card-brivon rounded-2xl p-8 bg-[#111111] flex flex-col justify-between">
            <div>
              <span className="font-mono-tag text-[10px] text-[#9A9A9A]">TIER / 01</span>
              <h3 className="font-display font-extrabold text-2xl text-white uppercase mt-1">STARTER</h3>
              <p className="text-xs text-[#9A9A9A] mt-2">For solo creators and emergent channels.</p>
              
              <div className="my-6">
                <span className="font-display font-black text-4xl text-white">$0</span>
                <span className="font-mono-tag text-xs text-[#9A9A9A] ml-2">/ FOREVER</span>
              </div>

              <ul className="space-y-3 text-xs text-[#9A9A9A]">
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-[#C8FF00]" /><span className="text-[#F5F5F0]">3 Social Accounts</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-[#C8FF00]" /><span className="text-[#F5F5F0]">30 Scheduled Posts/mo</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-[#C8FF00]" /><span className="text-[#F5F5F0]">Standard AI Caption Generator</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-[#C8FF00]" /><span className="text-[#F5F5F0]">Indian & Global Calendar Radar</span></li>
              </ul>
            </div>

            <button
              onClick={() => setActiveView('dashboard')}
              className="mt-8 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono-tag font-bold text-xs rounded-lg transition-all"
            >
              LAUNCH FREE
            </button>
          </div>

          {/* Growth Agency Tier (Lime Border Highlight) */}
          <div className="card-brivon rounded-2xl p-8 bg-[#151515] border-[#C8FF00]/60 relative flex flex-col justify-between shadow-2xl">
            <div className="absolute -top-3 right-6 px-2.5 py-0.5 bg-[#C8FF00] text-[#080808] font-mono-tag font-bold text-[9px] rounded">
              POPULAR
            </div>
            <div>
              <span className="font-mono-tag text-[10px] text-[#C8FF00]">TIER / 02</span>
              <h3 className="font-display font-extrabold text-2xl text-white uppercase mt-1">GROWTH SQUAD</h3>
              <p className="text-xs text-[#9A9A9A] mt-2">For high-velocity agencies & campus teams.</p>
              
              <div className="my-6">
                <span className="font-display font-black text-4xl text-[#C8FF00]">$29</span>
                <span className="font-mono-tag text-xs text-[#9A9A9A] ml-2">/ MO</span>
              </div>

              <ul className="space-y-3 text-xs text-[#9A9A9A]">
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-[#C8FF00]" /><span className="text-white">Unlimited Connected Accounts</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-[#C8FF00]" /><span className="text-white">Unlimited Scheduled Posts</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-[#C8FF00]" /><span className="text-white">Full AI Creative Studio (Reels & Prompts)</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-[#C8FF00]" /><span className="text-white">Approvals & Governance Workflows</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-[#C8FF00]" /><span className="text-white">Client Presentation Portals</span></li>
              </ul>
            </div>

            <button
              onClick={() => setActiveView('dashboard')}
              className="mt-8 w-full py-3 bg-[#C8FF00] hover:bg-[#D4FF35] text-[#080808] font-mono-tag font-bold text-xs rounded-lg shadow-md transition-all hover:translate-x-0.5"
            >
              START TRIAL →
            </button>
          </div>

          {/* Enterprise Tier */}
          <div className="card-brivon rounded-2xl p-8 bg-[#111111] flex flex-col justify-between">
            <div>
              <span className="font-mono-tag text-[10px] text-[#9A9A9A]">TIER / 03</span>
              <h3 className="font-display font-extrabold text-2xl text-white uppercase mt-1">ENTERPRISE</h3>
              <p className="text-xs text-[#9A9A9A] mt-2">For multi-department brands & universities.</p>
              
              <div className="my-6">
                <span className="font-display font-black text-4xl text-white">$89</span>
                <span className="font-mono-tag text-xs text-[#9A9A9A] ml-2">/ MO</span>
              </div>

              <ul className="space-y-3 text-xs text-[#9A9A9A]">
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-[#C8FF00]" /><span className="text-[#F5F5F0]">Multi-Workspace Isolation</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-[#C8FF00]" /><span className="text-[#F5F5F0]">Custom AI Fine-Tuning</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-[#C8FF00]" /><span className="text-[#F5F5F0]">Dedicated Account Strategist</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-[#C8FF00]" /><span className="text-[#F5F5F0]">SSO & Custom SLA</span></li>
              </ul>
            </div>

            <button
              onClick={() => setActiveView('dashboard')}
              className="mt-8 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono-tag font-bold text-xs rounded-lg transition-all"
            >
              CONTACT SQUAD
            </button>
          </div>
        </div>
      </section>

      {/* Big Hero CTA Banner */}
      <section className="py-20 px-6 sm:px-10 bg-[#0B0B0B] border-t border-white/10 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="font-mono-tag text-[10px] text-[#C8FF00]">READY TO SCALE?</span>
          <h2 className="font-display font-black text-4xl sm:text-6xl text-white uppercase tracking-tight leading-tight">
            STOP THE CHAOS. <br />
            START <span className="text-[#C8FF00]">OPERATING.</span>
          </h2>
          <p className="text-sm text-[#9A9A9A] max-w-xl mx-auto">
            Take control of your publishing pipeline today. No credit card required.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="final-cta-btn"
              onClick={() => {
                setAuthMode('signup');
                setIsOnboarding(true);
              }}
              className="px-8 py-4 bg-[#C8FF00] hover:bg-[#D4FF35] text-[#080808] font-mono-tag font-extrabold text-xs rounded-lg shadow-md transition-all hover:translate-x-1 flex items-center space-x-2 cursor-pointer"
            >
              <span>CREATE WORKSPACE</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
            <button
              id="final-cta-demo"
              onClick={() => setActiveView('dashboard')}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-mono-tag font-bold text-xs rounded-lg border border-white/15 transition-all cursor-pointer"
            >
              LAUNCH LIVE COMMAND CENTER
            </button>
          </div>
        </div>
      </section>

      {/* Editorial Footer */}
      <footer className="py-12 px-6 sm:px-10 border-t border-white/10 bg-[#080808]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 font-mono-tag text-xs text-[#707070]">
          <div className="flex items-center space-x-2 text-white">
            <Flame className="w-4 h-4 text-[#C8FF00]" />
            <span className="font-display font-black text-sm uppercase">SOCIALLY</span>
            <span className="text-[#707070]">— OPERATIONS / 2026</span>
          </div>
          <div>
            © 2026 SOCIALLY INC. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
};
