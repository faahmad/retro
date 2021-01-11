import firebase from "../lib/firebase";
import { WorkspaceInvite, WorkspaceInviteStatus } from "../types/workspace-invite";
import { FirestoreCollections } from "../constants/firestore-collections";

const db = firebase.firestore();
const workspaceInviteCollection = db.collection(FirestoreCollections.WORKSPACE_INVITE);

interface CreateWorkspaceInviteParams {
  email: string;
  workspaceId: string;
  workspaceName: string;
  invitedByUserDisplayName: string;
  invitedByUserId: string;
}

export function createWorkspaceInvite(params: CreateWorkspaceInviteParams) {
  return workspaceInviteCollection.add({
    ...params,
    status: WorkspaceInviteStatus.SENT,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  } as WorkspaceInvite);
}
