import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  CheckCircle2,
  Lightbulb,
  Zap,
  Target,
  Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { ClientContentReviewModal } from './ClientContentReviewModal';

const PERIOD_OPTIONS = [
  { id: '7d', label: 'Last 7 Days' },
  { id: '30d', label: 'Last 30 Days' },
  { id: '90d', label: 'Last 90 Days' },
  { id: 'ytd', label: 'This Year' },
];

const FOLLOWER_GROWTH_DATA = [
  { date: 'Aug 01', instagram: 24200, linkedin: 12100, x: 8900, total: 45200 },
  { date: 'Aug 04', instagram: 24800, linkedin: 12400, x: 9050, total: 46250 },
  { date: 'Aug 07', instagram: 25400, linkedin: 12800, x: 9200, total: 47400 },
  { date: 'Aug 10', instagram: 26300, linkedin: 13200, x: 9400, total: 48900 },
  { date: 'Aug 13', instagram: 27200, linkedin: 13700, x: 9600, total: 50500 },
  { date: 'Aug 16', instagram: 28400, linkedin: 14100, x: 9800, total: 52300 },
];

const REACH_IMPRESSIONS_DATA = [
  { week: 'Week 1', reach: 84000, impressions: 112000, engagement: 8200 },
  { week: 'Week 2', reach: 112000, impressions: 148000, engagement: 11400 },
  { week: 'Week 3', reach: 135000, impressions: 182000, engagement: 14800 },
  { week: 'Week 4', reach: 158200, impressions: 214000, engagement: 17600 },
];

const FORMAT_PERFORMANCE_DATA = [
  { format: 'Reels / Video', avgReach: 48500, engagementRate: 6.2 },
  { format: 'PDF Carousels', avgReach: 32400, engagementRate: 5.4 },
  { format: 'Image Infographics', avgReach: 18200, engagementRate: 3.8 },
  { format: 'Thought Threads', avgReach: 14600, engagementRate: 4.1 },
];

export const ClientAnalyticsView: React.FC = () => {
  const { activeClient, posts } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedPostReviewId, setSelectedPostReviewId] = useState<string | null>(null);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Audience & Growth Analytics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              {activeClient?.name || 'Client Brand'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time multi-platform social metrics, content performance breakdown, and AI insights.
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center space-x-1.5 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          {PERIOD_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => setSelectedPeriod(opt.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedPeriod === opt.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <span className="text-[11px] text-slate-400 font-semibold block">Total Reach</span>
          <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">489.2K</span>
          <span className="text-[10px] text-emerald-500 font-bold">+38.4% MoM</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <span className="text-[11px] text-slate-400 font-semibold block">Impressions</span>
          <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">656.0K</span>
          <span className="text-[10px] text-emerald-500 font-bold">+44.1% MoM</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <span className="text-[11px] text-slate-400 font-semibold block">Engagement</span>
          <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">34,180</span>
          <span className="text-[10px] text-emerald-500 font-bold">+24.1% MoM</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <span className="text-[11px] text-slate-400 font-semibold block">Engagement Rate</span>
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">4.82%</span>
          <span className="text-[10px] text-purple-500 font-semibold">Industry: 1.9%</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <span className="text-[11px] text-slate-400 font-semibold block">New Followers</span>
          <span className="text-xl font-black text-purple-600 dark:text-purple-400 mt-1 block">+3,240</span>
          <span className="text-[10px] text-emerald-500 font-bold">+18.2%</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <span className="text-[11px] text-slate-400 font-semibold block">Posts Published</span>
          <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">24</span>
          <span className="text-[10px] text-slate-400 font-medium">100% SLA Schedule</span>
        </div>
      </div>

      {/* AI Performance Summary Callout Box (Phase 12 Requirement) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white border border-purple-500/30 shadow-xl relative overflow-hidden space-y-5">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400">
              AI Executive Performance Summary
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Your Instagram performance increased 21% this month.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Why Performance Changed */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h3 className="text-xs font-bold text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Why Performance Changed
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed">
              Transitioning 45% of weekly content into 30-second student story Reels triggered a 3.4x algorithm distribution boost on Explore feeds.
            </p>
          </div>

          {/* Best Strategy Factors */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Top Driver Metrics
            </h3>
            <ul className="text-xs text-slate-200 space-y-1">
              <li>• <span className="font-bold text-white">Best Platform:</span> Instagram (58% of new reach)</li>
              <li>• <span className="font-bold text-white">Best Content Type:</span> Campus Reels & PDF Carousels</li>
              <li>• <span className="font-bold text-white">Optimal Posting:</span> Tue & Thu at 7:30 PM IST</li>
            </ul>
          </div>

          {/* Recommended Next Steps */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" /> Recommended Next Steps
            </h3>
            <ul className="text-xs text-slate-200 space-y-1">
              <li>1. Double alumni career milestone carousels on LinkedIn.</li>
              <li>2. Launch student founder Q&A stories on Instagram.</li>
              <li>3. Test weekend morning tech trivia polls on X.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Follower Growth Chart (Left 7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                Audience Growth Trajectory
              </h2>
              <p className="text-xs text-slate-400">Cumulative followers by platform</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={FOLLOWER_GROWTH_DATA}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333ea" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#33415520" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Legend />
                <Area type="monotone" dataKey="total" name="Total Audience" stroke="#9333ea" fillOpacity={1} fill="url(#colorTotal)" />
                <Line type="monotone" dataKey="instagram" name="Instagram" stroke="#ec4899" strokeWidth={2} />
                <Line type="monotone" dataKey="linkedin" name="LinkedIn" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="x" name="X / Twitter" stroke="#0ea5e9" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reach & Impressions Bar Chart (Right 5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-600" />
              Weekly Reach Velocity
            </h2>
            <p className="text-xs text-slate-400">Unique reach vs total impressions</p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REACH_IMPRESSIONS_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#33415520" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="reach" name="Unique Reach" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="impressions" name="Impressions" fill="#a855f7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Performing Content Spotlight */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Top-Performing Content Spotlight
            </h2>
            <p className="text-xs text-slate-400">Ranked by organic reach, saves, and conversion engagement</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.slice(0, 3).map((post, idx) => (
            <div
              key={post.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-purple-600 text-white">
                    #{idx + 1} High Velocity
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    6.8% Eng. Rate
                  </span>
                </div>

                {post.mediaUrl && (
                  <div className="h-32 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img src={post.mediaUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                )}

                <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                  {post.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {post.content}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">42.8k Views</span>
                <button
                  type="button"
                  onClick={() => setSelectedPostReviewId(post.id)}
                  className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Inspect Post</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      <ClientContentReviewModal
        postId={selectedPostReviewId}
        onClose={() => setSelectedPostReviewId(null)}
      />
    </div>
  );
};
