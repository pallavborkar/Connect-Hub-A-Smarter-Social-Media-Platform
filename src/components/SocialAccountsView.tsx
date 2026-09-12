import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Share2, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  TrendingUp, 
  ExternalLink, 
  ShieldCheck, 
  Users,
  Lock,
  ArrowRight,
  AlertCircle,
  Layers,
  BarChart3,
  Trash2,
  Filter,
  Check
} from 'lucide-react';
import { SocialPlatform, SocialAccount } from '../types';
import { SUBSCRIPTION_PLANS } from '../config/subscriptionPlans';
import { motion, AnimatePresence } from 'motion/react';

export const SocialAccountsView: React.FC = () => {
  const { 
    socialAccounts, 
    toggleConnectAccount, 
    syncAccount, 
    addSocialAccount, 
    removeSocialAccount, 
    selectedAccountId, 
    setSelectedAccountId, 
    setActiveView, 
    showToast,
    subscription,
    openUpgradeModal 
  } = useApp();

  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [connectingPlatform, setConnectingPlatform] = useState<SocialPlatform | null>(null);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form for adding new account to a platform
  const [newPlatform, setNewPlatform] = useState<SocialPlatform>('instagram');
  const [newAccountName, setNewAccountName] = useState('');
  const [newHandle, setNewHandle] = useState('');
  const [newCategory, setNewCategory] = useState('Brand Hub');
  const [newFollowers, setNewFollowers] = useState('5000');

  const handleSyncAll = () => {
    setIsSyncingAll(true);
    setTimeout(() => {
      socialAccounts.forEach(acc => {
        if (acc.isConnected) syncAccount(acc.id);
      });
      setIsSyncingAll(false);
      showToast('All Accounts Synced', 'Live follower counts and engagement metrics refreshed across channels.', 'success');
    }, 1000);
  };

  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case 'instagram':
        return { name: 'Instagram', color: 'bg-white/10 text-white', icon: '📸' };
      case 'facebook':
        return { name: 'Facebook', color: 'bg-blue-600/20 text-blue-400 border border-blue-500/30', icon: '📘' };
      case 'linkedin':
        return { name: 'LinkedIn', color: 'bg-sky-600/20 text-sky-400 border border-sky-500/30', icon: '💼' };
      case 'youtube':
        return { name: 'YouTube', color: 'bg-rose-600/20 text-rose-400 border border-rose-500/30', icon: '▶️' };
      case 'x':
        return { name: 'X (Twitter)', color: 'bg-white/10 text-white border border-white/20', icon: '✖️' };
      case 'tiktok':
        return { name: 'TikTok', color: 'bg-[#C8FF00]/20 text-[#C8FF00] border border-[#C8FF00]/30', icon: '🎵' };
    }
  };

  const filteredAccounts = platformFilter === 'all' 
    ? socialAccounts 
    : socialAccounts.filter(a => a.platform === platformFilter);

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHandle.trim() || !newAccountName.trim()) {
      showToast('Missing details', 'Please enter account name and handle.', 'error');
      return;
    }

    const formattedHandle = newHandle.startsWith('@') || newPlatform === 'linkedin' || newPlatform === 'facebook'
      ? newHandle
      : `@${newHandle}`;

    addSocialAccount({
      platform: newPlatform,
      accountName: newAccountName,
      handle: formattedHandle,
      category: newCategory,
      avatar: `https://images.unsplash.com/photo-${1520000000000 + Math.floor(Math.random() * 500000000)}?w=150&auto=format&fit=crop&q=80`,
      followers: parseInt(newFollowers, 10) || 1200,
      followersChange: +(Math.random() * 15 + 2).toFixed(1),
      reach: (parseInt(newFollowers, 10) || 1200) * 4,
      impressions: (parseInt(newFollowers, 10) || 1200) * 6,
      engagementRate: +(Math.random() * 5 + 3).toFixed(1),
      postsCount: Math.floor(Math.random() * 40 + 10),
      isConnected: true,
      status: 'active',
    });

    setIsAddAccountModalOpen(false);
    setNewAccountName('');
    setNewHandle('');
  };

  const platformCounts: Record<string, number> = {
    all: socialAccounts.length,
    instagram: socialAccounts.filter(a => a.platform === 'instagram').length,
    linkedin: socialAccounts.filter(a => a.platform === 'linkedin').length,
    youtube: socialAccounts.filter(a => a.platform === 'youtube').length,
    facebook: socialAccounts.filter(a => a.platform === 'facebook').length,
    x: socialAccounts.filter(a => a.platform === 'x').length,
    tiktok: socialAccounts.filter(a => a.platform === 'tiktok').length,
  };

  return (
    <div id="social-accounts-view" className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-mono-tag text-[10px] text-[#C8FF00] bg-[#C8FF00]/10 px-2 py-0.5 rounded border border-[#C8FF00]/20">CHANNEL MANAGER</span>
            <span className="text-xs text-[#9A9A9A] font-mono">INTEGRATIONS</span>
          </div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-[#F5F5F0] tracking-tight">
              Connected Channels
            </h1>
            <span className="font-mono-tag text-xs px-2.5 py-0.5 rounded bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/20">
              {socialAccounts.filter(a => a.isConnected).length} CONNECTED
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#9A9A9A] mt-1 max-w-2xl">
            Link and manage multi-platform creator handles, regional brands, and community hubs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            id="sync-all-accounts-btn"
            onClick={handleSyncAll}
            disabled={isSyncingAll}
            className="btn-secondary-dark px-4 py-2.5 text-xs font-bold flex items-center space-x-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin text-[#C8FF00]' : ''}`} />
            <span>{isSyncingAll ? 'Syncing...' : 'Sync Channels'}</span>
          </button>

          <button
            id="add-new-account-btn"
            onClick={() => {
              const currentPlan = SUBSCRIPTION_PLANS[subscription.planId];
              if (currentPlan && socialAccounts.length >= currentPlan.limits.socialAccounts) {
                openUpgradeModal('basic_analytics', {
                  featureName: 'Social Accounts Limit',
                  description: `You have connected ${socialAccounts.length} / ${currentPlan.limits.socialAccounts} accounts allowed on your ${currentPlan.name} plan. Upgrade to link additional profiles and channels.`
                });
                return;
              }
              setIsAddAccountModalOpen(true);
            }}
            className="btn-lime px-4 py-2.5 text-xs font-bold flex items-center space-x-2 cursor-pointer shadow-lg shadow-[#C8FF00]/10"
          >
            <Plus className="w-4 h-4 text-[#080808]" />
            <span>Add Channel</span>
          </button>
        </div>
      </div>

      {/* Platform Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Channels' },
          { id: 'instagram', label: 'Instagram' },
          { id: 'linkedin', label: 'LinkedIn' },
          { id: 'youtube', label: 'YouTube' },
          { id: 'facebook', label: 'Facebook' },
          { id: 'x', label: 'X (Twitter)' },
          { id: 'tiktok', label: 'TikTok' },
        ].map((tab) => {
          const count = platformCounts[tab.id] || 0;
          const isActive = platformFilter === tab.id;
          return (
            <button
              key={tab.id}
              id={`filter-tab-${tab.id}`}
              onClick={() => setPlatformFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#C8FF00] text-[#080808]'
                  : 'bg-[#111111] text-[#9A9A9A] border border-white/5 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                isActive ? 'bg-[#080808] text-[#C8FF00]' : 'bg-[#151515] text-[#707070]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAccounts.map((account) => {
          const info = getPlatformIcon(account.platform);
          const isCurrentActive = selectedAccountId === account.id;

          return (
            <div
              key={account.id}
              className={`rounded-2xl p-6 flex flex-col justify-between transition-all card-brivon relative ${
                isCurrentActive 
                  ? 'ring-2 ring-[#C8FF00] border-transparent bg-[#141414]'
                  : (account.isConnected
                      ? 'hover:border-white/20'
                      : 'border-dashed border-white/10 opacity-70')
              }`}
            >
              <div>
                {/* Card Top: Platform, Avatar & Category */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={account.avatar}
                        alt={account.handle}
                        className="w-12 h-12 rounded-xl object-cover border border-white/10 shadow-md"
                      />
                      <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-md ${info.color} flex items-center justify-center text-[10px]`}>
                        {info.icon}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-white text-sm truncate max-w-[140px]">
                        {account.accountName}
                      </h3>
                      <p className="text-xs text-[#707070] font-mono">{account.handle}</p>
                      {account.category && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-mono-tag bg-[#151515] text-[#9A9A9A] border border-white/5">
                          {account.category.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-1">
                    <span
                      className={`font-mono-tag inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[9px] uppercase border ${
                        account.isConnected
                          ? 'bg-[#C8FF00]/10 text-[#C8FF00] border-[#C8FF00]/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {account.isConnected ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00]" />
                          <span>ACTIVE</span>
                        </>
                      ) : (
                        <>
                          <span>DISCONNECTED</span>
                        </>
                      )}
                    </span>

                    {isCurrentActive && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono-tag bg-white/10 text-white flex items-center space-x-1">
                        <Check className="w-2.5 h-2.5 text-[#C8FF00]" />
                        <span>INSPECTING</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Metrics */}
                {account.isConnected ? (
                  <div className="grid grid-cols-3 gap-2 my-5 p-3 rounded-xl bg-[#151515] border border-white/5 text-center">
                    <div>
                      <span className="font-mono-tag text-[9px] text-[#707070]">FOLLOWERS</span>
                      <p className="text-sm font-mono font-extrabold text-[#F5F5F0] mt-0.5">
                        {(account.followers / 1000).toFixed(1)}k
                      </p>
                      <span className="text-[9px] font-mono font-bold text-[#C8FF00]">+{account.followersChange || 5.2}%</span>
                    </div>
                    <div>
                      <span className="font-mono-tag text-[9px] text-[#707070]">ENGAGEMENT</span>
                      <p className="text-sm font-mono font-extrabold text-[#C8FF00] mt-0.5">
                        {account.engagementRate}%
                      </p>
                      <span className="text-[9px] font-mono text-[#707070]">rate</span>
                    </div>
                    <div>
                      <span className="font-mono-tag text-[9px] text-[#707070]">POSTS</span>
                      <p className="text-sm font-mono font-extrabold text-[#F5F5F0] mt-0.5">
                        {account.postsCount || 42}
                      </p>
                      <span className="text-[9px] font-mono text-[#707070]">published</span>
                    </div>
                  </div>
                ) : (
                  <div className="my-5 p-4 rounded-xl bg-[#151515] text-center text-xs font-mono text-[#707070] border border-white/5">
                    Connect this {info.name} account to enable 1-click publishing, asset scheduling, and metrics synchronization.
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#707070]">
                  <span>{account.isConnected ? `Synced: ${account.lastSynced}` : 'Offline'}</span>

                  <div className="flex items-center space-x-1.5">
                    {account.isConnected && (
                      <button
                        id={`switch-analytics-${account.id}`}
                        onClick={() => {
                          setSelectedAccountId(account.id);
                          setActiveView('analytics');
                          showToast('Viewing Channel Analytics', `Switched to ${account.handle} metrics.`, 'success');
                        }}
                        className="px-2 py-1 rounded-lg btn-secondary-dark text-[#C8FF00] font-mono text-xs flex items-center space-x-1 cursor-pointer"
                        title="Open performance dashboard for this channel"
                      >
                        <BarChart3 className="w-3 h-3" />
                        <span>Analytics</span>
                      </button>
                    )}

                    <button
                      id={`sync-acc-${account.id}`}
                      onClick={() => syncAccount(account.id)}
                      className="p-1.5 rounded-lg text-[#9A9A9A] hover:text-white hover:bg-white/10 transition-colors"
                      title="Sync metrics now"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>

                    <button
                      id={`remove-acc-${account.id}`}
                      onClick={() => setDeleteConfirmId(account.id)}
                      className="p-1.5 rounded-lg text-[#9A9A9A] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Remove channel"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    id={`toggle-acc-${account.id}`}
                    onClick={() => {
                      if (!account.isConnected) {
                        setConnectingPlatform(account.platform);
                      } else {
                        toggleConnectAccount(account.id);
                      }
                    }}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                      account.isConnected
                        ? 'btn-secondary-dark text-[#9A9A9A] hover:text-rose-400'
                        : 'btn-lime text-[#080808]'
                    }`}
                  >
                    {account.isConnected ? 'Disconnect Channel' : 'Authorize & Connect'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Account Modal */}
      <AnimatePresence>
        {isAddAccountModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg card-brivon bg-[#111111] rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#151515] border border-white/10 text-[#C8FF00] flex items-center justify-center font-bold">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-extrabold text-white">
                      Link Channel / Handle
                    </h3>
                    <p className="text-xs text-[#9A9A9A]">Add an account to your workspace routing</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsAddAccountModalOpen(false)}
                  className="p-1.5 rounded-lg text-[#9A9A9A] hover:text-white bg-[#151515]"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAccount} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">
                    SELECT PLATFORM
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {(['instagram', 'linkedin', 'youtube', 'facebook', 'x', 'tiktok'] as SocialPlatform[]).map((p) => {
                      const iconInfo = getPlatformIcon(p);
                      const isSelected = newPlatform === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setNewPlatform(p)}
                          className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center space-y-1 cursor-pointer ${
                            isSelected
                              ? 'border-[#C8FF00] bg-[#C8FF00]/10 text-[#C8FF00] font-bold'
                              : 'border-white/10 bg-[#151515] text-[#9A9A9A] hover:bg-white/5'
                          }`}
                        >
                          <span className="text-lg">{iconInfo.icon}</span>
                          <span className="text-[9px] font-mono uppercase truncate w-full">{p}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">
                      ACCOUNT DISPLAY NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={newAccountName}
                      onChange={(e) => setNewAccountName(e.target.value)}
                      placeholder="e.g. Acme Global Studio"
                      className="input-brivon w-full px-3.5 py-2.5 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">
                      HANDLE / USERNAME
                    </label>
                    <input
                      type="text"
                      required
                      value={newHandle}
                      onChange={(e) => setNewHandle(e.target.value)}
                      placeholder="e.g. @acme_studio"
                      className="input-brivon w-full px-3.5 py-2.5 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">
                      CATEGORY
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="input-brivon w-full px-3.5 py-2.5 rounded-xl text-xs font-mono"
                    >
                      <option value="Brand Hub" className="bg-[#111111] text-white">Brand Hub</option>
                      <option value="Product Launch" className="bg-[#111111] text-white">Product Launch</option>
                      <option value="Community & Events" className="bg-[#111111] text-white">Community & Events</option>
                      <option value="Executive & Founder" className="bg-[#111111] text-white">Executive & Founder</option>
                      <option value="Regional Division" className="bg-[#111111] text-white">Regional Division</option>
                      <option value="Talent & Careers" className="bg-[#111111] text-white">Talent & Careers</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">
                      INITIAL FOLLOWERS
                    </label>
                    <input
                      type="number"
                      value={newFollowers}
                      onChange={(e) => setNewFollowers(e.target.value)}
                      placeholder="5000"
                      className="input-brivon w-full px-3.5 py-2.5 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddAccountModalOpen(false)}
                    className="flex-1 btn-secondary-dark py-2.5 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    id="submit-add-account-btn"
                    type="submit"
                    className="flex-1 btn-lime py-2.5 text-xs font-bold cursor-pointer"
                  >
                    Connect & Save
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md card-brivon bg-[#111111] rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10 space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-lg font-display font-black text-white">Disconnect & Remove Handle?</h3>
                <p className="text-xs text-[#9A9A9A]">
                  Are you sure you want to remove this social profile from the workspace? All scheduling connections for this handle will be unlinked.
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 btn-secondary-dark py-2.5 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  id="confirm-remove-account-btn"
                  onClick={() => {
                    removeSocialAccount(deleteConfirmId);
                    setDeleteConfirmId(null);
                    showToast('Account Removed', 'Handle successfully removed from workspace.', 'info');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Confirm Remove
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* OAuth Simulator Modal */}
      <AnimatePresence>
        {connectingPlatform && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md card-brivon bg-[#111111] rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10 text-center space-y-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#151515] border border-white/10 text-[#C8FF00] flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-display font-extrabold text-white capitalize">
                  Authorize {connectingPlatform}
                </h3>
                <p className="text-xs text-[#9A9A9A] mt-2">
                  Socially is requesting permission to publish posts, schedule reels, and fetch follower insights for your workspace.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#151515] text-left text-xs space-y-2 text-[#9A9A9A] border border-white/5 font-mono">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C8FF00] shrink-0" />
                  <span className="text-[#F5F5F0]">Publish media, captions, hashtags and stories</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C8FF00] shrink-0" />
                  <span className="text-[#F5F5F0]">Read engagement analytics & reach stats</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C8FF00] shrink-0" />
                  <span className="text-[#F5F5F0]">Respond to comments and team approval flows</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setConnectingPlatform(null)}
                  className="flex-1 btn-secondary-dark py-2.5 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  id="oauth-confirm-btn"
                  onClick={() => {
                    const acc = socialAccounts.find(a => a.platform === connectingPlatform);
                    if (acc) toggleConnectAccount(acc.id);
                    setConnectingPlatform(null);
                    showToast('Account Connected! 🔗', `Successfully linked ${connectingPlatform} channel.`, 'success');
                  }}
                  className="flex-1 btn-lime py-2.5 text-xs font-bold cursor-pointer"
                >
                  Authorize & Link
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
