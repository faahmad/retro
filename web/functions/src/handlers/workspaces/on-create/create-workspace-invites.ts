import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { FirestoreCollections } from "../../../constants/firestore-collections";

const db = admin.firestore();

/**
 * When a Workspace is created this function
 * initializes workspaceInvites.
 */
export const createWorkspaceInvites = functions.firestore
  .document(`${FirestoreCollections.WORKSPACE}/{workspaceId}`)
  .onCreate(async (workspaceSnapshot) => {
    return db
      .collection(FirestoreCollections.WORKSPACE_INVITE)
      .doc(workspaceSnapshot.id)
      .set({ workspaceId: workspaceSnapshot.id });
  });
