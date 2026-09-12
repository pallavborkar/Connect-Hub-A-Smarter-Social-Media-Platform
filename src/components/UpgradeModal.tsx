import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  X, 
  Check, 
  ArrowRight, 
  Lock, 
  Zap, 
  ShieldCheck, 
  Users, 
  Share2, 
  Layers,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SUBSCRIPTION_PLANS } from '../config/subscriptionPlans';
import { SubscriptionPlanId } from '../types';

export const UpgradeModal: React.FC = () => {
  const { 
    upgradeModalState, 
    closeUpgradeModal, 
    openCheckoutModal, 
    setActiveView 
  } = useApp();

  if (!upgradeModalState.isOpen) return null;

  const targetPlanId: SubscriptionPlanId = upgradeModalState.targetPlan || 'team';
  const targetPlan = SUBSCRIPTION_PLANS[targetPlanId];

  const handleUpgradeClick = () => {
    closeUpgradeModal();
    openCheckoutModal(targetPlanId, 'monthly');
  };

  const handleViewAllPlans = () => {
    closeUpgradeModal();
    setActiveView('pricing');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeUpgradeModal}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 my-8"
      >
        {/* Top Gradient Banner */}
        <div className="p-6 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white relative">
          <button
            onClick={closeUpgradeModal}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-black tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Premium Feature Spotlight</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center space-x-2">
            <span>{upgradeModalState.featureName || 'AI Content Radar'}</span>
            <Lock className="w-4 h-4 text-purple-400" />
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            {upgradeModalState.description ||
              'Turn upcoming events, trending hashtags, and campus milestones into ready-to-publish content opportunities automatically.'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-purple-900 dark:text-purple-300 uppercase tracking-wider">
                Available on the {targetPlan.name} Plan
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                ₹{targetPlan.monthlyPrice}/month
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Upgrade your workspace today to unlock this feature and supercharge your social media workflow.
            </p>
          </div>

          {/* Target Plan Perks */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Everything you get with {targetPlan.name}:
            </span>
            <ul className="grid grid-cols-1 gap-2.5 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-center space-x-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>{targetPlan.limits.socialAccounts} Social Accounts</strong> (Multi-platform publishing)</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>{targetPlan.limits.teamMembers} Team Member Seats</strong> with Granular Roles</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>{targetPlan.limits.aiGenerations.toLocaleString()} AI Credits / month</strong></span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>AI Reel Scripts, Video Prompt Lab & Virality Analyzer</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Campaigns, Multi-Stage Approvals & Team Chat</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-2.5 pt-2">
            <button
              id="upgrade-modal-primary-btn"
              onClick={handleUpgradeClick}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-black text-xs sm:text-sm transition-all shadow-xl shadow-purple-600/25 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Upgrade to {targetPlan.name} (₹{targetPlan.monthlyPrice}/mo)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="upgrade-modal-view-plans-btn"
              onClick={handleViewAllPlans}
              className="w-full py-2.5 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
            >
              View All Plans & Feature Comparison
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
