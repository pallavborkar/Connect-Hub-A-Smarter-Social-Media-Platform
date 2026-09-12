import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { usePermissions } from '../../hooks/usePermissions';
import { Client, ClientStatus } from '../../types';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Share2, 
  Layers, 
  CheckSquare, 
  Calendar, 
  Eye, 
  MoreVertical, 
  ArrowUpRight, 
  Clock, 
  Users, 
  Shield, 
  Mail, 
  Globe, 
  Sparkles,
  ExternalLink,
  MessageSquare,
  FileText,
  Palette,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { AddClientModal } from './AddClientModal';

const STATUS_CONFIGS: Record<ClientStatus, { label: string; badgeClass: string; dotClass: string }> = {
  active: {
    label: 'Active',
    badgeClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    dotClass: 'bg-emerald-500'
  },
  needs_attention: {
    label: 'Needs Attention',
    badgeClass: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-500/20',
    dotClass: 'bg-amber-500 animate-pulse'
  },
  onboarding: {
    label: 'Onboarding',
    badgeClass: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    dotClass: 'bg-indigo-500'
  },
  inactive: {
    label: 'Inactive',
    badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700',
    dotClass: 'bg-slate-400'
  }
};

export const ClientsView: React.FC = () => {
  const { 
    clients, 
    deleteClient, 
    enterClientViewMode, 
    setActiveView, 
    posts, 
    campaigns, 
    clientMessages,
    setReviewModalPostId 
  } = useApp();
  const { hasPermission } = usePermissions();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [actionMenuClientId, setActionMenuClientId] = useState<string | null>(null);

  // Filter clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.assignedManager?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || client.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Aggregate Agency Client Metrics
  const totalClients = clients.length;
  const activeClientsCount = clients.filter(c => c.status === 'active').length;
  const needsAttentionCount = clients.filter(c => c.status === 'needs_attention').length;
  const onboardingCount = clients.filter(c => c.status === 'onboarding').length;
  const totalPendingApprovals = posts.filter(p => p.status === 'pending_review').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Client Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              {clients.length} Accounts
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage client workspaces, review workflows, SLA thresholds, and stakeholder portal access.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {hasPermission('clients.manage') && (
            <button
              id="add-client-btn"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-500/20 flex items-center space-x-2 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Client</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium">Active Clients</span>
            <Building2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{activeClientsCount}</span>
            <span className="text-[11px] text-emerald-600 font-semibold">of {totalClients} total</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium">Needs Attention</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{needsAttentionCount}</span>
            <span className="text-[11px] text-slate-400">SLA / revisions</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium">Pending Approvals</span>
            <CheckSquare className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">{totalPendingApprovals}</span>
            <span className="text-[11px] text-purple-500 font-medium">in queue</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium">Onboarding</span>
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{onboardingCount}</span>
            <span className="text-[11px] text-indigo-500 font-medium">brand setup</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            id="search-clients-input"
            type="text"
            placeholder="Search by brand name, industry, manager..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Statuses' },
            { id: 'active', label: '🟢 Active' },
            { id: 'needs_attention', label: '🟡 Needs Attention' },
            { id: 'onboarding', label: '⚪ Onboarding' },
            { id: 'inactive', label: '🔴 Inactive' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedStatus === tab.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Client Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClients.map((client) => {
          const statusCfg = STATUS_CONFIGS[client.status];
          const completedSteps = (client.onboardingChecklist || []).filter(s => s.isCompleted).length;
          const totalSteps = (client.onboardingChecklist || []).length || 5;
          const onboardingPercent = Math.round((completedSteps / totalSteps) * 100);

          return (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all group overflow-hidden"
            >
              {/* Card Top Header */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    <img 
                      src={client.logo} 
                      alt={client.name} 
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 shrink-0" 
                    />
                    <div className="min-w-0 truncate">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {client.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {client.industry}
                      </p>
                      {client.website && (
                        <a 
                          href={client.website} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-flex items-center space-x-1 text-[10px] text-purple-600 dark:text-purple-400 hover:underline mt-0.5 truncate"
                        >
                          <Globe className="w-2.5 h-2.5 shrink-0" />
                          <span className="truncate">{client.website.replace('https://', '')}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center space-x-1.5 ${statusCfg.badgeClass}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotClass}`} />
                      <span>{statusCfg.label}</span>
                    </span>
                  </div>
                </div>

                {/* Description snippet */}
                {client.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-3 leading-relaxed">
                    {client.description}
                  </p>
                )}
              </div>

              {/* Stats Strip */}
              <div className="px-5 py-3.5 bg-slate-50/60 dark:bg-slate-800/40 grid grid-cols-4 gap-2 text-center border-b border-slate-100 dark:border-slate-800/80">
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Socials</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{client.socialAccountsCount || 3}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Campaigns</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{client.activeCampaignsCount || 2}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Approvals</p>
                  <p className={`text-xs font-bold mt-0.5 ${(client.pendingApprovalsCount || 0) > 0 ? 'text-amber-500' : 'text-slate-800 dark:text-slate-200'}`}>
                    {client.pendingApprovalsCount || 0}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Scheduled</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{client.scheduledPostsCount || 4}</p>
                </div>
              </div>

              {/* Assigned Team & SLA & Onboarding progress */}
              <div className="p-5 space-y-3 text-xs">
                {/* Manager */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> Assigned Manager:
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <img 
                      src={client.assignedManager?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                      alt="" 
                      className="w-4 h-4 rounded-full object-cover" 
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                      {client.assignedManager?.name || 'Aarav Sharma'}
                    </span>
                  </div>
                </div>

                {/* Retainer & SLA */}
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> SLA Response:
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    &lt; {client.slaHours || 24}h ({client.contractValue || '₹75,000/mo'})
                  </span>
                </div>

                {/* Onboarding Checklist Status */}
                {client.status === 'onboarding' && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Setup Checklist
                      </span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{onboardingPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${onboardingPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Last Activity */}
                <div className="text-[10px] text-slate-400 dark:text-slate-500 pt-1">
                  Last activity: {client.lastActivity}
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/80 pt-3 bg-white dark:bg-slate-900">
                <button
                  id={`simulate-portal-btn-${client.id}`}
                  onClick={() => enterClientViewMode(client.id)}
                  className="flex-1 py-2 px-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer border border-purple-200 dark:border-purple-800/50"
                  title="Preview exact Client Portal experience for this brand"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Client Portal</span>
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setActiveView('brand_assets')}
                    title="Brand Assets"
                    className="p-2 rounded-xl text-slate-400 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Palette className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveView('client_messages')}
                    title="Client Messages"
                    className="p-2 rounded-xl text-slate-400 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  {hasPermission('clients.manage') && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to remove ${client.name}?`)) {
                          deleteClient(client.id);
                        }
                      }}
                      title="Delete Client"
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Building2 className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">No clients found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {searchTerm ? `No client matching "${searchTerm}". Try a different search term.` : 'Start by onboarding your first client to create their dedicated workspace and approval portal.'}
          </p>
          {hasPermission('clients.manage') && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors cursor-pointer inline-flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Onboard First Client</span>
            </button>
          )}
        </div>
      )}

      {/* Add Client Flow Modal */}
      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
