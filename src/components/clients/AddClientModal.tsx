import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  Image as ImageIcon, 
  FileText, 
  UserCheck, 
  Users, 
  DollarSign, 
  Clock, 
  Calendar, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INDUSTRY_OPTIONS = [
  'Technology & SaaS',
  'Fashion & Apparel',
  'Food & Beverages / D2C',
  'Health, Wellness & Fitness',
  'Fintech & Financial Services',
  'Education & EdTech',
  'Real Estate & Architecture',
  'Hospitality & Travel',
  'Entertainment & Media',
  'E-Commerce & Retail'
];

const PRESET_LOGOS = [
  'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80',
];

export const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose }) => {
  const { teamMembers, addClient } = useApp();

  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [industry, setIndustry] = useState(INDUSTRY_OPTIONS[0]);
  const [website, setWebsite] = useState('');
  const [logo, setLogo] = useState(PRESET_LOGOS[0]);
  const [description, setDescription] = useState('');
  const [assignedManagerId, setAssignedManagerId] = useState(teamMembers[0]?.id || '1');
  const [assignedTeamMemberIds, setAssignedTeamMemberIds] = useState<string[]>([teamMembers[0]?.id || '1']);
  const [contractValue, setContractValue] = useState('₹85,000/mo');
  const [slaHours, setSlaHours] = useState(24);
  const [billingSchedule, setBillingSchedule] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');
  const [notes, setNotes] = useState('');
  const [sendInviteNow, setSendInviteNow] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleTeamMember = (memberId: string) => {
    if (assignedTeamMemberIds.includes(memberId)) {
      if (assignedTeamMemberIds.length > 1) {
        setAssignedTeamMemberIds(assignedTeamMemberIds.filter(id => id !== memberId));
      }
    } else {
      setAssignedTeamMemberIds([...assignedTeamMemberIds, memberId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    try {
      addClient({
        name: name.trim(),
        companyName: companyName.trim() || name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        industry,
        website: website.trim() || undefined,
        logo: logo || PRESET_LOGOS[0],
        description: description.trim() || undefined,
        assignedManagerId,
        assignedTeamMemberIds,
        contractValue,
        slaHours: Number(slaHours),
        billingSchedule,
        notes: notes.trim() || undefined,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Onboard New Client</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Set up isolated client workspace, manager & portal access</p>
            </div>
          </div>
          <button
            id="close-add-client-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Company Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> Company Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Client / Brand Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="client-name-input"
                  type="text"
                  required
                  placeholder="e.g. Apex Dynamics"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Legal Entity / Company Name
                </label>
                <input
                  id="client-company-input"
                  type="text"
                  placeholder="e.g. Apex Dynamics Technologies Pvt Ltd"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Contact Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    id="client-email-input"
                    type="email"
                    required
                    placeholder="lead@clientbrand.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    id="client-phone-input"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Industry / Category
                </label>
                <select
                  id="client-industry-select"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer"
                >
                  {INDUSTRY_OPTIONS.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Website URL
                </label>
                <div className="relative">
                  <Globe className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    id="client-website-input"
                    type="url"
                    placeholder="https://clientbrand.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Brand Logo & Avatar
              </label>
              <div className="flex items-center space-x-3">
                <img 
                  src={logo} 
                  alt="Client preview" 
                  className="w-12 h-12 rounded-xl object-cover border-2 border-purple-500/30 p-0.5 bg-slate-100 dark:bg-slate-800 shrink-0" 
                />
                <div className="flex-1 space-y-1.5">
                  <input
                    id="client-logo-url-input"
                    type="text"
                    placeholder="Logo image URL or choose preset below"
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                  <div className="flex items-center space-x-1.5">
                    {PRESET_LOGOS.map((pUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setLogo(pUrl)}
                        className={`w-6 h-6 rounded-md overflow-hidden border transition-all ${logo === pUrl ? 'ring-2 ring-purple-500 border-purple-500' : 'opacity-60 hover:opacity-100 border-slate-300'}`}
                      >
                        <img src={pUrl} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Brand Summary & Scope
              </label>
              <textarea
                id="client-description-input"
                rows={2}
                placeholder="Brief description of the brand, target audience, and primary social goals..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Account Team & SLA */}
          <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Agency Team Assignment & SLA
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dedicated Account Manager <span className="text-rose-500">*</span>
                </label>
                <select
                  id="client-assigned-manager-select"
                  value={assignedManagerId}
                  onChange={(e) => setAssignedManagerId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer"
                >
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.role.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  SLA Approval Response Window
                </label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <select
                    id="client-sla-hours-select"
                    value={slaHours}
                    onChange={(e) => setSlaHours(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer"
                  >
                    <option value={12}>12 Hours (High Priority)</option>
                    <option value={24}>24 Hours (Standard)</option>
                    <option value={48}>48 Hours (Relaxed)</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Assigned Team Collaborators (Content Creators & Copywriters)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {teamMembers.map((member) => {
                  const isSelected = assignedTeamMemberIds.includes(member.id);
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => toggleTeamMember(member.id)}
                      className={`flex items-center space-x-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-700/60 text-purple-900 dark:text-purple-200 shadow-xs' 
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={member.avatar} alt="" className="w-5 h-5 rounded-full object-cover shrink-0" />
                      <div className="min-w-0 flex-1 truncate">
                        <p className="text-[11px] font-bold truncate leading-tight">{member.name}</p>
                        <p className="text-[9px] text-slate-400 truncate">{member.role}</p>
                      </div>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Retainer / Contract Value
                </label>
                <input
                  id="client-contract-value-input"
                  type="text"
                  placeholder="₹75,000/mo or $1,200/mo"
                  value={contractValue}
                  onChange={(e) => setContractValue(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Billing Cycle
                </label>
                <select
                  id="client-billing-schedule-select"
                  value={billingSchedule}
                  onChange={(e) => setBillingSchedule(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="monthly">Monthly Retainer</option>
                  <option value="quarterly">Quarterly Retainer</option>
                  <option value="annual">Annual Contract</option>
                </select>
              </div>
            </div>
          </div>

          {/* Portal Invite Toggle */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 border border-purple-500/20 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Auto-Invite Client Stakeholder</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Generates instant secure Client Portal invitation link</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={sendInviteNow} 
                onChange={(e) => setSendInviteNow(e.target.checked)} 
                className="sr-only peer" 
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              id="cancel-add-client-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="submit-add-client-btn"
              type="submit"
              disabled={isSubmitting || !name.trim() || !email.trim()}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Create Client Workspace</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
