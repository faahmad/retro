import firebase from "firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { Retro } from "../types/retro";

const db = firebase.firestore();
const retroCollection = db.collection(FirestoreCollections.RETRO);

export function retroListener(
  retroId: Retro["id"],
  onSuccess: (retro: Retro) => void,
  onError?: (error: Error) => void
) {
  return retroCollection.doc(retroId).onSnapshot((retroSnapshot) => {
    return onSuccess(retroSnapshot.data() as Retro);
  }, onError);
}
