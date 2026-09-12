import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  Clock, 
  Shield, 
  CheckCircle2, 
  MessageSquare, 
  Save, 
  User, 
  Lock,
  Sparkles,
  ExternalLink,
  Camera,
  Layers
} from 'lucide-react';
import { POPULAR_TIMEZONES } from '../../utils/timeUtils';

export const ClientProfileView: React.FC = () => {
  const { 
    activeClient, 
    updateClient, 
    setActiveView, 
    userTimezone, 
    setUserTimezone, 
    showToast,
    user 
  } = useApp();

  const [name, setName] = useState(activeClient?.name || 'ABC Education Group');
  const [email, setEmail] = useState(activeClient?.email || 'stakeholder@abcedu.org');
  const [phone, setPhone] = useState(activeClient?.phone || '+91 98765 43210');
  const [industry, setIndustry] = useState(activeClient?.industry || 'Higher Education & Tech');
  const [website, setWebsite] = useState(activeClient?.website || 'https://abcedu.org');
  const [description, setDescription] = useState(
    activeClient?.description || 'Premier educational institution providing advanced engineering and research programs across Maharashtra.'
  );
  const [logoUrl, setLogoUrl] = useState(activeClient?.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClient) return;

    setIsSaving(true);
    try {
      updateClient(activeClient.id, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        industry: industry.trim(),
        website: website.trim(),
        description: description.trim(),
        logo: logoUrl.trim()
      });
      showToast('Client profile updated successfully', 'success');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Client Profile & Brand Settings
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
            {activeClient?.name || 'Verified Client'}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your organizational contact details, brand metadata, and view dedicated agency points of contact.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Editable Profile Form */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-600" />
                Organization Details
              </h2>
              <span className="text-xs text-slate-400">Client ID: {activeClient?.id || 'client-1'}</span>
            </div>

            {/* Brand Logo & Basic Identifiers */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <img 
                  src={logoUrl} 
                  alt="Brand Logo" 
                  className="w-24 h-24 rounded-3xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-md bg-white" 
                />
              </div>

              <div className="flex-1 w-full space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Brand / Organization Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Logo Image URL
                  </label>
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Contact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Stakeholder Official Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400" /> Industry / Vertical
                </label>
                <input
                  type="text"
                  required
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" /> Official Website
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                />
              </div>
            </div>

            {/* Timezone Preference */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Preferred Operating Timezone
              </label>
              <select
                value={userTimezone}
                onChange={(e) => setUserTimezone(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:outline-none cursor-pointer"
              >
                {POPULAR_TIMEZONES.map(tz => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label} ({tz.offset})
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                About / Brand Positioning Summary
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:outline-none leading-relaxed"
              />
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-500/20 flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Dedicated Account Lead & Security Boundary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Account Manager Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
              Dedicated Account Leadership
            </span>

            <div className="flex items-center space-x-3.5">
              <img 
                src={activeClient?.assignedManager?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                alt="" 
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs" 
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {activeClient?.assignedManager?.name || 'Aarav Sharma'}
                </h3>
                <p className="text-xs text-slate-400">Senior Account Director</p>
                <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
                  aarav@socially.agency
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">SLA Response Window:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">&lt; {activeClient?.slaHours || 24} hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Contract Status:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">{activeClient?.status || 'Active'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveView('client_messages')}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer border border-purple-200 dark:border-purple-800/60"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Direct Chat with Account Lead</span>
            </button>
          </div>

          {/* RBAC Boundary Notification */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-bold text-xs">
              <Lock className="w-4 h-4 text-slate-400" />
              <span>Client Security & Permissions</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              As a client stakeholder, you have full access to inspect content, request revisions, sign off on schedules, review brand guidelines, and download monthly analytics. Workspace billing, team management, and internal operational chats remain managed by the agency team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
