import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { WorkspaceUser } from "../types/workspace-user";

const db = firebase.firestore();
const workspaceUserCollection = db.collection(FirestoreCollections.WORKSPACE_USER);

export function workspaceUsersListener(
  workspaceId: string,
  onSuccess: (workspaceUsers: WorkspaceUser[]) => void
) {
  return workspaceUserCollection
    .where("workspaceId", "==", workspaceId)
    .limit(8)
    .onSnapshot((workspaceUsersQuerySnapshot) => {
      let workspaceUsers: WorkspaceUser[] = [];
      workspaceUsersQuerySnapshot.forEach((workspaceUser) =>
        workspaceUsers.push(workspaceUser.data() as WorkspaceUser)
      );
      return onSuccess(workspaceUsers);
    });
}
