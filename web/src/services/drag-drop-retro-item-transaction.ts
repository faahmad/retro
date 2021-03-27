import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { Retro } from "../types/retro";
import { RetroItem } from "../types/retro-item";
import { RetroColumnType, RetroColumn } from "../types/retro-column";
import { getCountKeyByType } from "../utils/workspace-utils";
import { decrement, increment } from "../utils/firestore-utils";
import { RecursivePartial } from "../types/recursive-partial";

const db = firebase.firestore();
const retroCollection = db.collection(FirestoreCollections.RETRO);
const retroItemCollection = db.collection(FirestoreCollections.RETRO_ITEM);

export interface DragDropRetroItemTransactionParams {
  retroId: Retro["id"];
  retroItemId: RetroItem["id"];
  prevColumnType: RetroColumnType;
  prevColumn: RetroColumn;
  nextColumnType?: RetroColumnType;
  nextColumn?: RetroColumn;
}

export function dragDropRetroItemTransaction(params: DragDropRetroItemTransactionParams) {
  return db.runTransaction(async (transaction) => {
    // Update the type of the retroItem.
    const retroItemRef = retroItemCollection.doc(params.retroItemId);
    // If the nextColumnType doesn't exist, it means
    // we are moving in the same column.
    const updatedType = params.nextColumnType || params.prevColumnType;
    transaction.update(retroItemRef, {
      type: updatedType
    });
    // Update the columns on the board.
    const retroRef = retroCollection.doc(params.retroId);
    let retroUpdates: RecursivePartial<Retro> = {
      columns: {
        [params.prevColumnType as RetroColumnType]: params.prevColumn
      }
    };
    // If the nextColumnType && nextColumn exist,
    // it means that the item was moved between columns.
    if (params.nextColumnType && params.nextColumn) {
      // Update the column.
      // @ts-ignore
      retroUpdates.columns[params.nextColumnType] = params.nextColumn;
      // Update the counts.
      const prevColumnCountKey = getCountKeyByType(params.prevColumnType);
      const nextColumnCountKey = getCountKeyByType(params.nextColumnType);
      retroUpdates.retroItemsData = {
        [prevColumnCountKey]: decrement(),
        [nextColumnCountKey]: increment()
      };
    }
    transaction.set(retroRef, retroUpdates, { merge: true });
    return params.retroItemId;
  });
}
