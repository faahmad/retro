import * as React from "react";
import { useCopyActionItems } from "../hooks/use-copy-action-items";
import { ActionItemI } from "../types/action-item";
import { Retro } from "../types/retro";
import { ClipboardCheckIcon } from "@heroicons/react/solid";

export function ButtonCopyActionItems(props: {
  retroId?: Retro["id"];
  actionItems: ActionItemI[];
  title: string;
}) {
  const { handleCopyActionItems, isCopied } = useCopyActionItems(props.retroId);
  return (
    <button
      onClick={() => {
        handleCopyActionItems(props.actionItems, props.title);
      }}
      className="inline-flex items-center bg-blue border border-white text-white text-xs py-1 px-2 shadow shadow-blue focus:outline-none active:transform-1 w-32"
    >
      <ClipboardCheckIcon className="h-4 w-4 mr-1" />
      <span>{isCopied ? "Copied!" : "Copy to clipboard"}</span>
    </button>
  );
}
