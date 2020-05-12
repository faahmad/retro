import firebaseAdmin from "../lib/firebase-admin";

export function addWorkspaceToFirestore(params) {
  return firebaseAdmin
    .firestore()
    .collection("workspaces")
    .doc(params.id)
    .set(params);
}

export async function getWorkspaceFromFirestore(workspaceId) {
  const workspaceDoc = await firebaseAdmin
    .firestore()
    .collection("workspaces")
    .doc(workspaceId)
    .get();
  return workspaceDoc.data();
}
