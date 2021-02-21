import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { Retro } from "../types/retro";

const db = firebase.firestore();
const retroCollection = db.collection(FirestoreCollections.RETRO);

export function updateRetro(id: Retro["id"], updatedFields: Partial<Retro>) {
  return retroCollection.doc(id).update(updatedFields);
}
