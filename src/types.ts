export type SocialPlatform = 'instagram' | 'facebook' | 'linkedin' | 'youtube' | 'x' | 'tiktok';

export type PostStatus = 'draft' | 'internal_review' | 'pending_review' | 'changes_requested' | 'approved' | 'scheduled' | 'published';

export type ContentType = 'post' | 'reel' | 'story' | 'video' | 'short' | 'carousel';

export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

// RBAC Core Roles
export type RoleType = 'owner' | 'manager' | 'editor' | 'student' | 'viewer' | 'client' | 'custom';

// Backwards compatibility alias for existing components
export type TeamRole = RoleType | 'admin' | 'social_media_manager' | 'content_manager' | 'designer' | 'video_editor' | 'analyst';

export type PermissionKey =
  | 'content.view'
  | 'content.create'
  | 'content.edit'
  | 'content.delete'
  | 'content.schedule'
  | 'content.publish'
  | 'content.comment'
  | 'media.view'
  | 'media.upload'
  | 'media.delete'
  | 'analytics.view'
  | 'analytics.export'
  | 'social_accounts.view'
  | 'social_accounts.connect'
  | 'social_accounts.disconnect'
  | 'social_accounts.manage'
  | 'campaigns.view'
  | 'campaigns.create'
  | 'campaigns.edit'
  | 'campaigns.delete'
  | 'tasks.view'
  | 'tasks.create'
  | 'tasks.assign'
  | 'tasks.complete'
  | 'approvals.view'
  | 'approvals.submit'
  | 'approvals.review'
  | 'approvals.approve'
  | 'approvals.request_changes'
  | 'team.view'
  | 'team.invite'
  | 'team.edit'
  | 'team.remove'
  | 'team.change_role'
  | 'clients.view'
  | 'clients.manage'
  | 'clients.invite'
  | 'brand_assets.view'
  | 'brand_assets.manage'
  | 'brand_assets.upload'
  | 'messages.use'
  | 'messages.client'
  | 'billing.view'
  | 'billing.manage'
  | 'workspace.view'
  | 'workspace.settings'
  | 'workspace.delete'
  | 'reports.view'
  | 'reports.export'
  | 'reports.download'
  | 'ai.use'
  | 'ai.manage';

export interface WorkspaceTimeSettings {
  timezone: string;
  timeFormat: '12h' | '24h';
  dateFormat: 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'MMM D, YYYY';
  weekStartsOn: 0 | 1; // 0 = Sunday, 1 = Monday
  autoDetectTimezone: boolean;
}

export interface WorkspaceMembership {
  workspaceId: string;
  workspaceName: string;
  workspaceType: 'college' | 'business' | 'agency' | 'creator' | 'startup' | 'organization' | 'other';
  role: RoleType;
  customPermissions?: PermissionKey[];
  assignedAccounts?: string[]; // Account IDs
  assignedCampaigns?: string[]; // Campaign IDs
  assignedTasks?: string[];
  isOwner?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: RoleType;
  activeRole?: RoleType;
  workspaceId: string;
  workspaces?: WorkspaceMembership[];
  customPermissions?: PermissionKey[];
  timezone?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: RoleType;
  status: 'active' | 'offline' | 'busy';
  assignedTasksCount: number;
  recentActivity: string;
  joinedDate: string;
  timezone?: string;
  workspaceId?: string;
  customPermissions?: PermissionKey[];
  assignedAccounts?: string[];
  assignedCampaigns?: string[];
  tasksAssigned?: number;
}

export interface AuditLogEntry {
  id: string;
  workspaceId: string;
  workspaceName?: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: RoleType;
  action: string;
  resource: string;
  resourceId?: string;
  timestamp: string;
  details?: string;
  previousValue?: string;
  newValue?: string;
  category: 'content' | 'approval' | 'team' | 'security' | 'workspace' | 'billing' | 'campaign';
}

export interface OwnershipTransferPayload {
  targetMemberId: string;
  targetMemberName: string;
  securityConfirmation: string;
}

export interface SecurityTestResult {
  id: number;
  name: string;
  status: 'PASS' | 'PASS (BLOCKED)' | 'PASS (ATOMIC)' | 'PASS (INVARIANT)' | 'PASS (VERIFIED)' | 'FAILED';
  code: number;
  detail: string;
}

