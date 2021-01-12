import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { WorkspaceInvite, WorkspaceInviteStatus } from "../types/workspace-invite";

const db = firebase.firestore();
const workspaceInviteCollection = db.collection(FirestoreCollections.WORKSPACE_INVITE);

export function workspaceInvitesListener(
  workspaceId: string,
  onSuccess: (workspaceInvite: WorkspaceInvite) => void
) {
  return workspaceInviteCollection
    .where("workspaceId", "==", workspaceId)
    .where("status", "==", WorkspaceInviteStatus.SENT)
    .limit(8)
    .onSnapshot((workspaceInviteQuerySnapshot) =>
      workspaceInviteQuerySnapshot.forEach((workspaceInviteSnapshot) =>
        onSuccess({
          id: workspaceInviteSnapshot.id,
          ...workspaceInviteSnapshot.data()
        } as WorkspaceInvite)
      )
    );
}
