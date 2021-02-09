import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { Retro } from "../types/retro";

const db = firebase.firestore();
const retroCollection = db.collection(FirestoreCollections.RETRO);

export async function getWorkspaceRetros({
  workspaceId,
  lastVisibleRetroId,
  limit = 10
}: {
  workspaceId: string;
  limit?: number;
  lastVisibleRetroId?: string;
}) {
  let query = retroCollection
    .where("workspaceId", "==", workspaceId)
    .orderBy("createdAt", "asc")
    .limit(limit);

  if (lastVisibleRetroId) {
    query = query.startAfter(lastVisibleRetroId);
  }

  let retros: Retro[] = [];
  const documentSnapshots = await query.get();
  documentSnapshots.forEach((document) => {
    retros.push(document.data() as Retro);
  });

  return retros.reverse();
}
