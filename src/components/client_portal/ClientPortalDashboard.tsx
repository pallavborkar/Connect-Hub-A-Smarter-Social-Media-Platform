import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  CheckSquare, 
  Sparkles, 
  Calendar, 
  Layers, 
  MessageSquare, 
  BarChart3, 
  ArrowUpRight, 
  Clock, 
  FileText, 
  Eye, 
  Share2, 
  CheckCircle2, 
  RotateCcw,
  Palette,
  TrendingUp,
  AlertCircle,
  Users,
  Check,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Youtube
} from 'lucide-react';
import { motion } from 'motion/react';
import { ClientContentReviewModal } from './ClientContentReviewModal';
import { SocialPlatform } from '../../types';

const PLATFORM_ICONS: Record<string, any> = {
  instagram: Instagram,
  linkedin: Linkedin,
  x: Twitter,
  facebook: Facebook,
  youtube: Youtube,
  tiktok: Share2,
};

export const ClientPortalDashboard: React.FC = () => {
  const { 
    activeClient, 
    posts, 
    campaigns, 
    clientMessages, 
    setActiveView, 
    isClientViewMode, 
    exitClientViewMode,
    approvePost,
    userTimezone,
    liveClock,
    user 
  } = useApp();

  const [selectedReviewPostId, setSelectedReviewPostId] = useState<string | null>(null);

  // Dynamic greeting based on current local hour
  const getDynamicGreeting = () => {
    const hour = new Date().getHours();
    const clientName = activeClient?.name || 'Partner';
    if (hour >= 5 && hour < 12) {
      return `Good morning, ${clientName}`;
    } else if (hour >= 12 && hour < 17) {
      return `Good afternoon, ${clientName}`;
    } else {
      return `Good evening, ${clientName}`;
    }
  };

  const pendingReviewPosts = posts.filter(p => p.status === 'pending_review');
  const scheduledPosts = posts.filter(p => p.status === 'scheduled');
  const publishedPosts = posts.filter(p => p.status === 'published');
  const inRevisionPosts = posts.filter(p => p.status === 'changes_requested');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Simulation Banner (Agency is simulating client view) */}
      {isClientViewMode && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-indigo-500/15 border border-pink-500/30 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              CLIENT VIEW MODE: Previewing portal as <span className="text-purple-600 dark:text-purple-400">{activeClient?.name}</span>
            </p>
          </div>
          <button
            onClick={exitClientViewMode}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition-transform hover:scale-105 cursor-pointer shadow-xs"
          >
            Exit Client View
          </button>
        </div>
      )}

      {/* Hero Header with Dynamic Greeting & Subtitle */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white border border-indigo-500/20 shadow-xl relative overflow-hidden">
        {/* Background decorative glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start sm:items-center space-x-4">
            <img 
              src={activeClient?.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'} 
              alt={activeClient?.name} 
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-lg bg-white shrink-0" 
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-pink-400">
                  Client Portal
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white/10 text-white backdrop-blur-xs">
                  {activeClient?.industry || 'Higher Education'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                {getDynamicGreeting()}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Here's what's happening with your social media.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => setActiveView('client_approvals')}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white text-xs font-bold shadow-lg shadow-pink-500/25 flex items-center space-x-2 transition-transform hover:scale-105 cursor-pointer"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Pending Approvals ({pendingReviewPosts.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* PERFORMANCE METRICS (Total Followers, Growth, Reach, Engagement Rate) */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
          Performance Overview
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Total Followers</span>
              <Users className="w-4 h-4 text-purple-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">52,400</span>
              <span className="text-xs text-emerald-500 font-bold">+14.8%</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Across IG, LI & X</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Follower Growth</span>
              <TrendingUp className="w-4 h-4 text-pink-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">+3,240</span>
              <span className="text-xs text-emerald-500 font-bold">This Month</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">+18.2% vs last period</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Monthly Reach</span>
              <Eye className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">489.2K</span>
              <span className="text-xs text-emerald-500 font-bold">+38.4%</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Organic audience reached</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Engagement Rate</span>
              <BarChart3 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">4.82%</span>
              <span className="text-xs text-slate-400 font-semibold">Top tier</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Industry avg: 1.9%</span>
          </div>
        </div>
      </div>

      {/* CONTENT METRICS (Posts Published, Scheduled, Pending Approvals, Active Campaigns) */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
          Content Pipeline
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div 
            onClick={() => setActiveView('client_content')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs cursor-pointer hover:border-purple-500/40 transition-all"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Posts Published</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{publishedPosts.length || 24}</span>
              <span className="text-xs text-slate-400">live</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveView('client_calendar')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs cursor-pointer hover:border-purple-500/40 transition-all"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Posts Scheduled</span>
              <Calendar className="w-4 h-4 text-purple-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-purple-600 dark:text-purple-400">{scheduledPosts.length || 8}</span>
              <span className="text-xs text-slate-400">ready to auto-publish</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveView('client_approvals')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs cursor-pointer hover:border-amber-500/40 transition-all"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Pending Approvals</span>
              <CheckSquare className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{pendingReviewPosts.length}</span>
              <span className="text-xs text-amber-500 font-bold">Needs your review</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveView('client_campaigns')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs cursor-pointer hover:border-indigo-500/40 transition-all"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Active Campaigns</span>
              <Layers className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{campaigns.length || 3}</span>
              <span className="text-xs text-slate-400">strategic goals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Needs Your Attention (Left 8 cols), Account Manager & AI Performance (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Needs Your Attention Section */}
        <div className="lg:col-span-8 space-y-6">
          {/* Needs Your Attention Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Needs Your Attention
                  </h2>
                  <p className="text-xs text-slate-400">Content requiring client review and sign-off</p>
                </div>
              </div>

              {pendingReviewPosts.length > 0 && (
                <button
                  onClick={() => setActiveView('client_approvals')}
                  className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Approvals ({pendingReviewPosts.length})</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {pendingReviewPosts.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800 dark:text-white">All caught up!</p>
                <p className="text-[11px] text-slate-400 mt-0.5">No posts pending client sign-off at this time.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pendingReviewPosts.slice(0, 4).map((post) => {
                  const PlatformIcon = PLATFORM_ICONS[post.platform] || Share2;
                  return (
                    <div
                      key={post.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between space-y-3 group hover:border-purple-500/40 transition-all"
                    >
                      <div className="space-y-2">
                        {post.mediaUrl && (
                          <div className="h-36 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                            <img 
                              src={post.mediaUrl} 
                              alt={post.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                            />
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs flex items-center gap-1 capitalize">
                              <PlatformIcon className="w-3 h-3" />
                              {post.platform}
                            </span>
                            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-500/90 text-white backdrop-blur-xs">
                              Awaiting Approval
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3" /> Scheduled: {post.scheduledDate || '15 Aug 2026'} • {post.scheduledTime || '7:30 PM'}
                          </span>
                        </div>

                        <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                          {post.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                          {post.content}
                        </p>
                      </div>

                      {/* 3 Required Action Buttons: [View], [Approve], [Request Changes] */}
                      <div className="pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedReviewPostId(post.id)}
                          className="py-1.5 px-2 rounded-xl bg-slate-200/70 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => approvePost(post.id)}
                          className="py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center space-x-1 shadow-xs transition-colors cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          <span>Approve</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedReviewPostId(post.id)}
                          className="py-1.5 px-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800/60 flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Changes</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Shortcuts to Client Portal Views */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setActiveView('client_content')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:border-purple-500/40 transition-all text-left group cursor-pointer"
            >
              <Layers className="w-5 h-5 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-slate-900 dark:text-white">Content Library</p>
              <p className="text-[10px] text-slate-400">All verified creatives</p>
            </button>

            <button
              onClick={() => setActiveView('client_calendar')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:border-purple-500/40 transition-all text-left group cursor-pointer"
            >
              <Calendar className="w-5 h-5 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-slate-900 dark:text-white">Schedule Calendar</p>
              <p className="text-[10px] text-slate-400">Month & week timeline</p>
            </button>

            <button
              onClick={() => setActiveView('client_brand_assets')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:border-purple-500/40 transition-all text-left group cursor-pointer"
            >
              <Palette className="w-5 h-5 text-pink-600 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-slate-900 dark:text-white">Brand Assets</p>
              <p className="text-[10px] text-slate-400">Logos, colors & fonts</p>
            </button>

            <button
              onClick={() => setActiveView('client_reports')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:border-purple-500/40 transition-all text-left group cursor-pointer"
            >
              <FileText className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-slate-900 dark:text-white">Monthly Reports</p>
              <p className="text-[10px] text-slate-400">Download executive PDF</p>
            </button>
          </div>
        </div>

        {/* Right Column: AI Digest, Account Manager & Messages */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Monthly Performance Digest */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-slate-900 border border-purple-500/30 shadow-xs space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white">AI Strategy Digest</h3>
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">
              Your Instagram Reels drove a 21% audience lift this month. High-performing student spotlight reels gained 4.2x above average reach.
            </p>
            <button
              onClick={() => setActiveView('client_analytics')}
              className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Explore Analytics & Growth</span>
            </button>
          </div>

          {/* Account Manager Direct Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Dedicated Agency Lead
            </h3>

            <div className="flex items-center space-x-3">
              <img 
                src={activeClient?.assignedManager?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                alt="" 
                className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs" 
              />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {activeClient?.assignedManager?.name || 'Aarav Sharma'}
                </p>
                <p className="text-xs text-slate-400">Senior Account Director</p>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-500 font-semibold mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> SLA: &lt; {activeClient?.slaHours || 24}h response
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveView('client_messages')}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer border border-purple-200 dark:border-purple-800/60"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Direct Chat with Aarav</span>
            </button>
          </div>
        </div>
      </div>

      {/* Review Modal Trigger */}
      <ClientContentReviewModal
        postId={selectedReviewPostId}
        onClose={() => setSelectedReviewPostId(null)}
      />
    </div>
  );
};
