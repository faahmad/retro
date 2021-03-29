export interface WorkspaceInvite {
  id: string;
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
  SENDING = "sending",
  SENT = "sent",
  FAILED = "failed",
  ACCEPTED = "accepted"
}
