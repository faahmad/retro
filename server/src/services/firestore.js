import firebaseAdmin from "../lib/firebase-admin";

const db = firebaseAdmin.firestore();

export function addWorkspaceToFirestore(params) {
  return db.collection("workspaces").doc(params.id).set(params);
}

export async function getWorkspaceFromFirestore(workspaceId) {
  const workspaceDoc = await db.collection("workspaces").doc(workspaceId).get();
  return workspaceDoc.data();
}

export function addWorkspaceInviteToFirestore(params) {
  return db
    .collection("workspaceInvites")
    .doc(params.workspaceId)
    .set(
      {
        [params.id]: {
          ...params,
          invitedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp()
        }
      },
      { merge: true }
    );
}
