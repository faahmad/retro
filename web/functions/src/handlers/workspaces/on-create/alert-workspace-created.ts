import * as functions from "firebase-functions";
import { Workspace } from "../../../types/workspace";
import { publishMessage, testPublishMessage } from "../../../services/alert-workspace-service";
import { FirestoreCollections } from "../../../constants/firestore-collections";
import { isProd } from "../../../constants/is-prod";

/**
 * When a Workspace is created, post an alert in Slack.
 */
export const alertWorkspaceCreated = functions.firestore
  .document(`${FirestoreCollections.WORKSPACE}/{workspaceId}`)
  .onCreate((snapshot) => {
    const workspace = snapshot.data() as Workspace;
    const message = `New workspace! ${workspace.name} was created by ${workspace.ownerEmail}.`;
    return isProd ? publishMessage(message) : testPublishMessage(message);
  });
