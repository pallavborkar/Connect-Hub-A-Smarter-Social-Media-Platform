import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PermissionKey, RoleType, ViewType, Post, Task, Campaign } from '../types';
import { ROLE_CONFIGS, checkPermission } from '../config/permissions';

export interface UsePermissionsReturn {
  currentRole: RoleType;
  isOwner: boolean;
  isCurrentWorkspaceOwner: boolean;
  isManager: boolean;
  isStudent: boolean;
  isClient: boolean;
  roleConfig: typeof ROLE_CONFIGS[RoleType];
  
  hasPermission: (key: PermissionKey) => boolean;
  can: (key: PermissionKey) => boolean;
  canAccessView: (view: ViewType) => boolean;
  
  // Resource-level permission checks
  canEditPost: (post: Post) => boolean;
  canDeletePost: (post: Post) => boolean;
  canApprovePost: (post: Post) => boolean;
  canRejectPost: (post: Post) => boolean;
  canPublishPost: (post: Post) => boolean;
  canSubmitPost: (post: Post) => boolean;
  canSchedulePost: (post: Post) => boolean;
  
  canEditTask: (task: Task) => boolean;
  canCompleteTask: (task: Task) => boolean;
  canDeleteTask: (task: Task) => boolean;
  
  canEditCampaign: (campaign: Campaign) => boolean;
  canDeleteCampaign: (campaign: Campaign) => boolean;
  
  canManageTeam: boolean;
  canInviteMember: boolean;
  canChangeRoles: boolean;
  canManageBilling: boolean;
  canManageIntegrations: boolean;
  canDeleteWorkspace: boolean;
  canTransferOwnership: boolean;
  canManageOwnerSecurity: boolean;
  
  assertPermission: (key: PermissionKey, actionName?: string) => boolean;
}

