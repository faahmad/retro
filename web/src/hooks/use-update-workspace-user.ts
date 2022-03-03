import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { WorkspaceUser } from "../types/workspace-user";

export function useUpdateWorkspaceUser(workspaceId: WorkspaceUser["workspaceId"]) {
  function handleUpdate(
    workspaceUserId: WorkspaceUser["userId"],
    fields: Partial<WorkspaceUser>
  ) {
    const workspaceUserRef = firebase
      .firestore()
      .collection(FirestoreCollections.WORKSPACE_USER)
      .doc(`${workspaceId}_${workspaceUserId}`);
    return workspaceUserRef.update(fields);
  }

  return handleUpdate;
}
