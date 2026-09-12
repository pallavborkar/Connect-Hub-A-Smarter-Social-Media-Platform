import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CreditCard, 
  Sparkles, 
  Zap, 
  Check, 
  ArrowUpRight, 
  Download, 
  AlertTriangle, 
  RefreshCw, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Calendar,
  Share2,
  Users,
  Layers,
  ArrowRight,
  ExternalLink,
  Info,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SUBSCRIPTION_PLANS } from '../config/subscriptionPlans';
import { SubscriptionPlanId, BillingCycle, SubscriptionStatus } from '../types';

export const BillingSettingsTab: React.FC = () => {
  const { 
    subscription, 
    billingCycle, 
    setBillingCycle, 
    invoices, 
    openCheckoutModal, 
    openUpgradeModal,
    setActiveView,
    updateSubscriptionSandbox,
    cancelSubscription,
    resumeSubscription,
    showToast,
    triggerConfetti
  } = useApp();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<string | null>(null);

  const currentPlanConfig = SUBSCRIPTION_PLANS[subscription.planId];
  const isTrial = subscription.status === 'trial';
  const isCancelled = subscription.cancelAtPeriodEnd || subscription.status === 'cancelled';
  const isFree = subscription.planId === 'free';

  // Calculate usage percentages
  const aiLimit = currentPlanConfig.limits.aiGenerations;
  const aiUsed = subscription.usage.aiGenerationsUsed;
  const aiPct = Math.min(100, Math.round((aiUsed / aiLimit) * 100));

  const accountLimit = currentPlanConfig.limits.socialAccounts;
  const accountsCount = subscription.usage.socialAccountsCount;
  const accountsPct = Math.min(100, Math.round((accountsCount / accountLimit) * 100));

  const teamLimit = currentPlanConfig.limits.teamMembers;
  const teamCount = subscription.usage.teamMembersCount;
  const teamPct = Math.min(100, Math.round((teamCount / teamLimit) * 100));

  const isNearLimit = aiPct >= 75 || accountsPct >= 80 || teamPct >= 80;

  const handleDownloadInvoice = (invId: string, invNumber: string) => {
    setDownloadingInvoiceId(invId);
    setTimeout(() => {
      setDownloadingInvoiceId(null);
      showToast('Invoice Downloaded', `Saved receipt ${invNumber}.pdf to your downloads.`, 'success');
    }, 800);
  };

  const handleConfirmCancel = () => {
    cancelSubscription();
    setIsCancelModalOpen(false);
  };

  return (
    <div className="space-y-8 text-[#F5F5F0]">
      {/* Trial Alert Banner if in Trial */}
      {isTrial && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#141414] border border-[#C8FF00]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#C8FF00]/10 text-[#C8FF00] flex items-center justify-center shrink-0 border border-[#C8FF00]/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C8FF00]">
                  {subscription.trialDaysLeft || 7} Days Left in your {currentPlanConfig.name} Trial
                </span>
                <span className="w-2 h-2 rounded-full bg-[#C8FF00] animate-pulse" />
              </div>
              <p className="text-xs font-mono text-[#9A9A9A] mt-0.5">
                Enjoy full {currentPlanConfig.name} capabilities. No charge until trial ends on {subscription.currentPeriodEnd}.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => openCheckoutModal(subscription.planId, 'yearly')}
              className="btn-lime px-4 py-2 text-xs font-bold transition-all cursor-pointer"
            >
              Continue with {currentPlanConfig.name}
            </button>
            <button
              onClick={() => setActiveView('pricing')}
              className="btn-secondary-dark px-3 py-2 text-xs font-bold cursor-pointer"
            >
              Change Plan
            </button>
          </div>
        </div>
      )}

      {/* Cancellation Notice Banner if Cancelled */}
      {isCancelled && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <h4 className="text-xs font-bold text-rose-200">
                Subscription Scheduled for Cancellation
              </h4>
              <p className="text-xs font-mono text-rose-300/80 mt-0.5">
                Your plan features will remain active until <strong>{subscription.currentPeriodEnd}</strong>, after which your account will revert to the Free tier.
              </p>
            </div>
          </div>
          <button
            onClick={resumeSubscription}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold font-mono transition-all shrink-0 cursor-pointer"
          >
            Resume Subscription
          </button>
        </div>
      )}

      {/* Current Plan Overview Card */}
      <div className="p-6 sm:p-8 rounded-2xl card-brivon border-white/10 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-mono-tag text-[10px] text-[#707070]">
                CURRENT PLAN
              </span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-mono-tag font-bold uppercase ${
                isTrial
                  ? 'bg-[#C8FF00]/20 text-[#C8FF00] border border-[#C8FF00]/40'
                  : subscription.status === 'active'
                  ? 'bg-[#C8FF00] text-[#080808]'
                  : 'bg-white/10 text-white'
              }`}>
                {subscription.status.toUpperCase()}
              </span>
            </div>

            <div className="flex items-baseline space-x-3">
              <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white">
                {currentPlanConfig.name}
              </h2>
              <span className="text-xl sm:text-2xl font-mono font-bold text-[#C8FF00]">
                {subscription.billingCycle === 'yearly' && currentPlanConfig.yearlyPrice > 0 ? currentPlanConfig.yearlyPrice : currentPlanConfig.monthlyPrice}
                <span className="text-xs text-[#9A9A9A] font-normal">/{subscription.billingCycle === 'yearly' ? 'year' : 'month'}</span>
              </span>
            </div>

            <p className="text-xs font-mono text-[#9A9A9A] max-w-xl">
              {currentPlanConfig.tagline}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-[#707070]">
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C8FF00]" />
                <span>Next billing date: <strong className="text-white">{subscription.currentPeriodEnd}</strong></span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#C8FF00]" />
                <span>
                  {subscription.paymentDetails.methodType === 'upi' ? `UPI: ${subscription.paymentDetails.upiId}` : `${subscription.paymentDetails.cardBrand} •••• ${subscription.paymentDetails.cardLast4}`}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0">
            <button
              id="billing-upgrade-btn"
              onClick={() => setActiveView('pricing')}
              className="btn-lime px-5 py-3 text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-[#C8FF00]/10"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#080808]" />
              <span>{isFree ? 'Upgrade to Paid Plan' : 'Change / Upgrade Plan'}</span>
            </button>

            {!isFree && !isCancelled && (
              <button
                id="billing-cancel-btn"
                onClick={() => setIsCancelModalOpen(true)}
                className="btn-secondary-dark px-4 py-2.5 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-[#9A9A9A] hover:text-rose-400"
              >
                <span>Cancel Subscription</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Plan Usage Section */}
      <div className="p-6 sm:p-8 rounded-2xl card-brivon space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-base font-display font-bold text-white flex items-center space-x-2">
              <Zap className="w-4 h-4 text-[#C8FF00]" />
              <span>Plan Usage & Limits</span>
            </h3>
            <p className="text-xs font-mono text-[#707070] mt-0.5">
              Live consumption against your monthly tier quotas. Resets on {subscription.currentPeriodEnd}.
            </p>
          </div>

          {isNearLimit && (
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/30 flex items-center space-x-1 self-start sm:self-auto">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Almost at monthly limit</span>
            </span>
          )}
        </div>

        {/* Usage Progress Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* AI Generations */}
          <div className="p-4 rounded-xl bg-[#0D0D0D] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C8FF00]" />
                <span>AI Quota</span>
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {aiUsed} / {aiLimit}
              </span>
            </div>

            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[#C8FF00]"
                style={{ width: `${aiPct}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono text-[#707070]">
              <span>{aiLimit - aiUsed} credits free</span>
              <span>{aiPct}%</span>
            </div>
          </div>

          {/* Social Accounts */}
          <div className="p-4 rounded-xl bg-[#0D0D0D] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white flex items-center space-x-1.5">
                <Share2 className="w-3.5 h-3.5 text-[#C8FF00]" />
                <span>Accounts</span>
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {accountsCount} / {accountLimit}
              </span>
            </div>

            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[#C8FF00]"
                style={{ width: `${accountsPct}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono text-[#707070]">
              <span>{accountLimit - accountsCount} slots free</span>
              <span>{accountsPct}%</span>
            </div>
          </div>

          {/* Team Members */}
          <div className="p-4 rounded-xl bg-[#0D0D0D] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-[#C8FF00]" />
                <span>Crew Seats</span>
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {teamCount} / {teamLimit}
              </span>
            </div>

            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[#C8FF00]"
                style={{ width: `${teamPct}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono text-[#707070]">
              <span>{teamLimit - teamCount} seats open</span>
              <span>{teamPct}%</span>
            </div>
          </div>

          {/* Scheduled Posts */}
          <div className="p-4 rounded-xl bg-[#0D0D0D] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C8FF00]" />
                <span>Scheduling</span>
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {currentPlanConfig.limits.scheduledPosts === 'unlimited' ? 'Unlimited' : `${subscription.usage.scheduledPostsCount} / 10`}
              </span>
            </div>

            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[#C8FF00]"
                style={{ width: currentPlanConfig.limits.scheduledPosts === 'unlimited' ? '100%' : `${(subscription.usage.scheduledPostsCount / 10) * 100}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono text-[#707070]">
              <span>{currentPlanConfig.limits.scheduledPosts === 'unlimited' ? 'Unlimited queue' : '10/mo'}</span>
              <span>Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Card */}
      <div className="p-6 rounded-2xl card-brivon space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-[#C8FF00]" />
            <h3 className="text-sm font-display font-bold text-white">Payment Method</h3>
          </div>
          <button
            onClick={() => openCheckoutModal(subscription.planId, subscription.billingCycle)}
            className="text-xs font-mono text-[#C8FF00] hover:underline cursor-pointer"
          >
            Update Payment Method
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#0D0D0D] border border-white/5 gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono font-bold text-[11px] text-white">
              {subscription.paymentDetails.methodType === 'upi' ? 'UPI' : subscription.paymentDetails.cardBrand}
            </div>
            <div>
              <p className="text-xs font-mono font-bold text-white">
                {subscription.paymentDetails.methodType === 'upi' 
                  ? `UPI ID: ${subscription.paymentDetails.upiId}` 
                  : `${subscription.paymentDetails.cardBrand} ending in •••• ${subscription.paymentDetails.cardLast4}`}
              </p>
              <p className="text-[11px] font-mono text-[#707070]">
                {subscription.paymentDetails.methodType === 'upi' 
                  ? 'Auto-debit enabled via UPI Mandate' 
                  : `Expires ${subscription.paymentDetails.expiryMonth}/${subscription.paymentDetails.expiryYear}`}
              </p>
            </div>
          </div>

          <span className="px-2.5 py-0.5 rounded bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/30 text-[10px] font-mono font-bold flex items-center space-x-1 self-start sm:self-auto">
            <Check className="w-3 h-3" />
            <span>Primary Method</span>
          </span>
        </div>
      </div>

      {/* Invoices & Billing History Section */}
      <div className="p-6 rounded-2xl card-brivon space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-display font-bold text-white">
            Billing History & Invoices
          </h3>
          <span className="text-xs font-mono text-[#707070]">{invoices.length} invoices recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10 text-[#707070]">
                <th className="py-3 px-2">Invoice</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Plan</th>
                <th className="py-3 px-2">Amount</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-2 font-mono font-bold text-white">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-2 text-[#9A9A9A]">
                    {inv.date}
                  </td>
                  <td className="py-3.5 px-2 font-semibold text-white">
                    {inv.planName} ({inv.billingCycle})
                  </td>
                  <td className="py-3.5 px-2 font-black text-white">
                    {inv.amount}
                  </td>
                  <td className="py-3.5 px-2">
                    <span className="px-2 py-0.5 rounded bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/20 text-[10px] font-bold">
                      Paid
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-right">
                    <button
                      onClick={() => handleDownloadInvoice(inv.id, inv.invoiceNumber)}
                      disabled={downloadingInvoiceId === inv.id}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-[#707070] hover:text-[#C8FF00] transition-colors cursor-pointer"
                      title="Download PDF Invoice"
                    >
                      {downloadingInvoiceId === inv.id ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-[#C8FF00]" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Developer Sandbox Tier Switcher */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0E0E0E] border border-white/10 space-y-3">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-[#C8FF00]" />
          <h4 className="text-xs font-display font-bold text-white">
            Interactive Subscription Sandbox (Testing Simulator)
          </h4>
        </div>
        <p className="text-[11px] font-mono text-[#707070]">
          Instantly simulate different subscription tiers and trial states to preview how feature locks adapt across Socially.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {(['free', 'creator', 'team', 'pro'] as SubscriptionPlanId[]).map((planKey) => (
            <button
              key={planKey}
              onClick={() => {
                updateSubscriptionSandbox(planKey, 'active');
                showToast('Sandbox Updated', `Simulating active ${planKey.toUpperCase()} plan.`, 'info');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                subscription.planId === planKey && subscription.status === 'active'
                  ? 'bg-[#C8FF00] text-[#080808]'
                  : 'bg-[#151515] text-[#9A9A9A] border border-white/5 hover:text-white'
              }`}
            >
              {planKey.toUpperCase()} (Active)
            </button>
          ))}

          <button
            onClick={() => {
              updateSubscriptionSandbox('team', 'trial');
              showToast('Trial Mode Activated', 'Simulating 7-Day Team Trial.', 'info');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              subscription.status === 'trial'
                ? 'bg-[#C8FF00] text-[#080808]'
                : 'bg-[#151515] text-[#9A9A9A] border border-white/5 hover:text-white'
            }`}
          >
            TEAM (7-Day Trial)
          </button>
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      <AnimatePresence>
        {isCancelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCancelModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md p-6 bg-[#111111] rounded-2xl border border-white/10 shadow-2xl space-y-4 z-10"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-display font-black text-white">
                  Cancel {currentPlanConfig.name} Subscription?
                </h3>
                <p className="text-xs font-mono text-[#9A9A9A] mt-1 leading-relaxed">
                  You will continue to have access until the end of your current billing period on <strong>{subscription.currentPeriodEnd}</strong>. After that, your workspace will switch to the Free plan.
                </p>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={() => setIsCancelModalOpen(false)}
                  className="btn-secondary-dark px-4 py-2.5 text-xs font-bold cursor-pointer"
                >
                  Keep Subscription
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold font-mono transition-all cursor-pointer"
                >
                  Confirm Cancellation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
