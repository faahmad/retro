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
    // Transactions require us to do all the reads first.
    // Get the user document.
    const userRef = firebase
      .firestore()
      .collection(FirestoreCollections.USER)
      .doc(userId);
    const userDoc = await userRef.get();
    const user = userDoc.data() as User;
    // Get the workspace invite document.
    const workspaceInviteRef = firebase
      .firestore()
      .collection(FirestoreCollections.WORKSPACE_INVITE)
      .doc(`${workspaceId}_${user.email}`);
    const workspaceInviteDoc = await workspaceInviteRef.get();

    // Update the user's document.
    await transaction.update(userRef, {
      workspaces: user.workspaces.filter((workspace) => workspace.id !== workspaceId)
    });

    // Delete the workspace invite document.
    // We have to check if the invite exists because there is a case where we delete the person
    // who created the workspace initially. In that scenario, they wouldn't have a workspace invite document.
    if (workspaceInviteDoc.exists) {
      await transaction.delete(workspaceInviteRef);
    }

    // Delete the workspace user document.
    const workspaceUserRef = firebase
      .firestore()
      .collection(FirestoreCollections.WORKSPACE_USER)
      .doc(`${workspaceId}_${userId}`);
    await transaction.delete(workspaceUserRef);

    // Update the workspace's userCount field.
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
