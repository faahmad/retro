import firebaseAdmin from "../lib/firebase-admin";

export function addWorkspaceToFirestore(params) {
  return firebaseAdmin
    .firestore()
    .collection("workspaces")
    .doc(params.id)
    .set(params);
}
