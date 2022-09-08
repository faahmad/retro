import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { Retro } from "../types/retro";
import { User } from "../types/user";
import { Workspace } from "../types/workspace";
import { RetroItem } from "../types/retro-item";
import { getCountKeyByType } from "../utils/workspace-utils";
import { getServerTimestamp, increment, arrayUnion } from "../utils/firestore-utils";

const db = firebase.firestore();
const retroItemCollection = db.collection(FirestoreCollections.RETRO_ITEM);
const retroCollection = db.collection(FirestoreCollections.RETRO);

export interface CreateRetroItemTransactionParams {
  userId: User["id"];
  workspaceId: Workspace["id"];
  retroId: Retro["id"];
  content: RetroItem["content"];
  type: RetroItem["type"];
}

export async function createRetroItemTransaction({
  userId,
  workspaceId,
  retroId,
  type,
  content
}: CreateRetroItemTransactionParams) {
  return db.runTransaction(async (transaction) => {
    // Create the retroItem.
    const newRetroItemRef = retroItemCollection.doc();
    const newRetroItemId = newRetroItemRef.id;
    const newRetroItem: RetroItem = {
      id: newRetroItemId,
      type,
      content,
      workspaceId,
      retroIds: {
        [retroId]: retroId
      },
      createdByUserId: userId,
      createdAt: getServerTimestamp(),
      likedBy: {},
      likeCount: 0,
      hasBeenEdited: false
    };
    transaction.set(newRetroItemRef, newRetroItem);

    // Add the retroItem's uid to the retro.
    const retroRef = retroCollection.doc(retroId);
    const countKey = getCountKeyByType(newRetroItem.type);
    const updates = {
      userIds: { [userId]: userId },
      retroItemIds: {
        [newRetroItemId]: newRetroItemId
      },
      columns: {
        [newRetroItem.type]: {
          retroItemIds: arrayUnion(newRetroItemId)
        }
      },
      retroItemsData: {
        [countKey]: increment()
      }
    };
    transaction.set(retroRef, updates, { merge: true });

    // Return the newly created RetroItem.
    return newRetroItem;
  });
}
