import * as functions from "firebase-functions";
import { WorkspaceInvitesCollection } from "../../../types/workspace-invite";
import { sendInvitationMailer } from "../../../services/mailjet-service";
import { logger } from "../../../lib/logger";
import { difference } from "lodash";
import { FirestoreCollections } from "../../../constants/firestore-collections";

/**
 * When a user is invited to a workspace,
 * send the invite email via mailjet.
 */
export const sendInvitationEmail = functions.firestore
  .document(`${FirestoreCollections.WORKSPACE_INVITE}/{workspaceId}`)
  .onUpdate((change) => {
    const originalInvites = change.before.data() as WorkspaceInvitesCollection;
    const nextInvites = change.after.data() as WorkspaceInvitesCollection;
    if (!originalInvites || !nextInvites) {
      logger.error("Invalid data in workspaceInvites.");
      return;
    }
    const originalInviteKeys = Object.keys(originalInvites);
    const nextInviteKeys = Object.keys(nextInvites);
    // We are destructuring because difference returns an array of keys.
    const [newlyAddedInviteKey] = difference(nextInviteKeys, originalInviteKeys);
    const workspaceInvite = nextInvites[newlyAddedInviteKey];
    logger.prettyPrint(workspaceInvite);
    return sendInvitationMailer(
      workspaceInvite.email,
      workspaceInvite.invitedByName
    ).then(
      (value) => logger.prettyPrint(value),
      (reason) => logger.prettyPrint(reason)
    );
  });
