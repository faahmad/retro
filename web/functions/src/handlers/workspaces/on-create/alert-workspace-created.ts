import * as functions from "firebase-functions";
import { Workspace } from "../../../types/workspace";
import { publishMessage } from "../../../services/slack-service";
import { FirestoreCollections } from "../../../constants/firestore-collections";

/**
 * When a Workspace is created, post an alert in Slack.
 */
export const alertWorkspaceCreated = functions.firestore
  .document(`${FirestoreCollections.WORKSPACE}/{workspaceId}`)
  .onCreate((snapshot) => {
    const workspace = snapshot.data() as Workspace;
    const message = `New workspace! ${workspace.name} was created by ${workspace.ownerEmail}.`;
    return publishMessage(message);
  });
