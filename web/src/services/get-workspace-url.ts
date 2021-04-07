import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { WorkspaceUrl } from "../types/workspace-url";

const db = firebase.firestore();
const workspaceURLCollection = db.collection(FirestoreCollections.WORKSPACE_URL);

export async function getWorkspaceURL(url: string) {
  const workspaceURLSnapshot = await workspaceURLCollection.doc(url).get();
  if (!workspaceURLSnapshot.exists) {
    throw new Error("Couldn't find the page you were looking for!");
  }
  return workspaceURLSnapshot.data() as WorkspaceUrl;
}