export interface Workspace {
  id: string;
  name: string;
  type: 'college' | 'business' | 'agency' | 'creator' | 'startup' | 'organization' | 'other';
  logo?: string;
  memberCount: number;
  plan: 'free' | 'creator' | 'team' | 'pro' | 'agency' | 'enterprise';
  createdAt: string;
  ownerId?: string;
  ownerName?: string;
  timeSettings?: WorkspaceTimeSettings;
}

export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  accountName: string;
  handle: string;
  avatar: string;
  category?: string;
  followers: number;
  followersChange: number;
  reach: number;
  engagementRate: number;
  lastSynced: string;
  isConnected: boolean;
  status: 'active' | 'needs_reauth' | 'disconnected';
  postsCount?: number;
  impressions?: number;
}

export interface Post {
  id: string;
  title: string;
  caption: string;
  hashtags: string[];
  platforms: SocialPlatform[];
  contentType: ContentType;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  scheduledDate: string; // ISO or YYYY-MM-DD HH:mm
  status: PostStatus;
  campaignId?: string;
  campaignName?: string;
  assignedTo?: string;
  assignedMember?: TeamMember;
  authorId: string;
  authorName: string;
  workspaceId?: string;
  clientId?: string;
  objective?: string;
  aiRecommendations?: string[];
  approvals: {
    approvedBy?: string;
    approvedAt?: string;
    comments?: Array<{
      id: string;
      author: string;
      avatar: string;
      role?: RoleType;
      text: string;
      date: string;
      action?: 'approved' | 'rejected' | 'comment' | 'requested_changes';
    }>;
  };
  metrics?: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    reach: number;
    impressions: number;
    videoViews?: number;
  };
  aiScore?: number;
}

export interface EventDay {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: 'india' | 'global' | 'education' | 'technology' | 'business' | 'environment' | 'custom';
  description: string;
  daysAway: number;
  isCustom?: boolean;
  suggestedAngle?: string;
  sampleHashtags?: string[];
  reminderSet?: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'planning' | 'completed' | 'paused';
  targetReach: number;
  currentReach: number;
  targetEngagement: number;
  currentEngagement: number;
  postsCount: number;
  tasksCount: number;
  color: string;
  team: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // member id
  assignedMember?: TeamMember;
  deadline: string;
  priority: TaskPriority;
  status: TaskStatus;
  campaignId?: string;
  campaignName?: string;
  commentsCount: number;
  attachmentsCount: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: string;
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'file';
  fileName?: string;
  timestamp: string;
  reactions: Array<{ emoji: string; count: number; users: string[] }>;
  replyToId?: string;
  replyText?: string;
}

export interface ChatChannel {
  id: string;
  name: string;
  topic: string;
  unreadCount: number;
  isPrivate?: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'approval' | 'mention' | 'task' | 'reminder' | 'event' | 'system' | 'campaign' | 'ai_suggestion';
  timestamp: string;
  isRead: boolean;
  priority?: 'urgent' | 'high' | 'medium' | 'low';
  actionUrl?: string;
  actionText?: string;
  actionView?: string;
  actionPayload?: any;
  eventDayId?: string;
  aiSuggestedIdea?: {
    title: string;
    caption: string;
    hashtags: string[];
    targetAudience?: string;
    hook?: string;
    angle?: string;
    contentType?: ContentType;
    suggestedPlatforms?: SocialPlatform[];
  };
}

export interface MediaItem {
  id: string;
  name: string;
  folder: string;
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  size: string;
  dimensions?: string;
  duration?: string;
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
}

export interface AIContentAnalysis {
  overallScore: number;
  hookScore: number;
  storyScore: number;
  visualScore: number;
  ctaScore: number;
  engagementScore: number;
  hookFeedback: string;
  storyFeedback: string;
  visualFeedback: string;
  ctaFeedback: string;
  generalVerdict: string;
  suggestedImprovements: string[];
  alternativeHooks: string[];
  improvedCaption: string;
}

