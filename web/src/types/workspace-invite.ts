import { FirestoreTimestamp } from "./firestore-timestamp";
export interface WorkspaceInvite {
  id: string;
  email: string;
  workspaceId: string;
  workspaceName: string;
  invitedByUserId: string;
  invitedByUserDisplayName: string;
  status: WorkspaceInviteStatus;
  createdAt: any;
  updatedAt: FirestoreTimestamp;
}

export enum WorkspaceInviteStatus {
  SENDING = "sending",
  SENT = "sent",
  FAILED = "failed",
  ACCEPTED = "accepted"
}
