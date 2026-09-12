import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Workspace, 
  User, 
  ActiveView, 
  Post, 
  Task, 
  SocialAccount, 
  EventDay, 
  Campaign, 
  ChatMessage, 
  ChatChannel, 
  AppNotification, 
  MediaItem, 
  TeamMember, 
  AnalyticsSummary, 
  PostStatus, 
  TaskStatus, 
  SocialPlatform, 
  SubscriptionPlanId, 
  SubscriptionStatus, 
  BillingCycle, 
  UserSubscriptionState, 
  InvoiceItem, 
  FeatureKey, 
  WorkspaceTimeSettings, 
  RoleType, 
  PermissionKey, 
  WorkspaceMembership, 
  AuditLogEntry,
  Client,
  BrandAsset,
  ClientMessage,
  MonthlyReport,
  ClientStatus
} from '../types';
import {
  CURRENT_WORKSPACE,
  INITIAL_WORKSPACES,
  INITIAL_USER_WORKSPACES,
  INITIAL_TEAM_MEMBERS,
  INITIAL_SOCIAL_ACCOUNTS,
  INITIAL_CAMPAIGNS,
  INITIAL_POSTS,
  INITIAL_EVENTS,
  INITIAL_TASKS,
  INITIAL_CHANNELS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_MEDIA_ITEMS,
  INITIAL_ANALYTICS,
  INITIAL_AUDIT_LOGS,
  INITIAL_CLIENTS,
  INITIAL_BRAND_ASSETS,
  INITIAL_CLIENT_MESSAGES,
  INITIAL_MONTHLY_REPORTS,
} from '../data/mockData';
import { SUBSCRIPTION_PLANS, hasFeatureAccess, getRequiredPlanForFeature } from '../config/subscriptionPlans';
import { checkPermission, ROLE_CONFIGS, ROLE_DEFAULT_PERMISSIONS } from '../config/permissions';
import {
  getBrowserTimezone,
  formatInTimezone,
  formatRelativeTime,
  getGreetingForTimezone,
  calculateDaysAway,
  getTimezoneDetails,
  getZonedDateParts,
  POPULAR_TIMEZONES,
  TimezoneOption,
  combineDateTimeToUtc
} from '../utils/timeUtils';
import confetti from 'canvas-confetti';

interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface UpgradeModalState {
  isOpen: boolean;
  featureKey?: FeatureKey;
  featureName?: string;
  description?: string;
  targetPlan?: SubscriptionPlanId;
}

export interface CheckoutModalState {
  isOpen: boolean;
  selectedPlan?: SubscriptionPlanId;
  billingCycle?: BillingCycle;
}

interface AppContextType {
  workspace: Workspace;
  setWorkspace: (ws: Workspace) => void;
  workspaces: Workspace[];
  userWorkspaces: WorkspaceMembership[];
  activeMembership: WorkspaceMembership | undefined;
  currentRole: RoleType;
  customPermissions: PermissionKey[];
  hasPermission: (perm: PermissionKey) => boolean;
  switchWorkspace: (workspaceId: string) => void;
  createWorkspace: (name: string, type: Workspace['type']) => Workspace;
  deleteWorkspace: (workspaceId: string) => boolean;
  switchUserRole: (role: RoleType) => void;
  updateMemberRole: (memberId: string, role: RoleType) => void;
  updateMemberPermissions: (memberId: string, customPerms?: PermissionKey[], assignedAccounts?: string[], assignedCampaigns?: string[]) => void;
  removeTeamMember: (memberId: string) => boolean;
  transferOwnership: (newOwnerId: string, confirmationPassword?: string) => Promise<boolean>;

  user: User;
  setUser: (u: User) => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  
  // Data entities
  posts: Post[];
  filteredPosts: Post[];
  addPost: (post: Omit<Post, 'id' | 'authorId' | 'authorName' | 'approvals'>) => Post;
  updatePost: (id: string, updates: Partial<Post>) => void;
  deletePost: (id: string) => void;
  submitPostForApproval: (id: string, note?: string) => void;
  approvePost: (id: string, comment?: string) => void;
  rejectPost: (id: string, reason: string) => void;
  requestPostChanges: (id: string, feedback: string) => void;
  publishPost: (id: string) => boolean;

  tasks: Task[];
  filteredTasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'commentsCount' | 'attachmentsCount'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTaskStatus: (id: string, status: TaskStatus) => void;

  socialAccounts: SocialAccount[];
  filteredSocialAccounts: SocialAccount[];
  selectedAccountId: string | 'all';
  setSelectedAccountId: (id: string | 'all') => void;
  addSocialAccount: (account: Omit<SocialAccount, 'id' | 'lastSynced'>) => void;
  removeSocialAccount: (id: string) => void;
  toggleConnectAccount: (id: string) => void;
  syncAccount: (id: string) => void;

  events: EventDay[];
  addCustomEvent: (evt: Omit<EventDay, 'id' | 'isCustom' | 'daysAway'>) => void;
  toggleEventReminder: (id: string) => void;

  campaigns: Campaign[];
  filteredCampaigns: Campaign[];
  addCampaign: (campaign: Omit<Campaign, 'id' | 'postsCount' | 'tasksCount' | 'currentReach' | 'currentEngagement'>) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;

  chatChannels: ChatChannel[];
  addChatChannel: (name: string, topic: string, isPrivate?: boolean) => void;
  chatMessages: Record<string, ChatMessage[]>;
  activeChannel: string;
  setActiveChannel: (ch: string) => void;
  sendChatMessage: (channelId: string, text: string, mediaUrl?: string, mediaType?: 'image' | 'video' | 'file') => void;
  addChatReaction: (channelId: string, messageId: string, emoji: string) => void;
  clearChannelUnread: (channelId: string) => void;

  notifications: AppNotification[];
  unreadNotificationsCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => void;
  triggerAIEventSuggestions: () => void;

  mediaItems: MediaItem[];
  addMediaItem: (item: Omit<MediaItem, 'id' | 'uploadedAt' | 'uploadedBy'>) => void;
  deleteMediaItem: (id: string) => void;

  teamMembers: TeamMember[];
  inviteTeamMember: (
    email: string, 
    name: string, 
    role: RoleType, 
    assignedAccounts?: string[], 
    assignedCampaigns?: string[], 
    customPermissions?: PermissionKey[]
  ) => void;

