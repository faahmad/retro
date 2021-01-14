import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { Retro } from "../types/retro";

const db = firebase.firestore();
const retroCollection = db.collection(FirestoreCollections.RETRO);

export function workspaceRetrosListener(
  workspaceId: string,
  onSuccess: (retros: Retro[]) => void
) {
  return retroCollection
    .where("workspaceId", "==", workspaceId)
    .orderBy("createdAt")
    .limitToLast(2)
    .onSnapshot((retroQuerySnapshot) => {
      let retros: Retro[] = [];
      retroQuerySnapshot.forEach((retroDoc) => {
        retros.push(retroDoc.data() as Retro);
      });
      return onSuccess(retros);
    });
}
