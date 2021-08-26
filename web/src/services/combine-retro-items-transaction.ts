import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { Retro } from "../types/retro";
// import { User } from "../types/user";
// import { Workspace } from "../types/workspace";
import { RetroItem } from "../types/retro-item";
import { RecursivePartial } from "../types/recursive-partial";
import { arrayRemove, decrement } from "../utils/firestore-utils";
import { getCountKeyByType } from "../utils/workspace-utils";
// import { getCountKeyByType } from "../utils/workspace-utils";
// import { getServerTimestamp, increment, arrayUnion } from "../utils/firestore-utils";

const db = firebase.firestore();
const retroCollection = db.collection(FirestoreCollections.RETRO);
const retroItemCollection = db.collection(FirestoreCollections.RETRO_ITEM);

export interface CombineRetroItemsTransactionParams {
  retroId: Retro["id"];
  groupContainerRetroItem: RetroItem;
  groupedRetroItem: RetroItem;
}

export async function combineRetroItemTransaction({
  retroId,
  groupContainerRetroItem,
  groupedRetroItem
}: CombineRetroItemsTransactionParams) {
  return db.runTransaction(async (transaction) => {
    const groupContainerRetroItemRef = retroItemCollection.doc(
      groupContainerRetroItem.id
    );
    const groupedRetroItemRef = retroItemCollection.doc(groupedRetroItem.id);

    transaction.update(groupContainerRetroItemRef, { ...groupContainerRetroItem });
    transaction.update(groupedRetroItemRef, { ...groupedRetroItem });

    const retroRef = retroCollection.doc(retroId);
    const columnKey = groupedRetroItem.type;
    const columnCountKey = getCountKeyByType(columnKey);
    const retroUpdates: RecursivePartial<Retro> = {
      [`columns.${columnKey}.retroItemIds`]: arrayRemove<string>(groupedRetroItem.id),
      [`retroItemsData.${columnCountKey}`]: decrement()
    };
    transaction.update(retroRef, retroUpdates);
    return;
  });
}
