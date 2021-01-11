import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { Workspace } from "../types/workspace";

const db = firebase.firestore();
const workspaceCollection = db.collection(FirestoreCollections.WORKSPACE);

export function workspaceListener(
  workspaceId: string,
  onSuccess: (workspace: Workspace) => void
) {
  return workspaceCollection
    .doc(workspaceId)
    .onSnapshot((workspaceSnapshot) =>
      onSuccess({ id: workspaceSnapshot.id, ...workspaceSnapshot.data() } as Workspace)
    );
}
