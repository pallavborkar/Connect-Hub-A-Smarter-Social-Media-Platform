import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { usePermissions } from '../hooks/usePermissions';
import { 
  LayoutDashboard, 
  Share2, 
  BarChart3, 
  Calendar, 
  CalendarDays, 
  PenSquare, 
  Sparkles, 
  SearchCheck, 
  Terminal, 
  Image, 
  Layers, 
  CheckSquare, 
  ListTodo, 
  MessageSquare, 
  Users, 
  Bell, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Flame,
  Globe,
  X,
  CreditCard,
  Crown,
  Zap,
  Shield,
  Building2,
  Palette,
  FileText,
  Eye,
  ArrowLeft,
  User
} from 'lucide-react';
import { ActiveView } from '../types';
import { SUBSCRIPTION_PLANS } from '../config/subscriptionPlans';
import { motion, AnimatePresence } from 'motion/react';

export const Sidebar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    posts, 
    tasks, 
    notifications, 
    unreadNotificationsCount,
    isMobileDrawerOpen,
    setIsMobileDrawerOpen,
    subscription,
    openUpgradeModal,
    workspace,
    clients,
    activeClient,
    isClientViewMode,
    exitClientViewMode
  } = useApp();

  const { canAccessView, currentRole, roleConfig } = usePermissions();

  const [collapsed, setCollapsed] = useState(false);

  const currentPlan = SUBSCRIPTION_PLANS[subscription.planId];
  const pendingApprovalsCount = posts.filter(p => p.status === 'pending_review').length;
  const inProgressTasksCount = tasks.filter(t => t.status === 'in_progress').length;
  const isClientExperience = currentRole === 'client' || isClientViewMode;

  interface NavItem {
    id: ActiveView;
    label: string;
    icon: any;
    badge?: string;
    count?: number;
    countColor?: string;
    highlight?: boolean;
  }

  // Client Portal specific navigation vs Agency navigation
  const clientPortalNavGroups: { group: string; items: NavItem[] }[] = [
    {
      group: 'Client Portal',
      items: [
        { id: 'client_dashboard', label: 'Portal Dashboard', icon: LayoutDashboard },
        { id: 'client_approvals', label: 'Needs Your Approval', icon: CheckSquare, count: pendingApprovalsCount, countColor: 'bg-rose-500', highlight: pendingApprovalsCount > 0 },
        { id: 'client_content', label: 'Content Library', icon: Layers },
        { id: 'client_calendar', label: 'Content Calendar', icon: Calendar },
        { id: 'client_campaigns', label: 'Campaigns', icon: Layers },
      ],
    },
    {
      group: 'Brand & Communication',
      items: [
        { id: 'client_brand_assets', label: 'Brand Assets', icon: Palette },
        { id: 'client_messages', label: 'Messages & Feedback', icon: MessageSquare },
        { id: 'client_reports', label: 'Monthly Reports', icon: FileText, badge: 'PDF' },
        { id: 'client_analytics', label: 'Performance Analytics', icon: BarChart3 },
      ],
    },
    {
      group: 'Account',
      items: [
        { id: 'client_profile', label: 'Client Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell, count: unreadNotificationsCount, countColor: 'bg-rose-500' },
        { id: 'settings', label: 'Preferences', icon: Settings },
      ],
    },
  ];

  const [isMoreExpanded, setIsMoreExpanded] = useState(false);

  // Core navigation groups matching user requirements
  const standardNavGroups: { group: string; items: NavItem[] }[] = [
    {
      group: 'HOME',
      items: [
        { id: 'dashboard' as ActiveView, label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'CREATE',
      items: [
        { id: 'studio' as ActiveView, label: 'Create Content', icon: PenSquare },
        { id: 'calendar' as ActiveView, label: 'Calendar', icon: Calendar },
      ],
    },
    {
      group: 'MANAGE',
      items: [
        { id: 'accounts' as ActiveView, label: 'Social Accounts', icon: Share2 },
        { id: 'analytics' as ActiveView, label: 'Analytics', icon: BarChart3 },
        { id: 'approvals' as ActiveView, label: 'Approvals', icon: CheckSquare, count: pendingApprovalsCount, countColor: 'bg-amber-500', highlight: pendingApprovalsCount > 0 },
        { id: 'tasks' as ActiveView, label: 'Tasks', icon: ListTodo, count: inProgressTasksCount, countColor: 'bg-indigo-500' },
      ],
    },
    {
      group: 'TEAM',
      items: [
        { id: 'team' as ActiveView, label: 'Team', icon: Users },
      ],
    },
  ];

  const moreNavItems: NavItem[] = [
    { id: 'events' as ActiveView, label: 'Events & Days', icon: CalendarDays },
    { id: 'ai_assistant' as ActiveView, label: 'AI Assistant', icon: Sparkles, highlight: true },
    { id: 'ai_analyzer' as ActiveView, label: 'Analyze Content', icon: SearchCheck },
    { id: 'ai_prompts' as ActiveView, label: 'Create Video', icon: Terminal },
    { id: 'media' as ActiveView, label: 'Media Library', icon: Image },
    { id: 'campaigns' as ActiveView, label: 'Campaigns', icon: Layers },
    { id: 'chat' as ActiveView, label: 'Team Chat', icon: MessageSquare },
    { id: 'notifications' as ActiveView, label: 'Notifications', icon: Bell, count: unreadNotificationsCount, countColor: 'bg-rose-500' },
    { id: 'settings' as ActiveView, label: 'Settings', icon: Settings },
  ];

  const rawNavGroups = isClientExperience ? clientPortalNavGroups : standardNavGroups;

  // Filter navigation items by RBAC view permissions
  const navGroups = rawNavGroups
    .map(group => ({
      ...group,
      items: group.items.filter(item => canAccessView(item.id as any))
    }))
    .filter(group => group.items.length > 0);

  const handleNavClick = (viewId: ActiveView) => {
    setActiveView(viewId);
    setIsMobileDrawerOpen(false);
  };

  const renderNavContent = (isMobile = false) => (
    <div className="flex flex-col h-full bg-[#0B0B0B] text-[#F5F5F0]">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 shrink-0">
        <button
          id={isMobile ? 'mobile-sidebar-logo' : 'sidebar-logo'}
          onClick={() => handleNavClick(isClientExperience ? 'client_dashboard' : 'dashboard')}
          className="flex items-center space-x-2.5 group text-left cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-[#C8FF00] flex items-center justify-center text-[#080808] font-black text-sm shadow-sm group-hover:scale-105 transition-transform shrink-0">
            {isClientExperience ? (
              <Building2 className="w-4 h-4 text-[#080808]" />
            ) : (
              <Flame className="w-4 h-4 fill-[#080808] text-[#080808]" />
            )}
          </div>
          {(!collapsed || isMobile) && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="font-display font-black text-base tracking-tight text-white uppercase truncate">
                  Socially
                </span>
                {isClientExperience ? (
                  <span className="font-mono-tag text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/30">
                    PORTAL
                  </span>
                ) : (
                  <span className="font-mono-tag text-[8px] font-bold px-1.5 py-0.2 rounded bg-white/10 text-[#9A9A9A] border border-white/10">
                    OS/26
                  </span>
                )}
              </div>
              <span className="font-mono-tag text-[9px] -mt-0.5 text-[#707070] truncate">
                {isClientExperience ? (activeClient?.name || 'Client Hub') : 'OPERATIONS HUB'}
              </span>
            </div>
          )}
        </button>

        {isMobile ? (
          <button
            id="mobile-sidebar-close"
            onClick={() => setIsMobileDrawerOpen(false)}
            className="p-1.5 rounded-lg text-[#9A9A9A] hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            id="sidebar-collapse-toggle"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-[#707070] hover:text-white hover:bg-white/10 transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Simulated Client Mode Top Banner */}
      {isClientViewMode && (!collapsed || isMobile) && (
        <div className="p-2.5 bg-[#C8FF00]/10 border-b border-[#C8FF00]/25 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs text-[#C8FF00] font-semibold truncate">
              <Eye className="w-3.5 h-3.5 shrink-0 animate-pulse" />
              <span className="truncate">Client View: {activeClient?.name}</span>
            </div>
            <button
              onClick={exitClientViewMode}
              className="text-[10px] font-mono-tag font-bold px-2 py-0.5 rounded bg-[#C8FF00] text-[#080808] hover:bg-[#D4FF35] transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              Exit
            </button>
          </div>
        </div>
      )}

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-4">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {(!collapsed || isMobile) && (
              <p className="font-mono-tag text-[9px] text-[#707070] px-3 py-1">
                {group.group}
              </p>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  id={`sidebar-nav-${item.id}${isMobile ? '-mobile' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                  title={collapsed && !isMobile ? item.label : undefined}
                  className={`w-full flex items-center ${
                    collapsed && !isMobile ? 'justify-center px-0' : 'justify-between px-3'
                  } py-2 rounded-lg text-xs transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-[#C8FF00] text-[#080808] font-bold shadow-xs'
                      : 'text-[#9A9A9A] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <div
                      className={`p-0.5 rounded transition-colors shrink-0 ${
                        isActive
                          ? 'text-[#080808]'
                          : item.highlight
                          ? 'text-[#C8FF00]'
                          : 'text-[#9A9A9A] group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    {(!collapsed || isMobile) && <span className="truncate">{item.label}</span>}
                  </div>

                  {(!collapsed || isMobile) && (
                    <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                      {item.badge && (
                        <span className="font-mono-tag text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-[#C8FF00] font-bold">
                          {item.badge}
                        </span>
                      )}
                      {item.count !== undefined && item.count > 0 && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                            isActive ? 'bg-[#080808] text-[#C8FF00]' : 'bg-[#C8FF00] text-[#080808]'
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}

        {/* MORE Group Progressive Disclosure */}
        {!isClientExperience && (
          <div className="space-y-1 pt-1">
            {(!collapsed || isMobile) && (
              <p className="font-mono-tag text-[9px] text-[#707070] px-3 py-1">
                ADDITIONAL
              </p>
            )}
            <button
              id={`sidebar-nav-more-toggle${isMobile ? '-mobile' : ''}`}
              onClick={() => setIsMoreExpanded(!isMoreExpanded)}
              className={`w-full flex items-center ${
                collapsed && !isMobile ? 'justify-center px-0' : 'justify-between px-3'
              } py-2 rounded-lg text-xs text-[#9A9A9A] hover:bg-white/5 hover:text-white transition-all cursor-pointer`}
            >
              <div className="flex items-center space-x-2.5">
                <div className="p-0.5 text-[#9A9A9A]">
                  <Layers className="w-4 h-4" />
                </div>
                {(!collapsed || isMobile) && <span className="font-semibold">More Views →</span>}
              </div>
              {(!collapsed || isMobile) && (
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isMoreExpanded || moreNavItems.some(m => m.id === activeView) ? 'rotate-90 text-[#C8FF00]' : ''}`} />
              )}
            </button>

            <AnimatePresence>
              {(isMoreExpanded || (moreNavItems.some(item => item.id === activeView))) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1 pl-1 border-l border-white/10 ml-3 overflow-hidden"
                >
                  {moreNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`sidebar-nav-${item.id}${isMobile ? '-mobile' : ''}`}
                        onClick={() => handleNavClick(item.id)}
                        title={collapsed && !isMobile ? item.label : undefined}
                        className={`w-full flex items-center ${
                          collapsed && !isMobile ? 'justify-center px-0' : 'justify-between px-3'
                        } py-2 rounded-lg text-xs transition-all group cursor-pointer ${
                          isActive
                            ? 'bg-[#C8FF00] text-[#080808] font-bold'
                            : 'text-[#9A9A9A] hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 truncate">
                          <div className={`p-0.5 shrink-0 ${isActive ? 'text-[#080808]' : 'text-[#9A9A9A]'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          {(!collapsed || isMobile) && <span className="truncate">{item.label}</span>}
                        </div>
                        {(!collapsed || isMobile) && item.count !== undefined && item.count > 0 && (
                          <span className="text-[9px] font-bold text-[#080808] bg-[#C8FF00] px-1.5 py-0.2 rounded-full">
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Role & Workspace Badge */}
      {(!collapsed || isMobile) && (
        <div className="px-3 pt-2 pb-1 shrink-0">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#151515] border border-white/10 text-xs">
            <div className="flex items-center space-x-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[#C8FF00]" />
              <div className="truncate">
                <p className="font-mono-tag text-[9px] text-[#707070] leading-none">
                  {isClientExperience ? 'Client Identity' : 'Your Role'}
                </p>
                <p className="text-xs font-bold text-white truncate mt-0.5">
                  {isClientExperience ? (activeClient?.name || 'Client Portal') : roleConfig.name}
                </p>
              </div>
            </div>
            <span className="font-mono-tag text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/5 text-[#C8FF00] border border-white/10 uppercase">
              {isClientExperience ? 'Client' : currentRole}
            </span>
          </div>
        </div>
      )}

      {/* Subscription Plan Card & Upgrade */}
      {!isClientExperience && (!collapsed || isMobile) ? (
        <div className="p-3 border-t border-white/10 bg-[#0E0E0E] shrink-0 space-y-2">
          <div className="p-3 rounded-xl bg-[#151515] border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <Crown className="w-3.5 h-3.5 text-[#C8FF00]" />
                <span className="font-mono-tag text-[10px] font-bold uppercase tracking-wider text-white">
                  {currentPlan.name} Plan
                </span>
              </div>
              <span className="font-mono-tag text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/25">
                ACTIVE
              </span>
            </div>

            {/* Quick Action Button */}
            {subscription.planId === 'free' ? (
              <button
                id="sidebar-upgrade-cta-btn"
                onClick={() => {
                  openUpgradeModal({
                    title: 'Unlock Full Creator Potential',
                    description: 'Upgrade to Creator or Agency plan for unlimited scheduled posts, AI superpowers & more.'
                  });
                  if (isMobile) setIsMobileDrawerOpen(false);
                }}
                className="mt-2.5 w-full py-2 px-3 rounded-lg bg-[#C8FF00] hover:bg-[#D4FF35] text-[#080808] text-xs font-mono-tag font-bold shadow-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-[#080808]" />
                <span>UPGRADE TO PRO →</span>
              </button>
            ) : (
              <button
                id="sidebar-manage-billing-btn"
                onClick={() => handleNavClick('pricing')}
                className="mt-2.5 w-full py-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#9A9A9A] hover:text-white text-[10px] font-mono-tag font-semibold border border-white/10 flex items-center justify-center space-x-1 transition-all cursor-pointer"
              >
                <CreditCard className="w-3 h-3 text-[#C8FF00]" />
                <span>PLAN & LIMITS</span>
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        id="main-sidebar-desktop"
        className={`relative z-40 hidden lg:flex flex-col bg-[#0B0B0B] border-r border-white/10 transition-all duration-300 ${
          collapsed ? 'w-18' : 'w-64'
        }`}
      >
        {renderNavContent(false)}
      </aside>

      {/* Mobile & Tablet Slide-out Drawer */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            />

            {/* Off-canvas Drawer Panel */}
            <motion.aside
              id="main-sidebar-mobile-drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 260 }}
              className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 flex flex-col bg-[#0B0B0B]"
            >
              {renderNavContent(true)}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
