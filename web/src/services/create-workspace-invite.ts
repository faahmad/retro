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
  const workspaceInviteRef = workspaceInviteCollection.doc(
    `${params.workspaceId}_${params.email}`
  );
  return workspaceInviteRef.set({
    ...params,
    status: WorkspaceInviteStatus.SENDING,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  } as WorkspaceInvite);
}
