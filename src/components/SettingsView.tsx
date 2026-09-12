import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Key, 
  User, 
  Mail, 
  Lock, 
  Globe, 
  Building2, 
  CheckCircle2, 
  RefreshCw, 
  LogOut, 
  Bell, 
  Sparkles, 
  Share2, 
  Save,
  Check,
  AlertTriangle,
  FileCheck,
  CreditCard,
  Sliders,
  Clock,
  MapPin,
  Compass,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { BillingSettingsTab } from './BillingSettingsTab';
import { AuditLogsTab } from './AuditLogsTab';
import { OwnershipSecurityTab } from './OwnershipSecurityTab';
import { POPULAR_TIMEZONES, getBrowserTimezone, getTimezoneDetails } from '../utils/timeUtils';

export const SettingsView: React.FC = () => {
  const { 
    user, 
    workspace, 
    signOutGoogle, 
    signInWithGoogle, 
    showToast,
    socialAccounts,
    isDarkMode,
    setIsDarkMode,
    teamMembers,
    subscription,
    userTimezone,
    setUserTimezone,
    liveClock,
    currentTime,
    formatDate,
    auditLogs
  } = useApp();

  const [activeTab, setActiveTab] = useState<'billing' | 'general' | 'time_region' | 'audit_logs' | 'ownership'>('ownership');
  const [workspaceName, setWorkspaceName] = useState(workspace.name);
  const [workspaceType, setWorkspaceType] = useState(workspace.type);
  const [autoApproveAI, setAutoApproveAI] = useState(true);
  const [notifySlack, setNotifySlack] = useState(true);
  const [googleMfaRequired, setGoogleMfaRequired] = useState(true);

  // Time & Region local state
  const [selectedTz, setSelectedTz] = useState(userTimezone);
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>('12h');
  const [weekStartsOn, setWeekStartsOn] = useState<'sun' | 'mon'>('mon');
  const [defaultPostTime, setDefaultPostTime] = useState('10:00');

  const detectedBrowserTz = getBrowserTimezone();

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setUserTimezone(selectedTz);
    showToast('Settings Saved', 'Workspace configuration, Time & Region policies updated.', 'success');
  };

  const handleResetToDetectedTimezone = () => {
    setSelectedTz(detectedBrowserTz);
    setUserTimezone(detectedBrowserTz);
    showToast('Timezone Synchronized', `Switched to detected browser timezone: ${detectedBrowserTz}`, 'success');
  };

  const handleReverifyGoogle = () => {
    showToast('Re-verifying Google Session...', 'Connecting to Google OAuth 2.0 Identity servers.', 'info');
    signInWithGoogle({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    });
  };

  return (
    <div id="settings-view" className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-5xl mx-auto text-[#F5F5F0]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-mono-tag text-[10px] text-[#C8FF00] bg-[#C8FF00]/10 px-2 py-0.5 rounded border border-[#C8FF00]/20">SYSTEM GOVERNANCE</span>
            <span className="font-mono text-xs text-[#9A9A9A] flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00]" />
              <span>SSO VERIFIED</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Settings & Workspace
          </h1>
          <p className="text-xs sm:text-sm text-[#9A9A9A] mt-1 font-mono">
            Manage your subscription, plan quotas, billing invoices, Google Workspace identity, and security policies.
          </p>
        </div>

        {activeTab === 'general' && (
          <button
            id="settings-reverify-google-btn"
            onClick={handleReverifyGoogle}
            className="btn-secondary-dark px-4 py-2.5 text-xs font-mono font-bold transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#C8FF00]" />
            <span>Re-verify Google SSO</span>
          </button>
        )}
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-2 overflow-x-auto">
        <button
          id="settings-tab-ownership"
          onClick={() => setActiveTab('ownership')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeTab === 'ownership'
              ? 'bg-[#C8FF00] text-[#080808]'
              : 'text-[#9A9A9A] hover:bg-white/5 hover:text-white'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>Ownership & Security</span>
          <span className={`ml-1 px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
            activeTab === 'ownership' ? 'bg-[#080808] text-[#C8FF00]' : 'bg-white/10 text-white'
          }`}>
            SINGLE OWNER
          </span>
        </button>

        <button
          id="settings-tab-billing"
          onClick={() => setActiveTab('billing')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeTab === 'billing'
              ? 'bg-[#C8FF00] text-[#080808]'
              : 'text-[#9A9A9A] hover:bg-white/5 hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Billing & Subscription</span>
          <span className={`ml-1 px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
            activeTab === 'billing' ? 'bg-[#080808] text-[#C8FF00]' : 'bg-white/10 text-white'
          }`}>
            {subscription.planId.toUpperCase()}
          </span>
        </button>

        <button
          id="settings-tab-time-region"
          onClick={() => setActiveTab('time_region')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeTab === 'time_region'
              ? 'bg-[#C8FF00] text-[#080808]'
              : 'text-[#9A9A9A] hover:bg-white/5 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Time & Region</span>
          <span className={`ml-1 px-1.5 py-0.2 rounded text-[9px] font-mono ${
            activeTab === 'time_region' ? 'bg-[#080808] text-[#C8FF00]' : 'bg-white/10 text-white'
          }`}>
            {liveClock.tzAbbrev}
          </span>
        </button>

        <button
          id="settings-tab-general"
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeTab === 'general'
              ? 'bg-[#C8FF00] text-[#080808]'
              : 'text-[#9A9A9A] hover:bg-white/5 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>General & Policies</span>
        </button>

        <button
          id="settings-tab-audit-logs"
          onClick={() => setActiveTab('audit_logs')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeTab === 'audit_logs'
              ? 'bg-[#C8FF00] text-[#080808]'
              : 'text-[#9A9A9A] hover:bg-white/5 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#C8FF00]" />
          <span>Audit Logs & Security</span>
          {auditLogs && auditLogs.length > 0 && (
            <span className={`ml-1 px-1.5 py-0.2 rounded text-[9px] font-mono ${
              activeTab === 'audit_logs' ? 'bg-[#080808] text-[#C8FF00]' : 'bg-white/10 text-white'
            }`}>
              {auditLogs.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'ownership' && <OwnershipSecurityTab />}

      {activeTab === 'billing' && <BillingSettingsTab />}

      {activeTab === 'audit_logs' && <AuditLogsTab />}

      {activeTab === 'time_region' && (
        <div className="space-y-6 sm:space-y-8">
          {/* Active Timezone Banner Card */}
          <div className="p-6 sm:p-8 rounded-2xl card-brivon space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-[#C8FF00]/10 border border-[#C8FF00]/20 text-[#C8FF00] text-[10px] font-mono-tag font-bold">
                  <Globe className="w-3.5 h-3.5 text-[#C8FF00]" />
                  <span>WORKSPACE GLOBAL TIMEZONE ENGINE</span>
                </div>
                <h3 className="text-xl sm:text-3xl font-display font-extrabold text-white">
                  {selectedTz}
                </h3>
                <p className="text-xs text-[#9A9A9A] max-w-xl font-mono leading-relaxed">
                  All dates, radar countdowns, content scheduling slots, and AI suggestions will be computed and rendered in this active timezone. All database writes remain safely synchronized in UTC.
                </p>
              </div>

              {/* Live Time Display */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#0D0D0D] border border-white/10 shrink-0 space-y-1 text-center md:text-right">
                <span className="text-[10px] font-mono-tag text-[#707070] block">LIVE WORKSPACE CLOCK</span>
                <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[#C8FF00]">
                  {liveClock.timeWithSeconds}
                </div>
                <div className="text-xs text-[#9A9A9A] font-mono">
                  {liveClock.fullDate}
                </div>
                <div className="inline-flex items-center space-x-2 mt-1 px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-[#F5F5F0]">
                  <span>{liveClock.tzAbbrev}</span>
                  <span>•</span>
                  <span>{liveClock.tzOffset}</span>
                </div>
              </div>
            </div>

            {/* Browser Auto-detection comparison */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center space-x-2 text-[#9A9A9A]">
                <MapPin className="w-4 h-4 text-[#C8FF00]" />
                <span>
                  Detected Browser Timezone: <strong className="text-white">{detectedBrowserTz}</strong>
                </span>
                {selectedTz === detectedBrowserTz ? (
                  <span className="px-2 py-0.5 rounded bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/30 font-bold text-[10px]">
                    Active & Synced
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-white/10 text-[#9A9A9A] text-[10px]">
                    Custom Override Active
                  </span>
                )}
              </div>

              {selectedTz !== detectedBrowserTz && (
                <button
                  type="button"
                  onClick={handleResetToDetectedTimezone}
                  className="btn-secondary-dark px-3 py-1.5 text-xs font-bold transition-all flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#C8FF00]" />
                  <span>Sync with Browser</span>
                </button>
              )}
            </div>
          </div>

          {/* Timezone Selection & Region Selector Card */}
          <div className="p-6 rounded-2xl card-brivon space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Compass className="w-4 h-4 text-[#C8FF00]" />
                <h3 className="text-sm font-display font-bold text-white">
                  Select Workspace Timezone & Region
                </h3>
              </div>
              <span className="text-xs font-mono text-[#707070]">
                {POPULAR_TIMEZONES.length} Regions Available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {POPULAR_TIMEZONES.map((tz) => {
                const isSelected = selectedTz === tz.value;
                const details = getTimezoneDetails(tz.value);
                return (
                  <button
                    key={tz.value}
                    type="button"
                    onClick={() => {
                      setSelectedTz(tz.value);
                      setUserTimezone(tz.value);
                      showToast('Timezone Updated', `Switched workspace active timezone to ${tz.city} (${tz.value})`, 'success');
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-start justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#151515] border-[#C8FF00] ring-1 ring-[#C8FF00]'
                        : 'bg-[#0E0E0E] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5">
                        <Globe className="w-3.5 h-3.5 text-[#C8FF00]" />
                        <span className="font-bold text-xs text-white">
                          {tz.city}
                        </span>
                        <span className="text-[10px] text-[#707070]">({tz.country})</span>
                      </div>
                      <p className="text-[11px] text-[#9A9A9A] font-mono">
                        {tz.value}
                      </p>
                      <div className="flex items-center space-x-1 text-[10px] font-mono text-[#707070]">
                        <span>{details.abbrev}</span>
                        <span>•</span>
                        <span>{details.offset}</span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="w-5 h-5 rounded bg-[#C8FF00] text-[#080808] flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom IANA Input */}
            <div className="pt-4 border-t border-white/10">
              <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">
                MANUAL IANA TIMEZONE IDENTIFIER
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={selectedTz}
                  onChange={(e) => setSelectedTz(e.target.value)}
                  placeholder="e.g. America/Toronto, Australia/Sydney, Asia/Tokyo..."
                  className="input-brivon flex-1 px-4 py-2.5 rounded-xl text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    setUserTimezone(selectedTz);
                    showToast('Timezone Applied', `Workspace set to ${selectedTz}`, 'success');
                  }}
                  className="btn-lime px-4 py-2.5 text-xs font-bold cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          {/* Regional Formatting Preferences */}
          <div className="p-6 rounded-2xl card-brivon space-y-4">
            <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
              <Layers className="w-4 h-4 text-[#C8FF00]" />
              <h3 className="text-sm font-display font-bold text-white">
                Regional Formatting & Schedule Preferences
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1">
                  TIME FORMAT
                </label>
                <select
                  value={timeFormat}
                  onChange={(e) => setTimeFormat(e.target.value as any)}
                  className="input-brivon w-full px-3.5 py-2.5 rounded-xl text-xs font-mono"
                >
                  <option value="12h" className="bg-[#111111] text-white">12-Hour (e.g. 10:30 AM / 06:15 PM)</option>
                  <option value="24h" className="bg-[#111111] text-white">24-Hour Military (e.g. 10:30 / 18:15)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1">
                  CALENDAR WEEK STARTS ON
                </label>
                <select
                  value={weekStartsOn}
                  onChange={(e) => setWeekStartsOn(e.target.value as any)}
                  className="input-brivon w-full px-3.5 py-2.5 rounded-xl text-xs font-mono"
                >
                  <option value="mon" className="bg-[#111111] text-white">Monday (Standard)</option>
                  <option value="sun" className="bg-[#111111] text-white">Sunday (North America / Middle East)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1">
                  DEFAULT PUBLISHING SLOT
                </label>
                <input
                  type="time"
                  value={defaultPostTime}
                  onChange={(e) => setDefaultPostTime(e.target.value)}
                  className="input-brivon w-full px-3.5 py-2.5 rounded-xl text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'general' && (
        <div className="space-y-6 sm:space-y-8">
          {/* Google Verified Identity Card */}
          <div className="p-6 sm:p-8 rounded-2xl card-brivon space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center space-x-4">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-16 h-16 rounded-xl object-cover border border-white/10 shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#080808] flex items-center justify-center border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-[#C8FF00]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-display font-bold text-white">{user.name}</h3>
                    <span className="font-mono-tag text-[9px] px-2 py-0.5 rounded bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/20 uppercase">
                      {user.role}
                    </span>
                  </div>
                  <p className="text-xs text-[#9A9A9A] font-mono flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{user.email}</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs text-[#707070]">
                    <span className="text-[#C8FF00]">✓ SSO Verified</span>
                    <span>•</span>
                    <span>Workspace: {workspace.name}</span>
                  </div>
                </div>
              </div>

              <button
                id="settings-signout-btn"
                onClick={signOutGoogle}
                className="btn-secondary-dark px-4 py-2.5 text-xs font-mono font-bold flex items-center space-x-2 cursor-pointer text-rose-400 hover:text-rose-300"
              >
                <LogOut className="w-4 h-4" />
                <span>Switch / Sign Out</span>
              </button>
            </div>
          </div>

          {/* Main Form Sections */}
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="p-6 rounded-2xl card-brivon space-y-4">
              <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
                <Building2 className="w-4 h-4 text-[#C8FF00]" />
                <h3 className="text-sm font-display font-bold text-white">Workspace Profile</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1">
                    WORKSPACE NAME
                  </label>
                  <input
                    id="settings-workspace-name"
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="input-brivon w-full px-3.5 py-2.5 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1">
                    ORGANIZATION CATEGORY
                  </label>
                  <select
                    id="settings-workspace-type"
                    value={workspaceType}
                    onChange={(e) => setWorkspaceType(e.target.value as any)}
                    className="input-brivon w-full px-3.5 py-2.5 rounded-xl text-xs font-mono"
                  >
                    <option value="college" className="bg-[#111111] text-white">College / Educational Institute</option>
                    <option value="business" className="bg-[#111111] text-white">Enterprise Business</option>
                    <option value="agency" className="bg-[#111111] text-white">Digital Creative Agency</option>
                    <option value="creator" className="bg-[#111111] text-white">Content Creator Team</option>
                    <option value="startup" className="bg-[#111111] text-white">Technology Startup</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Security & Authentication Policies */}
            <div className="p-6 rounded-2xl card-brivon space-y-4">
              <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
                <Lock className="w-4 h-4 text-[#C8FF00]" />
                <h3 className="text-sm font-display font-bold text-white">Security & Google Identity Policies</h3>
              </div>

              <div className="space-y-3">
                <label className="flex items-start justify-between p-3.5 rounded-xl bg-[#0D0D0D] border border-white/5 cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white">
                      Enforce Google 2-Step Verification for all team members
                    </span>
                    <p className="text-[11px] font-mono text-[#707070]">
                      Requires all staff members joining the workspace to log in using verified Google credentials.
                    </p>
                  </div>
                  <input
                    id="toggle-google-mfa"
                    type="checkbox"
                    checked={googleMfaRequired}
                    onChange={(e) => setGoogleMfaRequired(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-[#C8FF00] rounded"
                  />
                </label>

                <label className="flex items-start justify-between p-3.5 rounded-xl bg-[#0D0D0D] border border-white/5 cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white">
                      Auto-flag AI content for review before publishing
                    </span>
                    <p className="text-[11px] font-mono text-[#707070]">
                      Ensures all AI-generated copy undergoes human approval before scheduled dispatch.
                    </p>
                  </div>
                  <input
                    id="toggle-auto-ai-flag"
                    type="checkbox"
                    checked={autoApproveAI}
                    onChange={(e) => setAutoApproveAI(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-[#C8FF00] rounded"
                  />
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                id="settings-save-submit-btn"
                className="btn-lime px-6 py-3 text-xs font-bold flex items-center space-x-2 cursor-pointer shadow-lg shadow-[#C8FF00]/10"
              >
                <Save className="w-4 h-4 text-[#080808]" />
                <span>Save Workspace Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