export const usePermissions = (): UsePermissionsReturn => {
  const { user, workspace, activeMembership, hasPermission: contextHasPermission, showToast } = useApp();

  const currentRole: RoleType = useMemo(() => {
    return (activeMembership?.role || user.activeRole || user.role || 'owner') as RoleType;
  }, [activeMembership, user]);

  const customPermissions = activeMembership?.customPermissions;

  const hasPerm = (key: PermissionKey): boolean => {
    if (contextHasPermission) {
      return contextHasPermission(key);
    }
    return checkPermission(key, currentRole, customPermissions);
  };

  const isOwner = currentRole === 'owner';
  const isCurrentWorkspaceOwner = isOwner && (workspace.ownerId === user.id || activeMembership?.isOwner === true);
  const isManager = currentRole === 'manager';
  const isStudent = currentRole === 'student';
  const isClient = currentRole === 'client';

  const roleConfig = ROLE_CONFIGS[currentRole] || ROLE_CONFIGS.owner;

  const canAccessView = (view: ViewType): boolean => {
    switch (view) {
      case 'dashboard':
        return true;
      case 'calendar':
        return hasPerm('content.view');
      case 'studio':
        return hasPerm('content.create') || hasPerm('content.edit');
      case 'approvals':
        return hasPerm('approvals.view');
      case 'analytics':
        return hasPerm('analytics.view');
      case 'campaigns':
        return hasPerm('campaigns.view');
      case 'tasks':
        return hasPerm('tasks.view');
      case 'events':
        return true;
      case 'team':
        return hasPerm('team.view');
      case 'media':
        return hasPerm('media.view');
      case 'accounts':
        return hasPerm('social_accounts.view');
      case 'chat':
        return true;
      case 'notifications':
        return true;
      case 'ai_analyzer':
      case 'ai_prompts':
      case 'ai_assistant':
        return hasPerm('ai.use');
      case 'settings':
        return true;
      case 'pricing':
        return true;
      case 'clients':
        return isOwner || isManager || hasPerm('clients.view');
      case 'client_dashboard':
        return isClient || isOwner || isManager;
      case 'client_content':
        return hasPerm('approvals.view') || hasPerm('content.view');
      case 'client_calendar':
        return hasPerm('content.view');
      case 'client_campaigns':
        return hasPerm('campaigns.view');
      case 'client_analytics':
        return hasPerm('analytics.view');
      case 'client_reports':
        return hasPerm('reports.view');
      case 'client_media':
        return hasPerm('media.view');
      case 'client_brand':
        return hasPerm('brand_assets.view');
      case 'client_messages':
        return hasPerm('messages.client') || hasPerm('messages.use') || isClient || isOwner || isManager;
      case 'client_profile':
        return true;
      default:
        return true;
    }
  };

  // Resource level
  const canEditPost = (post: Post): boolean => {
    if (isOwner || isManager) return hasPerm('content.edit');
    if (isClient) return false;
    if (isStudent) {
      // Students can edit their own draft or changes_requested posts
      return hasPerm('content.edit') && (post.authorId === user.id || !post.authorId) && (post.status === 'draft' || post.status === 'changes_requested' || post.status === 'pending_review');
    }
    return hasPerm('content.edit');
  };

  const canDeletePost = (post: Post): boolean => {
    if (isOwner || isManager) return hasPerm('content.delete');
    if (isStudent) {
      // Students can delete only their own drafts
      return hasPerm('content.delete') && (post.authorId === user.id || !post.authorId) && post.status === 'draft';
    }
    return false;
  };

  const canApprovePost = (post: Post): boolean => {
    if (isOwner || isManager) return hasPerm('approvals.approve');
    if (isClient) {
      // Clients can approve posts that are pending client review
      return hasPerm('approvals.approve') && post.status === 'pending_review';
    }
    return false;
  };

  const canRejectPost = (post: Post): boolean => {
    if (isOwner || isManager || isClient) return hasPerm('approvals.request_changes');
    return false;
  };

  const canPublishPost = (post: Post): boolean => {
    if (isOwner || isManager) return hasPerm('content.publish');
    return false;
  };

  const canSubmitPost = (post: Post): boolean => {
    if (isClient) return false;
    return hasPerm('approvals.submit') && (post.status === 'draft' || post.status === 'changes_requested');
  };

  const canSchedulePost = (post: Post): boolean => {
    if (isOwner || isManager) return hasPerm('content.schedule');
    return false;
  };

  const canEditTask = (task: Task): boolean => {
    if (isOwner || isManager) return true;
    if (isStudent) return task.assignedTo === user.id;
    return false;
  };

  const canCompleteTask = (task: Task): boolean => {
    if (isOwner || isManager) return hasPerm('tasks.complete');
    if (isStudent) return hasPerm('tasks.complete') && (task.assignedTo === user.id || !task.assignedTo);
    return false;
  };

  const canDeleteTask = (task: Task): boolean => {
    if (isOwner || isManager) return true;
    return false;
  };

  const canEditCampaign = (campaign: Campaign): boolean => {
    if (isOwner || isManager) return hasPerm('campaigns.edit');
    return false;
  };

  const canDeleteCampaign = (campaign: Campaign): boolean => {
    if (isOwner || isManager) return hasPerm('campaigns.delete');
    return false;
  };

  const canManageTeam = hasPerm('team.edit') || hasPerm('team.invite') || isOwner;
  const canInviteMember = hasPerm('team.invite') || isOwner;
  const canChangeRoles = hasPerm('team.change_role') || isOwner;
  const canManageBilling = hasPerm('billing.manage') || isOwner;
  const canManageIntegrations = hasPerm('social_accounts.connect') || isOwner;
  const canDeleteWorkspace = hasPerm('workspace.delete') && isCurrentWorkspaceOwner;
  const canTransferOwnership = isCurrentWorkspaceOwner;
  const canManageOwnerSecurity = isCurrentWorkspaceOwner;

  const assertPermission = (key: PermissionKey, actionName: string = 'this action'): boolean => {
    if (!hasPerm(key)) {
      showToast(
        'Permission Denied',
        `Your active role (${roleConfig.name}) does not have permission to ${actionName}. Contact your workspace owner to request access.`,
        'error'
      );
      return false;
    }
    return true;
  };

  return {
    currentRole,
    isOwner,
    isCurrentWorkspaceOwner,
    isManager,
    isStudent,
    isClient,
    roleConfig,
    hasPermission: hasPerm,
    can: hasPerm,
    canAccessView,
    canEditPost,
    canDeletePost,
    canApprovePost,
    canRejectPost,
    canPublishPost,
    canSubmitPost,
    canSchedulePost,
    canEditTask,
    canCompleteTask,
    canDeleteTask,
    canEditCampaign,
    canDeleteCampaign,
    canManageTeam,
    canInviteMember,
    canChangeRoles,
    canManageBilling,
    canManageIntegrations,
    canDeleteWorkspace,
    canTransferOwnership,
    canManageOwnerSecurity,
    assertPermission,
  };
};
