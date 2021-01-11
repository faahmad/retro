import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { WorkspaceInvite, WorkspaceInviteStatus } from "../types/workspace-invite";

const db = firebase.firestore();
const workspaceInviteCollection = db.collection(FirestoreCollections.WORKSPACE_INVITE);

export async function getWorkspaceInvitesByEmail(email: string) {
  let workspaceInvites: WorkspaceInvite[] = [];
  const workspaceInviteQuerySnapshot = await workspaceInviteCollection
    .where("status", "==", WorkspaceInviteStatus.SENT)
    .where("email", "==", email)
    .get();
  workspaceInviteQuerySnapshot.forEach((workspaceInviteDoc) =>
    workspaceInvites.push({
      id: workspaceInviteDoc.id,
      ...workspaceInviteDoc.data()
    } as WorkspaceInvite)
  );
  return workspaceInvites;
}
