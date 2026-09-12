import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Sparkles, 
  Share2, 
  Heart, 
  MessageCircle, 
  Bookmark, 
  ArrowUpRight,
  Download,
  Calendar,
  Layers,
  ChevronDown,
  CheckCircle2,
  Building2,
  RefreshCw,
  ExternalLink,
  Target,
  Lock,
  Crown
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { SocialPlatform } from '../types';

export const AnalyticsView: React.FC = () => {
  const { 
    analytics, 
    posts, 
    socialAccounts, 
    selectedAccountId, 
    setSelectedAccountId, 
    syncAccount, 
    showToast,
    subscription,
    checkFeatureAccess,
    openUpgradeModal
  } = useApp();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'comparison'>('overview');

  const handleExport = () => {
    if (!checkFeatureAccess('custom_analytics_export')) {
      openUpgradeModal({
        featureKey: 'custom_analytics_export',
        title: 'Export Full Analytics & PDF Reports',
        description: 'Upgrade to Creator or Agency plan to export unfiltered CSV reports, branded PDF briefs, and multi-channel performance data.'
      });
      return;
    }
    showToast('Export Generated', 'CSV performance metrics exported successfully.', 'success');
  };

  const handleTimeRangeChange = (range: '7d' | '30d' | '90d' | '1y') => {
    if ((range === '90d' || range === '1y') && !checkFeatureAccess('advanced_analytics')) {
      openUpgradeModal({
        featureKey: 'advanced_analytics',
        title: 'Historical 90-Day & Yearly Analytics',
        description: 'Free plan includes 30 days of retention. Upgrade to Creator or Agency to analyze lifetime trends and yearly growth benchmarks.'
      });
      return;
    }
    setTimeRange(range);
  };

  const selectedAccount = socialAccounts.find(a => a.id === selectedAccountId);

  // Dynamic metrics depending on selected account
  const isAllAccounts = selectedAccountId === 'all' || !selectedAccount;

  const totalAudienceReach = isAllAccounts
    ? socialAccounts.reduce((acc, a) => acc + (a.isConnected ? a.reach : 0), 0) || analytics.totalReach
    : selectedAccount?.reach || 0;

  const totalImpressions = isAllAccounts
    ? socialAccounts.reduce((acc, a) => acc + (a.isConnected ? (a.impressions || a.reach * 1.5) : 0), 0) || analytics.totalImpressions
    : selectedAccount?.impressions || (selectedAccount ? selectedAccount.reach * 1.5 : 0);

  const avgEngagementRate = isAllAccounts
    ? +(socialAccounts.filter(a => a.isConnected).reduce((acc, a) => acc + a.engagementRate, 0) / (socialAccounts.filter(a => a.isConnected).length || 1)).toFixed(1)
    : selectedAccount?.engagementRate || 5.8;

  const totalFollowers = isAllAccounts
    ? socialAccounts.reduce((acc, a) => acc + (a.isConnected ? a.followers : 0), 0)
    : selectedAccount?.followers || 0;

  const growthPercent = isAllAccounts
    ? analytics.reachGrowthPercent
    : selectedAccount?.followersChange || 8.4;

  // Filter posts relevant to this account's platform
  const filteredPosts = isAllAccounts
    ? posts
    : posts.filter(p => {
        const pPlatforms = p.platforms || (p.platform ? [p.platform] : []);
        return pPlatforms.includes(selectedAccount?.platform as SocialPlatform);
      });

  const topPosts = filteredPosts
    .filter(p => p.metrics)
    .sort((a, b) => (b.metrics?.impressions || 0) - (a.metrics?.impressions || 0));

  const formatComparisonData = [
    { format: 'Reels (Video)', reach: isAllAccounts ? 245000 : Math.round(totalAudienceReach * 0.55), engagement: 6.8, fill: '#C8FF00' },
    { format: 'Carousels', reach: isAllAccounts ? 82000 : Math.round(totalAudienceReach * 0.25), engagement: 5.2, fill: '#FFFFFF' },
    { format: 'Single Image', reach: isAllAccounts ? 35000 : Math.round(totalAudienceReach * 0.15), engagement: 2.9, fill: '#9A9A9A' },
    { format: 'Text & Links', reach: isAllAccounts ? 12700 : Math.round(totalAudienceReach * 0.05), engagement: 1.8, fill: '#555555' },
  ];

  // Multi-account comparison data
  const accountComparisonData = socialAccounts
    .filter(a => a.isConnected)
    .map(a => ({
      name: a.handle,
      platform: a.platform,
      category: a.category || a.accountName,
      followers: a.followers,
      reach: a.reach,
      engagement: a.engagementRate,
      posts: a.postsCount || 30,
    }));

  const getPlatformBadge = (platform: SocialPlatform) => {
    switch (platform) {
      case 'instagram':
        return { name: 'Instagram', color: 'bg-white/10 text-white border border-white/20' };
      case 'linkedin':
        return { name: 'LinkedIn', color: 'bg-white/10 text-[#C8FF00] border border-[#C8FF00]/30' };
      case 'youtube':
        return { name: 'YouTube', color: 'bg-white/10 text-white border border-white/20' };
      case 'facebook':
        return { name: 'Facebook', color: 'bg-white/10 text-white border border-white/20' };
      case 'x':
        return { name: 'X', color: 'bg-white/10 text-white border border-white/20' };
      case 'tiktok':
        return { name: 'TikTok', color: 'bg-white/10 text-[#C8FF00] border border-[#C8FF00]/30' };
    }
  };

  return (
    <div id="analytics-view" className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto text-[#F5F5F0]">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span className="font-mono-tag text-[10px] text-[#C8FF00] uppercase font-bold tracking-wider">
            [ INTELLIGENCE METRICS ]
          </span>
          <div className="flex items-center space-x-3 mt-1">
            <h1 className="font-display text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              Performance Analytics
            </h1>
            {selectedAccount ? (
              <span className="px-2.5 py-0.5 rounded font-mono-tag text-[10px] font-bold bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/30">
                FILTERED: {selectedAccount.handle}
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded font-mono-tag text-[10px] font-bold bg-white/5 text-[#9A9A9A] border border-white/10">
                ALL CHANNELS
              </span>
            )}
          </div>
          <p className="font-mono-tag text-xs text-[#9A9A9A] mt-1">
            AUDIENCE RETENTION, VIRALITY RATIOS, AND MULTI-CHANNEL CONVERSION TELEMETRY.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Account Selector Pill Menu */}
          <div className="flex items-center space-x-1 bg-[#111111] p-1 rounded-lg border border-white/10 shadow-2xs">
            <button
              onClick={() => setSelectedAccountId('all')}
              className={`px-3 py-1.5 rounded font-mono-tag text-[10px] font-bold uppercase flex items-center space-x-1.5 transition-all ${
                isAllAccounts
                  ? 'bg-[#C8FF00] text-[#080808]'
                  : 'text-[#9A9A9A] hover:text-white'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>ALL ({socialAccounts.length})</span>
            </button>

            <select
              id="analytics-account-select"
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="px-2.5 py-1.5 rounded font-mono-tag text-[10px] font-bold uppercase bg-transparent text-white border-0 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#111111] text-white">SELECT SPECIFIC ACCOUNT...</option>
              {socialAccounts.map((acc) => (
                <option key={acc.id} value={acc.id} className="bg-[#111111] text-white">
                  {acc.handle} ({acc.platform.toUpperCase()} - {acc.category || acc.accountName})
                </option>
              ))}
            </select>
          </div>

          {/* Time range selector */}
          <div className="flex items-center bg-[#111111] p-1 rounded-lg border border-white/10 font-mono-tag text-[10px] font-bold text-[#9A9A9A]">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => {
              const isLocked = (range === '90d' || range === '1y') && !checkFeatureAccess('advanced_analytics');
              return (
                <button
                  key={range}
                  id={`time-range-${range}`}
                  onClick={() => handleTimeRangeChange(range)}
                  className={`px-2.5 py-1 rounded transition-all flex items-center space-x-1 ${
                    timeRange === range
                      ? 'bg-[#C8FF00] text-[#080808]'
                      : 'hover:text-white'
                  }`}
                >
                  <span>{range.toUpperCase()}</span>
                  {isLocked && <Lock className="w-2.5 h-2.5 text-amber-400 ml-0.5" />}
                </button>
              );
            })}
          </div>

          <button
            id="analytics-export-btn"
            onClick={handleExport}
            className="px-3.5 py-2 rounded-lg border border-white/10 bg-[#111111] hover:bg-white/5 font-mono-tag text-[10px] font-bold text-white transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#C8FF00]" />
            <span className="hidden sm:inline">EXPORT REPORT →</span>
            {!checkFeatureAccess('custom_analytics_export') && <Crown className="w-3 h-3 text-amber-400 ml-0.5" />}
          </button>
        </div>
      </div>

      {/* Selected Account Profile Banner */}
      {selectedAccount && (
        <div className="p-5 rounded-2xl bg-[#151515] border border-white/10 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={selectedAccount.avatar}
              alt={selectedAccount.handle}
              className="w-14 h-14 rounded-xl object-cover ring-1 ring-white/20 shrink-0"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-display text-lg font-black uppercase">{selectedAccount.accountName}</h2>
                <span className="px-2 py-0.5 rounded font-mono-tag text-[9px] font-bold bg-[#C8FF00] text-[#080808] uppercase">
                  {selectedAccount.platform}
                </span>
                {selectedAccount.category && (
                  <span className="px-2 py-0.5 rounded font-mono-tag text-[9px] font-bold bg-white/10 text-white">
                    {selectedAccount.category}
                  </span>
                )}
              </div>
              <p className="font-mono-tag text-xs text-[#C8FF00] mt-0.5">{selectedAccount.handle}</p>
              <p className="font-mono-tag text-[10px] text-[#707070] mt-1">
                LAST SYNCED: {selectedAccount.lastSynced} • STATUS: ACTIVE BROADCAST
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => syncAccount(selectedAccount.id)}
              className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-mono-tag text-[10px] font-bold flex items-center space-x-1.5 transition-colors border border-white/10"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#C8FF00]" />
              <span>SYNC METRICS</span>
            </button>
            <button
              onClick={() => setSelectedAccountId('all')}
              className="px-3.5 py-2 rounded-lg bg-[#C8FF00] hover:bg-[#D4FF35] text-[#080808] font-mono-tag text-[10px] font-bold transition-colors"
            >
              ALL CHANNELS →
            </button>
          </div>
        </div>
      )}

      {/* Analytics Tabs */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg font-mono-tag text-xs font-bold uppercase transition-all ${
            activeTab === 'overview'
              ? 'bg-[#C8FF00] text-[#080808]'
              : 'text-[#9A9A9A] hover:bg-white/5 hover:text-white'
          }`}
        >
          {selectedAccount ? `${selectedAccount.handle} DEEP DIVE` : 'WORKSPACE OVERVIEW'}
        </button>

        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-4 py-2 rounded-lg font-mono-tag text-xs font-bold uppercase transition-all flex items-center space-x-1.5 ${
            activeTab === 'comparison'
              ? 'bg-[#C8FF00] text-[#080808]'
              : 'text-[#9A9A9A] hover:bg-white/5 hover:text-white'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>MULTI-ACCOUNT MATRIX ({socialAccounts.length})</span>
        </button>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#111111] border border-white/10">
              <span className="font-mono-tag text-[10px] text-[#707070] uppercase font-bold">TOTAL AUDIENCE REACH</span>
              <div className="flex items-baseline space-x-2 my-2">
                <span className="font-display text-3xl sm:text-4xl font-black text-white">
                  {(totalAudienceReach / 1000).toFixed(1)}K
                </span>
                <span className="font-mono-tag text-[10px] font-bold text-[#C8FF00] bg-[#C8FF00]/10 px-2 py-0.5 rounded">
                  +{growthPercent}%
                </span>
              </div>
              <p className="font-mono-tag text-[10px] text-[#707070]">
                {isAllAccounts ? 'Combined across all active channels' : `Unique viewers for ${selectedAccount?.handle}`}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111111] border border-white/10">
              <span className="font-mono-tag text-[10px] text-[#707070] uppercase font-bold">TOTAL IMPRESSIONS</span>
              <div className="flex items-baseline space-x-2 my-2">
                <span className="font-display text-3xl sm:text-4xl font-black text-white">
                  {(totalImpressions / 1000).toFixed(1)}K
                </span>
                <span className="font-mono-tag text-[10px] font-bold text-[#C8FF00] bg-[#C8FF00]/10 px-2 py-0.5 rounded">
                  +18.9%
                </span>
              </div>
              <p className="font-mono-tag text-[10px] text-[#707070]">Average 1.5 impressions/user</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111111] border border-white/10">
              <span className="font-mono-tag text-[10px] text-[#707070] uppercase font-bold">AVERAGE ENGAGEMENT</span>
              <div className="flex items-baseline space-x-2 my-2">
                <span className="font-display text-3xl sm:text-4xl font-black text-[#C8FF00]">
                  {avgEngagementRate}%
                </span>
                <span className="font-mono-tag text-[10px] font-bold text-[#C8FF00] bg-[#C8FF00]/10 px-2 py-0.5 rounded">
                  +1.2%
                </span>
              </div>
              <p className="font-mono-tag text-[10px] text-[#707070]">Top 10% benchmark across social index</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111111] border border-white/10">
              <span className="font-mono-tag text-[10px] text-[#707070] uppercase font-bold">AUDIENCE SUBSCRIBERS</span>
              <div className="flex items-baseline space-x-2 my-2">
                <span className="font-display text-3xl sm:text-4xl font-black text-white">
                  {(totalFollowers / 1000).toFixed(1)}K
                </span>
                <span className="font-mono-tag text-[10px] font-bold text-white bg-white/10 px-2 py-0.5 rounded">
                  LIVE
                </span>
              </div>
              <p className="font-mono-tag text-[10px] text-[#C8FF00]">★ Peak audience engagement cycle</p>
            </div>
          </div>

          {/* Main Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Monthly Trend Area Chart */}
            <div className="lg:col-span-8 p-6 rounded-2xl bg-[#111111] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono-tag text-[10px] text-[#C8FF00] uppercase font-bold">[ TRAJECTORY ]</span>
                  <h3 className="font-display text-lg font-bold text-white uppercase">Audience Growth & Reach Trend</h3>
                  <p className="font-mono-tag text-xs text-[#707070]">
                    {selectedAccount ? `Reach trajectory for ${selectedAccount.handle}` : 'Aggregated monthly reach breakdown'}
                  </p>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.growthHistory}>
                    <defs>
                      <linearGradient id="reachColorBrivon" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C8FF00" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#C8FF00" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="imprColorBrivon" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.05} stroke="#FFFFFF" />
                    <XAxis dataKey="month" stroke="#707070" fontSize={10} tickLine={false} />
                    <YAxis stroke="#707070" fontSize={10} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                    <Tooltip contentStyle={{ borderRadius: '8px', background: '#111111', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '11px', fontFamily: 'Space Grotesk' }} />
                    <Area type="monotone" dataKey="reach" stroke="#C8FF00" strokeWidth={2.5} fillOpacity={1} fill="url(#reachColorBrivon)" name="Unique Reach" />
                    <Area type="monotone" dataKey="impressions" stroke="#FFFFFF" strokeWidth={1.5} strokeDasharray="4 4" fillOpacity={1} fill="url(#imprColorBrivon)" name="Impressions" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Content Format Reach Comparison */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-[#111111] border border-white/10 space-y-4">
              <div>
                <span className="font-mono-tag text-[10px] text-[#C8FF00] uppercase font-bold">[ FORMAT VIRALITY ]</span>
                <h3 className="font-display text-lg font-bold text-white uppercase">Format ROI & Distribution</h3>
                <p className="font-mono-tag text-xs text-[#707070]">Reels vs Carousels vs Single Image</p>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={formatComparisonData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.05} horizontal={false} stroke="#FFFFFF" />
                    <XAxis type="number" stroke="#707070" fontSize={9} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                    <YAxis dataKey="format" type="category" stroke="#9A9A9A" fontSize={10} tickLine={false} width={90} />
                    <Tooltip contentStyle={{ borderRadius: '8px', background: '#111111', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '11px' }} />
                    <Bar dataKey="reach" radius={[0, 4, 4, 0]}>
                      {formatComparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top Posts Performance Table */}
          <div className="p-6 rounded-2xl bg-[#111111] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono-tag text-[10px] text-[#C8FF00] uppercase font-bold">[ VIRAL CONTENT RANKINGS ]</span>
                <h3 className="font-display text-lg font-bold text-white uppercase">Top Performing Creative</h3>
                <p className="font-mono-tag text-xs text-[#707070]">Ranked by reach, saves, and algorithmic velocity</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 font-mono-tag text-[#707070] font-bold uppercase text-[9px]">
                    <th className="pb-3 px-2">POST TITLE / CREATIVE</th>
                    <th className="pb-3 px-2">CHANNELS</th>
                    <th className="pb-3 px-2">REACH</th>
                    <th className="pb-3 px-2">LIKES</th>
                    <th className="pb-3 px-2">COMMENTS</th>
                    <th className="pb-3 px-2">SAVES</th>
                    <th className="pb-3 px-2 text-right">VELOCITY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {topPosts.slice(0, 5).map((p) => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-2 max-w-xs truncate">
                        <span className="font-bold text-white block truncate">{p.title}</span>
                        <span className="font-mono-tag text-[10px] text-[#707070] truncate block">{p.caption}</span>
                      </td>
                      <td className="py-3.5 px-2">
                        <div className="flex space-x-1">
                          {(p.platforms || [p.platform || 'instagram']).map((plt, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded font-mono-tag text-[9px] font-bold bg-white/5 border border-white/10 text-white uppercase">
                              {plt}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-2 font-mono-tag font-bold text-white">
                        {(p.metrics?.reach || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-2 font-mono-tag text-[#9A9A9A]">
                        {(p.metrics?.likes || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-2 font-mono-tag text-[#9A9A9A]">
                        {p.metrics?.comments || 0}
                      </td>
                      <td className="py-3.5 px-2 font-mono-tag text-[#9A9A9A]">
                        {p.metrics?.saves || 0}
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <span className="px-2 py-0.5 rounded font-mono-tag text-[9px] font-bold bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/30">
                          {p.metrics?.reach ? ((p.metrics.reach / 10000).toFixed(1) + 'X') : '1.2X'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Multi-Account Comparative Matrix */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 p-6 rounded-2xl bg-[#111111] border border-white/10 space-y-4">
              <div>
                <span className="font-mono-tag text-[10px] text-[#C8FF00] uppercase font-bold">[ BENCHMARK COMPARISON ]</span>
                <h3 className="font-display text-lg font-bold text-white uppercase">Comparative Channel Reach</h3>
                <p className="font-mono-tag text-xs text-[#707070]">Comparing reach and followers across multiple profiles</p>
              </div>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={accountComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.05} stroke="#FFFFFF" />
                    <XAxis dataKey="name" stroke="#707070" fontSize={9} tickLine={false} />
                    <YAxis stroke="#707070" fontSize={10} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                    <Tooltip contentStyle={{ borderRadius: '8px', background: '#111111', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '11px' }} />
                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px', fontFamily: 'Space Grotesk' }} />
                    <Bar dataKey="reach" fill="#C8FF00" name="Monthly Reach" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="followers" fill="#FFFFFF" name="Total Followers" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-2xl bg-[#111111] border border-white/10 space-y-4">
              <div>
                <span className="font-mono-tag text-[10px] text-[#C8FF00] uppercase font-bold">[ ENGAGEMENT INDEX ]</span>
                <h3 className="font-display text-lg font-bold text-white uppercase">Engagement Rates</h3>
                <p className="font-mono-tag text-xs text-[#707070]">Interaction % per active channel</p>
              </div>

              <div className="space-y-3 pt-2">
                {accountComparisonData.map((acc, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs text-white">{acc.name}</p>
                      <p className="font-mono-tag text-[9px] text-[#707070]">{acc.category}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-base font-bold text-[#C8FF00]">{acc.engagement}%</span>
                      <p className="font-mono-tag text-[8px] text-[#C8FF00] font-bold">TOP QUARTILE</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Account Comparison Matrix Table */}
          <div className="p-6 rounded-2xl bg-[#111111] border border-white/10 space-y-4">
            <span className="font-mono-tag text-[10px] text-[#C8FF00] uppercase font-bold">[ MATRIX ]</span>
            <h3 className="font-display text-lg font-bold text-white uppercase">Full Channel Benchmark Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 font-mono-tag text-[#707070] font-bold uppercase text-[9px]">
                    <th className="pb-3 px-3">HANDLE & CHANNEL</th>
                    <th className="pb-3 px-3">PLATFORM</th>
                    <th className="pb-3 px-3">CATEGORY</th>
                    <th className="pb-3 px-3">FOLLOWERS</th>
                    <th className="pb-3 px-3">REACH</th>
                    <th className="pb-3 px-3">ENGAGEMENT</th>
                    <th className="pb-3 px-3">POSTS</th>
                    <th className="pb-3 px-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {socialAccounts.map((acc) => {
                    const badge = getPlatformBadge(acc.platform);
                    return (
                      <tr key={acc.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-3 flex items-center space-x-2.5">
                          <img src={acc.avatar} alt={acc.handle} className="w-7 h-7 rounded-lg object-cover ring-1 ring-white/10" />
                          <div>
                            <span className="font-bold text-white">{acc.handle}</span>
                            <span className="font-mono-tag text-[9px] text-[#707070] block">{acc.accountName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded font-mono-tag text-[9px] font-bold uppercase ${badge.color}`}>
                            {badge.name}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono-tag text-[10px] text-[#9A9A9A]">
                          {acc.category || 'General'}
                        </td>
                        <td className="py-3 px-3 font-mono-tag font-bold text-white">
                          {(acc.followers / 1000).toFixed(1)}k
                        </td>
                        <td className="py-3 px-3 font-mono-tag font-bold text-[#C8FF00]">
                          {(acc.reach / 1000).toFixed(1)}k
                        </td>
                        <td className="py-3 px-3 font-mono-tag font-bold text-white">
                          {acc.engagementRate}%
                        </td>
                        <td className="py-3 px-3 font-mono-tag text-[#9A9A9A]">
                          {acc.postsCount || 40}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedAccountId(acc.id);
                              setActiveTab('overview');
                            }}
                            className="px-2.5 py-1 rounded bg-[#C8FF00] text-[#080808] font-mono-tag text-[10px] font-bold hover:bg-[#D4FF35]"
                          >
                            INSPECT →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
