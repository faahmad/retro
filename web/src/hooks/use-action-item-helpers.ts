import * as React from "react";
import { Workspace } from "../types/workspace";
import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { useCurrentUser } from "./use-current-user";
import { ActionItemI } from "../types/action-item";
import { getServerTimestamp } from "../utils/firestore-utils";
import { AnalyticsEvent, useAnalyticsEvent } from "./use-analytics-event";
import { Retro } from "../types/retro";

const actionItemCollection = firebase
  .firestore()
  .collection(FirestoreCollections.ACTION_ITEM);

export function useActionItemHelpers(workspaceId: Workspace["id"]) {
  const [actionItems, setActionItems] = React.useState<ActionItemI[]>([]);
  React.useEffect(() => {
    return actionItemCollection
      .where("workspaceId", "==", workspaceId)
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        let items: any = [];
        snapshot.forEach((doc) => {
          items.push(doc.data());
        });
        setActionItems(items);
      });
  }, [workspaceId]);

  const currentUser = useCurrentUser();
  const trackEvent = useAnalyticsEvent();

  async function createActionItem({
    content,
    workspaceId,
    retroId
  }: {
    content: string;
    workspaceId: Workspace["id"];
    retroId: Retro["id"];
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
      retroId,
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

  function updateActionItem(
    actionItemId: ActionItemI["id"],
    updatedFields: Partial<ActionItemI>
  ) {
    return actionItemCollection.doc(actionItemId).update(updatedFields);
  }

  async function toggleActionItemStatus(
    actionItemId: ActionItemI["id"],
    currentStatus: ActionItemI["status"]
  ) {
    const nextStatus = currentStatus === "open" ? "complete" : "open";
    await updateActionItem(actionItemId, { status: nextStatus });
    // TODO: Track analytics
    return;
  }

  return { actionItems, createActionItem, toggleActionItemStatus };
}