  auditLogs: AuditLogEntry[];
  filteredAuditLogs: AuditLogEntry[];
  addAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'workspaceId' | 'workspaceName'>) => void;

  analytics: AnalyticsSummary;

  // Clients & Client Portal
  clients: Client[];
  activeClient: Client | undefined;
  addClient: (clientData: {
    name: string;
    companyName?: string;
    email: string;
    phone?: string;
    industry: string;
    website?: string;
    logo?: string;
    description?: string;
    assignedManagerId: string;
    assignedTeamMemberIds: string[];
    contractValue?: string;
    slaHours?: number;
    billingSchedule?: 'monthly' | 'quarterly' | 'annual';
    notes?: string;
  }) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  toggleClientOnboardingStep: (clientId: string, stepId: string) => void;
  inviteClientUser: (clientId: string, email: string, name: string, message?: string) => void;

  // Brand Assets
  brandAssets: BrandAsset[];
  filteredBrandAssets: BrandAsset[];
  addBrandAsset: (asset: Omit<BrandAsset, 'id' | 'uploadedAt' | 'uploadedBy' | 'isApproved'>) => void;
  approveBrandAsset: (id: string) => void;
  deleteBrandAsset: (id: string) => void;

  // Client Messages
  clientMessages: ClientMessage[];
  filteredClientMessages: ClientMessage[];
  sendClientMessage: (text: string, mediaUrl?: string, mediaType?: 'image' | 'video' | 'file', fileName?: string, postId?: string, postTitle?: string) => void;

  // Monthly Reports
  monthlyReports: MonthlyReport[];
  filteredMonthlyReports: MonthlyReport[];
  generateMonthlyReport: (month?: string) => MonthlyReport;

  // Client Simulation Mode & Content Review
  isClientViewMode: boolean;
  simulatedClientId: string | null;
  enterClientViewMode: (clientId: string) => void;
  exitClientViewMode: () => void;
  reviewModalPostId: string | null;
  setReviewModalPostId: (id: string | null) => void;

  // Subscription & Billing
  subscription: UserSubscriptionState;
  setSubscription: React.Dispatch<React.SetStateAction<UserSubscriptionState>>;
  billingCycle: BillingCycle;
  setBillingCycle: (cycle: BillingCycle) => void;
  invoices: InvoiceItem[];
  upgradeModalState: UpgradeModalState;
  openUpgradeModal: (featureKey?: FeatureKey, customMeta?: { featureName?: string; description?: string; targetPlan?: SubscriptionPlanId }) => void;
  closeUpgradeModal: () => void;
  checkoutModalState: CheckoutModalState;
  openCheckoutModal: (planId?: SubscriptionPlanId, cycle?: BillingCycle) => void;
  closeCheckoutModal: () => void;
  isEnterpriseModalOpen: boolean;
  openEnterpriseModal: () => void;
  closeEnterpriseModal: () => void;
  processSubscriptionPayment: (paymentData: { 
    planId: SubscriptionPlanId; 
    billingCycle: BillingCycle; 
    amount: number; 
    paymentMethod: string; 
    billingContact: any;
  }) => void;
  cancelSubscription: () => void;
  resumeSubscription: () => void;
  updateSubscriptionSandbox: (planId: SubscriptionPlanId, status: SubscriptionStatus) => void;
  checkFeatureAccess: (featureKey: FeatureKey) => boolean;
  consumeAICredit: (amount?: number) => boolean;

  // Command palette & Studio
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isStudioModalOpen: boolean;
  setIsStudioModalOpen: (open: boolean) => void;
  studioInitialDraft: Partial<Post> | null;
  setStudioInitialDraft: (draft: Partial<Post> | null) => void;
  isMobileDrawerOpen: boolean;
  setIsMobileDrawerOpen: (open: boolean | ((prev: boolean) => boolean)) => void;

  // Auth & Onboarding & Google Identity
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  isGoogleVerifying: boolean;
  googleVerificationStep: string;
  signInWithGoogle: (customUser?: Partial<User>) => Promise<void>;
  signOutGoogle: () => void;

  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'signup' | 'forgot';
  setAuthMode: (mode: 'login' | 'signup' | 'forgot') => void;
  isOnboarding: boolean;
  setIsOnboarding: (val: boolean) => void;
  managementType: 'college' | 'business' | 'creator' | 'agency' | 'personal_brand' | 'other';
  setManagementType: (type: 'college' | 'business' | 'creator' | 'agency' | 'personal_brand' | 'other') => void;
  onboardingGoals: string[];
  setOnboardingGoals: (goals: string[]) => void;
  isSetupDismissed: boolean;
  setIsSetupDismissed: (val: boolean) => void;
  dismissSetup: () => void;
  resetOnboarding: () => void;

  // Timezone, Live Clock & Dynamic Regional System
  userTimezone: string;
  setUserTimezone: (tz: string) => void;
  workspaceTimezone: string;
  setWorkspaceTimezone: (tz: string) => void;
  timeSettings: WorkspaceTimeSettings;
  updateTimeSettings: (settings: Partial<WorkspaceTimeSettings>) => void;
  currentTime: Date;
  liveClock: {
    time: string;
    timeWithSeconds: string;
    date: string;
    full: string;
    tzAbbrev: string;
    tzOffset: string;
    is24Hour: boolean;
  };
  formatDate: (
    date: Date | string | number, 
    style?: 'datetime' | 'date' | 'time' | 'time-seconds' | 'full' | 'short-date' | 'month-year' | 'iso-date' | 'relative'
  ) => string;
  formatRelative: (date: Date | string | number) => string;
  getEventCountdown: (eventDate: string) => {
    daysAway: number;
    label: string;
    badgeColor: string;
    isToday: boolean;
    isTomorrow: boolean;
    isPast: boolean;
  };
  greetingIcon: 'sun' | 'sun-high' | 'sunset' | 'moon';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';

  // Witty microcopy helper
  currentGreeting: string;
  wittySubtext: string;

  // Toasts
  toasts: ToastItem[];
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;
  triggerConfetti: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme initialization
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('socially_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('socially_dark_mode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Workspaces state
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => {
    const saved = localStorage.getItem('socially_workspaces');
    return saved ? JSON.parse(saved) : INITIAL_WORKSPACES;
  });

  const [workspace, setWorkspace] = useState<Workspace>(() => {
    const saved = localStorage.getItem('socially_current_workspace');
    return saved ? JSON.parse(saved) : INITIAL_WORKSPACES[0];
  });

  const [userWorkspaces, setUserWorkspaces] = useState<WorkspaceMembership[]>(() => {
    const saved = localStorage.getItem('socially_user_workspaces');
    return saved ? JSON.parse(saved) : INITIAL_USER_WORKSPACES;
  });

  // Current active membership in the selected workspace
  const activeMembership = useMemo(() => {
    return userWorkspaces.find(w => w.workspaceId === workspace.id) || {
      workspaceId: workspace.id,
      workspaceName: workspace.name,
      workspaceType: workspace.type,
      role: 'owner' as RoleType,
      isOwner: true,
    };
  }, [userWorkspaces, workspace.id, workspace.name, workspace.type]);

  // Current User
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('socially_auth_user');
    return saved ? JSON.parse(saved) : {
      id: 'user-pallav',
      name: 'Pallav Borkar',
      email: 'pallavborkar73@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'owner',
      activeRole: 'owner',
      workspaceId: 'ws-jspm-01',
      workspaces: INITIAL_USER_WORKSPACES,
    };
  });

  // Effective Role (user.activeRole or activeMembership.role)
  const currentRole: RoleType = (user.activeRole || activeMembership.role || 'owner') as RoleType;
  const customPermissions = activeMembership.customPermissions || user.customPermissions || [];

  // Centralized Permission Checker
  const hasPermission = (permissionKey: PermissionKey): boolean => {
    return checkPermission(permissionKey, currentRole, customPermissions);
  };

  // Google Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('socially_is_authenticated');
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [isGoogleVerifying, setIsGoogleVerifying] = useState(false);
  const [googleVerificationStep, setGoogleVerificationStep] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('socially_workspaces', JSON.stringify(workspaces));
  }, [workspaces]);

  useEffect(() => {
    localStorage.setItem('socially_current_workspace', JSON.stringify(workspace));
  }, [workspace]);

  useEffect(() => {
    localStorage.setItem('socially_user_workspaces', JSON.stringify(userWorkspaces));
  }, [userWorkspaces]);

  useEffect(() => {
    localStorage.setItem('socially_is_authenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('socially_auth_user', JSON.stringify(user));
  }, [user]);

  // Active view
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  // Main entity states
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('socially_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('socially_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>(() => {
    const saved = localStorage.getItem('socially_accounts');
    return saved ? JSON.parse(saved) : INITIAL_SOCIAL_ACCOUNTS;
  });

  const [selectedAccountId, setSelectedAccountId] = useState<string | 'all'>('all');

  const [events, setEvents] = useState<EventDay[]>(() => {
    const saved = localStorage.getItem('socially_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('socially_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [chatChannels, setChatChannels] = useState<ChatChannel[]>(() => {
    const saved = localStorage.getItem('socially_channels');
    return saved ? JSON.parse(saved) : INITIAL_CHANNELS;
  });

  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('socially_chats');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  const [activeChannel, setActiveChannel] = useState<string>('ch-general');

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('socially_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem('socially_media');
    return saved ? JSON.parse(saved) : INITIAL_MEDIA_ITEMS;
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('socially_members');
    return saved ? JSON.parse(saved) : INITIAL_TEAM_MEMBERS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('socially_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [analytics] = useState<AnalyticsSummary>(INITIAL_ANALYTICS);

  // Clients state
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('socially_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  // Brand Assets state
  const [brandAssets, setBrandAssets] = useState<BrandAsset[]>(() => {
    const saved = localStorage.getItem('socially_brand_assets');
    return saved ? JSON.parse(saved) : INITIAL_BRAND_ASSETS;
  });

  // Client Messages state
  const [clientMessages, setClientMessages] = useState<ClientMessage[]>(() => {
    const saved = localStorage.getItem('socially_client_messages');
    return saved ? JSON.parse(saved) : INITIAL_CLIENT_MESSAGES;
  });

  // Monthly Reports state
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>(() => {
    const saved = localStorage.getItem('socially_monthly_reports');
    return saved ? JSON.parse(saved) : INITIAL_MONTHLY_REPORTS;
  });

  // Client View Simulation Mode & Post Review Modal
  const [isClientViewMode, setIsClientViewMode] = useState<boolean>(false);
  const [simulatedClientId, setSimulatedClientId] = useState<string | null>(null);
  const [reviewModalPostId, setReviewModalPostId] = useState<string | null>(null);

  // Sync entities
  useEffect(() => { localStorage.setItem('socially_posts', JSON.stringify(posts)); }, [posts]);
  useEffect(() => { localStorage.setItem('socially_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('socially_accounts', JSON.stringify(socialAccounts)); }, [socialAccounts]);
  useEffect(() => { localStorage.setItem('socially_events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('socially_campaigns', JSON.stringify(campaigns)); }, [campaigns]);
  useEffect(() => { localStorage.setItem('socially_channels', JSON.stringify(chatChannels)); }, [chatChannels]);
  useEffect(() => { localStorage.setItem('socially_chats', JSON.stringify(chatMessages)); }, [chatMessages]);
  useEffect(() => { localStorage.setItem('socially_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('socially_media', JSON.stringify(mediaItems)); }, [mediaItems]);
  useEffect(() => { localStorage.setItem('socially_members', JSON.stringify(teamMembers)); }, [teamMembers]);
  useEffect(() => { localStorage.setItem('socially_audit_logs', JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem('socially_clients', JSON.stringify(clients)); }, [clients]);
  useEffect(() => { localStorage.setItem('socially_brand_assets', JSON.stringify(brandAssets)); }, [brandAssets]);
  useEffect(() => { localStorage.setItem('socially_client_messages', JSON.stringify(clientMessages)); }, [clientMessages]);
  useEffect(() => { localStorage.setItem('socially_monthly_reports', JSON.stringify(monthlyReports)); }, [monthlyReports]);

  // Modal & Overlay states
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isStudioModalOpen, setIsStudioModalOpen] = useState(false);
  const [studioInitialDraft, setStudioInitialDraft] = useState<Partial<Post> | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [managementType, setManagementType] = useState<'college' | 'business' | 'creator' | 'agency' | 'personal_brand' | 'other'>(() => {
    const saved = localStorage.getItem('socially_management_type');
    return (saved as any) || 'college';
  });
  const [onboardingGoals, setOnboardingGoals] = useState<string[]>(() => {
    const saved = localStorage.getItem('socially_onboarding_goals');
    return saved ? JSON.parse(saved) : ['create_content', 'schedule_posts', 'grow_engagement', 'ai_generation'];
  });
  const [isSetupDismissed, setIsSetupDismissed] = useState<boolean>(() => {
    const saved = localStorage.getItem('socially_setup_dismissed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('socially_management_type', managementType);
  }, [managementType]);

  useEffect(() => {
    localStorage.setItem('socially_onboarding_goals', JSON.stringify(onboardingGoals));
  }, [onboardingGoals]);

  useEffect(() => {
    localStorage.setItem('socially_setup_dismissed', JSON.stringify(isSetupDismissed));
  }, [isSetupDismissed]);

  const dismissSetup = () => {
    setIsSetupDismissed(true);
  };

  const resetOnboarding = () => {
    setIsSetupDismissed(false);
    setIsOnboarding(true);
  };
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [upgradeModalState, setUpgradeModalState] = useState<UpgradeModalState>({ isOpen: false });
  const [checkoutModalState, setCheckoutModalState] = useState<CheckoutModalState>({ isOpen: false });
  const [isEnterpriseModalOpen, setIsEnterpriseModalOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  // Subscription state
  const [subscription, setSubscription] = useState<UserSubscriptionState>(() => {
    const saved = localStorage.getItem('socially_subscription');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      planId: 'team',
      status: 'active',
      billingCycle: 'monthly',
      currentPeriodStart: 'Aug 15, 2026',
      currentPeriodEnd: 'Sep 15, 2026',
      cancelAtPeriodEnd: false,
      trialDaysLeft: 7,
      paymentDetails: {
        methodType: 'upi',
        upiId: 'pallav@okaxis',
      },
      billingContact: {
        fullName: 'Pallav Borkar',
        email: 'pallavborkar73@gmail.com',
        companyOrCollegeName: 'JSPM Social Media Team',
        gstNumber: '27AAACJ1234F1Z5',
        addressLine1: 'JSPM Imperial Campus, Hadapsar',
        city: 'Pune',
        state: 'Maharashtra',
        postalCode: '411028',
        country: 'India',
      },
      usage: {
        postsScheduledThisMonth: 18,
        aiCreditsUsedThisMonth: 42,
        teamMembersCount: 6,
        socialAccountsConnectedCount: 6,
        storageUsedMb: 1420,
      },
    };
  });

  const [invoices, setInvoices] = useState<InvoiceItem[]>([
    {
      id: 'inv-2026-003',
      invoiceNumber: 'SOC-INV-84920',
      date: 'Aug 15, 2026',
      dueDate: 'Aug 15, 2026',
      status: 'paid',
      planName: 'Team Growth',
      billingCycle: 'monthly',
      amount: 1999,
      currency: 'INR',
      currencySymbol: '₹',
      paymentMethod: 'UPI (pallav@okaxis)',
      taxAmount: 305,
      subtotal: 1694,
    },
  ]);

  // Toast Helpers
  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (e) {}
  };

  // Audit Logger
  const addAuditLog = (entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'workspaceId' | 'workspaceName'>) => {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      workspaceId: workspace.id,
      workspaceName: workspace.name,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  // Workspace Switcher
  const switchWorkspace = (workspaceId: string) => {
    const targetWs = workspaces.find(w => w.id === workspaceId);
    if (!targetWs) return;

    setWorkspace(targetWs);
    const membership = userWorkspaces.find(w => w.workspaceId === workspaceId);
    const newRole = membership ? membership.role : 'owner';

    setUser(prev => ({
      ...prev,
      workspaceId: targetWs.id,
      role: newRole,
      activeRole: newRole,
      customPermissions: membership?.customPermissions,
    }));

    addAuditLog({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userRole: newRole,
      action: 'Switched workspace context',
      resource: targetWs.name,
      category: 'workspace',
      details: `Switched into ${targetWs.name} as ${ROLE_CONFIGS[newRole].name}.`,
    });

    showToast('Workspace Switched', `Active workspace: ${targetWs.name} (${ROLE_CONFIGS[newRole].name})`, 'success');
  };

  // Switch User Role / Persona (Quick switch for testing)
  const switchUserRole = (newRole: RoleType) => {
    setUser(prev => ({
      ...prev,
      role: newRole,
      activeRole: newRole,
    }));

    // Update active membership in memory
    setUserWorkspaces(prev => prev.map(w => w.workspaceId === workspace.id ? { ...w, role: newRole } : w));

    addAuditLog({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userRole: newRole,
      action: 'Persona switched for testing',
      resource: ROLE_CONFIGS[newRole].name,
      category: 'security',
      details: `Testing environment active as ${ROLE_CONFIGS[newRole].name}.`,
    });

    showToast('Role Switched', `Switched active testing persona to ${ROLE_CONFIGS[newRole].name}.`, 'info');
  };

  // Create Workspace
  const createWorkspace = (name: string, type: Workspace['type']): Workspace => {
    if (!hasPermission('workspace.settings') && currentRole !== 'owner') {
      showToast('Permission Denied', 'Only Owners can create new workspaces.', 'error');
      throw new Error('Permission denied');
    }

    const newWs: Workspace = {
      id: `ws-${Date.now()}`,
      name,
      type,
      memberCount: 1,
      plan: 'creator',
      createdAt: new Date().toISOString().split('T')[0],
      ownerId: user.id,
      ownerName: user.name,
    };

    const newMembership: WorkspaceMembership = {
      workspaceId: newWs.id,
      workspaceName: newWs.name,
      workspaceType: newWs.type,
      role: 'owner',
      isOwner: true,
    };

    setWorkspaces(prev => [...prev, newWs]);
    setUserWorkspaces(prev => [...prev, newMembership]);
    setWorkspace(newWs);
    setUser(prev => ({
      ...prev,
      workspaceId: newWs.id,
      role: 'owner',
      activeRole: 'owner',
    }));

    addAuditLog({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userRole: 'owner',
      action: 'Created new workspace',
      resource: newWs.name,
      category: 'workspace',
      details: `Initialized new ${newWs.type} workspace.`,
    });

    showToast('Workspace Created', `"${name}" is ready!`, 'success');
    return newWs;
  };

  // Delete Workspace (Owner only)
  const deleteWorkspace = (workspaceId: string): boolean => {
    const isVerifiedOwner = (currentRole === 'owner' && (workspace.ownerId === user.id || activeMembership?.isOwner === true));
    if (!isVerifiedOwner) {
      addAuditLog({
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        userRole: currentRole,
        action: 'BLOCKED_WORKSPACE_DELETION_ATTEMPT',
        resource: workspace.name,
        category: 'security',
        details: `Non-owner account attempted to delete workspace. Access Denied (403 Forbidden).`,
      });
      showToast('Permission Denied (403 Forbidden)', 'Only the verified Workspace Owner has the authority to permanently delete a workspace.', 'error');
      return false;
    }

    if (workspaces.length <= 1) {
      showToast('Cannot Delete', 'You must have at least one active workspace.', 'warning');
      return false;
    }

    const wsToDelete = workspaces.find(w => w.id === workspaceId);
    const remaining = workspaces.filter(w => w.id !== workspaceId);
    setWorkspaces(remaining);
    setUserWorkspaces(prev => prev.filter(w => w.workspaceId !== workspaceId));

    const nextWs = remaining[0];
    setWorkspace(nextWs);
    const nextMembership = userWorkspaces.find(w => w.workspaceId === nextWs.id);
    const nextRole = nextMembership ? nextMembership.role : 'owner';

    setUser(prev => ({
      ...prev,
      workspaceId: nextWs.id,
      role: nextRole,
      activeRole: nextRole,
    }));

    // Notify backend
    fetch('/api/workspace/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workspaceId, authUserId: user.id }),
    }).catch(() => {});

    showToast('Workspace Deleted', `Deleted "${wsToDelete?.name}". Switched to "${nextWs.name}".`, 'info');
    return true;
  };

  // Team Role & Permissions Updates (Strict Single-Owner Constraint)
  const updateMemberRole = (memberId: string, newRole: RoleType) => {
    // 1. Block assigning Owner directly
    if (newRole === 'owner') {
      addAuditLog({
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        userRole: currentRole,
        action: 'ILLEGAL_ROLE_ELEVATION_ATTEMPT',
        resource: 'Role Management',
        category: 'security',
        details: `Attempted to directly assign OWNER role to user ID ${memberId}. Denied by Single-Owner constraint.`,
      });
      showToast('Action Prohibited (400)', 'Direct assignment of the OWNER role is prohibited. Single-Owner constraint requires formal Ownership Transfer.', 'error');
      return;
    }

    if (currentRole !== 'owner' && !hasPermission('team.change_role')) {
      showToast('Permission Denied (403)', 'Only Workspace Owners and authorized Managers can change member roles.', 'error');
      return;
    }

    const member = teamMembers.find(m => m.id === memberId);
    if (!member) return;

    if (member.role === 'owner') {
      showToast('Protected Account', 'The workspace Owner role cannot be modified. Ownership must be transferred first.', 'error');
      return;
    }

    setTeamMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        return { ...m, role: newRole, customPermissions: undefined };
      }
      return m;
    }));

    // Server synchronization
    fetch('/api/workspace/member/role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workspaceId: workspace.id,
        authUserId: user.id,
        targetMemberId: memberId,
        newRole,
      }),
    }).catch(() => {});

    addAuditLog({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userRole: currentRole,
      action: 'Changed team member role',
      resource: member.name,
      previousValue: member.role,
      newValue: newRole,
      category: 'team',
      details: `Updated ${member.name}'s role from ${ROLE_CONFIGS[member.role].name} to ${ROLE_CONFIGS[newRole].name}.`,
    });

    showToast('Role Updated', `${member.name} is now a ${ROLE_CONFIGS[newRole].name}.`, 'success');
  };

  const updateMemberPermissions = (
    memberId: string, 
    customPerms?: PermissionKey[], 
    assignedAccounts?: string[], 
    assignedCampaigns?: string[]
  ) => {
    if (currentRole !== 'owner' && !hasPermission('team.edit')) {
      showToast('Permission Denied', 'Only Owners can configure custom permission overrides and resource assignments.', 'error');
      return;
    }

    const member = teamMembers.find(m => m.id === memberId);
    if (!member) return;

    setTeamMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          customPermissions: customPerms,
          assignedAccounts: assignedAccounts || m.assignedAccounts,
          assignedCampaigns: assignedCampaigns || m.assignedCampaigns,
        };
      }
      return m;
    }));

    addAuditLog({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userRole: currentRole,
      action: 'Configured custom permissions / assignments',
      resource: member.name,
      category: 'security',
      details: `Updated custom overrides and assigned resources for ${member.name}.`,
    });

    showToast('Permissions Saved', `Updated permissions and assignments for ${member.name}.`, 'success');
  };

  // Remove Team Member (Owner Protected)
  const removeTeamMember = (memberId: string): boolean => {
    const member = teamMembers.find(m => m.id === memberId);
    if (!member) return false;

    // Single Owner Rule: Owner cannot be deleted by anyone!
    if (member.role === 'owner' || member.id === workspace.ownerId) {
      addAuditLog({
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        userRole: currentRole,
        action: 'BLOCKED_OWNER_REMOVAL_ATTEMPT',
        resource: member.name,
        category: 'security',
        details: `Attempted to remove workspace Owner ${member.name}. Denied by Single-Owner protection policy.`,
      });
      showToast('Action Denied (403 Forbidden)', 'The workspace Owner cannot be removed from the workspace. Ownership must be transferred first.', 'error');
      return false;
    }

    if (!hasPermission('team.remove') && currentRole !== 'owner') {
      showToast('Permission Denied', 'You lack permission to remove members from this workspace.', 'error');
      return false;
    }

    setTeamMembers(prev => prev.filter(m => m.id !== memberId));
    setSubscription(prev => ({
      ...prev,
      usage: {
        ...prev.usage,
        teamMembersCount: Math.max(1, prev.usage.teamMembersCount - 1),
      },
    }));

    // Server synchronization
    fetch('/api/workspace/member/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workspaceId: workspace.id,
        authUserId: user.id,
        targetMemberId: memberId,
      }),
    }).catch(() => {});

    addAuditLog({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userRole: currentRole,
      action: 'Removed team member',
      resource: member.name,
      category: 'team',
      details: `Revoked workspace membership for ${member.name} (${member.email}).`,
    });

    showToast('Member Removed', `${member.name} was removed from the workspace.`, 'info');
    return true;
  };

  // Invite Team Member (Strictly prevent creating duplicate Owner)
  const inviteTeamMember = (
    email: string, 
    name: string, 
    role: RoleType, 
    assignedAccounts?: string[], 
    assignedCampaigns?: string[], 
    customPerms?: PermissionKey[]
  ) => {
    // Single-Owner Invariant Check
    if (role === 'owner') {
      addAuditLog({
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        userRole: currentRole,
        action: 'DUPLICATE_OWNER_CREATION_ATTEMPT',
        resource: email,
        category: 'security',
        details: `Attempted to invite a user with OWNER role. Rejected by Single-Owner constraint.`,
      });
      showToast('Action Prohibited', 'Creating a second Owner is forbidden by the Single-Owner architecture.', 'error');
      return;
    }

    if (!hasPermission('team.invite') && currentRole !== 'owner') {
      showToast('Permission Denied', 'You lack permission to invite new members to this workspace.', 'error');
      return;
    }

    const planConfig = SUBSCRIPTION_PLANS[subscription.planId];
    if (teamMembers.length >= planConfig.limits.teamMembers) {
      openUpgradeModal(undefined, {
        featureName: 'Team Member Seat Limit Reached',
        description: `Your ${planConfig.name} plan includes up to ${planConfig.limits.teamMembers} team members. Upgrade to add more collaborators.`,
        targetPlan: subscription.planId === 'free' ? 'creator' : subscription.planId === 'creator' ? 'team' : 'pro',
      });
      return;
    }

    const newMember: TeamMember = {
      id: `user-${Date.now()}`,
      name: name || email.split('@')[0],
      email,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random()*5000)}?w=150&auto=format&fit=crop&q=80`,
      role,
      status: 'active',
      assignedTasksCount: 0,
      recentActivity: 'Just joined the workspace',
      joinedDate: new Date().toISOString().split('T')[0],
      workspaceId: workspace.id,
      assignedAccounts,
      assignedCampaigns,
      customPermissions: customPerms,
    };

    setTeamMembers(prev => [...prev, newMember]);
    setSubscription(prev => ({
      ...prev,
      usage: {
        ...prev.usage,
        teamMembersCount: prev.usage.teamMembersCount + 1,
      },
    }));

    // Server synchronization
    fetch('/api/workspace/member/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workspaceId: workspace.id,
        authUserId: user.id,
        email,
        name: newMember.name,
        role,
      }),
    }).catch(() => {});

    addAuditLog({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userRole: currentRole,
      action: 'Invited team member',
      resource: `${newMember.name} (${email})`,
      newValue: role,
      category: 'team',
      details: `Invited as ${ROLE_CONFIGS[role].name}.`,
    });

    showToast('Invitation Sent ✉️', `Invited ${email} as ${ROLE_CONFIGS[role].name}.`, 'success');
  };

  // ============================================================================
  // ATOMIC OWNERSHIP TRANSFER PROCESS (OWNER ONLY)
  // ============================================================================
  const transferOwnership = async (newOwnerId: string, confirmationPassword: string = 'confirm-transfer'): Promise<boolean> => {
    // 1. Authorization: Only the verified current workspace Owner can initiate
    const isVerifiedOwner = (currentRole === 'owner' && (workspace.ownerId === user.id || activeMembership?.isOwner === true));

    if (!isVerifiedOwner) {
      addAuditLog({
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        userRole: currentRole,
        action: 'UNAUTHORIZED_OWNERSHIP_TRANSFER_ATTEMPT',
        resource: 'Ownership Transfer',
        category: 'security',
        details: `Unauthorized user ${user.name} (${currentRole}) attempted to transfer workspace ownership. Access Denied (403 Forbidden).`,
      });
      showToast('Access Denied (403 Forbidden)', 'Only the current verified Workspace Owner can initiate and authorize ownership transfer.', 'error');
      return false;
    }

    const targetMember = teamMembers.find(m => m.id === newOwnerId);
    if (!targetMember) {
      showToast('User Not Found', 'The selected target user does not exist in this workspace.', 'error');
      return false;
    }

    if (targetMember.id === user.id) {
      showToast('Action Redundant', 'You are already the active workspace Owner.', 'warning');
      return false;
    }

    if (targetMember.role === 'client') {
      showToast('Invalid Target Role', 'External Clients cannot be granted internal workspace ownership.', 'error');
      return false;
    }

    // 2. Authentication requirement
    if (!confirmationPassword || confirmationPassword.trim().length < 4) {
      showToast('Authentication Failed', 'Please provide a valid Owner security verification code/password to authenticate transfer.', 'error');
      return false;
    }

    try {
      // Backend transaction call
      const res = await fetch('/api/workspace/transfer-ownership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: workspace.id,
          authUserId: user.id,
          newOwnerId: targetMember.id,
          confirmationPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast('Transfer Failed', data.error || 'Server rejected ownership transfer.', 'error');
        return false;
      }
    } catch (err) {
      console.warn('Backend transfer fallback to local transaction:', err);
    }

    // 3. ATOMIC STATE MUTATION: Swap roles in state
    const previousOwnerName = user.name;
    const newOwnerName = targetMember.name;

    // A. Update team roster
    setTeamMembers(prev => prev.map(m => {
      if (m.id === user.id || m.role === 'owner') {
        return { ...m, role: 'manager' as RoleType };
      }
      if (m.id === targetMember.id) {
        return { ...m, role: 'owner' as RoleType };
      }
      return m;
    }));

    // B. Update workspace record
    const updatedWs: Workspace = {
      ...workspace,
      ownerId: targetMember.id,
      ownerName: newOwnerName,
    };
    setWorkspace(updatedWs);
    setWorkspaces(prev => prev.map(w => w.id === updatedWs.id ? updatedWs : w));

    // C. Update user workspaces membership list
    setUserWorkspaces(prev => prev.map(w => {
      if (w.workspaceId === workspace.id) {
        return { ...w, role: 'manager' as RoleType, isOwner: false };
      }
      return w;
    }));

    // D. Update current active session
    setUser(prev => ({
      ...prev,
      role: 'manager',
      activeRole: 'manager',
    }));

    // 4. Invariant Verification Assertion: Ensure exactly 1 Owner exists
    setTimeout(() => {
      setTeamMembers(current => {
        const owners = current.filter(m => m.role === 'owner');
        if (owners.length !== 1) {
          console.error('CRITICAL: Single-Owner invariant violation! Fixing state...');
          return current.map(m => m.id === targetMember.id ? { ...m, role: 'owner' } : { ...m, role: m.role === 'owner' ? 'manager' : m.role });
        }
        return current;
      });
    }, 50);

    // 5. Audit Log Entry
    addAuditLog({
      userId: user.id,
      userName: previousOwnerName,
      userAvatar: user.avatar,
      userRole: 'manager',
      action: 'OWNERSHIP_TRANSFERRED',
      resource: workspace.name,
      previousValue: previousOwnerName,
      newValue: newOwnerName,
      category: 'security',
      details: `Workspace ownership of "${workspace.name}" was transferred from ${previousOwnerName} to ${newOwnerName}. Previous owner role transitioned to Manager. Exactly 1 Owner exists.`,
    });

    // 6. User In-app Notification
    addNotification({
      title: '👑 Ownership Transferred Successfully',
      message: `Workspace ownership has been transferred to ${newOwnerName}. Your role is now Manager.`,
      type: 'approval',
      priority: 'high',
      actionUrl: '/settings/security',
    });

    triggerConfetti();
    showToast(
      'Ownership Transferred',
      `Ownership of "${workspace.name}" transferred to ${newOwnerName}. You are now a Manager.`,
      'success'
    );

    return true;
  };

  // Google Sign In Mock Simulator
  const signInWithGoogle = async (customUser?: Partial<User>) => {
    setIsGoogleVerifying(true);
    setGoogleVerificationStep('Connecting to Google Identity Services...');
    await new Promise(r => setTimeout(r, 600));

    setGoogleVerificationStep('Exchanging OAuth token for identity profile...');
    await new Promise(r => setTimeout(r, 600));

    setGoogleVerificationStep('Applying Workspace Role-Based Access Control...');
    await new Promise(r => setTimeout(r, 500));

    const verifiedUser: User = {
      id: customUser?.id || 'user-pallav',
      name: customUser?.name || 'Pallav Borkar',
      email: customUser?.email || 'pallavborkar73@gmail.com',
      avatar: customUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: (customUser?.role as RoleType) || 'owner',
      activeRole: (customUser?.role as RoleType) || 'owner',
      workspaceId: 'ws-jspm-01',
      workspaces: INITIAL_USER_WORKSPACES,
    };

    setUser(verifiedUser);
    setIsAuthenticated(true);
    setIsGoogleVerifying(false);
    setGoogleVerificationStep('');
    setAuthModalOpen(false);
    triggerConfetti();
    showToast('Google Identity Verified', `Welcome back, ${verifiedUser.name}! (${verifiedUser.email})`, 'success');
  };

  const signOutGoogle = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('socially_is_authenticated');
    showToast('Signed Out', 'Your session has been safely closed.', 'info');
  };

  // Filtered Resources based on active role and assigned permissions
  const filteredPosts = useMemo(() => {
    if (currentRole === 'owner' || currentRole === 'manager') {
      return posts;
    }
    if (currentRole === 'client') {
      // Clients see scheduled, approved, published posts and posts pending client review
      return posts.filter(p => ['approved', 'scheduled', 'published', 'pending_review', 'changes_requested'].includes(p.status));
    }
    if (currentRole === 'student') {
      // Students see their own posts, assigned posts, drafts, and approved/scheduled calendar
      return posts.filter(p => p.authorId === user.id || p.status === 'draft' || ['approved', 'scheduled', 'published'].includes(p.status));
    }
    return posts;
  }, [posts, currentRole, user.id]);

  const filteredCampaigns = useMemo(() => {
    if (currentRole === 'owner' || currentRole === 'manager') {
      return campaigns;
    }
    if (currentRole === 'client') {
      return campaigns.filter(c => c.status === 'active' || c.status === 'completed');
    }
    if (currentRole === 'student') {
      // Filter if assigned to campaigns
      const assignedIds = activeMembership.assignedCampaigns || [];
      if (assignedIds.length > 0) {
        return campaigns.filter(c => assignedIds.includes(c.id));
      }
      return campaigns;
    }
    return campaigns;
  }, [campaigns, currentRole, activeMembership]);

  const filteredTasks = useMemo(() => {
    if (currentRole === 'owner' || currentRole === 'manager') {
      return tasks;
    }
    if (currentRole === 'student') {
      return tasks.filter(t => t.assignedTo === user.id || t.assignedMember?.id === user.id);
    }
    if (currentRole === 'client') {
      return tasks.filter(t => t.status === 'review' || t.priority === 'urgent');
    }
    return tasks;
  }, [tasks, currentRole, user.id]);

  const filteredSocialAccounts = useMemo(() => {
    if (currentRole === 'owner' || currentRole === 'manager' || currentRole === 'client') {
      return socialAccounts;
    }
    if (currentRole === 'student') {
      const assignedAccs = activeMembership.assignedAccounts || [];
      if (assignedAccs.length > 0) {
        return socialAccounts.filter(a => assignedAccs.includes(a.id));
      }
      return socialAccounts;
    }
    return socialAccounts;
  }, [socialAccounts, currentRole, activeMembership]);

  const filteredAuditLogs = useMemo(() => {
    if (currentRole === 'owner') return auditLogs;
    if (currentRole === 'manager') return auditLogs.filter(l => l.category !== 'billing');
    if (currentRole === 'client') return auditLogs.filter(l => l.category === 'approval' || l.category === 'content');
    return auditLogs.filter(l => l.userId === user.id);
  }, [auditLogs, currentRole, user.id]);

  // Active Client & Client-scoped resources
  const activeClient = useMemo(() => {
    if (simulatedClientId) {
      return clients.find(c => c.id === simulatedClientId) || clients[0];
    }
    return clients.find(c => c.workspaceId === workspace.id) || clients[0];
  }, [clients, simulatedClientId, workspace.id]);

  const filteredBrandAssets = useMemo(() => {
    if (activeClient) {
      return brandAssets.filter(b => b.clientId === activeClient.id || b.workspaceId === workspace.id);
    }
    return brandAssets.filter(b => b.workspaceId === workspace.id);
  }, [brandAssets, activeClient, workspace.id]);

  const filteredClientMessages = useMemo(() => {
    if (activeClient) {
      return clientMessages.filter(m => m.clientId === activeClient.id || m.workspaceId === workspace.id);
    }
    return clientMessages.filter(m => m.workspaceId === workspace.id);
  }, [clientMessages, activeClient, workspace.id]);

  const filteredMonthlyReports = useMemo(() => {
    if (activeClient) {
      return monthlyReports.filter(r => r.clientId === activeClient.id || r.workspaceId === workspace.id);
    }
    return monthlyReports.filter(r => r.workspaceId === workspace.id);
  }, [monthlyReports, activeClient, workspace.id]);

  // Post Actions with RBAC & Audit Logging
  const addPost = (postData: Omit<Post, 'id' | 'authorId' | 'authorName' | 'approvals'>): Post => {
    if (!hasPermission('content.create')) {
      showToast('Permission Denied', 'You lack permission to draft new content.', 'error');
      throw new Error('Permission denied');
    }

    const defaultStatus: PostStatus = currentRole === 'student' ? 'draft' : (postData.status || 'draft');

    const newPost: Post = {
      ...postData,
      status: defaultStatus,
      id: `post-${Date.now()}`,
      authorId: user.id,
      authorName: user.name,
      approvals: {},
      aiScore: Math.floor(Math.random() * 15) + 82,
    };

    setPosts(prev => [newPost, ...prev]);

    addAuditLog({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userRole: currentRole,
      action: 'Created new post draft',
      resource: newPost.title,
      resourceId: newPost.id,
      category: 'content',
      details: `Created "${newPost.title}" formatted as ${newPost.contentType}.`,
    });

    showToast('Post Created', `"${newPost.title}" was saved as ${newPost.status}.`, 'success');
    return newPost;
  };

  const updatePost = (id: string, updates: Partial<Post>) => {
    if (!hasPermission('content.edit')) {
      showToast('Permission Denied', 'You lack permission to edit content in this workspace.', 'error');
      return;
    }

    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, ...updates };
      }
      return p;
    }));

    showToast('Post Updated', 'Changes saved successfully.', 'info');
  };

  const deletePost = (id: string) => {
    if (!hasPermission('content.delete')) {
      showToast('Permission Denied', 'You lack permission to delete posts.', 'error');
      return;
    }

    const pToDelete = posts.find(p => p.id === id);
    setPosts(prev => prev.filter(p => p.id !== id));

    addAuditLog({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userRole: currentRole,
      action: 'Deleted post',
      resource: pToDelete?.title || id,
      resourceId: id,
      category: 'content',
      details: `Removed post "${pToDelete?.title}".`,
    });

    showToast('Post Deleted', 'The post has been deleted.', 'info');
  };

  const submitPostForApproval = (id: string, note?: string) => {
    if (!hasPermission('approvals.submit')) {
      showToast('Permission Denied', 'You cannot submit content for approval.', 'error');
      return;
    }

    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const comments = p.approvals.comments || [];
        if (note) {
          comments.push({
            id: `c-${Date.now()}`,
            author: user.name,
            avatar: user.avatar,
            text: note,
            date: 'Just now',
            action: 'submitted',
          });
        }
        return {
          ...p,
          status: 'pending_review' as PostStatus,
          approvals: {
            ...p.approvals,
            submittedBy: user.name,
            submittedAt: new Date().toISOString(),
            comments,
          },
        };
      }
      return p;
    }));

    const post = posts.find(p => p.id === id);
    addAuditLog({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userRole: currentRole,
      action: 'Submitted content for approval',
      resource: post?.title || id,
      resourceId: id,
      previousValue: 'draft',
      newValue: 'pending_review',
      category: 'approval',
      details: note || `Submitted "${post?.title}" for review.`,
    });

    addNotification({
      title: `📝 Submission from ${user.name}`,
      message: `"${post?.title}" has been submitted for review.`,
      type: 'approval',
      actionText: 'Review Post',
      actionView: 'approvals',
    });

    showToast('Submitted for Review 🚀', 'Your post is in the review queue for Manager / Owner sign-off.', 'success');
  };

  const approvePost = (id: string, comment?: string) => {
    if (!hasPermission('approvals.approve')) {
      showToast('Permission Denied', 'Only Managers, Owners, or Clients can approve content.', 'error');
      return;
    }

    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const comments = p.approvals.comments || [];
        if (comment) {
          comments.push({
            id: `c-${Date.now()}`,
            author: user.name,
            avatar: user.avatar,
            text: comment,
            date: 'Just now',
            action: 'approved',
          });
        }
        return {
          ...p,
          status: 'approved' as PostStatus,
          approvals: {
            ...p.approvals,
            approvedBy: user.name,
            approvedAt: new Date().toISOString(),
            comments,
          },
        };
      }
      return p;
    }));

    const post = posts.find(p => p.id === id);
    addAuditLog({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userRole: currentRole,
      action: 'Approved post submission',
      resource: post?.title || id,
      resourceId: id,
      previousValue: 'pending_review',
      newValue: 'approved',
      category: 'approval',
      details: comment ? `Approved with comment: "${comment}"` : `Approved by ${user.name}.`,
    });

    triggerConfetti();
    showToast('Post Approved! 🎉', 'Content approved and ready for scheduling or direct publishing.', 'success');
  };

  const rejectPost = (id: string, reason: string) => {
    if (!hasPermission('approvals.review')) {
      showToast('Permission Denied', 'You lack permission to reject submissions.', 'error');
      return;
    }

    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const comments = p.approvals.comments || [];
        comments.push({
          id: `c-${Date.now()}`,
          author: user.name,
          avatar: user.avatar,
          text: `Rejected: ${reason}`,
          date: 'Just now',
          action: 'rejected',
        });
        return {
          ...p,
          status: 'draft' as PostStatus,
          approvals: {
            ...p.approvals,
            comments,
          },
        };
      }
      return p;
    }));

    const post = posts.find(p => p.id === id);
    addAuditLog({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userRole: currentRole,
      action: 'Rejected post submission',
      resource: post?.title || id,
      resourceId: id,
      previousValue: 'pending_review',
      newValue: 'draft',
      category: 'approval',
      details: `Rejection reason: ${reason}`,
    });

    showToast('Post Rejected', 'Sent back to draft stage with feedback.', 'warning');
  };

  const requestPostChanges = (id: string, feedback: string) => {
    if (!hasPermission('approvals.request_changes')) {
      showToast('Permission Denied', 'You lack permission to request revisions.', 'error');
      return;
    }

    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const comments = p.approvals.comments || [];
        comments.push({
          id: `c-${Date.now()}`,
          author: user.name,
          avatar: user.avatar,
          text: feedback,
          date: 'Just now',
          action: 'requested_changes',
        });
        return {
          ...p,
          status: 'changes_requested' as PostStatus,
          approvals: {
            ...p.approvals,
            comments,
          },
        };
      }
      return p;
    }));

    const post = posts.find(p => p.id === id);
    addAuditLog({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userRole: currentRole,
      action: 'Requested revisions on post',
      resource: post?.title || id,
      resourceId: id,
      previousValue: 'pending_review',
      newValue: 'changes_requested',
      category: 'approval',
      details: `Feedback: "${feedback}"`,
    });

    showToast('Feedback Sent', 'Changes requested. Creator has been notified.', 'info');
  };

  const publishPost = (id: string): boolean => {
    if (!hasPermission('content.publish')) {
      showToast('Publishing Restrained', 'Your role requires Manager / Owner approval before live dispatch.', 'error');
      return false;
    }

    const post = posts.find(p => p.id === id);
    if (!post) return false;

    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'published' } : p));

    addAuditLog({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userRole: currentRole,
      action: 'Published post to live social channels',
      resource: post.title,
      resourceId: id,
      previousValue: post.status,
      newValue: 'published',
      category: 'content',
      details: `Published directly to ${post.platforms.join(', ')}.`,
    });

    triggerConfetti();
    showToast('Published Live! 🚀', `"${post.title}" is now published on selected channels.`, 'success');
    return true;
  };

  // Task Actions
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'commentsCount' | 'attachmentsCount'>): Task => {
    if (!hasPermission('tasks.create')) {
      showToast('Permission Denied', 'You lack permission to create team tasks.', 'error');
      throw new Error('Permission denied');
    }

    const assigned = teamMembers.find(m => m.id === taskData.assignedTo) || teamMembers[0];
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      assignedMember: assigned,
      commentsCount: 0,
      attachmentsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTasks(prev => [newTask, ...prev]);

    addAuditLog({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userRole: currentRole,
      action: 'Created task assignment',
      resource: newTask.title,
      category: 'team',
      details: `Assigned task to ${assigned.name}.`,
    });

    showToast('Task Created', `Assigned "${newTask.title}" to ${assigned.name}.`, 'success');
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        let member = t.assignedMember;
        if (updates.assignedTo && updates.assignedTo !== t.assignedTo) {
          member = teamMembers.find(m => m.id === updates.assignedTo) || t.assignedMember;
        }
        return { ...t, ...updates, assignedMember: member };
      }
      return t;
    }));
    showToast('Task Updated', 'Task changes recorded.', 'info');
  };

  const deleteTask = (id: string) => {
    if (currentRole === 'student' && !hasPermission('tasks.create')) {
      showToast('Permission Denied', 'Students cannot delete task tickets.', 'error');
      return;
    }
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast('Task Removed', 'Task deleted from workspace board.', 'info');
  };

  const moveTaskStatus = (id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status };
      }
      return t;
    }));
  };

  // Social Account Actions
  const addSocialAccount = (accountData: Omit<SocialAccount, 'id' | 'lastSynced'>) => {
    if (!hasPermission('social_accounts.connect')) {
      showToast('Permission Denied', 'Only Owners and authorized Managers can connect new social accounts.', 'error');
      return;
    }

    const newAcc: SocialAccount = {
      ...accountData,
      id: `acc-${Date.now()}`,
      lastSynced: 'Just now',
    };

    setSocialAccounts(prev => [...prev, newAcc]);

    addAuditLog({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userRole: currentRole,
      action: 'Connected social account',
      resource: `${newAcc.accountName} (${newAcc.handle})`,
      category: 'security',
      details: `Linked ${newAcc.platform} handle ${newAcc.handle}.`,
    });

    showToast('Account Connected! 🔗', `Linked ${newAcc.accountName} (${newAcc.handle}).`, 'success');
  };

  const removeSocialAccount = (id: string) => {
    if (!hasPermission('social_accounts.disconnect')) {
      showToast('Permission Denied', 'Only Workspace Owners can disconnect social channels.', 'error');
      return;
    }

    const acc = socialAccounts.find(a => a.id === id);
    setSocialAccounts(prev => prev.filter(a => a.id !== id));

    addAuditLog({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userRole: currentRole,
      action: 'Disconnected social account',
      resource: acc?.accountName || id,
      category: 'security',
      details: `Unlinked ${acc?.handle} from workspace.`,
    });

    showToast('Account Disconnected', 'Account unlinked from workspace.', 'info');
  };

  const toggleConnectAccount = (id: string) => {
    if (!hasPermission('social_accounts.manage')) {
      showToast('Permission Denied', 'You lack permission to toggle account connections.', 'error');
      return;
    }

    setSocialAccounts(prev => prev.map(a => {
      if (a.id === id) {
        const nextState = !a.isConnected;
        return {
          ...a,
          isConnected: nextState,
          status: nextState ? 'active' : 'paused',
        };
      }
      return a;
    }));
  };

  const syncAccount = (id: string) => {
    setSocialAccounts(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, lastSynced: 'Just now' };
      }
      return a;
    }));
    showToast('Synced', 'Account metrics updated.', 'info');
  };

  // Events Actions
  const addCustomEvent = (evtData: Omit<EventDay, 'id' | 'isCustom' | 'daysAway'>) => {
    const newEvt: EventDay = {
      ...evtData,
      id: `evt-custom-${Date.now()}`,
      isCustom: true,
      daysAway: 5,
    };
    setEvents(prev => [...prev, newEvt]);
    showToast('Event Added 📅', `"${newEvt.title}" added to calendar radar.`, 'success');
  };

  const toggleEventReminder = (id: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id === id) {
        const next = !e.reminderSet;
        showToast(next ? 'Reminder Set 🔔' : 'Reminder Removed 🔕', next ? `We'll remind you before ${e.title}.` : 'Reminder dismissed.', 'info');
        return { ...e, reminderSet: next };
      }
      return e;
    }));
  };

  // Campaign Actions
  const addCampaign = (campaignData: Omit<Campaign, 'id' | 'postsCount' | 'tasksCount' | 'currentReach' | 'currentEngagement'>) => {
    if (!hasPermission('campaigns.create')) {
      showToast('Permission Denied', 'You lack permission to launch new campaigns.', 'error');
      return;
    }

    const newCamp: Campaign = {
      ...campaignData,
      id: `camp-${Date.now()}`,
      postsCount: 0,
      tasksCount: 0,
      currentReach: 0,
      currentEngagement: 0,
    };

    setCampaigns(prev => [newCamp, ...prev]);

    addAuditLog({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userRole: currentRole,
      action: 'Created campaign',
      resource: newCamp.name,
      category: 'campaign',
      details: `Started campaign "${newCamp.name}" with target reach ${newCamp.targetReach.toLocaleString()}.`,
    });

    showToast('Campaign Launched! 🚀', `"${newCamp.name}" is now active.`, 'success');
  };

  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    if (!hasPermission('campaigns.edit')) {
      showToast('Permission Denied', 'You lack permission to edit campaigns.', 'error');
      return;
    }
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    showToast('Campaign Updated', 'Campaign details saved.', 'info');
  };

  const deleteCampaign = (id: string) => {
    if (!hasPermission('campaigns.delete')) {
      showToast('Permission Denied', 'You lack permission to delete campaigns.', 'error');
      return;
    }
    setCampaigns(prev => prev.filter(c => c.id !== id));
    showToast('Campaign Removed', 'Campaign removed from workspace.', 'info');
  };

  // Chat Actions
  const addChatChannel = (name: string, topic: string, isPrivate = false) => {
    const newChan: ChatChannel = {
      id: `ch-${Date.now()}`,
      name: name.toLowerCase().replace(/\s+/g, '-'),
      topic,
      isPrivate,
      unreadCount: 0,
    };
    setChatChannels(prev => [...prev, newChan]);
    setChatMessages(prev => ({ ...prev, [newChan.id]: [] }));
    setActiveChannel(newChan.id);
    showToast('Channel Created #️⃣', `Welcome to #${newChan.name}!`, 'success');
  };

  const clearChannelUnread = (channelId: string) => {
    setChatChannels(prev => prev.map(c => c.id === channelId ? { ...c, unreadCount: 0 } : c));
  };

  const sendChatMessage = (
    channelId: string, 
    text: string, 
    mediaUrl?: string, 
    mediaType?: 'image' | 'video' | 'file'
  ) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      channelId,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      senderRole: ROLE_CONFIGS[currentRole].name,
      text,
      mediaUrl,
      mediaType,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: [],
    };

    setChatMessages(prev => ({
      ...prev,
      [channelId]: [...(prev[channelId] || []), newMsg],
    }));

    // AI Bot auto-reply if mention
    if (text.toLowerCase().includes('@socially') || text.toLowerCase().includes('@ai') || text.toLowerCase().includes('help')) {
      setTimeout(() => {
        const aiReplies = [
          `🤖 **AI Assistant**: For this upcoming event, I recommend leading with an emotional student quote hook + a 3-part carousel showing behind-the-scenes preparation. Best posting time is 6:45 PM today!`,
          `🤖 **AI Assistant**: Great topic! Here are 3 high-impact hooks:\n1. "Nobody warned us about this in first year..."\n2. "3 things every fresher asks within 48 hours"\n3. "The placement secret nobody talks about 📈"`,
          `🤖 **AI Assistant**: Analyzed recent algorithms! Carousel formats on LinkedIn and 25-second fast-cut reels on Instagram are generating 2.4x higher organic shares right now.`
        ];
        const randomReply = aiReplies[Math.floor(Math.random() * aiReplies.length)];
        const aiMsg: ChatMessage = {
          id: `msg-ai-${Date.now()}`,
          channelId,
          senderId: 'user-ai',
          senderName: 'Socially AI Bot',
          senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
          senderRole: 'AI Agent',
          text: randomReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reactions: [{ emoji: '⚡', count: 1, users: ['user-pallav'] }],
        };
        setChatMessages(p => ({
          ...p,
          [channelId]: [...(p[channelId] || []), aiMsg],
        }));
      }, 1000);
    }
  };

  const addChatReaction = (channelId: string, messageId: string, emoji: string) => {
    setChatMessages(prev => {
      const channelMsgs = prev[channelId] || [];
      const updated = channelMsgs.map(msg => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions?.find(r => r.emoji === emoji);
          if (existingReaction) {
            if (existingReaction.users.includes(user.id)) {
              const newUsers = existingReaction.users.filter(u => u !== user.id);
              if (newUsers.length === 0) {
                return { ...msg, reactions: (msg.reactions || []).filter(r => r.emoji !== emoji) };
              }
              return {
                ...msg,
                reactions: (msg.reactions || []).map(r => r.emoji === emoji ? { ...r, count: newUsers.length, users: newUsers } : r),
              };
            } else {
              return {
                ...msg,
                reactions: (msg.reactions || []).map(r => r.emoji === emoji ? { ...r, count: r.count + 1, users: [...r.users, user.id] } : r),
              };
            }
          } else {
            return {
              ...msg,
              reactions: [...(msg.reactions || []), { emoji, count: 1, users: [user.id] }],
            };
          }
        }
        return msg;
      });
      return { ...prev, [channelId]: updated };
    });
  };

  // Notification Actions
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('All Caught Up', 'All notifications marked as read.', 'info');
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => {
    const newN: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications(prev => [newN, ...prev]);
  };

  const triggerAIEventSuggestions = () => {
    const upcoming = events.filter(e => e.daysAway >= 0 && e.daysAway <= 14);
    if (upcoming.length === 0) {
      showToast('AI Scanner', 'No immediate events within 14 days. Content radar clear!', 'info');
      return;
    }

    const nextEvent = upcoming[0];
    const newSuggestion: AppNotification = {
      id: `notif-ai-gen-${Date.now()}`,
      title: `🤖 AI Alert: "${nextEvent.title}" is in ${nextEvent.daysAway} days`,
      message: `AI recommends publishing a high-engagement ${nextEvent.category} themed post: "${nextEvent.suggestedAngle || nextEvent.description}".`,
      type: 'ai_suggestion',
      timestamp: 'Just now',
      isRead: false,
      actionText: '⚡ Create Post with AI',
      actionView: 'studio',
      aiSuggestedIdea: {
        title: `${nextEvent.title} Special Spotlight 🌟`,
        caption: `✨ Exciting times ahead! As ${nextEvent.title} approaches, our campus is gearing up with special activities, inspiring stories, and student showcases.\n\n${nextEvent.suggestedAngle ? '👉 ' + nextEvent.suggestedAngle + '\n\n' : ''}Stay tuned for live coverage! 🚀\n\n#${(nextEvent.sampleHashtags || ['JSPMCampus', 'Events']).join(' #')}`,
        hashtags: nextEvent.sampleHashtags || ['JSPMCampus', 'UpcomingEvent', 'CampusLife'],
        hook: `Did you know ${nextEvent.title} is just around the corner? Here's how our college is celebrating! 🎉`,
        angle: nextEvent.suggestedAngle || nextEvent.description,
        contentType: 'post',
        suggestedPlatforms: ['instagram', 'linkedin'],
      },
    };

    setNotifications(prev => [newSuggestion, ...prev]);
    showToast('AI Suggestions Generated! ✨', `Found ${upcoming.length} upcoming events with content angles.`, 'success');
  };

  // Media Actions
  const addMediaItem = (itemData: Omit<MediaItem, 'id' | 'uploadedAt' | 'uploadedBy'>) => {
    if (!hasPermission('media.upload')) {
      showToast('Permission Denied', 'You lack permission to upload media assets.', 'error');
      return;
    }

    const newItem: MediaItem = {
      ...itemData,
      id: `med-${Date.now()}`,
      uploadedAt: new Date().toLocaleString(),
      uploadedBy: user.name,
    };
    setMediaItems(prev => [newItem, ...prev]);
    showToast('Media Uploaded', `"${newItem.name}" added to folder ${newItem.folder}.`, 'success');
  };

  const deleteMediaItem = (id: string) => {
    if (!hasPermission('media.delete')) {
      showToast('Permission Denied', 'You lack permission to delete media assets.', 'error');
      return;
    }
    setMediaItems(prev => prev.filter(m => m.id !== id));
    showToast('File Removed', 'Media asset removed from workspace.', 'info');
  };

  // Subscription helpers
  const checkFeatureAccess = (featureKey: FeatureKey): boolean => {
    return hasFeatureAccess(subscription.planId, featureKey);
  };

  const consumeAICredit = (amount = 1): boolean => {
    const planConfig = SUBSCRIPTION_PLANS[subscription.planId];
    const currentUsed = subscription.usage.aiCreditsUsedThisMonth;
    const maxLimit = planConfig.limits.aiGenerationsPerMonth;

    if (currentUsed + amount > maxLimit) {
      openUpgradeModal('limited_ai', {
        featureName: 'Monthly AI Superpowers Quota Reached',
        description: `You've utilized all ${maxLimit} AI credits for this billing period on the ${planConfig.name} plan. Upgrade to unlock unlimited brainstorming, caption engineering, and viral radar scans.`,
        targetPlan: subscription.planId === 'free' ? 'creator' : subscription.planId === 'creator' ? 'team' : 'pro',
      });
      return false;
    }

    setSubscription(prev => ({
      ...prev,
      usage: {
        ...prev.usage,
        aiCreditsUsedThisMonth: prev.usage.aiCreditsUsedThisMonth + amount,
      },
    }));
    return true;
  };

  const openUpgradeModal = (featureKey?: FeatureKey, customMeta?: { featureName?: string; description?: string; targetPlan?: SubscriptionPlanId }) => {
    const targetPlan = customMeta?.targetPlan || (featureKey ? getRequiredPlanForFeature(featureKey) : 'team');
    setUpgradeModalState({
      isOpen: true,
      featureKey,
      featureName: customMeta?.featureName,
      description: customMeta?.description,
      targetPlan,
    });
  };

  const closeUpgradeModal = () => {
    setUpgradeModalState({ isOpen: false });
  };

  const openCheckoutModal = (planId: SubscriptionPlanId = 'team', cycle: BillingCycle = billingCycle) => {
    setCheckoutModalState({
      isOpen: true,
      selectedPlan: planId,
      billingCycle: cycle,
    });
    setUpgradeModalState({ isOpen: false });
  };

  const closeCheckoutModal = () => {
    setCheckoutModalState({ isOpen: false });
  };

  const openEnterpriseModal = () => {
    setIsEnterpriseModalOpen(true);
    setUpgradeModalState({ isOpen: false });
  };

  const closeEnterpriseModal = () => {
    setIsEnterpriseModalOpen(false);
  };

  const processSubscriptionPayment = (paymentData: { 
    planId: SubscriptionPlanId; 
    billingCycle: BillingCycle; 
    amount: number; 
    paymentMethod: string; 
    billingContact: any;
  }) => {
    const plan = SUBSCRIPTION_PLANS[paymentData.planId];
    const newInvoice: InvoiceItem = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `SOC-INV-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      dueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'paid',
      planName: plan.name,
      billingCycle: paymentData.billingCycle,
      amount: paymentData.amount,
      currency: 'INR',
      currencySymbol: '₹',
      paymentMethod: paymentData.paymentMethod,
      taxAmount: Math.round(paymentData.amount * 0.18),
      subtotal: Math.round(paymentData.amount * 0.82),
    };

    setInvoices(prev => [newInvoice, ...prev]);

    setSubscription(prev => ({
      ...prev,
      planId: paymentData.planId,
      status: 'active',
      billingCycle: paymentData.billingCycle,
      currentPeriodStart: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      cancelAtPeriodEnd: false,
      billingContact: paymentData.billingContact || prev.billingContact,
    }));

    addAuditLog({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userRole: currentRole,
      action: 'Upgraded subscription tier',
      resource: `${plan.name} (${paymentData.billingCycle})`,
      category: 'billing',
      details: `Processed payment of ₹${paymentData.amount.toLocaleString('en-IN')}. Receipt ${newInvoice.invoiceNumber}.`,
    });

    addNotification({
      title: `🎉 Subscribed to ${SUBSCRIPTION_PLANS[paymentData.planId].name}`,
      message: `Your payment of ₹${paymentData.amount.toLocaleString('en-IN')} was processed successfully. Receipt ${newInvoice.invoiceNumber} is now available in Billing Settings.`,
      type: 'system',
      actionText: 'View Billing Settings',
      actionView: 'settings',
    });
  };

  const cancelSubscription = () => {
    setSubscription(prev => ({ ...prev, cancelAtPeriodEnd: true }));
    showToast('Subscription Cancelled', 'Plan features remain active until end of billing cycle.', 'warning');
  };

  const resumeSubscription = () => {
    setSubscription(prev => ({ ...prev, cancelAtPeriodEnd: false, status: 'active' }));
    showToast('Subscription Resumed', 'Auto-renewal has been reactivated.', 'success');
  };

  const updateSubscriptionSandbox = (planId: SubscriptionPlanId, status: SubscriptionStatus) => {
    setSubscription(prev => ({
      ...prev,
      planId,
      status,
      cancelAtPeriodEnd: false,
      trialDaysLeft: status === 'trial' ? 7 : undefined,
    }));
  };

  // Client Management Actions
  const addClient = (clientData: {
    name: string;
    companyName?: string;
    email: string;
    phone?: string;
    industry: string;
    website?: string;
    logo?: string;
    description?: string;
    assignedManagerId: string;
    assignedTeamMemberIds: string[];
    contractValue?: string;
    slaHours?: number;
    billingSchedule?: 'monthly' | 'quarterly' | 'annual';
    notes?: string;
  }): Client => {
    if (!hasPermission('clients.manage')) {
      showToast('Permission Denied', 'You lack permission to create and onboard clients.', 'error');
      throw new Error('Permission denied');
    }

    const clientId = `client-${Date.now()}`;
    const workspaceId = `ws-client-${Date.now()}`;
    const manager = teamMembers.find(m => m.id === clientData.assignedManagerId) || teamMembers[0];

    // Create client isolated workspace
    const newWs: Workspace = {
      id: workspaceId,
      name: clientData.companyName || clientData.name,
      type: 'agency',
      logo: clientData.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      memberCount: 3,
      plan: 'agency',
      createdAt: new Date().toISOString().split('T')[0],
      ownerId: user.id,
      ownerName: user.name,
    };

    const newClient: Client = {
      id: clientId,
      name: clientData.name,
      companyName: clientData.companyName || clientData.name,
      email: clientData.email,
      phone: clientData.phone,
      industry: clientData.industry,
      website: clientData.website,
      logo: clientData.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      description: clientData.description || `Leading ${clientData.industry} brand partnered with Socially.`,
      status: 'onboarding',
      assignedManagerId: manager.id,
      assignedManagerName: manager.name,
      assignedManagerAvatar: manager.avatar,
      assignedTeamMemberIds: clientData.assignedTeamMemberIds,
      clientTimezone: 'Asia/Kolkata',
      country: 'India',
      brandColor: '#6366F1',
      socialPlatforms: ['instagram', 'linkedin', 'facebook', 'youtube'],
      workspaceId: workspaceId,
      socialAccountsCount: 0,
      activeCampaignsCount: 0,
      pendingApprovalsCount: 0,
      scheduledPostsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      lastActivity: 'Just created client profile',
      onboardingChecklist: [
        { id: 'step-1', label: 'Brand Profile & Guidelines', completed: true },
        { id: 'step-2', label: 'Connect Social Accounts', completed: false },
        { id: 'step-3', label: 'Invite Client Stakeholders', completed: false },
        { id: 'step-4', label: 'Review & Approve Sample Content', completed: false },
        { id: 'step-5', label: 'Launch First Live Campaign', completed: false },
      ],
    };

    setWorkspaces(prev => [...prev, newWs]);
    setUserWorkspaces(prev => [
      ...prev,
      {
        workspaceId: newWs.id,
        workspaceName: newWs.name,
        workspaceType: newWs.type,
        role: 'owner',
        isOwner: true,
      }
    ]);
    setClients(prev => [newClient, ...prev]);

    addAuditLog({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userRole: currentRole,
      action: 'Created new client profile & workspace',
      resource: newClient.name,
      resourceId: newClient.id,
      category: 'workspace',
      details: `Onboarded "${newClient.name}" (${newClient.industry}) with workspace ${newWs.name}.`,
    });

    addNotification({
      title: `✨ New Client: ${newClient.name}`,
      message: `Dedicated client workspace created with manager ${manager.name}.`,
      type: 'system',
      actionText: 'View Clients',
      actionView: 'clients',
    });

    triggerConfetti();
    showToast('Client Onboarded! 🎉', `Created client workspace for ${newClient.name}.`, 'success');
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    if (!hasPermission('clients.manage')) {
      showToast('Permission Denied', 'You lack permission to modify client profiles.', 'error');
      return;
    }

    setClients(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, ...updates, lastActivity: 'Updated client profile' };
      }
      return c;
    }));

    showToast('Client Updated', 'Client profile saved successfully.', 'info');
  };

  const deleteClient = (id: string) => {
    if (!hasPermission('clients.manage')) {
      showToast('Permission Denied', 'Only authorized managers can remove client accounts.', 'error');
      return;
    }

    const cToDelete = clients.find(c => c.id === id);
    setClients(prev => prev.filter(c => c.id !== id));
    if (cToDelete?.workspaceId) {
      setWorkspaces(prev => prev.filter(w => w.id !== cToDelete.workspaceId));
    }

    addAuditLog({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userRole: currentRole,
      action: 'Deleted client profile',
      resource: cToDelete?.name || id,
      resourceId: id,
      category: 'workspace',
      details: `Removed client "${cToDelete?.name}".`,
    });

    showToast('Client Removed', `Client ${cToDelete?.name || ''} has been removed.`, 'info');
  };

  const toggleClientOnboardingStep = (clientId: string, stepId: string) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        const updatedSteps = (c.onboardingChecklist || []).map(step => {
          if (step.id === stepId) {
            return { ...step, completed: !step.completed };
          }
          return step;
        });
        const completedCount = updatedSteps.filter(s => s.completed).length;
        const totalCount = updatedSteps.length;
        const newStatus: ClientStatus = completedCount === totalCount ? 'active' : c.status === 'inactive' ? 'inactive' : 'onboarding';
        return {
          ...c,
          status: newStatus,
          onboardingChecklist: updatedSteps,
          lastActivity: 'Updated onboarding progress',
        };
      }
      return c;
    }));
    showToast('Checklist Updated', 'Onboarding progress updated.', 'success');
  };

  const inviteClientUser = (clientId: string, email: string, name: string) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          lastActivity: `Invited ${name || email} to portal`,
        };
      }
      return c;
    }));

    addNotification({
      title: `✉️ Portal Invite Sent: ${name || email}`,
      message: `Invitation sent with secure client portal link.`,
      type: 'system',
      actionText: 'View Client',
      actionView: 'clients',
    });

    showToast('Invite Sent! ✉️', `Invitation sent to ${email} with portal credentials.`, 'success');
  };

  // Brand Asset Actions
  const addBrandAsset = (asset: Omit<BrandAsset, 'id' | 'uploadedAt' | 'uploadedBy' | 'isApproved'>) => {
    const newAsset: BrandAsset = {
      ...asset,
      id: `asset-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0],
      uploadedBy: user.name,
      isApproved: true,
    };
    setBrandAssets(prev => [newAsset, ...prev]);
    showToast('Brand Asset Uploaded', `"${newAsset.title}" is now stored in Brand Assets.`, 'success');
  };

  const approveBrandAsset = (id: string) => {
    setBrandAssets(prev => prev.map(a => a.id === id ? { ...a, isApproved: true } : a));
    showToast('Asset Approved', 'Brand asset marked as verified and approved.', 'success');
  };

  const deleteBrandAsset = (id: string) => {
    setBrandAssets(prev => prev.filter(a => a.id !== id));
    showToast('Asset Removed', 'Asset removed from brand library.', 'info');
  };

  // Client Message Actions
  const sendClientMessage = (text: string, mediaUrl?: string, mediaType?: 'image' | 'video' | 'file', fileName?: string, postId?: string, postTitle?: string) => {
    const isClient = currentRole === 'client' || isClientViewMode;
    const activeCli = activeClient;
    const newMsg: ClientMessage = {
      id: `cmsg-${Date.now()}`,
      clientId: activeCli ? activeCli.id : 'client-abc-01',
      workspaceId: workspace.id,
      senderId: user.id,
      senderName: isClient ? (activeCli ? activeCli.name : user.name) : user.name,
      senderAvatar: isClient ? (activeCli?.logo || user.avatar) : user.avatar,
      senderRole: isClient ? 'client' : currentRole,
      isClient: isClient,
      text,
      mediaUrl,
      mediaType,
      fileName,
      postId,
      postTitle,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setClientMessages(prev => [...prev, newMsg]);

    // Simulated instant reply if client sent message
    if (isClient) {
      setTimeout(() => {
        const agencyReplies = [
          `Thanks for the note! Our design team is refining the creative now. We'll post an update shortly.`,
          `Got it! We've made note of your brand guidelines and adjusted the schedule accordingly.`,
          `Great feedback! We've updated the post caption and submitted the revision to your review queue.`
        ];
        const autoReply = agencyReplies[Math.floor(Math.random() * agencyReplies.length)];
        const autoMsg: ClientMessage = {
          id: `cmsg-auto-${Date.now()}`,
          clientId: activeCli ? activeCli.id : 'client-abc-01',
          workspaceId: workspace.id,
          senderId: 'user-manager',
          senderName: activeCli?.assignedManagerName || 'Aarav Sharma',
          senderAvatar: activeCli?.assignedManagerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          senderRole: 'manager',
          isClient: false,
          text: autoReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setClientMessages(prev => [...prev, autoMsg]);
      }, 1200);
    }
  };

  // Monthly Reports Actions
  const generateMonthlyReport = (month = 'August 2026') => {
    const activeCli = activeClient;
    const newReport: MonthlyReport = {
      id: `report-${Date.now()}`,
      clientId: activeCli ? activeCli.id : 'client-abc-01',
      workspaceId: workspace.id,
      month: month,
      title: `${activeCli?.name || 'ABC Education Group'} Performance Executive Report — ${month}`,
      date: new Date().toISOString().split('T')[0],
      followers: 61130,
      followersGrowth: 14.2,
      reach: 374700,
      reachGrowth: 22.4,
      engagement: 42300,
      engagementGrowth: 18.1,
      postsCount: 26,
      topContent: {
        title: 'Top Campus Tour Reel',
        views: '142.5K views',
        platform: 'instagram',
        engagementRate: '8.4%',
        likes: 12400,
        shares: 3100,
      },
      aiExecutiveSummary: `Organic impressions grew by 38.4% with record video retention across Instagram Reels and LinkedIn thought leadership pieces. All SLA approval response times met under 24 hours.`,
      topReasons: [
        'Top performing Reel achieved 142.5k organic plays with 2.8k saves',
        'LinkedIn Founder series boosted profile views by 64%',
        'Community sentiment rose to 98.2% positive across comments',
      ],
      recommendedNextSteps: [
        'Scale carousel frequency on Tuesdays & Thursdays at 7 PM IST',
        'Implement student/customer video testimonials for product launches',
        'Test interactive polls on Instagram stories to drive direct messages',
      ],
      platformBreakdown: [
        { platform: 'instagram', followers: 28400, reach: 198000, growth: 16.2 },
        { platform: 'linkedin', followers: 16200, reach: 98000, growth: 14.1 },
        { platform: 'youtube', followers: 11500, reach: 54000, growth: 11.8 },
        { platform: 'facebook', followers: 5030, reach: 24700, growth: 4.3 },
      ],
      status: 'ready',
    };

    setMonthlyReports(prev => [newReport, ...prev]);
    showToast('Report Generated 📊', `Monthly Executive Report for ${month} is ready.`, 'success');
    return newReport;
  };

  // Client Simulation Mode Actions
  const enterClientViewMode = (clientId: string) => {
    setSimulatedClientId(clientId);
    setIsClientViewMode(true);
    setActiveView('client_dashboard');
    showToast('Client Portal Mode 👁️', 'Now previewing as Client Stakeholder.', 'info');
  };

  const exitClientViewMode = () => {
    setIsClientViewMode(false);
    setSimulatedClientId(null);
    setActiveView('clients');
    showToast('Exited Client Mode', 'Returned to Agency Manager View.', 'info');
  };

  // Timezone, Live Clock & Dynamic Regional State
  const detectedTz = useMemo(() => getBrowserTimezone(), []);

  const [userTimezone, setUserTimezone] = useState<string>(() => {
    const saved = localStorage.getItem('socially_user_timezone');
    return saved || detectedTz;
  });

  const [timeSettings, setTimeSettings] = useState<WorkspaceTimeSettings>(() => {
    const saved = localStorage.getItem('socially_time_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      timezone: detectedTz,
      timeFormat: '12h',
      dateFormat: 'MMM D, YYYY',
      weekStartsOn: 1,
      autoDetectTimezone: true,
    };
  });

  useEffect(() => {
    localStorage.setItem('socially_user_timezone', userTimezone);
  }, [userTimezone]);

  useEffect(() => {
    localStorage.setItem('socially_time_settings', JSON.stringify(timeSettings));
  }, [timeSettings]);

  const workspaceTimezone = timeSettings.timezone || userTimezone;

  const setWorkspaceTimezone = (tz: string) => {
    setTimeSettings(prev => ({ ...prev, timezone: tz }));
    setUserTimezone(tz);
  };

  const updateTimeSettings = (newSettings: Partial<WorkspaceTimeSettings>) => {
    setTimeSettings(prev => {
      const updated = { ...prev, ...newSettings };
      if (newSettings.timezone) {
        setUserTimezone(newSettings.timezone);
      }
      return updated;
    });
    showToast('Time & Region Updated', 'Workspace regional preferences have been saved.', 'success');
  };

  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const is24Hour = timeSettings.timeFormat === '24h';
  const tzDetails = useMemo(() => getTimezoneDetails(userTimezone, currentTime), [userTimezone, currentTime]);

  const liveClock = useMemo(() => {
    return {
      time: formatInTimezone(currentTime, userTimezone, 'time', is24Hour),
      timeWithSeconds: formatInTimezone(currentTime, userTimezone, 'time-seconds', is24Hour),
      date: formatInTimezone(currentTime, userTimezone, 'date', is24Hour),
      full: formatInTimezone(currentTime, userTimezone, 'full', is24Hour),
      tzAbbrev: tzDetails.abbrev,
      tzOffset: tzDetails.offset,
      is24Hour,
    };
  }, [currentTime, userTimezone, is24Hour, tzDetails]);

  const formatDate = (
    date: Date | string | number,
    style: 'datetime' | 'date' | 'time' | 'time-seconds' | 'full' | 'short-date' | 'month-year' | 'iso-date' | 'relative' = 'datetime'
  ) => {
    return formatInTimezone(date, userTimezone, style, is24Hour);
  };

  const formatRelative = (date: Date | string | number) => {
    return formatRelativeTime(date, currentTime, userTimezone);
  };

  const getEventCountdown = (eventDate: string) => {
    return calculateDaysAway(eventDate, userTimezone, currentTime);
  };

  const greetingData = useMemo(() => {
    return getGreetingForTimezone(userTimezone, currentTime, user.name.split(' ')[0]);
  }, [userTimezone, currentTime, user.name]);

  const { greeting: currentGreeting, wittySubtext, greetingIcon, timeOfDay } = greetingData;

  return (
    <AppContext.Provider
      value={{
        workspace,
        setWorkspace,
        workspaces,
        userWorkspaces,
        activeMembership,
        currentRole,
        customPermissions,
        hasPermission,
        switchWorkspace,
        createWorkspace,
        deleteWorkspace,
        switchUserRole,
        updateMemberRole,
        updateMemberPermissions,
        removeTeamMember,
        transferOwnership,

        user,
        setUser,
        activeView,
        setActiveView,
        isDarkMode,
        setIsDarkMode,

        // Timezone, Live Clock & Dynamic Regional System
        userTimezone,
        setUserTimezone,
        workspaceTimezone,
        setWorkspaceTimezone,
        timeSettings,
        updateTimeSettings,
        currentTime,
        liveClock,
        formatDate,
        formatRelative,
        getEventCountdown,
        greetingIcon,
        timeOfDay,

        // Data entities
        posts,
        filteredPosts,
        addPost,
        updatePost,
        deletePost,
        submitPostForApproval,
        approvePost,
        rejectPost,
        requestPostChanges,
        publishPost,

        tasks,
        filteredTasks,
        addTask,
        updateTask,
        deleteTask,
        moveTaskStatus,

        socialAccounts,
        filteredSocialAccounts,
        selectedAccountId,
        setSelectedAccountId,
        addSocialAccount,
        removeSocialAccount,
        toggleConnectAccount,
        syncAccount,

        events,
        addCustomEvent,
        toggleEventReminder,

        campaigns,
        filteredCampaigns,
        addCampaign,
        updateCampaign,
        deleteCampaign,

        chatChannels,
        addChatChannel,
        chatMessages,
        activeChannel,
        setActiveChannel,
        sendChatMessage,
        addChatReaction,
        clearChannelUnread,

        notifications,
        unreadNotificationsCount,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        triggerAIEventSuggestions,

        mediaItems,
        addMediaItem,
        deleteMediaItem,

        teamMembers,
        inviteTeamMember,

        auditLogs,
        filteredAuditLogs,
        addAuditLog,

        analytics,

        // Clients & Client Portal
        clients,
        activeClient,
        addClient,
        updateClient,
        deleteClient,
        toggleClientOnboardingStep,
        inviteClientUser,

        // Brand Assets
        brandAssets,
        filteredBrandAssets,
        addBrandAsset,
        approveBrandAsset,
        deleteBrandAsset,

        // Client Messages
        clientMessages,
        filteredClientMessages,
        sendClientMessage,

        // Monthly Reports
        monthlyReports,
        filteredMonthlyReports,
        generateMonthlyReport,

        // Client Simulation Mode & Content Review
        isClientViewMode,
        simulatedClientId,
        enterClientViewMode,
        exitClientViewMode,
        reviewModalPostId,
        setReviewModalPostId,

        // Subscription and billing
        subscription,
        setSubscription,
        billingCycle,
        setBillingCycle,
        invoices,
        upgradeModalState,
        openUpgradeModal,
        closeUpgradeModal,
        checkoutModalState,
        openCheckoutModal,
        closeCheckoutModal,
        isEnterpriseModalOpen,
        openEnterpriseModal,
        closeEnterpriseModal,
        processSubscriptionPayment,
        cancelSubscription,
        resumeSubscription,
        updateSubscriptionSandbox,
        checkFeatureAccess,
        consumeAICredit,

        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isStudioModalOpen,
        setIsStudioModalOpen,
        studioInitialDraft,
        setStudioInitialDraft,
        isMobileDrawerOpen,
        setIsMobileDrawerOpen,

        isAuthenticated,
        setIsAuthenticated,
        isGoogleVerifying,
        googleVerificationStep,
        signInWithGoogle,
        signOutGoogle,

        authModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
        isOnboarding,
        setIsOnboarding,
        managementType,
        setManagementType,
        onboardingGoals,
        setOnboardingGoals,
        isSetupDismissed,
        setIsSetupDismissed,
        dismissSetup,
        resetOnboarding,

        currentGreeting,
        wittySubtext,

        toasts,
        showToast,
        dismissToast,
        triggerConfetti,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};