import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { getCountKeyByType } from "../utils/workspace-utils";
import { decrement, arrayRemove, deleteValue } from "../utils/firestore-utils";
import { RetroItem } from "../types/retro-item";
import * as Sentry from "@sentry/react";
import { useAnalyticsEvent, AnalyticsEvent } from "../hooks/use-analytics-event";

export function useDeleteRetroItem() {
  const trackEvent = useAnalyticsEvent();
  async function deleteRetroItem(retroItemId: RetroItem["id"]) {
    try {
      await deleteRetroItemTransaction(retroItemId);
      trackEvent(AnalyticsEvent.RETRO_ITEM_DELETED, {
        retroItemId
      });
      return;
    } catch (error) {
      Sentry.captureException(error);
      return;
    }
  }
  return deleteRetroItem;
}

const db = firebase.firestore();
const retroItemCollection = db.collection(FirestoreCollections.RETRO_ITEM);
const retroCollection = db.collection(FirestoreCollections.RETRO);

export function deleteRetroItemTransaction(retroItemId: RetroItem["id"]) {
  return db.runTransaction(async (transaction) => {
    // Get the data needed.
    const retroItemRef = retroItemCollection.doc(retroItemId);
    const retroItemSnapshot = await transaction.get(retroItemRef);
    const retroItem = retroItemSnapshot.data() as RetroItem;
    // Prepare the updates for the retro.
    const countKey = getCountKeyByType(retroItem.type);
    const retroUpdates = {
      retroItemIds: {
        [retroItemId]: deleteValue()
      },
      columns: {
        [retroItem.type]: {
          retroItemIds: arrayRemove(retroItemId)
        }
      },
      retroItemsData: {
        [countKey]: decrement()
      }
    };
    // Remove the retroItem from the retro. For now, items only appear on 1 board.
    const retroId = Object.keys(retroItem.retroIds)[0];
    const retroRef = retroCollection.doc(retroId);
    transaction.set(retroRef, retroUpdates, { merge: true });

    // Remove the retro from the retroId, set the status to "deleted".
    // Keeping the item in the DB for now, evenutally might actually delete it.
    // Will see if there is anything we can learn from the items being deleted.
    const retroItemUpdates = {
      retroIds: {
        [retroId]: deleteValue()
      },
      status: "deleted"
    };
    transaction.set(retroItemRef, retroItemUpdates, { merge: true });
    return;
  });
}
