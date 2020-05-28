export interface WorkspaceInvitesCollection {
  [key: string]: WorkspaceInvite;
}

export interface WorkspaceInvite {
  id: string;
  email: string;
  workspaceId: string;
  workspaceName: string;
  invitedById: string;
  invitedByName: string;
  invitedAt: Date;
}
