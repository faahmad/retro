import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";

const db = firebase.firestore();

export async function getWorkspace(id: string) {
  const workspaceSnapshot = await db
    .collection(FirestoreCollections.WORKSPACES)
    .doc(id)
    .get();
  return workspaceSnapshot.data();
}
