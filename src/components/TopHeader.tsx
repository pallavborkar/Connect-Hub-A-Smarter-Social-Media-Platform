import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { usePermissions } from '../hooks/usePermissions';
import { ROLE_CONFIGS } from '../config/permissions';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Plus, 
  Sparkles, 
  Calendar, 
  CheckSquare, 
  FileText, 
  Check, 
  LogOut, 
  Settings, 
  ChevronDown,
  Building2,
  ExternalLink,
  Share2,
  CheckCircle2,
  Layers,
  ArrowRight,
  TrendingUp,
  Menu,
  Clock,
  Globe,
  Shield,
  UserCheck,
  Briefcase,
  GraduationCap,
  Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SocialPlatform, RoleType } from '../types';
import { POPULAR_TIMEZONES } from '../utils/timeUtils';

export const TopHeader: React.FC = () => {
  const {
    workspace,
    user,
    workspaces,
    userWorkspaces,
    switchWorkspace,
    createWorkspace,
    switchUserRole,
    isDarkMode,
    setIsDarkMode,
    setIsCommandPaletteOpen,
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    activeView,
    setActiveView,
    setIsStudioModalOpen,
    setStudioInitialDraft,
    setAuthModalOpen,
    setAuthMode,
    currentGreeting,
    wittySubtext,
    socialAccounts,
    selectedAccountId,
    setSelectedAccountId,
    triggerAIEventSuggestions,
    setIsMobileDrawerOpen,
    signOutGoogle,
    userTimezone,
    setUserTimezone,
    liveClock,
    formatRelative,
    showToast,
    isClientViewMode,
    exitClientViewMode,
    activeClient
  } = useApp();

  const { currentRole, roleConfig, isOwner } = usePermissions();

  const [notifOpen, setNotifOpen] = useState(false);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [timezoneMenuOpen, setTimezoneMenuOpen] = useState(false);
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  // New workspace modal state
  const [isNewWsModalOpen, setIsNewWsModalOpen] = useState(false);
  const [newWsName, setNewWsName] = useState('');
  const [newWsType, setNewWsType] = useState<'college' | 'agency' | 'business' | 'creator' | 'startup'>('agency');

  const notifRef = useRef<HTMLDivElement>(null);
  const createRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const timezoneRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (createRef.current && !createRef.current.contains(event.target as Node)) {
        setCreateMenuOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
      if (timezoneRef.current && !timezoneRef.current.contains(event.target as Node)) {
        setTimezoneMenuOpen(false);
      }
      if (workspaceRef.current && !workspaceRef.current.contains(event.target as Node)) {
        setWorkspaceMenuOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setRoleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName.trim()) return;
    try {
      createWorkspace(newWsName.trim(), newWsType);
      setIsNewWsModalOpen(false);
      setNewWsName('');
    } catch (err) {
      // Error toast handled in context
    }
  };

  const getRoleIcon = (role: RoleType) => {
    switch (role) {
      case 'owner':
        return Crown;
      case 'manager':
        return Shield;
      case 'student':
        return GraduationCap;
      case 'client':
        return Briefcase;
      default:
        return UserCheck;
    }
  };

  const RoleIcon = getRoleIcon(currentRole);

  const activeAccount = socialAccounts.find(a => a.id === selectedAccountId);

  const getPlatformBadge = (platform: SocialPlatform) => {
    switch (platform) {
      case 'instagram':
        return { name: 'IG', color: 'bg-pink-500 text-white' };
      case 'linkedin':
        return { name: 'LI', color: 'bg-blue-600 text-white' };
      case 'youtube':
        return { name: 'YT', color: 'bg-red-600 text-white' };
      case 'facebook':
        return { name: 'FB', color: 'bg-blue-700 text-white' };
      case 'x':
        return { name: 'X', color: 'bg-slate-900 text-white' };
      case 'tiktok':
        return { name: 'TT', color: 'bg-black text-white' };
    }
  };

  return (
    <header id="top-header" className="sticky top-0 z-30 h-16 bg-[#080808]/90 backdrop-blur-md border-b border-white/10 px-3 sm:px-6 flex items-center justify-between transition-colors gap-2 text-[#F5F5F0]">
      {/* Left section: Hamburger button, Workspace & Account Switcher */}
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
        {/* Mobile menu toggle */}
        <button
          id="header-mobile-menu-toggle"
          onClick={() => setIsMobileDrawerOpen(prev => !prev)}
          className="lg:hidden p-2 -ml-1 text-[#9A9A9A] hover:text-white hover:bg-white/5 rounded-lg transition-colors shrink-0"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Interactive Workspace Switcher Dropdown */}
        <div className="relative shrink-0" ref={workspaceRef}>
          <button
            id="header-workspace-switcher-btn"
            onClick={() => setWorkspaceMenuOpen(prev => !prev)}
            className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-white/5 transition-colors text-left cursor-pointer group border border-transparent hover:border-white/10"
            title="Switch Workspace"
          >
            <div className="w-8 h-8 rounded-lg bg-[#C8FF00] flex items-center justify-center text-[#080808] shadow-sm font-black text-sm shrink-0">
              {workspace.name.charAt(0)}
            </div>
            <div className="hidden xs:block min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-white truncate max-w-[120px] sm:max-w-[150px]">{workspace.name}</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono-tag font-bold bg-white/10 text-[#9A9A9A] uppercase hidden sm:inline-block">
                  {workspace.type}
                </span>
                <ChevronDown className="w-3 h-3 text-[#707070] group-hover:text-white shrink-0" />
              </div>
              <p className="font-mono-tag text-[10px] text-[#707070] hidden md:block truncate max-w-[150px]">
                {currentGreeting}
              </p>
            </div>
          </button>

          <AnimatePresence>
            {workspaceMenuOpen && (
              <motion.div
                id="header-workspace-menu"
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.12 }}
                className="absolute left-0 mt-2 w-80 bg-[#111111] rounded-xl shadow-2xl border border-white/10 py-2 z-50 text-xs text-[#F5F5F0]"
              >
                <div className="px-3.5 py-2 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#C8FF00]" />
                    <span className="font-mono-tag text-[10px] font-bold text-white uppercase tracking-wider">
                      Workspaces ({userWorkspaces.length})
                    </span>
                  </div>
                  {isOwner && (
                    <button
                      id="ws-create-btn"
                      onClick={() => {
                        setWorkspaceMenuOpen(false);
                        setIsNewWsModalOpen(true);
                      }}
                      className="font-mono-tag text-[10px] text-[#C8FF00] font-bold hover:underline"
                    >
                      + NEW
                    </button>
                  )}
                </div>

                <div className="max-h-60 overflow-y-auto py-1 divide-y divide-white/5">
                  {userWorkspaces.map(wsMem => {
                    const isSelected = workspace.id === wsMem.workspaceId;
                    const wsDetails = workspaces.find(w => w.id === wsMem.workspaceId) || workspace;
                    const memRoleConfig = ROLE_CONFIGS[wsMem.role] || ROLE_CONFIGS.owner;

                    return (
                      <button
                        key={wsMem.workspaceId}
                        id={`ws-switch-${wsMem.workspaceId}`}
                        onClick={() => {
                          switchWorkspace(wsMem.workspaceId);
                          setWorkspaceMenuOpen(false);
                        }}
                        className={`w-full px-3.5 py-2.5 flex items-center justify-between hover:bg-white/5 transition-colors text-left cursor-pointer ${
                          isSelected ? 'bg-white/5' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center text-white font-bold text-xs shrink-0">
                            {wsMem.workspaceName.charAt(0)}
                          </div>
                          <div className="truncate">
                            <p className="font-bold text-white text-xs truncate">
                              {wsMem.workspaceName}
                            </p>
                            <div className="flex items-center space-x-1.5 font-mono-tag text-[9px] text-[#707070] mt-0.5">
                              <span className="capitalize">{wsMem.workspaceType}</span>
                              <span>•</span>
                              <span className="text-[#C8FF00]">
                                {memRoleConfig.name}
                              </span>
                            </div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#C8FF00] shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>

                <div className="p-2 border-t border-white/10 bg-[#0D0D0D] text-center">
                  <button
                    onClick={() => {
                      setActiveView('settings');
                      setWorkspaceMenuOpen(false);
                    }}
                    className="font-mono-tag text-[10px] font-bold text-[#C8FF00] hover:underline flex items-center justify-center space-x-1 mx-auto"
                  >
                    <span>MANAGE WORKSPACE SETTINGS →</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-white/10 hidden sm:block shrink-0" />

        {/* Global Multi-Account Switcher */}
        <div className="relative shrink min-w-0" ref={accountRef}>
          <button
            id="header-account-selector-btn"
            onClick={() => setAccountMenuOpen(prev => !prev)}
            className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 py-1.5 rounded-lg border border-white/10 bg-[#111111] hover:border-white/20 text-xs transition-all cursor-pointer max-w-[140px] sm:max-w-[200px]"
            title="Switch active social account"
          >
            {activeAccount ? (
              <div className="flex items-center space-x-1.5 min-w-0 truncate">
                <span className={`w-4 h-4 rounded text-[8px] font-bold flex items-center justify-center shrink-0 ${getPlatformBadge(activeAccount.platform).color}`}>
                  {getPlatformBadge(activeAccount.platform).name}
                </span>
                <span className="font-semibold text-white truncate text-xs">
                  {activeAccount.handle}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 min-w-0 truncate">
                <Layers className="w-3.5 h-3.5 text-[#C8FF00] shrink-0" />
                <span className="font-semibold text-white truncate text-xs">
                  All ({socialAccounts.filter(a => a.isConnected).length})
                </span>
              </div>
            )}
            <ChevronDown className="w-3 h-3 text-[#707070] shrink-0 ml-auto" />
          </button>

          <AnimatePresence>
            {accountMenuOpen && (
              <motion.div
                id="header-account-menu"
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.12 }}
                className="absolute left-0 mt-2 w-72 max-w-[calc(100vw-1.5rem)] bg-[#111111] rounded-xl shadow-2xl border border-white/10 py-2 z-50 text-xs text-[#F5F5F0]"
              >
                <div className="px-3 py-1.5 border-b border-white/10 flex items-center justify-between">
                  <span className="font-mono-tag text-[9px] font-bold uppercase tracking-wider text-[#707070]">
                    CHANNELS ({socialAccounts.length} LINKED)
                  </span>
                  <button
                    onClick={() => {
                      setActiveView('accounts');
                      setAccountMenuOpen(false);
                    }}
                    className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                  >
                    + Add Account
                  </button>
                </div>

                <div className="max-h-64 overflow-y-auto py-1">
                  {/* Option: All accounts */}
                  <button
                    id="account-option-all"
                    onClick={() => {
                      setSelectedAccountId('all');
                      setAccountMenuOpen(false);
                    }}
                    className={`w-full px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors ${
                      selectedAccountId === 'all' ? 'bg-indigo-50/50 dark:bg-indigo-950/40 font-bold text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold text-xs">
                        <Layers className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-slate-900 dark:text-white text-xs">All Social Accounts</p>
                        <p className="text-[10px] text-slate-400">Aggregated multi-platform metrics</p>
                      </div>
                    </div>
                    {selectedAccountId === 'all' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                  {/* Individual Accounts List */}
                  {socialAccounts.map((acc) => {
                    const badge = getPlatformBadge(acc.platform);
                    const isSelected = selectedAccountId === acc.id;
                    return (
                      <button
                        key={acc.id}
                        id={`account-option-${acc.id}`}
                        onClick={() => {
                          setSelectedAccountId(acc.id);
                          setAccountMenuOpen(false);
                        }}
                        className={`w-full px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors ${
                          isSelected ? 'bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <img
                            src={acc.avatar}
                            alt={acc.handle}
                            className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                          />
                          <div className="text-left truncate">
                            <div className="flex items-center space-x-1.5">
                              <span className={`w-3.5 h-3.5 rounded text-[8px] font-bold flex items-center justify-center ${badge.color}`}>
                                {badge.name}
                              </span>
                              <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                {acc.handle}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
                              <span>{acc.category || acc.accountName}</span>
                              <span>•</span>
                              <span>{(acc.followers / 1000).toFixed(1)}k followers</span>
                            </div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>

                <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-center">
                  <button
                    onClick={() => {
                      setActiveView('analytics');
                      setAccountMenuOpen(false);
                    }}
                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-center space-x-1 mx-auto"
                  >
                    <span>View Account Analytics</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Center Search trigger */}
      <div className="flex-1 max-w-sm mx-4 hidden lg:block">
        <button
          id="header-search-trigger"
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-400 text-xs hover:border-indigo-400/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-2xs"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search posts, tasks, events, AI prompt lab...</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px] font-mono text-slate-500">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Interactive RBAC Role Tester / Simulator Dropdown */}
        <div className="relative" ref={roleRef}>
          <button
            id="header-role-switcher-btn"
            onClick={() => setRoleMenuOpen(prev => !prev)}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs ${roleConfig.badgeColor}`}
            title={`Active Role: ${roleConfig.name}. Click to switch role simulator.`}
          >
            <RoleIcon className="w-3.5 h-3.5 shrink-0" />
            <span className="capitalize">{currentRole}</span>
            <ChevronDown className="w-3 h-3 opacity-70 shrink-0" />
          </button>

          <AnimatePresence>
            {roleMenuOpen && (
              <motion.div
                id="header-role-menu"
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 text-xs"
              >
                <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-1.5">
                    <Shield className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                      RBAC Role Simulator
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Switch personas in real time to verify access permissions across views & resources.
                  </p>
                </div>

                <div className="p-1 space-y-1">
                  {(Object.keys(ROLE_CONFIGS) as RoleType[]).map((rKey) => {
                    const cfg = ROLE_CONFIGS[rKey];
                    const isSelected = currentRole === rKey;
                    const Icon = getRoleIcon(rKey);

                    return (
                      <button
                        key={rKey}
                        id={`role-select-${rKey}`}
                        onClick={() => {
                          switchUserRole(rKey);
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full p-2.5 rounded-xl flex items-start space-x-2.5 transition-all text-left cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/80'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${cfg.badgeColor}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 dark:text-white text-xs">{cfg.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                            {cfg.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-center">
                  <button
                    onClick={() => {
                      setActiveView('team');
                      setRoleMenuOpen(false);
                    }}
                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-center space-x-1 mx-auto"
                  >
                    <span>View Team Permissions Matrix</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Live Clock & Timezone Switcher Pill */}
        <div className="relative" ref={timezoneRef}>
          <button
            id="header-live-clock-btn"
            onClick={() => setTimezoneMenuOpen(prev => !prev)}
            className="flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs transition-all cursor-pointer shadow-2xs group"
            title={`Active Timezone: ${userTimezone} (${liveClock.tzAbbrev}, ${liveClock.tzOffset}). Click to switch timezone.`}
          >
            <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0 group-hover:rotate-45 transition-transform" />
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">
              {liveClock.time}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50 hidden md:inline-block">
              {liveClock.tzAbbrev}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          <AnimatePresence>
            {timezoneMenuOpen && (
              <motion.div
                id="header-timezone-menu"
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 text-xs"
              >
                <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <Globe className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100">
                      Workspace Timezone
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {liveClock.tzOffset}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex justify-between items-center mb-1">
                    <span>Live Clock:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{liveClock.timeWithSeconds}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span>Today's Date:</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{liveClock.date}</span>
                  </div>
                </div>

                <div className="max-h-56 overflow-y-auto py-1">
                  {POPULAR_TIMEZONES.map((tz) => {
                    const isSelected = userTimezone === tz.value;
                    return (
                      <button
                        key={tz.value}
                        onClick={() => {
                          setUserTimezone(tz.value);
                          setTimezoneMenuOpen(false);
                        }}
                        className={`w-full px-3 py-1.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-left ${
                          isSelected ? 'bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="truncate">
                          <p className="text-xs truncate">{tz.label}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{tz.offset} • {tz.abbreviation}</p>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>

                <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-center">
                  <button
                    onClick={() => {
                      setActiveView('settings');
                      setTimezoneMenuOpen(false);
                    }}
                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-center space-x-1 mx-auto"
                  >
                    <span>Time & Region Settings</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* AI Radar Proactive Button */}
        <button
          id="header-ai-radar-btn"
          onClick={triggerAIEventSuggestions}
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#C8FF00]/10 border border-[#C8FF00]/30 text-[#C8FF00] hover:bg-[#C8FF00]/20 text-xs font-mono-tag font-bold transition-all shadow-2xs cursor-pointer"
          title="Scan upcoming days and generate AI post angles"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C8FF00] animate-pulse" />
          <span>AI RADAR</span>
        </button>

        {/* Quick Create Dropdown */}
        <div className="relative" ref={createRef}>
          <button
            id="header-create-btn"
            onClick={() => setCreateMenuOpen(prev => !prev)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#C8FF00] hover:bg-[#D4FF35] text-[#080808] rounded-lg text-xs font-mono-tag font-bold shadow-xs transition-all active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#080808]" />
            <span className="hidden sm:inline">CREATE</span>
            <ChevronDown className="w-3 h-3 text-[#080808] opacity-80" />
          </button>

          <AnimatePresence>
            {createMenuOpen && (
              <motion.div
                id="header-create-menu"
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 mt-2 w-56 bg-[#111111] rounded-xl shadow-xl border border-white/10 py-1.5 z-50 text-xs font-medium text-[#F5F5F0]"
              >
                <button
                  id="create-menu-post"
                  onClick={() => {
                    setStudioInitialDraft(null);
                    setIsStudioModalOpen(true);
                    setCreateMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3.5 py-2 hover:bg-white/5 space-x-2.5 transition-colors text-left"
                >
                  <FileText className="w-4 h-4 text-[#C8FF00]" />
                  <div>
                    <p className="font-bold text-white">New Social Post</p>
                    <p className="font-mono-tag text-[9px] text-[#707070]">Multi-platform reel or image</p>
                  </div>
                </button>

                <button
                  id="create-menu-ai-idea"
                  onClick={() => {
                    setActiveView('ai_assistant');
                    setCreateMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3.5 py-2 hover:bg-white/5 space-x-2.5 transition-colors text-left"
                >
                  <Sparkles className="w-4 h-4 text-[#C8FF00]" />
                  <div>
                    <p className="font-bold text-white">AI Prompt Lab</p>
                    <p className="font-mono-tag text-[9px] text-[#707070]">Viral reels, scripts & hooks</p>
                  </div>
                </button>

                <button
                  id="create-menu-task"
                  onClick={() => {
                    setActiveView('tasks');
                    setCreateMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3.5 py-2 hover:bg-white/5 space-x-2.5 transition-colors text-left"
                >
                  <CheckSquare className="w-4 h-4 text-[#C8FF00]" />
                  <div>
                    <p className="font-bold text-white">Assign Team Task</p>
                    <p className="font-mono-tag text-[9px] text-[#707070]">Deadlines and deliverables</p>
                  </div>
                </button>

                <button
                  id="create-menu-event"
                  onClick={() => {
                    setActiveView('events');
                    setCreateMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3.5 py-2 hover:bg-white/5 space-x-2.5 transition-colors text-left"
                >
                  <Calendar className="w-4 h-4 text-[#C8FF00]" />
                  <div>
                    <p className="font-bold text-white">Custom Event / Day</p>
                    <p className="font-mono-tag text-[9px] text-[#707070]">Festivals & campaign dates</p>
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dark Mode Toggle */}
        <button
          id="header-theme-toggle"
          onClick={() => {
            const nextMode = !isDarkMode;
            setIsDarkMode(nextMode);
            showToast(
              nextMode ? 'Dark Mode Activated' : 'Light Mode Activated',
              nextMode ? 'Switched to eye-safe dark theme' : 'Switched to crisp light theme',
              'info'
            );
          }}
          className="p-2 rounded-lg text-[#9A9A9A] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Toggle theme"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-[#C8FF00]" /> : <Moon className="w-4 h-4 text-[#9A9A9A]" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            id="header-notifications-btn"
            onClick={() => setNotifOpen(prev => !prev)}
            className="p-2 rounded-lg text-[#9A9A9A] hover:text-white hover:bg-white/5 transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C8FF00] animate-pulse" />
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                id="header-notifications-menu"
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#111111] rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50 text-[#F5F5F0]"
              >
                <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-[#151515]">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-bold text-white">NOTIFICATIONS & ALERTS</h4>
                    {unreadNotificationsCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded bg-[#C8FF00] text-[#080808] font-mono-tag text-[9px] font-bold">
                        {unreadNotificationsCount} NEW
                      </span>
                    )}
                  </div>
                  {unreadNotificationsCount > 0 && (
                    <button
                      id="notif-mark-all-read"
                      onClick={markAllNotificationsRead}
                      className="font-mono-tag text-[10px] text-[#C8FF00] hover:underline flex items-center space-x-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>MARK READ</span>
                    </button>
                  )}
                </div>

                <div className="max-h-84 overflow-y-auto divide-y divide-white/5">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#707070]">
                      <p className="italic">"Operations running smooth. No new alerts."</p>
                    </div>
                  ) : (
                    notifications.map(n => {
                      const isAi = n.type === 'ai_suggestion';
                      return (
                        <div
                          key={n.id}
                          className={`p-3.5 hover:bg-white/5 transition-colors flex items-start space-x-3 ${
                            !n.isRead ? 'bg-white/5' : ''
                          }`}
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-[#C8FF00]"
                            style={{ opacity: n.isRead ? 0 : 1 }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-xs font-bold truncate text-white">
                                {n.title}
                              </span>
                              <span className="font-mono-tag text-[9px] text-[#707070] shrink-0 ml-1">{n.timestamp}</span>
                            </div>
                            <p className="text-xs text-[#9A9A9A] leading-snug">{n.message}</p>
                            
                            {n.aiSuggestedIdea && (
                              <div className="mt-2 p-2.5 rounded-lg bg-[#181818] border border-white/10 text-[11px] space-y-1">
                                <p className="font-semibold text-white">
                                  💡 Hook: {n.aiSuggestedIdea.hook}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {n.aiSuggestedIdea.hashtags.slice(0, 3).map((tag, idx) => (
                                    <span key={idx} className="font-mono-tag text-[9px] text-[#C8FF00]">
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {n.actionText && (
                              <button
                                onClick={() => {
                                  markNotificationRead(n.id);
                                  if (n.aiSuggestedIdea) {
                                    setStudioInitialDraft({
                                      title: n.aiSuggestedIdea.title,
                                      caption: n.aiSuggestedIdea.caption,
                                      hashtags: n.aiSuggestedIdea.hashtags,
                                      platforms: n.aiSuggestedIdea.suggestedPlatforms || ['instagram'],
                                      contentType: n.aiSuggestedIdea.contentType || 'post',
                                    });
                                    setIsStudioModalOpen(true);
                                  } else if (n.actionView) {
                                    setActiveView(n.actionView as any);
                                  }
                                  setNotifOpen(false);
                                daylight:
                                  setNotifOpen(false);
                                }}
                                className="inline-flex items-center space-x-1 font-mono-tag text-[10px] font-bold mt-2 text-[#C8FF00] hover:underline"
                              >
                                <span>{n.actionText} →</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="p-2.5 bg-[#0D0D0D] border-t border-white/10 text-center">
                  <button
                    id="notif-view-all"
                    onClick={() => {
                      setActiveView('notifications');
                      setNotifOpen(false);
                    }}
                    className="font-mono-tag text-[10px] font-bold text-[#C8FF00] hover:underline"
                  >
                    VIEW ALL NOTIFICATIONS →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Avatar Menu */}
        <div className="relative" ref={userRef}>
          <button
            id="header-user-btn"
            onClick={() => setUserMenuOpen(prev => !prev)}
            className="flex items-center space-x-2 p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-white/20"
            />
            <span className="text-xs font-semibold text-white hidden lg:inline-block">
              {user.name.split(' ')[0]}
            </span>
            <ChevronDown className="w-3 h-3 text-[#707070] hidden lg:inline-block" />
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                id="header-user-menu"
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 mt-2 w-64 bg-[#111111] rounded-xl shadow-2xl border border-white/10 py-1.5 z-50 text-xs text-[#F5F5F0]"
              >
                <div className="px-3.5 py-2.5 border-b border-white/10">
                  <div className="flex items-center space-x-1.5 mb-0.5">
                    <p className="font-bold text-white">{user.name}</p>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00] shrink-0" />
                  </div>
                  <p className="font-mono-tag text-[10px] text-[#707070] truncate">{user.email}</p>
                  <div className="flex items-center space-x-1.5 mt-2">
                    <span className="inline-block px-2 py-0.5 rounded bg-white/10 font-mono-tag text-[9px] font-bold uppercase tracking-wide text-[#C8FF00]">
                      {roleConfig.name}
                    </span>
                    <span className="font-mono-tag text-[9px] font-medium text-[#9A9A9A] bg-white/5 px-1.5 py-0.5 rounded">
                      Google SSO
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    id="user-menu-settings"
                    onClick={() => {
                      setActiveView('settings');
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center px-3.5 py-2 hover:bg-white/5 text-[#9A9A9A] hover:text-white space-x-2 text-left"
                  >
                    <Settings className="w-4 h-4 text-[#707070]" />
                    <span>Workspace & Security</span>
                  </button>

                  <button
                    id="user-menu-team"
                    onClick={() => {
                      setActiveView('team');
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center px-3.5 py-2 hover:bg-white/5 text-[#9A9A9A] hover:text-white space-x-2 text-left"
                  >
                    <Shield className="w-4 h-4 text-[#707070]" />
                    <span>Team Roles & Permissions</span>
                  </button>

                  <button
                    id="user-menu-landing"
                    onClick={() => {
                      setActiveView('landing');
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center px-3.5 py-2 hover:bg-white/5 text-[#9A9A9A] hover:text-white space-x-2 text-left"
                  >
                    <Building2 className="w-4 h-4 text-[#707070]" />
                    <span>Public Landing Page</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-white/10">
                  <button
                    id="user-menu-logout"
                    onClick={() => {
                      setUserMenuOpen(false);
                      signOutGoogle();
                    }}
                    className="w-full flex items-center px-3.5 py-2 hover:bg-red-500/10 text-red-400 space-x-2 font-mono-tag text-[10px] font-bold text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>SIGN OUT →</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* New Workspace Modal */}
      <AnimatePresence>
        {isNewWsModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#111111] rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10 space-y-5 text-[#F5F5F0]"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-[#C8FF00]" />
                  <h3 className="font-display text-lg font-bold text-white uppercase">Create New Workspace</h3>
                </div>
                <button onClick={() => setIsNewWsModalOpen(false)} className="p-1 text-[#707070] hover:text-white">
                  &times;
                </button>
              </div>

              <form onSubmit={handleCreateWorkspace} className="space-y-4">
                <div>
                  <label className="block font-mono-tag text-[10px] font-bold text-[#9A9A9A] uppercase mb-1">
                    Workspace / Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newWsName}
                    onChange={(e) => setNewWsName(e.target.value)}
                    placeholder="e.g. Apex Media Agency"
                    className="w-full px-4 py-2.5 rounded-lg bg-[#181818] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C8FF00]"
                  />
                </div>

                <div>
                  <label className="block font-mono-tag text-[10px] font-bold text-[#9A9A9A] uppercase mb-1">
                    Workspace Type
                  </label>
                  <select
                    value={newWsType}
                    onChange={(e) => setNewWsType(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#181818] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C8FF00]"
                  >
                    <option value="agency">Digital Marketing Agency</option>
                    <option value="college">College / University Campus</option>
                    <option value="business">Enterprise Business</option>
                    <option value="creator">Creator & Media Studio</option>
                    <option value="startup">Tech Startup</option>
                  </select>
                </div>

                <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-[11px] text-[#9A9A9A]">
                  You will become the primary <strong className="text-white">OWNER</strong> with full operations, scheduling, and analytics permissions.
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsNewWsModalOpen(false)}
                    className="px-4 py-2 font-mono-tag text-xs font-bold text-[#9A9A9A] hover:text-white"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#C8FF00] hover:bg-[#D4FF35] text-[#080808] font-mono-tag text-xs font-bold rounded-lg shadow-md"
                  >
                    CREATE WORKSPACE →
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
