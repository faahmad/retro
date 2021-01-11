import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { WorkspaceUser } from "../types/workspace-user";

const db = firebase.firestore();
const workspaceUserCollection = db.collection(FirestoreCollections.WORKSPACE_USER);

export function workspaceUsersListener(
  workspaceId: string,
  onSuccess: (workspaceUser: WorkspaceUser) => void
) {
  return workspaceUserCollection
    .where("workspaceId", "==", workspaceId)
    .limit(10)
    .onSnapshot((workspaceUsersQuerySnapshot) =>
      workspaceUsersQuerySnapshot.forEach((workspaceUser) =>
        onSuccess(workspaceUser.data() as WorkspaceUser)
      )
    );
}
