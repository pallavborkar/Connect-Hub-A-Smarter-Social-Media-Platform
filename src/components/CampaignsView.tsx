import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Layers, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  TrendingUp, 
  Target, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  PenSquare, 
  Sparkles,
  ChevronRight,
  BarChart2,
  X,
  Check
} from 'lucide-react';
import { Campaign } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export const CampaignsView: React.FC = () => {
  const { 
    campaigns, 
    addCampaign, 
    updateCampaign, 
    deleteCampaign, 
    posts, 
    tasks, 
    teamMembers, 
    formatDate,
    setStudioInitialDraft,
    setIsStudioModalOpen,
    setActiveView,
    showToast,
    checkFeatureAccess,
    openUpgradeModal
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'planning' | 'completed' | 'paused'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states for creating/editing campaign
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'planning' | 'completed' | 'paused'>('planning');
  const [formTargetReach, setFormTargetReach] = useState('150000');
  const [formTargetEngagement, setFormTargetEngagement] = useState('15000');
  const [formColor, setFormColor] = useState('#C8FF00');
  const [formSelectedTeam, setFormSelectedTeam] = useState<string[]>([]);

  const colorPalette = ['#C8FF00', '#38BDF8', '#A855F7', '#F59E0B', '#F43F5E', '#10B981', '#E2E8F0'];

  const resetForm = () => {
    setFormName('');
    setFormDesc('');
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setFormStartDate(today);
    setFormEndDate(thirtyDaysLater);
    setFormStatus('planning');
    setFormTargetReach('150000');
    setFormTargetEngagement('15000');
    setFormColor('#C8FF00');
    setFormSelectedTeam(teamMembers.slice(0, 3).map(m => m.id));
    setEditingCampaign(null);
  };

  const handleOpenCreate = () => {
    if (!checkFeatureAccess('campaigns')) {
      openUpgradeModal('campaigns', {
        featureName: 'Campaigns Hub',
        description: 'Organize, coordinate, and track multi-channel marketing campaigns across your entire team.'
      });
      return;
    }
    resetForm();
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (camp: Campaign) => {
    setEditingCampaign(camp);
    setFormName(camp.name);
    setFormDesc(camp.description);
    setFormStartDate(camp.startDate);
    setFormEndDate(camp.endDate);
    setFormStatus(camp.status);
    setFormTargetReach(camp.targetReach.toString());
    setFormTargetEngagement(camp.targetEngagement.toString());
    setFormColor(camp.color);
    setFormSelectedTeam(camp.team);
    setIsCreateModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Missing Name', 'Please give your campaign a descriptive title.', 'error');
      return;
    }

    if (editingCampaign) {
      updateCampaign(editingCampaign.id, {
        name: formName.trim(),
        description: formDesc.trim(),
        startDate: formStartDate,
        endDate: formEndDate,
        status: formStatus,
        targetReach: parseInt(formTargetReach, 10) || 100000,
        targetEngagement: parseInt(formTargetEngagement, 10) || 10000,
        color: formColor,
        team: formSelectedTeam,
      });
    } else {
      addCampaign({
        name: formName.trim(),
        description: formDesc.trim(),
        startDate: formStartDate,
        endDate: formEndDate,
        status: formStatus,
        targetReach: parseInt(formTargetReach, 10) || 100000,
        targetEngagement: parseInt(formTargetEngagement, 10) || 10000,
        color: formColor,
        team: formSelectedTeam,
      });
    }

    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleDeleteCampaign = (id: string) => {
    deleteCampaign(id);
    if (selectedCampaign?.id === id) {
      setSelectedCampaign(null);
    }
    setDeleteConfirmId(null);
  };

  const handleCreatePostForCampaign = (camp: Campaign) => {
    setStudioInitialDraft({
      campaignId: camp.id,
      campaignName: camp.name,
      title: `${camp.name} - Official Launch Post`,
      caption: `⚡ Exciting launch from our ${camp.name} initiative!\n\nDiscover how we are redefining workflows.\n\n#${camp.name.replace(/[^a-zA-Z0-9]/g, '')} #ProductLaunch`,
    });
    setIsStudioModalOpen(true);
  };

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Aggregated Stats
  const activeCount = campaigns.filter(c => c.status === 'active').length;
  const totalReachSum = campaigns.reduce((acc, c) => acc + (c.currentReach || 0), 0);
  const totalEngagementSum = campaigns.reduce((acc, c) => acc + (c.currentEngagement || 0), 0);

  const getStatusBadge = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="font-mono-tag px-2.5 py-0.5 rounded text-[10px] bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/30 flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00] animate-pulse" />
            <span>ACTIVE</span>
          </span>
        );
      case 'planning':
        return (
          <span className="font-mono-tag px-2.5 py-0.5 rounded text-[10px] bg-white/10 text-white border border-white/20">
            PLANNING
          </span>
        );
      case 'completed':
        return (
          <span className="font-mono-tag px-2.5 py-0.5 rounded text-[10px] bg-[#151515] text-[#9A9A9A] border border-white/10">
            COMPLETED
          </span>
        );
      case 'paused':
        return (
          <span className="font-mono-tag px-2.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30">
            PAUSED
          </span>
        );
    }
  };

  return (
    <div id="campaigns-view-root" className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-mono-tag text-[10px] text-[#C8FF00] bg-[#C8FF00]/10 px-2 py-0.5 rounded border border-[#C8FF00]/20">CAMPAIGNS HUB</span>
            <span className="text-xs text-[#9A9A9A] font-mono">SPRINTS & ROADMAPS</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-[#F5F5F0] tracking-tight">
            Marketing Campaigns
          </h1>
          <p className="text-xs sm:text-sm text-[#9A9A9A] mt-1 max-w-2xl">
            Coordinate brand initiatives, sprint deliverables, cross-channel reach, and team goals.
          </p>
        </div>

        <button
          id="create-campaign-btn"
          onClick={handleOpenCreate}
          className="btn-lime px-5 py-2.5 text-xs font-bold flex items-center space-x-2 cursor-pointer shadow-lg shadow-[#C8FF00]/10"
        >
          <Plus className="w-4 h-4 text-[#080808]" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="card-brivon p-5 rounded-2xl">
          <div className="flex items-center justify-between text-[#9A9A9A] mb-2">
            <span className="font-mono-tag text-[10px]">TOTAL CAMPAIGNS</span>
            <Layers className="w-4 h-4 text-[#C8FF00]" />
          </div>
          <p className="text-3xl font-display font-black text-[#F5F5F0]">
            {campaigns.length}
          </p>
          <p className="font-mono text-[11px] text-[#C8FF00] mt-1">
            {activeCount} active initiatives
          </p>
        </div>

        <div className="card-brivon p-5 rounded-2xl">
          <div className="flex items-center justify-between text-[#9A9A9A] mb-2">
            <span className="font-mono-tag text-[10px]">COMBINED REACH</span>
            <TrendingUp className="w-4 h-4 text-[#C8FF00]" />
          </div>
          <p className="text-3xl font-display font-black text-[#F5F5F0]">
            {(totalReachSum / 1000).toFixed(1)}k
          </p>
          <p className="font-mono text-[11px] text-[#9A9A9A] mt-1">
            Across active initiatives
          </p>
        </div>

        <div className="card-brivon p-5 rounded-2xl">
          <div className="flex items-center justify-between text-[#9A9A9A] mb-2">
            <span className="font-mono-tag text-[10px]">TOTAL ENGAGEMENTS</span>
            <Target className="w-4 h-4 text-[#C8FF00]" />
          </div>
          <p className="text-3xl font-display font-black text-[#F5F5F0]">
            {(totalEngagementSum / 1000).toFixed(1)}k
          </p>
          <p className="font-mono text-[11px] text-[#9A9A9A] mt-1">
            Reactions, shares & comments
          </p>
        </div>

        <div className="card-brivon p-5 rounded-2xl">
          <div className="flex items-center justify-between text-[#9A9A9A] mb-2">
            <span className="font-mono-tag text-[10px]">LINKED POSTS</span>
            <PenSquare className="w-4 h-4 text-[#C8FF00]" />
          </div>
          <p className="text-3xl font-display font-black text-[#F5F5F0]">
            {posts.filter(p => p.campaignId).length}
          </p>
          <p className="font-mono text-[11px] text-[#9A9A9A] mt-1">
            Scheduled & broadcasted
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 card-brivon p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#707070] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="campaigns-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns by keyword, goal..."
            className="input-brivon w-full pl-9 pr-4 py-2 text-xs rounded-xl"
          />
        </div>

        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'active', 'planning', 'completed', 'paused'] as const).map((status) => (
            <button
              key={status}
              id={`filter-campaign-status-${status}`}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === status
                  ? 'bg-[#C8FF00] text-[#080808]'
                  : 'btn-secondary-dark text-[#9A9A9A] hover:text-white'
              }`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns Grid */}
      {filteredCampaigns.length === 0 ? (
        <div className="p-12 text-center card-brivon rounded-2xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#151515] border border-white/10 text-[#C8FF00] flex items-center justify-center mx-auto">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-display font-extrabold text-[#F5F5F0]">
              {searchQuery || statusFilter !== 'all' ? 'No campaigns match your filters' : 'No Campaigns Yet'}
            </h3>
            <p className="text-xs text-[#9A9A9A] max-w-md mx-auto mt-1">
              {searchQuery || statusFilter !== 'all'
                ? 'Try clearing your search query or selecting another status filter.'
                : 'Create dedicated campaigns to orchestrate product launches, fest drives, or seasonal sprints.'}
            </p>
          </div>
          {(!searchQuery && statusFilter === 'all') && (
            <button
              id="empty-create-campaign-btn"
              onClick={handleOpenCreate}
              className="btn-lime px-4 py-2 text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#080808]" />
              <span>Create First Campaign</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCampaigns.map((camp) => {
            const reachProgress = Math.min(100, Math.round(((camp.currentReach || 0) / (camp.targetReach || 1)) * 100));
            const campPosts = posts.filter(p => p.campaignId === camp.id);
            const campTasks = tasks.filter(t => t.campaignId === camp.id);

            return (
              <motion.div
                key={camp.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-brivon rounded-2xl p-5 sm:p-6 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Meta */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-2 min-w-0">
                      <div 
                        className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: camp.color || '#C8FF00' }}
                      />
                      {getStatusBadge(camp.status)}
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        id={`edit-campaign-${camp.id}`}
                        onClick={() => handleOpenEdit(camp)}
                        className="p-1.5 rounded-lg text-[#9A9A9A] hover:text-white hover:bg-white/10 transition-colors"
                        title="Edit campaign settings"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        id={`delete-campaign-${camp.id}`}
                        onClick={() => setDeleteConfirmId(camp.id)}
                        className="p-1.5 rounded-lg text-[#9A9A9A] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete campaign"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Campaign Title & Description */}
                  <h3 className="text-base font-display font-extrabold text-[#F5F5F0] group-hover:text-[#C8FF00] transition-colors line-clamp-1">
                    {camp.name}
                  </h3>
                  <p className="text-xs text-[#9A9A9A] mt-1 line-clamp-2 leading-relaxed">
                    {camp.description || 'No detailed description provided.'}
                  </p>

                  {/* Date Range */}
                  <div className="flex items-center space-x-1.5 text-[11px] font-mono text-[#707070] mt-3.5">
                    <Calendar className="w-3.5 h-3.5 text-[#707070] shrink-0" />
                    <span>{formatDate(camp.startDate, 'short-date')} – {formatDate(camp.endDate, 'short-date')}</span>
                  </div>

                  {/* Reach Progress Bar */}
                  <div className="mt-4 p-3 rounded-xl bg-[#151515] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono-tag text-[10px] text-[#9A9A9A]">REACH TARGET</span>
                      <span className="font-mono font-extrabold text-[#F5F5F0]">
                        {(camp.currentReach || 0).toLocaleString()} / {(camp.targetReach || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#080808] overflow-hidden border border-white/5">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${reachProgress}%`,
                          backgroundColor: camp.color || '#C8FF00' 
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#707070]">
                      <span className="text-[#C8FF00]">{reachProgress}% completed</span>
                      <span>Target: {(camp.targetEngagement || 0).toLocaleString()} eng</span>
                    </div>
                  </div>

                  {/* Deliverables Mini Count */}
                  <div className="grid grid-cols-2 gap-2 mt-3 text-center">
                    <div className="p-2 rounded-xl bg-[#151515] border border-white/5">
                      <span className="font-mono-tag text-[9px] text-[#707070]">POSTS</span>
                      <p className="text-xs font-mono font-black text-[#F5F5F0]">
                        {campPosts.length || camp.postsCount || 0}
                      </p>
                    </div>
                    <div className="p-2 rounded-xl bg-[#151515] border border-white/5">
                      <span className="font-mono-tag text-[9px] text-[#707070]">TASKS</span>
                      <p className="text-xs font-mono font-black text-[#F5F5F0]">
                        {campTasks.length || camp.tasksCount || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between gap-2">
                  {/* Assigned Team Avatars */}
                  <div className="flex items-center -space-x-1.5 overflow-hidden">
                    {(camp.team || []).slice(0, 4).map((memberId) => {
                      const member = teamMembers.find(m => m.id === memberId);
                      return member ? (
                        <img
                          key={member.id}
                          src={member.avatar}
                          alt={member.name}
                          title={member.name}
                          className="w-6 h-6 rounded-full border border-[#080808] object-cover"
                        />
                      ) : null;
                    })}
                    {(camp.team || []).length > 4 && (
                      <div className="w-6 h-6 rounded-full bg-[#151515] border border-white/10 flex items-center justify-center text-[9px] font-mono font-bold text-[#9A9A9A]">
                        +{camp.team.length - 4}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      id={`compose-for-campaign-${camp.id}`}
                      onClick={() => handleCreatePostForCampaign(camp)}
                      className="btn-secondary-dark px-2.5 py-1.5 text-xs font-bold flex items-center space-x-1 cursor-pointer"
                      title="Compose post for this campaign"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#C8FF00]" />
                      <span>Post</span>
                    </button>

                    <button
                      id={`view-campaign-details-${camp.id}`}
                      onClick={() => setSelectedCampaign(camp)}
                      className="btn-lime px-3 py-1.5 text-xs font-bold flex items-center space-x-1 cursor-pointer shadow-xs"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#080808]" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Campaign Details Modal */}
      <AnimatePresence>
        {selectedCampaign && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl card-brivon bg-[#111111] rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10 space-y-6 max-h-[90vh] overflow-y-auto my-auto"
            >
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2.5">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: selectedCampaign.color }}
                    />
                    <h2 className="text-xl font-display font-black text-[#F5F5F0]">
                      {selectedCampaign.name}
                    </h2>
                    {getStatusBadge(selectedCampaign.status)}
                  </div>
                  <p className="text-xs font-mono text-[#707070]">
                    {formatDate(selectedCampaign.startDate, 'full')} – {formatDate(selectedCampaign.endDate, 'full')}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="p-1.5 rounded-lg text-[#9A9A9A] hover:text-white bg-[#151515] border border-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-mono-tag text-[10px] text-[#9A9A9A] mb-1.5">CAMPAIGN OBJECTIVE</h4>
                  <p className="text-sm text-[#F5F5F0] leading-relaxed bg-[#151515] p-4 rounded-xl border border-white/5">
                    {selectedCampaign.description || 'No description provided.'}
                  </p>
                </div>

                {/* Metrics Highlights */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#151515] border border-white/5 text-center">
                    <span className="font-mono-tag text-[9px] text-[#9A9A9A]">REACH</span>
                    <p className="text-base font-display font-extrabold text-[#F5F5F0] mt-0.5">
                      {(selectedCampaign.currentReach || 0).toLocaleString()}
                    </p>
                    <span className="text-[9px] font-mono text-[#707070]">of {(selectedCampaign.targetReach || 0).toLocaleString()}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#151515] border border-white/5 text-center">
                    <span className="font-mono-tag text-[9px] text-[#9A9A9A]">ENGAGEMENTS</span>
                    <p className="text-base font-display font-extrabold text-[#C8FF00] mt-0.5">
                      {(selectedCampaign.currentEngagement || 0).toLocaleString()}
                    </p>
                    <span className="text-[9px] font-mono text-[#707070]">of {(selectedCampaign.targetEngagement || 0).toLocaleString()}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#151515] border border-white/5 text-center">
                    <span className="font-mono-tag text-[9px] text-[#9A9A9A]">POSTS</span>
                    <p className="text-base font-display font-extrabold text-[#F5F5F0] mt-0.5">
                      {posts.filter(p => p.campaignId === selectedCampaign.id).length}
                    </p>
                    <span className="text-[9px] font-mono text-[#707070]">in workspace</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#151515] border border-white/5 text-center">
                    <span className="font-mono-tag text-[9px] text-[#9A9A9A]">TASKS</span>
                    <p className="text-base font-display font-extrabold text-[#F5F5F0] mt-0.5">
                      {tasks.filter(t => t.campaignId === selectedCampaign.id).length}
                    </p>
                    <span className="text-[9px] font-mono text-[#707070]">deliverables</span>
                  </div>
                </div>

                {/* Linked Content Preview */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-mono-tag text-[10px] text-[#9A9A9A]">LINKED CONTENT DELIVERABLES</h4>
                    <button
                      onClick={() => {
                        handleCreatePostForCampaign(selectedCampaign);
                        setSelectedCampaign(null);
                      }}
                      className="text-xs font-mono text-[#C8FF00] hover:underline flex items-center space-x-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Draft New Post</span>
                    </button>
                  </div>

                  {posts.filter(p => p.campaignId === selectedCampaign.id).length === 0 ? (
                    <p className="text-xs text-[#707070] p-4 bg-[#151515] rounded-xl text-center border border-white/5">
                      No posts tagged to this campaign yet. Click "Draft New Post" to attach one.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {posts.filter(p => p.campaignId === selectedCampaign.id).map(p => (
                        <div key={p.id} className="p-3 rounded-xl bg-[#151515] border border-white/5 flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2 truncate">
                            <span className="w-2 h-2 rounded-full bg-[#C8FF00] shrink-0" />
                            <span className="font-bold text-[#F5F5F0] truncate">{p.title}</span>
                          </div>
                          <span className="font-mono-tag text-[9px] text-[#9A9A9A] shrink-0">{p.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Team Squad */}
                <div>
                  <h4 className="font-mono-tag text-[10px] text-[#9A9A9A] mb-2">ASSIGNED CAMPAIGN SQUAD</h4>
                  <div className="flex flex-wrap gap-2">
                    {(selectedCampaign.team || []).map(memberId => {
                      const member = teamMembers.find(m => m.id === memberId);
                      return member ? (
                        <div key={member.id} className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#151515] border border-white/10">
                          <img src={member.avatar} alt={member.name} className="w-5 h-5 rounded-full object-cover" />
                          <span className="text-xs font-bold text-[#F5F5F0]">{member.name}</span>
                          <span className="text-[10px] font-mono text-[#707070] capitalize">({member.role.replace('_', ' ')})</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end space-x-3">
                <button
                  onClick={() => {
                    handleOpenEdit(selectedCampaign);
                    setSelectedCampaign(null);
                  }}
                  className="btn-secondary-dark px-4 py-2 text-xs font-bold"
                >
                  Edit Campaign
                </button>
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="btn-lime px-4 py-2 text-xs font-bold"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create / Edit Campaign Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl card-brivon bg-[#111111] rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10 space-y-6 max-h-[90vh] overflow-y-auto my-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#151515] border border-white/10 text-[#C8FF00] flex items-center justify-center font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-extrabold text-[#F5F5F0]">
                      {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
                    </h3>
                    <p className="text-xs text-[#9A9A9A]">Set targets, dates, and assign squad members</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1.5 rounded-lg text-[#9A9A9A] hover:text-white bg-[#151515]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">
                    CAMPAIGN NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Q4 Global Product Expansion"
                    className="input-brivon w-full px-3.5 py-2.5 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">
                    DESCRIPTION & OBJECTIVES
                  </label>
                  <textarea
                    rows={3}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Outline key targets, primary hashtags, promo angles, and content roadmap..."
                    className="input-brivon w-full px-3.5 py-2.5 rounded-xl text-xs resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">
                      START DATE
                    </label>
                    <input
                      type="date"
                      required
                      value={formStartDate}
                      onChange={(e) => setFormStartDate(e.target.value)}
                      className="input-brivon w-full px-3.5 py-2.5 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">
                      END DATE
                    </label>
                    <input
                      type="date"
                      required
                      value={formEndDate}
                      onChange={(e) => setFormEndDate(e.target.value)}
                      className="input-brivon w-full px-3.5 py-2.5 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">
                      STATUS
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="input-brivon w-full px-3.5 py-2.5 rounded-xl text-xs font-mono"
                    >
                      <option value="planning" className="bg-[#111111] text-white">Planning</option>
                      <option value="active" className="bg-[#111111] text-white">Active</option>
                      <option value="paused" className="bg-[#111111] text-white">Paused</option>
                      <option value="completed" className="bg-[#111111] text-white">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">
                      TARGET REACH
                    </label>
                    <input
                      type="number"
                      value={formTargetReach}
                      onChange={(e) => setFormTargetReach(e.target.value)}
                      className="input-brivon w-full px-3.5 py-2.5 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">
                      TARGET ENGAGEMENT
                    </label>
                    <input
                      type="number"
                      value={formTargetEngagement}
                      onChange={(e) => setFormTargetEngagement(e.target.value)}
                      className="input-brivon w-full px-3.5 py-2.5 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">
                    ACCENT COLOR
                  </label>
                  <div className="flex items-center space-x-2">
                    {colorPalette.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormColor(color)}
                        className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                          formColor === color ? 'scale-110 ring-2 ring-[#C8FF00] ring-offset-2 ring-offset-[#111111]' : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">
                    ASSIGN SQUAD MEMBERS
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {teamMembers.map(member => {
                      const isSelected = formSelectedTeam.includes(member.id);
                      return (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setFormSelectedTeam(prev => prev.filter(id => id !== member.id));
                            } else {
                              setFormSelectedTeam(prev => [...prev, member.id]);
                            }
                          }}
                          className={`p-2 rounded-xl border text-left flex items-center space-x-2 transition-colors cursor-pointer ${
                            isSelected
                              ? 'border-[#C8FF00] bg-[#C8FF00]/10 text-[#C8FF00]'
                              : 'border-white/10 bg-[#151515] text-[#9A9A9A] hover:bg-white/5'
                          }`}
                        >
                          <img src={member.avatar} alt={member.name} className="w-5 h-5 rounded-full object-cover" />
                          <span className="text-[11px] font-bold truncate">{member.name.split(' ')[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="btn-secondary-dark px-4 py-2.5 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-lime px-5 py-2.5 text-xs font-bold cursor-pointer"
                  >
                    {editingCampaign ? 'Save Changes' : 'Launch Campaign'}
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
                <h3 className="text-lg font-display font-black text-white">Delete Campaign?</h3>
                <p className="text-xs text-[#9A9A9A]">
                  Are you sure you want to remove this campaign? Associated posts and tasks will be unlinked.
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
                  onClick={() => handleDeleteCampaign(deleteConfirmId)}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