export interface AIReelIdea {
  id: string;
  title: string;
  hook: string;
  concept: string;
  targetAudience: string;
  shotList: Array<{
    shotNumber: number;
    duration: string;
    angle: string;
    movement: string;
    scene: string;
    audio: string;
    textOverlay: string;
  }>;
  caption: string;
  hashtags: string[];
  cta: string;
  soundSuggestion: string;
}

export interface AIVideoPrompt {
  id: string;
  subject: string;
  promptText: string;
  cameraMovement: string;
  lighting: string;
  composition: string;
  mood: string;
  style: string;
  duration: string;
  aspectRatio: string;
  negativePrompt?: string;
}

export interface AnalyticsSummary {
  totalFollowers: number;
  followersGrowth: number;
  totalReach: number;
  reachGrowth: number;
  totalImpressions: number;
  impressionsGrowth: number;
  avgEngagementRate: number;
  engagementGrowth: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalSaves: number;
  videoViews: number;
  profileVisits: number;
  postsPublished: number;
  scheduledPosts: number;
  aiInsights: string[];
  growthHistory: Array<{
    month: string;
    reach: number;
    impressions: number;
    engagement: number;
    followers: number;
  }>;
  dailyGrowth: Array<{
    date: string;
    followers: number;
    reach: number;
    engagement: number;
    impressions: number;
  }>;
  platformShare: Array<{
    name: string;
    followers: number;
    reach: number;
    engagement: number;
    color: string;
  }>;
}

export type ActiveView = 
  | 'landing'
  | 'dashboard'
  | 'accounts'
  | 'analytics'
  | 'calendar'
  | 'events'
  | 'studio'
  | 'ai_assistant'
  | 'ai_analyzer'
  | 'ai_prompts'
  | 'media'
  | 'campaigns'
  | 'approvals'
  | 'tasks'
  | 'chat'
  | 'team'
  | 'notifications'
  | 'settings'
  | 'pricing'
  // Client Management & Client Portal Views
  | 'clients'
  | 'brand_assets'
  | 'client_messages'
  | 'monthly_reports'
  | 'client_dashboard'
  | 'client_approvals'
  | 'client_content'
  | 'client_calendar'
  | 'client_campaigns'
  | 'client_analytics'
  | 'client_reports'
  | 'client_media'
  | 'client_brand'
  | 'client_brand_assets'
  | 'client_profile';

export type ViewType = ActiveView;

// ==========================================
// CLIENT MANAGEMENT & PORTAL TYPES
// ==========================================

export type ClientStatus = 'active' | 'needs_attention' | 'inactive' | 'onboarding';

export interface OnboardingStep {
  id: string;
  label: string;
  completed: boolean;
  actionView?: ActiveView;
}

export type BrandAssetCategory = 'logo' | 'secondary_logo' | 'color_palette' | 'font' | 'guideline' | 'photo' | 'video' | 'template' | 'document';

export interface Client {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  industry: string;
  website?: string;
  logo?: string;
  description: string;
  assignedManagerId: string;
  assignedManagerName: string;
  assignedManagerAvatar?: string;
  assignedTeamMemberIds: string[];
  clientTimezone: string;
  country: string;
  brandColor: string;
  socialPlatforms: SocialPlatform[];
  workspaceId: string;
  status: ClientStatus;
  lastActivity: string;
  createdAt: string;
  socialAccountsCount: number;
  activeCampaignsCount: number;
  pendingApprovalsCount: number;
  scheduledPostsCount: number;
  onboardingChecklist: OnboardingStep[];
}

export interface BrandAsset {
  id: string;
  workspaceId: string;
  clientId?: string;
  title: string;
  category: 'logo' | 'secondary_logo' | 'color_palette' | 'font' | 'guideline' | 'photo' | 'video' | 'template' | 'document';
  fileUrl: string;
  fileType: string;
  fileSize: string;
  dimensions?: string;
  colors?: string[]; // Hex codes for color palettes
  fontFamily?: string;
  description?: string;
  approvedBy?: string;
  approvedAt?: string;
  uploadedBy: string;
  uploadedAt: string;
  isApproved: boolean;
}

export interface ClientMessage {
  id: string;
  workspaceId: string;
  clientId?: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: RoleType;
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'file';
  fileName?: string;
  postId?: string;
  postTitle?: string;
  timestamp: string;
  isClient: boolean;
}

