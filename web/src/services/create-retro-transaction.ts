import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { Retro } from "../types/retro";

const db = firebase.firestore();
const retroCollection = db.collection(FirestoreCollections.RETRO);
// const workspaceCollection = db.collection(FirestoreCollections.WORKSPACE);

export interface CreateRetroTransactionParams {
  userId: string;
  workspaceId: string;
}

export function createWorkspaceTransaction({
  userId,
  workspaceId
}: CreateRetroTransactionParams) {
  return db.runTransaction(async (transaction) => {
    // Create the new retro.
    const newRetroRef = retroCollection.doc();
    const newRetroData: Retro = {
      id: newRetroRef.id,
      workspaceId: workspaceId,
      createdById: userId,
      name: "New Retro",
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      userIds: {
        [userId]: userId
      },
      retroItemsData: {
        goodCount: 0,
        badCount: 0,
        actionsCount: 0,
        questionsCount: 0
      }
    };
    await newRetroRef.set(newRetroData);

    // Add the retro to the workspace's recent retros.
    // workspace;
  });
}
