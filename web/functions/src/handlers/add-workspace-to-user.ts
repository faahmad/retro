import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { publishMessage, testPublishMessage } from "../services/alert-workspace-service";
import { FirestoreCollections } from "../constants/firestore-collections";
import { isProd } from "../constants/is-prod";
import { WorkspaceUser } from "../types/workspace-user";
import { Workspace } from "../types/workspace";

/**
 * When a WorkspaceUser is created, add the workspace to their user document.
 */
export const addWorkspaceToUser = functions.firestore
  .document(`${FirestoreCollections.WORKSPACE_USER}/{workspaceid_retroId}`)
  .onCreate(async (snapshot) => {
    const workspaceUser = snapshot.data() as WorkspaceUser;
    await admin.firestore().runTransaction(async (transaction) => {
      const workspaceRef = admin
        .firestore()
        .collection(FirestoreCollections.WORKSPACE)
        .doc(workspaceUser.workspaceId);
      const workspaceData = (await workspaceRef.get()).data() as Workspace;

      // Update the user document.
      const userRef = admin
        .firestore()
        .collection(FirestoreCollections.USER)
        .doc(workspaceUser.userId);
      await transaction.update(userRef, {
        workspaces: admin.firestore.FieldValue.arrayUnion({
          id: workspaceRef.id,
          url: workspaceData.url,
          name: workspaceData.url
        })
      });
    });

    // Post a message in discord.
    const workspaceRef = admin
      .firestore()
      .collection(FirestoreCollections.WORKSPACE)
      .doc(workspaceUser.workspaceId);
    const workspaceData = (await workspaceRef.get()).data() as Workspace;
    const message = `User ${workspaceUser.userId} was added to workspace ${workspaceData.name}. This workspace now has ${workspaceData.userCount} users.`;
    return isProd ? publishMessage(message) : testPublishMessage(message);
  });
