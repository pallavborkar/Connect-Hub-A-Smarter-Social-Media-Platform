import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Post, SocialPlatform, ContentType, PostStatus } from '../../types';
import { 
  Layers, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Check, 
  RotateCcw, 
  Sparkles,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
  Share2,
  Image as ImageIcon,
  Film,
  Video,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';
import { ClientContentReviewModal } from './ClientContentReviewModal';

const STATUS_FILTERS: { id: string; label: string }[] = [
  { id: 'all', label: 'All Content' },
  { id: 'pending_review', label: 'Awaiting Approval' },
  { id: 'changes_requested', label: 'In Revision' },
  { id: 'approved', label: 'Approved' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'published', label: 'Published' },
];

const PLATFORM_ICONS: Record<string, any> = {
  instagram: Instagram,
  linkedin: Linkedin,
  x: Twitter,
  facebook: Facebook,
  youtube: Youtube,
  tiktok: Share2,
};

export const ClientContentView: React.FC = () => {
  const { posts, activeClient, approvePost } = useApp();

  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeReviewPostId, setActiveReviewPostId] = useState<string | null>(null);

  // Extract unique campaigns for filter
  const uniqueCampaigns = Array.from(
    new Set(posts.map(p => p.campaignName).filter(Boolean))
  ) as string[];

  const filteredPosts = posts.filter(post => {
    // Status filter
    if (selectedStatus === 'pending_review' && post.status !== 'pending_review') return false;
    if (selectedStatus === 'changes_requested' && post.status !== 'changes_requested') return false;
    if (selectedStatus === 'approved' && post.status !== 'approved') return false;
    if (selectedStatus === 'scheduled' && post.status !== 'scheduled') return false;
    if (selectedStatus === 'published' && post.status !== 'published') return false;

    // Platform filter
    if (selectedPlatform !== 'all' && post.platform !== selectedPlatform && !post.targetPlatforms?.includes(selectedPlatform as SocialPlatform)) {
      return false;
    }

    // Campaign filter
    if (selectedCampaign !== 'all' && post.campaignName !== selectedCampaign) {
      return false;
    }

    // Content type filter
    if (selectedType !== 'all' && post.contentType !== selectedType) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title?.toLowerCase().includes(q);
      const matchContent = post.content?.toLowerCase().includes(q);
      const matchTags = post.hashtags?.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchContent && !matchTags) return false;
    }

    return true;
  });

  const getStatusBadge = (status: PostStatus) => {
    switch (status) {
      case 'pending_review':
        return {
          label: 'Awaiting Approval',
          color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-500/20'
        };
      case 'changes_requested':
        return {
          label: 'Changes Requested',
          color: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-500/20'
        };
      case 'approved':
        return {
          label: 'Approved',
          color: 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border-teal-500/20'
        };
      case 'scheduled':
        return {
          label: 'Scheduled',
          color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-500/20'
        };
      case 'published':
        return {
          label: 'Published',
          color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
        };
      default:
        return {
          label: status.replace('_', ' '),
          color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
        };
    }
  };

  const getContentTypeIcon = (type?: ContentType) => {
    switch (type) {
      case 'reel':
      case 'video':
      case 'short':
        return Film;
      case 'carousel':
        return Layers;
      default:
        return ImageIcon;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Content Library
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              {activeClient?.name || 'Brand Official'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse all verified social creatives, reels, carousels, and copy scheduled for your brand.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
          <span>Total Creatives:</span>
          <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold">
            {posts.length}
          </span>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 p-1 bg-slate-100/70 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
        {STATUS_FILTERS.map(tab => {
          const isActive = selectedStatus === tab.id;
          let count = posts.length;
          if (tab.id === 'pending_review') count = posts.filter(p => p.status === 'pending_review').length;
          if (tab.id === 'changes_requested') count = posts.filter(p => p.status === 'changes_requested').length;
          if (tab.id === 'approved') count = posts.filter(p => p.status === 'approved').length;
          if (tab.id === 'scheduled') count = posts.filter(p => p.status === 'scheduled').length;
          if (tab.id === 'published') count = posts.filter(p => p.status === 'published').length;

          return (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center space-x-1.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isActive 
                  ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400' 
                  : 'bg-slate-200/70 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Secondary Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search title, copy, hashtag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        {/* Platform Filter */}
        <div>
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            aria-label="Filter by social platform"
            className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer"
          >
            <option value="all">All Platforms</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="x">X / Twitter</option>
            <option value="facebook">Facebook</option>
            <option value="youtube">YouTube</option>
          </select>
        </div>

        {/* Campaign Filter */}
        <div>
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            aria-label="Filter by campaign"
            className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer"
          >
            <option value="all">All Campaigns</option>
            {uniqueCampaigns.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Content Type Filter */}
        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            aria-label="Filter by content format"
            className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer"
          >
            <option value="all">All Formats</option>
            <option value="reel">Reel / Video</option>
            <option value="post">Single Image</option>
            <option value="carousel">Multi-Slide Carousel</option>
            <option value="story">Story</option>
          </select>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPosts.map((post) => {
          const PlatformIcon = PLATFORM_ICONS[post.platform] || Share2;
          const TypeIcon = getContentTypeIcon(post.contentType);
          const badge = getStatusBadge(post.status);

          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all overflow-hidden"
            >
              <div>
                {/* Media Container */}
                {post.mediaUrl ? (
                  <div className="h-44 bg-slate-100 dark:bg-slate-800 relative overflow-hidden group">
                    <img 
                      src={post.mediaUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs flex items-center gap-1 capitalize">
                        <PlatformIcon className="w-3 h-3" />
                        {post.platform}
                      </span>
                      {post.campaignName && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-600/90 text-white backdrop-blur-xs truncate max-w-[130px]">
                          {post.campaignName}
                        </span>
                      )}
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                      <span className="p-1 rounded-md bg-black/60 text-white backdrop-blur-xs flex items-center justify-center">
                        <TypeIcon className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-24 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-pink-500/10 p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <PlatformIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 capitalize">{post.platform} Post</span>
                    </div>
                    {post.campaignName && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                        {post.campaignName}
                      </span>
                    )}
                  </div>
                )}

                {/* Body Details */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.scheduledDate || 'TBD'} • {post.scheduledTime || '7:00 PM'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {post.content}
                  </p>

                  {/* Hashtags */}
                  {post.hashtags && post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {post.hashtags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                          #{tag.replace('#', '')}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Author metadata */}
                  <p className="text-[10px] text-slate-400 pt-1">
                    Drafted by {post.authorName || 'Agency Creative Lead'}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveReviewPostId(post.id)}
                  className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect & Review</span>
                </button>

                {post.status === 'pending_review' && (
                  <button
                    onClick={() => approvePost(post.id)}
                    title="1-Click Approve"
                    className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors border border-emerald-500/20 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredPosts.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <Layers className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">No content matching criteria</h3>
          <p className="text-xs text-slate-400">Try adjusting your filters or search query to see other creatives.</p>
        </div>
      )}

      {/* Content Review Modal */}
      <ClientContentReviewModal
        postId={activeReviewPostId}
        onClose={() => setActiveReviewPostId(null)}
      />
    </div>
  );
};
