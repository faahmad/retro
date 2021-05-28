import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { Workspace } from "../types/workspace";

const db = firebase.firestore();
const workspaceCollection = db.collection(FirestoreCollections.WORKSPACE);

export function updateWorkspace(id: Workspace["id"], updatedFields: Partial<Workspace>) {
  return workspaceCollection.doc(id).update(updatedFields);
}
