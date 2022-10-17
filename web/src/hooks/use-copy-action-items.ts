import { ActionItemI } from "../types/action-item";
import { Retro } from "../types/retro";
import * as React from "react";
import { useAnalyticsEvent, AnalyticsEvent } from "./use-analytics-event";

// Constants
const newEmoji = ":new:";

export function useCopyActionItems(retroId?: Retro["id"]) {
  const [isCopied, setIsCopied] = React.useState(false);
  const trackEvent = useAnalyticsEvent();

  async function handleCopyActionItems(actionItems: ActionItemI[], listTitle: string) {
    let text = listTitle + "\n";
    for (const item of actionItems) {
      const isNew = item.retroId === retroId;
      text += `- ${item.content} ${isNew ? newEmoji : ""} \n`;
    }

    await navigator.clipboard.writeText(text);

    trackEvent(AnalyticsEvent.ACTION_ITEMS_COPIED, {
      count: actionItems.length
    });

    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

  return { isCopied, handleCopyActionItems };
}
