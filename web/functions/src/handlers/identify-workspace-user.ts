import * as functions from "firebase-functions";
import { WorkspaceUser } from "../types/workspace-user";
import { logger } from "../lib/logger";
import { FirestoreCollections } from "../constants/firestore-collections";
const Analytics = require("analytics-node");

const analytics = new Analytics(functions.config().segment.write_key);

export const identifyWorkspaceUser = functions.firestore
  .document(`${FirestoreCollections.WORKSPACE_USER}/{workspaceUserId}`)
  .onCreate(async (workspaceUserSnapshot) => {
    const workspaceUser = workspaceUserSnapshot.data() as WorkspaceUser;
    logger.prettyPrint({ workspaceUser });
    if (!workspaceUser) {
      logger.log("WorkspaceUser is undefined.");
      return;
    }
    try {
      analytics.identify({
        userId: workspaceUser.userId,
        traits: {
          displayName: workspaceUser.userDisplayName,
          email: workspaceUser.userEmail,
          userRole: workspaceUser.userRole,
          workspaceId: workspaceUser.workspaceId
        }
      });
      return;
    } catch (error) {
      logger.log("Error identifying workspace user", error.message);
    }
    return;
  });
