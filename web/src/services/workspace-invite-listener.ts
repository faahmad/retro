import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { WorkspaceInvite, WorkspaceInviteStatus } from "../types/workspace-invite";

const db = firebase.firestore();
const workspaceInviteCollection = db.collection(FirestoreCollections.WORKSPACE_INVITE);

export function workspaceInvitesListener(
  workspaceId: string,
  onSuccess: (workspaceInvites: WorkspaceInvite[]) => void
) {
  return workspaceInviteCollection
    .where("workspaceId", "==", workspaceId)
    .where("status", "==", WorkspaceInviteStatus.SENT)
    .limit(8)
    .onSnapshot((workspaceInviteQuerySnapshot) => {
      let workspaceInvites: WorkspaceInvite[] = [];
      workspaceInviteQuerySnapshot.forEach((workspaceInviteSnapshot) =>
        workspaceInvites.push({
          id: workspaceInviteSnapshot.id,
          ...workspaceInviteSnapshot.data()
        } as WorkspaceInvite)
      );
      return onSuccess(workspaceInvites);
    });
}
