import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Post, PostStatus } from '../../types';
import { 
  CheckSquare, 
  CheckCircle2, 
  RotateCcw, 
  XCircle, 
  Calendar, 
  Clock, 
  Eye, 
  Search, 
  Filter, 
  Sparkles, 
  Layers, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Facebook, 
  Youtube, 
  Share2,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';
import { ClientContentReviewModal } from './ClientContentReviewModal';

const STATUS_TABS: { id: string; label: string; countKey?: PostStatus }[] = [
  { id: 'all', label: 'All Content' },
  { id: 'pending_review', label: 'Needs Your Review' },
  { id: 'changes_requested', label: 'In Revision' },
  { id: 'approved', label: 'Approved & Scheduled' },
  { id: 'published', label: 'Published' },
];

export const ClientApprovalsView: React.FC = () => {
  const { 
    posts, 
    approvePost, 
    activeClient, 
    reviewModalPostId, 
    setReviewModalPostId 
  } = useApp();

  const [selectedStatusTab, setSelectedStatusTab] = useState('pending_review');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeReviewModalPostId, setActiveReviewModalPostId] = useState<string | null>(null);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.platform.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedStatusTab === 'all') return matchesSearch;
    if (selectedStatusTab === 'pending_review') return matchesSearch && post.status === 'pending_review';
    if (selectedStatusTab === 'changes_requested') return matchesSearch && post.status === 'changes_requested';
    if (selectedStatusTab === 'approved') return matchesSearch && (post.status === 'approved' || post.status === 'scheduled');
    if (selectedStatusTab === 'published') return matchesSearch && post.status === 'published';
    return matchesSearch;
  });

  const pendingCount = posts.filter(p => p.status === 'pending_review').length;
  const inRevisionCount = posts.filter(p => p.status === 'changes_requested').length;
  const approvedCount = posts.filter(p => p.status === 'approved' || p.status === 'scheduled').length;

  const handleBulkApproveAll = () => {
    const pending = posts.filter(p => p.status === 'pending_review');
    if (window.confirm(`Approve all ${pending.length} pending posts for auto-publishing?`)) {
      pending.forEach(p => approvePost(p.id));
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Content Approvals & Sign-off
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              {pendingCount} Pending Review
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Inspect creative copies, hashtags, media assets, and approve scheduled broadcasts for {activeClient?.name || 'your brand'}.
          </p>
        </div>

        {pendingCount > 1 && (
          <button
            onClick={handleBulkApproveAll}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve All {pendingCount} Pending Posts</span>
          </button>
        )}
      </div>

      {/* Status Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          {STATUS_TABS.map((tab) => {
            const isActive = selectedStatusTab === tab.id;
            let count = 0;
            if (tab.id === 'pending_review') count = pendingCount;
            if (tab.id === 'changes_requested') count = inRevisionCount;
            if (tab.id === 'approved') count = approvedCount;

            return (
              <button
                key={tab.id}
                onClick={() => setSelectedStatusTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center space-x-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, caption, platform..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>
      </div>

      {/* Posts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPosts.map((post) => {
          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all overflow-hidden"
            >
              <div>
                {/* Visual Media Header */}
                {post.mediaUrl ? (
                  <div className="h-44 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                    <img 
                      src={post.mediaUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-2 left-2 flex items-center space-x-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs capitalize">
                        {post.platform}
                      </span>
                      {post.campaignName && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-600/90 text-white backdrop-blur-xs">
                          {post.campaignName}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-20 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-600 capitalize">{post.platform} Broadcast</span>
                  </div>
                )}

                {/* Content Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.scheduledDate} • {post.scheduledTime}
                    </span>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      post.status === 'pending_review' 
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        : post.status === 'changes_requested'
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {post.status.replace('_', ' ').toUpperCase()}
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
                    <div className="flex flex-wrap gap-1 pt-1">
                      {post.hashtags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                          #{tag.replace('#', '')}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Revision notes if any */}
                  {post.rejectionReason && (
                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-[11px] text-amber-800 dark:text-amber-300">
                      <span className="font-bold block">Revision Request:</span>
                      "{post.rejectionReason}"
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800/80 pt-3 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveReviewModalPostId(post.id)}
                  className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect & Approve</span>
                </button>

                {post.status === 'pending_review' && (
                  <button
                    onClick={() => approvePost(post.id)}
                    title="Quick 1-Click Sign-Off"
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
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">All Caught Up</h3>
          <p className="text-xs text-slate-400 mt-1">No posts found for the selected filter.</p>
        </div>
      )}

      {/* Review Modal */}
      <ClientContentReviewModal
        postId={activeReviewModalPostId}
        onClose={() => setActiveReviewModalPostId(null)}
      />
    </div>
  );
};
