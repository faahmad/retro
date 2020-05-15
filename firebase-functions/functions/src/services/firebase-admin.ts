import { firebaseAdmin } from "../lib/firebase-admin";

export async function getUserIdFromIdToken(idToken: string) {
  try {
    const decodedIdToken = await firebaseAdmin.auth().verifyIdToken(idToken);
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
  return firebaseAdmin
    .firestore()
    .collection("workspaces")
    .doc(id)
    .set(params, { merge: true });
}

export async function getWorkspace(id: string) {
  const workspaceDoc = await firebaseAdmin
    .firestore()
    .collection("workspaces")
    .doc(id)
    .get();
  return workspaceDoc.data();
}
