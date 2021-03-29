import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { RetroItem } from "../types/retro-item";

const db = firebase.firestore();
const retroItemCollection = db.collection(FirestoreCollections.RETRO_ITEM);

export function updateRetroItem(id: RetroItem["id"], updatedFields: Partial<RetroItem>) {
  return retroItemCollection.doc(id).update(updatedFields);
}
