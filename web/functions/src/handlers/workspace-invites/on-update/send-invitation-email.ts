import * as functions from "firebase-functions";
import { WorkspaceInvite, WorkspaceInviteStatus } from "../../../types/workspace-invite";
import * as admin from "firebase-admin";

import { logger } from "../../../lib/logger";
import { FirestoreCollections } from "../../../constants/firestore-collections";
import { sendInvitationMailer } from "../../../services/sendgrid";

const db = admin.firestore();

/**
 * When a user is invited to a workspace, send an invite email via mailjet.
 */
export const sendInvitationEmail = functions.firestore
  .document(`${FirestoreCollections.WORKSPACE_INVITE}/{workspaceId}`)
  .onCreate(async (workspaceInviteSnapshot) => {
    const workspaceInviteRef = workspaceInviteSnapshot.ref;
    try {
      const workspaceInvite = workspaceInviteSnapshot.data() as
        | WorkspaceInvite
        | undefined;

      if (!workspaceInvite) {
        await workspaceInviteRef.update({ status: WorkspaceInviteStatus.FAILED });
        logger.log("Failed to send invitation email, workspaceInvite is undefined.");
        return;
      }

      // Fetch the workspace's secret-auth url.
      const workspaceURLQuerySnapshot = await db
        .collection(FirestoreCollections.WORKSPACE_URL)
        .where("workspaceId", "==", workspaceInvite.workspaceId)
        .get();
      // This query should only return 1 document.
      const [doc] = workspaceURLQuerySnapshot.docs;
      const workspaceURL = doc.data();
      if (!workspaceURL) {
        throw new Error("Couldn't find workspaceURL.");
      }

      await sendInvitationMailer({
        toEmail: workspaceInvite.email,
        invitedByName: workspaceInvite.invitedByUserDisplayName,
        workspaceURL: workspaceURL.url,
        workspaceName: workspaceInvite.workspaceName
      });

      logger.log("Success!");
      await workspaceInviteRef.update({ status: WorkspaceInviteStatus.SENT });
      return;
    } catch (error) {
      await workspaceInviteRef.update({ status: WorkspaceInviteStatus.FAILED });
      logger.log("Caught in sendInvitationEmail");
      logger.prettyPrint(error);
      return;
    }
  });
