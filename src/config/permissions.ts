import { RoleType, PermissionKey } from '../types';

export interface PermissionDefinition {
  key: PermissionKey;
  label: string;
  category: 'content' | 'media' | 'analytics' | 'social_accounts' | 'campaigns' | 'tasks' | 'approvals' | 'team' | 'billing' | 'workspace' | 'reports' | 'ai';
  description: string;
}

export const ALL_PERMISSIONS: PermissionDefinition[] = [
  // Content
  { key: 'content.view', label: 'View Content', category: 'content', description: 'View drafts, calendar posts, and scheduled media' },
  { key: 'content.create', label: 'Create Content', category: 'content', description: 'Draft new posts, reels, and stories' },
  { key: 'content.edit', label: 'Edit Content', category: 'content', description: 'Edit existing content copy, media, and captions' },
  { key: 'content.delete', label: 'Delete Content', category: 'content', description: 'Remove posts and drafts from workspace' },
  { key: 'content.schedule', label: 'Schedule Content', category: 'content', description: 'Set live publishing schedule and calendar slots' },
  { key: 'content.publish', label: 'Publish Directly', category: 'content', description: 'Directly dispatch content to live social handles without review' },

  // Media
  { key: 'media.view', label: 'View Media Assets', category: 'media', description: 'Access workspace media repository and asset folders' },
  { key: 'media.upload', label: 'Upload Media', category: 'media', description: 'Upload raw photos, videos, and graphics to media library' },
  { key: 'media.delete', label: 'Delete Media', category: 'media', description: 'Remove files and assets from team media storage' },

  // Analytics
  { key: 'analytics.view', label: 'View Analytics', category: 'analytics', description: 'Inspect reach, engagement rate, follower trends, and AI score' },
  { key: 'analytics.export', label: 'Export Analytics', category: 'analytics', description: 'Download CSV and executive summaries of metrics' },

  // Social Accounts
  { key: 'social_accounts.view', label: 'View Social Accounts', category: 'social_accounts', description: 'View connected profiles, follower metrics, and handles' },
  { key: 'social_accounts.connect', label: 'Connect Social Accounts', category: 'social_accounts', description: 'Link new Instagram, LinkedIn, Facebook, and X handles' },
  { key: 'social_accounts.disconnect', label: 'Disconnect Social Accounts', category: 'social_accounts', description: 'Unlink and remove social accounts from workspace' },
  { key: 'social_accounts.manage', label: 'Manage Accounts', category: 'social_accounts', description: 'Sync tokens and manage channel credentials' },

  // Campaigns
  { key: 'campaigns.view', label: 'View Campaigns', category: 'campaigns', description: 'View active, planned, and completed marketing drives' },
  { key: 'campaigns.create', label: 'Create Campaigns', category: 'campaigns', description: 'Establish new campaigns, target reach, and milestones' },
  { key: 'campaigns.edit', label: 'Edit Campaigns', category: 'campaigns', description: 'Modify campaign details, budget, dates, and assignees' },
  { key: 'campaigns.delete', label: 'Delete Campaigns', category: 'campaigns', description: 'Permanently remove campaigns' },

  // Tasks
  { key: 'tasks.view', label: 'View Tasks', category: 'tasks', description: 'Access team workflow board and assigned action items' },
  { key: 'tasks.create', label: 'Create Tasks', category: 'tasks', description: 'Create task tickets and assignments' },
  { key: 'tasks.assign', label: 'Assign Tasks', category: 'tasks', description: 'Delegate task tickets to creators and team members' },
  { key: 'tasks.complete', label: 'Complete Tasks', category: 'tasks', description: 'Mark assigned tasks as finished' },

  // Approvals
  { key: 'approvals.view', label: 'View Approvals', category: 'approvals', description: 'Inspect pending submissions in the quality pipeline' },
  { key: 'approvals.submit', label: 'Submit for Approval', category: 'approvals', description: 'Send created drafts to managers/clients for review' },
  { key: 'approvals.review', label: 'Review Submissions', category: 'approvals', description: 'Inspect submitted copy and visual assets' },
  { key: 'approvals.approve', label: 'Approve Content', category: 'approvals', description: 'Sign off and greenlight posts for scheduling' },
  { key: 'approvals.request_changes', label: 'Request Changes', category: 'approvals', description: 'Send feedback notes requesting revisions' },

  // Team
  { key: 'team.view', label: 'View Team Members', category: 'team', description: 'See member rosters, roles, and assigned tasks' },
  { key: 'team.invite', label: 'Invite Members', category: 'team', description: 'Invite new collaborators to the workspace' },
  { key: 'team.edit', label: 'Edit Member Details', category: 'team', description: 'Update assignments and profile details' },
  { key: 'team.remove', label: 'Remove Members', category: 'team', description: 'Revoke workspace membership' },
  { key: 'team.change_role', label: 'Change Member Roles', category: 'team', description: 'Promote or demote member access levels' },

  // Clients Management
  { key: 'clients.view', label: 'View Clients', category: 'team', description: 'Access agency client roster and status dashboard' },
  { key: 'clients.manage', label: 'Manage Clients', category: 'team', description: 'Create clients, edit settings, and assign workspace managers' },
  { key: 'clients.invite', label: 'Invite Client Users', category: 'team', description: 'Send collaboration invites to client representatives' },

  // Brand Assets
  { key: 'brand_assets.view', label: 'View Brand Assets', category: 'media', description: 'Access client logos, color palettes, fonts, and guidelines' },
  { key: 'brand_assets.upload', label: 'Upload Brand Assets', category: 'media', description: 'Add new brand assets and style guidelines' },
  { key: 'brand_assets.manage', label: 'Manage Brand Assets', category: 'media', description: 'Approve and organize brand kits and templates' },

  // Messages
  { key: 'messages.use', label: 'Use Messaging', category: 'content', description: 'Send and receive client/team communications' },
  { key: 'messages.client', label: 'Client Direct Channel', category: 'content', description: 'Participate in client portal communication threads' },

  // Content extra
  { key: 'content.comment', label: 'Comment on Content', category: 'content', description: 'Add feedback and revision notes on posts' },

  // Billing
  { key: 'billing.view', label: 'View Billing & Invoices', category: 'billing', description: 'Access plan quotas, subscription history, and invoices' },
  { key: 'billing.manage', label: 'Manage Subscription', category: 'billing', description: 'Upgrade plans, change payment methods, and cancel tier' },

  // Workspace
  { key: 'workspace.view', label: 'View Workspace', category: 'workspace', description: 'Access workspace dashboard and basic details' },
  { key: 'workspace.settings', label: 'Manage Workspace Settings', category: 'workspace', description: 'Change name, category, time & region, and policies' },
  { key: 'workspace.delete', label: 'Delete Workspace', category: 'workspace', description: 'Permanently destroy workspace and all data (Owner only)' },

  // Reports
  { key: 'reports.view', label: 'View Reports', category: 'reports', description: 'Access client and executive performance reports' },
  { key: 'reports.export', label: 'Export Reports', category: 'reports', description: 'Download PDF / CSV report summaries' },
  { key: 'reports.download', label: 'Download Reports', category: 'reports', description: 'Download client-ready executive PDF summaries' },

  // AI
  { key: 'ai.use', label: 'Use AI Capabilities', category: 'ai', description: 'Generate captions, reel ideas, prompts, and score audits' },
  { key: 'ai.manage', label: 'Manage AI Policies', category: 'ai', description: 'Configure AI prompt guidelines and tone constraints' },
];

