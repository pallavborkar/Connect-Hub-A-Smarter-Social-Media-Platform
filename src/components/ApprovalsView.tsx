import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { usePermissions } from '../hooks/usePermissions';
import { 
  CheckSquare, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  MessageSquare, 
  Send, 
  Eye, 
  Clock, 
  X, 
  FileText,
  Sparkles,
  ShieldCheck,
  Lock,
  ArrowRight,
  Info
} from 'lucide-react';
import { Post, PostStatus } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export const ApprovalsView: React.FC = () => {
  const { 
    posts, 
    approvePost, 
    rejectPost, 
    requestPostChanges, 
    user, 
    showToast, 
    formatDate,
    formatDateTime
  } = useApp();

  const { can, isOwner, isManager, currentRole, roleConfig } = usePermissions();

  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'changes' | 'all'>('pending');
  const [reviewingPost, setReviewingPost] = useState<Post | null>(null);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const canApprove = can('approvals.approve') || isOwner || isManager;
  const canReject = can('approvals.request_changes') || isOwner || isManager;

  const pendingPosts = posts.filter(p => p.status === 'pending_review');
  const approvedPosts = posts.filter(p => p.status === 'approved' || p.status === 'scheduled' || p.status === 'published');
  const changesPosts = posts.filter(p => p.status === 'changes_requested');

  const filteredPosts = 
    activeTab === 'pending' ? pendingPosts :
    activeTab === 'approved' ? approvedPosts :
    activeTab === 'changes' ? changesPosts : posts;

  const handleApprove = (post: Post) => {
    if (!canApprove) {
      showToast('Permission Denied', 'Your role does not have permission to approve posts.', 'error');
      return;
    }
    approvePost(post.id, feedbackComment || 'Looks fantastic! Approved for scheduled publishing.');
    setReviewingPost(null);
    setFeedbackComment('');
  };

  const handleRequestChanges = (post: Post) => {
    if (!canApprove) {
      showToast('Permission Denied', 'Your role does not have permission to request post changes.', 'error');
      return;
    }
    if (!feedbackComment.trim()) {
      showToast('Feedback Required', 'Please explain what needs to be changed.', 'warning');
      return;
    }
    requestPostChanges(post.id, feedbackComment);
    setReviewingPost(null);
    setFeedbackComment('');
  };

  const handleReject = () => {
    if (!canReject) {
      showToast('Permission Denied', 'Your role does not have permission to reject posts.', 'error');
      return;
    }
    if (!reviewingPost) return;
    if (!rejectReason.trim()) {
      showToast('Reason Required', 'Please enter a reason for rejection.', 'warning');
      return;
    }
    rejectPost(reviewingPost.id, rejectReason);
    setIsRejectModalOpen(false);
    setReviewingPost(null);
    setRejectReason('');
  };

  return (
    <div id="approvals-view" className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-mono-tag text-[10px] text-[#C8FF00] bg-[#C8FF00]/10 px-2 py-0.5 rounded border border-[#C8FF00]/20">QUALITY ASSURANCE</span>
            <span className="text-xs text-[#9A9A9A] font-mono">REVIEW PIPELINE</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-[#F5F5F0] tracking-tight">
            Content Approval Workflow
          </h1>
          <p className="text-xs sm:text-sm text-[#9A9A9A] mt-1 max-w-2xl">
            Ensure on-brand copy, verified media assets, and legal compliance before going live.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-mono-tag text-xs px-3 py-1.5 rounded-xl bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/20 font-bold">
            {pendingPosts.length} PENDING
          </span>
          <span className="font-mono-tag text-xs px-3 py-1.5 rounded-xl bg-[#111111] text-[#9A9A9A] border border-white/10">
            ROLE: {roleConfig.name.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Role Clearance Notice if not approver */}
      {!canApprove && (
        <div className="p-4 rounded-2xl bg-[#111111] border border-amber-500/30 flex items-start space-x-3 text-xs text-amber-200">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase font-mono-tag text-[10px]">INSPECTION MODE ACTIVE</span>
            <p className="text-[11px] text-[#9A9A9A] mt-0.5 leading-relaxed">
              You are currently viewing submissions as a <strong className="text-white">{roleConfig.name}</strong>. Inspection and commenting are enabled; final approval authorization is reserved for Managers and Owners.
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-3 overflow-x-auto">
        {[
          { id: 'pending', label: `Pending Review (${pendingPosts.length})` },
          { id: 'changes', label: `Changes Requested (${changesPosts.length})` },
          { id: 'approved', label: `Approved & Ready (${approvedPosts.length})` },
          { id: 'all', label: `All Posts (${posts.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#C8FF00] text-[#080808]'
                : 'text-[#9A9A9A] hover:text-white bg-[#111111] border border-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Approvals List Grid */}
      {filteredPosts.length === 0 ? (
        <div className="p-12 rounded-2xl card-brivon text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#151515] border border-white/10 text-[#C8FF00] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-display font-bold text-[#F5F5F0]">Review queue is clear</h3>
          <p className="text-xs font-mono text-[#707070]">All submitted assets have been reviewed and routed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="p-5 rounded-2xl card-brivon flex flex-col justify-between"
            >
              <div>
                {/* Media preview */}
                {post.mediaUrl && (
                  <img
                    src={post.mediaUrl}
                    alt={post.title}
                    className="w-full h-40 rounded-xl object-cover border border-white/10 mb-4"
                  />
                )}

                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono-tag text-[9px] px-2 py-0.5 rounded bg-[#151515] text-[#9A9A9A] border border-white/10 uppercase">
                    {Array.isArray(post.platforms) ? post.platforms.join(', ') : ((post as any).platform || 'instagram')}
                  </span>
                  <span className={`font-mono-tag text-[9px] px-2 py-0.5 rounded border uppercase ${
                    post.status === 'approved' ? 'bg-[#C8FF00]/10 text-[#C8FF00] border-[#C8FF00]/30' :
                    post.status === 'pending_review' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                    post.status === 'changes_requested' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-white/5 text-[#9A9A9A] border-white/10'
                  }`}>
                    {post.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="font-display font-bold text-sm text-[#F5F5F0] line-clamp-1">{post.title}</h3>
                <p className="text-xs text-[#9A9A9A] mt-1 line-clamp-3 leading-relaxed">
                  {post.caption}
                </p>

                <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#707070]">
                  <span>By {post.authorName}</span>
                  <span>{formatDate(post.scheduledDate, 'datetime')}</span>
                </div>
              </div>

              {/* Review Actions */}
              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => setReviewingPost(post)}
                  className="w-full py-2.5 btn-lime text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5 text-[#080808]" />
                  <span>{canApprove ? 'Review & Decision' : 'Inspect Details'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      <AnimatePresence>
        {reviewingPost && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl card-brivon bg-[#111111] rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <CheckSquare className="w-5 h-5 text-[#C8FF00]" />
                  <h3 className="text-lg font-display font-extrabold text-white">Review Submission</h3>
                </div>
                <button onClick={() => setReviewingPost(null)} className="p-1.5 text-[#9A9A9A] hover:text-white rounded-lg bg-[#151515]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Media & Details */}
                <div>
                  {reviewingPost.mediaUrl && (
                    <img
                      src={reviewingPost.mediaUrl}
                      alt={reviewingPost.title}
                      className="w-full h-48 rounded-xl object-cover border border-white/10 mb-3"
                    />
                  )}
                  <h4 className="font-display font-bold text-sm text-[#F5F5F0]">{reviewingPost.title}</h4>
                  <div className="mt-2 text-[11px] font-mono text-[#9A9A9A] space-y-1">
                    <p>Platforms: <span className="font-bold text-[#F5F5F0]">{Array.isArray(reviewingPost.platforms) ? reviewingPost.platforms.join(', ') : ((reviewingPost as any).platform || 'instagram')}</span></p>
                    <p>Creator: <span className="font-bold text-[#F5F5F0]">{reviewingPost.authorName}</span></p>
                    <p>Schedule: <span className="font-bold text-[#F5F5F0]">{formatDate(reviewingPost.scheduledDate, 'full')}</span></p>
                  </div>
                </div>

                {/* Caption & Feedback */}
                <div className="space-y-3">
                  <label className="text-xs font-mono-tag text-[#9A9A9A]">CAPTION COPY</label>
                  <div className="p-3.5 rounded-xl bg-[#151515] text-xs whitespace-pre-line text-[#F5F5F0] max-h-48 overflow-y-auto leading-relaxed border border-white/5 font-mono">
                    {reviewingPost.caption}
                  </div>

                  {canApprove && (
                    <div>
                      <label className="text-xs font-mono-tag text-[#9A9A9A]">EDITORIAL FEEDBACK / INSTRUCTIONS</label>
                      <textarea
                        rows={2}
                        value={feedbackComment}
                        onChange={(e) => setFeedbackComment(e.target.value)}
                        placeholder="Add revision suggestions or approval notes..."
                        className="input-brivon w-full mt-1 p-2.5 rounded-xl text-xs resize-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                {canReject ? (
                  <button
                    onClick={() => setIsRejectModalOpen(true)}
                    className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                  >
                    Reject to Drafts
                  </button>
                ) : (
                  <div className="text-[11px] font-mono text-[#707070] italic">
                    Read-only Inspection Mode
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  {canApprove ? (
                    <>
                      <button
                        onClick={() => handleRequestChanges(reviewingPost)}
                        className="btn-secondary-dark px-4 py-2.5 text-xs font-bold cursor-pointer text-amber-400"
                      >
                        Request Changes
                      </button>
                      <button
                        id="confirm-approve-btn"
                        onClick={() => handleApprove(reviewingPost)}
                        className="btn-lime px-5 py-2.5 text-xs font-bold cursor-pointer"
                      >
                        Approve Post
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setReviewingPost(null)}
                      className="btn-secondary-dark px-5 py-2.5 text-xs font-bold"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reject Reason Modal */}
      <AnimatePresence>
        {isRejectModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md card-brivon bg-[#111111] rounded-2xl p-6 shadow-2xl border border-white/10 space-y-4"
            >
              <h3 className="text-base font-display font-bold text-white">Reason for Rejection</h3>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain what violates guidelines or needs restructuring..."
                className="input-brivon w-full p-3 rounded-xl text-xs"
              />
              <div className="flex items-center justify-end space-x-2">
                <button
                  onClick={() => setIsRejectModalOpen(false)}
                  className="btn-secondary-dark px-3 py-1.5 text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl"
                >
                  Confirm Reject
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
