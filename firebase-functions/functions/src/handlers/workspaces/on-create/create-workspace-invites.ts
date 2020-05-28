import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Workspace } from "../../../types/workspace";

const db = admin.firestore();

/**
 * When a Workspace is created this function
 * initializes workspaceInvites.
 */
export const createWorkspaceInvites = functions.firestore
  .document("workspace/{workspaceId}")
  .onCreate(async (snapshot) => {
    const workspace = snapshot.data() as Workspace;
    return db
      .collection("workspaceInvites")
      .doc(workspace.id)
      .set({ workspaceId: workspace.id });
  });