/**
 * Default role-to-permission matrix
 */
export const ROLE_DEFAULT_PERMISSIONS: Record<RoleType, PermissionKey[]> = {
  owner: [
    'content.view',
    'content.create',
    'content.edit',
    'content.delete',
    'content.schedule',
    'content.publish',
    'content.comment',
    'media.view',
    'media.upload',
    'media.delete',
    'analytics.view',
    'analytics.export',
    'social_accounts.view',
    'social_accounts.connect',
    'social_accounts.disconnect',
    'social_accounts.manage',
    'campaigns.view',
    'campaigns.create',
    'campaigns.edit',
    'campaigns.delete',
    'tasks.view',
    'tasks.create',
    'tasks.assign',
    'tasks.complete',
    'approvals.view',
    'approvals.submit',
    'approvals.review',
    'approvals.approve',
    'approvals.request_changes',
    'team.view',
    'team.invite',
    'team.edit',
    'team.remove',
    'team.change_role',
    'clients.view',
    'clients.manage',
    'clients.invite',
    'brand_assets.view',
    'brand_assets.upload',
    'brand_assets.manage',
    'messages.use',
    'messages.client',
    'billing.view',
    'billing.manage',
    'workspace.view',
    'workspace.settings',
    'workspace.delete',
    'reports.view',
    'reports.export',
    'reports.download',
    'ai.use',
    'ai.manage',
  ],

  manager: [
    'content.view',
    'content.create',
    'content.edit',
    'content.delete',
    'content.schedule',
    'content.publish',
    'content.comment',
    'media.view',
    'media.upload',
    'media.delete',
    'analytics.view',
    'analytics.export',
    'social_accounts.view',
    'social_accounts.manage',
    'campaigns.view',
    'campaigns.create',
    'campaigns.edit',
    'campaigns.delete',
    'tasks.view',
    'tasks.create',
    'tasks.assign',
    'tasks.complete',
    'approvals.view',
    'approvals.submit',
    'approvals.review',
    'approvals.approve',
    'approvals.request_changes',
    'team.view',
    'team.invite',
    'team.edit',
    'clients.view',
    'clients.manage',
    'clients.invite',
    'brand_assets.view',
    'brand_assets.upload',
    'brand_assets.manage',
    'messages.use',
    'messages.client',
    'workspace.view',
    'reports.view',
    'reports.export',
    'reports.download',
    'ai.use',
  ],

  student: [
    'content.view',
    'content.create',
    'content.edit',
    'media.view',
    'media.upload',
    'analytics.view',
    'social_accounts.view',
    'campaigns.view',
    'tasks.view',
    'tasks.complete',
    'approvals.view',
    'approvals.submit',
    'reports.view',
    'ai.use',
  ],

  editor: [
    'content.view',
    'content.create',
    'content.edit',
    'content.schedule',
    'media.view',
    'media.upload',
    'analytics.view',
    'social_accounts.view',
    'campaigns.view',
    'tasks.view',
    'tasks.complete',
    'approvals.view',
    'approvals.submit',
    'reports.view',
    'ai.use',
  ],

  viewer: [
    'content.view',
    'media.view',
    'analytics.view',
    'social_accounts.view',
    'campaigns.view',
    'tasks.view',
    'approvals.view',
    'reports.view',
  ],

  custom: [
    'content.view',
    'content.create',
    'media.view',
    'analytics.view',
  ],

  client: [
    'content.view',
    'content.comment',
    'media.view',
    'media.upload',
    'brand_assets.view',
    'brand_assets.upload',
    'analytics.view',
    'social_accounts.view',
    'campaigns.view',
    'approvals.view',
    'approvals.review',
    'approvals.approve',
    'approvals.request_changes',
    'reports.view',
    'reports.export',
    'reports.download',
    'messages.use',
    'messages.client',
  ],
};

