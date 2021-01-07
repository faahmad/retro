import * as admin from "firebase-admin";
import { FirestoreCollections } from "../constants/firestore-collections";

const db = admin.firestore();

export async function getUserIdFromIdToken(idToken: string) {
  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    return decodedIdToken.uid;
  } catch (error) {
    throw new Error("Invalid Id token.");
  }
}

interface UpdateWorkspaceParams {
  customerId?: string;
  subscriptionId?: string;
}
export function updateWorkspace(id: string, params: UpdateWorkspaceParams) {
  return db
    .collection(FirestoreCollections.WORKSPACE)
    .doc(id)
    .set(params, { merge: true });
}

export async function getWorkspace(id: string) {
  const workspaceDoc = await db.collection(FirestoreCollections.WORKSPACE).doc(id).get();
  return workspaceDoc.data();
}

export async function getWorkspaceUsers(workspaceId: string) {
  const workspaceUsersDoc = await db
    .collection(FirestoreCollections.WORKSPACE_USER)
    .doc(workspaceId)
    .get();
  return workspaceUsersDoc.data();
}
