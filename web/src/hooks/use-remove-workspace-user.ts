import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { User } from "../types/user";
import { Workspace } from "../types/workspace";
import { decrement } from "../utils/firestore-utils";

function removeWorkspaceUserTransaction(
  workspaceId: Workspace["id"],
  userId: User["id"]
) {
  return firebase.firestore().runTransaction(async (transaction) => {
    const userRef = firebase
      .firestore()
      .collection(FirestoreCollections.USER)
      .doc(userId);
    const userDoc = await userRef.get();
    const user = userDoc.data() as User;
    await transaction.update(userRef, {
      workspaces: user.workspaces.filter((workspace) => workspace.id !== workspaceId)
    });

    const workspaceInviteRef = firebase
      .firestore()
      .collection(FirestoreCollections.WORKSPACE_INVITE)
      .doc(`${workspaceId}_${user.email}`);
    await transaction.delete(workspaceInviteRef);

    const workspaceUserRef = firebase
      .firestore()
      .collection(FirestoreCollections.WORKSPACE_USER)
      .doc(`${workspaceId}_${userId}`);
    await transaction.delete(workspaceUserRef);

    const workspaceRef = firebase
      .firestore()
      .collection(FirestoreCollections.WORKSPACE)
      .doc(workspaceId);

    await transaction.update(workspaceRef, {
      userCount: decrement()
    });
  });
}

export function useRemoveWorkspaceUser(workspaceId: Workspace["id"]) {
  function handleRemove(userId: User["id"]) {
    return removeWorkspaceUserTransaction(workspaceId, userId);
  }

  return handleRemove;
}
