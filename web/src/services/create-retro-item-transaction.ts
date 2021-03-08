import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { Retro } from "../types/retro";
import { User } from "../types/user";
import { Workspace } from "../types/workspace";
import { RetroItem } from "../types/retro-item";
import { getCountKeyByType } from "../utils/workspace-utils";
import { getServerTimestamp, increment } from "../utils/firestore-utils";

const db = firebase.firestore();
const retroItemCollection = db.collection(FirestoreCollections.RETRO_ITEM);
const retroItemRetroCollection = db.collection(FirestoreCollections.RETRO_ITEM_RETRO);
const workspaceCollection = db.collection(FirestoreCollections.WORKSPACE);

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
      createdByUserId: userId,
      createdAt: getServerTimestamp(),
      likedBy: {},
      likeCount: 0,
      hasBeenEdited: false
    };
    transaction.set(newRetroItemRef, newRetroItem);

    // Create a composite document for a RetroItem Retro.
    const retroItemRetroRef = retroItemRetroCollection.doc(
      `${newRetroItemId}_${retroId}`
    );
    transaction.set(retroItemRetroRef, {
      workspaceId,
      retroId,
      retroItemId: newRetroItemId,
      recordCreatedAt: getServerTimestamp()
    });

    // Update the count of the workspace's retroItemData.
    const workspaceRef = workspaceCollection.doc(workspaceId);
    const countKey = getCountKeyByType(type);
    transaction.update(workspaceRef, {
      [`retroItemsData.${countKey}`]: increment()
    });
  });
}
