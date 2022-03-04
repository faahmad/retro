import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Retro } from "../types/retro";
import { publishMessage, testPublishMessage } from "../services/alert-workspace-service";
import { FirestoreCollections } from "../constants/firestore-collections";
import { isProd } from "../constants/is-prod";

/**
 * When a Retro is created, post an alert in Discord.
 */
export const alertRetroCreated = functions.firestore
  .document(`${FirestoreCollections.RETRO}/{retroId}`)
  .onCreate(async (snapshot) => {
    const retro = snapshot.data() as Retro;
    const workspaceSnapshot = await admin
      .firestore()
      .collection(FirestoreCollections.WORKSPACE)
      .doc(retro.workspaceId)
      .get();
    const workspace = workspaceSnapshot.data();
    const message = `Retro #${retro.id} created in workspace ${workspace?.name}`;
    return isProd ? publishMessage(message) : testPublishMessage(message);
  });