export interface RoleConfig {
  role: RoleType;
  name: string;
  badgeLabel: string;
  tagline: string;
  badgeBgLight: string;
  badgeTextLight: string;
  badgeBgDark: string;
  badgeTextDark: string;
  badgeBorder: string;
  badgeColor: string;
  avatarRing: string;
  description: string;
}

export const ROLE_CONFIGS: Record<RoleType, RoleConfig> = {
  owner: {
    role: 'owner',
    name: 'Owner',
    badgeLabel: 'OWNER',
    tagline: 'Highest permission level • Full workspace control',
    badgeBgLight: 'bg-purple-100',
    badgeTextLight: 'text-purple-800',
    badgeBgDark: 'dark:bg-purple-950/80',
    badgeTextDark: 'dark:text-purple-300',
    badgeBorder: 'border-purple-300 dark:border-purple-800',
    badgeColor: 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800',
    avatarRing: 'ring-purple-500',
    description: 'Manages workspace, billing, integrations, team memberships, and has exclusive right to delete workspace.',
  },
  manager: {
    role: 'manager',
    name: 'Manager',
    badgeLabel: 'MANAGER',
    tagline: 'Team leader & social media manager',
    badgeBgLight: 'bg-indigo-100',
    badgeTextLight: 'text-indigo-800',
    badgeBgDark: 'dark:bg-indigo-950/80',
    badgeTextDark: 'dark:text-indigo-300',
    badgeBorder: 'border-indigo-300 dark:border-indigo-800',
    badgeColor: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
    avatarRing: 'ring-indigo-500',
    description: 'Manages assigned accounts, schedules & publishes content, assigns tasks, and runs team review approvals.',
  },
  editor: {
    role: 'editor',
    name: 'Editor',
    badgeLabel: 'EDITOR',
    tagline: 'Content creator & copywriter',
    badgeBgLight: 'bg-blue-100',
    badgeTextLight: 'text-blue-800',
    badgeBgDark: 'dark:bg-blue-950/80',
    badgeTextDark: 'dark:text-blue-300',
    badgeBorder: 'border-blue-300 dark:border-blue-800',
    badgeColor: 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800',
    avatarRing: 'ring-blue-500',
    description: 'Creates posts, schedules drafts, uploads assets, and submits content for managerial review.',
  },
  student: {
    role: 'student',
    name: 'Student / Creator',
    badgeLabel: 'STUDENT',
    tagline: 'Creator, designer & video editor',
    badgeBgLight: 'bg-emerald-100',
    badgeTextLight: 'text-emerald-800',
    badgeBgDark: 'dark:bg-emerald-950/80',
    badgeTextDark: 'dark:text-emerald-300',
    badgeBorder: 'border-emerald-300 dark:border-emerald-800',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    avatarRing: 'ring-emerald-500',
    description: 'Creates drafts, uploads media, completes assigned tasks, and submits content for review. Cannot publish directly by default.',
  },
  viewer: {
    role: 'viewer',
    name: 'Viewer',
    badgeLabel: 'VIEWER',
    tagline: 'Read-only observer',
    badgeBgLight: 'bg-slate-100',
    badgeTextLight: 'text-slate-800',
    badgeBgDark: 'dark:bg-slate-800',
    badgeTextDark: 'dark:text-slate-300',
    badgeBorder: 'border-slate-300 dark:border-slate-700',
    badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    avatarRing: 'ring-slate-400',
    description: 'Read-only access to calendar, analytics, posts, and campaigns without editing or scheduling permissions.',
  },
  client: {
    role: 'client',
    name: 'Client',
    badgeLabel: 'CLIENT',
    tagline: 'External client / brand stakeholder',
    badgeBgLight: 'bg-amber-100',
    badgeTextLight: 'text-amber-800',
    badgeBgDark: 'dark:bg-amber-950/80',
    badgeTextDark: 'dark:text-amber-300',
    badgeBorder: 'border-amber-300 dark:border-amber-800',
    badgeColor: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    avatarRing: 'ring-amber-500',
    description: 'Reviews scheduled content, requests changes, signs off approvals, and views executive metrics in a simplified client portal.',
  },
  custom: {
    role: 'custom',
    name: 'Custom Role',
    badgeLabel: 'CUSTOM',
    tagline: 'Tailored granular permissions',
    badgeBgLight: 'bg-teal-100',
    badgeTextLight: 'text-teal-800',
    badgeBgDark: 'dark:bg-teal-950/80',
    badgeTextDark: 'dark:text-teal-300',
    badgeBorder: 'border-teal-300 dark:border-teal-800',
    badgeColor: 'bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-800',
    avatarRing: 'ring-teal-500',
    description: 'Custom fine-grained capabilities tailored per user membership.',
  },
};

/**
 * Check if a given role or customized permission list satisfies the required permission key
 */
export function checkPermission(
  requiredPermission: PermissionKey,
  role: RoleType,
  customPermissions?: PermissionKey[]
): boolean {
  if (role === 'owner') return true;
  if (customPermissions && customPermissions.length > 0) {
    return customPermissions.includes(requiredPermission);
  }
  const defaultList = ROLE_DEFAULT_PERMISSIONS[role] || [];
  return defaultList.includes(requiredPermission);
}
