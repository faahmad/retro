import { Workspace } from "../types/workspace";
import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { useCurrentUser } from "./use-current-user";
import { ActionItemI } from "../types/action-item";
import { getServerTimestamp } from "../utils/firestore-utils";
import { AnalyticsEvent, useAnalyticsEvent } from "./use-analytics-event";

const actionItemCollection = firebase
  .firestore()
  .collection(FirestoreCollections.ACTION_ITEM);

export function useActionItemHelpers() {
  const currentUser = useCurrentUser();
  const trackEvent = useAnalyticsEvent();

  async function createActionItem({
    content,
    workspaceId
  }: {
    content: string;
    workspaceId: Workspace["id"];
  }) {
    if (!currentUser.auth) {
      return;
    }

    const newActionItemRef = actionItemCollection.doc();
    const newActionItemId = newActionItemRef.id;
    const newActionItem: ActionItemI = {
      id: newActionItemId,
      content,
      workspaceId,
      createdAt: getServerTimestamp(),
      createdBy: currentUser.auth.uid,
      status: "open",
      updatedAt: getServerTimestamp()
    };

    await newActionItemRef.set(newActionItem);

    trackEvent(AnalyticsEvent.ACTION_ITEM_CREATED, {
      workspaceId,
      createdBy: currentUser.auth.uid
    });
  }

  return { createActionItem };
}
