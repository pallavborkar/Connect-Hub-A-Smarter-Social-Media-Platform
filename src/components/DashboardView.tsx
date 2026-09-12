import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Eye, 
  Sparkles, 
  Calendar, 
  Plus, 
  ArrowUpRight, 
  Share2, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  Flame, 
  CheckSquare, 
  MessageSquare, 
  FileText, 
  Layers, 
  Zap, 
  ExternalLink,
  Sun,
  SunMedium,
  Sunset,
  Moon,
  Bot,
  X,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const DashboardView: React.FC = () => {
  const { 
    user, 
    posts, 
    tasks, 
    events, 
    socialAccounts, 
    selectedAccountId,
    analytics, 
    setActiveView, 
    setIsStudioModalOpen, 
    setStudioInitialDraft,
    triggerAIEventSuggestions,
    currentGreeting,
    wittySubtext,
    greetingIcon,
    timeOfDay,
    liveClock,
    formatDate,
    getEventCountdown,
    isSetupDismissed,
    dismissSetup,
    resetOnboarding,
    onboardingGoals
  } = useApp();

  const [showAdvancedStats, setShowAdvancedStats] = useState(false);

  const selectedAccount = socialAccounts.find(a => a.id === selectedAccountId);
  const isAllAccounts = selectedAccountId === 'all' || !selectedAccount;

  const totalFollowers = isAllAccounts 
    ? socialAccounts.reduce((sum, acc) => sum + (acc.isConnected ? acc.followers : 0), 0)
    : selectedAccount?.followers || 0;

  const displayReach = isAllAccounts ? analytics.totalReach : (selectedAccount?.reach || 0);

  const pendingApprovals = posts.filter(p => p.status === 'pending_review');
  const scheduledPosts = posts.filter(p => p.status === 'scheduled' || p.status === 'approved');
  const nextScheduledPost = scheduledPosts[0];

  // Dynamically compute upcoming events sorted by countdown
  const eventsWithCountdowns = events.map(e => {
    const cd = getEventCountdown(e.date);
    return { ...e, cd };
  }).filter(e => e.cd.daysAway >= 0).sort((a, b) => a.cd.daysAway - b.cd.daysAway);

  const nextImminentEvent = eventsWithCountdowns.find(e => e.cd.daysAway >= 0 && e.cd.daysAway <= 7);

  // Setup completion calculations
  const connectedCount = socialAccounts.filter(a => a.isConnected).length;
  const setupSteps = [
    { label: 'Workspace created', completed: true },
    { label: 'Profile completed', completed: true },
    { label: 'Connect social accounts', completed: connectedCount > 0, action: 'accounts', actionLabel: 'Connect' },
    { label: 'Create your first post', completed: posts.length > 0, action: 'studio', actionLabel: 'Create' },
    { label: 'Invite your team', completed: tasks.length > 0, action: 'team', actionLabel: 'Invite' },
  ];
  const completedCount = setupSteps.filter(s => s.completed).length;
  const setupProgressPercent = Math.round((completedCount / setupSteps.length) * 100);

  const renderGreetingIcon = () => {
    switch (greetingIcon) {
      case 'sun':
        return <Sun className="w-5 h-5 text-amber-300 animate-spin-slow" />;
      case 'sun-high':
        return <SunMedium className="w-5 h-5 text-yellow-300" />;
      case 'sunset':
        return <Sunset className="w-5 h-5 text-orange-300" />;
      case 'moon':
        return <Moon className="w-5 h-5 text-indigo-300" />;
    }
  };

  const handleAIQuickPrompt = (promptText: string) => {
    setActiveView('ai_assistant');
  };

  return (
    <div id="dashboard-view" className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-[#F5F5F0]">
      {/* 1. GREETING HERO CARD - EDITORIAL COMMAND CENTER */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 bg-[#111111] border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* Subtle decorative grid background element */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40" />

        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="flex items-center space-x-2.5">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#C8FF00]/10 border border-[#C8FF00]/30 font-mono-tag text-[10px] font-bold text-[#C8FF00]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00] animate-pulse" />
              <span>COMMAND CENTER ACTIVE</span>
            </span>
            <span className="font-mono-tag text-[10px] text-[#707070]">
              {liveClock.time} • {liveClock.tzAbbrev}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-none">
            {currentGreeting.split(',')[0]}, {user?.name?.split(' ')[0] || 'CREATOR'}.
          </h1>
          <p className="text-sm text-[#9A9A9A] font-medium max-w-lg leading-relaxed">
            Operations live across your connected social ecosystem. Here is your daily strategic briefing.
          </p>
        </div>

        {/* CTAs on greeting hero card */}
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            id="dash-header-manage-btn"
            onClick={() => setActiveView('calendar')}
            className="px-4 py-2.5 bg-[#181818] hover:bg-[#222222] border border-white/15 text-white font-mono-tag text-xs font-bold rounded-lg transition-all flex items-center space-x-2 cursor-pointer shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5 text-[#C8FF00]" />
            <span>SCHEDULE POST</span>
          </button>

          <button
            id="dash-header-create-btn"
            onClick={() => {
              setStudioInitialDraft(null);
              setIsStudioModalOpen(true);
            }}
            className="px-5 py-2.5 bg-[#C8FF00] hover:bg-[#D4FF35] text-[#080808] font-mono-tag text-xs font-bold rounded-lg transition-all flex items-center space-x-2 cursor-pointer shadow-xs active:scale-98"
          >
            <Plus className="w-4 h-4 text-[#080808]" />
            <span>CREATE CONTENT →</span>
          </button>
        </div>
      </div>

      {/* 2. FIRST-TIME DASHBOARD SETUP PROGRESS BANNER */}
      {!isSetupDismissed && setupProgressPercent < 100 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 sm:p-6 rounded-2xl bg-[#111111] border border-white/10 relative"
        >
          <button
            onClick={dismissSetup}
            className="absolute top-4 right-4 p-1.5 text-[#707070] hover:text-white rounded-lg transition-colors"
            title="Dismiss setup"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pr-8">
              <div>
                <span className="font-mono-tag text-[10px] font-bold text-[#C8FF00] uppercase tracking-wider">
                  SYSTEM ONBOARDING
                </span>
                <h3 className="font-display text-base font-bold text-white uppercase mt-0.5">
                  Workspace Readiness: {setupProgressPercent}%
                </h3>
              </div>

              <span className="font-mono-tag text-[10px] font-bold px-2.5 py-1 bg-[#181818] border border-white/10 text-white rounded self-start sm:self-auto">
                {completedCount} OF {setupSteps.length} COMPLETE
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-[#181818] rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-[#C8FF00] rounded-full transition-all duration-500"
                style={{ width: `${setupProgressPercent}%` }}
              />
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-1">
              {setupSteps.map((s, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                    s.completed
                      ? 'bg-[#C8FF00]/5 border-[#C8FF00]/20 text-[#C8FF00] font-medium'
                      : 'bg-[#161616] border-white/10 text-[#9A9A9A]'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    {s.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C8FF00] shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-[#707070] shrink-0" />
                    )}
                    <span className="truncate text-[11px] font-medium">{s.label}</span>
                  </div>

                  {!s.completed && s.action && (
                    <button
                      onClick={() => {
                        if (s.action === 'studio') {
                          setStudioInitialDraft(null);
                          setIsStudioModalOpen(true);
                        } else {
                          setActiveView(s.action as any);
                        }
                      }}
                      className="font-mono-tag text-[9px] font-bold px-2 py-0.5 bg-[#C8FF00] text-[#080808] rounded hover:bg-[#D4FF35] transition-colors shrink-0 ml-1"
                    >
                      {s.actionLabel?.toUpperCase()}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* 3. PERFORMANCE METRICS BENTO GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#111111] border border-white/10 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono-tag text-[10px] uppercase text-[#707070]">Total Audience</span>
            <Users className="w-4 h-4 text-[#707070]" />
          </div>
          <p className="font-display text-3xl font-black text-white mt-2">
            {(totalFollowers / 1000).toFixed(1)}K
          </p>
          <div className="flex items-center space-x-1.5 mt-2">
            <span className="font-mono-tag text-[10px] text-[#C8FF00] font-bold">
              +{analytics.followerGrowthPercent}%
            </span>
            <span className="font-mono-tag text-[10px] text-[#707070]">MOM GROWTH</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#111111] border border-white/10 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono-tag text-[10px] uppercase text-[#707070]">Monthly Reach</span>
            <Eye className="w-4 h-4 text-[#707070]" />
          </div>
          <p className="font-display text-3xl font-black text-white mt-2">
            {(displayReach / 1000).toFixed(1)}K
          </p>
          <div className="flex items-center space-x-1.5 mt-2">
            <span className="font-mono-tag text-[10px] text-[#C8FF00] font-bold">
              +{analytics.reachGrowthPercent}%
            </span>
            <span className="font-mono-tag text-[10px] text-[#707070]">IMPRESSIONS</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#111111] border border-white/10 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono-tag text-[10px] uppercase text-[#707070]">Review Queue</span>
            <Clock className="w-4 h-4 text-[#707070]" />
          </div>
          <p className="font-display text-3xl font-black text-white mt-2">
            {pendingApprovals.length}
          </p>
          <div className="flex items-center space-x-1.5 mt-2">
            <span className="font-mono-tag text-[10px] text-[#C8FF00] font-bold">
              {pendingApprovals.length > 0 ? 'ACTION NEEDED' : 'QUEUE CLEAR'}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#111111] border border-white/10 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono-tag text-[10px] uppercase text-[#707070]">Avg Engagement</span>
            <TrendingUp className="w-4 h-4 text-[#707070]" />
          </div>
          <p className="font-display text-3xl font-black text-white mt-2">
            {analytics.avgEngagementRate}%
          </p>
          <div className="flex items-center space-x-1.5 mt-2">
            <span className="font-mono-tag text-[10px] text-[#C8FF00] font-bold">
              TOP: REELS
            </span>
          </div>
        </div>
      </div>

      {/* 4. WHAT NEEDS YOUR ATTENTION TODAY */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#111111] border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="font-display text-lg font-bold text-white uppercase flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-[#C8FF00]" />
              <span>Priority Command Queue</span>
            </h3>
            <p className="font-mono-tag text-[10px] text-[#707070] mt-0.5">
              ACTIONABLE TASKS REQUIRING IMMEDIATE OPERATOR ATTENTION
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Action Item 1: Pending Approvals */}
          <div className="p-4 rounded-xl border border-white/10 bg-[#161616] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start space-x-3">
              <span className="font-mono-tag text-xs font-bold text-[#C8FF00] bg-[#C8FF00]/10 px-2 py-1 rounded">
                01
              </span>
              <div>
                <p className="text-xs font-bold text-white">
                  {pendingApprovals.length > 0 
                    ? `${pendingApprovals.length} Post(s) Waiting For Client Approval`
                    : 'All Posts Approved & Cleared'
                  }
                </p>
                <p className="font-mono-tag text-[10px] text-[#707070] mt-0.5">
                  {pendingApprovals.length > 0
                    ? 'Review feedback from client stakeholders before publishing window.'
                    : 'Publishing schedule is on track with zero blocked drafts.'
                  }
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveView('approvals')}
              className="px-3.5 py-1.5 bg-[#181818] hover:bg-white/10 border border-white/15 text-white font-mono-tag text-xs font-bold rounded-lg transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
            >
              REVIEW QUEUE →
            </button>
          </div>

          {/* Action Item 2: Imminent Event */}
          {nextImminentEvent ? (
            <div className="p-4 rounded-xl border border-[#C8FF00]/20 bg-[#C8FF00]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start space-x-3">
                <span className="font-mono-tag text-xs font-bold text-[#C8FF00] bg-[#C8FF00]/10 px-2 py-1 rounded">
                  02
                </span>
                <div>
                  <p className="text-xs font-bold text-white">
                    {nextImminentEvent.title} is coming up ({nextImminentEvent.cd.label})
                  </p>
                  <p className="font-mono-tag text-[10px] text-[#9A9A9A] mt-0.5">
                    Generate an angle or campaign hook before the moment passes.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setStudioInitialDraft({
                    title: `${nextImminentEvent.title} Campaign Reel`,
                    caption: `Celebrating ${nextImminentEvent.title}! Here is how our team honors this moment. #${nextImminentEvent.title.replace(/\s+/g, '')}`,
                    hashtags: [nextImminentEvent.title.replace(/\s+/g, ''), 'EditorialCulture', 'BrandMoment'],
                    platforms: ['instagram', 'linkedin'],
                    contentType: 'reel',
                  });
                  setIsStudioModalOpen(true);
                }}
                className="px-3.5 py-1.5 bg-[#C8FF00] hover:bg-[#D4FF35] text-[#080808] font-mono-tag text-xs font-bold rounded-lg transition-all shrink-0 self-start sm:self-auto cursor-pointer flex items-center space-x-1.5 shadow-xs"
              >
                <Sparkles className="w-3 h-3 text-[#080808]" />
                <span>AI GENERATE →</span>
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-white/10 bg-[#161616] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start space-x-3">
                <span className="font-mono-tag text-xs font-bold text-[#707070] bg-white/5 px-2 py-1 rounded">
                  02
                </span>
                <div>
                  <p className="text-xs font-bold text-white">
                    Explore Calendar & Global Cultural Moments
                  </p>
                  <p className="font-mono-tag text-[10px] text-[#707070] mt-0.5">
                    Scan viral holidays and industry events to plan campaign hooks ahead.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveView('events')}
                className="px-3.5 py-1.5 bg-[#181818] hover:bg-white/10 border border-white/15 text-white font-mono-tag text-xs font-bold rounded-lg transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
              >
                EXPLORE RADAR →
              </button>
            </div>
          )}

          {/* Action Item 3: Scheduled Content */}
          <div className="p-4 rounded-xl border border-white/10 bg-[#161616] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start space-x-3">
              <span className="font-mono-tag text-xs font-bold text-[#707070] bg-white/5 px-2 py-1 rounded">
                03
              </span>
              <div>
                <p className="text-xs font-bold text-white">
                  {nextScheduledPost 
                    ? `Next Post Scheduled: ${formatDate(nextScheduledPost.scheduledDate, 'datetime')}`
                    : 'No Posts Scheduled For The Upcoming Cycle'
                  }
                </p>
                <p className="font-mono-tag text-[10px] text-[#707070] mt-0.5">
                  {nextScheduledPost ? nextScheduledPost.title : 'Maintain algorithmic consistency by scheduling upcoming posts.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveView('calendar')}
              className="px-3.5 py-1.5 bg-[#181818] hover:bg-white/10 border border-white/15 text-white font-mono-tag text-xs font-bold rounded-lg transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
            >
              CALENDAR →
            </button>
          </div>
        </div>
      </div>

      {/* 5. AI PROMPT LAB / CREATIVE ACCELERATOR */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#111111] border border-white/10 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-[#C8FF00] text-[#080808]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold uppercase text-white tracking-tight">
              AI Command Prompt Lab
            </h3>
            <p className="font-mono-tag text-[10px] text-[#707070]">
              SELECT A CREATIVE ANGLE OR LAUNCH DIRECTLY INTO STUDIO PROMPTS
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {[
            'Script Viral Hook',
            'Draft LinkedIn Carousel',
            'Generate Trending Reel Angles',
            'Audit Best Posting Windows',
            'Brainstorm Weekly Content Strategy',
            'Campaign Caption Optimizer'
          ].map((promptText, idx) => (
            <button
              key={idx}
              onClick={() => handleAIQuickPrompt(promptText)}
              className="px-3 py-2 rounded-lg bg-[#181818] hover:bg-[#222222] border border-white/10 hover:border-[#C8FF00]/40 font-mono-tag text-[10px] font-bold text-[#F5F5F0] hover:text-[#C8FF00] transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <Sparkles className="w-3 h-3 text-[#C8FF00]" />
              <span>{promptText.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 6. PERFORMANCE CHART */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#111111] border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="font-display text-base font-bold text-white uppercase">
              Audience Velocity & Reach
            </h3>
            <p className="font-mono-tag text-[10px] text-[#707070]">
              MONTHLY HISTORICAL TRAJECTORY ACROSS CHANNELS
            </p>
          </div>

          <button
            onClick={() => setShowAdvancedStats(!showAdvancedStats)}
            className="font-mono-tag text-xs font-bold text-[#C8FF00] hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>{showAdvancedStats ? 'COLLAPSE' : 'EXPAND FULL CHART'}</span>
            {showAdvancedStats ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.growthHistory}>
              <defs>
                <linearGradient id="reachGradBrivon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C8FF00" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C8FF00" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#707070" fontSize={10} tickLine={false} />
              <YAxis stroke="#707070" fontSize={10} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111111',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '11px',
                }}
              />
              <Area type="monotone" dataKey="reach" stroke="#C8FF00" strokeWidth={2} fillOpacity={1} fill="url(#reachGradBrivon)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
