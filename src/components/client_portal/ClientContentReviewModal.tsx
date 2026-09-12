import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Post, SocialPlatform } from '../../types';
import { 
  X, 
  Check, 
  RotateCcw, 
  XCircle, 
  Calendar, 
  Clock, 
  Sparkles, 
  MessageSquare, 
  Share2, 
  Send, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Facebook, 
  Youtube, 
  ShieldCheck,
  AlertCircle,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ClientContentReviewModalProps {
  postId: string | null;
  onClose: () => void;
}

const PLATFORM_ICONS: Record<string, any> = {
  instagram: Instagram,
  linkedin: Linkedin,
  x: Twitter,
  facebook: Facebook,
  youtube: Youtube,
  tiktok: Share2,
};

export const ClientContentReviewModal: React.FC<ClientContentReviewModalProps> = ({ postId, onClose }) => {
  const { 
    posts, 
    approvePost, 
    rejectPost, 
    requestPostChanges, 
    activeClient, 
    sendClientMessage,
    user 
  } = useApp();

  const [revisionNote, setRevisionNote] = useState('');
  const [showRevisionInput, setShowRevisionInput] = useState(false);
  const [activePlatformTab, setActivePlatformTab] = useState<SocialPlatform>('instagram');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const post = posts.find(p => p.id === postId);

  if (!post) return null;

  const targetPlatforms = post.targetPlatforms || [post.platform];
  const currentPlatform = targetPlatforms.includes(activePlatformTab) ? activePlatformTab : targetPlatforms[0];
  const PlatformIcon = PLATFORM_ICONS[currentPlatform] || Share2;

  const handleApprove = () => {
    setIsSubmitting(true);
    try {
      approvePost(post.id);
      sendClientMessage(
        `✅ Approved post: "${post.title}". Ready for auto-publishing on ${post.scheduledDate || 'scheduled date'}.`,
        undefined,
        undefined,
        undefined,
        post.id,
        post.title
      );
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionNote.trim()) return;

    setIsSubmitting(true);
    try {
      requestPostChanges(post.id, revisionNote.trim());
      sendClientMessage(
        `✍️ Revision requested on "${post.title}":\n"${revisionNote.trim()}"`,
        undefined,
        undefined,
        undefined,
        post.id,
        post.title
      );
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = () => {
    const reason = window.prompt('Please provide reason for declining this post draft:', 'Content does not align with current campaign objectives.');
    if (reason === null) return;

    setIsSubmitting(true);
    try {
      rejectPost(post.id, reason);
      sendClientMessage(
        `❌ Declined post: "${post.title}". Reason: ${reason}`,
        undefined,
        undefined,
        undefined,
        post.id,
        post.title
      );
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white truncate">
                  Content Approval Review
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  {post.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Created by {post.authorName} for {activeClient?.name || 'Client Brand'}
              </p>
            </div>
          </div>

          <button
            id="close-content-review-modal"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two Column (Left: Post Details & Multi-Platform Mockup, Right: Actions & Revision notes) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Realistic Platform Simulation */}
          <div className="md:col-span-7 space-y-4">
            {/* Platform Selector Tabs */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-400">Preview On:</span>
              <div className="flex items-center space-x-1.5 overflow-x-auto">
                {targetPlatforms.map((plat) => {
                  const Icon = PLATFORM_ICONS[plat] || Share2;
                  const isActive = currentPlatform === plat;
                  return (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => setActivePlatformTab(plat)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-purple-600 text-white shadow-xs' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="capitalize">{plat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Social Post Mock Card */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-sm space-y-3">
              {/* Account Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <img 
                    src={activeClient?.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'} 
                    alt="" 
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700" 
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      {activeClient?.name || 'Brand Official'}
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Scheduled for {post.scheduledDate} at {post.scheduledTime}
                    </p>
                  </div>
                </div>
                <PlatformIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>

              {/* Media Preview */}
              {post.mediaUrl && (
                <div className="rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 max-h-80 flex items-center justify-center border border-slate-100 dark:border-slate-800">
                  <img 
                    src={post.mediaUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}

              {/* Caption Text */}
              <div className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                {post.content}
              </div>

              {/* Hashtags */}
              {post.hashtags && post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {post.hashtags.map((tag, idx) => (
                    <span key={idx} className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                      #{tag.replace('#', '')}
                    </span>
                  ))}
                </div>
              )}

              {/* First Comment if any */}
              {post.firstComment && (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Pinned First Comment:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400">{post.firstComment}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Approval Controls, Scheduling & Revision Feedback */}
          <div className="md:col-span-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Timing info */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Proposed Date:
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{post.scheduledDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Optimal Time:
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{post.scheduledTime}</span>
                </div>
                {post.campaignName && (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400">Campaign:</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">{post.campaignName}</span>
                  </div>
                )}
              </div>

              {/* Revision Notes Section */}
              {showRevisionInput ? (
                <form onSubmit={handleRequestChanges} className="space-y-2 p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
                  <label className="block text-xs font-bold text-amber-900 dark:text-amber-300">
                    Specify Revisions Needed
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Please swap the hero photo with our new product shot and adjust the discount code to SAVE20..."
                    value={revisionNote}
                    onChange={(e) => setRevisionNote(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                  <div className="flex items-center justify-end space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowRevisionInput(false)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:underline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!revisionNote.trim() || isSubmitting}
                      className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Send Revision Request
                    </button>
                  </div>
                </form>
              ) : null}
            </div>

            {/* Approval Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                id="approve-and-schedule-btn"
                type="button"
                onClick={handleApprove}
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer hover:scale-[1.01]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Schedule For Auto-Publish</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShowRevisionInput(true)}
                  disabled={isSubmitting}
                  className="py-2.5 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800/60 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Request Edits</span>
                </button>

                <button
                  type="button"
                  onClick={handleReject}
                  disabled={isSubmitting}
                  className="py-2.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800/60 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Decline Draft</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
