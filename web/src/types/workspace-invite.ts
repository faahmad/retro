export interface WorkspaceInvite {
  email: string;
  workspaceId: string;
  workspaceName: string;
  invitedByUserId: string;
  invitedByUserDisplayName: string;
  status: WorkspaceInviteStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum WorkspaceInviteStatus {
  SENT = "sent",
  ACCEPTED = "accepted"
}
