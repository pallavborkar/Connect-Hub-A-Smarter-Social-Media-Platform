import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { usePermissions } from '../hooks/usePermissions';
import { 
  Users, 
  UserPlus, 
  Mail, 
  ShieldCheck, 
  MoreVertical, 
  Sparkles,
  X,
  Check,
  Edit2,
  Trash2,
  Lock,
  Layers,
  ChevronDown,
  Info,
  Building2,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { RoleType, TeamMember } from '../types';
import { ROLE_CONFIGS, ROLE_DEFAULT_PERMISSIONS, ALL_PERMISSIONS } from '../config/permissions';
import { motion, AnimatePresence } from 'motion/react';

export const TeamView: React.FC = () => {
  const { 
    teamMembers, 
    inviteTeamMember, 
    updateMemberRole,
    updateMemberPermissions,
    showToast, 
    workspace, 
    socialAccounts, 
    campaigns,
    addAuditLog
  } = useApp();

  const { can, isOwner, isManager, currentRole } = usePermissions();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [viewingMatrixRole, setViewingMatrixRole] = useState<RoleType | null>(null);

  // Invite Form State
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<RoleType>('editor');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);

  // Edit Role State
  const [editRole, setEditRole] = useState<RoleType>('editor');
  const [editAccounts, setEditAccounts] = useState<string[]>([]);
  const [editCampaigns, setEditCampaigns] = useState<string[]>([]);

  const handleOpenInvite = () => {
    if (!can('team.invite') && !isOwner && !isManager) {
      showToast('Permission Restricted', 'Only workspace Owners and Managers can invite new members.', 'error');
      return;
    }
    setInviteName('');
    setInviteEmail('');
    setInviteRole('editor');
    setSelectedAccounts(socialAccounts.map(a => a.id));
    setSelectedCampaigns([]);
    setIsInviteModalOpen(true);
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    inviteTeamMember(
      inviteEmail.trim(),
      inviteName.trim(),
      inviteRole,
      selectedAccounts,
      selectedCampaigns
    );

    setIsInviteModalOpen(false);
    setInviteName('');
    setInviteEmail('');
    showToast('Invitation Dispatched', `Invited ${inviteName} as ${ROLE_CONFIGS[inviteRole].name}.`, 'success');
  };

  const handleOpenEdit = (member: TeamMember) => {
    if (!can('team.edit') && !isOwner && !isManager) {
      showToast('Access Restricted', 'You do not have permission to edit team member roles.', 'error');
      return;
    }
    if (member.role === 'owner') {
      showToast('Protected Account', 'The workspace Owner role cannot be modified. Go to Settings > Ownership & Security to transfer ownership.', 'info');
      return;
    }

    setEditingMember(member);
    setEditRole((member.role as RoleType) === 'owner' ? 'manager' : (member.role as RoleType));
    setEditAccounts(member.assignedAccounts || socialAccounts.map(a => a.id));
    setEditCampaigns(member.assignedCampaigns || []);
  };

  const handleSaveEditMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    if (editRole === 'owner') {
      showToast('Action Prohibited', 'Direct assignment of the OWNER role is prohibited by the Single-Owner architecture.', 'error');
      return;
    }

    updateMemberRole(editingMember.id, editRole);
    updateMemberPermissions(editingMember.id, editingMember.customPermissions, editAccounts, editCampaigns);

    setEditingMember(null);
  };

  return (
    <div id="team-view" className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-mono-tag text-[10px] text-[#C8FF00] bg-[#C8FF00]/10 px-2 py-0.5 rounded border border-[#C8FF00]/20">COLLABORATION MATRIX</span>
            <span className="text-xs text-[#9A9A9A] font-mono">RBAC ACCESS</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-[#F5F5F0] tracking-tight">
            Team & Role Hierarchy
          </h1>
          <p className="text-xs sm:text-sm text-[#9A9A9A] mt-1 max-w-2xl">
            Assign workspace roles, manage publishing clearances, and isolate client account channels.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            id="view-role-matrix-btn"
            onClick={() => setViewingMatrixRole('editor')}
            className="btn-secondary-dark px-4 py-2.5 text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-[#C8FF00]" />
            <span>Permissions Matrix</span>
          </button>

          {(can('team.invite') || isOwner) && (
            <button
              id="invite-member-btn"
              onClick={handleOpenInvite}
              className="btn-lime px-4 py-2.5 text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-[#C8FF00]/10"
            >
              <UserPlus className="w-4 h-4 text-[#080808]" />
              <span>Invite Member</span>
            </button>
          )}
        </div>
      </div>

      {/* Role Overview Pills Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {(Object.keys(ROLE_CONFIGS) as RoleType[]).map((rKey) => {
          const cfg = ROLE_CONFIGS[rKey];
          const membersInRole = teamMembers.filter(m => {
            if (!m.role) return rKey === 'custom';
            const normRole = m.role.toLowerCase().trim();
            if (normRole === rKey.toLowerCase()) return true;
            if (rKey === 'custom' && !['owner', 'manager', 'editor', 'student', 'viewer', 'client'].includes(normRole)) {
              return true;
            }
            return false;
          });

          return (
            <button
              key={rKey}
              onClick={() => setViewingMatrixRole(rKey)}
              className="p-3.5 rounded-2xl card-brivon text-left transition-all group cursor-pointer hover:border-white/20"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono-tag px-2 py-0.5 rounded text-[9px] uppercase tracking-wide bg-white/5 text-white border border-white/10">
                  {cfg.name}
                </span>
                <span className="text-xs font-mono font-bold text-[#C8FF00] bg-[#151515] px-2 py-0.5 rounded">
                  {membersInRole.length}
                </span>
              </div>
              <p className="text-[11px] text-[#9A9A9A] line-clamp-2 leading-snug">
                {cfg.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => {
          const rConfig = ROLE_CONFIGS[member.role] || { name: member.role, badgeColor: 'bg-white/5 text-white', description: '' };
          const canEditThisMember = (isOwner || isManager) && (member.role !== 'owner' || isOwner);

          return (
            <div
              key={member.id}
              id={`team-member-card-${member.id}`}
              className="p-6 rounded-2xl card-brivon space-y-4 relative group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 min-w-0">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-display font-bold text-white truncate">{member.name}</h3>
                    <p className="text-[11px] font-mono text-[#707070] flex items-center space-x-1 mt-0.5 truncate">
                      <Mail className="w-3 h-3 shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </p>
                  </div>
                </div>

                <span className="font-mono-tag px-2.5 py-0.5 rounded text-[9px] uppercase shrink-0 bg-[#151515] text-[#C8FF00] border border-[#C8FF00]/20">
                  {rConfig.name}
                </span>
              </div>

              {/* Status and Scope summary */}
              <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                <div className="flex items-center justify-between text-[#9A9A9A] text-[11px] font-mono">
                  <span>CHANNELS:</span>
                  <span className="text-[#F5F5F0]">
                    {member.assignedAccounts && member.assignedAccounts.length > 0
                      ? `${member.assignedAccounts.length} Social Accounts`
                      : 'All Workspace Handles'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[#9A9A9A] text-[11px] font-mono">
                  <span>LAST ACTIVE:</span>
                  <span className="text-[#707070]">{member.recentActivity || 'Active recently'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => setViewingMatrixRole(member.role)}
                  className="text-[11px] font-mono text-[#C8FF00] hover:underline flex items-center space-x-1"
                >
                  <Info className="w-3 h-3" />
                  <span>View Scope</span>
                </button>

                {member.role === 'owner' ? (
                  <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#151515] border border-white/10 text-[#C8FF00] text-[10px] font-mono font-bold">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Single Owner</span>
                  </div>
                ) : (
                  canEditThisMember && (
                    <button
                      onClick={() => handleOpenEdit(member)}
                      className="btn-secondary-dark px-3 py-1.5 text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3 text-[#C8FF00]" />
                      <span>Manage Role</span>
                    </button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Invite Member Modal */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg card-brivon bg-[#111111] rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <UserPlus className="w-5 h-5 text-[#C8FF00]" />
                  <h3 className="text-base font-display font-extrabold text-white">Invite Team Member</h3>
                </div>
                <button onClick={() => setIsInviteModalOpen(false)} className="p-1.5 text-[#9A9A9A] hover:text-white rounded-lg bg-[#151515]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleInviteSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1">FULL NAME</label>
                  <input
                    type="text"
                    required
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="e.g. Liam Vance"
                    className="input-brivon w-full px-4 py-2.5 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="e.g. liam@agency.co"
                    className="input-brivon w-full px-4 py-2.5 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1">ASSIGNED ROLE</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as RoleType)}
                    className="input-brivon w-full px-4 py-2.5 rounded-xl text-xs font-mono"
                  >
                    {(Object.keys(ROLE_CONFIGS) as RoleType[])
                      .filter((r) => r !== 'owner')
                      .map((r) => (
                        <option key={r} value={r} className="bg-[#111111] text-white">
                          {ROLE_CONFIGS[r].name} — {ROLE_CONFIGS[r].description}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Account Scoping */}
                <div>
                  <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">
                    CHANNEL ACCESS SCOPE
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 rounded-xl bg-[#151515] border border-white/5">
                    {socialAccounts.map(acc => {
                      const isChecked = selectedAccounts.includes(acc.id);
                      return (
                        <label key={acc.id} className="flex items-center space-x-2 text-xs text-[#9A9A9A] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAccounts(prev => [...prev, acc.id]);
                              } else {
                                setSelectedAccounts(prev => prev.filter(id => id !== acc.id));
                              }
                            }}
                            className="w-3.5 h-3.5 accent-[#C8FF00] rounded cursor-pointer"
                          />
                          <span className="truncate">{acc.accountName}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(false)}
                    className="btn-secondary-dark px-4 py-2 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-lime px-5 py-2 text-xs font-bold cursor-pointer"
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Role Modal */}
      <AnimatePresence>
        {editingMember && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg card-brivon bg-[#111111] rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <Edit2 className="w-5 h-5 text-[#C8FF00]" />
                  <h3 className="text-base font-display font-bold text-white">
                    Modify Role: {editingMember.name}
                  </h3>
                </div>
                <button onClick={() => setEditingMember(null)} className="p-1.5 text-[#9A9A9A] hover:text-white rounded-lg bg-[#151515]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditMember} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1">
                    ROLE LEVEL
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as RoleType)}
                    className="input-brivon w-full px-4 py-2.5 rounded-xl text-xs font-mono"
                  >
                    {(Object.keys(ROLE_CONFIGS) as RoleType[])
                      .filter((r) => r !== 'owner')
                      .map((r) => (
                        <option key={r} value={r} className="bg-[#111111] text-white">
                          {ROLE_CONFIGS[r].name} — {ROLE_CONFIGS[r].description}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="p-3.5 rounded-xl bg-[#151515] border border-white/5 text-xs space-y-1">
                  <span className="font-mono-tag text-[10px] text-[#C8FF00]">CAPABILITIES:</span>
                  <p className="text-[#9A9A9A] text-[11px] leading-relaxed">
                    {ROLE_CONFIGS[editRole].description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    className="btn-secondary-dark px-4 py-2 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-lime px-5 py-2 text-xs font-bold cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Permissions Matrix Modal */}
      <AnimatePresence>
        {viewingMatrixRole && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl card-brivon bg-[#111111] rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10 space-y-5 max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3 shrink-0">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-[#C8FF00]" />
                  <h3 className="text-base font-display font-extrabold text-white">
                    RBAC Permissions Matrix
                  </h3>
                </div>
                <button onClick={() => setViewingMatrixRole(null)} className="p-1.5 text-[#9A9A9A] hover:text-white rounded-lg bg-[#151515]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Role selector tabs */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 border-b border-white/10 shrink-0">
                {(Object.keys(ROLE_CONFIGS) as RoleType[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setViewingMatrixRole(r)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase whitespace-nowrap transition-all cursor-pointer ${
                      viewingMatrixRole === r
                        ? 'bg-[#C8FF00] text-[#080808]'
                        : 'bg-[#151515] text-[#9A9A9A] hover:text-white'
                    }`}
                  >
                    {ROLE_CONFIGS[r].name}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                <div className="p-3.5 rounded-xl bg-[#151515] border border-white/5">
                  <span className="font-mono-tag text-[10px] text-[#C8FF00] block mb-1">
                    {ROLE_CONFIGS[viewingMatrixRole].name.toUpperCase()} ROLE SUMMARY:
                  </span>
                  <p className="text-[11px] text-[#9A9A9A] leading-relaxed">
                    {ROLE_CONFIGS[viewingMatrixRole].description}
                  </p>
                </div>

                <div className="divide-y divide-white/5 border border-white/10 rounded-xl overflow-hidden bg-[#0D0D0D]">
                  {ALL_PERMISSIONS.map(perm => {
                    const hasPerm = ROLE_DEFAULT_PERMISSIONS[viewingMatrixRole].includes(perm.key);
                    return (
                      <div key={perm.key} className="p-3 flex items-center justify-between hover:bg-white/5">
                        <div>
                          <p className="font-semibold text-[#F5F5F0]">{perm.label}</p>
                          <p className="text-[10px] text-[#707070] font-mono">{perm.key} • {perm.category}</p>
                        </div>
                        {hasPerm ? (
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono-tag font-bold bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/30 flex items-center space-x-1">
                            <Check className="w-3 h-3" />
                            <span>GRANTED</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono-tag font-bold bg-white/5 text-[#707070]">
                            DENIED
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end shrink-0">
                <button
                  onClick={() => setViewingMatrixRole(null)}
                  className="btn-secondary-dark px-5 py-2 text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
