import { ActionItemI } from "../types/action-item";
import { Retro } from "../types/retro";
import * as React from "react";

// Constants
const newEmoji = ":new:";

export function useCopyActionItems(retroId?: Retro["id"]) {
  const [isCopied, setIsCopied] = React.useState(false);

  async function handleCopyActionItems(actionItems: ActionItemI[], listTitle: string) {
    let text = listTitle + "\n";
    for (const item of actionItems) {
      const isNew = item.retroId === retroId;
      text += `- ${item.content} ${isNew ? newEmoji : ""} \n`;
    }

    await navigator.clipboard.writeText(text);

    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

  return { isCopied, handleCopyActionItems };
}
