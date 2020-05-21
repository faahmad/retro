import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Workspace } from "../../../types/workspace";
import { logger } from "../../../lib/logger";

const db = admin.firestore();

/**
 * When a Workspace is created, we want to set
 * the workspaceUrl so that we can check for uniqueness.
 */
export const createWorkspaceUrl = functions.firestore
  .document("workspaces/{workspaceId}")
  .onCreate((snapshot) => {
    const workspace = snapshot.data() as Workspace;
    if (!workspace.url) {
      logger.log("Workspace has not set url.");
      return;
    }
    return db
      .collection("workspaceUrls")
      .doc(workspace.url)
      .set({ id: workspace.id, url: workspace.url });
  });
