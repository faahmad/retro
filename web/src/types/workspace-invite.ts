import { FirestoreTimestamp } from "./firestore-timestamp";
export interface WorkspaceInvite {
  id: string;
  email: string;
  workspaceId: string;
  workspaceName: string;
  invitedByUserId: string;
  invitedByUserDisplayName: string;
  status: WorkspaceInviteStatus;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

export enum WorkspaceInviteStatus {
  SENT = "sent", // this assumes that sendInvitationEmail doesn't fail.
  ACCEPTED = "accepted"
}