export interface MonthlyReport {
  id: string;
  workspaceId: string;
  clientId?: string;
  month: string; // e.g., "August 2026"
  title: string;
  date: string;
  followers: number;
  followersGrowth: number;
  reach: number;
  reachGrowth: number;
  engagement: number;
  engagementGrowth: number;
  postsCount: number;
  topContent: {
    title: string;
    views: string;
    platform: SocialPlatform;
    mediaUrl?: string;
    engagementRate: string;
    likes?: number;
    shares?: number;
  };
  aiExecutiveSummary: string;
  topReasons: string[];
  recommendedNextSteps: string[];
  platformBreakdown: Array<{
    platform: SocialPlatform;
    followers: number;
    reach: number;
    growth: number;
  }>;
  status: 'ready' | 'draft' | 'published';
  downloadUrl?: string;
}

// ==========================================
// SUBSCRIPTION & BILLING TYPES
// ==========================================

export type SubscriptionPlanId = 'free' | 'creator' | 'team' | 'pro' | 'enterprise';

export type SubscriptionStatus = 'free' | 'trial' | 'active' | 'past_due' | 'cancelled' | 'expired';

export type BillingCycle = 'monthly' | 'yearly';

export type PaymentMethodType = 'upi' | 'card' | 'netbanking';

export interface PlanLimits {
  socialAccounts: number;
  teamMembers: number;
  scheduledPosts: number | 'unlimited';
  aiGenerations: number;
  workspaces: number;
}

export type FeatureKey =
  | 'basic_analytics'
  | 'advanced_analytics'
  | 'basic_calendar'
  | 'advanced_calendar'
  | 'events_calendar'
  | 'basic_media'
  | 'media_library'
  | 'shared_media'
  | 'limited_ai'
  | 'socially_ai'
  | 'ai_captions'
  | 'ai_hashtags'
  | 'ai_content_ideas'
  | 'ai_reel_scripts'
  | 'ai_content_radar'
  | 'video_prompt_lab'
  | 'content_analyzer'
  | 'unlimited_scheduling'
  | 'campaigns'
  | 'tasks_workflow'
  | 'team_chat'
  | 'approvals'
  | 'team_roles'
  | 'smart_notifications'
  | 'multiple_workspaces'
  | 'competitor_insights'
  | 'white_label_reports'
  | 'priority_support'
  | 'custom_workflows'
  | 'api_access'
  | 'dedicated_csm';

export interface SubscriptionPlanConfig {
  id: SubscriptionPlanId;
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  yearlyPriceMonthlyEquivalent: number;
  savingPercentage: number;
  ctaText: string;
  isPopular: boolean;
  badgeText?: string;
  limits: PlanLimits;
  features: string[];
  unlockedFeatures: FeatureKey[];
}

export interface FeatureComparisonRow {
  name: string;
  free: string | boolean;
  creator: string | boolean;
  team: string | boolean;
  pro: string | boolean;
  enterprise: string | boolean;
}

export interface FeatureComparisonCategory {
  categoryName: string;
  features: FeatureComparisonRow[];
}

export interface SubscriptionUsageStats {
  aiGenerationsUsed: number;
  socialAccountsCount: number;
  teamMembersCount: number;
  scheduledPostsCount: number;
}

export interface PaymentDetails {
  methodType: PaymentMethodType;
  upiId?: string;
  cardLast4?: string;
  cardBrand?: string;
  expiryMonth?: string;
  expiryYear?: string;
  bankName?: string;
}

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate?: string;
  planName: string;
  billingCycle: BillingCycle;
  amount: number;
  currency?: string;
  currencySymbol?: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  downloadUrl?: string;
  paymentMethod: string;
  taxAmount: number;
  subtotal: number;
}

export interface BillingContactInfo {
  fullName: string;
  email: string;
  companyOrCollegeName: string;
  gstNumber?: string;
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface UserSubscriptionState {
  planId: SubscriptionPlanId;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEndsAt?: string;
  trialDaysLeft?: number;
  cancelAtPeriodEnd: boolean;
  paymentDetails: PaymentDetails;
  billingContact: BillingContactInfo;
  usage: SubscriptionUsageStats;
}

