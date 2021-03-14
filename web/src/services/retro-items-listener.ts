import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { RetroItem, RetroItemsMap } from "../types/retro-item";
import { Retro } from "../types/retro";

const db = firebase.firestore();
const retroItemsCollection = db.collection(FirestoreCollections.RETRO_ITEM);

export function retroItemsListener(
  retroId: Retro["id"],
  onSuccess: (retroItemsMap: { [retroItemId: string]: RetroItem }) => void,
  onError: (error: Error) => void
) {
  return retroItemsCollection
    .where(`retroIds.${retroId}`, "==", retroId)
    .onSnapshot((retroItemsQuerySnapshot) => {
      let retroItemsMap: RetroItemsMap = {};
      retroItemsQuerySnapshot.forEach((retroItemSnapshot) => {
        retroItemsMap[retroItemSnapshot.id] = retroItemSnapshot.data() as RetroItem;
      });
      return onSuccess(retroItemsMap);
    }, onError);
}
