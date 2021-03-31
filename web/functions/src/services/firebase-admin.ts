import * as admin from "firebase-admin";
import { logger } from "../lib/logger";
import { FirestoreCollections } from "../constants/firestore-collections";
import { Workspace } from "../types/workspace";

const db = admin.firestore();

export async function getUserIdFromIdToken(idToken: string) {
  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    return decodedIdToken.uid;
  } catch (error) {
    logger.prettyPrint(error);
    throw error;
  }
}

export async function getWorkspaceIdByCustomerId(customerId: string) {
  const querySnapshot = await db
    .collection(FirestoreCollections.WORKSPACE)
    .where("customerId", "==", customerId)
    .get();
  // This query should only return one document.
  const [doc] = querySnapshot.docs;
  return doc?.id || null;
}

interface UpdateWorkspaceParams {
  customerId?: string;
  subscriptionId?: string;
  subscriptionTrialEnd: number | null;
  subscriptionStatus?: string;
}
export function updateWorkspace(id: string, params: UpdateWorkspaceParams) {
  return db
    .collection(FirestoreCollections.WORKSPACE)
    .doc(id)
    .set(params, { merge: true });
}

export async function getWorkspace(id: string) {
  const workspaceDoc = await db.collection(FirestoreCollections.WORKSPACE).doc(id).get();
  return workspaceDoc.data() as Workspace | undefined;
}

export async function getWorkspaceUsers(workspaceId: string) {
  const workspaceUsersDoc = await db
    .collection(FirestoreCollections.WORKSPACE_USER)
    .doc(workspaceId)
    .get();
  return workspaceUsersDoc.data();
}
