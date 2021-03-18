import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { WorkspaceUser, WorkspaceUsersMap } from "../types/workspace-user";

const db = firebase.firestore();
const workspaceUserCollection = db.collection(FirestoreCollections.WORKSPACE_USER);

export function workspaceUsersListener(
  workspaceId: string,
  onSuccess: (workspaceUsersMap: WorkspaceUsersMap) => void
) {
  return workspaceUserCollection
    .where("workspaceId", "==", workspaceId)
    .limit(10)
    .onSnapshot((workspaceUsersQuerySnapshot) => {
      let workspaceUsersMap: WorkspaceUsersMap = {};
      workspaceUsersQuerySnapshot.forEach((workspaceUserSnapshot) => {
        const user = workspaceUserSnapshot.data() as WorkspaceUser;
        workspaceUsersMap[user.userId] = user;
      });
      return onSuccess(workspaceUsersMap);
    });
}
